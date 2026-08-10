import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";
import { createOAuthCallbackHandler } from "./kimi/auth";
import { Paths } from "@contracts/constants";

const app = new Hono<{ Bindings: HttpBindings }>();

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));
app.get(Paths.oauthCallback, createOAuthCallbackHandler());
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

  serveStaticFiles(app);

  const port = parseInt(process.env.PORT || "3000");
  serve({ fetch: app.fetch, port, hostname: "0.0.0.0" }, () => {
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
    } catch (err) {
      console.warn("[db] schema sync skipped:", (err as Error).message);
    }
  })();
}
