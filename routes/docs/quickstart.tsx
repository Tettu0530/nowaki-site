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

      <h3 id="hmr">HMR that keeps state <span class="badge">v0.19</span></h3>
      <p>
        Editing an island, or a module that only islands import, swaps the components in place
        (Preact Fast Refresh): hook state survives, and a changed hook list (an added or removed
        hook) remounts that component. Only the edited modules and their importers up to the island
        are loaded again, so unchanged modules such as shared stores keep one instance. Live
        (Jetstream) islands are re-rendered on the server with the state they hold.
      </p>
      <p>
        Editing a route, a layout, or a server-only module that only routes import (such as{" "}
        <code>lib/db.ts</code>) refetches the page and updates it in place: the text, the head
        region and the <code>&lt;html&gt;</code> / <code>&lt;body&gt;</code> attributes change, while
        islands whose <code>src</code> and props are unchanged keep their element and state, and the
        scroll position stays. An island given new props hydrates afresh. An open intercepting slot (a
        modal over a list) stays open. A non-200 response, such as the error page for a syntax error,
        falls back to a reload, and the page comes back once the file is fixed.
      </p>
      <p>
        CSS updates without a reload: an island's stylesheet is replaced in its{" "}
        <code>&lt;style&gt;</code>, a route or layout stylesheet is swapped once the new one has
        loaded, and a CSS Module whose class names changed re-imports its islands. Changes to
        nowaki.config, <code>env.ts</code>, <code>.env</code> and <code>session.ts</code> still
        reload. Builds are unchanged.
      </p>

      <h3 id="dev-toolbar">Dev toolbar <span class="badge">v0.19</span></h3>
      <p>
        <code>nowaki dev</code> pages get a small collapsible toolbar (bottom left) with what the dev
        MCP endpoint knows about the page on screen:
      </p>
      <ul>
        <li>the matched route file, its layouts and middleware, and the Server-Timing of the last load (also after a client navigation or an HMR page update)</li>
        <li>the islands, with their kind (client or live), hydration state, strategy, size and the "could be live" hint</li>
        <li>the first-load JS against <code>export const budget</code> (a dev estimate, shown next to the last <code>nowaki build</code> figure when <code>dist/</code> has one)</li>
        <li>the ISR settings and recent revalidations</li>
        <li>Jetstream connections and rooms</li>
        <li>recent errors, with links into your editor</li>
      </ul>
      <p>
        <code>NOWAKI_EDITOR</code> picks the editor for those links: <code>vscode</code> by default,{" "}
        <code>cursor</code>, <code>zed</code>, <code>windsurf</code>, <code>idea</code>, or a URL
        template with <code>{"{file}"}</code>, <code>{"{line}"}</code> and <code>{"{column}"}</code>.
        The server never starts an editor. Turn the toolbar off with{" "}
        <code>nowaki dev --no-toolbar</code> or <code>NOWAKI_TOOLBAR=0</code>, or per browser with its
        close button. It is never part of a build.
      </p>
      <Code src={`nowaki dev --no-toolbar        # or NOWAKI_TOOLBAR=0
NOWAKI_EDITOR=cursor nowaki dev  # editor links open in Cursor`} />
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
        <code>dev_config</code> (port, <code>NOWAKI_*</code> flags, Jetstream connections and rooms,
        and since 0.19 the recent revalidations). 0.19 adds <code>page</code> (<code>{`{ url }`}</code>:
        the route, layouts, middleware, <code>revalidate</code> / <code>tags</code>, the islands with
        sizes and hints, the JS estimate and the last build figure, recent revalidations) and{" "}
        <code>live</code> (Jetstream connections, the cap, rooms with member counts). The endpoint answers only loopback clients; <code>nowaki start</code> and the adapters don't
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

      <p>
        From 0.19.3 the CLI (<code>nowaki</code>), <code>@nowaki-dev/runtime</code> and{" "}
        <code>create-nowaki</code> share one version and are released together. It starts at 0.19.3
        because <code>create-nowaki</code> had already published 0.19.2, so the CLI and runtime skip
        0.19.0 to 0.19.2.
      </p>

      <h2>Upgrading to 0.19</h2>
      <ul>
        <li>
          <strong>Update the CLI and <code>@nowaki-dev/runtime</code> together.</strong> The CLI now
          refuses a runtime older than its own version (0.19.3), naming both and the{" "}
          <code>npm i</code> fix. <code>nowaki upgrade</code> updates both.
        </li>
        <li>
          <strong>Breaking: API routes and file routes reject cross-site writes by default.</strong> A
          POST, PUT, PATCH or DELETE to an API route (<code>routes/api/**</code>) or a file route
          (<code>feed.xml.ts</code>) whose <code>Origin</code> is another site or <code>null</code>, or
          that has <code>Sec-Fetch-Site: cross-site</code> without <code>Origin</code>, now gets the
          same 403 <code>Forbidden</code> as a page action, before the handler runs (after
          middleware). Until 0.18 it was allowed with a one-time warning. GET, HEAD and OPTIONS are
          unaffected, and so are requests with neither header (curl, server-to-server calls, most
          native apps).
          <ul>
            <li>Affected: APIs called from a browser page on another origin (another app of yours, a separate frontend, a preview domain), webhooks and payment or OAuth callbacks that a provider posts from its own page, and native apps that send an <code>Origin</code>.</li>
            <li>Opt such a route out with <code>export const csrf = false</code>, and authenticate it with a signature or shared secret rather than cookies. <code>export const csrf = true</code> is now the default and still accepted.</li>
            <li>Behind a proxy that rewrites <code>Host</code>, forward the public host as <code>x-forwarded-host</code> (with <code>NOWAKI_TRUST_PROXY=1</code> where needed), as for actions, or same-origin calls are rejected too.</li>
          </ul>
          See <a href="/docs/security/#cross-site-requests">Cross-site requests</a>.
        </li>
        <li>
          <strong>Building Nowaki from source needs Rust 1.97 or newer</strong> (was 1.95), because
          oxc 0.158 does. The npm packages are unaffected.
        </li>
      </ul>
      <Code src={`// routes/api/webhook.ts
export const csrf = false;   // a provider posts here; verify its signature instead of cookies`} />
      <p>
        New in 0.19:{" "}
        <a href="/docs/routing/#on-demand-revalidation">on-demand revalidation</a>,{" "}
        <a href="/docs/routing/#view-transitions">View Transitions</a>,{" "}
        <a href="/docs/observability/">observability</a>, and <a href="#hmr">HMR</a> and the{" "}
        <a href="#dev-toolbar">dev toolbar</a> above.
      </p>

      <h2>Upgrading to 0.18</h2>
      <ul>
        <li><strong>Unknown keys in <code>nowaki.config</code> are now an error.</strong> The config is validated at build (and dev) time, so a typo fails instead of being ignored.</li>
        <li>
          <strong>Copy the new type files from the template.</strong> <code>nowaki-env.d.ts</code> is
          ambient again (asset wildcards, <code>ImportMetaEnv</code>, <code>ImportMeta</code>), so{" "}
          <code>import hero from "./hero.jpg?image"</code> type-checks. The preact JSX additions for{" "}
          <code>client:*</code> moved to a new <code>nowaki-jsx.d.ts</code>. Copy both files from a
          new app and add both to <code>tsconfig.json</code> <code>include</code>.{" "}
          <code>nowaki upgrade</code> doesn't copy template files.
        </li>
        <li>Layouts receive a <code>slots</code> prop (an empty object when they own no <code>@slot</code>).</li>
        <li><code>staticPaths</code> receives an argument (<code>{`{ locale }`}</code> with i18n, <code>{`{}`}</code> otherwise).</li>
        <li>Two route files with the same URL shape are an error when one of them is in a <code>(group)</code>.</li>
        <li>A page that reads <code>ctx.session</code> can't be prerendered (static output fails with the page named). In production, <code>ctx.session</code> needs <code>NOWAKI_SESSION_SECRET</code>.</li>
        <li><span class="badge">0.18.1</span> <strong>With <code>i18n</code> configured, config rules match the path without the locale prefix</strong>, so a <code>/login</code> rule now also applies to <code>/ja/login</code>. Add <code>locale: false</code> to a rule to keep matching the full path.</li>
        <li><span class="badge">0.18.1</span> <strong>With <code>i18n</code> configured, <code>&lt;Link href="/x"&gt;</code> keeps the current locale</strong> (<code>/ja/x</code> on a Japanese page). Pass <code>locale={"{false}"}</code> for the old behavior.</li>
        <li><span class="badge">0.18.2</span> <strong>The CLI refuses an <code>@nowaki-dev/runtime</code> older than 0.17.1</strong> instead of silently ignoring nowaki.config. Update the runtime along with the CLI.</li>
      </ul>
      <Code src={`// tsconfig.json
{
  "include": [
    "nowaki-env.d.ts",
    "nowaki-jsx.d.ts",
    ".nowaki/types.d.ts",
    "nowaki.config.*",
    "routes",
    "islands",
    "components",
    "lib",
    "actions"
  ]
}`} />
      <p>
        The new routing features are covered in <a href="/docs/larger-apps/">Routing for larger apps</a>.
      </p>
    </>
  );
}
