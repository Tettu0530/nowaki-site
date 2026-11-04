// Footer shared by the landing and the explainer pages (/jetstream, /architecture).
import { STRINGS, GH, CRATES, NPM } from "../lib/i18n.ts";
import type { Locale } from "../lib/i18n.ts";
import { MARK_URL } from "../lib/landing-style.ts";

const CHANGELOG = `${GH}/blob/main/CHANGELOG.md`;

export default function SiteFooter({ locale }: { locale: Locale }) {
  const s = STRINGS[locale];
  const base = locale === "ja" ? "/ja/" : "/";
  return (
    <footer class="foot">
      <div class="wrap">
        <div class="foot__top">
          <div>
            <a href={base} class="brand">
              <img src={MARK_URL} alt="" width="24" height="24" />
              Nowaki<small>野分</small>
            </a>
            <p>{s.footer.tagline}</p>
          </div>
          <nav aria-label="Footer">
            <a href={`${base}jetstream/`}>{s.nav.jetstream}</a>
            <a href={`${base}architecture/`}>{s.nav.architecture}</a>
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
  );
}
