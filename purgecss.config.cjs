// PurgeCSS config — keeps Tailwind variants (lg:flex), arbitrary values
// (text-[#1B133C], bg-[radial-gradient(...)]), and runtime-added classes.
module.exports = {
  content: [
    "dist/public/**/*.html",
    "dist/public/assets/*.js",
    "src/**/*.tsx",
    "src/**/*.ts",
  ],
  defaultExtractor: (content) => content.match(/[^\s"'`=<>\\]+(?<!:)/g) || [],
  safelist: {
    standard: ["in-view", "dark", "html", "body", /^sm:/, /^md:/, /^lg:/, /^xl:/, /^hover:/, /^focus:/, /^focus-visible:/, /^active:/, /^disabled:/, /^group-hover:/, /^peer-/, /^aria-/, /^data-/, /^first:/, /^last:/, /^odd:/, /^even:/, /^visited:/, /^checked:/, /^placeholder:/, /^before:/, /^after:/, /^backdrop-/, /^motion-/, /^print:/],
    greedy: [/reveal/, /^animate-/, /^glass/, /^sr-only/],
  },
};
