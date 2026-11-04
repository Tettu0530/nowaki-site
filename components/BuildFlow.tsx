// "Write a route. Mark an island. Ship." as one flowing figure, in the hero's island
// grammar: a request reaches a route file, the page renders to HTML and its one island
// hydrates, and oxc writes the output, where only the island and its runtime are client JS.
// CSS only (lib/landing-style.ts, "build flow"): scroll-driven where the browser supports
// view timelines, a 13s loop elsewhere, the finished state under reduced motion.
// The route, URL, file names and hashes are illustrative.
import { STRINGS } from "../lib/i18n.ts";
import type { Locale } from "../lib/i18n.ts";

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
}

// The route file, line by line; `k` marks the lines the figure lights up.
const CODE: { t: string; k?: "load" | "isl" }[] = [
  { t: "export const loader = ({ params }) =>", k: "load" },
  { t: "  db.post(params.slug);", k: "load" },
  { t: "" },
  { t: "export default function Post({ data }) {" },
  { t: "  return <article>" },
  { t: "    <h1>{data.title}</h1>" },
  { t: "    <Comments client:visible />", k: "isl" },
  { t: "  </article>;" },
  { t: "}" },
];

const OUT: { f: string; island?: boolean; dim?: boolean }[] = [
  { f: "server/routes/blog/[slug].js", dim: true },
  { f: "client/Comments.4f2a91c0.js", island: true },
  { f: "client/islands.6145a534.js" },
  { f: "client/preact.ca80f54f.js" },
];

export default function BuildFlow({ locale }: { locale: Locale }) {
  const b = STRINGS[locale].build;
  return (
    <div class="flow">
      <div class="flow__stage" aria-hidden="true">
        <div class="flow__grid">
          <div class="fl-route">
            <span class="fl-req">GET /blog/hello</span>
            <div class="fl-card">
              <div class="fl-card__bar">routes/blog/[slug].tsx</div>
              <pre class="fl-code">
                {CODE.map((l) => (
                  <span class={`fl-l${l.k ? ` fl-l--${l.k}` : ""}`}>{l.t || " "}</span>
                ))}
              </pre>
            </div>
          </div>

          <div class="fl-wire fl-wire--1">
            <span class="fl-wire__label">{b.flow.render}</span>
            <i class="fl-pk fl-pk--1" />
          </div>

          <div class="fl-page">
            <div class="fl-win">
              <div class="fl-win__bar">
                <i />
                <i />
                <i />
                <span>my-app.dev/blog/hello</span>
              </div>
              <div class="fl-win__body">
                <span class="fl-r" style="width:58%;height:12px" />
                <span class="fl-r" style="width:92%" />
                <span class="fl-r" style="width:84%" />
                <span class="fl-r" style="width:66%" />
                <div class="fl-isl">
                  <span class="fl-isl__lit" />
                  <span class="fl-isl__frame" />
                  <span class="fl-isl__tag">
                    &lt;Comments <b>client:visible</b> /&gt;
                  </span>
                </div>
                <span class="fl-r" style="width:74%" />
                <span class="fl-win__key">
                  <i class="mk" />
                  {b.legend[0]}
                </span>
              </div>
            </div>
          </div>

          <div class="fl-wire fl-wire--2">
            <span class="fl-wire__label">oxc</span>
            <i class="fl-pk fl-pk--2" />
          </div>

          <div class="fl-ship">
            <div class="fl-card">
              <div class="fl-card__bar">dist/</div>
              <ul class="fl-out">
                {OUT.map((o, i) => (
                  <li class={`fl-o fl-o--${i}${o.island ? " is-isl" : ""}${o.dim ? " is-dim" : ""}`}>{o.f}</li>
                ))}
              </ul>
            </div>
            <p class="fl-ship__note">{b.flow.ship}</p>
          </div>
        </div>
      </div>

      <ol class="flow__steps">
        {b.tiles.map((tile, i) => (
          <li>
            <span class="flow__n">{String(i + 1).padStart(2, "0")}</span>
            <a class="flow__t" href={tile.href}>
              {tile.t}
              <Arrow />
            </a>
            <p class="flow__d">{tile.d}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
