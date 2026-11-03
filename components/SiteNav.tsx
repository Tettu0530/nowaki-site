import { STRINGS, GH } from "../lib/i18n.ts";
import { MARK_URL } from "../lib/landing-style.ts";
import type { Locale } from "../lib/i18n.ts";

// Links into /docs/ carry data-no-router: the docs bring their own <head> CSS,
// which the island router does not swap in on client-side navigation (it syncs
// only <meta> and <link>), so those links must be full page loads. The language
// switch is a full load too: the router keeps the old <html lang>, which would
// leave the :lang(ja) typography off.
// Site navigation shared by the landing and the docs. Below 760px the links fold
// into a <details> menu, so it needs no JavaScript. The docs are English only,
// so they drop the language switch.
export default function SiteNav({ locale = "en", page }: { locale?: Locale; page: "home" | "docs" }) {
  const s = STRINGS[locale];
  const home = locale === "ja" ? "/ja/" : "/";
  const compare = page === "home" ? "#compare" : `${home}#compare`;
  const docsCurrent = page === "docs" ? "page" : undefined;

  const lang = (cls: string) => (
    <span class={cls} role="group" aria-label={s.nav.lang}>
      <a data-no-router href="/" lang="en" aria-current={locale === "en" ? "page" : undefined}>
        EN
      </a>
      <a data-no-router href="/ja/" lang="ja" aria-current={locale === "ja" ? "page" : undefined}>
        日本語
      </a>
    </span>
  );

  return (
    <header class="nav">
      <div class="wrap nav__in">
        <a href={home} class="brand">
          <img src={MARK_URL} alt="" width="24" height="24" />
          Nowaki<small>野分</small>
        </a>
        <nav class="nav__links" aria-label="Primary">
          <a data-no-router class="hide-sm" href="/docs/" aria-current={docsCurrent}>
            {s.nav.docs}
          </a>
          <a class="hide-sm" href={compare}>
            {s.nav.compare}
          </a>
          <a class="hide-sm" href={GH}>
            GitHub
          </a>
          {page === "home" ? lang("lang") : null}
          <a data-no-router class="btn btn--solid" href="/docs/quickstart/">
            {s.nav.start}
          </a>
          <details class="menu">
            <summary aria-label={s.nav.menu}>
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path d="M3 6h12M3 12h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </summary>
            <div class="menu__panel">
              <a data-no-router href="/docs/" aria-current={docsCurrent}>
                {s.nav.docs}
              </a>
              <a href={compare}>{s.nav.compare}</a>
              <a href={GH}>GitHub</a>
              {page === "home" ? lang("menu__lang") : null}
            </div>
          </details>
        </nav>
      </div>
    </header>
  );
}
