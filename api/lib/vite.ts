import type { Context, Hono } from "hono";
import type { HttpBindings } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import fs from "fs";
import path from "path";

type App = Hono<{ Bindings: HttpBindings }>;

export function serveStaticFiles(app: App) {
  const distPath = path.resolve(import.meta.dirname, "../dist/public");

  app.use("*", serveStatic({ root: "./dist/public" }));

  // Admin + checkout are client-rendered SPA areas that must never index:
  // serve the prerender-free shells with robots headers (audit §8).
  const shellHandler = (file: string, robots: string) => {
    const shellPath = path.resolve(distPath, file);
    return (c: Context) => {
      c.header("X-Robots-Tag", robots);
      if (fs.existsSync(shellPath)) {
        return c.html(fs.readFileSync(shellPath, "utf-8"));
      }
      return c.html(fs.readFileSync(path.resolve(distPath, "index.html"), "utf-8"));
    };
  };
  app.get("/admin", shellHandler("admin-shell.html", "noindex, nofollow"));
  app.get("/admin/*", shellHandler("admin-shell.html", "noindex, nofollow"));
  app.get("/checkout", shellHandler("checkout-shell.html", "noindex, follow"));

  // Unknown/deleted URLs must return a genuine 404 with a useful HTML page —
  // never the SPA homepage with a 200 (audit: required HTTP contract).
  app.notFound((c) => {
    const accept = c.req.header("accept") ?? "";
    c.header("X-Robots-Tag", "noindex, follow");
    if (!accept.includes("text/html")) {
      return c.json({ error: "Not Found" }, 404);
    }
    const notFoundPath = path.resolve(distPath, "404.html");
    if (fs.existsSync(notFoundPath)) {
      return c.html(fs.readFileSync(notFoundPath, "utf-8"), 404);
    }
    return c.html("<h1>404 — Page Not Found</h1>", 404);
  });
}
