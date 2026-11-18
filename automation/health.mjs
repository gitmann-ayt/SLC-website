#!/usr/bin/env node
/**
 * Daily live-site check. Prints a plain-text report; exits 1 if anything is wrong.
 *
 * - every sitemap URL returns 200, with no noindex header or meta tag, and a
 *   canonical that points at itself
 * - robots.txt, sitemap.xml and llms.txt are reachable; robots.txt doesn't block the site
 * - the bare domain 301-redirects to www over http and https
 * - the TLS certificate has more than 21 days left
 */
import tls from "node:tls";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.slccarrentals.com.pk").replace(/\/$/, "");
const host = new URL(SITE).host;
const bare = host.replace(/^www\./, "");
const problems = [];
const notes = [];
const UA = "SLC-health-check/1.0";

async function get(url, opts = {}) {
  const t = Date.now();
  const res = await fetch(url, { redirect: "manual", headers: { "user-agent": UA }, ...opts });
  return { res, ms: Date.now() - t, body: opts.method === "HEAD" ? "" : await res.text() };
}

function certDaysLeft(h) {
  return new Promise((resolve, reject) => {
    const s = tls.connect(443, h, { servername: h }, () => {
      const c = s.getPeerCertificate();
      s.end();
      resolve(Math.floor((new Date(c.valid_to) - Date.now()) / 86_400_000));
    });
    s.on("error", reject);
    s.setTimeout(15_000, () => s.destroy(new Error("TLS timeout")));
  });
}

// 1. Support files
const sm = await get(`${SITE}/sitemap.xml`).catch((e) => ({ error: e }));
if (sm.error || sm.res.status !== 200) problems.push(`sitemap.xml: ${sm.error?.message ?? `HTTP ${sm.res.status}`}`);
const urls = sm.body ? [...sm.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]) : [];

const robots = await get(`${SITE}/robots.txt`).catch((e) => ({ error: e }));
if (robots.error || robots.res.status !== 200) problems.push(`robots.txt: ${robots.error?.message ?? `HTTP ${robots.res.status}`}`);
else if (/^Disallow:\s*\/\s*$/m.test(robots.body)) problems.push("robots.txt blocks the whole site (Disallow: /)");

const llms = await get(`${SITE}/llms.txt`).catch((e) => ({ error: e }));
if (llms.error || llms.res.status !== 200) problems.push(`llms.txt: ${llms.error?.message ?? `HTTP ${llms.res.status}`}`);

// 2. Every page in the sitemap
let slow = [];
for (const url of urls) {
  try {
    const { res, ms, body } = await get(url);
    if (res.status !== 200) { problems.push(`${url}: HTTP ${res.status}`); continue; }
    const xrt = res.headers.get("x-robots-tag") || "";
    if (/noindex/i.test(xrt)) problems.push(`${url}: X-Robots-Tag header "${xrt}"`);
    if (/<meta name="robots" content="[^"]*noindex/.test(body)) problems.push(`${url}: noindex meta tag`);
    const canonical = body.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
    if (canonical !== url) problems.push(`${url}: canonical is ${canonical ?? "missing"}`);
    if (ms > 3000) slow.push(`${url} (${ms} ms)`);
  } catch (e) {
    problems.push(`${url}: ${e.message}`);
  }
}
if (slow.length) notes.push(`Slow responses (over 3 s): ${slow.join(", ")}`);

// 3. Bare domain redirects
for (const scheme of ["http", "https"]) {
  try {
    const { res } = await get(`${scheme}://${bare}/`, { method: "HEAD" });
    const loc = res.headers.get("location") || "";
    if (res.status !== 301 || !loc.startsWith(SITE)) problems.push(`${scheme}://${bare}/ returns ${res.status} → ${loc || "(no location)"}, expected 301 → ${SITE}/`);
  } catch (e) {
    problems.push(`${scheme}://${bare}/: ${e.message}`);
  }
}

// 4. Certificate
try {
  const days = await certDaysLeft(host);
  if (days < 21) problems.push(`TLS certificate for ${host} expires in ${days} days`);
  else notes.push(`TLS certificate: ${days} days left`);
} catch (e) {
  problems.push(`TLS check for ${host}: ${e.message}`);
}

console.log(problems.length ? `${problems.length} problem(s) on ${SITE}` : `All OK on ${SITE}`);
console.log(`Checked ${urls.length} sitemap pages, robots.txt, llms.txt, bare-domain redirects and the certificate.`);
if (problems.length) console.log(["", "Problems:", ...problems.map((p) => `- ${p}`)].join("\n"));
if (notes.length) console.log(["", "Notes:", ...notes.map((n) => `- ${n}`)].join("\n"));
process.exit(problems.length ? 1 : 0);
