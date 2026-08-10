// Post-build prerender: renders public routes to static HTML and injects
// them into dist/public so first paint doesn't wait for JS.
import fs from "fs";
import path from "path";
const bundlePath = process.env.PRERENDER_BUNDLE || new URL("../dist-prerender/prerender.mjs", import.meta.url).pathname;
const { render, products, categories, guides } = await import(bundlePath);

const dist = path.resolve(import.meta.dirname, "../dist/public");
const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const ROOT = '<div id="root"></div>';
if (!template.includes(ROOT)) {
  console.error("prerender: root div not found, skipping");
  process.exit(0);
}

const staticRoutes = [
  "/", "/shop", "/quality", "/faq", "/about", "/shipping", "/legal",
  "/terms", "/privacy", "/data-retention", "/contact", "/cart", "/checkout",
  "/guides", "/login",
];
const routes = [
  ...staticRoutes,
  ...products.map((p) => `/product/${p.slug}`),
  ...categories.map((c) => `/category/${c.slug}`),
  ...guides.map((g) => `/guides/${g.slug}`),
];

let ok = 0;
for (const route of routes) {
  try {
    const appHtml = render(route);
    const html = template.replace(ROOT, `<div id="root">${appHtml}</div>`);
    const outDir = route === "/" ? dist : path.join(dist, route.slice(1));
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, "index.html"), html);
    ok++;
  } catch (e) {
    console.warn(`prerender: ${route} failed: ${e.message}`);
  }
}
console.log(`prerender: ${ok}/${routes.length} routes rendered`);
