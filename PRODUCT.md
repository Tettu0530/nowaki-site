# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, weighted equally (confirmed):

- **Evaluators:** web developers on Next.js or Astro who arrive to judge whether Nowaki is worth trying or switching to. They want the honest trade-offs, the numbers, and the shortest path to a running app.
- **Toolchain enthusiasts:** developers interested in Rust/oxc tooling who arrive for the mechanism: how the pipeline, the Rust production runtime, and Jetstream actually work.

Both are technical, skeptical of marketing, and read on desktop first, but land from mobile links too.

## Product Purpose

nowaki.dev is the landing page (en at `/`, ja at `/ja`) and documentation (`/docs/*`, English) for Nowaki (野分), a full-stack web framework on a Rust toolchain that ships to npm. Success: an evaluator understands what is different within the first screens and runs `npm create nowaki@latest`; a reader of the docs can build with it.

The site is built with Nowaki itself from the published npm packages, so it doubles as a release check (weekly CI prerender).

## Positioning

- Full-stack like Next.js (layouts, middleware, loaders, actions, API routes, server functions), islands like Astro (zero JS by default), whole toolchain in Rust (oxc), installed with npm with no Rust required.
- The one thing neither Next nor Astro has: **Jetstream**, a live stateful island that ships zero component JavaScript (server state, HTML patches over WebSocket, ~2 KB runtime).
- Tone is deliberately honest: a side-by-side comparison "without spin", an explicit "not the sweet spot yet", and "honest about alpha".

## Operating Context

- Static prerender (`pnpm prerender` → `public/`), deployed to Cloudflare Pages. No per-request data.
- Stack: Nowaki + Preact; only components under `islands/` hydrate. Docs pages have no islands and ship zero JS.
- Copy for the landing lives in `lib/i18n.ts` (en + ja); docs copy lives in `routes/docs/*.tsx`.

## Capabilities and Constraints

- **The site must prove its own claim (confirmed):** the landing page states how much JavaScript it ships (gzip, Preact, island runtime and router included; 14 KB as of the 2026-11 redesign, measured with `gzip -9` over the files the page loads) and that a no-island page ships 0 KB. The pre-redesign "12 KB" did not hold under that measurement (~18 KB). That claim stays. Motion must therefore be built with CSS (scroll-driven animations, transitions) and small WAAPI/IntersectionObserver islands, not GSAP or other animation libraries. If the measured number changes, the copy must be updated to the real measurement.
- Docs pages remain zero-JS.
- `prefers-reduced-motion` must be honored (the current implementation already does).
- **No liquid glass (decided 2026-11-02).** The SVG-displacement lens (`backdrop-filter: url()`) was prototyped and dropped: it renders only in Chromium, and WebKit reports `@supports` true while drawing nothing. Do not reintroduce Chromium-only visual effects.
- Scroll-driven CSS animations are fine as enhancement, but Firefox lacks `animation-timeline`, so motion needs an IntersectionObserver/WAAPI fallback and content must be visible without either.
- Two locales on the landing (en, ja); typography and layout must work for Japanese text as well as English.

## Brand Commitments

