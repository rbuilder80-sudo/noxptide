import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { compress } from "hono/compress";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";
import { createOAuthCallbackHandler } from "./kimi/auth";
import { Paths } from "@contracts/constants";

const app = new Hono<{ Bindings: HttpBindings }>();

app.use(compress());
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

  // Serve pre-compressed .br sidecars (built by purge-inline.mjs) when the
  // client accepts brotli — skips on-the-fly gzip for text assets entirely.
  {
    const { existsSync } = await import("node:fs");
    const { readFile } = await import("node:fs/promises");
    const mime: Record<string, string> = {
      ".html": "text/html; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".js": "text/javascript; charset=utf-8",
      ".mjs": "text/javascript; charset=utf-8",
      ".svg": "image/svg+xml",
      ".xml": "application/xml; charset=utf-8",
      ".txt": "text/plain; charset=utf-8",
      ".json": "application/json",
      ".webmanifest": "application/manifest+json",
    };
    const root = "./dist/public";
    app.use("*", async (c, next) => {
      if (!(c.req.header("accept-encoding") ?? "").includes("br")) return next();
      let p = decodeURIComponent(c.req.path);
      if (p.endsWith("/")) p += "index.html";
      else if (!/\.[a-z0-9]+$/i.test(p)) p += "/index.html";
      const ext = p.match(/\.[a-z0-9]+$/i)?.[0]?.toLowerCase() ?? "";
      // Brotli only for HTML: it transfers ~25% smaller (FCP win) and decodes
      // fast. JS/CSS stay gzip — brotli decode cost on slow mobile CPUs
      // measurably delays LCP paint under Lighthouse's 4x CPU emulation.
      if (ext !== ".html") return next();
      const type = mime[ext];
      if (!type) return next();
      const file = `${root}${p}`;
      if (!existsSync(`${file}.br`)) return next();
      const body = await readFile(`${file}.br`);
      c.header("Content-Type", type);
      c.header("Content-Encoding", "br");
      c.header("Vary", "Accept-Encoding");
      return c.body(body);
    });
  }

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
    } catch (err) {
      console.warn("[db] schema sync skipped:", (err as Error).message);
    }
  })();
}
