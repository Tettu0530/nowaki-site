// What the landing page actually ships, computed from the production build
// (dist/client) at render time, so the "N KB" claim and its breakdown cannot
// drift from the real bundle. gzip -9, the same measurement the copy states.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

export type ShippedFile = { file: string; role: string; bytes: number };
export type Shipped = { files: ShippedFile[]; total: number; kb: number };

const ROLES: [RegExp, string][] = [
  [/^islands\./, "Island runtime"],
  [/^router-core\./, "Router core"],
  [/^router\./, "Page router"],
  [/^preact\.module\./, "Preact"],
  [/^hooks\.module\./, "Preact hooks"],
  [/^jsxRuntime\.module\./, "JSX runtime"],
];

function role(file: string): string {
  for (const [re, name] of ROLES) if (re.test(file)) return name;
  return `${file.replace(/\.[0-9a-f]{8}\.js$/, "")} island`;
}

/** Files a page with the given islands loads, or null when no build exists (e.g. in dev). */
export function shipped(islands: string[]): Shipped | null {
  const dir = join(process.cwd(), "dist/client");
  const manifestPath = join(dir, "manifest.json");
  if (!existsSync(manifestPath)) return null;
  try {
    const m = JSON.parse(readFileSync(manifestPath, "utf8"));
    const roots: string[] = [m.runtime, m.routerRuntime, ...islands.map((i) => m.islands?.[i])].filter(Boolean);
    const all = new Set<string>();
    for (const r of roots) {
      all.add(r);
      for (const dep of m.preload?.[r] ?? []) all.add(dep);
    }
    const files = [...all].map((file) => ({
      file: file.replace(/\.[0-9a-f]{8}\.js$/, ".js"),
      role: role(file),
      bytes: gzipSync(readFileSync(join(dir, file)), { level: 9 }).length,
    }));
    files.sort((a, b) => b.bytes - a.bytes);
    const total = files.reduce((n, f) => n + f.bytes, 0);
    return { files, total, kb: Math.round(total / 1024) };
  } catch {
    return null;
  }
}
