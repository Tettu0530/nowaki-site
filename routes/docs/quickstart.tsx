import { DOCS_HEAD } from "../../lib/docs-style.ts";
import Code from "../../components/Code.tsx";

export const lang = "en";
export const title = "Nowaki docs · Quickstart";
export const head = DOCS_HEAD;

export default function Quickstart() {
  return (
    <>
      <h1>Quickstart</h1>
      <p class="lead">From nothing to a running app in about a minute, without installing Rust.</p>

      <h2>Scaffold</h2>
      <Code src={`npm create nowaki@latest my-app
cd my-app
npm install`} />
      <p>
        The CLI ships as a prebuilt native binary (resolved through optional dependencies per
        platform), so there's no Rust toolchain to install. You can also install it globally with{" "}
        <code>npm i -g nowaki</code> or <code>cargo install nowaki</code>.
      </p>

      <h2>Develop</h2>
      <Code src={`npm run dev   # → nowaki dev`} />
      <p>
        The Rust/oxc pipeline transforms files on demand. Pages render to HTML; the components under{" "}
        <code>islands/</code> hydrate in the browser. Transform and SSR errors appear as a
        full-screen overlay, and saving fixes them reloads automatically.
      </p>
      <p>
        While <code>nowaki dev</code> runs, coding agents can inspect the app over MCP{" "}
        <span class="badge">v0.16</span>. The startup banner prints the URL and the command that adds it
        to Claude Code:
      </p>
      <Code src={`claude mcp add --transport http nowaki http://127.0.0.1:<port>/__nowaki/mcp`} />
      <p>
        The tools are read-only: <code>routes</code> (the route table with layouts, middleware and
        boundaries), <code>module_graph</code> (a file's imports, importers and islands),{" "}
        <code>recent_errors</code> (the last 50 build, SSR, live and HMR errors) and{" "}
        <code>dev_config</code> (port, <code>NOWAKI_*</code> flags, Jetstream connections and rooms).
        The endpoint answers only loopback clients; <code>nowaki start</code> and the adapters don't
        serve it.
      </p>

      <h2>Build &amp; serve</h2>
      <Code src={`npm run build   # → nowaki build   (scope-hoisted, content-hashed ESM + SSR modules)
npm run start   # → nowaki start   (Rust front + Node renderer)`} />
      <p>
        The build prints each route's first-load JS and suggests islands that could ship none; see{" "}
        <a href="/docs/routing/">budgets</a>.
      </p>

      <h2>Project layout</h2>
      <Code src={`my-app/
  routes/
    index.tsx          # /
    about.tsx          # /about
    blog/[slug].tsx    # /blog/:slug   (+ optional server loader)
    api/hello.ts       # /api/hello    (GET/POST handlers)
    _layout.tsx        # shared layout (nests per directory)
    _middleware.ts     # runs before routes (auth, redirects, headers)
    _404.tsx _500.tsx  # not-found / error pages
  islands/
    Counter.tsx        # hydrates in the browser; nothing else does
  actions/
    todos.ts           # "use server" RPC endpoints (optional)
  nowaki.config.mjs    # plugins (optional)`} />

      <h2>Your first route</h2>
      <Code src={`// routes/index.tsx
import Counter from "../islands/Counter.tsx";

export const title = "Home";
export const loader = async () => ({ now: new Date().toISOString() });

export default function Home({ data }) {
  return (
    <main>
      <h1>Hello from Nowaki</h1>
      <p>Rendered at {data.now}</p>
      <Counter start={0} />   {/* the only thing that ships JS */}
    </main>
  );
}`} />

      <h2>Updating</h2>
      <p>
        Bump the CLI and runtime together with one command; it detects your package manager and
        rewrites the <code>package.json</code> ranges:
      </p>
      <Code src={`npx nowaki upgrade              # nowaki + @nowaki-dev/runtime → latest
npx nowaki upgrade --to 0.11.0  # or pin a version`} />
      <p>
        A plain <code>npm update</code> won't cross a <code>0.x</code> minor (caret locks the minor
        before 1.0), so reach for <code>nowaki upgrade</code>: or install <code>@latest</code> by
        hand. Pre-1.0, skim the release notes first; a minor can carry breaking changes.
      </p>
    </>
  );
}
