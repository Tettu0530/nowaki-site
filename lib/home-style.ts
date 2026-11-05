// The landing (home) page, redesigned 2026-11-05 from the approved prototype: the island-map hero,
// then rail sections (heading in a sticky left rail, proof on the right) and one full-width build
// figure. Every animation is CSS: load sequences, loops, :checked toggles and scroll-driven
// timelines, so the page's only script stays the copy-button island. Classes are prefixed h-
// because the page also loads LANDING_CSS (footer, copy button) and must not collide with it.
export const HOME_CSS = `
:root{
  --faint:#6b727d;
  --dot:rgb(236 238 241 / .16);
  --susuki-soft:rgb(216 191 134 / .10);
  --susuki-line:rgb(216 191 134 / .5);
  --cell:24px;
  --rail:320px;
}
.h-lattice{background-image:radial-gradient(circle at 1px 1px,var(--dot) 1px,transparent 1.5px);background-size:var(--cell) var(--cell)}
.h-arrow{display:inline-block;vertical-align:-2px;margin-left:.35em}

/* hero: the island map */
.h-hero{border-bottom:1px solid var(--line);overflow:hidden}
.h-hero__in{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:56px;align-items:center;padding-block:72px 80px}
.h-hero h1{font:400 clamp(2.3rem,1.2rem + 3.3vw,3.8rem)/1.04 var(--serif);letter-spacing:-.03em}
.h-hero h1 span{display:block}
.h-hero h1 em{font-style:normal;color:var(--susuki)}
.h-sub{margin-top:24px;max-width:44ch;font-size:1.1rem;line-height:1.6}
.h-cta{display:flex;flex-wrap:wrap;gap:12px;margin-top:36px;align-items:center}
.h-release{margin-top:28px;display:flex;flex-wrap:wrap;gap:4px 14px;align-items:baseline;font-size:.875rem;color:var(--muted)}
.h-release strong{color:var(--fg);font-weight:500}
.h-alpha{margin-top:6px;font-size:.875rem;color:var(--faint)}
.h-fig{margin:0}
.h-map{position:relative;width:calc(22 * var(--cell));height:calc(18 * var(--cell))}
.h-map__sea{position:absolute;inset:0;mask-image:radial-gradient(closest-side,#000 70%,transparent);pointer-events:none}
.h-isl{position:absolute;left:calc(var(--x) * var(--cell));top:calc(var(--y) * var(--cell));width:calc(var(--w) * var(--cell));height:calc(var(--h) * var(--cell));
  border:1px solid var(--line-strong);border-radius:3px;background:rgb(11 13 16 / .55);animation:h-wake .9s var(--ease) var(--d) both}
.h-isl::before{content:"";position:absolute;inset:-6px;pointer-events:none;--c:var(--susuki);--l:9px;--t:1.5px;
  background:
    linear-gradient(var(--c),var(--c)) top left/var(--l) var(--t),linear-gradient(var(--c),var(--c)) top left/var(--t) var(--l),
    linear-gradient(var(--c),var(--c)) top right/var(--l) var(--t),linear-gradient(var(--c),var(--c)) top right/var(--t) var(--l),
    linear-gradient(var(--c),var(--c)) bottom left/var(--l) var(--t),linear-gradient(var(--c),var(--c)) bottom left/var(--t) var(--l),
    linear-gradient(var(--c),var(--c)) bottom right/var(--l) var(--t),linear-gradient(var(--c),var(--c)) bottom right/var(--t) var(--l);
  background-repeat:no-repeat;animation:h-snap .6s var(--ease) var(--d) both}
.h-isl::after{content:"";position:absolute;inset:0;background-image:radial-gradient(circle at 1px 1px,var(--susuki) 1px,transparent 1.6px);background-size:var(--cell) var(--cell);background-position:11px 11px;opacity:.9;
  animation:h-hydrate 1s var(--ease) calc(var(--d) + .35s) both}
.h-isl__label{position:absolute;bottom:100%;left:-6px;margin-bottom:10px;white-space:nowrap;font:400 .76rem var(--mono);color:var(--muted);animation:h-fade .6s var(--ease) var(--d) both}
.h-isl__label b{font-weight:400;color:var(--susuki)}
.h-isl--live{border-color:var(--susuki-line);animation:h-wake .9s var(--ease) var(--d) both,h-ping 4.2s var(--ease) calc(var(--d) + 1.2s) infinite}
.h-wire{position:absolute;left:calc(var(--x) * var(--cell));top:calc(var(--y) * var(--cell));width:calc(var(--w) * var(--cell));border-top:1px dashed var(--susuki-line);animation:h-draw .7s var(--ease) var(--d) both;transform-origin:left}
.h-wire span{position:absolute;bottom:6px;left:6px;font:400 .72rem var(--mono);color:var(--muted);white-space:nowrap}
.h-wire i{position:absolute;top:-4px;width:7px;height:7px;border-radius:50%;background:var(--susuki);box-shadow:0 0 10px rgb(216 191 134 / .7);opacity:0}
.h-wire .h-out{animation:h-out 4.2s linear calc(var(--d) + .7s) infinite}
.h-wire .h-back{animation:h-back 4.2s linear calc(var(--d) + .7s) infinite}
.h-srv{position:absolute;left:calc(var(--x) * var(--cell));top:calc(var(--y) * var(--cell));width:calc(var(--w) * var(--cell));height:calc(var(--h) * var(--cell));
  display:grid;align-content:center;gap:2px;padding:0 12px;border:1px solid var(--line-strong);border-radius:6px;background:var(--raise);
  animation:h-fade .6s var(--ease) var(--d) both,h-serve 4.2s linear calc(var(--d) + .7s) infinite}
.h-srv b{font:500 .78rem var(--mono);color:var(--fg)}
.h-srv small{font:400 .7rem var(--sans);color:var(--muted)}
.h-legend{display:flex;flex-wrap:wrap;gap:8px 20px;margin-top:8px;font-size:.75rem;color:var(--muted)}
.h-legend span{display:inline-flex;align-items:center;gap:8px}
.h-legend i{display:inline-block}
.h-k-html{width:5px;height:5px;border-radius:50%;background:var(--muted)}
.h-k-isl{width:12px;height:12px;border:1px solid var(--susuki-line);border-radius:2px;background:radial-gradient(circle,var(--susuki) 1.4px,transparent 1.8px)}
.h-k-live{width:22px;height:12px;background:linear-gradient(var(--susuki-line),var(--susuki-line)) right center/10px 1px no-repeat,radial-gradient(circle at 6px 6px,var(--susuki) 1.4px,transparent 1.8px);border-left:1px solid var(--susuki-line)}
@keyframes h-wake{from{border-color:transparent;background:transparent}to{}}
@keyframes h-snap{from{opacity:0;transform:scale(1.12)}to{opacity:1;transform:none}}
@keyframes h-hydrate{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
@keyframes h-fade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
@keyframes h-ping{0%,86%{background:rgb(11 13 16 / .55)}90%{background:rgb(216 191 134 / .16)}100%{background:rgb(11 13 16 / .55)}}
@keyframes h-draw{from{transform:scaleX(0)}to{transform:none}}
@keyframes h-out{0%{left:-3px;opacity:0}5%{opacity:1}38%{left:calc(100% - 4px);opacity:1}42%,100%{left:calc(100% - 4px);opacity:0}}
@keyframes h-back{0%,48%{left:calc(100% - 4px);opacity:0}53%{opacity:1}86%{left:-3px;opacity:1}90%,100%{left:-3px;opacity:0}}
@keyframes h-serve{0%,38%{border-color:var(--line-strong)}42%,50%{border-color:var(--susuki);box-shadow:0 0 0 4px rgb(216 191 134 / .12)}56%,100%{border-color:var(--line-strong);box-shadow:none}}

/* rail sections */
.h-sec{border-bottom:1px solid var(--line)}
.h-sec>.wrap{display:grid;grid-template-columns:var(--rail) minmax(0,1fr);gap:72px;padding-block:96px}
.h-rail{position:sticky;top:92px;align-self:start;display:grid;gap:18px;justify-items:start}
.h-rail h2,.h-wide__head h2,.h-close h2{font:400 clamp(1.8rem,1.3rem + 1.4vw,2.5rem)/1.1 var(--serif);letter-spacing:-.02em}
.h-rail p{font-size:.98rem}
.h-body{min-width:0;display:grid;gap:36px}
.h-body h3{font:500 1.1rem/1.3 var(--sans)}

/* proof: the page's JavaScript, stacked */
.h-stack{display:flex;height:14px;gap:2px;border-radius:4px;overflow:hidden}
.h-stack i{flex:var(--kb) 0 0;background:var(--c);transform-origin:left}
.h-ledger{margin:0;padding:0;list-style:none;display:grid}
.h-ledger li{display:grid;grid-template-columns:12px minmax(0,1fr) auto auto;gap:14px;align-items:center;padding-block:11px;border-bottom:1px solid var(--line);font-size:.92rem}
.h-ledger li::before{content:"";width:10px;height:10px;border-radius:2px;background:var(--c)}
.h-ledger code{color:var(--muted);font-size:.8rem;background:none;border:0;padding:0}
.h-ledger b{font:500 .88rem var(--mono);color:var(--fg);font-variant-numeric:tabular-nums;min-width:4.5ch;text-align:right}
.h-ledger .h-total{border-bottom:0;font-weight:500;color:var(--fg)}
.h-ledger .h-total::before{background:transparent}
.h-ledger .h-total b{color:var(--susuki)}
.h-k0{--c:rgb(236 238 241 / .62)}.h-k1{--c:rgb(236 238 241 / .46)}.h-k2{--c:rgb(236 238 241 / .34)}.h-k3{--c:rgb(236 238 241 / .26)}.h-k4{--c:rgb(236 238 241 / .2)}.h-k5{--c:rgb(236 238 241 / .16)}.h-k6{--c:rgb(236 238 241 / .12)}.h-kisl{--c:var(--susuki)}

/* jetstream: three lanes, one packet, toggled by a checkbox (no JS) */
.h-jd{border:1px solid var(--line);border-radius:14px;background:var(--raise);overflow:hidden}
.h-lanes{position:relative;display:grid;grid-template-columns:repeat(3,minmax(0,1fr))}
.h-lane{display:grid;justify-items:center;align-content:start;gap:14px;padding:22px 12px 64px;text-align:center;min-width:0}
.h-lane+.h-lane{border-left:1px dashed var(--line)}
.h-lane__h{font:500 .8rem var(--sans);color:var(--fg)}
.h-lane__s{font:400 .75rem var(--mono);color:var(--faint)}
.h-like{display:inline-flex;align-items:center;gap:9px;height:42px;padding:0 16px;border-radius:999px;border:1px solid var(--line-strong);color:var(--fg);font:500 .9rem var(--sans);cursor:pointer;user-select:none;transition:border-color .2s}
.h-like:hover{border-color:var(--susuki)}
.h-like svg{width:16px;height:16px;color:var(--muted)}
.h-like path{fill-opacity:0}
.h-sw{display:inline-grid}
.h-sw>*{grid-area:1/1;transition:opacity .2s}
.h-sw .h-on{opacity:0}
.h-state{font:400 .82rem var(--mono);color:var(--muted);padding:6px 10px;border:1px solid var(--line);border-radius:6px;background:var(--ground)}
.h-state b{color:var(--fg);font-weight:500}
.h-track{position:absolute;left:16.66%;right:16.66%;bottom:34px;border-top:1px solid var(--line-strong)}
.h-pkt{position:absolute;top:-5px;left:-5px;width:9px;height:9px;border-radius:50%;background:var(--susuki);box-shadow:0 0 12px rgb(216 191 134 / .8);opacity:0}
.h-caps{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));margin:0;padding:0;list-style:none;border-top:1px solid var(--line)}
.h-caps li{padding:14px 12px;font:400 .75rem/1.4 var(--mono);color:var(--faint);min-width:0}
.h-caps li+li{border-left:1px solid var(--line)}
.h-caps b{display:block;margin-bottom:2px;font:500 .82rem var(--sans);color:var(--muted)}
.h-toggle{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}
.h-toggle:focus-visible ~ .h-lanes .h-like{outline:2px solid var(--susuki);outline-offset:3px}
.h-toggle:checked ~ .h-lanes .h-sw .h-off{opacity:0;transition-delay:var(--td)}
.h-toggle:checked ~ .h-lanes .h-sw .h-on{opacity:1;transition-delay:var(--td)}
.h-toggle:not(:checked) ~ .h-lanes .h-sw>*{transition-delay:var(--td)}
.h-like .h-sw{--td:2.05s}.h-state .h-sw{--td:.95s}
.h-toggle:checked ~ .h-lanes .h-like svg{color:var(--susuki);transition:color .2s 2.05s}
.h-toggle:checked ~ .h-lanes .h-like path{fill-opacity:1;transition:fill-opacity .2s 2.05s}
.h-toggle:checked ~ .h-lanes .h-pkt{animation:h-trip-a 2.3s var(--ease)}
.h-toggle:not(:checked) ~ .h-lanes .h-pkt{animation:h-trip-b 2.3s var(--ease)}
.h-toggle:checked ~ .h-lanes .h-state{animation:h-render-a 2.3s linear}
.h-toggle:not(:checked) ~ .h-lanes .h-state{animation:h-render-b 2.3s linear}
.h-toggle:checked ~ .h-caps li{animation:h-cap-a .7s var(--ease) calc(var(--i) * .45s)}
.h-toggle:not(:checked) ~ .h-caps li{animation:h-cap-b .7s var(--ease) calc(var(--i) * .45s)}
@keyframes h-trip-a{0%{left:-5px;opacity:1}38%{left:calc(100% - 5px)}52%{left:calc(100% - 5px)}90%{left:-5px;opacity:1}100%{left:-5px;opacity:0}}
@keyframes h-trip-b{0%{left:-5px;opacity:1}38%{left:calc(100% - 5px)}52%{left:calc(100% - 5px)}90%{left:-5px;opacity:1}100%{left:-5px;opacity:0}}
@keyframes h-render-a{0%,36%{border-color:var(--line)}40%,52%{border-color:var(--susuki);box-shadow:0 0 0 4px rgb(216 191 134 / .12)}60%,100%{border-color:var(--line);box-shadow:none}}
@keyframes h-render-b{0%,36%{border-color:var(--line)}40%,52%{border-color:var(--susuki);box-shadow:0 0 0 4px rgb(216 191 134 / .12)}60%,100%{border-color:var(--line);box-shadow:none}}
@keyframes h-cap-a{0%{color:var(--faint)}25%,75%{color:var(--body);background:rgb(216 191 134 / .07)}100%{color:var(--faint)}}
@keyframes h-cap-b{0%{color:var(--faint)}25%,75%{color:var(--body);background:rgb(216 191 134 / .07)}100%{color:var(--faint)}}
.h-jd__note{display:block;padding:12px 16px;border-top:1px solid var(--line);font-size:.75rem;color:var(--faint)}
.h-points{margin:0;padding:0;list-style:none;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}
.h-points li{display:grid;gap:6px;font-size:.92rem;min-width:0;align-content:start}
.h-points b{color:var(--fg);font-weight:500}

/* build figure: three panes joined by moving packets */
.h-sec.h-wide>.wrap{grid-template-columns:minmax(0,1fr);gap:48px;padding-block:96px}
.h-wide__head{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:48px;align-items:end}
.h-wide__head div{display:grid;gap:14px;justify-items:start;max-width:56ch}
.h-flow{display:grid;grid-template-columns:minmax(0,1fr) 48px minmax(0,1fr) 48px minmax(0,1.1fr);align-items:stretch}
.h-pane{display:grid;grid-template-rows:auto 1fr;border:1px solid var(--line);border-radius:12px;background:var(--raise);min-width:0;overflow:hidden}
.h-pane__h{display:flex;justify-content:space-between;gap:12px;align-items:baseline;padding:14px 16px;border-bottom:1px solid var(--line)}
.h-pane__h h3{font:500 1rem/1.3 var(--sans)}
.h-pane__h span{font:400 .75rem var(--mono);color:var(--faint);white-space:nowrap}
.h-pane pre{margin:0;padding:16px;overflow-x:auto;font:400 .78rem/1.7 var(--mono);color:var(--body)}
.h-pane pre+pre{border-top:1px solid var(--line)}
.h-pane .k{color:var(--muted)} .h-pane .c{color:var(--faint)} .h-pane .h{color:var(--susuki)}
.h-term{margin:0;padding:16px;list-style:none;font:400 .78rem/1.85 var(--mono);color:var(--body)}
.h-term li{display:flex;gap:10px;white-space:nowrap}
.h-term .h-ok{color:var(--susuki)}
.h-term .h-sz{margin-left:auto;color:var(--muted);font-variant-numeric:tabular-nums}
.h-term .h-dim{color:var(--faint)}
.h-link{position:relative;align-self:center;height:1px;border-top:1px dashed var(--line-strong)}
.h-link::after{content:"";position:absolute;right:-1px;top:-4px;border:4px solid transparent;border-left:6px solid var(--line-strong);border-right:0}
.h-link i{position:absolute;top:-4px;left:0;width:7px;height:7px;border-radius:50%;background:var(--susuki);box-shadow:0 0 10px rgb(216 191 134 / .7);animation:h-flowx 2.4s linear var(--d,0s) infinite}
@keyframes h-flowx{0%{left:0;opacity:0}15%{opacity:1}85%{opacity:1}100%{left:calc(100% - 7px);opacity:0}}
@keyframes h-flowy{0%{top:0;opacity:0}15%{opacity:1}85%{opacity:1}100%{top:calc(100% - 7px);opacity:0}}

/* benchmarks: four metrics, radio tabs, bars reorder (no JS) */
.h-tabs{display:flex;flex-wrap:wrap;gap:6px}
.h-tabs label{padding:7px 12px;border:1px solid var(--line);border-radius:999px;font-size:.84rem;color:var(--muted);cursor:pointer;transition:color .2s,border-color .2s,background .2s}
.h-tabs label:hover{color:var(--fg)}
#hm1:checked ~ .h-tabs [for=hm1],#hm2:checked ~ .h-tabs [for=hm2],#hm3:checked ~ .h-tabs [for=hm3],#hm4:checked ~ .h-tabs [for=hm4]{color:var(--susuki-ink);background:var(--susuki);border-color:var(--susuki)}
#hm1:focus-visible ~ .h-tabs [for=hm1],#hm2:focus-visible ~ .h-tabs [for=hm2],#hm3:focus-visible ~ .h-tabs [for=hm3],#hm4:focus-visible ~ .h-tabs [for=hm4]{outline:2px solid var(--susuki);outline-offset:3px}
.h-chart{display:flex;flex-direction:column;gap:16px;margin-top:26px}
.h-bar{display:grid;gap:8px}
.h-bar__top{display:flex;justify-content:space-between;gap:12px;font-size:.92rem;color:var(--muted)}
.h-bar__top b{font:500 .9rem var(--mono);font-variant-numeric:tabular-nums}
.h-bar.is-us .h-bar__top{color:var(--fg)}
.h-trk{height:8px;border-radius:4px;background:var(--raise-2)}
.h-fill{height:100%;border-radius:4px;background:var(--line-strong);transition:width .8s var(--ease);transform-origin:left}
.h-bar.is-us .h-fill{background:var(--susuki)}
.h-v,.h-mnote{display:none}
#hm1:checked ~ .h-chart .h-bar{order:var(--o1)} #hm1:checked ~ .h-chart .h-fill{width:var(--w1)} #hm1:checked ~ .h-chart .h-v1,#hm1:checked ~ .h-mnote1{display:inline}
#hm2:checked ~ .h-chart .h-bar{order:var(--o2)} #hm2:checked ~ .h-chart .h-fill{width:var(--w2)} #hm2:checked ~ .h-chart .h-v2,#hm2:checked ~ .h-mnote2{display:inline}
#hm3:checked ~ .h-chart .h-bar{order:var(--o3)} #hm3:checked ~ .h-chart .h-fill{width:var(--w3)} #hm3:checked ~ .h-chart .h-v3,#hm3:checked ~ .h-mnote3{display:inline}
#hm4:checked ~ .h-chart .h-bar{order:var(--o4)} #hm4:checked ~ .h-chart .h-fill{width:var(--w4)} #hm4:checked ~ .h-chart .h-v4,#hm4:checked ~ .h-mnote4{display:inline}
.h-mnote{margin-top:18px;font-size:.88rem;color:var(--muted)}
.h-facts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border-top:1px solid var(--line)}
.h-fact{padding:22px 20px 0 0;min-width:0;display:grid;gap:8px;align-content:start}
.h-fact+.h-fact{padding-left:20px;border-left:1px solid var(--line)}
.h-fact b{font:400 1.9rem/1 var(--serif);color:var(--fg);letter-spacing:-.02em;font-variant-numeric:tabular-nums;white-space:nowrap}
.h-fact span{font-size:.88rem;color:var(--muted)}
.h-src{font-size:.8rem;color:var(--faint);max-width:72ch}

/* status */
.h-lists{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:32px}
.h-lists>div{display:grid;gap:14px;align-content:start;min-width:0}
.h-lists h3{padding-bottom:12px;border-bottom:1px solid var(--line)}
.h-lists ul{margin:0;padding:0;list-style:none;display:grid;gap:10px;font-size:.94rem}
.h-lists li{padding-left:20px;position:relative}
.h-lists li::before{position:absolute;left:0;top:0;font:400 .9rem/1.65 var(--mono)}
.h-ok li::before{content:"+";color:var(--susuki)}
.h-no li::before{content:"–";color:var(--faint)}
.h-soon li::before{content:"→";color:var(--muted)}

/* close: the lattice again, with one island waiting for your app */
.h-close{position:relative;overflow:hidden}
.h-close__sea{position:absolute;inset:0;mask-image:linear-gradient(0deg,#000,transparent 85%);pointer-events:none}
.h-close .wrap{position:relative;padding-block:112px;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:48px;align-items:center}
.h-close__copy{display:grid;justify-items:start;gap:28px}
.h-close h2{font-size:clamp(2.2rem,1.3rem + 3vw,3.6rem)}
.h-close .h-map{width:calc(12 * var(--cell));height:calc(6 * var(--cell))}

/* scroll-driven entrances where supported; everywhere else everything rests in place */
@supports (animation-timeline:view()){
  .h-stack i{animation:h-grow linear both;animation-timeline:view();animation-range:entry 20% cover 40%}
  .h-ledger li{animation:h-rise linear both;animation-timeline:view();animation-range:entry 0% entry 80%}
  .h-term li{animation:h-rise linear both;animation-timeline:view();animation-range:entry 30% entry 100%}
  .h-pane{animation:h-lift linear both;animation-timeline:view();animation-range:entry 0% cover 30%}
  .h-chart .h-fill{animation:h-grow linear both;animation-timeline:view();animation-range:entry 10% cover 35%}
  .h-rail h2{animation:h-rise linear both;animation-timeline:view();animation-range:entry 0% entry 70%}
}
@keyframes h-grow{from{transform:scaleX(0)}to{transform:none}}
@keyframes h-rise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes h-lift{from{opacity:.25;transform:translateY(18px)}to{opacity:1;transform:none}}

/* Japanese: headings in gothic (see BASE_CSS), lead text a touch looser */
:lang(ja) :is(.h-rail h2,.h-wide__head h2,.h-close h2){font-weight:600;letter-spacing:0;line-height:1.3}
/* the 320px rail fits about 11 gothic characters a line at this size */
:lang(ja) .h-rail h2{font-size:clamp(1.45rem,1.2rem + .8vw,1.7rem)}
:lang(ja) .h-sub{line-height:1.8}

@media (min-width:700px){ .h-hero h1 span{white-space:nowrap} }
@media (max-width:1100px){
  .h-hero__in{grid-template-columns:minmax(0,1fr);gap:56px;padding-block:56px 64px}
  .h-sec>.wrap{grid-template-columns:minmax(0,1fr);gap:36px;padding-block:72px}
  .h-rail{position:static}
  .h-rail p{max-width:58ch}
  .h-sec.h-wide>.wrap{padding-block:72px}
  .h-wide__head{grid-template-columns:minmax(0,1fr);gap:16px}
  .h-flow{grid-template-columns:minmax(0,1fr);gap:0}
  .h-link{height:40px;width:0;justify-self:center;border-top:0;border-left:1px dashed var(--line-strong)}
  .h-link::after{right:auto;left:-5px;top:auto;bottom:-1px;border:4px solid transparent;border-top:6px solid var(--line-strong);border-bottom:0}
  .h-link i{left:-4px;animation-name:h-flowy}
  .h-close .wrap{grid-template-columns:minmax(0,1fr)}
}
@media (max-width:620px){
  .h-hero .h-map{zoom:.62}
  .h-points,.h-facts,.h-lists{grid-template-columns:minmax(0,1fr)}
  .h-fact+.h-fact{padding-left:0;border-left:0;border-top:1px solid var(--line)}
  .h-fact{padding:18px 0}
  .h-caps{grid-template-columns:repeat(5,minmax(96px,1fr));overflow-x:auto}
  .h-lane{padding-inline:6px}
  .h-like{padding:0 12px;font-size:.84rem}
  .h-ledger code{display:none}
  .h-ledger li{grid-template-columns:12px minmax(0,1fr) auto}
}
@media (prefers-reduced-motion:reduce){[class^="h-"],[class^="h-"]::before,[class^="h-"]::after,[class*=" h-"],[class*=" h-"]::before,[class*=" h-"]::after{animation:none!important;transition:none!important}}
`;
