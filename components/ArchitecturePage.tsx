// /architecture and /ja/architecture: how Nowaki 0.16.0 is built, source to browser.
import { Page, Opener, Sec, Rows, Table, Close, Arrow } from "./Explainer.tsx";
import { ARCHITECTURE } from "../lib/explainers.ts";
import { BENCH } from "../lib/benchmarks.ts";
import { GH } from "../lib/i18n.ts";
import type { Locale } from "../lib/i18n.ts";

export default function ArchitecturePage({ locale }: { locale: Locale }) {
  const s = ARCHITECTURE[locale];
  const base = locale === "ja" ? "/ja/" : "/";
  const devMs = String(BENCH?.frameworks.find((f) => f.framework === "nowaki")?.devFirstMs ?? "");
  const fill = (rows: readonly { t: string; d: string }[]) => rows.map((r) => ({ t: r.t.replace("{devMs}", devMs), d: r.d.replace("{devMs}", devMs) }));
  return (
    <Page locale={locale} page="architecture" slug="architecture">
      <Opener h1={s.h1} lead={s.lead} docs={{ href: "/docs/", label: s.ctaDocs }} other={{ href: `${base}jetstream/`, label: s.ctaOther }} />

      <Sec id="system-h" h2={s.system.h2} lead={s.system.lead}>
        <div class="sys">
          {s.system.boxes.map((b, i) => (
            <>
              {i > 0 ? (
                <div class="sys__link" aria-hidden="true">
                  <span>{s.system.links[i - 1]}</span>
                </div>
              ) : null}
              <div class={`sys__box${i === 1 ? " is-rust" : ""}`}>
                <h3>
                  {b.t}
                  {"sub" in b && b.sub ? <code>{b.sub}</code> : null}
                </h3>
                <ul>
                  {b.items.map((it) => (
                    <li>{it}</li>
                  ))}
                </ul>
              </div>
            </>
          ))}
        </div>
      </Sec>

      <Sec id="build-h" h2={s.build.h2} lead={s.build.lead}>
        <ol class="pipe">
          {s.build.steps.map((st, i) => (
            <li>
              <span class="pipe__n">{String(i + 1).padStart(2, "0")}</span>
              <h3>{st.t}</h3>
              <p>{st.d}</p>
            </li>
          ))}
        </ol>
      </Sec>

      <Sec id="request-h" h2={s.request.h2}>
        <Rows rows={s.request.rows} />
      </Sec>

      <Sec id="security-h" h2={s.security.h2} lead={s.security.lead}>
        <Rows rows={s.security.rows} />
        <a class="tlink xmore" href="/docs/security/">
          {s.security.more}
          <Arrow />
        </a>
      </Sec>

      <Sec id="client-h" h2={s.client.h2}>
        <Rows rows={s.client.rows} />
      </Sec>

      <Sec id="dev-h" h2={s.dev.h2}>
        <Rows rows={fill(s.dev.rows)} />
      </Sec>

      <Sec id="ship-h" h2={s.ship.h2}>
        <Rows rows={s.ship.rows} />
      </Sec>

      <Sec id="deploy-h" h2={s.deploy.h2}>
        <Table label={s.deploy.h2} cols={s.deploy.cols} rows={s.deploy.rows.map((r) => [{ v: r.k }, { v: r.o }, { v: r.j, ok: "ok" in r && r.ok }])} />
      </Sec>

      <Close h2={s.close.h2} docs={{ href: GH, label: "GitHub" }} />
    </Page>
  );
}
