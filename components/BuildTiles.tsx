// Three illustrated tiles for the landing ("Write a route. Mark an island. Ship.").
// Pure markup + CSS animation (lib/landing-style.ts, "tl-" rules); no client JS.
// Every drawing sits on a fixed 360x250 stage so lines, particles and boxes share
// one coordinate system. Chips are anchored by the edge a wire touches (inputs by
// their right edge, outputs by their left edge), so a font that renders a little
// wider or narrower can never pull a wire off its box.
import { STRINGS } from "../lib/i18n.ts";
import type { Locale } from "../lib/i18n.ts";

// Island card on stage 1: window (20,18) + border 1 + page offset (12, 24 bar + 1) + card (12,106 140x60).
// Its centre is where the bundle lands.
const PKT = "M 380 30 C 320 30 250 120 103 180";

// Stage 3 wiring: inputs end at x=104, the core spans 134..226 around y=125, outputs start at x=262.
const IN_Y = [41, 91, 141, 191];
const OUT_Y = [73, 125, 177];
const inPath = (y: number) => `M104 ${y} C122 ${y} 118 125 134 125`;
const outPath = (y: number) => (y === 125 ? "M226 125 L262 125" : `M226 125 C244 125 242 ${y} 262 ${y}`);

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
}

function Islands({ legend }: { legend: readonly string[] }) {
  return (
    <div class="tl tl--dots" aria-hidden="true">
      <div class="tl-legend">
        <span>
          <i class="k" />
          {legend[0]}
        </span>
        <span>
          <i class="k k--isl" />
          {legend[1]}
        </span>
      </div>
      <div class="tl-stage">
        <div class="tl-win">
          <div class="tl-win__bar">
            <i />
            <i />
            <i />
            <span>my-app.dev/blog/hello</span>
          </div>
          <div class="tl-win__page">
            <div class="tl-r" style="left:12px;top:10px;width:34px;height:7px" />
            <div class="tl-r" style="right:12px;top:11px;width:64px;height:5px" />
            <div class="tl-r" style="left:12px;top:32px;width:140px;height:10px" />
            <div class="tl-r" style="left:12px;top:48px;width:104px;height:10px" />
            <div class="tl-r" style="left:12px;top:68px;width:124px;height:5px" />
            <div class="tl-r" style="left:12px;top:78px;width:92px;height:5px" />
            <div class="tl-img">
              <div class="tl-img__m" />
            </div>
            <div class="tl-card tl-isl" style="left:12px;top:106px;width:140px;height:60px">
              <span class="tl-isl__tag">client:visible</span>
              <span class="tl-card__name">Comments.tsx</span>
              <span class="tl-like">
                <svg width="12" height="12" viewBox="0 0 16 16">
                  <path d="M8 13.6 2.6 8.4A3.3 3.3 0 0 1 8 4.2a3.3 3.3 0 0 1 5.4 4.2Z" stroke-width="1.4" stroke-linejoin="round" />
                </svg>
                Like
                <span class="tl-cnt">
                  <b class="tl-c0">0</b>
                  <b class="tl-c1">1</b>
                </span>
              </span>
            </div>
            <div class="tl-card" style="left:164px;top:106px;width:144px;height:60px">
              <span class="tl-card__name">HTML</span>
              <div class="tl-r" style="left:9px;top:30px;width:110px;height:5px" />
              <div class="tl-r" style="left:9px;top:40px;width:80px;height:5px" />
            </div>
            <div class="tl-card" style="left:12px;top:176px;width:296px;height:30px">
              <div class="tl-r" style="left:9px;top:12px;width:180px;height:5px" />
            </div>
          </div>
          <div class="tl-win__scan" />
        </div>
        <svg class="tl-wire1" viewBox="0 0 360 250" width="360" height="250">
          <path d={PKT} />
        </svg>
        <span class="tl-pkt" style={`offset-path:path("${PKT}")`}>
          Comments.js
        </span>
      </div>
    </div>
  );
}

