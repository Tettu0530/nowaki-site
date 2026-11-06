// What the landing page actually ships, computed from the production build
// (dist/client) at render time, so the "N KB" claim and its breakdown cannot
// drift from the real bundle. gzip -9, the same measurement the copy states.
// The first load is the islands runtime plus the page's islands and every chunk
// they import statically. Since Nowaki 0.17 the SPA router loads on intent (a
// link hovered, focused or touched), so it is reported apart, not added in.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

export type ShippedFile = { file: string; role: string; bytes: number };
export type Shipped = { files: ShippedFile[]; total: number; kb: number; later: ShippedFile[]; laterTotal: number };

const ROLES: [RegExp, string][] = [
  [/^islands\./, "Island runtime"],
  [/^router-core\./, "Router core"],
  [/^router\./, "Page router"],
  [/^preact\.module\./, "Preact"],
  [/^hooks\.module\./, "Preact hooks"],
  [/^jsx-?[rR]untime(\.module)?\./, "JSX runtime"],
];

function role(file: string): string {
  for (const [re, name] of ROLES) if (re.test(file)) return name;
  return `${file.replace(/\.[0-9a-f]{8}\.js$/, "")} island`;
}

/** Every chunk reachable from `roots` through static imports (`from"./x.js"`, `import"./x.js"`). */
function closure(dir: string, roots: string[]): Set<string> {
  const seen = new Set<string>();
  const walk = (file: string) => {
    if (!file || seen.has(file) || !existsSync(join(dir, file))) return;
    seen.add(file);
    const src = readFileSync(join(dir, file), "utf8");
    for (const m of src.matchAll(/(?:from|import)\s*"\.\/([^"]+\.js)"/g)) walk(m[1]);
  };
  roots.forEach(walk);
  return seen;
}

/** Files a page with the given islands loads, or null when no build exists (e.g. in dev). */
export function shipped(islands: string[]): Shipped | null {
  const dir = join(process.cwd(), "dist/client");
  const manifestPath = join(dir, "manifest.json");
  if (!existsSync(manifestPath)) return null;
  try {
    const m = JSON.parse(readFileSync(manifestPath, "utf8"));
    const names = readdirSync(dir);
    // 0.16 manifests map island names to chunks; 0.17 lists the names, so find the hashed file.
    const chunk = (name: string) =>
      Array.isArray(m.islands) ? names.find((f) => new RegExp(`^${name}\\.[0-9a-f]{8}\\.js$`).test(f)) : m.islands?.[name];
    const first = closure(dir, [m.runtime, ...islands.map(chunk)].filter(Boolean));
    const router = closure(dir, [m.routerRuntime].filter(Boolean));
    for (const f of first) router.delete(f);
    const describe = (files: Set<string>) =>
      [...files]
        .map((file) => ({
          file: file.replace(/\.[0-9a-f]{8}\.js$/, ".js"),
          role: role(file),
          bytes: gzipSync(readFileSync(join(dir, file)), { level: 9 }).length,
        }))
        .sort((a, b) => b.bytes - a.bytes);
    const files = describe(first);
    const later = describe(router);
    const total = files.reduce((n, f) => n + f.bytes, 0);
    return { files, total, kb: Math.round(total / 1024), later, laterTotal: later.reduce((n, f) => n + f.bytes, 0) };
  } catch {
    return null;
  }
}
