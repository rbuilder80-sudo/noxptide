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
        const css = fs.readFileSync(cssPath, "utf8")
        html = html.replace(m[0], `<style data-inlined>${css}</style>`)
        fs.writeFileSync(htmlPath, html)

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
        } catch (e) {
          console.warn("prerender skipped:", e)
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
