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
  standard: [
    "in-view", "dark", "html", "body",
    /^sm:/, /^md:/, /^lg:/, /^xl:/, /^hover:/, /^focus:/, /^focus-visible:/,
    /^active:/, /^disabled:/, /^group-hover:/, /^peer-/, /^aria-/, /^data-/,
    /^first:/, /^last:/, /^odd:/, /^even:/, /^visited:/, /^checked:/,
    /^placeholder:/, /^before:/, /^after:/, /^backdrop-/, /^motion-/, /^print:/,
  ],
  greedy: [/reveal/, /^animate-/, /^glass/, /^sr-only/],
};

const htmlFiles = [];
const walk = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === "index.html") htmlFiles.push(p);
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

const content = [
  ...htmlFiles.map((f) => ({ raw: fs.readFileSync(f, "utf8"), extension: "html" })),
  ...jsFiles,
  ...srcFiles,
];

const [result] = await new PurgeCSS().purge({
  content,
  // Raw CSS works consistently on both Windows and Linux; PurgeCSS v8 can
  // return no result for an absolute Windows path.
  css: [{ raw: fs.readFileSync(cssPath, "utf8") }],
  defaultExtractor: extractor,
  safelist,
  fontFace: true,
  keyframes: true,
  variables: true,
});
console.log(`purge-inline: purged css ${(result.css.length / 1024).toFixed(1)}KB`);

let done = 0;
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const link = html.match(/<link[^>]*rel="stylesheet"[^>]*>/);
  if (!link) continue;
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
}
console.log(`purge-inline: ${done} pages inlined`);
