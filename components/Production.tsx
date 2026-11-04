// "In production": each framework's own Node server at 100 pages (benchmarks/compare/prod.mjs in
// Tettu0530/nowaki), median of 5 runs. Three groups in the measured-bar style: post-page
// throughput rendered per request, the same with each framework's ISR, and idle memory.
// The rank, the CSP comparison and the "no ISR" list are computed from the data.
import { SCALING, SOURCE_COMMIT } from "../lib/scaling.ts";
import type { Prod } from "../lib/scaling.ts";
import { STRINGS } from "../lib/i18n.ts";
import type { Locale } from "../lib/i18n.ts";

const FWS = ["nowaki", "astro", "sveltekit", "next", "nuxt"];
const minor = (v: string) => v.split(".").slice(0, 2).join(".");

function Group({ title, rows, value, unit, best, locale }: { title: string; rows: Prod[]; value: (p: Prod) => number; unit: string; best: "high" | "low"; locale: Locale }) {
  const sorted = [...rows].sort((a, b) => (best === "high" ? value(b) - value(a) : value(a) - value(b)));
  const max = Math.max(...rows.map(value));
  const fmt = new Intl.NumberFormat(locale === "ja" ? "ja-JP" : "en-US", { maximumFractionDigits: 0 });
  return (
    <div class="bars__group">
      <h4>{title}</h4>
      {sorted.map((p) => {
        const us = p.framework === "nowaki";
        return (
          <div>
            <div class="bar__top">
              <span class={`bar__label${us ? " is-us" : ""}`}>
                {p.label} <small>{minor(p.version)}</small>
              </span>
              <span class={`bar__val${us ? "" : " is-muted"}`}>
                {fmt.format(value(p))} {unit}
              </span>
            </div>
            <div class="bar__track">
              <div class={`bar__fill${us ? "" : " is-muted"}`} style={`width:${Math.max((value(p) / max) * 100, 1).toFixed(1)}%`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Production({ locale }: { locale: Locale }) {
  const prod = SCALING?.prod;
  if (!prod) return null;
  const t = STRINGS[locale].compare.prod;
  const plain = FWS.map((k) => prod[k]).filter(Boolean);
  const isr = FWS.map((k) => prod[`${k}+isr`]).filter(Boolean);
  const noIsr = plain.filter((p) => !prod[`${p.framework}+isr`]).map((p) => p.label);
  const rank = [...plain].sort((a, b) => b.postRps - a.postRps).findIndex((p) => p.framework === "nowaki") + 1;
  const csp = prod["nowaki+csp"];
  const now = prod.nowaki;
  const fmt = new Intl.NumberFormat(locale === "ja" ? "ja-JP" : "en-US", { maximumFractionDigits: 0 });
  const list = (xs: string[]) => (locale === "ja" ? xs.join(" と ") : xs.join(" and "));
  const notes = [
    rank > 1 ? t.rank.replace("{rank}", t.ordinals[rank - 1]) : "",
    t.isr.replace("{noisr}", list(noIsr)),
    t.mem,
    csp && now ? t.csp.replace("{csp}", fmt.format(csp.postRps)).replace("{plain}", fmt.format(now.postRps)) : "",
  ].filter(Boolean);
  const meta = t.note.replace("{runs}", String(now?.runs ?? 5)).replace("{machine}", SCALING!.machine.split(",").slice(0, 3).join(",")).replace("{date}", SCALING!.measured);
  return (
    <div class="scale prod" id="production">
      <div class="bench__head">
        <h3 dangerouslySetInnerHTML={{ __html: t.h3 }} />
        <p class="lead">{t.lead}</p>
      </div>
      <div class="bench__groups">
        <Group title={t.groups[0]} rows={plain} value={(p) => p.postRps} unit="req/s" best="high" locale={locale} />
        <Group title={t.groups[1]} rows={isr} value={(p) => p.postRps} unit="req/s" best="high" locale={locale} />
        <Group title={t.groups[2]} rows={plain} value={(p) => p.idleMB} unit="MB" best="low" locale={locale} />
      </div>
      <ul class="prod__notes">
        {notes.map((n) => (
          <li dangerouslySetInnerHTML={{ __html: n }} />
        ))}
      </ul>
      <p class="note bench__note" dangerouslySetInnerHTML={{ __html: meta }} />
      <a class="tlink bench__src" href={`https://github.com/Tettu0530/nowaki/blob/${SOURCE_COMMIT}/benchmarks/compare/README.md#production-servers`}>
        {t.method}
      </a>
    </div>
  );
}
