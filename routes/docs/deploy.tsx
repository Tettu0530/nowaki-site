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
      <p>
        Jetstream islands are live on every server target. The node, bun, deno, vercel and
        cloudflare adapters ship live.js and send each event as one{" "}
        <code>POST /__nowaki/live-event</code>; server push (<code>publish()</code>, other room
        members) and presence need the WebSocket of <code>nowaki dev</code> or{" "}
        <code>nowaki start</code>. Set <code>NOWAKI_LIVE_SECRET</code> when more than one instance
        can serve a request. See <a href="/docs/jetstream/">Jetstream islands</a>.
      </p>

      <h2>Node</h2>
      <Code src={`nowaki build --adapter node
cd dist/server && npm install --omit=dev
node index.mjs        # PORT=3000 by default`} />

      <h2>Static</h2>
      <Code src={`nowaki build --adapter static
# dist/static/ → upload to any static host / CDN

nowaki prerender --out public   # the same output, written where you choose`} />
      <p>
        Dynamic routes are written from their <code>staticPaths</code> (see{" "}
        <a href="/docs/routing/">Routing &amp; data</a>). If the app has <code>routes/_404.tsx</code>,
        the output includes <code>404.html</code>, which Cloudflare Pages, Netlify and GitHub Pages
        serve for unknown paths. Static output has no server to answer Jetstream events: live islands
        keep their initial SSR, and since 0.16 the pages ship no live.js. <code>nowaki build</code>{" "}
        also writes <code>.br</code> and <code>.gz</code> files next to the client assets, so a host
        that uploads the whole directory uploads those too.
      </p>

      <h2>Cloudflare Workers (edge)</h2>
      <Code src={`nowaki build --adapter cloudflare
cd dist/worker && npx wrangler deploy`} />
      <p>
        The worker bundles every server module statically (no runtime file imports), serves static
        assets from the ASSETS binding, and runs SSR, API routes, streaming, and server functions at
        the edge with <code>nodejs_compat</code>. Jetstream events arrive as POSTs; because any
        isolate can answer one, set <code>NOWAKI_LIVE_SECRET</code> as a Worker secret. The generated{" "}
        <code>wrangler.jsonc</code> enables <code>nodejs_compat_populate_process_env</code>, so vars
        and secrets reach <code>process.env</code>.
      </p>

      <h2>Vercel</h2>
      <Code src={`nowaki build --adapter vercel
vercel deploy --prebuilt    # uploads .vercel/output as-is`} />
      <p>
        The adapter writes the Build Output API v3 layout: static assets under{" "}
        <code>.vercel/output/static</code> and a self-contained Node serverless function
        (<code>functions/index.func</code>) that runs SSR, API routes, and server functions. The
        function bundles its own dependencies, so there's no install step. Jetstream events go to that
        function as one POST each; there is no WebSocket on serverless, so no server push or presence.
      </p>

      <h2>The Rust front (nowaki start)</h2>
      <p>
        <code>nowaki start</code> runs a Rust (axum) front for static serving and HTML assembly with
        a Node renderer behind it, and it's what holds the Jetstream WebSocket. Use it when you want
        server push: <code>publish()</code>, rooms that update every member, and presence. Those live
        in one process, so run a single instance for them; rooms are saved to{" "}
        <code>.nowaki/live-rooms.json</code> and come back after a restart. Since 0.16 it serves
        pre-compressed assets (br or gzip) from memory with ETags and 304s, fills the ISR cache right
        after startup (<code>NOWAKI_ISR_WARM=0</code> turns that off), and stops the Node renderer
        with SIGTERM and a 3 s grace period.
      </p>
    </>
  );
}
