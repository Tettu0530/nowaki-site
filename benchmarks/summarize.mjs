// Folds the raw runs into benchmarks/results/summary.json, which the landing page reads.
//   dev and build: the median of each framework's latest runs in results/runs.jsonl
//   first-load JS: the latest browser measurement in results/browser.jsonl
// Usage: node benchmarks/summarize.mjs
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const R = path.join(import.meta.dirname, "results");
const lines = (f) => readFileSync(path.join(R, f), "utf8").trim().split("\n").filter(Boolean).map((l) => JSON.parse(l));
const median = (xs) => {
  const s = xs.filter((x) => x != null).sort((a, b) => a - b);
  return s.length ? s[Math.floor((s.length - 1) / 2)] : null;
};

const runs = lines("runs.jsonl");
const browser = lines("browser.jsonl");
const order = ["nowaki", "astro", "sveltekit", "next", "nuxt"];
const out = [];
for (const fw of order) {
  const mine = runs.filter((r) => r.framework === fw);
  if (!mine.length) continue;
  // The latest series: runs since the last run numbered 1.
  const start = mine.map((r) => r.run).lastIndexOf(1);
  const series = mine.slice(start);
  const js = browser.filter((b) => b.framework === fw).pop();
  out.push({
    framework: fw,
    label: series[0].label,
    version: series[0].version,
    runs: series.length,
    devMs: median(series.map((r) => r.devMs)),
    buildMs: median(series.map((r) => r.buildMs)),
    jsKB: js ? Math.round(js.gzKB * 10) / 10 : null,
    jsFiles: js?.files ?? null,
    // JS that loads only once the page is idle (Nowaki's SPA router), from the browser file list.
    idleKB: js ? Math.round(js.list.filter((l) => /\/router(-core)?\./.test(l) && fw === "nowaki").reduce((n, l) => n + Number.parseFloat(l), 0) * 10) / 10 : 0,
    devRuns: series.map((r) => r.devMs),
    buildRuns: series.map((r) => r.buildMs),
  });
}
const summary = {
  measured: runs[runs.length - 1].at.slice(0, 10),
  machine: runs[runs.length - 1].machine,
  frameworks: out,
};
writeFileSync(path.join(R, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
console.log("| framework | dev ready (cold) | build | first-load JS (gzip) |\n|---|---|---|---|");
for (const f of out) console.log(`| ${f.label} ${f.version} | ${f.devMs} ms | ${f.buildMs} ms | ${f.jsKB} KB |`);
console.log(`\n${summary.measured} · ${summary.machine}`);
