// Head-to-head on one app: a server-rendered page with one interactive counter
// (benchmarks/apps/*-counter). Same machine, same script, one framework at a time.
//
// Usage: node benchmarks/head-to-head.mjs <framework> [--runs 3]
//   framework: nowaki | next | astro | nuxt | sveltekit
// Install that app first: pnpm -C benchmarks/apps/<framework>-counter install
// Each run is appended to benchmarks/results/runs.jsonl; summarize.mjs prints medians.
//
// Metrics (the same definitions as BENCHMARKS.md in Tettu0530/nowaki):
//   dev ready (cold)  wall time from starting the dev server to its ready line, caches cleared
//   dev first page    wall time from the same start until GET / returns 200 with the page text
//   build             wall time of the production build, caches cleared
//   first-load JS     a quick static estimate from the built output, logged for reference only.
//                     The published figure comes from browser-check.mjs: every JS file the
//                     browser downloads for `/` plus executed inline scripts, gzip.

import { spawn, spawnSync } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { gzipSync } from "node:zlib";
import os from "node:os";
import path from "node:path";

const HERE = import.meta.dirname;
const APPS = path.join(HERE, "apps");
const name = process.argv[2];
const runsArg = process.argv.indexOf("--runs");
const RUNS = runsArg > 0 ? Number(process.argv[runsArg + 1]) : 3;
const now = () => Number(process.hrtime.bigint() / 1000000n);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function sizes(files) {
  let raw = 0;
  let gz = 0;
  for (const f of files) {
    const data = readFileSync(f);
    raw += data.length;
    gz += gzipSync(data).length;
  }
  return { rawKB: raw / 1024, gzKB: gz / 1024, files: files.length };
}

function walkJs(dir, keep = () => true) {
  const out = [];
  if (!existsSync(dir)) return out;
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith(".js") && keep(p)) out.push(p);
    }
  };
  walk(dir);
  return out;
}

// The JS a prerendered HTML page loads up front: module/classic <script src> (not nomodule),
// <link rel="modulepreload">, and import("...") calls in inline scripts.
function htmlJs(htmlFile, resolve) {
  const html = readFileSync(htmlFile, "utf8");
  const urls = new Set();
  for (const tag of html.match(/<script\b[^>]*>/gi) ?? []) {
    if (/\bnomodule\b/i.test(tag)) continue;
    const src = tag.match(/\bsrc="([^"]+)"/i)?.[1];
    if (src) urls.add(src);
  }
  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    if (!/\brel="modulepreload"/i.test(tag)) continue;
    const href = tag.match(/\bhref="([^"]+)"/i)?.[1];
    if (href) urls.add(href);
  }
  for (const m of html.matchAll(/import\(\s*["']([^"']+\.js)["']\s*\)/g)) urls.add(m[1]);
  const files = [...urls].filter((u) => /\.m?js(\?|$)/.test(u)).map((u) => resolve(u.split("?")[0]));
  const missing = files.filter((f) => !existsSync(f));
  if (missing.length) throw new Error(`referenced JS not found: ${missing.join(", ")}`);
  return files;
}

// Starts the dev server and measures two things from the same spawn:
//   readyMs  until the framework prints its ready line
//   firstMs  until GET / answers 200 with the page's own text ("Hello from"), i.e. the first
//            page is compiled and rendered. Frameworks print "ready" at different points
//            (before or after their first compile), so firstMs is the like-for-like one.
// Then kills the process group.
function devRun(cmd, args, cwd, env, markers, port, daemon = false, timeoutMs = 120000) {
  const wanted = markers.map((m) => m.toLowerCase());
  return new Promise((resolve) => {
    const t0 = now();
    const child = spawn(cmd, args, { cwd, env: { ...process.env, ...env, FORCE_COLOR: "0", NO_COLOR: "1" }, detached: true });
    let readyMs = null;
    let firstMs = null;
    let done = false;
    let log = "";
    const finish = () => {
      if (done) return;
      done = true;
      try {
        process.kill(-child.pid, "SIGKILL");
      } catch {}
      resolve({ readyMs, firstMs, log });
    };
    const onData = (buf) => {
      const text = buf.toString();
      log += text;
      if (readyMs == null && wanted.some((m) => text.toLowerCase().includes(m))) readyMs = now() - t0;
    };
    child.stdout.on("data", onData);
    child.stderr.on("data", onData);
    // A CLI that hands the server to a background daemon (Astro 7) exits early; keep polling.
    child.on("exit", () => (daemon ? null : finish()));
    setTimeout(finish, timeoutMs);
    (async () => {
      while (!done && firstMs == null) {
        try {
          const r = await fetch(`http://localhost:${port}/`, { signal: AbortSignal.timeout(30000) });
          const body = await r.text();
          if (r.status === 200 && body.includes("Hello from")) firstMs = now() - t0;
        } catch {}
        if (firstMs == null) await sleep(25);
      }
      // both observed (or the page answered before any ready line): stop
      if (firstMs != null) setTimeout(finish, readyMs == null ? 300 : 0);
    })();
  });
}

function run(cmd, args, cwd, env) {
  const t0 = now();
  const r = spawnSync(cmd, args, { cwd, encoding: "utf8", maxBuffer: 64 << 20, env: { ...process.env, ...env, FORCE_COLOR: "0", NO_COLOR: "1" } });
  return { ms: r.status === 0 ? now() - t0 : null, log: `${r.stdout ?? ""}${r.stderr ?? ""}` };
}

