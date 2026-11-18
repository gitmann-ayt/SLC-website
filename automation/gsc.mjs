#!/usr/bin/env node
/**
 * node automation/gsc.mjs <out.json>
 *
 * Pulls the last 28 days of Google Search Console data (and the 28 days before,
 * for comparison) with a service account, writes the raw rows to <out.json> for
 * the Claude job, and prints a plain-text summary for the email.
 *
 * Needs SSM parameter /slc/gsc-service-account (the service account's JSON key),
 * and that service account added as a user on the Search Console property.
 */
import { createSign } from "node:crypto";
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const out = process.argv[2] || "gsc.json";
const PROPERTY = process.env.GSC_PROPERTY || "sc-domain:slccarrentals.com.pk";

const keyJson =
  process.env.GSC_SERVICE_ACCOUNT ||
  execFileSync("aws", ["ssm", "get-parameter", "--name", "/slc/gsc-service-account", "--with-decryption", "--query", "Parameter.Value", "--output", "text"], { encoding: "utf8" });
const key = JSON.parse(keyJson);

const b64 = (o) => Buffer.from(typeof o === "string" ? o : JSON.stringify(o)).toString("base64url");
async function token() {
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({
    iss: key.client_email,
    scope: "https://www.googleapis.com/auth/webmasters.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  })}`;
  const sig = createSign("RSA-SHA256").update(unsigned).sign(key.private_key, "base64url");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${sig}` }),
  });
  if (!res.ok) throw new Error(`token: HTTP ${res.status} ${await res.text()}`);
  return (await res.json()).access_token;
}

const day = (offset) => new Date(Date.now() - offset * 86_400_000).toISOString().slice(0, 10);
// Search Console data lags 2–3 days.
const cur = { startDate: day(30), endDate: day(3) };
const prev = { startDate: day(58), endDate: day(31) };

const access = await token();
async function query(range, dimensions, rowLimit = 1000) {
  const res = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(PROPERTY)}/searchAnalytics/query`, {
    method: "POST",
    headers: { authorization: `Bearer ${access}`, "content-type": "application/json" },
    body: JSON.stringify({ ...range, dimensions, rowLimit, dataState: "final" }),
  });
  if (!res.ok) throw new Error(`searchAnalytics ${dimensions}: HTTP ${res.status} ${await res.text()}`);
  return ((await res.json()).rows ?? []).map((r) => ({ keys: r.keys, clicks: r.clicks, impressions: r.impressions, ctr: +r.ctr.toFixed(4), position: +r.position.toFixed(1) }));
}

const [pageQuery, pages, queries, prevPages] = await Promise.all([
  query(cur, ["page", "query"], 5000),
  query(cur, ["page"]),
  query(cur, ["query"]),
  query(prev, ["page"]),
]);

const sum = (rows) => rows.reduce((a, r) => ({ clicks: a.clicks + r.clicks, impressions: a.impressions + r.impressions }), { clicks: 0, impressions: 0 });
const total = sum(pages);
const prevTotal = sum(prevPages);
writeFileSync(out, JSON.stringify({ property: PROPERTY, current: cur, previous: prev, total, prevTotal, pages, prevPages, queries, pageQuery }, null, 1));

const pct = (a, b) => (b ? `${a >= b ? "+" : ""}${Math.round(((a - b) / b) * 100)}%` : "new");
const fmt = (r) => `${r.keys.join(" | ")}: ${r.clicks} clicks, ${r.impressions} impr, pos ${r.position}`;
console.log(
  [
    `Search Console, ${cur.startDate} to ${cur.endDate} (${PROPERTY})`,
    `Clicks ${total.clicks} (${pct(total.clicks, prevTotal.clicks)} vs previous 28 days), impressions ${total.impressions} (${pct(total.impressions, prevTotal.impressions)})`,
    "",
    "Top queries:",
    ...queries.slice(0, 15).map((r) => `- ${fmt(r)}`),
    "",
    "Top pages:",
    ...pages.slice(0, 10).map((r) => `- ${fmt(r)}`),
  ].join("\n"),
);
