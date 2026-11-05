// The landing page, redesigned 2026-11-05 from the approved prototype. Seven beats: the island-map
// hero, this page's JavaScript, Jetstream, the build figure, one benchmark chart with four tabs, where
// it stands, and the close. The full benchmarks live on /benchmarks. Every number is computed: the
// ledger from the build (lib/bundle.ts), the bench tabs and facts from benchmarks/scaling/summary.json.
// Every animation is CSS (lib/home-style.ts); the only script is the copy-button island.
import CopyCommand from "../islands/CopyCommand.tsx";
import SiteNav from "./SiteNav.tsx";
import SiteFooter from "./SiteFooter.tsx";
import { STRINGS, GH } from "../lib/i18n.ts";
import type { Locale } from "../lib/i18n.ts";
import { NOWAKI_RELEASE, NOWAKI_VERSION } from "../lib/version.ts";
import { shipped } from "../lib/bundle.ts";
import { SCALING, SOURCE_COMMIT } from "../lib/scaling.ts";
import { JETSTREAM, LIVE_JS_KB } from "../lib/explainers.ts";

const FWS = ["nowaki", "astro", "sveltekit", "next", "nuxt"] as const;
const minor = (v: string) => v.split(".").slice(0, 2).join(".");
const int = (v: number) => Math.round(v).toLocaleString("en-US");

