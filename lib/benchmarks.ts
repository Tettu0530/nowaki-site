// The five-framework head-to-head, read at render time from benchmarks/results/summary.json
// (written by benchmarks/summarize.mjs from the raw runs), so the page never carries a
// hand-typed number. See benchmarks/README.md for the method.
import { readFileSync } from "node:fs";
import { join } from "node:path";

export type BenchRow = {
  framework: string;
  label: string;
  version: string;
  runs: number;
  devMs: number;
  buildMs: number;
  jsKB: number;
  idleKB: number;
};
export type Bench = { measured: string; machine: string; frameworks: BenchRow[] };

function load(): Bench | null {
  try {
    return JSON.parse(readFileSync(join(process.cwd(), "benchmarks/results/summary.json"), "utf8"));
  } catch {
    return null;
  }
}

export const BENCH = load();
