// Landing page styles. Plain CSS, no runtime: the page's only client JS is the
// copy-button island. Fonts are self-hosted Geist (OFL), see assets/fonts.
import serifUrl from "../assets/fonts/GeistSerifVF.woff2";
import sansUrl from "../assets/fonts/Geist-Variable.woff2";
import monoUrl from "../assets/fonts/GeistMono-Variable.woff2";

export const FAVICON = `<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%230b0d10'/%3E%3Cpath d='M5 11c7 0 9-4 15-4s7 2 7 2M5 17c7 0 10-3 16-3s6 1 6 1M5 23c7 0 9-2 15-2s7 1 7 1' fill='none' stroke='%23d8bf86' stroke-width='2.2' stroke-linecap='round'/%3E%3C/svg%3E" />`;

export const FONT_PRELOADS = `
<link rel="preload" href="${serifUrl}" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="${sansUrl}" as="font" type="font/woff2" crossorigin />`;

/** Fonts, tokens, base elements, site nav and buttons: shared by the landing and the docs. */
export const BASE_CSS = `
@font-face{font-family:"Geist";src:url("${sansUrl}") format("woff2");font-weight:100 900;font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2190-2193,U+2197,U+2212,U+2215,U+2713,U+2717,U+FEFF,U+FFFD}
@font-face{font-family:"Geist Mono";src:url("${monoUrl}") format("woff2");font-weight:100 900;font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2190-2193,U+2197,U+2212,U+2215,U+2713,U+2717,U+FEFF,U+FFFD}
@font-face{font-family:"Geist Serif";src:url("${serifUrl}") format("woff2");font-weight:400;font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2190-2193,U+2197,U+2212,U+2215,U+2713,U+2717,U+FEFF,U+FFFD}

:root{
  --ground:#0b0d10;--raise:#12151a;--raise-2:#171b21;
  --fg:#eceef1;--body:#c9cdd3;--muted:#9ba3ae;
  --line:rgb(236 238 241 / .09);--line-strong:rgb(236 238 241 / .18);
  --susuki:#d8bf86;--susuki-ink:#0b0d10;--mark-no:#6b727d;
  --sans:"Geist",ui-sans-serif,system-ui,"Hiragino Sans","Noto Sans JP",sans-serif;
  --serif:"Geist Serif","Hiragino Mincho ProN","Yu Mincho","Noto Serif JP",serif;
  --mono:"Geist Mono",ui-monospace,SFMono-Regular,Menlo,monospace;
  --gutter:clamp(16px,1rem + 3vw,96px);
  --wrap:1248px;
  --ease:cubic-bezier(.16,1,.3,1);
  color-scheme:dark;
}
*,*::before,*::after{box-sizing:border-box}
html{background:var(--ground);-webkit-text-size-adjust:100%;scroll-padding-top:76px}
@media (prefers-reduced-motion:no-preference){html{scroll-behavior:smooth}}
body{margin:0;color:var(--body);font:16px/1.65 var(--sans);-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;overflow-x:clip}
h1,h2,h3{color:var(--fg);margin:0;font-weight:400;text-wrap:balance}
:lang(ja) :is(h1,h2,h3,p,li,td,th,figcaption,span,a){word-break:auto-phrase;line-break:strict}
:where(p,li,td,th) code{white-space:nowrap}
p{margin:0;text-wrap:pretty}
a{color:inherit;text-decoration:none}
code,pre{font-family:var(--mono)}
::selection{background:var(--susuki);color:var(--susuki-ink)}
:focus-visible{outline:2px solid var(--susuki);outline-offset:3px;border-radius:6px}
::-webkit-scrollbar{width:10px;height:10px}::-webkit-scrollbar-track{background:var(--ground)}
::-webkit-scrollbar-thumb{background:#262b33;border-radius:10px;border:2px solid var(--ground)}
html{scrollbar-color:#262b33 var(--ground)}
.skip{position:absolute;left:12px;top:-60px;z-index:50;background:var(--fg);color:var(--ground);padding:8px 14px;border-radius:8px;font-weight:600}
.skip:focus{top:12px}
.wrap{max-width:calc(var(--wrap) + 2 * var(--gutter));margin-inline:auto;padding-inline:var(--gutter)}
.tlink{color:var(--fg);text-decoration:underline;text-decoration-color:var(--susuki);text-underline-offset:.28em;text-decoration-thickness:1px;transition:text-decoration-color .2s}
.tlink:hover{text-decoration-color:var(--fg)}
:where(p,li,td) code{font-size:.88em;color:var(--fg);background:var(--raise-2);border:1px solid var(--line);border-radius:5px;padding:.08em .38em}

/* ---------- nav ---------- */
.nav{position:sticky;top:0;z-index:20;border-bottom:1px solid var(--line);background:var(--ground)}
.nav__in{height:60px;display:flex;align-items:center;gap:clamp(12px,2vw,28px)}
.brand{display:flex;white-space:nowrap;align-items:baseline;gap:.45rem;color:var(--fg);font-weight:600;font-size:1.06rem;letter-spacing:-.02em}
.brand small{font:400 .82rem var(--serif);color:var(--muted)}
.nav__links{display:flex;align-items:center;gap:clamp(14px,1.6vw,24px);margin-left:auto;font-size:.92rem}
.nav__links a{color:var(--muted);transition:color .2s}
.nav__links a:hover,.nav__links a[aria-current]{color:var(--fg)}
.nav__links .btn--solid,.nav__links .btn--solid:hover{color:var(--ground)}
.lang{display:flex;white-space:nowrap;flex:none;gap:.15rem;padding:2px;border:1px solid var(--line);border-radius:8px;font-size:.8rem}
.lang a{padding:3px 8px;border-radius:6px}
.lang a[aria-current]{background:var(--raise-2);color:var(--fg)}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:.4rem;height:38px;padding:0 15px;border-radius:9px;font:600 .9rem var(--sans);white-space:nowrap;transition:background .2s,color .2s,border-color .2s}
.btn--solid{background:var(--fg);color:var(--ground)}
.btn--solid:hover{background:#fff}
.btn--line{border:1px solid var(--line-strong);color:var(--fg)}
.btn--line:hover{border-color:var(--fg)}
.menu{display:none;position:relative}
.menu summary{list-style:none;display:grid;place-items:center;width:38px;height:38px;border:1px solid var(--line-strong);border-radius:9px;color:var(--fg);cursor:pointer}
.menu summary::-webkit-details-marker{display:none}
.menu[open] summary{border-color:var(--fg)}
.menu__panel{position:absolute;right:0;top:46px;min-width:180px;display:flex;flex-direction:column;padding:6px;border:1px solid var(--line-strong);border-radius:10px;background:var(--raise);box-shadow:0 12px 32px -12px rgb(0 0 0 / .7)}
.nav__links .menu__panel a{padding:10px 12px;border-radius:7px;color:var(--fg)}
.nav__links .menu__panel a:hover{background:var(--raise-2)}
.menu__lang{display:none;gap:4px;margin-top:4px;padding-top:6px;border-top:1px solid var(--line)}
.nav__links .menu__lang a{flex:1;text-align:center;color:var(--muted)}
.nav__links .menu__lang a[aria-current]{color:var(--fg);background:var(--raise-2)}
@media (max-width:760px){.nav__links .hide-sm{display:none}.menu{display:block}}
@media (max-width:420px){.nav__links>.lang{display:none}.menu__lang{display:flex}}
@media (max-width:480px){.nav__links .hide-xs{display:none}.nav__links{gap:10px}.btn{padding:0 12px}}
@media (max-width:360px){
  .brand small{display:none}
  .nav .btn{padding:0 10px;font-size:.84rem}
  .lang a{padding:3px 6px}
  .nav ~ main .copybar{height:auto;padding-block:10px}
  .copybar .copybar__cmd{white-space:normal;overflow-wrap:anywhere}
}

`;

