# SEO Master — Noxptide Program Tracker

Live status for the SEO Master program on noxptide.co.uk. Maintained from the
SEO Master workspace; update this file as items move.

**Sources:** PR #6 (this branch) · live site: https://www.noxptide.co.uk
**Goal:** every page/product competitive on Google.co.uk (top-3 where
achievable) via technical SEO, content, and authority work.

## In progress
- [ ] **Merge PR #6** — CI/CD + SEO content publishing pipeline
  - Add secrets: `RAILWAY_TOKEN`, `RAILWAY_SERVICE_ID`, `SEO_EDITOR_EMAIL`,
    `SEO_EDITOR_PASSWORD`, `INDEXNOW_KEY`
  - Watch `deploy.yml` first run → smoke check returns 200
- [ ] **Content publishing via site CMS API** (`cms.upsert`, editor role)
  - Client: `scripts/seo-apply.mjs`; wire the SEO Master "Push to live" action
- [ ] **Google.co.uk rank tracking (top-3)**
  - 22 keywords seeded; production SERP connector (DataForSEO) planned

## To do
- [ ] **IndexNow** — key file at `https://www.noxptide.co.uk/<key>.txt` +
  `INDEXNOW_KEY` secret (deploy.yml already pings home + sitemap)
- [ ] **SEO Master → Git-PR automation (Mode B)** — branch + PR + CI + merge
  for code/schema/new pages
- [ ] **Notion tracker (optional)** — see `scripts/notion-seo-master.mjs`:
  token → `~/.config/notion/api_key` → run script to create the data source

## Done
- [x] GitHub connection verified (repo `rbuilder80-sudo/noxptide`, push + PR via API)
- [x] Repo stack mapped (React 19 + Hono/tRPC + Drizzle/MySQL, Railway deploy)
- [x] Live-site facts captured (Cloudflare → Railway, sitemap/robots/llms.txt served)
- [x] CI/CD workflows written + YAML-validated (ci, deploy, seo-publish)

## Weekly log
| Week | What happened | Next |
|------|---------------|------|
| 2026-08-14 | GitHub pipeline PR #6 opened; site CMS API mapped | Add secrets, merge, first deploy |
