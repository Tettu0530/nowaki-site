// The docs-site benchmark on /benchmarks: the same content-collection docs site built by Nowaki and
// Astro at 20, 100 and 500 entries, with and without caches. Read at render time from
// benchmarks/docs-site/summary.json (a verbatim copy, see its README). Cold numbers, where Nowaki
// is slower, are shown next to the warm ones on the same scale.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { STRINGS, GH } from "../lib/i18n.ts";
import type { Locale } from "../lib/i18n.ts";

type Stat = { median: number; p25: number; p75: number };
type Size = { cold: Stat; warm: Stat; pages: Record<string, { jsKB: number }> };
type Fw = { label: string; version: string; sizes: Record<string, Size> };
type DocsSite = { measured: string; machine: string; frameworks: Record<string, Fw> };

function load(): DocsSite | null {
  try {
    return JSON.parse(readFileSync(join(process.cwd(), "benchmarks/docs-site/summary.json"), "utf8"));
  } catch {
    return null;
  }
}
const DATA = load();

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" style="display:inline-block;vertical-align:-2px;margin-left:.35em">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
}

const ms = (v: number) => `${Math.round(v).toLocaleString("en-US")} ms`;

export default function DocsSite({ locale }: { locale: Locale }) {
  const now = DATA?.frameworks.nowaki;
  const astro = DATA?.frameworks.astro;
  if (!DATA || !now || !astro) return null;
  const t = STRINGS[locale].docsSite;
  const sizes = Object.keys(now.sizes).filter((n) => astro.sizes[n]).sort((a, b) => +a - +b);
  const max = Math.max(...sizes.flatMap((n) => [now.sizes[n].cold.median, now.sizes[n].warm.median, astro.sizes[n].cold.median, astro.sizes[n].warm.median]));
  const ratios = sizes.map((n) => astro.sizes[n].warm.median / now.sizes[n].warm.median);
  const jsOf = (fw: Fw) => Math.max(...sizes.flatMap((n) => Object.values(fw.sizes[n].pages ?? {}).map((p) => p.jsKB)));
  const machine = DATA.machine.split(",").slice(0, 3).join(",");
  return (
    <div class="bench" id="docs-site">
      <div class="bench__head">
        <h3 dangerouslySetInnerHTML={{ __html: t.h2 }} />
        <p class="lead">{t.lead}</p>
      </div>
      <div class="bench__groups">
        {sizes.map((n) => {
          const rows = [
            { label: `Nowaki · ${t.warm}`, v: now.sizes[n].warm.median, us: true },
            { label: `Nowaki · ${t.cold}`, v: now.sizes[n].cold.median, us: true },
            { label: `Astro · ${t.warm}`, v: astro.sizes[n].warm.median, us: false },
            { label: `Astro · ${t.cold}`, v: astro.sizes[n].cold.median, us: false },
          ];
          return (
            <div class="bars__group">
              <h4>{t.group.replace("{n}", n)}</h4>
              {rows.map((r) => (
                <div>
                  <div class="bar__top">
                    <span class={`bar__label${r.us ? " is-us" : ""}`}>{r.label}</span>
                    <span class={`bar__val${r.us ? "" : " is-muted"}`}>{ms(r.v)}</span>
                  </div>
                  <div class="bar__track">
                    <div class={`bar__fill${r.us ? "" : " is-muted"}`} style={`width:${Math.max((r.v / max) * 100, 1).toFixed(1)}%`} />
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <p class="note bench__note">
        {t.slower.replace("{min}", Math.min(...ratios).toFixed(1)).replace("{max}", Math.max(...ratios).toFixed(1))}{" "}
        {t.js.replace("{nowaki}", String(jsOf(now))).replace("{astro}", String(jsOf(astro)))}
      </p>
      <p class="note bench__note">{t.note.replace("{machine}", machine).replace("{date}", DATA.measured).replace("{nowaki}", now.version).replace("{astro}", astro.version)}</p>
      <p style="display:flex;flex-wrap:wrap;gap:8px 24px">
        <a class="tlink bench__src" href={`${GH}/blob/main/BENCHMARKS.md#docs-site--nowaki-vs-astro`}>
          {t.method}
          <Arrow />
        </a>
        <a class="tlink bench__src" href={locale === "ja" ? "/docs/migrate-astro/" : "/docs/migrate-astro/"}>
          {t.guide}
          <Arrow />
        </a>
      </p>
    </div>
  );
}
