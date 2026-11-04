# Five frameworks, one app

The numbers in the landing page's "Five frameworks, one app, measured." come from here.
The page reads `results/summary.json` at build time, so nothing on it is typed by hand.

## The app

One server-rendered page with a heading, a paragraph and one interactive counter, written
the idiomatic way in each framework:

| app | framework | UI | output measured |
|---|---|---|---|
| `apps/nowaki-counter` | Nowaki 0.13 (npm) | Preact island | `nowaki build` |
| `apps/astro-counter` | Astro 7.4 | Preact island (`client:load`) | static build |
| `apps/sveltekit-counter` | SvelteKit 3.1 | Svelte 5 | adapter-static, `/` prerendered |
| `apps/next-counter` | Next.js 16.4 | React 19 client component | app router, `/` prerendered |
| `apps/nuxt-counter` | Nuxt 4.6 | Vue 3 | Nitro, `/` prerendered |

The Nowaki, Astro and Next.js apps are copies of `benchmarks/apps` in
[Tettu0530/nowaki](https://github.com/Tettu0530/nowaki), with Nowaki installed from npm.

## Metrics

- **Dev server ready, cold:** wall time from starting the dev server to its own ready line
  (`ready in` for all five; Nuxt prints it once it stops answering 503). Framework caches are
  deleted before every run.
- **Production build:** wall time of the production build command, caches deleted first.
- **JavaScript on first load:** open the production build of `/` in headless Chromium and
  wait until the network has been quiet for 2 s. Count every JavaScript file the browser
  downloaded plus every inline script it executes (JSON payloads and import maps excluded),
  each gzipped at zlib's default level. Nowaki's figure includes its client router, which it
  loads once the page is idle (3.9 KB of the 12.9 KB).

Each framework runs three times, one framework at a time, and the page shows the median.

Two corrections to the earlier head-to-head in the framework repo's BENCHMARKS.md:
it summed every `.js` file in Astro's output, including a Preact signals chunk the page
never loads, and it left out inline scripts (Astro inlines its island loader) and
Nowaki's idle-loaded router. Measured in the browser, Astro ships the least JavaScript here.

## Results (2026-11-04, Apple M2, 8 cores, 16 GB, macOS, Node 24.14)

| framework | dev ready (cold) | build | first-load JS (gzip) |
|---|---|---|---|
| Nowaki 0.13.0 | 148 ms | 82 ms | 12.9 KB |
| Astro 7.4.5 | 988 ms | 674 ms | 9.4 KB |
| SvelteKit 3.1.1 | 426 ms | 950 ms | 31.2 KB |
| Next.js 16.4.4 | 449 ms | 2375 ms | 133.5 KB |
| Nuxt 4.6.4 | 1536 ms | 3946 ms | 67.0 KB |

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
