// Post-build prerender: renders public routes to static HTML with
// route-specific head metadata (audit P0-3) and injects them into
// dist/public so crawlers get meaningful HTML before JavaScript (P0-4).
// Also emits 404.html (true-404 template) and the www sitemap.xml (P0-2).
import fs from "fs";
import path from "path";
const bundlePath = process.env.PRERENDER_BUNDLE || new URL("../dist-prerender/prerender.mjs", import.meta.url).pathname;
const { render, products, guides, seoForPath, INDEXABLE_PATHS, notFoundSeo } = await import(bundlePath);

const dist = path.resolve(import.meta.dirname, "../dist/public");
const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const ROOT = '<div id="root"></div>';
if (!template.includes(ROOT)) {
  console.error("prerender: root div not found, skipping");
  process.exit(0);
}

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const jsonLd = (obj) => JSON.stringify(obj).replace(/</g, "\\u003c");

/** Replaces the template head's metadata with route-specific values. */
function applySeo(html, seo) {
  let out = html;
  out = out.replace(/<title>.*?<\/title>/s, `<title>${esc(seo.title)}</title>`);
  out = out.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${esc(seo.description)}" />`,
  );
  out = out.replace(
    /<meta name="robots" content="[^"]*" \/>/,
    `<meta name="robots" content="${esc(seo.robots)}" />`,
  );
  out = out.replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${esc(seo.canonical)}" />`,
  );
  out = out.replace(
    /<meta property="og:type" content="[^"]*" \/>/,
    `<meta property="og:type" content="${seo.ogType}" />`,
  );
  out = out.replace(
    /<meta property="og:title" content="[^"]*" \/>/,
    `<meta property="og:title" content="${esc(seo.title)}" />`,
  );
  out = out.replace(
    /<meta property="og:description" content="[^"]*" \/>/,
    `<meta property="og:description" content="${esc(seo.description)}" />`,
  );
  out = out.replace(
    /<meta property="og:url" content="[^"]*" \/>/,
    `<meta property="og:url" content="${esc(seo.canonical)}" />`,
  );
  out = out.replace(
    /<meta property="og:image" content="[^"]*" \/>/,
    `<meta property="og:image" content="${esc(seo.ogImage)}" />`,
  );
  out = out.replace(
    /<meta name="twitter:title" content="[^"]*" \/>/,
    `<meta name="twitter:title" content="${esc(seo.title)}" />`,
  );
  out = out.replace(
    /<meta name="twitter:description" content="[^"]*" \/>/,
    `<meta name="twitter:description" content="${esc(seo.description)}" />`,
  );
  out = out.replace(
    /<meta name="twitter:image" content="[^"]*" \/>/,
    `<meta name="twitter:image" content="${esc(seo.ogImage)}" />`,
  );
  // Drop the template's homepage JSON-LD, then emit the route's own schema.
  out = out.replace(/\s*<script type="application\/ld\+json">.*?<\/script>/gs, "");
  if (seo.jsonLd?.length) {
    const blocks = seo.jsonLd
      .map((j) => `    <script type="application/ld+json">${jsonLd(j)}</script>`)
      .join("\n");
    out = out.replace("</head>", `${blocks}\n  </head>`);
  }
  return out;
}

// Every route the SPA serves publicly. /category/* is intentionally absent:
// legacy category URLs 301 to /shop at the server (audit §8). /checkout is
// served as a noindex shell by the server — with an empty SSR cart it only
// redirects to /cart, so there is no useful content to prerender.
const staticRoutes = [
  "/", "/shop", "/quality", "/faq", "/about", "/shipping", "/legal",
  "/terms", "/privacy", "/data-retention", "/contact", "/cart",
  "/guides", "/login",
];
const routes = [
  ...staticRoutes,
  ...products.map((p) => `/product/${p.slug}`),
  ...guides.map((g) => `/guides/${g.slug}`),
];

let ok = 0;
const failures = [];
for (const route of routes) {
  try {
    const appHtml = await render(route);
    const html = applySeo(template.replace(ROOT, `<div id="root">${appHtml}</div>`), seoForPath(route));
    const outDir = route === "/" ? dist : path.join(dist, route.slice(1));
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, "index.html"), html);
    ok++;
  } catch (e) {
    failures.push(`${route}: ${e.message}`);
  }
}
if (failures.length) {
  // Keep going: an unprerendered route still works client-side; a hard fail
  // here would drop prerendering for every route via the build fallback.
  console.warn(`prerender: ${failures.length} route(s) failed:\n  ${failures.join("\n  ")}`);
}
console.log(`prerender: ${ok}/${routes.length} routes rendered`);

// True-404 template: rendered NotFound page with noindex, served with HTTP 404.
try {
  const appHtml = await render("/this-page-does-not-exist");
  const html = applySeo(template.replace(ROOT, `<div id="root">${appHtml}</div>`), notFoundSeo);
  fs.writeFileSync(path.join(dist, "404.html"), html);
  console.log("prerender: 404.html written");
} catch (e) {
  console.error(`prerender: 404.html failed: ${e.message}`);
  process.exit(1);
}

// Admin shell: no prerendered storefront markup (clean client hydration) and
// a noindex,nofollow robots directive in the initial HTML (audit §8).
// Checkout gets the same treatment with noindex,follow.
const makeShell = (title, robots) =>
  template
    .replace(/<title>.*?<\/title>/s, `<title>${esc(title)}</title>`)
    .replace(/<meta name="robots" content="[^"]*" \/>/, `<meta name="robots" content="${robots}" />`);
fs.writeFileSync(path.join(dist, "admin-shell.html"), makeShell("Admin | Noxptide", "noindex, nofollow"));
fs.writeFileSync(path.join(dist, "checkout-shell.html"), makeShell("Secure Checkout | Noxptide", "noindex, follow"));
console.log("prerender: admin-shell.html + checkout-shell.html written");

// Sitemap: only canonical, indexable www URLs (audit P0-2, launch checklist).
const lastmod = new Date().toISOString().slice(0, 10);
const priority = (p) =>
  p === "/" ? "1.0" : p.startsWith("/product/") ? "0.9" : p.startsWith("/guides/") ? "0.8" : "0.7";
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${INDEXABLE_PATHS.map(
  (p) =>
    `  <url><loc>https://www.noxptide.co.uk${p === "/" ? "/" : p}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>${priority(p)}</priority></url>`,
).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap);
console.log(`prerender: sitemap.xml written (${INDEXABLE_PATHS.length} URLs, lastmod ${lastmod})`);
