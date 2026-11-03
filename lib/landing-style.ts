// Landing page styles. Plain CSS, no runtime: the page's only client JS is the
// copy-button island. Fonts are self-hosted Geist (OFL), see assets/fonts.
import serifUrl from "../assets/fonts/GeistSerifVF.woff2";
import sansUrl from "../assets/fonts/Geist-Variable.woff2";
import monoUrl from "../assets/fonts/GeistMono-Variable.woff2";
import faviconUrl from "../assets/favicon.svg";
import markUrl from "../assets/nowaki-mark.svg";

/** The Nowaki mark (a split N around a typhoon eye, susuki on transparent), from the framework repo. */
export const MARK_URL = markUrl;

export const FAVICON = `<link rel="icon" type="image/svg+xml" href="${faviconUrl}" />`;

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
.brand img{align-self:center;width:24px;height:24px;margin:0 -.05rem 0 -.2rem}
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
/* ---------- island map (hero, close) ----------
   The sea is static HTML drawn as a 24px dot lattice centred on the page; islands
   are snapped to it (edges fall between dots) and hydrate in directive order. */
.map{--cell:24px;position:absolute;inset:0;z-index:-1;pointer-events:none}
.map__sea{position:absolute;inset:0;opacity:.24;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Ccircle cx='12' cy='12' r='1.15' fill='%23eceef1'/%3E%3C/svg%3E") 50% 0/var(--cell) var(--cell)}
.hero .map__sea{-webkit-mask-image:radial-gradient(ellipse 36% 42% at 71% 52%,rgb(0 0 0 / .22) 45%,#000 100%);mask-image:radial-gradient(ellipse 36% 42% at 71% 52%,rgb(0 0 0 / .22) 45%,#000 100%)}
.isl{position:absolute;left:calc(50% + var(--c) * var(--cell) - var(--cell) / 2);top:calc(var(--r) * var(--cell));width:calc(var(--w) * var(--cell));height:calc(var(--h) * var(--cell))}
.isl.is-b{top:calc(100% - var(--rb) * var(--cell))}
@supports (top:round(down,10px,3px)){.isl.is-b{top:round(down,calc(100% - var(--rb) * var(--cell)),var(--cell))}}
.isl__lit{position:absolute;inset:0;border-radius:6px;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Ccircle cx='12' cy='12' r='1.7' fill='%23d8bf86'/%3E%3C/svg%3E") 0 0/var(--cell) var(--cell) rgb(216 191 134 / .05)}
.isl__frame{position:absolute;inset:0;border:1px solid rgb(216 191 134 / .5);border-radius:6px}
/* corner marks, 5px outside the frame */
.isl__frame::before{--k:linear-gradient(var(--susuki),var(--susuki));content:"";position:absolute;inset:-5px;background:var(--k) 0 0/10px 1px,var(--k) 0 0/1px 10px,var(--k) 100% 0/10px 1px,var(--k) 100% 0/1px 10px,var(--k) 0 100%/10px 1px,var(--k) 0 100%/1px 10px,var(--k) 100% 100%/10px 1px,var(--k) 100% 100%/1px 10px;background-repeat:no-repeat}
.isl__tag{position:absolute;left:0;bottom:calc(100% + 10px);white-space:nowrap;font:400 .74rem/1 var(--mono);color:var(--muted)}
.isl__tag b{font-weight:500;color:var(--susuki)}
/* an island that never hydrated (the 404): dashed, no dots, no marks, no motion */
.isl.is-dormant .isl__frame{border-style:dashed;border-color:rgb(236 238 241 / .22);animation:none}
.isl.is-dormant .isl__frame::before{display:none}
.lost__ja{margin-top:.6rem}
.isl__wire{position:absolute;left:calc(100% + 6px);top:50%;height:1px;width:calc(50vw - (var(--c) + var(--w)) * var(--cell) + var(--cell) / 2);background:repeating-linear-gradient(90deg,rgb(216 191 134 / .5) 0 4px,transparent 4px 8px)}
.isl__ep{position:absolute;left:12px;bottom:9px;font:400 .72rem/1 var(--mono);color:var(--muted);white-space:nowrap}
.pk{position:absolute;left:0;top:-2px;width:100%;height:5px;opacity:0}
.pk::before{content:"";position:absolute;left:-2.5px;top:0;width:5px;height:5px;border-radius:50%;background:var(--fg)}
.pk--in::before{background:var(--susuki)}
.map__key{position:absolute;top:18px;right:max(var(--gutter),calc((100% - var(--wrap)) / 2));display:flex;gap:20px;margin:0;padding:6px 0 6px 16px;background:var(--ground);list-style:none;font:400 .78rem var(--sans);color:var(--muted)}
.map__key li{display:flex;align-items:center;gap:8px;white-space:nowrap}
.map__key .map__note{padding-left:20px;border-left:1px solid var(--line);color:#7b838f}
.k{position:relative;width:12px;height:12px;flex:none}
.k::before{content:"";position:absolute;inset:4.5px;border-radius:50%;background:rgb(236 238 241 / .5)}
.k--isl,.k--live{border:1px solid rgb(216 191 134 / .6);border-radius:3px}
.k--isl::before,.k--live::before{inset:3.5px;background:var(--susuki)}
.k--live{margin-right:9px}
.k--live::after{content:"";position:absolute;left:calc(100% + 1px);top:4.5px;width:9px;height:1px;background:repeating-linear-gradient(90deg,var(--susuki) 0 2px,transparent 2px 4px)}
@media (prefers-reduced-motion:no-preference){
  .hero .map__sea{animation:isl-in 1.2s var(--ease) both}
  .hero .isl__lit{animation:isl-sweep 1s var(--ease) var(--t) both}
  .hero .isl__frame{animation:isl-frame .6s linear var(--t) both}
  .hero .isl__frame::before{animation:isl-in .5s var(--ease) calc(var(--t) + .45s) both}
  .hero .isl__tag b{animation:isl-tag .6s linear var(--t) both}
  .hero .is-live .isl__lit{animation:isl-sweep 1s var(--ease) var(--t) both,isl-patch 3.6s linear calc(var(--t) + 1.2s) infinite}
  .hero .isl__wire{animation:isl-in .6s var(--ease) calc(var(--t) + .6s) both}
  .hero .pk--out{animation:pk-out 3.6s linear calc(var(--t) + 1.2s) infinite}
  .hero .pk--in{animation:pk-in 3.6s linear calc(var(--t) + 1.2s) infinite}
  @supports (animation-timeline:scroll()){
    .hero .map{animation:pass linear both;animation-timeline:scroll(root);animation-range:0 85vh}
  }
  @supports (animation-timeline:view()){
    .map--close .isl__lit{animation:isl-sweep linear both;animation-timeline:view();animation-range:entry 60% cover 50%}
    .map--close .isl__frame{animation:isl-frame linear both;animation-timeline:view();animation-range:entry 60% cover 50%}
  }
}
@keyframes isl-in{from{opacity:0}}
@keyframes isl-sweep{from{clip-path:inset(0 100% 0 0 round 6px)}to{clip-path:inset(0 0 0 0 round 6px)}}
@keyframes isl-frame{from{border-color:rgb(236 238 241 / .22);border-style:dashed}}
@keyframes isl-tag{from{color:var(--muted)}}
@keyframes isl-patch{0%,80%{background-color:rgb(216 191 134 / .05)}84%{background-color:rgb(216 191 134 / .22)}100%{background-color:rgb(216 191 134 / .05)}}
@keyframes pk-out{0%{transform:translateX(0);opacity:0}5%{opacity:1}34%{transform:translateX(100%);opacity:1}36%,100%{transform:translateX(100%);opacity:0}}
@keyframes pk-in{0%,46%{transform:translateX(100%);opacity:0}50%{opacity:1}80%{transform:translateX(0);opacity:1}82%,100%{transform:translateX(0);opacity:0}}
@keyframes pass{to{opacity:.3}}

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
.sec__head{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:16px clamp(24px,4vw,64px);margin-bottom:clamp(36px,4vw,56px)}
.sec__head > h2{flex:1 1 520px;min-width:0}
.sec__head > p,.sec__head > a{flex:0 1 auto}
.sec h2{font:400 clamp(1.9rem,1.2rem + 1.9vw,2.85rem)/1.08 var(--serif);letter-spacing:-.028em}
:lang(ja) .sec h2{line-height:1.3;letter-spacing:0;font-size:clamp(1.6rem,1.05rem + 1.5vw,2.3rem)}
.lead{color:var(--muted);max-width:44ch;font-size:1.06rem}
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
/* Jetstream demo: zero JS. The checkbox state drives the pulse, the hop flashes
   and the patched text. Two keyframe names per animation so every toggle restarts it. */
@property --p{syntax:"<number>";inherits:false;initial-value:0}
.jet{position:relative}
.jet__toggle{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}
.jet__bar{display:flex;flex-wrap:wrap;align-items:center;gap:14px 28px;margin-bottom:28px}
.jet__btn{display:inline-flex;align-items:center;gap:10px;height:44px;padding:0 18px;border:1px solid var(--line-strong);border-radius:999px;color:var(--fg);font:500 .95rem var(--sans);cursor:pointer;user-select:none;transition:border-color .2s}
.jet__btn:hover{border-color:var(--susuki)}
.jet__toggle:focus-visible + .jet__bar .jet__btn{outline:2px solid var(--susuki);outline-offset:3px}
.jet__heart{color:var(--muted)}
.jet__heart path{transition:fill-opacity .25s}
.jet__swap{display:inline-grid}
.jet__swap > *{grid-area:1/1;transition:opacity .25s}
.jet__on{opacity:0}
.jet__meta{font-size:.86rem;color:var(--muted)}
.jet__meta code{font:400 .84rem var(--mono);color:var(--fg)}
.jet__meta b{font:500 .86rem var(--mono);color:var(--fg)}
.jet__note{margin-top:22px;font-size:.84rem;color:var(--muted);max-width:60ch}
/* Patched text lands after the trip: state at Re-render (1s), DOM at Morph (2s). */
.jet__toggle:checked + .jet__bar .jet__off{opacity:0;transition-delay:var(--td,2s)}
.jet__toggle:checked + .jet__bar .jet__on{opacity:1;transition-delay:var(--td,2s)}
.jet__toggle:not(:checked) + .jet__bar .jet__off{transition-delay:var(--td,2s)}
.jet__toggle:not(:checked) + .jet__bar .jet__on{transition-delay:var(--td,2s)}
.jet__meta .jet__swap{--td:1s}
.jet__toggle:checked + .jet__bar .jet__heart{color:var(--susuki);transition:color .25s 2s}
.jet__toggle:checked + .jet__bar .jet__heart path{fill-opacity:1;transition-delay:2s}
.rail::before{content:"";position:absolute;z-index:1;top:-5px;left:calc(var(--p) * 100%);width:9px;height:9px;border-radius:50%;background:var(--fg);opacity:0;pointer-events:none}
@media (prefers-reduced-motion:no-preference){
  .jet:has(.jet__toggle:checked) .rail::before{animation:pulse-a 2.3s linear}
  .jet:has(.jet__toggle:not(:checked)) .rail::before{animation:pulse-b 2.3s linear}
  .jet:has(.jet__toggle:checked) .hop::before{animation:flash-a .5s var(--ease) calc(var(--i) * .5s)}
  .jet:has(.jet__toggle:not(:checked)) .hop::before{animation:flash-b .5s var(--ease) calc(var(--i) * .5s)}
  /* The island shows the request in flight until the patch lands. */
  .jet__toggle:checked + .jet__bar .jet__btn{animation:wait-a 2s steps(1,end)}
  .jet__toggle:not(:checked) + .jet__bar .jet__btn{animation:wait-b 2s steps(1,end)}
  .jet:has(.jet__toggle:checked) .hop h3{animation:ink-a .6s var(--ease) calc(var(--i) * .5s)}
  .jet:has(.jet__toggle:not(:checked)) .hop h3{animation:ink-b .6s var(--ease) calc(var(--i) * .5s)}
}
@media (prefers-reduced-motion:reduce){.jet *{--td:0s;transition-delay:0s !important}}
@keyframes pulse-a{0%{--p:0;opacity:0}5%{opacity:1}87%{--p:.8;opacity:1}100%{--p:.8;opacity:0}}
@keyframes pulse-b{0%{--p:0;opacity:0}5%{opacity:1}87%{--p:.8;opacity:1}100%{--p:.8;opacity:0}}
@keyframes flash-a{30%{background:var(--susuki);transform:scale(1.8)}}
@keyframes flash-b{30%{background:var(--susuki);transform:scale(1.8)}}
@keyframes wait-a{0%{border-color:var(--susuki);border-style:dashed}}
@keyframes wait-b{0%{border-color:var(--susuki);border-style:dashed}}
@keyframes ink-a{30%{color:var(--susuki)}}
@keyframes ink-b{30%{color:var(--susuki)}}
/* illustrated tiles ("Write a route. Mark an island. Ship."): fixed 360x250 stages, CSS only */
.tiles{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}
.tile{display:flex;flex-direction:column;gap:12px;min-width:0}
.tile__t{display:inline-flex;align-items:center;gap:8px;align-self:flex-start;margin-top:6px;color:var(--fg);font-weight:500;font-size:1rem}
.tile__t:hover{text-decoration:underline;text-decoration-color:var(--susuki);text-underline-offset:.28em}
.tile__d{color:var(--muted);font-size:.95rem;max-width:46ch}
.tl{position:relative;height:300px;border:1px solid var(--line);border-radius:12px;overflow:hidden;background:var(--ground)}
.tl--dots{background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Ccircle cx='12' cy='12' r='1.15' fill='%23eceef1' fill-opacity='.2'/%3E%3C/svg%3E") 0 0/24px 24px var(--ground)}
.tl--grid{background-image:linear-gradient(rgb(236 238 241 / .05) 1px,transparent 1px),linear-gradient(90deg,rgb(236 238 241 / .05) 1px,transparent 1px);background-size:36px 36px;background-position:-1px -1px}
.tl-stage{position:absolute;left:50%;top:50%;width:360px;height:250px;margin:-125px 0 0 -180px}
.tl-stage--route{margin-top:-116px}
.tl-tag{font:400 9px var(--mono);letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.tl-legend{position:absolute;left:0;top:0;z-index:1;display:flex;gap:16px;padding:9px 14px 7px;background:var(--ground);border-bottom-right-radius:8px;font:400 .74rem var(--sans);color:var(--muted)}
.tl-legend span{display:inline-flex;align-items:center;gap:7px}
.tl-chip{position:absolute;box-sizing:border-box;height:26px;display:flex;align-items:center;padding:0 9px;font:400 11px var(--mono);color:var(--muted);background:#0e1115;border:1px solid rgb(236 238 241 / .12);border-radius:6px;white-space:nowrap}
.tl-chip--in{right:256px}
.tl-chip--out{left:262px;animation:tl-write 8s ease infinite}
/* 1 · islands: HTML is scanned in, one bundle flies to one island, it hydrates (8s) */
.tl-win{position:absolute;left:20px;top:18px;width:320px;height:240px;box-sizing:border-box;border:1px solid rgb(236 238 241 / .14);border-radius:10px;background:var(--ground);overflow:hidden}
.tl-win__bar{height:24px;display:flex;align-items:center;gap:5px;padding:0 9px;border-bottom:1px solid var(--line)}
.tl-win__bar i{width:6px;height:6px;border-radius:50%;background:#3a404a}
.tl-win__bar span{margin-left:10px;padding:2px 9px;border-radius:4px;background:var(--raise);font:400 9px var(--mono);color:#7b838f}
.tl-win__page{position:absolute;left:0;right:0;top:25px;bottom:0;animation:tl-reveal 8s cubic-bezier(.4,0,.2,1) infinite}
.tl-win__scan{position:absolute;left:0;right:0;top:25px;height:1px;background:var(--susuki);box-shadow:0 6px 14px -4px rgb(216 191 134 / .55);animation:tl-scan 8s cubic-bezier(.4,0,.2,1) infinite}
.tl-r{position:absolute;border-radius:3px;background:var(--raise-2)}
.tl-card{position:absolute;box-sizing:border-box;padding:7px 9px;border-radius:6px;background:var(--raise);border:1px solid var(--line)}
.tl-card__name{display:block;font:400 9px var(--mono);color:var(--muted)}
.tl-img{position:absolute;right:12px;top:30px;width:130px;height:64px;box-sizing:border-box;border:1px solid var(--line);border-radius:5px;overflow:hidden}
.tl-img__m{position:absolute;inset:8px 6px 0;background:radial-gradient(circle,#3a404a 1px,transparent 1.4px) 0 0/5px 5px;clip-path:polygon(0 100%,18% 52%,32% 74%,54% 16%,74% 60%,88% 38%,100% 62%,100% 100%)}
/* the hero's island grammar: dashed = not hydrated, solid susuki + corner marks = hydrated */
.tl-isl{border-style:dashed;border-color:rgb(236 238 241 / .22);animation:tl-isl 8s ease infinite}
.tl-isl::before{--k:linear-gradient(var(--susuki),var(--susuki));content:"";position:absolute;inset:-5px;background:var(--k) 0 0/8px 1px,var(--k) 0 0/1px 8px,var(--k) 100% 0/8px 1px,var(--k) 100% 0/1px 8px,var(--k) 0 100%/8px 1px,var(--k) 0 100%/1px 8px,var(--k) 100% 100%/8px 1px,var(--k) 100% 100%/1px 8px;background-repeat:no-repeat;opacity:0;animation:tl-ring 8s ease infinite}
.tl-isl__tag{position:absolute;left:0;bottom:calc(100% + 7px);font:400 9px/1 var(--mono);color:var(--muted);white-space:nowrap;animation:tl-tagc 8s ease infinite}
.tl-like{display:flex;align-items:center;gap:6px;margin-top:10px;font:400 11px var(--sans);color:var(--body)}
.tl-like path{animation:tl-heart 8s ease infinite}
.tl-cnt{display:inline-grid;font-family:var(--mono)}
.tl-cnt b{grid-area:1/1;font-weight:400}
.tl-c0{animation:tl-c0 8s ease infinite}.tl-c1{opacity:0;animation:tl-c1 8s ease infinite}
.tl-wire1{position:absolute;inset:0;overflow:visible;animation:tl-wire 8s ease infinite}
.tl-wire1 path{fill:none;stroke:var(--susuki);stroke-opacity:.55;stroke-width:1;stroke-dasharray:3 4}
.tl-pkt{position:absolute;left:0;top:0;offset-rotate:0deg;offset-anchor:50% 50%;padding:2px 7px;border-radius:4px;border:1px solid var(--susuki);background:var(--ground);font:400 9px var(--mono);color:var(--susuki);opacity:0;animation:tl-pkt 8s cubic-bezier(.45,0,.25,1) infinite}
/* 2 · routing: a URL is typed, the tree resolves it, params come out; two requests per 10s */
.tl-url{position:absolute;left:0;top:0;width:360px;height:34px;box-sizing:border-box;display:flex;align-items:center;padding:0 12px;border:1px solid rgb(236 238 241 / .14);border-radius:8px;background:#0e1115;font:400 12px var(--mono);color:#7b838f}
.tl-url__typed{position:relative;height:16px;flex:1}
.tl-url__typed span{position:absolute;left:0;top:0;height:16px;line-height:16px;overflow:hidden;white-space:nowrap;color:var(--fg);border-right:1px solid var(--susuki)}
.tl-ta{animation:tl-typeA 10s infinite,tl-blink 1s steps(2,start) infinite}
.tl-tb{opacity:0;animation:tl-typeB 10s infinite,tl-blink 1s steps(2,start) infinite}
.tl-tree,.tl-tree ul{list-style:none;margin:0;padding:0}
.tl-tree{position:absolute;left:0;top:50px;width:200px;font:400 11px var(--mono);color:#7b838f}
.tl-tree ul{margin-left:6px;padding-left:14px}
/* each branch draws its own guide; the last child stops at its tick, like a real tree */
.tl-tree ul > li{position:relative}
.tl-tree ul > li::before{content:"";position:absolute;left:-14px;top:0;bottom:0;border-left:1px solid rgb(236 238 241 / .14)}
.tl-tree ul > li:last-child::before{bottom:auto;height:13px}
.tl-tree li > span{position:relative;display:block;height:25px;line-height:25px;padding:0 6px;border-radius:4px}
.tl-tree ul > li > span::before{content:"";position:absolute;left:-14px;top:12px;width:10px;border-top:1px solid rgb(236 238 241 / .14)}
.tl-tree .tl-d{color:var(--muted)}
.tl-la{animation:tl-rowA 10s ease infinite}.tl-lb{animation:tl-rowB 10s ease infinite}.tl-lab{animation:tl-rowAB 10s ease infinite}
.tl-res{position:absolute;left:214px;top:50px;width:146px;height:132px;box-sizing:border-box;border:1px solid rgb(236 238 241 / .12);border-radius:8px;background:#0e1115;animation:tl-resb 10s ease infinite}
.tl-res > div{position:absolute;inset:12px;display:flex;flex-direction:column;gap:7px;font:400 10.5px var(--mono);color:var(--body)}
.tl-ra,.tl-rb{opacity:0}
.tl-ra{animation:tl-ra 10s ease infinite}.tl-rb{animation:tl-rb 10s ease infinite}.tl-ri{color:#7b838f;animation:tl-ri 10s ease infinite}
.tl-pill{align-self:flex-start;padding:1px 6px;border-radius:3px;background:var(--susuki);color:var(--ground);font:500 8.5px var(--mono);letter-spacing:.05em;text-transform:uppercase}
.tl-fg{color:var(--fg)}.tl-dim{color:#7b838f}
/* 3 · toolchain: modules converge on oxc, it steps through its stages and writes hashed files (8s) */
.tl-wires{position:absolute;inset:0;overflow:visible}
.tl-wires path{fill:none;stroke:rgb(236 238 241 / .16);stroke-width:1}
.tl-p{position:absolute;left:0;top:0;width:5px;height:5px;border-radius:50%;offset-anchor:50% 50%;offset-rotate:0deg;opacity:0;animation:tl-along 2s cubic-bezier(.5,0,.5,1) infinite}
.tl-p--in{background:var(--fg)}.tl-p--out{background:var(--susuki)}
.tl-core{position:absolute;left:134px;top:79px;width:92px;height:92px;box-sizing:border-box;border-radius:50%;border:1px solid rgb(236 238 241 / .18);background:#0e1115;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px}
.tl-core::before{content:"";position:absolute;inset:-6px;border-radius:50%;border:1px solid transparent;border-top-color:var(--susuki);border-right-color:rgb(216 191 134 / .35);animation:tl-spin 1.6s linear infinite}
.tl-core b{font:500 16px var(--mono);color:var(--fg)}
.tl-steps{position:relative;width:76px;height:12px}
.tl-steps span{position:absolute;inset:0;text-align:center;font:400 9px var(--mono);letter-spacing:.05em;text-transform:uppercase;color:var(--susuki);opacity:0;animation:tl-stage 8s infinite}
.tl-under{position:absolute;left:134px;top:184px;width:92px;text-align:center}
@keyframes tl-reveal{0%{clip-path:inset(0 0 100% 0);opacity:1}30%{clip-path:inset(0 0 0 0)}92%{clip-path:inset(0 0 0 0);opacity:1}100%{clip-path:inset(0 0 0 0);opacity:0}}
@keyframes tl-scan{0%{transform:translateY(0);opacity:1}30%{transform:translateY(214px);opacity:1}34%,100%{transform:translateY(214px);opacity:0}}
@keyframes tl-wire{0%,34%{opacity:0}38%,56%{opacity:1}62%,100%{opacity:0}}
@keyframes tl-pkt{0%,36%{offset-distance:0%;opacity:0}40%{offset-distance:4%;opacity:1}55%{offset-distance:100%;opacity:1}58%,100%{offset-distance:100%;opacity:0}}
@keyframes tl-isl{0%,55%{border-color:rgb(236 238 241 / .22);border-style:dashed;background:var(--raise)}60%,90%{border-color:var(--susuki);border-style:solid;background:#17160f}100%{border-color:rgb(236 238 241 / .22);border-style:dashed;background:var(--raise)}}
@keyframes tl-ring{0%,55%{opacity:0}60%,90%{opacity:1}100%{opacity:0}}
@keyframes tl-tagc{0%,55%{color:var(--muted)}60%,90%{color:var(--susuki)}100%{color:var(--muted)}}
@keyframes tl-c0{0%,70%{opacity:1}72%,100%{opacity:0}}
@keyframes tl-c1{0%,70%{opacity:0}72%,91%{opacity:1}100%{opacity:0}}
@keyframes tl-heart{0%,70%{fill:transparent;stroke:var(--muted)}72%,91%{fill:var(--susuki);stroke:var(--susuki)}100%{fill:transparent;stroke:var(--muted)}}
@keyframes tl-typeA{0%{width:0;opacity:1;animation-timing-function:steps(11,end)}14%{width:11ch}46%{width:11ch;opacity:1}49%,100%{width:11ch;opacity:0}}
@keyframes tl-typeB{0%,51%{width:0;opacity:0}52%{width:0;opacity:1;animation-timing-function:steps(10,end)}64%{width:10ch}94%{width:10ch;opacity:1}97%,100%{width:10ch;opacity:0}}
@keyframes tl-blink{to{border-right-color:transparent}}
@keyframes tl-rowA{0%,15%{color:#7b838f;background:transparent}18%,45%{color:var(--susuki);background:rgb(216 191 134 / .1)}48%,100%{color:#7b838f;background:transparent}}
@keyframes tl-rowB{0%,65%{color:#7b838f;background:transparent}68%,93%{color:var(--susuki);background:rgb(216 191 134 / .1)}96%,100%{color:#7b838f;background:transparent}}
@keyframes tl-rowAB{0%,15%{color:#7b838f}18%,45%{color:var(--fg)}48%,65%{color:#7b838f}68%,93%{color:var(--fg)}96%,100%{color:#7b838f}}
@keyframes tl-resb{0%,17%{border-color:rgb(236 238 241 / .12)}20%,45%{border-color:var(--susuki)}48%,67%{border-color:rgb(236 238 241 / .12)}70%,93%{border-color:var(--susuki)}96%,100%{border-color:rgb(236 238 241 / .12)}}
@keyframes tl-ra{0%,18%{opacity:0;transform:translateY(4px)}22%,45%{opacity:1;transform:none}48%,100%{opacity:0}}
@keyframes tl-rb{0%,68%{opacity:0;transform:translateY(4px)}72%,93%{opacity:1;transform:none}96%,100%{opacity:0}}
@keyframes tl-ri{0%,16%{opacity:1}18%,47%{opacity:0}50%,66%{opacity:1}68%,95%{opacity:0}98%,100%{opacity:1}}
@keyframes tl-along{0%{offset-distance:0%;opacity:0}12%{opacity:1}88%{opacity:1}100%{offset-distance:100%;opacity:0}}
@keyframes tl-spin{to{transform:rotate(360deg)}}
@keyframes tl-stage{0%{opacity:0}3%,22%{opacity:1}25%,100%{opacity:0}}
@keyframes tl-write{0%,8%{color:#7b838f;border-color:rgb(236 238 241 / .12);transform:translateX(-6px);opacity:.4}14%,30%{color:var(--fg);border-color:var(--susuki);transform:none;opacity:1}40%,92%{color:var(--body);border-color:rgb(236 238 241 / .12);transform:none;opacity:1}100%{opacity:.4;transform:translateX(-6px)}}
@media (prefers-reduced-motion:reduce){
  .tl *,.tl *::before{animation:none !important}
  .tl :is(.tl-win__scan,.tl-wire1,.tl-pkt,.tl-p,.tl-ta,.tl-ri,.tl-c0){display:none}
  .tl-isl{border-color:var(--susuki);border-style:solid}.tl-isl::before{opacity:1}.tl-isl__tag{color:var(--susuki)}.tl-c1,.tl-rb,.tl-tb{opacity:1}.tl-tb{width:10ch}
  .tl-like path{fill:var(--susuki);stroke:var(--susuki)}.tl-lb{color:var(--susuki)}.tl-steps span:last-child{opacity:1}
}
@media (max-width:1180px){.tiles{grid-template-columns:minmax(0,1fr)}.tile{max-width:640px}}
@media (max-width:440px){.tl-stage{scale:.88}}
@media (max-width:380px){.tl-stage{scale:.75}}

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
.fit{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(24px,4vw,56px)}
.fit h3{font:500 1rem var(--sans);padding-bottom:12px;border-bottom:1px solid var(--line)}
.fit h3.is-no{color:var(--muted)}
.fit ul{list-style:none;margin:0;padding:0}
.fit li{display:grid;grid-template-columns:20px 1fr;gap:10px;padding:14px 0;border-bottom:1px solid var(--line)}
.fit li svg{margin-top:5px;color:var(--susuki)}
.mark-no{color:var(--mark-no)}
.fit .is-no + ul li{color:var(--muted)}
.fit li{font-size:.96rem}


/* close */
.close{position:relative;overflow:hidden;isolation:isolate;content-visibility:auto;contain-intrinsic-size:auto 520px}
.map--close .map__sea{-webkit-mask-image:linear-gradient(to left,#000 15%,transparent 70%);mask-image:linear-gradient(to left,#000 15%,transparent 70%)}
.close h2{font:400 clamp(2.2rem,1.3rem + 3vw,4.2rem)/1.04 var(--serif);letter-spacing:-.035em;max-width:none}
:lang(ja) .close h2{line-height:1.25;letter-spacing:0}
.close__cta{margin-top:2rem;display:flex;flex-wrap:wrap;gap:12px;align-items:center}
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
  .rail{grid-template-columns:1fr;border-top:0;border-left:1px solid var(--line-strong);margin-left:4px}
  .hop{padding:0 0 28px 24px}
  .hop::before{top:6px;left:-5px}
  .rail::after{display:none}
  .rail::before{display:none}
  .isl.is-wide,.map__key li:not(.map__note){display:none}
  .map__key{top:auto;bottom:14px;padding:0;background:none}
  .map__key .map__note{padding:0;border:0}
  .isl{left:calc(50% + var(--cm) * var(--cell) - var(--cell) / 2)}
  .isl__wire{width:calc(50vw - (var(--cm) + var(--w)) * var(--cell) + var(--cell) / 2)}
  .hero .pitch{padding-bottom:168px}
}
@media (max-width:760px){
  .new__list,.fit,.proof{grid-template-columns:1fr}
  .ledger{position:static}
  .new__item:nth-child(n+2){border-top:1px solid var(--line)}
  .copybar{width:100%;font-size:.86rem;gap:.6rem;padding-left:12px}
  .copybar__state{min-width:0;margin-left:auto}
  .pitch__cta,.close__cta{flex-direction:column;align-items:stretch}
  .pitch__cta .btn,.close__cta .btn{align-self:flex-start}
}
`;
