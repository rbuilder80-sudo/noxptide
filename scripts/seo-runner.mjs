#!/usr/bin/env node
/**
 * SEO Master autopilot runner (zero-dependency, Node >= 20, ESM).
 *
 * Runs one full autonomous SEO task cycle against the live site:
 *   1. health   — GET /, /sitemap.xml, /robots.txt
 *   2. queue    — apply pending items from seo/content-queue.json via the
 *                 site's own CMS API (scripts/seo-apply.mjs, editor role)
 *   3. indexnow — ping IndexNow when a key is configured
 *   4. status   — regenerate SEO-STATUS.md + seo/status.json from the run log
 *
 * Every step appends a JSON line to seo/run-log.jsonl (traceability).
 * Credentials are never logged. Exit code 0 = cycle ok, 1 = a required
 * action failed (workflow failure -> GitHub email alert to the repo owner).
 *
 * Usage:  node scripts/seo-runner.mjs [all|health|queue|indexnow|status]
 * Env:    SITE_ORIGIN, SEO_EDITOR_EMAIL, SEO_EDITOR_PASSWORD, INDEXNOW_KEY
 */

import { readFileSync, writeFileSync, appendFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SEO_DIR = path.join(ROOT, "seo");
const QUEUE = path.join(SEO_DIR, "content-queue.json");
const RUNLOG = path.join(SEO_DIR, "run-log.jsonl");
const STATUS_JSON = path.join(SEO_DIR, "status.json");
const STATUS_MD = path.join(ROOT, "seo-status.md");

const SITE = process.env.SITE_ORIGIN || "https://www.noxptide.co.uk";
const action = process.argv[2] || "all";
const now = () => new Date().toISOString();

function append(entry) {
  const line = JSON.stringify(entry);
  appendFileSync(RUNLOG, line + "\n");
  console.log("[log]", line);
}

async function httpGet(pathname) {
  try {
    const r = await fetch(SITE + pathname, {
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });
    return { ok: r.ok, status: r.status };
  } catch (err) {
    return { ok: false, status: 0, error: err.message };
  }
}

async function health() {
  const checks = {
    "/": await httpGet("/"),
    "/sitemap.xml": await httpGet("/sitemap.xml"),
    "/robots.txt": await httpGet("/robots.txt"),
  };
  const detail = Object.entries(checks)
    .map(([p, r]) => `${p}=${r.status || r.error}`)
    .join(", ");
  const ok = Object.values(checks).every((r) => r.ok);
  append({ ts: now(), action: "health", status: ok ? "ok" : "fail", detail });
  return ok;
}

function applyItem(item) {
  const env = {
    ...process.env,
    PAGE_KEY: item.key,
    META_TITLE: item.metaTitle || "",
    META_DESCRIPTION: item.metaDescription || "",
    CONTENT: item.content || "",
  };
  const r = spawnSync(process.execPath, [path.join(__dirname, "seo-apply.mjs")], {
    env,
    encoding: "utf8",
    timeout: 60000,
  });
  const output = (r.stdout || "").trim() || (r.stderr || "").trim();
  return { ok: r.status === 0, output };
}

async function queue() {
  if (!existsSync(QUEUE)) {
    append({ ts: now(), action: "queue-run", status: "skipped", detail: "no seo/content-queue.json" });
    return true;
  }
  const q = JSON.parse(readFileSync(QUEUE, "utf8"));
  let allOk = true;
  for (const item of q.items) {
    if (item.status !== "pending") continue;
    if (!process.env.SEO_EDITOR_EMAIL || !process.env.SEO_EDITOR_PASSWORD) {
      item.status = "skipped";
      item.skippedAt = now();
      item.lastNote = "no editor credentials configured";
      append({ ts: now(), action: "queue-run", status: "skipped", detail: `no editor credentials for ${item.key}` });
      continue;
    }
    const r = applyItem(item);
    if (r.ok) {
      item.status = "done";
      item.appliedAt = now();
      item.lastNote = r.output;
      append({ ts: now(), action: "queue-run", status: "ok", detail: `published ${item.key}` });
    } else {
      item.status = "failed";
      item.lastError = r.output;
      item.lastAttemptAt = now();
      allOk = false;
      append({ ts: now(), action: "queue-run", status: "fail", detail: `${item.key}: ${r.output.slice(0, 200)}` });
    }
  }
  writeFileSync(QUEUE, JSON.stringify(q, null, 2) + "\n");
  return allOk;
}

async function indexnow() {
  const key = process.env.INDEXNOW_KEY;
  if (!key) {
    append({ ts: now(), action: "indexnow", status: "skipped", detail: "no INDEXNOW_KEY configured" });
    return true;
  }
  const body = JSON.stringify({
    host: "www.noxptide.co.uk",
    key,
    urlList: [`${SITE}/`, `${SITE}/sitemap.xml`],
  });
  try {
    const r = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body,
      signal: AbortSignal.timeout(20000),
    });
    const ok = r.ok || r.status === 202;
    append({ ts: now(), action: "indexnow", status: ok ? "ok" : "fail", detail: `HTTP ${r.status}` });
    return ok;
  } catch (err) {
    append({ ts: now(), action: "indexnow", status: "fail", detail: err.message });
    return false;
  }
}

