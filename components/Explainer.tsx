// Building blocks for the explainer pages (/jetstream, /architecture). No islands:
// these pages ship no JavaScript. Styles: EXPLAINER_CSS in lib/landing-style.ts.
import type { ComponentChildren } from "preact";
import SiteNav from "./SiteNav.tsx";
import type { NavPage } from "./SiteNav.tsx";
import SiteFooter from "./SiteFooter.tsx";
import { IslandEl } from "./IslandMap.tsx";
import type { Island } from "./IslandMap.tsx";
import type { Locale } from "../lib/i18n.ts";

export function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" style="display:inline-block;vertical-align:-2px;margin-left:.35em">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
}

export const html = (s: string) => ({ dangerouslySetInnerHTML: { __html: s } });

export function Page({
  locale,
  page,
  slug,
  children,
}: {
  locale: Locale;
  page: NavPage;
  slug: string;
  children: ComponentChildren;
}) {
  return (
    <>
      <a class="skip" href="#main">
        {locale === "ja" ? "本文へスキップ" : "Skip to content"}
      </a>
      <SiteNav locale={locale} page={page} alt={{ en: `/${slug}/`, ja: `/ja/${slug}/` }} />
      <main id="main">{children}</main>
      <SiteFooter locale={locale} />
    </>
  );
}

export function Opener({
  h1,
  lead,
  docs,
  other,
  island,
}: {
  h1: string;
  lead: string;
  docs: { href: string; label: string };
  other: { href: string; label: string };
  island?: Island;
}) {
  return (
    <section class="xo">
      <div class="map map--xo" aria-hidden="true">
        <div class="map__sea" />
        {island ? <IslandEl i={island} /> : null}
      </div>
      <div class="wrap xo__in">
        <h1 class="rise" style="--rd:.05s" {...html(h1)} />
        <p class="xo__lead rise" style="--rd:.15s">
          {lead}
        </p>
        <div class="xo__cta rise" style="--rd:.25s">
          <a class="btn btn--line" href={docs.href}>
            {docs.label}
          </a>
          <a class="tlink" href={other.href}>
            {other.label}
            <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}

export function Sec({ id, h2, lead, children }: { id: string; h2: string; lead?: string; children: ComponentChildren }) {
  return (
    <section class="sec wrap" aria-labelledby={id}>
      <div class="sec__head">
        <h2 id={id} {...html(h2)} />
        {lead ? <p class="lead" {...html(lead)} /> : null}
      </div>
      {children}
    </section>
  );
}

/** Title-and-text rows on hairlines. */
export function Rows({ rows }: { rows: readonly { t: string; d: string }[] }) {
  return (
    <dl class="xrows">
      {rows.map((r) => (
        <div class="xrows__r">
          <dt>{r.t}</dt>
          <dd {...html(r.d)} />
        </div>
      ))}
    </dl>
  );
}

function Check({ ok }: { ok?: boolean }) {
  return ok ? (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" style="color:var(--susuki);flex:none;margin-top:.45em">
      <path d="M2.2 6.4 4.8 9 9.8 3.4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  ) : (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" style="color:var(--mark-no);flex:none;margin-top:.45em">
      <circle cx="6" cy="6" r="4.5" fill="none" stroke="currentColor" stroke-width="1.2" />
    </svg>
  );
}

/** A ruled table: first column is the key; a cell marked ok gets a susuki tick. */
export function Table({ cols, rows, label }: { cols: readonly string[]; rows: readonly (readonly { v: string; ok?: boolean }[])[]; label: string }) {
  return (
    <div class="xt" role="region" aria-label={label} tabIndex={0}>
      <table>
        <thead>
          <tr>
            {cols.map((c) => (
              <th scope="col">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr>
              {r.map((c, i) =>
                i === 0 ? (
                  <th scope="row" {...html(c.v)} />
                ) : i === r.length - 1 ? (
                  <td class={c.ok ? "is-ok" : undefined}>
                    <span class="xt__v">
                      <Check ok={c.ok} />
                      <span {...html(c.v)} />
                    </span>
                  </td>
                ) : (
                  <td {...html(c.v)} />
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function FitLists({ forTitle, items, notTitle, not }: { forTitle: string; items: readonly string[]; notTitle: string; not: readonly string[] }) {
  return (
    <div class="fit xfit">
      {[
        { title: forTitle, list: items, no: false },
        { title: notTitle, list: not, no: true },
      ].map((col) => (
        <div>
          <h3 class={col.no ? "is-no" : undefined}>{col.title}</h3>
          <ul>
            {col.list.map((x) => (
              <li>
                <Check ok={!col.no} />
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** The closing band: lattice, heading, the install command (static, no copy island), a link. */
export function Close({ h2, docs }: { h2: string; docs: { href: string; label: string } }) {
  return (
    <section class="sec close" aria-labelledby="close-h">
      <div class="map map--close" aria-hidden="true">
        <div class="map__sea" />
      </div>
      <div class="wrap">
        <h2 id="close-h">{h2}</h2>
        <div class="close__cta">
          <p class="cmd">
            <span class="cmd__p" aria-hidden="true">
              $
            </span>
            <code>npm create nowaki@latest</code>
          </p>
          <a class="btn btn--line" href={docs.href}>
            {docs.label}
          </a>
        </div>
      </div>
    </section>
  );
}
