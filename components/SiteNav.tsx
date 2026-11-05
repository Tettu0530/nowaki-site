import { STRINGS, GH } from "../lib/i18n.ts";
import { MARK_URL } from "../lib/landing-style.ts";
import type { Locale } from "../lib/i18n.ts";

// Since Nowaki 0.13 the island router swaps each page's own <head> region (the
// docs' <style>) and <html lang> on client navigation (Tettu0530/nowaki#21), so
// links into the docs and the language switch need no data-no-router.
// Site navigation shared by the landing, the explainer pages and the docs. Below 960px
// Compare and GitHub fold into a <details> menu, below 760px everything does, so it
// needs no JavaScript. The docs are English only and the 404 has no counterpart, so
// they drop the language switch; elsewhere it points at this page in the other language.
export type NavPage = "home" | "jetstream" | "architecture" | "benchmarks" | "docs" | "other";

export default function SiteNav({
  locale = "en",
  page,
  alt = { en: "/", ja: "/ja/" },
}: {
  locale?: Locale;
  page: NavPage;
  alt?: { en: string; ja: string };
}) {
  const s = STRINGS[locale];
  const base = locale === "ja" ? "/ja/" : "/";
  const compare = `${base}benchmarks/`;
  const cur = (p: NavPage) => (page === p ? "page" : undefined);
  const hasLang = page !== "docs" && page !== "other";

  const lang = (cls: string) => (
    <span class={cls} role="group" aria-label={s.nav.lang}>
      <a href={alt.en} lang="en" aria-current={locale === "en" ? "page" : undefined}>
        EN
      </a>
      <a href={alt.ja} lang="ja" aria-current={locale === "ja" ? "page" : undefined}>
        日本語
      </a>
    </span>
  );

  return (
    <header class="nav">
      <div class="wrap nav__in">
        <a href={base} class="brand">
          <img src={MARK_URL} alt="" width="24" height="24" />
          Nowaki<small>野分</small>
        </a>
        <nav class="nav__links" aria-label="Primary">
          <a class="hide-sm" href={`${base}jetstream/`} aria-current={cur("jetstream")}>
            {s.nav.jetstream}
          </a>
          <a class="hide-sm" href={`${base}architecture/`} aria-current={cur("architecture")}>
            {s.nav.architecture}
          </a>
          <a class="hide-sm" href="/docs/" aria-current={cur("docs")}>
            {s.nav.docs}
          </a>
          <a class="hide-sm hide-md" href={compare} aria-current={cur("benchmarks")}>
            {s.nav.compare}
          </a>
          <a class="hide-sm hide-md" href={GH}>
            GitHub
          </a>
          {hasLang ? lang("lang") : null}
          <a class="btn btn--solid" href="/docs/quickstart/">
            {s.nav.start}
          </a>
          <details class="menu">
            <summary aria-label={s.nav.menu}>
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path d="M3 6h12M3 12h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </summary>
            <div class="menu__panel">
              <a class="menu__sm" href={`${base}jetstream/`} aria-current={cur("jetstream")}>
                {s.nav.jetstream}
              </a>
              <a class="menu__sm" href={`${base}architecture/`} aria-current={cur("architecture")}>
                {s.nav.architecture}
              </a>
              <a class="menu__sm" href="/docs/" aria-current={cur("docs")}>
                {s.nav.docs}
              </a>
              <a href={compare} aria-current={cur("benchmarks")}>
                {s.nav.compare}
              </a>
              <a href={GH}>GitHub</a>
              {hasLang ? lang("menu__lang") : null}
            </div>
          </details>
        </nav>
      </div>
    </header>
  );
}
