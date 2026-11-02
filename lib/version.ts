// The release numeral on the landing page, read from the installed `nowaki` CLI
// at render time (dev, start and prerender all run from the site root), so a
// dependency bump updates the hero without touching copy.
import { readFileSync } from "node:fs";
import { join } from "node:path";

function installedVersion(): string {
  try {
    const pkg = JSON.parse(readFileSync(join(process.cwd(), "node_modules/nowaki/package.json"), "utf8"));
    if (typeof pkg.version === "string") return pkg.version;
  } catch {
    /* fall through to the declared range */
  }
  const site = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf8"));
  return String(site.devDependencies?.nowaki ?? "0.0.0").replace(/^[^\d]*/, "");
}

const full = installedVersion();
const [major, minor] = full.split(".");

/** e.g. "0.12.1" */
export const NOWAKI_VERSION = full;
/** e.g. "0.12": what the hero shows. */
export const NOWAKI_RELEASE = `${major}.${minor}`;
