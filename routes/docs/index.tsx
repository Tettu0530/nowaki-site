import { DOCS_HEAD } from "../../lib/docs-style.ts";

export const lang = "en";
export const title = "Nowaki docs · Overview";
export const head = DOCS_HEAD;

export default function Overview() {
  return (
    <>
      <h1>Nowaki <span class="badge">alpha</span></h1>
      <p class="lead">
        A full-stack web framework with a Rust toolchain. Full-stack like Next.js, islands like
        Astro, installed with npm, no Rust required.
      </p>

      <p>
        Nowaki (野分) renders your pages to HTML on the server and hydrates only the components you
        mark as <em>islands</em>. The whole build pipeline (transform, resolve, bundle, serve) runs
        in Rust on top of <a href="https://oxc.rs">oxc</a>, so the dev server is ready in tens of
        milliseconds and a changed file re-transforms in single-digit milliseconds.
      </p>

      <h2>Why it exists</h2>
      <p>
        Most JavaScript frameworks run their toolchain on a JavaScript toolchain. Nowaki moves that
        pipeline to Rust while keeping the things that make Next.js productive (file-based routing,
        layouts, middleware, server data loading, actions, API routes) and keeps the npm ecosystem
        for SSR. You write Preact (with a <code>react</code> → <code>preact/compat</code> alias for
        libraries), and you ship almost no client JavaScript by default.
      </p>

      <h2>The three pillars</h2>
      <table>
        <tr>
          <th>Rust toolchain</th>
          <td>Transform/resolve/bundle/serve in Rust (oxc). Fast cold start, millisecond rebuilds, scope-hoisted production output.</td>
        </tr>
        <tr>
          <th>Zero JS by default</th>
          <td>Pages are HTML. Only components under <code>islands/</code> hydrate. A content page ships 0 KB of JS.</td>
        </tr>
        <tr>
          <th>npm-compatible</th>
          <td>SSR runs on Node (or Bun/Deno/edge). Use your existing npm packages; the CLI installs as a prebuilt native binary.</td>
        </tr>
      </table>

      <h2>What's in the box</h2>
      <ul>
        <li><strong>Routing &amp; data</strong>: file-based routes, nested layouts, middleware, server loaders, form actions, API routes, streaming SSR.</li>
        <li><strong>Server functions</strong>: <code>"use server"</code> modules become typed RPC endpoints; the client gets a tiny fetch proxy.</li>
        <li><strong>Lazy hydration</strong>: Astro-style <code>client:load</code> / <code>client:idle</code> / <code>client:visible</code> / <code>client:media</code> / <code>client:only</code> directives control <em>when</em> an island hydrates.</li>
        <li><strong>Jetstream islands</strong>: server-reactive islands that update over a WebSocket (or one POST per event on the adapters) with <em>zero</em> component JS on the client, plus rooms, live queries and form events.</li>
        <li><strong><a href="/docs/content/">Content sites</a></strong>: typed Markdown and MDX collections, build-time code highlighting, responsive AVIF images, SEO metadata with a generated sitemap, and self-hosted fonts.</li>
        <li><strong><a href="/docs/larger-apps/">Routing for larger apps</a></strong>: route groups, parallel and intercepting routes, config redirects, i18n routing, sessions, and typed environment variables.</li>
        <li><strong><a href="/docs/routing/#on-demand-revalidation">On-demand revalidation</a></strong> <span class="badge">v0.19</span>: <code>revalidatePath()</code> / <code>revalidateTag()</code> with route <code>tags</code> purge ISR pages from the <code>nowaki start</code> cache and the Vercel and Cloudflare CDNs.</li>
        <li><strong><a href="/docs/routing/#view-transitions">View Transitions</a></strong> <span class="badge">v0.19</span>: opt-in per link (<code>&lt;Link viewTransition&gt;</code>) or per route, with <code>transitionName()</code> for elements that morph into the next page.</li>
        <li><strong><a href="/docs/observability/">Observability</a></strong> <span class="badge">v0.19</span>: Server-Timing, JSON logs, OpenTelemetry traces over OTLP and a health endpoint, all of it off unless asked for.</li>
        <li><strong><a href="/docs/quickstart/#hmr">HMR with state</a> and a <a href="/docs/quickstart/#dev-toolbar">dev toolbar</a></strong> <span class="badge">v0.19</span>: island edits keep their state, route and layout edits update the page in place, and the toolbar shows the page's route, islands, JS budget, ISR, live connections and errors.</li>
        <li><strong>Plugins</strong>: <code>transform</code> hooks and virtual modules (<code>resolveId</code> / <code>load</code>); a <code>.tsrx</code> bridge.</li>
        <li><strong>Images</strong>: <code>&lt;Image&gt;</code> and <code>?image</code> imports generate AVIF and the original format at several widths, with <code>width</code> and <code>height</code> from the file, encoded in pure Rust and cached (see <a href="/docs/content/">Content sites</a>).</li>
        <li><strong>Deploy anywhere</strong>: Node, Bun, Deno, static prerender, Cloudflare Workers, or Vercel via build adapters.</li>
      </ul>

      <div class="note">
        Nowaki is <strong>alpha</strong>. The API may still change between minor versions. It's real
        and published on npm and crates.io, but not yet recommended for production.
      </div>
    </>
  );
}
