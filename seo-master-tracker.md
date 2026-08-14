# SEO Master â€” Noxptide Program Tracker

Live status for the SEO Master program on noxptide.co.uk. Maintained from the
SEO Master workspace; update this file as items move.

**Sources:** PRs #6/#7/#8/#9 (merged) Â· live site: https://www.noxptide.co.uk
**Goal:** every page/product competitive on Google.co.uk (top-3 where
achievable) via technical SEO, content, and authority work.

## Live (autonomous)
- [x] **SEO Master Autopilot** (`seo-autopilot.yml`) â€” every 6 h (00/06/12/18
  UTC): health check â†’ content queue â†’ IndexNow â†’ status page; every run is
  appended to `seo/run-log.jsonl` and committed back (`[skip ci]`)
- [x] **Status view** â€” `seo-status.md` (recent runs, per-action counts,
  success rate, queue state) + `seo/status.json`
- [x] **Content queue** â€” `seo/content-queue.json`; 2 real guide pages seeded;
  applies via the site CMS API (`cms.upsert`, editor role) once credentials exist
- [x] **Supervision cron** â€” daily 09:00 Europe/London agent check (site health,
  GitHub Actions runs, run-log summary) â†’ AutoClaw Scheduled panel
- [x] **Alerts** â€” workflow failure â†’ GitHub email to repo owner; supervision
  cron as second layer; missed schedules visible as gaps in the run log
- [x] **Runbook** â€” `SEO-MASTER-RUNBOOK.md` (ops, secrets, queue, backup,
  troubleshooting, go-live checklist)

## In progress (needs operator secrets â€” assistant cannot set these)
- [ ] **Production secrets** (Settings â†’ Secrets and variables â†’ Actions):
  `RAILWAY_TOKEN`, `RAILWAY_SERVICE_ID` (deploys), `SEO_EDITOR_EMAIL`,
  `SEO_EDITOR_PASSWORD` (live content writes), `INDEXNOW_KEY` (search pings)
- [ ] **IndexNow key file** at `https://www.noxptide.co.uk/<key>.txt`
- [ ] **Railway MySQL backup** + one restore test (runbook Â§9)

## To do
- [ ] **Google.co.uk rank tracking (top-3)** â€” 22 keywords seeded; production
  SERP connector (DataForSEO) planned
- [ ] **SEO Master â†’ Git-PR automation (Mode B)** â€” branch + PR + CI + merge
  for code/schema/new pages
- [ ] **Notion tracker (optional)** â€” see `scripts/notion-seo-master.mjs`:
  token â†’ `~/.config/notion/api_key` â†’ run script to create the data source

## Done
- [x] GitHub connection verified (repo `rbuilder80-sudo/noxptide`, push + PR via API)
- [x] Repo stack mapped (React 19 + Hono/tRPC + Drizzle/MySQL, Railway deploy)
- [x] Live-site facts captured (Cloudflare â†’ Railway, sitemap/robots/llms.txt served)
- [x] CI/CD workflows merged + verified green (PRs #6/#7/#8 â€” includes the
  `secrets`-in-`if:` fix found via actionlint)
- [x] Autopilot engine built + validated (PR #9): runner, queue, run log,
  status page, runbook

## Weekly log
| Week | What happened | Next |
|------|---------------|------|
| 2026-08-14 | Pipeline merged + verified; autopilot engine shipped | Add secrets, first real deploy + live content publish |
