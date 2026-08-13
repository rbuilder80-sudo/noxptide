import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { compress } from "hono/compress";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";
import { createOAuthCallbackHandler, createOAuthLoginHandler } from "./kimi/auth";
import { processWallidWebhookEvents } from "./orders-router";
import { parseWallidWebhook, verifyWallidWebhook } from "./lib/wallid";
import { Paths } from "@contracts/constants";

const app = new Hono<{ Bindings: HttpBindings }>();

app.use(compress());
app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));
app.get(Paths.oauthLogin, createOAuthLoginHandler());
app.get(Paths.oauthCallback, createOAuthCallbackHandler());
app.post("/api/wallid/webhook", async (c) => {
  const rawBody = await c.req.text();
  const valid = verifyWallidWebhook(
    rawBody,
    c.req.header("X-Webhook-Timestamp"),
    c.req.header("X-Webhook-Signature"),
  );
  if (!valid) return c.json({ error: "Invalid webhook signature" }, 400);

  try {
    const events = parseWallidWebhook(rawBody);
    const processed = await processWallidWebhookEvents(events);
    return c.json({ received: events.length, processed });
  } catch (error) {
    console.error("[wallid] webhook processing failed:", error);
    return c.json({ error: "Webhook processing failed" }, 500);
  }
});
app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});
app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

export default app;

if (env.isProduction) {
  const { serve } = await import("@hono/node-server");
  const { serveStaticFiles } = await import("./lib/vite");

  // Long-lived caching for static assets — critical for page speed.
  app.use("*", async (c, next) => {
    await next();
    const p = c.req.path;
    if (c.res.headers.get("Cache-Control")) return;
    if (p.startsWith("/assets/")) {
      // Vite content-hashed bundles — safe to cache forever
      c.res.headers.set("Cache-Control", "public, max-age=31536000, immutable");
    } else if (/\.woff2?$/.test(p)) {
      // Self-hosted font files are stable — cache for a year
      c.res.headers.set("Cache-Control", "public, max-age=31536000, immutable");
    } else if (/\.(webp|avif|png|jpe?g|svg|mp4)$/.test(p)) {
      // Images, fonts, media — cache a week, revalidate in background
      c.res.headers.set("Cache-Control", "public, max-age=2592000, stale-while-revalidate=604800");
    } else if (p === "/sitemap.xml" || p === "/robots.txt" || p === "/llms.txt") {
      c.res.headers.set("Cache-Control", "public, max-age=3600");
    } else {
      c.res.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
    }
  });

  // Canonical host + legacy route redirects (audit P0-2, §8):
  // apex -> www in one permanent, path-preserving hop; legacy category
  // URLs permanently redirect to the catalogue hub.
  app.use("*", async (c, next) => {
    const host = (c.req.header("host") ?? "").split(":")[0];
    if (host === "noxptide.co.uk") {
      const url = new URL(c.req.url);
      c.header("Cache-Control", "public, max-age=86400");
      return c.redirect(`https://www.noxptide.co.uk${url.pathname}${url.search}`, 301);
    }
    if (c.req.path.startsWith("/category/")) {
      c.header("Cache-Control", "public, max-age=86400");
      return c.redirect("/shop", 301);
    }
    await next();
  });

  serveStaticFiles(app);

  const port = parseInt(process.env.PORT || "3000");  serve({ fetch: app.fetch, port, hostname: "0.0.0.0" }, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });

  // Sync the database schema in the background AFTER the server is listening,
  // so a slow/unreachable database can never block the site from loading.
  void (async () => {
    try {
      const { migrate } = await import("drizzle-orm/mysql2/migrator");
      const { getDb } = await import("./queries/connection");
      await migrate(getDb(), { migrationsFolder: "./db/migrations" });
      console.log("[db] schema synced");

      // First-run seed: populate stock/pricing rows from the static catalogue
      // so the admin panel opens with the full inventory editable. Existing
      // rows (admin edits) are never touched.
      const { productVariants } = await import("@db/schema");
      const { products } = await import("../src/data/products");
      const db = getDb();
      const existing = await db
        .select({ id: productVariants.id })
        .from(productVariants)
        .limit(1);
      if (existing.length === 0) {
        let count = 0;
        for (const p of products) {
          for (const s of p.sizes) {
            await db
              .insert(productVariants)
              .values({
                productSlug: p.slug,
                sizeLabel: s.label,
                pricePence: Math.round(s.price * 100),
                stock: 100,
                updatedBy: "seed",
              })
              .onDuplicateKeyUpdate({ set: { productSlug: p.slug } });
            count++;
          }
        }
        console.log(`[db] seeded ${count} product variants`);
      }
    } catch (err) {
      console.warn("[db] schema sync skipped:", (err as Error).message);
    }
    // Idempotent guard independent of the drizzle journal (prod DB was
    // partially managed via db:push, so the migrator can stop early).
    try {
      const { ensureSalesBackendSchema } = await import("./lib/ensure-schema");
      await ensureSalesBackendSchema();
    } catch (err) {
      console.warn("[db] ensure-schema skipped:", (err as Error).message);
    }
  })();
}
