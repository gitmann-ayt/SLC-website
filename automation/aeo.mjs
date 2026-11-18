#!/usr/bin/env node
/**
 * Monthly AEO check: asks AI answer engines (with live web search) the questions
 * in automation/aeo-questions.json and reports whether SLC is mentioned or its
 * site cited, compared with the previous run.
 *
 * Uses the official APIs, whichever keys are set:
 *   OPENAI_API_KEY      ChatGPT-style answer with web search (OPENAI_MODEL, default gpt-5-mini)
 *   PERPLEXITY_API_KEY  Perplexity Sonar (PERPLEXITY_MODEL, default sonar)
 *   GEMINI_API_KEY      Gemini with Google Search grounding (GEMINI_MODEL, default gemini-2.5-flash)
 * History is kept in $SLC_STATE/aeo-history.json.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const cfg = JSON.parse(readFileSync(new URL("./aeo-questions.json", import.meta.url), "utf8"));
const STATE = process.env.SLC_STATE || ".";
const historyFile = join(STATE, "aeo-history.json");
const brandRe = new RegExp(cfg.brand.map((b) => b.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"), "i");
const domain = "slccarrentals.com.pk";

async function post(url, headers, body) {
  const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json", ...headers }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return res.json();
}

const engines = {
  chatgpt: process.env.OPENAI_API_KEY && (async (q) => {
    const d = await post("https://api.openai.com/v1/responses", { authorization: `Bearer ${process.env.OPENAI_API_KEY}` }, {
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      input: `${q} (I am in Pakistan.)`,
      tools: [{ type: "web_search" }],
    });
    const parts = (d.output ?? []).filter((o) => o.type === "message").flatMap((o) => o.content ?? []);
    return {
      text: parts.map((p) => p.text ?? "").join("\n"),
      sources: parts.flatMap((p) => (p.annotations ?? []).map((a) => a.url).filter(Boolean)),
    };
  }),
  perplexity: process.env.PERPLEXITY_API_KEY && (async (q) => {
    const d = await post("https://api.perplexity.ai/chat/completions", { authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}` }, {
      model: process.env.PERPLEXITY_MODEL || "sonar",
      messages: [{ role: "user", content: `${q} (I am in Pakistan.)` }],
    });
    return {
      text: d.choices?.[0]?.message?.content ?? "",
      sources: [...(d.citations ?? []), ...(d.search_results ?? []).map((s) => s.url)],
    };
  }),
  gemini: process.env.GEMINI_API_KEY && (async (q) => {
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const d = await post(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, { "x-goog-api-key": process.env.GEMINI_API_KEY }, {
      contents: [{ parts: [{ text: `${q} (I am in Pakistan.)` }] }],
      tools: [{ google_search: {} }],
    });
    const c = d.candidates?.[0];
    return {
      text: (c?.content?.parts ?? []).map((p) => p.text ?? "").join("\n"),
      // Grounding links are redirect URLs; the title carries the source domain.
      sources: (c?.groundingMetadata?.groundingChunks ?? []).map((g) => `${g.web?.title ?? ""} ${g.web?.uri ?? ""}`),
    };
  }),
};

const active = Object.entries(engines).filter(([, fn]) => fn);
if (!active.length) {
  console.log("No AI engine API keys are set (/slc/openai-api-key, /slc/perplexity-api-key, /slc/gemini-api-key). Nothing checked.");
  process.exit(0);
}

const run = { date: new Date().toISOString().slice(0, 10), results: {} };
const competitors = new Map();
for (const q of cfg.questions) {
  run.results[q] = {};
  for (const [name, ask] of active) {
    try {
      const { text, sources } = await ask(q);
      const cited = sources.some((s) => s.includes(domain));
      run.results[q][name] = { mentioned: brandRe.test(text) || cited, cited };
      for (const s of sources) {
        const host = (s.match(/https?:\/\/([^/\s]+)/)?.[1] ?? s.trim().split(/\s/)[0] ?? "").replace(/^www\./, "");
        if (host && !host.includes(domain) && !host.includes("vertexaisearch")) competitors.set(host, (competitors.get(host) ?? 0) + 1);
      }
    } catch (e) {
      run.results[q][name] = { error: e.message.slice(0, 160) };
    }
  }
}

const history = existsSync(historyFile) ? JSON.parse(readFileSync(historyFile, "utf8")) : [];
const last = history.at(-1);
history.push(run);
writeFileSync(historyFile, JSON.stringify(history.slice(-24), null, 1));

const score = (r) => Object.values(r.results).flatMap((e) => Object.values(e)).filter((x) => x.mentioned).length;
const asked = cfg.questions.length * active.length;
const lines = [
  `AI answer check, ${run.date}: SLC mentioned in ${score(run)} of ${asked} answers${last ? ` (last run ${last.date}: ${score(last)})` : ""}.`,
  `Engines: ${active.map(([n]) => n).join(", ")}`,
  "",
];
for (const q of cfg.questions) {
  const cells = active.map(([n]) => {
    const r = run.results[q][n];
    const was = last?.results?.[q]?.[n];
    const mark = r.error ? "error" : r.cited ? "CITED" : r.mentioned ? "mentioned" : "-";
    const change = was && !r.error && !!was.mentioned !== !!r.mentioned ? (r.mentioned ? " (new)" : " (lost)") : "";
    return `${n}: ${mark}${change}`;
  });
  lines.push(`- ${q}\n    ${cells.join(" · ")}`);
}
const errors = Object.values(run.results).flatMap((e) => Object.entries(e)).filter(([, x]) => x.error);
if (errors.length) lines.push("", `Errors (${errors.length}): ${errors[0][0]}: ${errors[0][1].error}`);
lines.push("", "Sites the engines cited most (who to beat, or to get listed on):");
lines.push(...[...competitors].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([h, n]) => `- ${h} (${n})`));
console.log(lines.join("\n"));