- Name: Nowaki, with the kanji 野分 (an autumn storm wind). The mark is `assets/nowaki-mark.svg` from the framework repo (a diagonally split N around a typhoon eye, #D8BF86). The landing's visual motif is the island map (2026-11-03), which replaced the wind-tunnel streamlines.
- Owner: a personal open-source project by Tettu0530 (MIT © 2026 Tettu0530). No VorEdge naming or contact on the site.
- Status is **alpha** and must be stated plainly.
- Links: GitHub `https://github.com/Tettu0530/nowaki` (the old nowaki-dev/nowaki URL is retired), npm `nowaki`, crates.io `nowaki`.

## Evidence on Hand

- Measured numbers in the copy: this page's JS is computed from the build at render time (`lib/bundle.ts`, gzip -9; 14 KB in 2026-11 on 0.12, 13 KB on 0.13). Head-to-head (this repo's `benchmarks/`, five frameworks on one tiny counter app, one machine, median of 3, read by the page from `benchmarks/results/summary.json`; re-measured 2026-11-04 with like-for-like metrics): dev first page (start until GET / returns the page) Nowaki 197 / SvelteKit 722 / Next 1272 / Astro 1614 / Nuxt 2068 ms; build including HTML (Nowaki timed as `nowaki prerender`, since `nowaki build` writes no HTML) Nowaki 187 / Astro 687 / SvelteKit 944 / Next 2140 / Nuxt 3607 ms; first-load JS in the browser (files plus inline scripts, gzip) Astro 9.4 / Nowaki 13.3 (4.1 of it the idle-loaded router) / SvelteKit 31.2 / Nuxt 67.0 / Next 133.5 KB. Never compare ready lines or `nowaki build` time against the others' prerendering builds. The app is tiny, so the figures mostly show fixed cost. The landing's "At scale" block reads benchmarks/scaling/summary.json, a copy of Tettu0530/nowaki benchmarks/compare/results/summary.json (commit 3257906): static build 1 to 1000 pages Nowaki 199 to 700 ms (0.51 ms per page), Astro 778 to 1355, SvelteKit 965 to 1926, Nuxt 2282 to 3807, Next 2029 to 4845; dev first page at 1000 pages Nowaki 242 ms, the lowest; home-page JS at 10 islands Astro 11.8 KB against Nowaki 16.4 KB, and each island adds 0.25 KB on Astro against 0.29 KB on Nowaki (0.15.0; 0.34 KB on 0.14.0). Production servers (PR #89, re-measured on 0.15.0 in PR #94; 100 pages, oha 50 connections 10 s, median of 5): post page rendered per request Astro 6821 / SvelteKit 6741 / Nowaki 4183 / Nuxt 2150 / Next 1270 req/s (Nowaki is third: two HTTP hops through the Rust front); with ISR Nowaki 144,750 (likely bounded by the load generator) / Nuxt 19,996 / Next 4,844 req/s, Astro and SvelteKit have no built-in ISR; idle memory Nowaki 302 MB lowest; NOWAKI_CSP=enforce 4370 req/s, no measurable cost. Scaling on 0.15.0: static build at 1000 pages Nowaki 504 ms (700 on 0.14.0), Astro 1150 ms. Always show the uncached loss next to the ISR win. Astro ships the least JS here; never claim Nowaki ships the least. The framework repo's BENCHMARKS.md figures (Astro 10.4, Nowaki 9.1) used a static method that over-counted Astro and left out Nowaki's router; do not reuse them, nor the older "18x" dev claim. WordPress was left out by the user's choice (no build or dev server to compare).
- 0.14.0 "Gale" (2026-11-04) is the security release: default security headers, CSRF 403 on page actions, `serverFn(schema, impl)`, `ServerFnError`, opt-in CSP (`NOWAKI_CSP`, never say it is on by default), expiring Jetstream signatures, `NOWAKI_TRUST_PROXY`, and the cloudflare live-island fix. live.js is 1.5 KB gzip in 0.14.0.
- 0.15.0 "Cyclone" part 1 (2026-11-04) is Jetstream 2: live islands on the node, bun, deno, vercel and cloudflare adapters (one POST per event, no server push, no presence), rooms (`live.room`, `live.shared`, per-room presence), live queries (`live.subscribe`, `live.load`, `publish(topic)`), form events and keyed morph, `getContext()` and `live.authorize`. Static output (`nowaki prerender`) still renders a live island's first HTML only (live.js loads, its POSTs fail with `nowaki:live-error`). Always state the single-process limit: rooms, `publish()` and presence stay in one server process, don't reach other instances, and rooms start empty after a restart. Still open: rooms surviving a restart, stale notifications and resume token, fan-out benchmark. live.js is 1.9 KB gzip on 0.15.0 (1968 B). The LP head-to-head has Nowaki re-measured alone on 0.15.0 (11.4 KB in the browser, router included; never use the CHANGELOG's 8.69 KB, a different count); the "At scale" and "In production" blocks are 0.15.0 data (Tettu0530/nowaki 3ee0c7e, PR #94).
- Feature list, "works today" and roadmap lists in `lib/i18n.ts`.
- No testimonials, customer logos, adoption numbers, or star counts exist. Do not fabricate them.

## Product Principles

1. Prove, don't claim: the site itself is the demo, so every number shown must be true of this build.
2. Honest over hype: trade-offs and alpha status are part of the pitch.
3. Fast to a running app: the install command is always one glance away.
4. Mechanism is content: enthusiasts come for how it works; show it.
