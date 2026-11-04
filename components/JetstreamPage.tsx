// /jetstream and /ja/jetstream: how a live island works, in 0.13.0 terms.
import Code from "./Code.tsx";
import { Page, Opener, Sec, Rows, Table, FitLists, Close, html } from "./Explainer.tsx";
import { JETSTREAM, LIVE_JS_KB } from "../lib/explainers.ts";
import type { Locale } from "../lib/i18n.ts";

const CODE = `// islands/LiveCounter.tsx
export const live = {
  state: () => ({ count: 0 }),
  on: {
    inc: (s) => ({ ...s, count: s.count + 1 }),
    dec: (s) => ({ ...s, count: s.count - 1 }),
  },
};

export default function LiveCounter({ state }) {
  return (
    <div>
      <button data-live="dec">-</button>
      <strong>{state.count}</strong>
      <button data-live="inc">+</button>
    </div>
  );
}`;

// Which lanes each step joins: browser 0, Rust 1, Node 2. A step on one lane is work, not a message.
const HOPS: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 2],
  [2, 1],
  [1, 0],
  [0, 0],
];

export default function JetstreamPage({ locale }: { locale: Locale }) {
  const s = JETSTREAM[locale];
  const base = locale === "ja" ? "/ja/" : "/";
  return (
    <Page locale={locale} page="jetstream" slug="jetstream">
      <Opener
        h1={s.h1}
        lead={s.lead}
        docs={{ href: "/docs/jetstream/", label: s.ctaDocs }}
        other={{ href: `${base}architecture/`, label: s.ctaOther }}
        island={{ name: "LiveCounter", directive: "live", c: 9, r: 4, w: 7, h: 4, t: 1.2, live: true, wide: true }}
      />

      <Sec id="write-h" h2={s.write.h2} lead={s.write.lead}>
        <div class="xcode">
          <Code src={CODE} />
          <dl class="xpoints">
            {s.write.points.map((p) => (
              <div>
                <dt>{/^[a-z]+$/.test(p.t) ? <code>{p.t}</code> : p.t}</dt>
                <dd {...html(p.d)} />
              </div>
            ))}
          </dl>
        </div>
      </Sec>

      <Sec id="trip-h" h2={s.trip.h2} lead={s.trip.lead}>
        <div class="seq">
          <div class="seq__lanes" aria-hidden="true">
            {s.trip.lanes.map((l) => (
              <span>{l}</span>
            ))}
          </div>
          <ol class="seq__steps">
            {s.trip.steps.map((st, i) => {
              const [a, b] = HOPS[i];
              const kind = a === b ? "self" : b > a ? "right" : "left";
              return (
                <li class={`seq__s is-${kind}`} style={`--i:${i};--from:${Math.min(a, b)};--to:${Math.max(a, b)};--at:${a}`}>
                  <div class="seq__track" aria-hidden="true">
                    <span class="seq__arrow">
                      <i class="seq__pk" />
                    </span>
                  </div>
                  <div class="seq__txt">
                    <span class="seq__n">{String(i + 1).padStart(2, "0")}</span>
                    <b>{st.t}</b>
                    <p {...html(st.d)} />
                  </div>
                </li>
              );
            })}
          </ol>
          <p class="note">{s.trip.note}</p>
        </div>
      </Sec>

      <Sec id="reach-h" h2={s.reach.h2}>
        <div class="xstats">
          {s.reach.stats.map((st) => (
            <div>
              <b>{st.v.replace("{live}", LIVE_JS_KB)}</b>
              <p>{st.d}</p>
            </div>
          ))}
        </div>
        <p class="note">{s.reach.note}</p>
      </Sec>

      <Sec id="state-h" h2={s.state.h2} lead={s.state.lead}>
        <Rows rows={s.state.rows} />
      </Sec>

      <Sec id="where-h" h2={s.where.h2} lead={s.where.lead}>
        <Table label={s.where.h2} cols={s.where.cols} rows={s.where.rows.map((r) => [{ v: r.k }, { v: r.v, ok: "ok" in r && r.ok }])} />
      </Sec>

      <Sec id="fit-h" h2={s.fit.h2}>
        <FitLists forTitle={s.fit.forTitle} items={s.fit.for} notTitle={s.fit.notTitle} not={s.fit.not} />
      </Sec>

      <Close h2={s.close.h2} docs={{ href: "/docs/jetstream/", label: s.close.docs }} />
    </Page>
  );
}