function Routing({ r }: { r: { idle: string; label: string; params: string; method: string } }) {
  return (
    <div class="tl" aria-hidden="true">
      <div class="tl-stage tl-stage--route">
        <div class="tl-url">
          my-app.dev
          <span class="tl-url__typed">
            <span class="tl-ta">/blog/hello</span>
            <span class="tl-tb">/api/posts</span>
          </span>
        </div>
        <ul class="tl-tree">
          <li>
            <span class="tl-d">routes/</span>
            <ul>
              <li>
                <span class="tl-lab">_layout.tsx</span>
              </li>
              <li>
                <span>index.tsx</span>
              </li>
              <li>
                <span class="tl-d">blog/</span>
                <ul>
                  <li>
                    <span class="tl-la">[slug].tsx</span>
                  </li>
                </ul>
              </li>
              <li>
                <span class="tl-d">api/</span>
                <ul>
                  <li>
                    <span class="tl-lb">posts.ts</span>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
        <div class="tl-res">
          <div class="tl-ri">
            <span class="tl-tag">{r.label}</span>
            <span>{r.idle}</span>
          </div>
          <div class="tl-ra">
            <span class="tl-pill">page</span>
            <span>blog/[slug].tsx</span>
            <span class="tl-tag">{r.params}</span>
            <span class="tl-fg">{'{ slug: "hello" }'}</span>
            <span class="tl-dim">loader → HTML</span>
          </div>
          <div class="tl-rb">
            <span class="tl-pill">api</span>
            <span>api/posts.ts</span>
            <span class="tl-tag">{r.method}</span>
            <span class="tl-fg">GET</span>
            <span class="tl-dim">handler → Response</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Toolchain() {
  const ins = ["page.tsx", "Comments.tsx", "posts.ts", "app.css"];
  const outs = ["a1f3c.js", "9b20e.js", "4d1a.css"];
  return (
    <div class="tl tl--grid" aria-hidden="true">
      <div class="tl-stage">
        <svg class="tl-wires" viewBox="0 0 360 250" width="360" height="250">
          {IN_Y.map((y) => (
            <path d={inPath(y)} />
          ))}
          {OUT_Y.map((y) => (
            <path d={outPath(y)} />
          ))}
        </svg>
        {ins.map((f, i) => (
          <span class="tl-chip tl-chip--in" style={`top:${IN_Y[i] - 13}px`}>
            {f}
          </span>
        ))}
        {IN_Y.map((y, i) => (
          <i class="tl-p tl-p--in" style={`offset-path:path("${inPath(y)}");animation-delay:${(i * 0.5).toFixed(1)}s`} />
        ))}
        <div class="tl-core">
          <b>oxc</b>
          <span class="tl-steps">
            <span style="animation-delay:0s">parse</span>
            <span style="animation-delay:2s">transform</span>
            <span style="animation-delay:4s">bundle</span>
            <span style="animation-delay:6s">hash</span>
          </span>
        </div>
        <span class="tl-tag tl-under">Rust</span>
        {OUT_Y.map((y, i) => (
          <i class="tl-p tl-p--out" style={`offset-path:path("${outPath(y)}");animation-delay:${(0.3 + i * 0.65).toFixed(2)}s`} />
        ))}
        {outs.map((f, i) => (
          <span class="tl-chip tl-chip--out" style={`top:${OUT_Y[i] - 13}px;animation-delay:${(5.6 + i * 0.5).toFixed(1)}s`}>
            {f}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function BuildTiles({ locale }: { locale: Locale }) {
  const b = STRINGS[locale].build;
  const art = [<Islands legend={b.legend} />, <Routing r={b.resolver} />, <Toolchain />];
  return (
    <div class="tiles">
      {b.tiles.map((tile, i) => (
        <div class="tile">
          {art[i]}
          <a class="tile__t" href={tile.href}>
            {tile.t}
            <Arrow />
          </a>
          <p class="tile__d">{tile.d}</p>
        </div>
      ))}
    </div>
  );
}
