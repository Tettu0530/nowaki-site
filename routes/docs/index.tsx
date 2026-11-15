import { DOCS_HEAD } from "../../lib/docs-style.ts";

export const lang = "en";
export const title = "Nowaki docs · Overview";
export const head = DOCS_HEAD;

export default function Overview() {
  return (
    <>
      <h1>Nowaki <span class="badge">pre-1.0</span></h1>
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
        <li><strong><a href="/docs/guides/routing/">Routing</a> and <a href="/docs/guides/data/">data</a></strong>: file-based routes, nested layouts, middleware, loaders, form actions, API routes, <code>"use server"</code> functions and streaming SSR.</li>
        <li><strong><a href="/docs/guides/islands/">Islands</a></strong>: <code>client:load</code> / <code>idle</code> / <code>visible</code> / <code>media</code> / <code>only</code> decide when an island hydrates, and a JS budget per route fails the build when it is exceeded.</li>
        <li><strong><a href="/docs/guides/jetstream/">Jetstream live islands</a></strong>: server-reactive islands that update over a WebSocket (or one POST per event on the adapters) with <em>zero</em> component JS on the client, plus rooms, live queries and presence.</li>
        <li><strong><a href="/docs/guides/content/">Content sites</a></strong>: typed Markdown, MDX and Markdoc collections with build-time highlighting (these docs are one), <a href="/docs/guides/images-and-fonts/">AVIF images and self-hosted fonts</a>, and <a href="/docs/guides/seo/">SEO metadata and sitemaps</a>.</li>
        <li><strong>Larger apps</strong>: route groups, parallel and intercepting routes, <a href="/docs/guides/routing-config/">redirects, rewrites and headers</a>, <a href="/docs/guides/i18n/">i18n routing</a>, and <a href="/docs/guides/sessions-and-env/">sessions and typed env</a>.</li>
        <li><strong>Production</strong>: <a href="/docs/guides/caching/">ISR with on-demand revalidation</a> and CDN purge, <a href="/docs/guides/view-transitions/">View Transitions</a>, <a href="/docs/guides/observability/">Server-Timing, JSON logs and OpenTelemetry</a>, and <a href="/docs/guides/security/">secure defaults</a> (CSRF checks, security headers, an opt-in nonce CSP).</li>
        <li><strong><a href="/docs/guides/dev-experience/">Dev experience</a></strong>: HMR that keeps island state, a dev toolbar, an MCP endpoint for coding agents, and <code>nowaki upgrade --check</code>.</li>
        <li><strong><a href="/docs/guides/plugins/">Plugins</a></strong>: <code>transform</code> hooks and virtual modules (<code>resolveId</code> / <code>load</code>).</li>
        <li><strong><a href="/docs/deploy/">Deploy anywhere</a></strong>: <code>nowaki start</code>, Node, Bun, Deno, Cloudflare Workers, Vercel, or static output.</li>
      </ul>
      <p>
        Every export, config key, CLI flag and environment variable is in the{" "}
        <a href="/docs/reference/">reference</a>, generated from the source.
      </p>

      <div class="note">
        Nowaki is <strong>pre-1.0</strong>. The public API is frozen since 0.20, and the 1.0 release
        candidates are on npm <code>next</code> (see <a href="/docs/stability/">Stability and
        versioning</a>). It's published on npm and crates.io, but not yet recommended for
        production-critical work.
      </div>
    </>
  );
}
