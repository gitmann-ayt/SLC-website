#!/usr/bin/env node
/**
 * Checks the built site in out/ for problems that hurt search rankings.
 *
 *   node scripts/seo-check.mjs          human-readable report, exit 1 on errors
 *   node scripts/seo-check.mjs --json   machine-readable report on stdout
 *
 * Errors (fail the deploy): missing or duplicate title, missing description,
 * missing or wrong canonical, not exactly one H1, invalid JSON-LD, broken
 * internal links, sitemap URLs with no page, noindex on a live build.
 * Warnings (reported only): title or description length out of range, and
 * orphan pages (in the sitemap but no other page links to them). The report
 * also lists the pages with the fewest inbound internal links.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const OUT = new URL("../out/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
const asJson = process.argv.includes("--json");
const SKIP = new Set(["404.html", `404${sep}index.html`, "_not-found.html", `_not-found${sep}index.html`]);

if (!existsSync(OUT)) {
  console.error("out/ not found. Run `npm run build` first.");
  process.exit(2);
}

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? (f === "_next" ? [] : walk(p)) : [p];
  });

const htmlFiles = walk(OUT).filter((f) => f.endsWith(".html") && !SKIP.has(relative(OUT, f)));
const errors = [];
const warnings = [];
const titles = new Map();
const descriptions = new Map();
/** Pages marked noindex (fine for /credits/, an error if the sitemap lists them) */
const noindex = new Set();
/** Internal links: target path -> set of pages that link to it */
const inbound = new Map();
const normal = (href) => {
  const p = decodeURIComponent(href.split(/[?#]/)[0]) || "/";
  return p.endsWith("/") || /\.[a-z0-9]+$/i.test(p) ? p : `${p}/`;
};

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const urlPath = (file) => "/" + relative(OUT, file).split(sep).join("/").replace(/index\.html$/, "").replace(/\.html$/, "");

/** Does an internal path resolve to a file in out/? */
function resolves(path) {
  const clean = decodeURIComponent(path.split(/[?#]/)[0]);
  if (clean === "/" || clean === "") return existsSync(join(OUT, "index.html"));
  const rel = clean.replace(/^\//, "");
  if (clean.endsWith("/")) return existsSync(join(OUT, rel, "index.html"));
  return existsSync(join(OUT, rel)) || existsSync(join(OUT, `${rel}.html`)) || existsSync(join(OUT, rel, "index.html"));
}

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const page = urlPath(file);
  const err = (m) => errors.push(`${page}: ${m}`);
  const warn = (m) => warnings.push(`${page}: ${m}`);

  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1]?.trim() ?? "");
  if (!title) err("missing <title>");
  else {
    if (title.length > 70) warn(`title is ${title.length} chars (aim for 70 or fewer): "${title}"`);
    titles.set(title, [...(titles.get(title) ?? []), page]);
  }

  const desc = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "");
  if (!desc) err("missing meta description");
  else {
    if (desc.length < 70 || desc.length > 170) warn(`description is ${desc.length} chars (aim for 120–160)`);
    descriptions.set(desc, [...(descriptions.get(desc) ?? []), page]);
  }

  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  if (!canonical) err("missing canonical link");
  else if (SITE && !canonical.startsWith(SITE)) err(`canonical ${canonical} is not on ${SITE}`);

  const h1s = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1s !== 1) err(`has ${h1s} <h1> elements (expected 1)`);

  if (/<meta name="robots" content="[^"]*noindex/.test(html)) noindex.add(page);

  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(m[1]);
    } catch (e) {
      err(`invalid JSON-LD: ${e.message}`);
    }
  }

  for (const m of html.matchAll(/<a [^>]*href="(\/[^"]*)"/g)) {
    const href = decode(m[1]);
    if (href.startsWith("//")) continue;
    if (!resolves(href)) err(`broken internal link ${href}`);
    const target = normal(href);
    if (target !== page) inbound.set(target, (inbound.get(target) ?? new Set()).add(page));
  }
}

for (const [t, pages] of titles) if (pages.length > 1) errors.push(`duplicate title "${t}" on ${pages.join(", ")}`);
for (const [d, pages] of descriptions) if (pages.length > 1) warnings.push(`duplicate description on ${pages.join(", ")}: "${d.slice(0, 60)}…"`);

const sitemapFile = join(OUT, "sitemap.xml");
let sitemapUrls = 0;
const sitemapPaths = [];
if (!existsSync(sitemapFile)) errors.push("sitemap.xml missing");
else {
  for (const m of readFileSync(sitemapFile, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)) {
    sitemapUrls++;
    const path = m[1].replace(/^https?:\/\/[^/]+/, "") || "/";
    sitemapPaths.push(path);
    if (!resolves(path)) errors.push(`sitemap lists ${m[1]} but there is no page for it`);
    else if (SITE && noindex.has(path)) errors.push(`sitemap lists ${m[1]} but the page is noindex`);
  }
}

const linkCounts = sitemapPaths
  .map((path) => ({ path, inbound: inbound.get(path)?.size ?? 0 }))
  .sort((a, b) => a.inbound - b.inbound);
for (const { path, inbound: n } of linkCounts) if (n === 0) warnings.push(`${path}: orphan page, no other page links to it`);
const weakestLinked = linkCounts.slice(0, 10);

const report = { pages: htmlFiles.length, sitemapUrls, errors, warnings, weakestLinked, ok: errors.length === 0 };

if (asJson) console.log(JSON.stringify(report, null, 2));
else {
  console.log(`SEO check: ${report.pages} pages, ${sitemapUrls} sitemap URLs, ${errors.length} errors, ${warnings.length} warnings`);
  for (const e of errors) console.log(`  ERROR  ${e}`);
  for (const w of warnings) console.log(`  warn   ${w}`);
  if (weakestLinked.length) {
    console.log("Fewest inbound internal links:");
    for (const { path, inbound: n } of weakestLinked) console.log(`  ${String(n).padStart(4)}  ${path}`);
  }
}
process.exit(report.ok ? 0 : 1);
