# Five frameworks, one blog, at several sizes

`summary.json` here is a verbatim copy of
[`benchmarks/compare/results/summary.json`](https://github.com/Tettu0530/nowaki/blob/3ee0c7e/benchmarks/compare/results/summary.json)
in Tettu0530/nowaki at commit `3ee0c7e` (PR #79 for the scaling sweep and PR #89 for the production servers, re-measured on Nowaki 0.15.0 in PR #94; all merged 2026-11-04). The landing page's
"At scale" block reads it at build time; nothing on the page is typed by hand.

The app, the sizes (`pages × islands` = 1×1, 10×1, 100×1, 1000×1, 10×10), the metrics, the
rules (one process at a time, 1 + 10 runs with the first discarded, median and interquartile
range, pinned versions) and the raw runs are documented in that repository's
[`benchmarks/compare/README.md`](https://github.com/Tettu0530/nowaki/blob/3ee0c7e/benchmarks/compare/README.md).

To update: copy the new `summary.json` over this one, note the source commit here, and rebuild.
