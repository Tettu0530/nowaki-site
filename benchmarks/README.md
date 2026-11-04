# Five frameworks, one app

The numbers in the landing page's "Five frameworks, one app, measured." come from here.
The page reads `results/summary.json` at build time, so nothing on it is typed by hand.

## The app

One server-rendered page with a heading, a paragraph and one interactive counter, written
the idiomatic way in each framework:

| app | framework | UI | output measured |
|---|---|---|---|
| `apps/nowaki-counter` | Nowaki 0.14 (npm) | Preact island | `nowaki build` |
| `apps/astro-counter` | Astro 7.4 | Preact island (`client:load`) | static build |
| `apps/sveltekit-counter` | SvelteKit 3.1 | Svelte 5 | adapter-static, `/` prerendered |
| `apps/next-counter` | Next.js 16.4 | React 19 client component | app router, `/` prerendered |
| `apps/nuxt-counter` | Nuxt 4.6 | Vue 3 | Nitro, `/` prerendered |

The Nowaki, Astro and Next.js apps are copies of `benchmarks/apps` in
[Tettu0530/nowaki](https://github.com/Tettu0530/nowaki), with Nowaki installed from npm.

## Metrics

- **Dev server, first page (cold):** wall time from starting the dev server until `GET /`
  returns 200 with the page's own text, framework caches deleted first. This is the
  like-for-like dev figure: frameworks print their "ready" line at different points (Nowaki,
  Vite-based servers and Next before compiling anything, Nuxt after its first build), so the
  ready-line time is recorded as well (`devMs`) but not compared.
- **Production build, HTML included:** wall time of the build command, caches deleted first.
  Astro, SvelteKit, Next.js and Nuxt prerender `/` as part of their build; `nowaki build` writes
  no HTML, so Nowaki is timed with `nowaki prerender` (build, then render every route).
- **JavaScript on first load:** open the production build of `/` in headless Chromium and
  wait until the network has been quiet for 2 s. Count every JavaScript file the browser
  downloaded plus every inline script it executes (JSON payloads and import maps excluded),
  each gzipped at zlib's default level. Nowaki's figure includes its client router, which it
  loads once the page is idle (4.1 KB of the 13.3 KB).

The app is deliberately tiny, so these numbers mostly show each framework's fixed cost
(startup, build and runtime overhead), not how it scales with a real app.

Each framework runs three times, one framework at a time, and the page shows the median.

Two corrections to the earlier head-to-head in the framework repo's BENCHMARKS.md:
it summed every `.js` file in Astro's output, including a Preact signals chunk the page
never loads, and it left out inline scripts (Astro inlines its island loader) and
Nowaki's idle-loaded router. Measured in the browser, Astro ships the least JavaScript here.

## Results (2026-11-04, Apple M2, 8 cores, 16 GB, macOS, Node 24.14)

| framework | dev, first page (cold) | dev ready line | build, HTML included | first-load JS (gzip) |
|---|---|---|---|---|
| Nowaki 0.14.0 | 197 ms | 148 ms | 187 ms | 13.3 KB |
| Astro 7.4.5 | 1614 ms | 1160 ms | 687 ms | 9.4 KB |
| SvelteKit 3.1.1 | 722 ms | 438 ms | 944 ms | 31.2 KB |
| Next.js 16.4.4 | 1272 ms | 307 ms | 2140 ms | 133.5 KB |
| Nuxt 4.6.4 | 2068 ms | 1379 ms | 3607 ms | 67.0 KB |

An earlier series timed Nowaki's build as `nowaki build` (no HTML, 71 ms) and compared
ready lines; both were uneven and are superseded by the table above. A second series
(11:42-11:54 JST) overlapped another benchmark session's trial runs for Astro, Nuxt and
SvelteKit; the table is from a clean third series measured after it finished.

Raw runs: `results/runs.jsonl` (dev and build, plus a static JS estimate) and
`results/browser.jsonl` (the browser measurement with every file listed).
The first run of each series is slower (cold OS file cache); the median absorbs it.

## Reproduce

```sh
# one framework at a time
pnpm -C benchmarks/apps/nowaki-counter install
node benchmarks/head-to-head.mjs nowaki --runs 3

# first-load JS: build, serve the output, then open it in the browser
#   Nowaki:    nowaki prerender . --out <dir>, serve <dir>
#   Astro:     astro build, serve dist/
#   SvelteKit: vite build, serve build/
#   Next.js:   next build && next start
#   Nuxt:      nuxt build, serve .output/public/
node benchmarks/browser-check.mjs http://127.0.0.1:8811/ nowaki

node benchmarks/summarize.mjs   # writes results/summary.json
```

`browser-check.mjs` needs a Chromium binary (`CHROME=/path/to/chrome`, or a Playwright
headless shell). Numbers move between runs and machines; the orders of magnitude are the point.

WordPress is not included: it has no build step or dev server, so the same three metrics
do not apply.