function Arrow() {
  return (
    <svg class="h-arrow" width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
}

/** An island snapped to the 24px lattice: x, y, w, h in cells, d = when it surfaces. */
function Isl({ x, y, w, h, d, live, label }: { x: number; y: number; w: number; h: number; d: number; live?: boolean; label: string }) {
  return (
    <div class={`h-isl${live ? " h-isl--live" : ""}`} style={`--x:${x};--y:${y};--w:${w};--h:${h};--d:${d}s`}>
      <span class="h-isl__label" dangerouslySetInnerHTML={{ __html: label }} />
    </div>
  );
}

// The four bench tabs. "high" metrics sort descending, the rest ascending.
type Metric = { better: "high" | "low"; get: (fw: string) => number | undefined; fmt: (v: number) => string };
const METRICS: Metric[] = [
  { better: "high", get: (fw) => SCALING?.prod?.[fw]?.postRps, fmt: int },
  { better: "low", get: (fw) => SCALING?.frameworks[fw]?.cells["1000x1"]?.static.median, fmt: (v) => `${int(v)} ms` },
  { better: "low", get: (fw) => SCALING?.frameworks[fw]?.cells["1000x1"]?.devFirst.median, fmt: (v) => `${int(v)} ms` },
  { better: "low", get: (fw) => SCALING?.frameworks[fw]?.cells["10x1"]?.home.jsKB, fmt: (v) => `${v.toFixed(1)} KB` },
];

function benchModel() {
  if (!SCALING?.prod) return null;
  const fws = FWS.filter((fw) => SCALING!.frameworks[fw] && METRICS.every((m) => m.get(fw) !== undefined));
  const ranks = METRICS.map((m) => {
    const sorted = [...fws].sort((a, b) => (m.better === "high" ? m.get(b)! - m.get(a)! : m.get(a)! - m.get(b)!));
    const max = Math.max(...fws.map((fw) => m.get(fw)!));
    return { order: (fw: string) => sorted.indexOf(fw as (typeof fws)[number]) + 1, width: (fw: string) => `${Math.max((m.get(fw)! / max) * 100, 1).toFixed(1)}%`, first: sorted[0] };
  });
  const rows = fws.map((fw) => ({
    fw,
    label: `${SCALING!.frameworks[fw].label} ${minor(SCALING!.frameworks[fw].version)}`,
    vars: METRICS.map((_, i) => `--o${i + 1}:${ranks[i].order(fw)};--w${i + 1}:${ranks[i].width(fw)}`).join(";"),
    values: METRICS.map((m) => m.fmt(m.get(fw)!)),
  }));
  const wins = ranks.filter((r) => r.first === "nowaki").length;
  const jsLeader = SCALING!.frameworks[ranks[3].first].label;
  const prod = SCALING!.prod!;
  const now = prod.nowaki;
  const others = FWS.filter((fw) => fw !== "nowaki" && prod[fw]);
  const rival = others.map((fw) => prod[fw]).sort((a, b) => a.ttfbP50 - b.ttfbP50)[0];
  const memLeast = others.every((fw) => prod[fw].idleMB > now.idleMB);
  return { rows, wins, total: METRICS.length, jsLeader, now, rival, memLeast };
}

export default function Landing({ locale }: { locale: Locale }) {
  const s = STRINGS[locale];
  const h = s.home;
  const base = locale === "ja" ? "/ja/" : "/";
  const ship = shipped(["CopyCommand"]);
  const kb = ship ? (ship.total / 1024).toFixed(1) : "11";
  // Japanese names the ledger rows; English shows the role as computed.
  const roles = ("roles" in s.proof.ledger ? s.proof.ledger.roles : {}) as Record<string, string>;
  const bm = benchModel();
  const fanout = JETSTREAM[locale].fanout.stats[0].v.replace(/\.0(?=\s)/, "");
  const machine = SCALING ? SCALING.machine.split(",").slice(0, 3).join(",") : "";
  let k = 0;

  return (
    <>
      <a class="skip" href="#main">
        {locale === "ja" ? "本文へスキップ" : "Skip to content"}
      </a>

      <SiteNav locale={locale} page="home" />

      <main id="main">
        {/* ── hero: the island map ── */}
        <section class="h-hero" aria-labelledby="hero-h">
          <div class="wrap h-hero__in">
            <div>
              <h1 id="hero-h" lang={locale === "ja" ? "en" : undefined}>
                <span dangerouslySetInnerHTML={{ __html: s.hero.h1a }} />
                <span dangerouslySetInnerHTML={{ __html: s.hero.h1b }} />
              </h1>
              <p class="h-sub">{s.hero.sub}</p>
              <div class="h-cta">
                <CopyCommand cmd="npm create nowaki@latest" labelCopy={s.copy.copy} labelCopied={s.copy.copied} />
                <a class="btn btn--line" href="/docs/quickstart/">
                  {s.hero.docs}
                </a>
              </div>
              <p class="h-release">
                <span>
                  {h.release.label}{" "}
                  <strong>
                    {NOWAKI_RELEASE}
                    {locale === "ja" ? "" : " "}
                    {h.release.name}
                  </strong>
                  {locale === "ja" ? "：" : ": "}
                  {h.release.summary}
                </span>
                <a class="tlink" href={`${GH}/releases/tag/v${NOWAKI_VERSION}`}>
                  {s.hero.notes}
                </a>
              </p>
              <p class="h-alpha">{s.hero.note}</p>
            </div>
            <figure class="h-fig">
              <div class="h-map" role="img" aria-label={h.mapLabel}>
                <div class="h-map__sea h-lattice" />
                <Isl x={2} y={2} w={9} h={2} d={0.25} label={"&lt;Search <b>client:load</b> /&gt;"} />
                <Isl x={9} y={7} w={11} h={4} d={1.15} label={"&lt;Comments <b>client:visible</b> /&gt;"} />
                <Isl x={2} y={13} w={6} h={3} d={0.7} live label={"&lt;Likes <b>live</b> /&gt;"} />
                <div class="h-wire" style="--x:8;--y:14.5;--w:7;--d:1.4s">
                  <span>/__nowaki/live</span>
                  <i class="h-out" />
                  <i class="h-back" />
                </div>
                <div class="h-srv" style="--x:15;--y:13.5;--w:6;--h:2;--d:1.5s">
                  <b>nowaki start</b>
                  <small>{h.server}</small>
                </div>
              </div>
              <figcaption class="h-legend">
                <span>
                  <i class="h-k-html" />
                  {s.hero.key[0]}
                </span>
                <span>
                  <i class="h-k-isl" />
                  {s.hero.key[1]}
                </span>
                <span>
                  <i class="h-k-live" />
                  {s.hero.key[2]}
                </span>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ── this page's JavaScript, from the build ── */}
        {ship ? (
          <section class="h-sec" id="proof" aria-labelledby="proof-h">
            <div class="wrap">
              <div class="h-rail">
                <h2 id="proof-h">{s.proof.h2.replaceAll("{kb}", kb)}</h2>
                <p>{h.proofLead}</p>
              </div>
              <div class="h-body">
                <div class="h-stack" role="img" aria-label={`${kb} KB`}>
                  {ship.files.map((f) => {
                    const cls = f.role.endsWith(" island") ? "h-kisl" : `h-k${k++}`;
                    return <i class={cls} style={`--kb:${(f.bytes / 1024).toFixed(2)}`} />;
                  })}
                </div>
                <ul class="h-ledger">
                  {(() => {
                    let j = 0;
                    return ship.files.map((f) => {
                      const cls = f.role.endsWith(" island") ? "h-kisl" : `h-k${j++}`;
                      return (
                        <li class={cls}>
                          <span>{roles[f.role] ?? f.role}</span>
                          <code>{f.file}</code>
                          <b>{(f.bytes / 1024).toFixed(1)} KB</b>
                        </li>
                      );
                    });
                  })()}
                  <li class="h-total">
                    <span>{s.proof.ledger.total}</span>
                    <code>{s.proof.ledger.note}</code>
                    <b>{kb} KB</b>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        ) : null}

        {/* ── Jetstream: a CSS-only round trip ── */}
        <section class="h-sec" id="jet" aria-labelledby="jet-h">
          <div class="wrap">
            <div class="h-rail">
              <h2 id="jet-h">{h.jet.h2}</h2>
              <p>{h.jet.lead.replace("{live}", LIVE_JS_KB)}</p>
              <a class="tlink" href={`${base}jetstream/`}>
                {s.jet.demo.more}
                <Arrow />
              </a>
            </div>
            <div class="h-body">
              <div class="h-jd">
                <input type="checkbox" id="h-like" class="h-toggle" aria-label={s.jet.demo.label} aria-describedby="h-jd-note" />
                <div class="h-lanes">
                  <div class="h-lane">
                    <span class="h-lane__h">{h.jet.lanes[0].h}</span>
                    <label for="h-like" class="h-like" aria-hidden="true">
                      <svg viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M8 13.6 2.6 8.4A3.3 3.3 0 0 1 8 4.2a3.3 3.3 0 0 1 5.4 4.2Z" fill="currentColor" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" />
                      </svg>
                      <span class="h-sw">
                        <span class="h-off">{s.jet.demo.like} · 41</span>
                        <span class="h-on">{s.jet.demo.liked} · 42</span>
                      </span>
                    </label>
                    <span class="h-lane__s">{h.jet.lanes[0].s}</span>
                  </div>
                  <div class="h-lane">
                    <span class="h-lane__h">{h.jet.lanes[1].h}</span>
                    <span class="h-lane__s">{h.jet.lanes[1].s}</span>
                  </div>
                  <div class="h-lane">
                    <span class="h-lane__h">{h.jet.lanes[2].h}</span>
                    <span class="h-state">
                      {"{ likes: "}
                      <b class="h-sw">
                        <span class="h-off">41</span>
                        <span class="h-on">42</span>
                      </b>
                      {" }"}
                    </span>
                    <span class="h-lane__s">{h.jet.lanes[2].s}</span>
                  </div>
                  <div class="h-track" aria-hidden="true">
                    <i class="h-pkt" />
                  </div>
                </div>
                <ol class="h-caps">
                  {h.jet.caps.map((c, i) => (
                    <li style={`--i:${i}`}>
                      <b>{c.t}</b>
                      {c.d}
                    </li>
                  ))}
                </ol>
                <small class="h-jd__note" id="h-jd-note">
                  {h.jet.note}
                </small>
              </div>
              <ul class="h-points">
                {h.jet.points.map((p) => (
                  <li>
                    <b>{p.t}</b>
                    <span dangerouslySetInnerHTML={{ __html: p.d }} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── build: three panes joined by moving packets ── */}
        <section class="h-sec h-wide" id="build" aria-labelledby="build-h">
          <div class="wrap">
            <div class="h-wide__head">
              <h2 id="build-h">{s.build.h2}</h2>
              <div>
                <p>{h.build.lead}</p>
                <a class="tlink" href="/docs/">
                  {s.build.more}
                  <Arrow />
                </a>
              </div>
            </div>
            <div class="h-flow">
              <div class="h-pane">
                <div class="h-pane__h">
                  <h3>{h.build.panes[0]}</h3>
                  <span>routes/index.tsx</span>
                </div>
                <pre>
                  <span class="k">export const</span> loader = () =&gt; db.posts();{"\n\n"}
                  <span class="k">export default function</span> Home({"{ data }"}) {"{\n"}
                  {"  "}
                  <span class="k">return</span> ({"\n"}
                  {"    <main>\n"}
                  {"      <Posts items={data} />\n"}
                  {"      <Counter "}
                  <span class="h">client:visible</span>
                  {" />\n"}
                  {"      <Likes />\n"}
                  {"    </main>\n"}
                  {"  );\n}"}
                </pre>
              </div>
              <div class="h-link" aria-hidden="true">
                <i />
              </div>
              <div class="h-pane">
                <div class="h-pane__h">
                  <h3>{h.build.panes[1]}</h3>
                  <span>islands/</span>
                </div>
                <div>
                  <pre>
                    <span class="c">{h.build.counter}</span>
                    {"\n"}
                    <span class="k">export default function</span> Counter() {"{\n"}
                    {"  "}
                    <span class="k">const</span> [n, set] = useState(0);{"\n  …\n}"}
                  </pre>
                  <pre>
                    <span class="c">{h.build.likes}</span>
                    {"\n"}
                    <span class="h">export const live</span> = {"{\n"}
                    {"  state: () => ({ likes: 0 }),\n"}
                    {"  on: { like: (s) => ({ likes: s.likes + 1 }) },\n};"}
                  </pre>
                </div>
              </div>
              <div class="h-link" aria-hidden="true">
                <i style="--d:1.2s" />
              </div>
              <div class="h-pane">
                <div class="h-pane__h">
                  <h3>{h.build.panes[2]}</h3>
                  <span>nowaki build</span>
                </div>
                <ul class="h-term">
                  <li>
                    <span class="h-dim">$</span> nowaki build
                  </li>
                  <li>
                    <span class="h-ok">✓</span> index.html<span class="h-sz">HTML</span>
                  </li>
                  <li>
                    <span class="h-ok">✓</span> Counter.03ac9eac.js<span class="h-sz">0.2 KB</span>
                  </li>
                  <li>
                    <span class="h-ok">✓</span> islands.js<span class="h-sz">1.1 KB</span>
                  </li>
                  <li>
                    <span class="h-ok">✓</span> live.js<span class="h-sz">{LIVE_JS_KB} KB</span>
                  </li>
                  <li>
                    <span class="h-dim">·</span> Likes<span class="h-sz">0 KB, live</span>
                  </li>
                  <li>
                    <span class="h-dim">·</span> / within its JS budget
                  </li>
                  <li>
                    <span class="h-dim">$</span> nowaki start
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── benchmarks: one chart, four metrics ── */}
        {bm ? (
          <section class="h-sec" id="bench" aria-labelledby="bench-h">
            <div class="wrap">
              <div class="h-rail">
                <h2 id="bench-h" dangerouslySetInnerHTML={{ __html: h.bench.h2 }} />
                <p>
                  {h.bench.lead}
                  {locale === "ja" ? "" : " "}
                  {h.bench.leads.replace("{n}", String(bm.wins)).replace("{m}", String(bm.total))}
                  {locale === "ja" ? "" : " "}
                  {h.bench.leastJs.replace("{leader}", bm.jsLeader)}
                </p>
                <a class="tlink" href={`${base}benchmarks/`}>
                  {h.bench.more}
                  <Arrow />
                </a>
              </div>
              <div class="h-body">
                <div>
                  {[1, 2, 3, 4].map((n) => (
                    <input type="radio" name="h-metric" id={`hm${n}`} class="h-toggle" checked={n === 1} aria-label={h.bench.tabs[n - 1]} />
                  ))}
                  <div class="h-tabs" aria-hidden="true">
                    {h.bench.tabs.map((t, i) => (
                      <label for={`hm${i + 1}`}>{t}</label>
                    ))}
                  </div>
                  <div class="h-chart">
                    {bm.rows.map((r) => (
                      <div class={`h-bar${r.fw === "nowaki" ? " is-us" : ""}`} style={r.vars}>
                        <div class="h-bar__top">
                          <span>{r.label}</span>
                          <b>
                            {r.values.map((v, i) => (
                              <span class={`h-v h-v${i + 1}`}>{v}</span>
                            ))}
                          </b>
                        </div>
                        <div class="h-trk">
                          <div class="h-fill" />
                        </div>
                      </div>
                    ))}
                  </div>
                  {h.bench.notes.map((t, i) => (
                    <p class={`h-mnote h-mnote${i + 1}`}>{t}</p>
                  ))}
                </div>
                <div class="h-facts">
                  <div class="h-fact">
                    <b>{fanout}</b>
                    <span>{h.bench.fanout}</span>
                  </div>
                  <div class="h-fact">
                    <b>{bm.now.ttfbP50.toFixed(2)} ms</b>
                    <span>{h.bench.ttfb.replace("{other}", bm.rival.label).replace("{them}", bm.rival.ttfbP50.toFixed(2))}</span>
                  </div>
                  <div class="h-fact">
                    <b>{Math.round(bm.now.idleMB)} MB</b>
                    <span>{bm.memLeast ? h.bench.memLeast : h.bench.mem}</span>
                  </div>
                </div>
                <p class="h-src">{h.bench.src.replace("{machine}", machine).replace("{date}", SCALING!.measured).replace("{commit}", SOURCE_COMMIT)}</p>
              </div>
            </div>
          </section>
        ) : null}

        {/* ── where it stands ── */}
        <section class="h-sec" aria-labelledby="fit-h">
          <div class="wrap">
            <div class="h-rail">
              <h2 id="fit-h">{s.fit.h2}</h2>
              <p>{h.fitLead}</p>
              <a class="tlink" href={`${GH}/blob/main/ROADMAP.md`}>
                {s.fit.roadmap}
                <Arrow />
              </a>
            </div>
            <div class="h-body">
              <div class="h-lists">
                {[
                  { cls: "h-ok", title: s.fit.forTitle, items: s.fit.for },
                  { cls: "h-no", title: s.fit.notTitle, items: s.fit.not },
                  { cls: "h-soon", title: s.fit.soonTitle, items: s.fit.soon },
                ].map((c) => (
                  <div class={c.cls}>
                    <h3>{c.title}</h3>
                    <ul>
                      {c.items.map((x) => (
                        <li>{x}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── close: one island waiting for your app ── */}
        <section class="h-close" aria-labelledby="close-h">
          <div class="h-close__sea h-lattice" aria-hidden="true" />
          <div class="wrap">
            <div class="h-close__copy">
              <h2 id="close-h" dangerouslySetInnerHTML={{ __html: s.close.h2 }} />
              <div class="h-cta" style="margin:0">
                <CopyCommand cmd="npm create nowaki@latest" labelCopy={s.copy.copy} labelCopied={s.copy.copied} />
                <a class="btn btn--line" href="/docs/quickstart/">
                  {s.close.docs}
                </a>
              </div>
            </div>
            <div class="h-map" aria-hidden="true">
              <Isl x={1} y={2} w={10} h={3} d={0} live label={"&lt;YourApp /&gt;"} />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} />
    </>
  );
}
