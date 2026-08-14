# SEO Master â€” Operations Runbook (noxptide.co.uk)

Plain-language guide for running the SEO Master bot in production. Written for
an operator with GitHub access to `rbuilder80-sudo/noxptide`; no code knowledge
required for day-to-day operations.

---

## 1. What this system is

The SEO Master is an autonomous content/SEO worker for the live site
https://www.noxptide.co.uk. It runs as **GitHub Actions workflows** (no server
to keep alive), supervised daily by an agent-side cron. Components:

| Component | Where | Role |
|---|---|---|
| `seo-autopilot.yml` | `.github/workflows/` | Scheduled engine: runs every 6 h (00/06/12/18 UTC), plus manual trigger |
| `seo-runner.mjs` | `scripts/` | The engine: health check â†’ content queue â†’ IndexNow â†’ status page |
| `seo-apply.mjs` | `scripts/` | Applies one page's content via the site's own CMS API (`cms.upsert`, editor role) |
| `seo/content-queue.json` | repo | Task queue â€” items the bot publishes on its next cycle |
| `seo/run-log.jsonl` | repo | Append-only record of every run (timestamp, action, status, detail) |
| `seo-status.md` | repo root | Auto-generated status view (runs, success rate, queue state) |
| `deploy.yml` | `.github/workflows/` | Deploys the site to Railway on push to `main` (needs `RAILWAY_TOKEN`) |
| `ci.yml` | `.github/workflows/` | PR checks (typecheck, lint, tests, build) |

## 2. How a run works (one autopilot cycle)

1. **Health** â€” the bot GETs `/`, `/sitemap.xml`, `/robots.txt`. Any non-200 â†’ run fails.
2. **Queue** â€” every `pending` item in `seo/content-queue.json` is published via
   the site CMS API (title/description/content overrides). No editor credentials
   configured â†’ items are marked `skipped` and the run still succeeds (nothing to do yet).
3. **IndexNow** â€” pings Bing/Yandex/Seznam/Naver for the homepage + sitemap
   (only when `INDEXNOW_KEY` is set).
4. **Status** â€” regenerates `seo-status.md` and `seo/status.json` from the run log.
5. Every result line is appended to `seo/run-log.jsonl` and committed back to the
   repo by the workflow itself (commit message contains `[skip ci]` so it never
   re-triggers deploys).

## 3. What you do NOT need to do

- **Start/stop:** nothing to start. The schedule runs on GitHub's infrastructure.
- **Keep a computer on:** the bot is not tied to any machine.
- **Watch it:** failures email you (see Alerts) and the daily supervision check
  reports in the AutoClaw app's Scheduled panel.

## 4. Restarting / pausing / triggering

- **Trigger now:** repo â†’ Actions â†’ "SEO Master Autopilot" â†’ "Run workflow".
- **Pause:** edit `seo-autopilot.yml` and comment out the `schedule:` block, or
  disable the workflow in the Actions tab. Re-enable the same way.
- **Deploy the site:** push to `main` (requires `RAILWAY_TOKEN` + `RAILWAY_SERVICE_ID`).

## 5. Configuration (secrets â€” never put these in files)

Add in repo â†’ Settings â†’ Secrets and variables â†’ Actions:

| Secret | Needed for | Where to get it |
|---|---|---|
| `RAILWAY_TOKEN` | Site deploys | Railway dashboard â†’ Account/Project â†’ Tokens |
| `RAILWAY_SERVICE_ID` | Site deploys | Railway project â†’ service â†’ settings |
| `SEO_EDITOR_EMAIL` | Content publishing | An editor/admin login on the site |
| `SEO_EDITOR_PASSWORD` | Content publishing | Same account's password |
| `INDEXNOW_KEY` | Search ping | indexnow.org (also host `<key>.txt` on the site) |
| `SEO_MASTER_WEBHOOK` (optional) | Deploy notifications | Any webhook URL you control |

Without these secrets the system still runs: health checks, queue bookkeeping
and the status page all work; deploys and live content writes are skipped.

## 6. Adding work for the bot (the queue)

Edit `seo/content-queue.json` (via the repo UI or a PR â€” the PR is reviewed and
merged, then the next cycle picks it up):

