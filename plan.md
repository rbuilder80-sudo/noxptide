# Keyword-driven meta optimisation for noxptide.co.uk

## Goal
Use Google Keyword Planner (open in Chrome browser takeover) to find the highest-traffic keywords for each page, then rewrite meta titles/descriptions so every indexable page works as a sales entry point — while keeping the legally required "for laboratory research use only" positioning (no medical/therapeutic claims).

## Stage 1 — Browser access check
- Use browser_* tools (Chrome takeover) to confirm Google Keyword Planner is reachable and logged in.
- If login is needed, report back to the user.

## Stage 2 — Keyword harvesting (Keyword Planner)
- Build seed keyword list from site data: 9 core pages, 32 products (from src/data/products.ts / seo.ts), 10 guides.
- Use Keyword Planner "Discover new keywords" / "Get search volume and forecasts" in batches:
  - Batch A: generic niche terms (research peptides UK, buy peptides UK, peptide supplier UK...)
  - Batch B: all 32 product names + modifiers (buy X, X UK, X peptide, X for sale)
  - Batch C: 10 guide topics (informational queries)
- Capture: keyword, avg monthly searches, competition, top-of-page bid (commercial intent proxy).

## Stage 3 — Keyword mapping per page
- Map primary keyword + 2-4 secondary keywords to each of the 51 pages.
- Selection rule: highest relevant volume with transactional intent for products/shop; informational intent for guides.
- Avoid keyword cannibalisation (one primary keyword per page).

## Stage 4 — Rewrite metadata (sales-page copy)
- Update src/data/seo.ts (single source of truth): titles ≤60 chars, descriptions ≤160 chars.
- Formula: Primary keyword first | differentiator (≥99% purity, COA, UK stock, tracked delivery) | brand.
- Descriptions: benefit + proof + CTA ("Order today", "Batch COA included"), keep "research use only" compliance line where space allows.
- Product pages: keep PRODUCT_TITLE_OVERRIDES pattern, extend to all 32 products where keyword data justifies it.
- Guides: informational title + CTA to shop in description.

## Stage 5 — Build, validate, deploy
- npm run build → prerender 56 routes.
- Local validation: 51/51 URLs, title/desc lengths, canonicals.
- Commit; deploy via GitHub push (needs user/concurrent-session push as before, or user pushes).
- Update live-site verification after deploy.

## Constraints
- No medical/therapeutic claims (MHRA/Google policy risk) — "sales page" = stronger commercial copy, CTAs, trust signals; NOT health claims.
- Titles ≤60 chars, descriptions ≤160 chars (hard gate).
- Only edit src/data/seo.ts + page H1s if keyword data demands it; no layout redesign.
