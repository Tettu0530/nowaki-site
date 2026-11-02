// Docs styles: a running-head technical manual on the shared base (DESIGN.md).
// Zero client JS: the chapter opener's streamlines are a CSS background image.
import { BASE_CSS, FAVICON, FONT_PRELOADS } from "./landing-style.ts";
import { streamlines } from "./streamlines.ts";

const W = 1200;
const H = 190;
// The obstacle sits where the chapter numeral is drawn (top right of the opener).
const lines = streamlines({ w: W, h: H, lines: 16, cx: 1040, cy: 104, rx: 170, ry: 58, step: 24 });
const opener =
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${W} ${H}' preserveAspectRatio='none'>` +
  lines
    .map((d, i) => `<path d='${d}' fill='none' stroke='${i === 6 ? "#d8bf86" : "#eceef1"}' stroke-opacity='${i === 6 ? 0.55 : 0.09}' stroke-width='1' vector-effect='non-scaling-stroke'/>`)
    .join("") +
  `</svg>`;
const OPENER_URL = `url("data:image/svg+xml,${encodeURIComponent(opener)}")`;

const DOCS_CSS = `
.docs{display:grid;grid-template-columns:calc(var(--gutter) + 236px) minmax(0,1fr);max-width:calc(var(--wrap) + 2 * var(--gutter));margin-inline:auto}
.side{position:sticky;top:61px;align-self:start;height:calc(100vh - 61px);overflow:auto;padding:28px 20px 32px var(--gutter);border-right:1px solid var(--line);font-size:.92rem}
.chapters{list-style:none;margin:0;padding:0}
.chapters a{display:grid;grid-template-columns:26px 1fr;gap:6px;padding:7px 0;color:var(--muted);transition:color .2s}
.chapters a:hover{color:var(--fg)}
.chapters i{font:400 .78rem/1.9 var(--mono);font-style:normal;font-variant-numeric:tabular-nums}
.chapters a[aria-current]{color:var(--fg)}
.chapters a[aria-current] i{color:var(--susuki)}
.side__ext{margin-top:24px;padding-top:16px;border-top:1px solid var(--line);display:flex;flex-direction:column;gap:6px;font-size:.86rem}
.side__ext a{color:var(--muted)}.side__ext a:hover{color:var(--fg)}
.side details{display:none}

.doc{min-width:0;position:relative}
.run{height:40px;display:flex;justify-content:space-between;align-items:center;gap:16px;padding:0 clamp(20px,4vw,72px);border-bottom:1px solid var(--line);font-size:.84rem;color:var(--muted);white-space:nowrap;overflow:hidden}
.run b{color:var(--fg);font-weight:500}
.run a{display:inline-flex;align-items:center;gap:8px;color:var(--muted);overflow:hidden}.run a:hover{color:var(--fg)}
.run a span{overflow:hidden;text-overflow:ellipsis}
.run i{font-style:normal;font-family:var(--mono);color:var(--susuki)}

/* The opener: streamlines bend around the chapter numeral on the right and fade out
   before the title column and above the rule, so nothing sits behind the text. */
.doc__num{position:absolute;top:84px;right:clamp(20px,4vw,72px);font:400 8.5rem/.86 var(--serif);letter-spacing:-.03em;color:var(--susuki);font-variant-numeric:lining-nums;pointer-events:none}
.doc__body{padding:0 clamp(20px,4vw,72px) 96px;background:
  linear-gradient(90deg,var(--ground) 0 52%,rgb(11 13 16 / 0) 74%) top left / 100% ${H}px no-repeat,
  linear-gradient(180deg,rgb(11 13 16 / 0) 45%,var(--ground)) top left / 100% ${H}px no-repeat,
  ${OPENER_URL} top center / 100% ${H}px no-repeat;
  background-origin:content-box;background-clip:content-box}
.doc__body > h1:first-child{padding-top:52px;font:400 clamp(2.2rem,1.6rem + 1.6vw,3.1rem)/1.06 var(--serif);letter-spacing:-.03em;max-width:24ch}
/* The lead's rule runs the full width of the doc, closing the opener band. */
.doc__body > h1:first-child + .lead{margin-top:14px;padding-bottom:30px;border-bottom:1px solid var(--line);margin-bottom:8px;max-width:none;padding-right:max(0px,calc(100% - 54ch));font-size:1.08rem;color:var(--body)}
.doc__body h2{margin:56px 0 14px;font:400 clamp(1.5rem,1.25rem + .8vw,1.9rem)/1.2 var(--serif);letter-spacing:-.02em;scroll-margin-top:80px}
.doc__body h3{margin:32px 0 10px;font:500 1.04rem var(--sans)}
.doc__body p,.doc__body li{max-width:56ch}
.doc__body li{text-wrap:pretty}
.doc__body p{margin:0 0 16px}
.doc__body ul,.doc__body ol{margin:0 0 18px;padding-left:1.2rem}
.doc__body li{margin:6px 0}
.doc__body li::marker{color:var(--muted)}
.doc__body a:not(.btn){color:var(--fg);text-decoration:underline;text-decoration-color:var(--susuki);text-underline-offset:.25em;text-decoration-thickness:1px}
.doc__body a:not(.btn):hover{text-decoration-color:var(--fg)}
.doc__body strong{color:var(--fg);font-weight:600}
.doc__body .plate{margin:20px 0 24px;max-width:min(100%,58rem);background:#0e1115;border:1px solid var(--line);border-radius:12px;overflow:hidden}
.plate__file{padding:9px 18px;border-bottom:1px solid var(--line);font:400 .78rem var(--mono);color:var(--muted)}
.doc__body pre{margin:0;padding:18px 22px;overflow:auto;font-size:.85rem;line-height:1.75;color:var(--body)}
.doc__body pre .c{color:#7b838f}.doc__body pre .k{color:var(--fg);font-weight:500}.doc__body pre .s{color:var(--fg)}
.doc__body pre code{font:inherit;color:inherit;background:none;border:0;padding:0;white-space:pre}
.doc__body table{border-collapse:collapse;width:100%;max-width:58rem;margin:18px 0 24px;font-size:.92rem;display:block;overflow-x:auto}
.doc__body th,.doc__body td{text-align:left;vertical-align:top;padding:11px 14px;border-bottom:1px solid var(--line)}
.doc__body th{font:500 .85rem var(--sans);color:var(--muted)}
.doc__body tr:first-child th{border-bottom-color:var(--line-strong)}
.doc__body td{color:var(--body)}
.doc__body td code{white-space:nowrap}

.doc__body .note{margin:22px 0;padding-top:14px;border-top:1px solid var(--susuki);max-width:56ch;color:var(--body);font-size:.96rem}
.doc__body .badge{display:inline-block;margin-left:.6rem;padding:1px 9px;border:1px solid rgb(216 191 134 / .45);border-radius:999px;font:500 .78rem var(--sans);color:var(--susuki);letter-spacing:0;vertical-align:.5em}
.doc__body .pager{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:80px;padding-top:22px;border-top:1px solid var(--line);max-width:58rem}
.doc__body .pager a{display:flex;flex-direction:column;gap:4px;text-decoration:none;color:var(--fg);font-weight:500}
.doc__body .pager a:hover span{text-decoration:underline;text-decoration-color:var(--susuki);text-underline-offset:.25em}
.pager small{font:400 .8rem var(--sans);color:var(--muted)}
.pager span{display:inline-flex;align-items:center;gap:8px}
.pager__next{text-align:right;align-items:flex-end}
.arrow{flex:none}

@media (max-width:1100px){.doc__num{display:none}}
@media (max-width:860px){
  .docs{grid-template-columns:minmax(0,1fr)}
  .side{position:static;height:auto;border-right:0;border-bottom:1px solid var(--line);padding:0 var(--gutter)}
  .side > nav,.side__ext{display:none}
  .side details{display:block}
  .side summary{list-style:none;display:flex;justify-content:space-between;align-items:center;gap:16px;padding:14px 0;cursor:pointer;color:var(--fg);font-weight:500}
  .side summary::-webkit-details-marker{display:none}
  .side__pos{display:flex;align-items:baseline;gap:10px;min-width:0}
  .side__pos i{font:400 .8rem var(--mono);font-style:normal;color:var(--susuki);flex:none}
  .side__pos span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .chev{flex:none;color:var(--muted);transition:transform .2s}
  .side details[open] .chev{transform:rotate(180deg)}
  .side details[open] .chapters{padding-bottom:12px}
  .run{justify-content:flex-end;padding:0 var(--gutter)}
  .run__where,.run i{display:none}
  .run--last{display:none}
  .doc__num{display:none}
  .doc__body :is(p,li) code{white-space:normal;overflow-wrap:anywhere}
  .doc__body table{font-size:.86rem}
  .doc__body th,.doc__body td{padding:9px 10px}
  /* Phones keep the wind as a short strip above the title; no line crosses type. */
  .doc__body{background:linear-gradient(180deg,rgb(11 13 16 / 0) 55%,var(--ground)) top left / 100% 48px no-repeat,${OPENER_URL} right top / 260% 48px no-repeat}
  .doc__body > h1:first-child{padding-top:64px}
}
`;

export const DOCS_HEAD = `
<meta name="theme-color" content="#0b0d10" />
${FAVICON}
${FONT_PRELOADS}
<style>${BASE_CSS}${DOCS_CSS}</style>`;
