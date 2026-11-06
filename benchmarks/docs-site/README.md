# A docs site, Nowaki against Astro

`summary.json` here is a verbatim copy of
[`benchmarks/docs-site/results/summary.json`](https://github.com/Tettu0530/nowaki/blob/98db1b5/benchmarks/docs-site/results/summary.json)
in Tettu0530/nowaki at commit `98db1b5` (PR #145, 2026-11-06). The /benchmarks page reads it at
build time; nothing on the page is typed by hand.

The app (a typed content collection of Markdown and MDX entries, highlighted code, one local
photo per entry, a generated sitemap, static output), the cold and warm definitions, and the raw
runs are documented in that repository's
[`BENCHMARKS.md`](https://github.com/Tettu0530/nowaki/blob/main/BENCHMARKS.md#docs-site--nowaki-vs-astro)
and [`benchmarks/docs-site/README.md`](https://github.com/Tettu0530/nowaki/blob/main/benchmarks/docs-site/README.md).
Nowaki was built from main at `70f9e0a`, before the 0.17.0 release.

To update: copy the new `summary.json` over this one, note the source commit here, and rebuild.