function generateStatus() {
  const lines = existsSync(RUNLOG)
    ? readFileSync(RUNLOG, "utf8").trim().split("\n").filter(Boolean).map((l) => JSON.parse(l))
    : [];
  const byAction = {};
  for (const e of lines) {
    byAction[e.action] ||= { total: 0, ok: 0, fail: 0, skip: 0 };
    const b = byAction[e.action];
    b.total++;
    if (e.status === "ok") b.ok++;
    else if (e.status === "fail") b.fail++;
    else b.skip++;
  }
  const total = lines.length;
  const fails = lines.filter((l) => l.status === "fail").length;
  const rate = total ? Math.round(((total - fails) / total) * 100) : null;

  let md = "# SEO Master — Live Status\n\n";
  md += `_Generated ${now()} · site ${SITE} · every run recorded in \`seo/run-log.jsonl\`_\n\n`;
  md += "## Summary\n\n";
  md += `- Runs recorded: **${total}**\n- Failures: **${fails}**\n- Success rate: **${rate === null ? "—" : rate + "%"}**\n\n`;
  md += "## Per action\n\n| Action | Total | OK | Fail | Skipped |\n|---|---|---|---|---|\n";
  for (const [a, b] of Object.entries(byAction)) {
    md += `| ${a} | ${b.total} | ${b.ok} | ${b.fail} | ${b.skip} |\n`;
  }
  md += "\n## Recent runs\n\n| Time (UTC) | Action | Status | Detail |\n|---|---|---|---|\n";
  for (const e of lines.slice(-10).reverse()) {
    const d = (e.detail || "").replace(/\|/g, "\\|").slice(0, 160);
    md += `| ${e.ts} | ${e.action} | ${e.status} | ${d} |\n`;
  }
  md += "\n## Content queue\n\n";
  if (existsSync(QUEUE)) {
    const q = JSON.parse(readFileSync(QUEUE, "utf8"));
    md += "| Page key | Status | Last note |\n|---|---|---|\n";
    for (const i of q.items) {
      const n = (i.lastNote || i.lastError || "—").replace(/\|/g, "\\|").slice(0, 120);
      md += `| ${i.key} | ${i.status} | ${n} |\n`;
    }
  } else {
    md += "_No queue file._\n";
  }
  md += "\n---\n_Zero-secret page: credentials never appear here. Alerts: GitHub email on workflow failure; daily supervision via the SEO Master agent._\n";

  writeFileSync(STATUS_MD, md);
  writeFileSync(STATUS_JSON, JSON.stringify({ generatedAt: now(), totalRuns: total, failures: fails, successRate: rate, byAction }, null, 2) + "\n");
  console.log(`[status] wrote ${STATUS_MD} (${total} runs, ${fails} failures)`);
  return true;
}

const results = [];
if (action === "health" || action === "all") results.push(["health", await health()]);
if (action === "queue" || action === "all") results.push(["queue", await queue()]);
if (action === "indexnow" || action === "all") results.push(["indexnow", await indexnow()]);
if (action === "status" || action === "all") results.push(["status", generateStatus()]);

const failed = results.filter(([, ok]) => !ok);
if (failed.length) {
  console.error(`[seo-runner] FAILED actions: ${failed.map((f) => f[0]).join(", ")}`);
  process.exit(1);
}
console.log(`[seo-runner] cycle completed: ${results.map(([a, ok]) => `${a}=${ok ? "ok" : "FAIL"}`).join(", ")}`);
process.exit(0);
