// Not found. `nowaki prerender` writes this as 404.html, which Cloudflare Pages serves
// (with a 404 status) for unknown paths. A static page cannot know the requested path
// or locale, so it speaks both languages. No islands: it ships no JavaScript.
import SiteNav from "../components/SiteNav.tsx";
import { BASE_CSS, LANDING_CSS, FONT_PRELOADS, FAVICON } from "../lib/landing-style.ts";

export const lang = "en";
export const title = "Not found · Nowaki";
export const head = `
<meta name="robots" content="noindex" />
<meta name="theme-color" content="#0b0d10" />
${FAVICON}
${FONT_PRELOADS}
<style>${BASE_CSS}${LANDING_CSS}</style>`;

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" style="display:inline-block;vertical-align:-2px;margin-left:.35em">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
}

export default function NotFound() {
  return (
    <>
      <SiteNav page="other" />
      <main id="main">
        <section class="hero lost">
          {/* Open sea: the lattice with one island that never hydrated. */}
          <div class="map" aria-hidden="true">
            <div class="map__sea" />
            <div class="isl is-b is-dormant" style="--c:-17;--cm:-3;--w:8;--h:3;--rb:6;--t:0s">
              <span class="isl__frame" />
            </div>
          </div>
          <div class="wrap hero__grid">
            <div class="rel">
              <span class="rel__num rise" style="--rd:.05s">
                404
              </span>
            </div>
            <div class="pitch">
              <h1 class="rise" style="--rd:.1s">
                <span>No page at this address.</span>
                <span>
                  Just open <em>sea</em>.
                </span>
              </h1>
              <p class="pitch__sub rise" style="--rd:.2s">
                The link may be old, or the page has moved.
              </p>
              <p class="pitch__sub lost__ja rise" lang="ja" style="--rd:.24s">
                このアドレスにページはありません。リンクが古いか、ページが移動した可能性があります。
              </p>
              <div class="pitch__cta rise" style="--rd:.3s">
                <a class="btn btn--line" href="/">
                  Home
                </a>
                <a class="btn btn--line" href="/ja/" lang="ja">
                  日本語のトップ
                </a>
                <a class="tlink" href="/docs/">
                  Docs
                  <Arrow />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
