import devServer from "@hono/vite-dev-server"
import path from "path"
import fs from "fs"
const __dirname = import.meta.dirname
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    devServer({ entry: "api/boot.ts", exclude: [/^\/(?!api\/).*$/] }),
    inspectAttr(), react(),
    {
      name: "inline-css",
      apply: "build",
      async closeBundle() {
        const dir = path.resolve(__dirname, "dist/public")
        const htmlPath = path.join(dir, "index.html")
        if (!fs.existsSync(htmlPath)) return
        let html = fs.readFileSync(htmlPath, "utf8")
        const m = html.match(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/)
        if (!m) return
        const cssPath = path.join(dir, m[1])
        if (!fs.existsSync(cssPath)) return

        // Prerender public routes to static HTML for instant first paint
        try {
          const { execSync } = await import("child_process")
          const bundle = "node_modules/.cache/prerender.mjs"
          fs.mkdirSync(path.dirname(bundle), { recursive: true })
          execSync(
            `npx esbuild scripts/prerender.tsx --bundle --platform=node --format=esm --outfile=${bundle} --alias:@=./src --jsx=automatic --banner:js="import { createRequire } from 'module';const require = createRequire(import.meta.url);" --define:process.env.NODE_ENV='"'"'production'"'"'`,
            { stdio: "inherit" },
          )
          execSync(`node scripts/prerender-run.mjs`, {
            stdio: "inherit",
            env: { ...process.env, PRERENDER_BUNDLE: path.resolve(bundle) },
          })

          // Purge unused CSS against prerendered HTML + client JS, then inline
          const purgedPath = path.join(dir, "assets", "purged.css")
          execSync(
            `npx -y purgecss --css "${cssPath}" --config purgecss.config.cjs --output "${purgedPath}"`,
            { stdio: "inherit" },
          )
          const purged = fs.readFileSync(purgedPath, "utf8")
          const linkRe = /<link[^>]*rel="stylesheet"[^>]*>/
          const walk = (d: string) => {
            for (const e of fs.readdirSync(d, { withFileTypes: true })) {
              const p = path.join(d, e.name)
              if (e.isDirectory()) walk(p)
              else if (e.name === "index.html") {
                const h = fs.readFileSync(p, "utf8")
                if (linkRe.test(h)) fs.writeFileSync(p, h.replace(linkRe, `<style data-inlined>${purged}</style>`))
              }
            }
          }
          walk(dir)
          fs.unlinkSync(purgedPath)
        } catch (e) {
          console.warn("prerender skipped:", e)
          // Fallback: inline the full stylesheet into the root page
          const css = fs.readFileSync(cssPath, "utf8")
          fs.writeFileSync(htmlPath, html.replace(m[0], `<style data-inlined>${css}</style>`))
        }
      },
    }],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@contracts": path.resolve(__dirname, "./contracts"),
      "@db": path.resolve(__dirname, "./db"),
      "db": path.resolve(__dirname, "./db"),
    },
  },
  envDir: path.resolve(__dirname),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router"],
          "vendor-data": ["@tanstack/react-query", "@trpc/client", "@trpc/server", "superjson"],
        },
      },
    },
  },
});
