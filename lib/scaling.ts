// The scaling head-to-head (one blog at 1 to 1000 pages and 1 or 10 islands), read at render
// time from benchmarks/scaling/summary.json: a verbatim copy of Tettu0530/nowaki's
// benchmarks/compare/results/summary.json (source commit in benchmarks/scaling/README.md).
import { readFileSync } from "node:fs";
import { join } from "node:path";

export type Stat = { n: number; median: number; p25: number; p75: number; min: number; max: number };
export type PageLoad = { jsKB: number; idleKB: number; totalKB: number };
export type Cell = { devFirst: Stat; static: Stat; server: Stat; home: PageLoad; post: PageLoad };
export type ScalingFw = {
  label: string;
  version: string;
  cells: Record<string, Cell>;
  fits: { islands: { homeJs: { perIslandKB: number } } };
};
/** One production-server run set (benchmarks/compare/prod.mjs): 100 pages, median of 5 runs. */
export type Prod = {
  framework: string;
  label: string;
  version: string;
  env: Record<string, string>;
  isr: boolean;
  runs: number;
  postRps: number;
  homeRps: number;
  idleMB: number;
  peakMB: number;
  ttfbP50: number;
};
export type Scaling = { measured: string; machine: string; frameworks: Record<string, ScalingFw>; prod?: Record<string, Prod> };

export const SOURCE_COMMIT = "a97a3c0";
export const PAGES = [1, 10, 100, 1000] as const;

function load(): Scaling | null {
  try {
    return JSON.parse(readFileSync(join(process.cwd(), "benchmarks/scaling/summary.json"), "utf8"));
  } catch {
    return null;
  }
}

export const SCALING = load();
