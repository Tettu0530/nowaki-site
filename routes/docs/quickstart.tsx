import { DOCS_HEAD } from "../../lib/docs-style.ts";
import Code from "../../components/Code.tsx";

export const lang = "en";
export const title = "Nowaki docs · Quickstart";
export const head = DOCS_HEAD;

// The site's own getting-started page. Everything deeper lives in the synced framework docs
// (content/docs/); link there rather than repeating it here.
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
        <code>npm i -g nowaki</code> or <code>cargo install nowaki</code>. Nowaki needs Node 22 or
        newer.
      </p>

      <h2 id="release-candidate">Try the 1.0 release candidate</h2>
      <p>
        <code>@latest</code> is 0.20.0, the stable release. The 1.0 release candidates are on the
        npm <code>next</code> tag; nothing breaks between 0.20.0 and them.
      </p>
      <Code src={`npm create nowaki@next my-app              # a new app on the release candidate
npx nowaki@next upgrade --to next --check  # an existing app: list what must change first
npx nowaki@next upgrade --to next`} />
      <p>
        Run the candidate's own CLI (<code>nowaki@next</code>): a plain <code>npx nowaki</code> uses
        the app's installed CLI, whose older checks can flag things that are fine (0.20.0 flags a
        catch-all page's <code>head</code> export). If npm answers <code>ETARGET</code> for a version
        that exists, add <code>--prefer-online</code>.
      </p>

      <h2>Develop</h2>
      <Code src={`npm run dev   # → nowaki dev`} />
      <p>
        The Rust/oxc pipeline transforms files on demand. Pages render to HTML; the components under{" "}
        <code>islands/</code> hydrate in the browser. Errors appear as a full-screen overlay, island
        edits keep their state, and route and layout edits update the page in place. A small
        toolbar shows the page's route, islands and JS budget, and coding agents can inspect the
        app over MCP. See <a href="/docs/guides/dev-experience/">Dev experience</a>.
      </p>

      <h2>Build &amp; serve</h2>
      <Code src={`npm run build   # → nowaki build   (scope-hoisted, content-hashed ESM + SSR modules)
npm run start   # → nowaki start   (Rust front + Node renderer)`} />
      <p>
        The build prints each route's first-load JS and suggests islands that could ship none (see{" "}
        <a href="/docs/guides/islands/#js-budgets">JS budgets</a>). To deploy elsewhere, pick an
        adapter in <a href="/docs/deploy/">Deploy</a>.
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
    todos.ts           # "use server" functions (optional)
  nowaki.config.mjs    # routing config and plugins (optional)`} />

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

      <h2 id="updating">Updating</h2>
      <p>
        Bump the CLI and runtime together with one command; it detects your package manager and
        rewrites the <code>package.json</code> ranges. The CLI refuses a runtime of another version,
        so keep the two on the same one.
      </p>
      <Code src={`npx nowaki upgrade --check   # list what the app must change, install nothing
npx nowaki upgrade           # nowaki + @nowaki-dev/runtime → latest`} />
      <p>
        A plain <code>npm update</code> won't cross a <code>0.x</code> minor, so use{" "}
        <code>nowaki upgrade</code>. Coming from an older release, read{" "}
        <a href="/docs/upgrade-to-1.0/">Upgrading to 1.0</a>: it lists every change from 0.17 on
        (and summarizes 0.14 to 0.16), with what to do.
      </p>

      <h2>Next</h2>
      <ul>
        <li><a href="/docs/guides/routing/">Routing</a> and <a href="/docs/guides/data/">Data</a>: routes, loaders, actions, API routes and server functions.</li>
        <li><a href="/docs/guides/islands/">Islands and hydration</a> and <a href="/docs/guides/jetstream/">Jetstream live islands</a>.</li>
        <li><a href="/docs/guides/content/">Content</a> for Markdown, MDX and Markdoc sites.</li>
        <li><a href="/docs/migrate-from-nextjs/">Migrating from Next.js</a> or <a href="/docs/migrate-from-astro/">from Astro</a>.</li>
      </ul>
    </>
  );
}
