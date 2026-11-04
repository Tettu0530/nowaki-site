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
export type Scaling = { measured: string; machine: string; frameworks: Record<string, ScalingFw> };

export const SOURCE_COMMIT = "3257906";
export const PAGES = [1, 10, 100, 1000] as const;

function load(): Scaling | null {
  try {
    return JSON.parse(readFileSync(join(process.cwd(), "benchmarks/scaling/summary.json"), "utf8"));
  } catch {
    return null;
  }
}

export const SCALING = load();