```json
{
  "items": [
    {
      "key": "/guides/bpc-157-research-guide",
      "metaTitle": "New title | Noxptide",
      "metaDescription": "New meta description under 160 chars.",
      "content": null,
      "status": "pending",
      "createdAt": "2026-08-14T20:05:00.000Z",
      "note": "What this change is for"
    }
  ]
}
```

Statuses: `pending` â†’ the bot publishes it Â· `done`/`failed`/`skipped` â†’ the bot
leaves it alone. Set back to `pending` to re-apply.

## 7. Monitoring

- **Status view:** open `seo-status.md` in the repo â€” latest runs, per-action
  counts, success rate, queue state.
- **Raw data:** `seo/run-log.jsonl` â€” every event ever recorded, newest last.
- **Live site:** https://www.noxptide.co.uk should always return 200
  (`/sitemap.xml`, `/robots.txt` too). The bot checks this itself every 6 h.

## 8. Alerts (who gets told, how)

1. **Workflow failure â†’ email.** If an autopilot cycle fails (site down, publish
   error), the workflow concludes `failure` and GitHub emails the repo owner
   automatically. The failing detail line is in the run log.
2. **Daily supervision.** A cron job in the AutoClaw app runs daily at 09:00
   (Europe/London): it verifies the site, checks the latest GitHub Actions runs
   and summarises the run log; results appear in the app's Scheduled panel.
3. **Missed schedules.** A run that never happened shows up as a gap in the run
   log timestamps and as a missing daily report â€” the supervision check flags it.

## 9. Backups and recovery

- **Configuration + run data are git history.** Every autopilot commit is a
  backup. Restore any file (e.g. `seo/run-log.jsonl`) to an earlier state:
  `git log --oneline -- seo/run-log.jsonl`, then
  `git checkout <commit> -- seo/run-log.jsonl`, commit, done. A restore test is
  documented in the go-live verification report.
- **Site database** (MySQL on Railway â€” products, orders, page contents):
  Railway project â†’ database service â†’ Backups, or
  `railway run -- mysqldump ... > backup.sql` once `RAILWAY_TOKEN` is configured.
  Keep offsite copies; test restore into a staging DB before relying on it.
- **Credentials:** stored only as GitHub secrets (see Â§5). To rotate, edit the
  secret â€” no code change, no downtime.

## 10. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Autopilot run fails on `health` | Site down or Cloudflare/Railway hiccup | Check site in browser; check Railway service logs; rerun workflow manually |
| Queue items stay `skipped` | `SEO_EDITOR_EMAIL`/`PASSWORD` not set, or editor lacks admin/manager role | Add secrets; or check the account role on the site |
| Queue item `failed` | Login rejected / CMS API error | Detail column in `seo-status.md` and run log shows the error; verify credentials; retry by setting status back to `pending` |
| Deploy workflow "skipped" | `RAILWAY_TOKEN`/`RAILWAY_SERVICE_ID` missing | Add secrets; the step prints a notice when skipped |
| CI red on lint/tests | Pre-existing repo debt (Kimi auth tests in flight) | Non-blocking by design; re-enable strict mode when the repo suite is green |
| IndexNow never fires | `INDEXNOW_KEY` missing | Create key at indexnow.org, host `<key>.txt`, add secret |
| Bot stopped entirely | Workflow disabled / repo inactive 60 days | Re-enable in Actions tab (GitHub disables schedules after 60 days of repo inactivity) |

## 11. Go-live checklist

- [ ] Secrets added: `RAILWAY_TOKEN`, `RAILWAY_SERVICE_ID` â†’ first push to main deploys
- [ ] Secrets added: `SEO_EDITOR_EMAIL`, `SEO_EDITOR_PASSWORD` â†’ queue items publish live
- [ ] `INDEXNOW_KEY` added + `<key>.txt` hosted â†’ search engines pinged each cycle
- [ ] Watch one autopilot cycle complete and appear in `seo-status.md`
- [ ] Confirm you receive the GitHub failure email (test: break a health check once)
- [ ] Railway MySQL backup configured; restore tested once
- [ ] Operator can trigger/pause the autopilot from the Actions tab

---

_Document version 1.0 â€” 2026-08-14. Maintained in the noxptide repo so it ships
with the code. Ask the SEO Master agent for the go-live verification report._
