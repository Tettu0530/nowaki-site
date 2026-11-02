import CopyCommand from "../islands/CopyCommand.tsx";
import SiteNav from "./SiteNav.tsx";
import { STRINGS, GH, CRATES, NPM } from "../lib/i18n.ts";
import type { Locale } from "../lib/i18n.ts";
import { streamlines } from "../lib/streamlines.ts";
import { NOWAKI_RELEASE, NOWAKI_VERSION } from "../lib/version.ts";
import { shipped } from "../lib/bundle.ts";

const CHANGELOG = `${GH}/blob/main/CHANGELOG.md`;

// Wind-tunnel streamlines bending around the release numeral. Server-rendered SVG;
// the moving streaks are a CSS dash animation, so the hero costs no client JS.
const FLOW_W = 1440;
const FLOW_H = 780;
const FLOW = streamlines({ w: FLOW_W, h: FLOW_H, lines: 34, cx: 300, cy: 400, rx: 330, ry: 150, step: 24 });
// Deterministic per-line timing so prerendered output is stable.
const timing = FLOW.map((_, i) => {
  const r = ((i * 7919) % 101) / 101;
  const q = ((i * 104729) % 97) / 97;
  return { d: (5.5 + r * 5).toFixed(2), o: (-q * 10).toFixed(2) };
});

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

const ROUTE = `<span class="c">// routes/blog/[slug].tsx</span>
<span class="k">import</span> Comments <span class="k">from</span> <span class="s">"../../islands/Comments.tsx"</span>;

<span class="c">// runs on the server only</span>
<span class="k">export const</span> <span class="f">loader</span> = <span class="k">async</span> ({ params }) =&gt; ({
  post: <span class="k">await</span> db.<span class="f">post</span>(params.slug),
});

<span class="k">export default function</span> <span class="f">Post</span>({ data }) {
  <span class="k">return</span> (
    &lt;<span class="f">article</span>&gt;
      &lt;<span class="f">h1</span>&gt;{data.post.title}&lt;/<span class="f">h1</span>&gt;
      &lt;<span class="f">Comments</span> <span class="a">postId</span>={data.post.id} /&gt; <span class="c">// only this hydrates</span>
    &lt;/<span class="f">article</span>&gt;
  );
}`;

const ACTION = `<span class="c">// routes/guestbook.tsx</span>
<span class="k">export const</span> <span class="f">loader</span> = (ctx) =&gt; ({ entries: <span class="f">read</span>(ctx) });

<span class="c">// a non-GET request runs the action</span>
<span class="k">export async function</span> <span class="f">action</span>(ctx) {
  <span class="k">const</span> form = <span class="k">await</span> ctx.<span class="f">formData</span>();
  ctx.<span class="f">setCookie</span>(<span class="s">"guestbook"</span>, <span class="f">add</span>(form.<span class="f">get</span>(<span class="s">"msg"</span>)));
  <span class="k">return</span> ctx.<span class="f">redirect</span>(<span class="s">"/guestbook"</span>); <span class="c">// PRG</span>
}`;

const num = (v: string) => Number.parseFloat(v.replace(/[^\d.]/g, "")) || 0;

