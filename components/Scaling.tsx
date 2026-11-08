// "At scale": the same blog at 1 to 1000 pages and at 1 or 10 islands, five frameworks.
// Server-rendered SVG (no client JS): a highlight chart (Nowaki in susuki, the rest grey),
// direct labels at each line's end, a native tooltip on every point, and a table view.
import { SCALING, PAGES, SOURCE_COMMIT } from "../lib/scaling.ts";
import type { ScalingFw } from "../lib/scaling.ts";
import { STRINGS } from "../lib/i18n.ts";
import type { Locale } from "../lib/i18n.ts";

const ORDER = ["nowaki", "astro", "sveltekit", "next", "nuxt"];
const W = 480;
const H = 280;
const M = { l: 50, r: 92, t: 14, b: 50 };
const PW = W - M.l - M.r;
const PH = H - M.t - M.b;

const minor = (v: string) => v.split(".").slice(0, 2).join(".");

function niceTicks(max: number): number[] {
  const steps = [100, 200, 250, 500, 1000, 2000, 2500, 5000];
  const step = steps.find((s) => max / s <= 5) ?? 10000;
  const top = Math.ceil(max / step) * step;
  const out = [];
  for (let v = 0; v <= top; v += step) out.push(v);
  return out;
}

/** Spread end labels so none sit closer than `gap` px, keeping their order. */
function spread(ys: { k: string; y: number }[], gap: number, lo: number, hi: number) {
  const s = [...ys].sort((a, b) => a.y - b.y);
  for (let i = 1; i < s.length; i++) if (s[i].y - s[i - 1].y < gap) s[i].y = s[i - 1].y + gap;
  const over = s[s.length - 1].y - hi;
  if (over > 0) for (const p of s) p.y -= over;
  for (let i = s.length - 2; i >= 0; i--) if (s[i + 1].y - s[i].y < gap) s[i].y = s[i + 1].y - gap;
  if (s[0].y < lo) for (const p of s) p.y += lo - s[0].y;
  return Object.fromEntries(s.map((p) => [p.k, p.y]));
}