/** Landing-only rules. */
export const LANDING_CSS = `
/* ---------- hero ---------- */
.hero{position:relative;border-bottom:1px solid var(--line);overflow:hidden;isolation:isolate}
.hero__flow{position:absolute;inset:0;z-index:-1;width:100%;height:100%}
.hero__flow .sl{stroke:var(--fg);stroke-opacity:.10;stroke-width:1}
.hero__flow .sl.is-g{stroke:var(--susuki);stroke-opacity:.30}
.hero__flow .st{stroke:var(--fg);stroke-opacity:.5;stroke-width:1.2;stroke-dasharray:70 1100;stroke-linecap:round}
.hero__flow .st.is-g{stroke:var(--susuki);stroke-opacity:.95}
@media (prefers-reduced-motion:no-preference){
  .hero__flow .st{animation:gust var(--d,7s) linear var(--o,0s) infinite}
  @supports (animation-timeline:scroll()){
    .hero__flow{animation:pass linear both;animation-timeline:scroll(root);animation-range:0 85vh}
  }
}
@media (prefers-reduced-motion:reduce){.hero__flow .st{display:none}}
@keyframes gust{from{stroke-dashoffset:1170}to{stroke-dashoffset:0}}
@keyframes pass{to{opacity:.25;transform:translate3d(-6%,0,0) scaleY(.92)}}

.hero__grid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);min-height:min(calc(100svh - 60px),780px)}
.rel{display:flex;flex-direction:column;justify-content:center;padding:clamp(48px,7vh,96px) clamp(24px,3vw,56px) clamp(48px,7vh,96px) 0;border-right:1px solid var(--line)}
.rel__num{display:block;margin:.12em 0 .18em;font:400 clamp(7rem,2rem + 13vw,15.5rem)/.86 var(--serif);letter-spacing:-.035em;color:var(--susuki);font-variant-numeric:lining-nums}
.rel__link{align-self:flex-start;font-weight:500}
.rel__full{margin-top:.6rem;font:400 .85rem var(--sans);color:var(--muted)}
.rel__full code{font:400 .8rem var(--mono);background:none;border:0;padding:0;color:var(--body)}
.pitch{display:flex;flex-direction:column;justify-content:center;padding:clamp(48px,7vh,96px) 0 clamp(48px,7vh,96px) clamp(28px,5vw,80px)}
.pitch h1{font:400 clamp(2.4rem,1.3rem + 2.9vw,4rem)/1.05 var(--serif);letter-spacing:-.032em;max-width:16ch}
.pitch h1 span{display:block}
.pitch h1 em{font-style:normal;color:var(--susuki)}
:lang(ja) .pitch h1{font-size:clamp(2rem,1.1rem + 2.5vw,3.35rem);line-height:1.18;letter-spacing:-.01em;max-width:none}
.pitch__sub{margin-top:1.5rem;max-width:52ch;font-size:clamp(1rem,.95rem + .25vw,1.14rem);color:var(--body)}
.pitch__cta{margin-top:2rem;display:flex;flex-wrap:wrap;gap:12px;align-items:center}
.pitch__cta>*,.close__cta>*,.copybar{min-width:0}
.pitch__note{margin-top:1rem;font-size:.9rem;color:var(--muted);max-width:60ch}
@media (prefers-reduced-motion:no-preference){
  .rise{animation:rise .9s var(--ease) both;animation-delay:var(--rd,0s)}
  .rel__num.rise{animation-duration:1.3s}
}
@keyframes rise{from{opacity:0;transform:translate3d(0,14px,0)}}

/* copy command (island) */
.copybar{display:inline-flex;align-items:center;text-align:left;gap:.85rem;height:48px;padding:0 8px 0 16px;border:1px solid var(--line-strong);border-radius:10px;background:var(--raise);color:var(--fg);font:500 .98rem var(--mono);cursor:pointer;transition:border-color .2s,background .2s;max-width:100%}
.copybar:hover{border-color:var(--susuki);background:var(--raise-2)}
.copybar__prompt{color:var(--muted)}
.copybar__cmd{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font:inherit}
.copybar__state{margin-left:.4rem;height:32px;display:inline-flex;align-items:center;padding:0 10px;border-radius:7px;background:var(--raise-2);color:var(--muted);font:500 .78rem var(--sans);min-width:5.4em;justify-content:center}
.copybar[data-copied] .copybar__state{color:var(--susuki)}

/* ---------- sections ---------- */
.sec{padding-block:clamp(72px,6vw + 40px,136px)}
.sec + .sec{background:linear-gradient(var(--line),var(--line)) top center / min(calc(100% - 2 * var(--gutter)),var(--wrap)) 1px no-repeat}
.sec__head{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:clamp(24px,4vw,64px);align-items:end;margin-bottom:clamp(36px,4vw,56px)}
.sec h2{font:400 clamp(1.9rem,1.2rem + 1.9vw,2.85rem)/1.08 var(--serif);letter-spacing:-.028em;max-width:20ch}
:lang(ja) .sec h2{line-height:1.3;letter-spacing:0;font-size:clamp(1.6rem,1.05rem + 1.5vw,2.3rem)}
.lead{color:var(--body);max-width:52ch;font-size:1.06rem}
.note{margin-top:1.4rem;font-size:.88rem;color:var(--muted);max-width:54ch}

/* new in this release */
.new{border-bottom:1px solid var(--line)}
.new__in{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr)}
.new__h{padding:28px clamp(24px,3vw,56px) 28px 0;border-right:1px solid var(--line)}
.new__h h2{font:500 .95rem var(--sans);color:var(--fg);letter-spacing:0}
.new__h p{margin-top:.3rem;font:400 .82rem var(--mono);color:var(--muted)}
.new__list{display:grid;grid-template-columns:repeat(2,1fr)}
.new__item{padding:28px 0 28px clamp(28px,5vw,80px)}
.new__item:nth-child(n+3){border-top:1px solid var(--line)}
.new__item h3{font:500 1.02rem var(--sans);letter-spacing:-.01em}
.new__item p{margin-top:.4rem;font-size:.94rem;color:var(--muted);max-width:44ch}
@media (prefers-reduced-motion:no-preference){@supports (animation-timeline:view()){
  .new__item{animation:rise linear both;animation-timeline:view();animation-range:entry 0% entry 60%}
}}

/* proof: measured numbers */
.proof{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:clamp(32px,5vw,80px);align-items:start}
.bars{display:grid;gap:clamp(36px,4vw,52px)}
.ledger{position:sticky;top:96px}
.ledger h3{font:500 .92rem var(--sans);color:var(--muted);padding-bottom:10px;border-bottom:1px solid var(--line)}
.ledger__t{min-width:0;width:100%;font-size:.9rem}
.ledger__t th,.ledger__t td{padding:11px 0;border-bottom:1px solid var(--line);vertical-align:baseline}
.ledger__t tbody th{font-weight:400;color:var(--body);width:auto}
.ledger__t th code{display:block;margin-top:2px;font:400 .76rem var(--mono);color:var(--muted);background:none;border:0;padding:0}
.ledger__t td{text-align:right;font:500 .9rem var(--mono);color:var(--fg);font-variant-numeric:tabular-nums;white-space:nowrap;padding-left:16px}
.ledger__t tfoot th,.ledger__t tfoot td{border-bottom:0;border-top:1px solid var(--fg);color:var(--fg);font-weight:500}
.ledger__t tfoot td{color:var(--susuki)}
.ledger__src{margin-top:10px;font-size:.8rem;color:var(--muted)}
.ledger .note{margin-top:28px}
.bars__group{display:grid;gap:18px}
.bars__group h3{font:500 .92rem var(--sans);color:var(--muted);padding-bottom:10px;border-bottom:1px solid var(--line)}
.bar__top{display:flex;justify-content:space-between;gap:1rem;align-items:baseline}
.bar__label{color:var(--body)}
.bar__val{font:500 1rem var(--mono);color:var(--fg);font-variant-numeric:tabular-nums;white-space:nowrap}
.bar__val.is-muted{color:var(--muted)}
.bar__track{margin-top:10px;height:6px;border-radius:6px;background:var(--raise-2);overflow:hidden}
.bar__fill{height:100%;border-radius:6px;background:var(--susuki);transform-origin:left}
.bar__fill.is-muted{background:#3a404a}
@media (prefers-reduced-motion:no-preference){@supports (animation-timeline:view()){
  .bar__fill{animation:grow linear both;animation-timeline:view();animation-range:entry 20% cover 45%}
}}
@keyframes grow{from{transform:scaleX(0)}}
.stats{margin-top:clamp(48px,5vw,72px);display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--line)}
.stat{padding:24px 24px 0 0}
.stat + .stat{padding-left:24px;border-left:1px solid var(--line)}
.stat b{display:block;font:400 clamp(1.7rem,1.2rem + 1.3vw,2.4rem)/1.1 var(--serif);color:var(--fg);letter-spacing:-.02em}
.stat p{margin-top:.5rem;font-size:.92rem;color:var(--muted);max-width:30ch}

/* code */
.codes{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}
.code{border:1px solid var(--line);border-radius:12px;background:#0e1115;overflow:hidden}
.code__bar{display:flex;align-items:center;justify-content:space-between;padding:11px 16px;border-bottom:1px solid var(--line);font:400 .8rem var(--mono);color:var(--muted)}
.code__bar b{font:500 .82rem var(--sans);color:var(--fg)}
.code pre{margin:0;padding:18px 18px 20px;overflow:auto;font-size:.84rem;line-height:1.75;color:var(--body)}
.code .c{color:#7b838f}.code .k{color:var(--fg);font-weight:500}.code .s{color:var(--susuki)}.code .f{color:#b9c6d8}.code .a{color:#d9c9a3}
.conv{margin-top:36px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:48px}
.conv h3{grid-column:1/-1;font:500 .95rem var(--sans);margin-bottom:10px}
.conv div{display:flex;gap:1rem;align-items:baseline;padding:12px 0;border-top:1px solid var(--line)}
.conv code{font-size:.84rem;color:var(--susuki);white-space:nowrap}
.conv span{font-size:.92rem;color:var(--muted)}

/* jetstream rail */
.rail{display:grid;grid-template-columns:repeat(5,1fr);position:relative;border-top:1px solid var(--line-strong)}
.rail::after{content:"";position:absolute;left:0;top:-1px;height:1px;width:100%;background:var(--susuki);transform-origin:left}
.hop{position:relative;padding:28px 20px 0 0}
.hop::before{content:"";position:absolute;top:-5px;left:0;width:9px;height:9px;border-radius:50%;background:var(--ground);border:1px solid var(--susuki)}
.hop:first-child::before{background:var(--susuki)}
.hop h3{font:500 1.05rem var(--sans);color:var(--fg)}
.hop p{margin-top:.45rem;font-size:.93rem;color:var(--muted)}
@media (prefers-reduced-motion:no-preference){@supports (animation-timeline:view()){
  .rail::after{animation:grow linear both;animation-timeline:view();animation-range:entry 30% cover 55%}
}}
.only{margin-top:clamp(40px,4vw,56px);padding:20px 0 0;border-top:1px solid var(--susuki);color:var(--body);max-width:54ch}
.only b{color:var(--fg);font-weight:600}

/* compare table */
.tbl{overflow-x:auto;border:1px solid var(--line);border-radius:12px}
table{border-collapse:collapse;width:100%;min-width:760px;font-size:.93rem}
th,td{text-align:left;vertical-align:top;padding:16px 18px;border-bottom:1px solid var(--line)}
tbody tr:last-child>*{border-bottom:0}
thead th{font:500 .85rem var(--sans);color:var(--muted);background:var(--raise)}
thead th.is-n{color:var(--susuki)}
tbody th{font-weight:500;color:var(--fg);width:24%}
td{color:var(--muted)}
td.is-n{color:var(--fg);background:rgb(216 191 134 / .05)}
.jet-tag{display:inline-block;margin-left:.5rem;padding:1px 7px;border-radius:999px;border:1px solid rgb(216 191 134 / .45);font:500 .72rem var(--sans);color:var(--susuki);vertical-align:2px}

/* fit */
.fit{display:grid;grid-template-columns:1fr 1fr;gap:clamp(24px,4vw,64px)}
.fit h3{font:500 1rem var(--sans);padding-bottom:12px;border-bottom:1px solid var(--line)}
.fit h3.is-no{color:var(--muted)}
.fit ul{list-style:none;margin:0;padding:0}
.fit li{display:grid;grid-template-columns:20px 1fr;gap:10px;padding:14px 0;border-bottom:1px solid var(--line)}
.fit li svg{margin-top:5px;color:var(--susuki)}
.mark-no{color:var(--mark-no)}
.fit .is-no + ul li{color:var(--muted)}

/* features */
.feats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:clamp(32px,5vw,80px)}
.feat{padding:22px 0;border-top:1px solid var(--line)}
.feat h3{font:500 1.04rem var(--sans)}
.feat p{margin-top:.45rem;font-size:.95rem;color:var(--muted);max-width:50ch}

/* status */
.status{margin-top:clamp(48px,5vw,72px);display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(24px,4vw,64px)}
.status__p{margin-top:14px;color:var(--body);max-width:46ch}
.status h3{font:500 .95rem var(--sans);padding-bottom:12px;border-bottom:1px solid var(--line)}
.status h3.is-no{color:var(--muted)}
.status ul{list-style:none;margin:0;padding:0}
.status .soon ul{columns:1}
.status li{break-inside:avoid;display:grid;grid-template-columns:18px 1fr;gap:8px;padding:10px 0;font-size:.94rem;border-bottom:1px solid var(--line)}
.status .soon li{color:var(--muted)}
.status li svg{margin-top:6px}

/* close */
.close{position:relative;overflow:hidden;isolation:isolate}
.close__flow{position:absolute;inset:0;z-index:-1;width:100%;height:100%;opacity:.7}
.close__flow .sl{stroke:var(--fg);stroke-opacity:.08}
.close__flow .sl.is-g{stroke:var(--susuki);stroke-opacity:.25}
.close__flow .st{stroke:var(--fg);stroke-opacity:.4;stroke-width:1.2;stroke-dasharray:70 1100;stroke-linecap:round}
.close__flow .st.is-g{stroke:var(--susuki);stroke-opacity:.85}
@media (prefers-reduced-motion:no-preference){.close__flow .st{animation:gust var(--d,7s) linear var(--o,0s) infinite}}
@media (prefers-reduced-motion:reduce){.close__flow .st{display:none}}
.close h2{font:400 clamp(2.2rem,1.3rem + 3vw,4.2rem)/1.04 var(--serif);letter-spacing:-.035em;max-width:none}
:lang(ja) .close h2{line-height:1.25;letter-spacing:0}
.close__cta{margin-top:2rem;display:flex;flex-wrap:wrap;gap:12px;align-items:center}
.steps{margin-top:clamp(48px,5vw,72px);display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--line)}
.step{padding:24px 24px 0 0}
.step + .step{padding-left:24px;border-left:1px solid var(--line)}
.step h3{font:500 1.02rem var(--sans)}
.step code{display:inline-block;margin-top:.5rem;font-size:.84rem;color:var(--susuki)}
.step p{margin-top:.5rem;font-size:.93rem;color:var(--muted)}

/* footer */
.foot{border-top:1px solid var(--line);padding-block:48px 40px;font-size:.9rem;color:var(--muted)}
.foot__top{display:flex;flex-wrap:wrap;justify-content:space-between;gap:24px}
.foot__top p{margin-top:.5rem;max-width:44ch}
.foot nav{display:flex;flex-wrap:wrap;gap:20px}
.foot nav a:hover{color:var(--fg)}
.foot__legal{margin-top:32px;padding-top:20px;border-top:1px solid var(--line);display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;font-size:.8rem}
.foot__tm{margin-top:12px;font-size:.76rem;max-width:66ch}

/* ---------- responsive ---------- */
@media (max-width:1000px){
  .hero__grid,.new__in{grid-template-columns:minmax(0,1fr)}
  .rel{border-right:0;border-bottom:1px solid var(--line);padding:40px 0 32px}
  .rel__num{font-size:clamp(6rem,4rem + 14vw,10rem);letter-spacing:-.01em}
  .pitch{padding:36px 0 56px}
  .new__h{border-right:0;padding:28px 0 0}
  .new__item{padding-left:0;padding-right:24px}
  .sec__head{grid-template-columns:minmax(0,1fr);align-items:start}
  .rail{grid-template-columns:1fr;border-top:0;border-left:1px solid var(--line-strong);margin-left:4px}
  .hop{padding:0 0 28px 24px}
  .hop::before{top:6px;left:-5px}
  .rail::after{display:none}
}
@media (max-width:760px){
  .new__list,.codes,.conv,.fit,.feats,.status,.stats,.steps,.proof{grid-template-columns:1fr}
  .ledger{position:static}
  .new__item:nth-child(n+2){border-top:1px solid var(--line)}
  .stat + .stat,.step + .step{padding-left:0;border-left:0;border-top:1px solid var(--line)}
  .stat,.step{padding:20px 0}
  .status ul{columns:1}
  .conv div{flex-direction:column;gap:.2rem}
  .copybar{width:100%;font-size:.86rem;gap:.6rem;padding-left:12px}
  .copybar__state{min-width:0;margin-left:auto}
  .pitch__cta,.close__cta{flex-direction:column;align-items:stretch}
  .pitch__cta .btn,.close__cta .btn{align-self:flex-start}
}
`;
