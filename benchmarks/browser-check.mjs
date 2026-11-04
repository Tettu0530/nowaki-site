// Cross-check for first-load JS: open a production build of `/` in headless Chromium
// and list every JavaScript response until the network has been quiet for 2s.
// Usage: node benchmarks/browser-check.mjs <url> [framework]  (with a framework, appends to results/browser.jsonl)
// Needs a Chromium binary: set CHROME, or a Playwright-installed headless shell is used.
import { spawn } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { gzipSync } from "node:zlib";
import os from "node:os";
import path from "node:path";

const url = process.argv[2];
const framework = process.argv[3];
function chrome() {
  if (process.env.CHROME) return process.env.CHROME;
  const cache = path.join(os.homedir(), "Library/Caches/ms-playwright");
  const dir = readdirSync(cache).filter((d) => d.startsWith("chromium_headless_shell-")).sort().pop();
  const bin = path.join(cache, dir, "chrome-headless-shell-mac-arm64/chrome-headless-shell");
  if (!existsSync(bin)) throw new Error("set CHROME to a Chromium binary");
  return bin;
}
const port = 9400 + Math.floor(Math.random() * 400);
const proc = spawn(chrome(), ["--headless", `--remote-debugging-port=${port}`, "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target;
for (let i = 0; i < 50 && !target; i++) {
  try {
    target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === "page");
  } catch {}
  await sleep(100);
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pending = new Map();
const js = new Map();
let last = Date.now();
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) pending.get(m.id)(m.result);
  if (m.method === "Network.responseReceived") {
    last = Date.now();
    const r = m.params.response;
    if (m.params.type === "Script" || /javascript/.test(r.mimeType)) js.set(m.params.requestId, { url: r.url, t: m.params.timestamp });
  }
  if (m.method === "Network.loadingFinished") last = Date.now();
};
const send = (method, params = {}) =>
  new Promise((r) => {
    const i = ++id;
    pending.set(i, r);
    ws.send(JSON.stringify({ id: i, method, params }));
  });
await send("Network.enable");
await send("Network.setCacheDisabled", { cacheDisabled: true });
await send("Page.enable");
await send("Page.navigate", { url });
await sleep(1000);
while (Date.now() - last < 2000) await sleep(200);

let raw = 0;
let gz = 0;
const rows = [];
for (const [rid, r] of js) {
  const body = await send("Network.getResponseBody", { requestId: rid });
  if (!body) continue;
  const buf = Buffer.from(body.body, body.base64Encoded ? "base64" : "utf8");
  raw += buf.length;
  gz += gzipSync(buf).length;
  rows.push(`${(gzipSync(buf).length / 1024).toFixed(1).padStart(6)} KB gz  ${new URL(r.url).pathname}`);
}
// Inline scripts the browser executes count too (some frameworks inline their island loader or
// hydration data as script). JSON and import maps are data, not code, so they are left out.
const inline = (
  await send("Runtime.evaluate", {
    expression: `[...document.querySelectorAll('script:not([src])')].filter(s => ['', 'module', 'text/javascript', 'application/javascript'].includes((s.type || '').toLowerCase())).map(s => s.textContent)`,
    returnByValue: true,
  })
).result.value;
const inlineText = inline.join("\n");
const inRaw = Buffer.byteLength(inlineText);
const inGz = inline.length ? gzipSync(Buffer.from(inlineText)).length : 0;
console.log(rows.join("\n"));
console.log(`files:  ${rows.length}, ${(raw / 1024).toFixed(1)} KB raw / ${(gz / 1024).toFixed(1)} KB gzip`);
console.log(`inline: ${inline.length} scripts, ${(inRaw / 1024).toFixed(1)} KB raw / ${(inGz / 1024).toFixed(1)} KB gzip`);
console.log(`total:  ${((raw + inRaw) / 1024).toFixed(1)} KB raw / ${((gz + inGz) / 1024).toFixed(1)} KB gzip`);
if (framework) {
  mkdirSync(path.join(import.meta.dirname, "results"), { recursive: true });
  const row = { framework, files: rows.length, fileKB: gz / 1024, inlineKB: inGz / 1024, rawKB: (raw + inRaw) / 1024, gzKB: (gz + inGz) / 1024, list: rows.map((r) => r.trim()), at: new Date().toISOString() };
  appendFileSync(path.join(import.meta.dirname, "results/browser.jsonl"), `${JSON.stringify(row)}\n`);
}
ws.close();
proc.kill();
process.exit(0);