function Chart({ title, metric, axis, fws }: { title: string; metric: "static" | "devFirst"; axis: string; fws: [string, ScalingFw][] }) {
  const val = (f: ScalingFw, p: number) => f.cells[`${p}x1`][metric];
  const max = Math.max(...fws.flatMap(([, f]) => PAGES.map((p) => val(f, p).median)));
  const ticks = niceTicks(max);
  const top = ticks[ticks.length - 1];
  const x = (i: number) => M.l + (i / (PAGES.length - 1)) * PW;
  const y = (v: number) => M.t + PH - (v / top) * PH;
  const ends = spread(
    fws.map(([k, f]) => ({ k, y: y(val(f, 1000).median) })),
    18,
    M.t + 4,
    M.t + PH,
  );
  // Draw Nowaki last so it sits on top.
  const drawn = [...fws].sort(([a], [b]) => (a === "nowaki" ? 1 : b === "nowaki" ? -1 : 0));
  return (
    <figure class="sc">
      <figcaption>{title}</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={title}>
        {ticks.map((t) => (
          <g>
            <line class="sc__grid" x1={M.l} x2={M.l + PW} y1={y(t)} y2={y(t)} />
            <text class="sc__tick" x={M.l - 8} y={y(t) + 4} text-anchor="end">
              {t >= 1000 ? `${t / 1000}s` : t}
            </text>
          </g>
        ))}
        {PAGES.map((p, i) => (
          <text class="sc__tick" x={x(i)} y={H - 28} text-anchor="middle">
            {p}
          </text>
        ))}
        <text class="sc__axis" x={M.l + PW / 2} y={H - 4} text-anchor="middle">
          {axis}
        </text>
        {drawn.map(([k, f]) => {
          const us = k === "nowaki";
          const pts = PAGES.map((p, i) => `${x(i).toFixed(1)},${y(val(f, p).median).toFixed(1)}`).join(" ");
          return (
            <g class={`sc__s${us ? " is-us" : ""}`}>
              <polyline points={pts} />
              {PAGES.map((p, i) => {
                const s = val(f, p);
                return (
                  <circle cx={x(i)} cy={y(s.median)} r="4">
                    <title>{`${f.label} ${minor(f.version)}, ${p} ${axis}: ${s.median} ms (${Math.round(s.p25)}–${Math.round(s.p75)})`}</title>
                  </circle>
                );
              })}
              <text class="sc__label" x={M.l + PW + 10} y={ends[k] + 4}>
                {f.label}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}

export default function Scaling({ locale }: { locale: Locale }) {
  if (!SCALING) return null;
  const t = STRINGS[locale].compare.scale;
  const fws = ORDER.filter((k) => SCALING.frameworks[k]).map((k) => [k, SCALING.frameworks[k]] as [string, ScalingFw]);
  const js = fws
    .map(([k, f]) => ({ k, f, one: f.cells["10x1"].home.jsKB, ten: f.cells["10x10"].home.jsKB, per: f.fits.islands.homeJs.perIslandKB }))
    .sort((a, b) => a.ten - b.ten);
  const maxJs = Math.max(...js.map((r) => r.ten));
  const now = js.find((r) => r.k === "nowaki");
  const least = js[0];
  const leastEverywhere = Object.keys(least.f.cells).every((c) => fws.every(([, f]) => f.cells[c].home.jsKB >= least.f.cells[c].home.jsKB));
  const second = js[1];
  const leader =
    now && least.k === "nowaki" && leastEverywhere && second
      ? t.usLeader.replace("{rival}", second.f.label).replace("{a}", second.per.toFixed(2)).replace("{b}", now.per.toFixed(2))
      : now && least.k !== "nowaki" && leastEverywhere
      ? t.leader.replaceAll("{leader}", least.f.label).replace("{a}", least.per.toFixed(2)).replace("{b}", now.per.toFixed(2))
      : "";
  const note = t.note.replace("{machine}", SCALING.machine.split(",").slice(0, 3).join(",")).replace("{date}", SCALING.measured);
  const fmt = (v: number) => String(Math.round(v));
  return (
    <div class="scale" id="scale">
      <div class="bench__head">
        <h3 dangerouslySetInnerHTML={{ __html: t.h3 }} />
        <p class="lead">{t.lead}</p>
      </div>
      <div class="scale__charts">
        <Chart title={t.charts[0]} metric="static" axis={t.axis} fws={fws} />
        <Chart title={t.charts[1]} metric="devFirst" axis={t.axis} fws={fws} />
      </div>
      <div class="bars__group scale__js">
        <h4>{t.jsTitle}</h4>
        {js.map((r) => {
          const us = r.k === "nowaki";
          return (
            <div>
              <div class="bar__top">
                <span class={`bar__label${us ? " is-us" : ""}`}>
                  {r.f.label} <small>{minor(r.f.version)}</small>
                </span>
                <span class={`bar__val${us ? "" : " is-muted"}`}>
                  {r.one.toFixed(1)} → {r.ten.toFixed(1)} KB <small>+{r.per.toFixed(2)} {t.perIsland}</small>
                </span>
              </div>
              <div class="bar__track">
                <div class={`bar__fill${us ? "" : " is-muted"}`} style={`width:${Math.max((r.ten / maxJs) * 100, 1).toFixed(1)}%`} />
              </div>
            </div>
          );
        })}
        {leader ? <p class="note scale__leader">{leader}</p> : null}
      </div>
      <details class="scale__table">
        <summary>{t.table}</summary>
        <div class="xt" role="region" aria-label={t.table} tabIndex={0}>
          <table>
            <thead>
              <tr>
                <th scope="col">{t.tableCols[0]}</th>
                {PAGES.map((p) => (
                  <th scope="col">{t.tableCols[1].replace("{p}", String(p))}</th>
                ))}
                {PAGES.map((p) => (
                  <th scope="col">{t.tableCols[2].replace("{p}", String(p))}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fws.map(([, f]) => (
                <tr>
                  <th scope="row">{`${f.label} ${f.version}`}</th>
                  {PAGES.map((p) => (
                    <td>{fmt(f.cells[`${p}x1`].static.median)}</td>
                  ))}
                  {PAGES.map((p) => (
                    <td>{fmt(f.cells[`${p}x1`].devFirst.median)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      <p class="note bench__note">{note}</p>
      <a class="tlink bench__src" href={`https://github.com/Tettu0530/nowaki/blob/${SOURCE_COMMIT}/benchmarks/compare/README.md`}>
        {t.method}
      </a>
    </div>
  );
}
