// /benchmarks and /ja/benchmarks: every benchmark the landing summarizes, with the method. The feature
// table against Next.js and Astro, the counter-app head-to-head, the scaling sweep and the production
// servers, all read from data files at render time (see the components).
import { Page, Opener } from "./Explainer.tsx";
import Bench from "./Bench.tsx";
import Scaling from "./Scaling.tsx";
import Production from "./Production.tsx";
import DocsSite from "./DocsSite.tsx";
import { STRINGS, SITE_GH } from "../lib/i18n.ts";
import type { Locale } from "../lib/i18n.ts";

export default function BenchmarksPage({ locale }: { locale: Locale }) {
  const s = STRINGS[locale];
  const b = s.benchPage;
  const base = locale === "ja" ? "/ja/" : "/";
  return (
    <Page locale={locale} page="benchmarks" slug="benchmarks">
      <Opener h1={b.h1} lead={b.lead} docs={{ href: `${SITE_GH}/tree/main/benchmarks`, label: b.method }} other={{ href: base, label: b.back }} />

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
        <DocsSite locale={locale} />
      </section>
    </Page>
  );
}
