// The five-framework head-to-head on a tiny counter app (this repo's benchmarks/): one group per
// metric, each sorted from best to worst, bars drawn to scale against the group's largest value,
// Nowaki in susuki. Shown on /benchmarks; every value comes from benchmarks/results/summary.json.
import { STRINGS, SITE_GH } from "../lib/i18n.ts";
import type { Locale } from "../lib/i18n.ts";
import { BENCH } from "../lib/benchmarks.ts";

const METRICS = [
  { key: "devFirstMs", unit: "ms", digits: 0 },
  { key: "buildMs", unit: "ms", digits: 0 },
  { key: "jsKB", unit: "KB", digits: 1 },
] as const;

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" style="display:inline-block;vertical-align:-2px;margin-left:.35em">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
}

export default function Bench({ locale }: { locale: Locale }) {
  if (!BENCH) return null;
  const b = STRINGS[locale].compare.bench;
  const now = BENCH.frameworks.find((f) => f.framework === "nowaki");
  const note = b.note
    .replace("{runs}", String(now?.runs ?? 3))
    .replace("{machine}", BENCH.machine.split(",").slice(0, 3).join(","))
    .replace("{date}", BENCH.measured)
    .replace("{idle}", String(now?.idleKB ?? 0));
  return (
    <div class="bench" id="bench">
      <div class="bench__head">
        <h3 dangerouslySetInnerHTML={{ __html: b.h3 }} />
        <p class="lead">{b.lead}</p>
      </div>
      <div class="bench__groups">
        {METRICS.map((m, gi) => {
          const rows = [...BENCH.frameworks].sort((x, y) => x[m.key] - y[m.key]);
          const max = Math.max(...rows.map((r) => r[m.key]));
          return (
            <div class="bars__group">
              <h4>{b.groups[gi]}</h4>
              {rows.map((r) => {
                const us = r.framework === "nowaki";
                const v = r[m.key];
                return (
                  <div>
                    <div class="bar__top">
                      <span class={`bar__label${us ? " is-us" : ""}`}>
                        {r.label} <small>{r.version.split(".").slice(0, 2).join(".")}</small>
                      </span>
                      <span class={`bar__val${us ? "" : " is-muted"}`}>
                        {v.toFixed(m.digits)} {m.unit}
                      </span>
                    </div>
                    <div class="bar__track">
                      <div class={`bar__fill${us ? "" : " is-muted"}`} style={`width:${Math.max((v / max) * 100, 1).toFixed(1)}%`} />
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <p class="note bench__note" dangerouslySetInnerHTML={{ __html: note }} />
      <a class="tlink bench__src" href={`${SITE_GH}/tree/main/benchmarks`}>
        {b.method}
        <Arrow />
      </a>
    </div>
  );
}
