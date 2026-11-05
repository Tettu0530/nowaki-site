import CopyCommand from "../islands/CopyCommand.tsx";
import SiteNav from "./SiteNav.tsx";
import SiteFooter from "./SiteFooter.tsx";
import BuildFlow from "./BuildFlow.tsx";
import IslandMap, { IslandEl } from "./IslandMap.tsx";
import { STRINGS, GH, SITE_GH } from "../lib/i18n.ts";
import type { Locale } from "../lib/i18n.ts";
import { NOWAKI_RELEASE, NOWAKI_VERSION } from "../lib/version.ts";
import { shipped } from "../lib/bundle.ts";
import { BENCH } from "../lib/benchmarks.ts";
import Scaling from "./Scaling.tsx";
import Production from "./Production.tsx";

const CHANGELOG = `${GH}/blob/main/CHANGELOG.md`;

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" style="display:inline-block;vertical-align:-2px;margin-left:.35em">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
}

function Mark({ no = false }: { no?: boolean }) {
  return no ? (
    <svg class="mark-no" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <circle cx="6" cy="6" r="4.5" fill="none" stroke="currentColor" stroke-width="1.2" />
    </svg>
  ) : (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" style="color:var(--susuki)">
      <path d="M2.2 6.4 4.8 9 9.8 3.4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
}

// The five-framework head-to-head: one group per metric, each sorted from best to worst,
// bars drawn to scale against the group's largest value, Nowaki in susuki.
const METRICS = [
  { key: "devFirstMs", unit: "ms", digits: 0 },
  { key: "buildMs", unit: "ms", digits: 0 },
  { key: "jsKB", unit: "KB", digits: 1 },
] as const;

function Bench({ locale }: { locale: Locale }) {
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

const num = (v: string) => Number.parseFloat(v.replace(/[^\d.]/g, "")) || 0;

export default function Landing({ locale }: { locale: Locale }) {
  const s = STRINGS[locale];
  const ship = shipped(["CopyCommand"]);
  const t = (x: string) => x.replaceAll("{kb}", String(ship?.kb ?? 14));

  return (
    <>
      <a class="skip" href="#main">
        {locale === "ja" ? "本文へスキップ" : "Skip to content"}
      </a>

      <SiteNav locale={locale} page="home" />

      <main id="main">
        <section class="hero">
          <IslandMap keyLabels={s.hero.key} />
          <div class="wrap hero__grid">
            <div class="rel">
              <span class="rel__num rise" style="--rd:.05s" aria-label={`${s.hero.latest}: Nowaki ${NOWAKI_RELEASE}`}>
                {NOWAKI_RELEASE}
              </span>
              <a class="rel__link tlink rise" style="--rd:.15s" href={CHANGELOG}>
                {s.hero.notes}
                <Arrow />
              </a>
              <p class="rel__full rise" style="--rd:.2s">
                {s.hero.latest} · <code>nowaki@{NOWAKI_VERSION}</code> · alpha
              </p>
            </div>
            <div class="pitch">
              <h1 class="rise" style="--rd:.1s" lang={locale === "ja" ? "en" : undefined}>
                <span dangerouslySetInnerHTML={{ __html: s.hero.h1a }} />
                <span dangerouslySetInnerHTML={{ __html: s.hero.h1b }} />
              </h1>
              <p class="pitch__sub rise" style="--rd:.2s">
                {s.hero.sub}
              </p>
              <div class="pitch__cta rise" style="--rd:.3s">
                <CopyCommand cmd="npm create nowaki@latest" labelCopy={s.copy.copy} labelCopied={s.copy.copied} />
                <a class="btn btn--line" href="/docs/quickstart/">
                  {s.hero.docs}
                </a>
              </div>
              <p class="pitch__note rise" style="--rd:.36s">
                {s.hero.note}
              </p>
            </div>
          </div>
        </section>

        <section class="new" aria-labelledby="new-h">
          <div class="wrap new__in">
            <div class="new__h">
              <h2 id="new-h">{s.release.h2}</h2>
            </div>
            <div class="new__list">
              {s.release.items.map((it) => (
                <div class="new__item">
                  <h3>{it.title}</h3>
                  <p dangerouslySetInnerHTML={{ __html: it.body }} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section class="sec wrap" aria-labelledby="proof-h">
          <div class="sec__head">
            <h2 id="proof-h">{t(s.proof.h2)}</h2>
            <p class="lead">{t(s.proof.lead)}</p>
          </div>
          <div class="proof">
          <div class="bars">
            {s.proof.groups.map((g, gi) => {
              const rows = s.proof.bars.filter((b) => b.group === gi);
              const max = Math.max(...rows.map((b) => num(t(b.value))));
              return (
                <div class="bars__group">
                  <h3>{g}</h3>
                  {rows.map((bar) => {
                    const muted = "muted" in bar && bar.muted;
                    return (
                      <div>
                        <div class="bar__top">
                          <span class="bar__label">{bar.label}</span>
                          <span class={`bar__val${muted ? " is-muted" : ""}`}>{t(bar.value)}</span>
                        </div>
                        <div class="bar__track">
                          <div class={`bar__fill${muted ? " is-muted" : ""}`} style={`width:${Math.max((num(t(bar.value)) / max) * 100, 1).toFixed(1)}%`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
            <p class="note" dangerouslySetInnerHTML={{ __html: s.proof.note }} />
          </div>
          <aside class="ledger" aria-labelledby="ledger-h">
            {ship ? (
              <>
                <h3 id="ledger-h">{t(s.proof.ledger.h3)}</h3>
                <table class="ledger__t">
                  <tbody>
                    {ship.files.map((f) => (
                      <tr>
                        <th scope="row">
                          {("roles" in s.proof.ledger ? (s.proof.ledger.roles as Record<string, string>)[f.role] : undefined) ?? f.role}
                          <code>{f.file}</code>
                        </th>
                        <td>{(f.bytes / 1024).toFixed(1)} KB</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th scope="row">{s.proof.ledger.total}</th>
                      <td>{(ship.total / 1024).toFixed(1)} KB</td>
                    </tr>
                  </tfoot>
                </table>
                <p class="ledger__src">{s.proof.ledger.note}</p>
              </>
            ) : null}
          </aside>
          </div>
        </section>

        <section class="sec wrap" aria-labelledby="jet-h">
          <div class="sec__head">
            <h2 id="jet-h">{s.jet.h2}</h2>
            <p class="lead">{s.jet.lead}</p>
          </div>
          {/* A zero-JS simulation: the checkbox state drives every step through CSS. */}
          <div class="jet">
            <input type="checkbox" id="jet-run" class="jet__toggle" aria-label={s.jet.demo.label} aria-describedby="jet-note" />
            <div class="jet__bar">
              <label for="jet-run" class="jet__btn" aria-hidden="true">
                <svg class="jet__heart" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M8 13.6 2.6 8.4A3.3 3.3 0 0 1 8 4.2a3.3 3.3 0 0 1 5.4 4.2Z" fill="currentColor" fill-opacity="0" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" />
                </svg>
                <span class="jet__swap">
                  <span class="jet__off">{s.jet.demo.like} · 12</span>
                  <span class="jet__on">{s.jet.demo.liked} · 13</span>
                </span>
              </label>
              <span class="jet__meta">
                {s.jet.demo.state}{" "}
                <code class="jet__swap">
                  <span class="jet__off">liked: false</span>
                  <span class="jet__on jet__on--state">liked: true</span>
                </code>
              </span>
              <span class="jet__meta">
                {s.jet.demo.js} <b>{s.jet.demo.jsVal}</b>
              </span>
            </div>
          <ol class="rail" style="list-style:none;margin:0;padding:0">
            {s.jet.steps.map((h, i) => (
              <li class="hop" style={`--i:${i}`}>
                <h3>{h.t}</h3>
                <p>{h.d}</p>
              </li>
            ))}
          </ol>
          <p class="jet__note" id="jet-note" dangerouslySetInnerHTML={{ __html: s.jet.demo.note }} />
          <a class="tlink jet__more" href={locale === "ja" ? "/ja/jetstream/" : "/jetstream/"}>
            {s.jet.demo.more}
            <Arrow />
          </a>
          </div>
        </section>

        <section class="sec wrap" aria-labelledby="build-h">
          <div class="sec__head">
            <h2 id="build-h">{s.build.h2}</h2>
            <a class="tlink" href="/docs/">
              {s.build.more}
              <Arrow />
            </a>
          </div>
          <BuildFlow locale={locale} />
        </section>

        <section class="sec wrap" id="compare" aria-labelledby="cmp-h">
          <div class="sec__head">
            <h2 id="cmp-h">{s.compare.h2}</h2>
            <p class="lead">{s.compare.lead}</p>
          </div>
          <div class="tbl" role="region" aria-labelledby="cmp-h" tabIndex={0}>
            <table>
              <thead>
                <tr>
                  <th scope="col">
                    <span style="position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)">{locale === "ja" ? "項目" : "Feature"}</span>
                  </th>
                  {s.compare.cols.map((c, i) => (
                    <th scope="col" class={i === 0 ? "is-n" : undefined}>
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {s.compare.rows.map((r) => (
                  <tr>
                    <th scope="row">
                      {r.feature}
                      {"highlight" in r && r.highlight ? <span class="jet-tag">{s.compare.onlyTag}</span> : null}
                    </th>
                    <td class="is-n">{r.nowaki}</td>
                    <td>{r.next}</td>
                    <td>{r.astro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p class="note">{s.compare.note}</p>
          <Bench locale={locale} />
          <Scaling locale={locale} />
          <Production locale={locale} />
        </section>

        <section class="sec wrap" aria-labelledby="fit-h">
          <div class="sec__head">
            <h2 id="fit-h">{s.fit.h2}</h2>
            <a class="tlink" href={`${GH}/blob/main/ROADMAP.md`}>
              {s.fit.roadmap}
              <Arrow />
            </a>
          </div>
          <div class="fit">
            {[
              { title: s.fit.forTitle, items: s.fit.for, no: false },
              { title: s.fit.notTitle, items: s.fit.not, no: true },
              { title: s.fit.soonTitle, items: s.fit.soon, no: true },
            ].map((col) => (
              <div>
                <h3 class={col.no ? "is-no" : undefined}>{col.title}</h3>
                <ul>
                  {col.items.map((x) => (
                    <li>
                      <Mark no={col.no} />
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section class="sec close" aria-labelledby="close-h">
          <div class="map map--close" aria-hidden="true">
            <div class="map__sea" />
            <IslandEl i={{ name: "Counter", directive: "client:visible", c: 9, r: 5, w: 9, h: 3, t: 0, wide: true }} />
          </div>
          <div class="wrap">
            <h2 id="close-h" dangerouslySetInnerHTML={{ __html: s.close.h2 }} />
            <div class="close__cta">
              <CopyCommand cmd="npm create nowaki@latest" labelCopy={s.copy.copy} labelCopied={s.copy.copied} />
              <a class="btn btn--line" href="/docs/quickstart/">
                {s.close.docs}
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} />
    </>
  );
}
