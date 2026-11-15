// Docs layout: a running-head technical manual (see DESIGN.md and the docs surface brief).
// No islands, so every docs page ships zero client JavaScript.
import SiteNav from "../../components/SiteNav.tsx";
import { GH, NPM, CRATES } from "../../lib/i18n.ts";

import { DOC_GROUPS, DOC_NAV as NAV } from "../../lib/docs-nav.ts";

const pad = (n: number) => String(n).padStart(2, "0");
// Pages serves each chapter at a trailing-slash URL; compare paths without it.
const norm = (p: string) => p.replace(/\/+$/, "") || "/";

function Arrow({ back = false }: { back?: boolean }) {
  return (
    <svg class="arrow" width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" style={back ? "transform:scaleX(-1)" : undefined}>
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
}

function Chapters({ path }: { path: string }) {
  let i = 0;
  return (
    <>
      {DOC_GROUPS.map((grp) => (
        <div class="chapters__group">
          <p class="chapters__title">{grp.title}</p>
          <ol class="chapters">
            {grp.items.map((n) => {
              i += 1;
              return (
                <li>
                  <a href={n.href} aria-current={norm(n.href) === path ? "page" : undefined}>
                    <i>{pad(i)}</i>
                    <span class={n.mono ? "mono" : undefined}>{n.label}</span>
                  </a>
                </li>
              );
            })}
          </ol>
        </div>
      ))}
    </>
  );
}

export default function DocsLayout({ children, url }: { children: unknown; url?: URL }) {
  const path = norm(url?.pathname ?? "/docs");
  const at = Math.max(
    0,
    NAV.findIndex((n) => norm(n.href) === path),
  );
  const here = NAV[at];
  const prev = NAV[at - 1];
  const next = NAV[at + 1];

  return (
    <>
      <a class="skip" href="#doc">
        Skip to content
      </a>
      <SiteNav page="docs" />
      <div class="docs">
        <aside class="side">
          <nav aria-label="Chapters">
            <Chapters path={path} />
          </nav>
          <details>
            <summary>
              <span class="side__pos">
                <i>
                  {pad(at + 1)} / {pad(NAV.length)}
                </i>
                <span>{here.label}</span>
              </span>
              <svg class="chev" width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
                <path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </summary>
            <Chapters path={path} />
          </details>
          <div class="side__ext">
            <a href={GH}>GitHub</a>
            <a href={NPM}>npm</a>
            <a href={CRATES}>crates.io</a>
          </div>
        </aside>
        <div class="doc">
          <div class={next ? "run" : "run run--last"}>
            <span class="run__where">
              Docs / <b>{here.label}</b>
            </span>
            {next ? (
              <a href={next.href}>
                <i>
                  {at + 1} / {NAV.length}
                </i>
                <span>Next: {next.label}</span>
                <Arrow />
              </a>
            ) : (
              <span>
                <i>
                  {at + 1} / {NAV.length}
                </i>
              </span>
            )}
          </div>
          <span class="doc__num" aria-hidden="true">
            {pad(at + 1)}
          </span>
          <article class="doc__body" id="doc">
            {children}
            <nav class="pager" aria-label="Chapter">
              {prev ? (
                <a href={prev.href} rel="prev">
                  <small>Previous</small>
                  <span>
                    <Arrow back /> {prev.label}
                  </span>
                </a>
              ) : (
                <span />
              )}
              {next ? (
                <a href={next.href} rel="next" class="pager__next">
                  <small>Next</small>
                  <span>
                    {next.label} <Arrow />
                  </span>
                </a>
              ) : null}
            </nav>
          </article>
        </div>
      </div>
    </>
  );
}
