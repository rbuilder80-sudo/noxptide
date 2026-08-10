// Union CSS purge + inline: one purge against all prerendered HTML + client
// JS + sources, then the result is inlined into every prerendered page
// (no render-blocking stylesheet request anywhere).
import fs from "fs";
import path from "path";
import { PurgeCSS } from "purgecss";

const dist = path.resolve(import.meta.dirname, "../dist/public");
const rootHtml = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const m = rootHtml.match(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/);
if (!m) {
  console.log("purge-inline: no stylesheet link, skipping");
  process.exit(0);
}
const cssPath = path.join(dist, m[1]);

const extractor = (content) => content.match(/[^\s"'`=<>\\]+(?<!:)/g) || [];
const safelist = {
  standard: ["in-view", "dark", "html", "body"],
  greedy: [/reveal/, /^animate-/, /^glass/, /^sr-only/, /^data-/, /^aria-/],
};

const htmlFiles = [];
const walk = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === "index.html" || e.name === "404.html") htmlFiles.push(p);
  }
};
walk(dist);

const listFiles = (dir, re) => {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  const w = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) w(p);
      else if (re.test(e.name)) out.push(p);
    }
  };
  w(dir);
  return out;
};
const jsFiles = listFiles(path.join(dist, "assets"), /\.js$/);
const srcFiles = ["src/pages", "src/components", "src/hooks", "src/context", "src/providers"]
  .flatMap((d) => listFiles(path.resolve(import.meta.dirname, "../", d), /\.(tsx?|jsx?)$/));

// Precompute class tokens from client JS + sources once (small memory footprint).
// Admin chunks/classes only go into the root page (SPA fallback that also renders
// /admin); prerendered storefront pages only need storefront tokens.
const isAdmin = (f) => /Admin/i.test(path.basename(f)) || /pages[\/]admin/i.test(f);
const storefrontTokens = new Set();
const adminTokens = new Set();
for (const f of [...jsFiles, ...srcFiles]) {
  // Only shared components contribute dynamic classes on prerendered pages
  // (each page's own markup is fully present in its prerendered HTML).
  if (!/src[\/](hooks|context|providers)[\/]/.test(f) && !/src[\/]components[\/][^\/]+$/.test(f) && !/useAuth/.test(f)) continue;
  const target = isAdmin(f) ? adminTokens : storefrontTokens;
  for (const t of extractor(fs.readFileSync(f, "utf8"))) target.add(t);
}
for (const f of jsFiles) {
  // Admin lazy chunks only matter for the SPA fallback (root)
  if (!/Admin/i.test(path.basename(f))) continue;
  for (const t of extractor(fs.readFileSync(f, "utf8"))) adminTokens.add(t);
}
const storefrontRaw = [...storefrontTokens].join(" ");
const allRaw = [...storefrontTokens, ...adminTokens].join(" ");

let done = 0;
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const link = html.match(/<link[^>]*rel="stylesheet"[^>]*>/);
  if (!link) continue;
  const isRoot = file === path.join(dist, "index.html");
  const [result] = await new PurgeCSS().purge({
    content: [
      { raw: html, extension: "html" },
      { raw: isRoot ? allRaw : storefrontRaw, extension: "html" },
    ],
    css: [cssPath],
    defaultExtractor: extractor,
    safelist,
    fontFace: true,
    keyframes: true,
    variables: true,
  });
  let out = html.replace(link[0], `<style data-inlined>${result.css}</style>`);
  if (file === path.join(dist, "index.html")) {
    // Hero image is a CSS background (desktop-only column) — preload on large screens only
    out = out.replace(
      "</head>",
      `<link rel="preload" as="image" href="/images/hero-vials.webp" media="(min-width: 1024px)">\n</head>`,
    );
  }
  fs.writeFileSync(file, out);
  done++;
  globalThis.gc?.();
  if (isRoot) {
    console.log(`purge-inline: home css ${(result.css.length / 1024).toFixed(1)}KB`);
  }
}
console.log(`purge-inline: ${done} pages inlined`);

// Pre-compress every text asset with brotli (served via .br sidecar files).
// The server prefers these when the client accepts br — ~15-20% smaller than gzip.
{
  const { brotliCompressSync, constants } = await import("node:zlib");
  const TEXT = /\.(html|css|js|mjs|svg|xml|txt|json|webmanifest)$/;
  const stack = [dist];
  let n = 0, saved = 0;
  while (stack.length) {
    const dir = stack.pop();
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const f = path.join(dir, e.name);
      if (e.isDirectory()) { stack.push(f); continue; }
      if (!TEXT.test(e.name)) continue;
      const buf = fs.readFileSync(f);
      if (buf.length < 1024) continue;
      const br = brotliCompressSync(buf, {
        params: { [constants.BROTLI_PARAM_QUALITY]: 11 },
      });
      fs.writeFileSync(f + ".br", br);
      n++; saved += buf.length - br.length;
    }
  }
  console.log(`brotli: ${n} files pre-compressed, saved ${(saved / 1024).toFixed(0)}KB raw`);
}
