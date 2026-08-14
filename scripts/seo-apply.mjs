#!/usr/bin/env node
/**
 * SEO Master → noxptide.co.uk content publisher (zero-dependency).
 *
 * Applies a pageContents upsert through the site's own CMS API
 * (tRPC cms.upsert) using an editor account (admin/manager role).
 * Used by .github/workflows/seo-publish.yml; can also run locally.
 *
 * Env (all from CI secrets / inputs — never hard-coded):
 *   SITE_ORIGIN           e.g. https://www.noxptide.co.uk
 *   SEO_EDITOR_EMAIL      editor account email
 *   SEO_EDITOR_PASSWORD   editor account password
 *   PAGE_KEY              page key, e.g. /product/bpc-157
 *   META_TITLE            optional meta title override
 *   META_DESCRIPTION      optional meta description override
 *   CONTENT               optional content override
 *
 * Exit code 0 on success, non-zero on failure. Credentials are never logged.
 */

const SITE = process.env.SITE_ORIGIN || "https://www.noxptide.co.uk";
const email = process.env.SEO_EDITOR_EMAIL;
const password = process.env.SEO_EDITOR_PASSWORD;
const pageKey = process.env.PAGE_KEY;

async function login() {
  if (!email || !password) throw new Error("SEO_EDITOR_EMAIL / SEO_EDITOR_PASSWORD required");
  const res = await fetch(`${SITE}/api/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(`login failed with HTTP ${res.status}`);
  const setCookie = res.headers.get("set-cookie") || "";
  const sid = (setCookie.match(/(?:^|;\s*)kimi_sid=([^;]+)/) || [])[1];
  if (!sid) throw new Error("login succeeded but no kimi_sid cookie returned");
  return sid;
}

async function upsert(sid) {
  if (!pageKey) throw new Error("PAGE_KEY required");
  const input = { pageKey };
  if (process.env.META_TITLE) input.metaTitle = process.env.META_TITLE;
  if (process.env.META_DESCRIPTION) input.metaDescription = process.env.META_DESCRIPTION;
  if (process.env.CONTENT) input.content = process.env.CONTENT;

  const res = await fetch(`${SITE}/api/trpc/cms.upsert`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: `kimi_sid=${sid}`,
    },
    body: JSON.stringify({ json: input }),
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`cms.upsert failed with HTTP ${res.status}: ${body.slice(0, 300)}`);
  let parsed;
  try { parsed = JSON.parse(body); } catch { parsed = null; }
  if (parsed && parsed.error) throw new Error(`cms.upsert error: ${JSON.stringify(parsed.error).slice(0, 300)}`);
  console.log(`published ${pageKey} → ${SITE} (roles: editor)`);
}

try {
  const sid = await login();
  await upsert(sid);
  process.exit(0);
} catch (err) {
  console.error(`[seo-apply] ${err.message}`);
  process.exit(1);
}