export default function Landing({ locale }: { locale: Locale }) {
  const s = STRINGS[locale];
  const ship = shipped(["CopyCommand"]);
  const t = (x: string) => x.replaceAll("{kb}", String(ship?.kb ?? 14));
  const home = locale === "ja" ? "/ja/" : "/";

  return (
    <>
      <a class="skip" href="#main">
        {locale === "ja" ? "本文へスキップ" : "Skip to content"}
      </a>

      <SiteNav locale={locale} page="home" />

      <main id="main">
        <section class="hero">
          <svg width="0" height="0" style="position:absolute" aria-hidden="true">
            <defs>
              {FLOW.map((d, i) => (
                <path id={`f${i}`} d={d} fill="none" vector-effect="non-scaling-stroke" />
              ))}
            </defs>
          </svg>
          <svg class="hero__flow" viewBox={`0 0 ${FLOW_W} ${FLOW_H}`} preserveAspectRatio="xMinYMid slice" aria-hidden="true">
            {FLOW.map((_, i) => (
              <use href={`#f${i}`} class={`sl${i % 6 === 2 ? " is-g" : ""}`} />
            ))}
            {FLOW.map((_, i) =>
              i % 2 === 0 ? <use href={`#f${i}`} class={`st${i % 6 === 2 ? " is-g" : ""}`} style={`--d:${timing[i].d}s;--o:${timing[i].o}s`} /> : null,
            )}
          </svg>
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
              <h1 class="rise" style="--rd:.1s">
                <span>{s.hero.h1a}</span>
                <em>{s.hero.h1b}</em>
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
                {s.hero.rustfree}
                <br />
                {s.hero.alpha}
              </p>
            </div>
          </div>
        </section>

        <section class="new" aria-labelledby="new-h">
          <div class="wrap new__in">
            <div class="new__h">
              <h2 id="new-h">{s.release.h2}</h2>
              <p>{s.release.since}</p>
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
            <p class="note" dangerouslySetInnerHTML={{ __html: s.proof.note }} />
          </aside>
          </div>
        </section>

        <section class="sec wrap" aria-labelledby="jet-h">
          <div class="sec__head">
            <h2 id="jet-h">{s.jet.h2}</h2>
            <p class="lead">{s.jet.lead}</p>
          </div>
          <ol class="rail" style="list-style:none;margin:0;padding:0">
            {s.jet.steps.map((h) => (
              <li class="hop">
                <h3>{h.t}</h3>
                <p>{h.d}</p>
              </li>
            ))}
          </ol>
          <p class="only">{s.jet.only}</p>
        </section>

        <section class="sec wrap" aria-labelledby="code-h">
          <div class="sec__head">
            <h2 id="code-h">{s.code.h2}</h2>
            <p class="lead" dangerouslySetInnerHTML={{ __html: s.code.lead }} />
          </div>
          <div class="codes">
            <figure class="code" style="margin:0">
              <figcaption class="code__bar">
                <b>{s.code.tabs[0]}</b>
                <span>routes/blog/[slug].tsx</span>
              </figcaption>
              <pre>
                <code dangerouslySetInnerHTML={{ __html: ROUTE }} />
              </pre>
            </figure>
            <figure class="code" style="margin:0">
              <figcaption class="code__bar">
                <b>{s.code.tabs[1]}</b>
                <span>routes/guestbook.tsx</span>
              </figcaption>
              <pre>
                <code dangerouslySetInnerHTML={{ __html: ACTION }} />
              </pre>
            </figure>
          </div>
          <div class="conv">
            <h3>{s.code.tabs[2]}</h3>
            {s.code.conventions.map((c) => (
              <div>
                <code>{c.f}</code>
                <span>{c.d}</span>
              </div>
            ))}
          </div>
        </section>

        <section class="sec wrap" aria-labelledby="more-h">
          <div class="sec__head">
            <h2 id="more-h">{s.more.h2}</h2>
            <p class="lead">{s.more.lead}</p>
          </div>
          <div class="feats">
            {s.more.items.map((f) => (
              <div class="feat">
                <h3>{f.title}</h3>
                <p dangerouslySetInnerHTML={{ __html: f.body }} />
              </div>
            ))}
          </div>
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
        </section>

        <section class="sec wrap" aria-labelledby="fit-h">
          <div class="sec__head">
            <h2 id="fit-h">{s.fit.h2}</h2>
            <p class="lead">{s.fit.lead}</p>
          </div>
          <div class="fit">
            <div>
              <h3>{s.fit.forTitle}</h3>
              <ul>
                {s.fit.for.map((x) => (
                  <li>
                    <Mark />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 class="is-no">{s.fit.notTitle}</h3>
              <ul>
                {s.fit.not.map((x) => (
                  <li>
                    <Mark no />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div class="status">
            <div>
              <h3>{s.fit.statusTitle}</h3>
              <p class="status__p">{s.fit.status}</p>
              <p style="margin-top:1.2rem">
                <a class="tlink" href={`${GH}/blob/main/ROADMAP.md`}>
                  {s.fit.roadmap}
                  <Arrow />
                </a>
              </p>
            </div>
            <div class="soon">
              <h3 class="is-no">{s.fit.soonTitle}</h3>
              <ul>
                {s.fit.soon.map((w) => (
                  <li>
                    <Mark no />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section class="sec close" aria-labelledby="close-h">
          <svg class="close__flow" viewBox={`0 0 ${FLOW_W} ${FLOW_H}`} preserveAspectRatio="xMaxYMid slice" aria-hidden="true">
            {FLOW.map((_, i) => (i % 2 === 1 ? <use href={`#f${i}`} class={`sl${i % 6 === 3 ? " is-g" : ""}`} /> : null))}
            {FLOW.map((_, i) =>
              i % 4 === 1 ? <use href={`#f${i}`} class={`st${i % 6 === 3 ? " is-g" : ""}`} style={`--d:${timing[i].d}s;--o:${timing[i].o}s`} /> : null,
            )}
          </svg>
          <div class="wrap">
            <h2 id="close-h">{s.close.h2}</h2>
            <div class="close__cta">
              <CopyCommand cmd="npm create nowaki@latest" labelCopy={s.copy.copy} labelCopied={s.copy.copied} />
              <a class="btn btn--line" href="/docs/quickstart/">
                {s.close.docs}
              </a>
            </div>
            <div class="steps">
              {s.how.steps.map((st) => (
                <div class="step">
                  <h3>{st.title}</h3>
                  {st.cmd ? <code>{st.cmd}</code> : null}
                  <p dangerouslySetInnerHTML={{ __html: st.body }} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer class="foot">
        <div class="wrap">
          <div class="foot__top">
            <div>
              <a href={home} class="brand">
                Nowaki<small>野分</small>
              </a>
              <p>{s.footer.tagline}</p>
            </div>
            <nav aria-label="Footer">
              <a href="/docs/">{s.nav.docs}</a>
              <a href={GH}>GitHub</a>
              <a href={NPM}>npm</a>
              <a href={CRATES}>crates.io</a>
              <a href={CHANGELOG}>Changelog</a>
            </nav>
          </div>
          <div class="foot__legal">
            <span>{s.footer.copyright}</span>
            <span>{s.footer.windName}</span>
          </div>
          <p class="foot__tm">{s.footer.trademark}</p>
        </div>
      </footer>
    </>
  );
}