const FRAMEWORKS = {
  nowaki: {
    label: "Nowaki",
    dir: "nowaki-counter",
    bin: "nowaki",
    dev: ["dev", ".", "--port", "8901"],
    ready: ["ready in"],
    // `nowaki build` writes no HTML; the others prerender `/` in their build, so Nowaki is
    // timed with `nowaki prerender` (build, then render every route to dist/static).
    build: ["prerender", "."],
    port: 8901,
    caches: ["dist", ".nowaki", "node_modules/.cache"],
    js(dir) {
      const client = path.join(dir, "dist/client");
      const m = JSON.parse(readFileSync(path.join(client, "manifest.json"), "utf8"));
      const lazy = new Set([m.routerRuntime, ...(m.preload?.[m.routerRuntime] ?? [])]);
      return walkJs(client, (p) => !lazy.has(path.basename(p)));
    },
  },
  next: {
    label: "Next.js",
    dir: "next-counter",
    bin: "next",
    env: { NEXT_TELEMETRY_DISABLED: "1" },
    dev: ["dev", "-p", "8902"],
    port: 8902,
    ready: ["ready in"],
    build: ["build"],
    caches: [".next"],
    js: (dir) => htmlJs(path.join(dir, ".next/server/app/index.html"), (u) => path.join(dir, ".next", u.replace(/^\/_next\//, ""))),
  },
  astro: {
    label: "Astro",
    dir: "astro-counter",
    bin: "astro",
    env: { ASTRO_TELEMETRY_DISABLED: "1" },
    dev: ["dev", "--port", "8903"],
    port: 8903,
    ready: ["ready in", "dev server running at"],
    daemon: true,
    after: (dir, bin) => spawnSync(bin, ["dev", "stop"], { cwd: dir, stdio: "ignore" }),
    build: ["build"],
    caches: ["dist", ".astro", "node_modules/.vite"],
    js: (dir) => walkJs(path.join(dir, "dist")), // Astro emits only island JS
  },
  nuxt: {
    label: "Nuxt",
    dir: "nuxt-counter",
    bin: "nuxt",
    env: { NUXT_TELEMETRY_DISABLED: "1" },
    dev: ["dev", "--port", "8904"],
    port: 8904,
    ready: ["ready in"], // "◆ Ready in 2.51s", printed once the server stops answering 503
    build: ["build"],
    caches: [".nuxt", ".output", "node_modules/.cache", "node_modules/.vite"],
    js: (dir) => htmlJs(path.join(dir, ".output/public/index.html"), (u) => path.join(dir, ".output/public", u)),
  },
  sveltekit: {
    label: "SvelteKit",
    dir: "sveltekit-counter",
    bin: "vite",
    dev: ["dev", "--port", "8905"],
    port: 8905,
    ready: ["ready in"],
    build: ["build"],
    caches: [".svelte-kit", "build", "node_modules/.vite"],
    js: (dir) => htmlJs(path.join(dir, "build/index.html"), (u) => path.join(dir, "build", u.replace(/^\.?\//, ""))),
  },
};

const fw = FRAMEWORKS[name];
if (!fw) {
  console.error(`usage: node benchmarks/head-to-head.mjs <${Object.keys(FRAMEWORKS).join("|")}> [--runs N]`);
  process.exit(2);
}
if (process.env.READY) fw.ready = process.env.READY.split("|");
if (!fw.ready) {
  console.error(`${name}: no ready marker yet; pass READY="<text>" after checking the dev output`);
  process.exit(2);
}
const dir = path.join(APPS, fw.dir);
const bin = path.join(dir, "node_modules/.bin", fw.bin);
if (!existsSync(bin)) {
  console.error(`${fw.label} is not installed: pnpm -C benchmarks/apps/${fw.dir} install`);
  process.exit(2);
}
const version = JSON.parse(readFileSync(path.join(dir, "node_modules", fw.bin === "vite" ? "@sveltejs/kit" : fw.bin, "package.json"), "utf8")).version;
const clean = () => fw.caches.forEach((c) => rmSync(path.join(dir, c), { recursive: true, force: true }));

mkdirSync(path.join(HERE, "results"), { recursive: true });
const machine = `${os.cpus()[0].model}, ${os.cpus().length} cores, ${Math.round(os.totalmem() / 2 ** 30)} GB, ${os.platform()} ${os.release()}, node ${process.version}`;
console.log(`${fw.label} ${version} · ${RUNS} runs · ${machine}`);

for (let i = 1; i <= RUNS; i++) {
  clean();
  const dev = await devRun(bin, fw.dev, dir, fw.env, fw.ready, fw.port, fw.daemon);
  fw.after?.(dir, bin);
  await sleep(1500); // let the port and child processes go
  if (dev.firstMs == null) console.error(dev.log.slice(-2000));
  clean();
  const build = run(bin, fw.build, dir, fw.env);
  if (build.ms == null) {
    console.error(build.log.slice(-3000));
    process.exit(1);
  }
  const js = sizes(fw.js(dir));
  const row = { framework: name, label: fw.label, version, run: i, devMs: dev.readyMs, devFirstMs: dev.firstMs, buildMs: build.ms, buildCmd: fw.build.join(" "), ...js, at: new Date().toISOString(), machine };
  appendFileSync(path.join(HERE, "results/runs.jsonl"), `${JSON.stringify(row)}\n`);
  console.log(`run ${i}: dev ready ${dev.readyMs} ms, first page ${dev.firstMs} ms · build ${build.ms} ms · JS ${js.rawKB.toFixed(1)} KB raw / ${js.gzKB.toFixed(1)} KB gzip (${js.files} files)`);
  await sleep(1500);
}
clean();
