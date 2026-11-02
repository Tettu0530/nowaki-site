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

- Name: Nowaki, with the kanji 野分 (an autumn storm wind). The wind is the existing motif.
- Status is **alpha** and must be stated plainly.
- Links: GitHub `https://github.com/nowaki-dev/nowaki`, npm `nowaki`, crates.io `nowaki`.

## Evidence on Hand

- Measured numbers already in the copy: dev server ready ~90 ms on the example app; millisecond re-transforms; this page 14 KB gzip JS (2026-11 redesign); head-to-head first load ~10 KB gzip vs Next app-router ~103 KB (reproducible via `benchmarks/head-to-head.mjs` in the framework repo).
- Feature list, "works today" and roadmap lists in `lib/i18n.ts`.
- No testimonials, customer logos, adoption numbers, or star counts exist. Do not fabricate them.

## Product Principles

1. Prove, don't claim: the site itself is the demo, so every number shown must be true of this build.
2. Honest over hype: trade-offs and alpha status are part of the pitch.
3. Fast to a running app: the install command is always one glance away.
4. Mechanism is content: enthusiasts come for how it works; show it.
