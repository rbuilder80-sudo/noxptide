import type { Context, Hono } from "hono";
import type { HttpBindings } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import fs from "fs";
import path from "path";

type App = Hono<{ Bindings: HttpBindings }>;

export function serveStaticFiles(app: App) {
  const distPath = path.resolve(import.meta.dirname, "../dist/public");

  app.use("*", serveStatic({ root: "./dist/public" }));

  // Admin is a client-rendered SPA area and must never index: serve the
  // prerender-free shell with a noindex,nofollow header (audit §8).
  const adminShellPath = path.resolve(distPath, "admin-shell.html");
  const adminHandler = (c: Context) => {
    c.header("X-Robots-Tag", "noindex, nofollow");
    if (fs.existsSync(adminShellPath)) {
      return c.html(fs.readFileSync(adminShellPath, "utf-8"));
    }
    return c.html(fs.readFileSync(path.resolve(distPath, "index.html"), "utf-8"));
  };
  app.get("/admin", adminHandler);
  app.get("/admin/*", adminHandler);

  // Unknown/deleted URLs must return a genuine 404 with a useful HTML page —
  // never the SPA homepage with a 200 (audit: required HTTP contract).
  app.notFound((c) => {
    const accept = c.req.header("accept") ?? "";
    if (!accept.includes("text/html")) {
      return c.json({ error: "Not Found" }, 404);
    }
    const notFoundPath = path.resolve(distPath, "404.html");
    c.header("X-Robots-Tag", "noindex, follow");
    if (fs.existsSync(notFoundPath)) {
      return c.html(fs.readFileSync(notFoundPath, "utf-8"), 404);
    }
    return c.html("<h1>404 — Page Not Found</h1>", 404);
  });
}
