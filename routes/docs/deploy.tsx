import { DOCS_HEAD } from "../../lib/docs-style.ts";
import Code from "../../components/Code.tsx";

export const lang = "en";
export const title = "Nowaki docs · Deploy";
export const head = DOCS_HEAD;

export default function Deploy() {
  return (
    <>
      <h1>Deploy</h1>
      <p class="lead">
        One build, several targets. Pick an adapter with <code>nowaki build --adapter &lt;target&gt;</code>.
      </p>

      <h2>Adapters</h2>
      <table>
        <tr><th>Adapter</th><th>Output</th></tr>
        <tr><td><code>node</code> (default)</td><td>A self-contained <code>dist/server/index.mjs</code>: runs with just <code>node</code>, no Nowaki binary needed.</td></tr>
        <tr><td><code>static</code></td><td>Prerendered HTML in <code>dist/static/</code> for any CDN.</td></tr>
        <tr><td><code>bun</code> / <code>deno</code></td><td>The same <code>node:http</code>-compatible entry, portable to Bun/Deno.</td></tr>
        <tr><td><code>cloudflare</code></td><td>An edge <code>fetch</code>-handler worker in <code>dist/worker/</code> + a <code>wrangler.jsonc</code> (static assets via the ASSETS binding).</td></tr>
        <tr><td><code>vercel</code></td><td>A Build Output API v3 layout in <code>.vercel/output/</code>: static assets + a self-contained Node serverless function. Deploy with <code>vercel deploy --prebuilt</code>.</td></tr>
      </table>

      <h2>Node</h2>
      <Code src={`nowaki build --adapter node
cd dist/server && npm install --omit=dev
node index.mjs        # PORT=3000 by default`} />

      <h2>Static</h2>
      <Code src={`nowaki build --adapter static
# dist/static/ → upload to any static host / CDN`} />
      <p>Static deploys serve the initial SSR of Jetstream islands and degrade gracefully without a WebSocket.</p>

      <h2>Cloudflare Workers (edge)</h2>
      <Code src={`nowaki build --adapter cloudflare
cd dist/worker && npx wrangler deploy`} />
      <p>
        The worker bundles every server module statically (no runtime file imports), serves static
        assets from the ASSETS binding, and runs SSR, API routes, streaming, and server functions at
        the edge with <code>nodejs_compat</code>.
      </p>

      <h2>Vercel</h2>
      <Code src={`nowaki build --adapter vercel
vercel deploy --prebuilt    # uploads .vercel/output as-is`} />
      <p>
        The adapter writes the Build Output API v3 layout: static assets under{" "}
        <code>.vercel/output/static</code> and a self-contained Node serverless function
        (<code>functions/index.func</code>) that runs SSR, API routes, and server functions. The
        function bundles its own dependencies, so there's no install step. Jetstream's WebSocket
        isn't available on serverless, so live islands degrade to their initial SSR.
      </p>

      <h2>The Rust front (nowaki start)</h2>
      <p>
        <code>nowaki start</code> runs a Rust (axum) front for static serving and HTML assembly with
        a Node renderer behind it, and it's what holds the Jetstream WebSocket. Use it when you want
        the connected, server-reactive mode.
      </p>
    </>
  );
}
