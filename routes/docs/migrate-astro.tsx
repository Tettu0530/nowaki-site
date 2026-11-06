import { DOCS_HEAD } from "../../lib/docs-style.ts";
import Code from "../../components/Code.tsx";

export const lang = "en";
export const title = "Nowaki docs · Migrate from Astro";
export const head = DOCS_HEAD;

const GUIDE = "https://github.com/Tettu0530/nowaki/blob/main/docs/migrate-from-astro.md";

export default function MigrateAstro() {
  return (
    <>
      <h1>Migrate from Astro <span class="badge">v0.17</span></h1>
      <p class="lead">
        This guide moves a static Astro site to Nowaki. Pages and components become Preact TSX,{" "}
        <code>&lt;script&gt;</code> becomes <code>export const scripts</code>, endpoints become file
        routes, and most of the rest maps one to one.
      </p>

      <div class="note">
        This is a condensed version. The full guide is{" "}
        <a href={GUIDE}>docs/migrate-from-astro.md</a> on GitHub. It was written while porting a real
        personal portfolio (seven sections, GSAP and Lenis motion, an inline theme script,{" "}
        <code>&lt;html&gt;</code> attributes, self-hosted fonts, OG images rendered with resvg). The
        port's static output matched the Astro build element by element, and its OG images were
        byte-identical.
      </div>

      <h2>1. Set up</h2>
      <Code src={`npm remove astro @astrojs/check
npm install @nowaki-dev/runtime preact preact-render-to-string
npm install -D nowaki`} />
      <ul>
        <li>
          Copy <code>tsconfig.json</code> and <code>nowaki-env.d.ts</code> from a fresh app (
          <code>npm create nowaki</code>). They teach the type checker CSS, asset,{" "}
          <code>?image</code>, and <code>.mdx</code> imports.
        </li>
        <li>
          Scripts: <code>nowaki dev</code>, <code>nowaki build --adapter static</code> (without{" "}
          <code>--adapter</code>, the build targets the Node server), and <code>nowaki start</code> to
          preview a server build.
        </li>
        <li>
          Move <code>site</code> from <code>astro.config.mjs</code> to <code>nowaki.config.mjs</code>:{" "}
          <code>{`export default { site: "https://example.com" };`}</code>
        </li>
      </ul>

      <h2>2. Move the files</h2>
      <table>
        <tr><th>Astro</th><th>Nowaki</th></tr>
        <tr><td><code>src/pages/index.astro</code></td><td><code>routes/index.tsx</code></td></tr>
        <tr><td><code>src/pages/about.astro</code></td><td><code>routes/about.tsx</code> (served at <code>/about/</code> in static output, like Astro)</td></tr>
        <tr><td><code>src/layouts/Layout.astro</code></td><td><code>routes/_layout.tsx</code> (wraps every page; nest one per folder)</td></tr>
        <tr><td><code>src/components/*</code>, <code>src/sections/*</code>, <code>src/lib/*</code>, <code>src/data/*</code></td><td>anywhere at the app root: <code>components/</code>, <code>lib/</code>, <code>data/</code>, … (what routes import is compiled)</td></tr>
        <tr><td><code>src/scripts/*</code>, <code>src/motion/*</code></td><td>anywhere; they're bundled for the browser through page scripts (step 6)</td></tr>
        <tr><td><code>public/</code></td><td><code>public/</code> (served as-is, unchanged)</td></tr>
      </table>
      <p>
        Add explicit extensions to relative imports (<code>import x from "./x.ts"</code>). Node runs
        the server build as plain ESM, which doesn't guess extensions.
      </p>

      <h2>3. Components: .astro → .tsx</h2>
      <table>
        <tr><th>Astro</th><th>Nowaki (Preact)</th></tr>
        <tr><td>frontmatter (<code>---</code>)</td><td>the function body; module-level constants can stay at the top</td></tr>
        <tr><td><code>Astro.props</code></td><td>the component's props (<code>class</code> works as a prop name in Preact)</td></tr>
        <tr><td><code>&lt;slot /&gt;</code></td><td><code>children</code></td></tr>
        <tr><td>named slots</td><td>props that take JSX</td></tr>
        <tr><td><code>{`class:list={[a, { b: cond }]}`}</code></td><td>a small helper (below)</td></tr>
        <tr><td><code>{`set:html={html}`}</code></td><td><code>{`dangerouslySetInnerHTML={{ __html: html }}`}</code></td></tr>
        <tr><td><code>{`{cond && <X />}`}</code>, <code>{`{list.map(...)}`}</code></td><td>the same</td></tr>
        <tr><td>dynamic tag <code>&lt;Tag&gt;</code> from a prop</td><td><code>{`const Tag = as; <Tag … />`}</code></td></tr>
      </table>
      <Code src={`// class:list. Returns undefined when empty, so the attribute is left out, as Astro does.
export const cx = (...n: unknown[]) =>
  [...new Set(n.flat(9).filter((x): x is string => typeof x === "string" && x !== ""))].join(" ") ||
  undefined;`} />
      <p>
        <strong>Whitespace.</strong> Astro turns a line break between two elements into a space; JSX
        drops it. Where the space matters (inline text, <code>inline-block</code> boxes), put it back.
        This was the largest visual difference in the port: one widget shrank from 240 px to 162 px
        until the spaces came back.
      </p>
      <Code src={`<span class="num">{v}</span>{" "}<span class="unit">{u}</span>`} />

      <h2>4. Styles</h2>
      <ul>
        <li>
          <strong>Global CSS</strong>: import it from the layout (
          <code>import "../styles/base.css";</code>). It's linked as a stylesheet on every page under
          that layout. <code>@import</code> inside CSS works, both relative and from packages (
          <code>@import "lenis/dist/lenis.css";</code>): the build inlines it.
        </li>
        <li>
          <strong>A component's <code>&lt;style&gt;</code></strong>: move it to a sibling{" "}
          <code>.css</code> file and import it from the component. It becomes global, like{" "}
          <code>&lt;style is:global&gt;</code>. After the move:
          <ul>
            <li>
              Astro's scoping added one attribute to every selector. Without it, a rule can lose to a
              global one it used to beat. Raise its specificity where that happens.
            </li>
            <li>
              Scoped rules that targeted elements rendered by a child component never matched in
              Astro. As global CSS they suddenly apply. Delete them.
            </li>
            <li><code>:global(.x)</code> → <code>.x</code>.</li>
          </ul>
        </li>
        <li>
          <strong>CSS Modules</strong> (<code>x.module.css</code>,{" "}
          <code>import s from "./x.module.css"</code>, <code>{`class={s.card}`}</code>) scope like
          Astro does. They fit when nothing else (scripts, other components) selects those classes by
          name.
        </li>
        <li>
          <strong><code>define:vars</code> in <code>&lt;style&gt;</code></strong>: pass a{" "}
          <code>{`style={{ "--x": value }}`}</code> on the element instead.
        </li>
      </ul>

      <h2>5. The document: &lt;html&gt;, &lt;head&gt;, metadata</h2>
      <Code src={`// routes/_layout.tsx
import "../styles/tokens.css";
import "../styles/base.css";

export const htmlAttrs = { lang: "ja", "data-sheet-rev": "2026.08" }; // <html …>
export const bodyAttrs = { class: "site" };                           // <body …>
// Tags every page under this layout gets (favicon, theme-color, an inline boot script):
export const head = \`<link rel="icon" href="/favicon.png" />
<script>document.documentElement.dataset.theme = localStorage.theme ?? "light"</script>\`;
// Defaults for the pages' metadata:
export const meta = { openGraph: { siteName: "My site" }, twitter: { site: "@me" } };

export default function Layout({ children }: { children: unknown }) {
  return <div class="page">{children}</div>;
}`} />
      <Code src={`// routes/index.tsx
export const title = "Home";
export const meta = {
  description: "What this site is about.",
  canonical: true, // this page's URL on \`site\`
  openGraph: { image: { url: "/og/index.png", width: 1200, height: 630, alt: "…" } },
  twitter: { card: "summary_large_image" },
};`} />
      <ul>
        <li>
          With <code>site</code> set, <code>sitemap.xml</code> and <code>robots.txt</code> are
          generated unless <code>public/</code> or a route has them.{" "}
          <code>export const sitemap = false</code> leaves a page out.
        </li>
        <li>
          <code>&lt;script is:inline&gt;</code> in the head → the layout's (or a route's){" "}
          <code>head</code> string, as above.
        </li>
        <li>
          <code>{`<script is:inline define:vars={{ data }}>`}</code> in the body → a script element
          with the values serialized (escape <code>&lt;</code>, so data can't close the element):
        </li>
      </ul>
      <Code src={`<script dangerouslySetInnerHTML={{ __html: \`const data = \${JSON.stringify(data).replaceAll("<", "\\\\u003c")};\` }} />`} />

      <h2>6. Scripts</h2>
      <p>A bundled <code>&lt;script&gt;</code> (the default in Astro) becomes a page script:</p>
      <Code src={`// routes/_layout.tsx (or one route)
export const scripts = ["../scripts/main.ts"];`} />
      <ul>
        <li>
          It's bundled like an island: npm imports work (GSAP and its plugins, Lenis), and shared code
          becomes shared chunks. There is no <code>vite.optimizeDeps</code>.
        </li>
        <li>
          It loads as <code>&lt;script type="module"&gt;</code> with preloads, and counts toward the
          page's first-load JS and its <code>budget</code>.
        </li>
        <li>
          It runs once. If the site also has islands, Nowaki's client router takes over link clicks on
          those pages, and a script that sets up the DOM should also listen for{" "}
          <code>document.addEventListener("nowaki:page-load", setup)</code>. Pages without islands
          navigate with full loads, as in Astro.
        </li>
      </ul>
      <p>
        Interactive Preact components belong in <code>islands/</code> instead; they hydrate on their
        own (<code>client:visible</code>, <code>client:idle</code>, …).
      </p>

      <h2>7. Endpoints → file routes</h2>
      <Code src={`// routes/og/[card].png.ts → /og/index.png, /og/about.png
import { cards, renderCard } from "../../lib/og.ts";

export const staticPaths = () => cards.map((c) => ({ card: c.slug }));

export async function GET({ params, site, url }: { params: { card: string }; site?: URL; url: URL }) {
  const card = cards.find((c) => c.slug === params.card);
  if (!card) return new Response("not found", { status: 404 });
  return renderCard(card, (site ?? url).host); // a Uint8Array → image/png (from the extension)
}`} />
      <ul>
        <li>
          <code>getStaticPaths</code> returns <code>{`{ params, props }`}</code>;{" "}
          <code>staticPaths</code> returns params only, so look the data up from the params in{" "}
          <code>GET</code>.
        </li>
        <li>
          Return a string or bytes, typed by the route's extension (<code>.png</code>,{" "}
          <code>.xml</code>, <code>.json</code>, …), or a <code>Response</code>.{" "}
          <code>Astro.site</code> → <code>ctx.site</code>.
        </li>
        <li>
          Native packages (resvg, harfbuzz) run unchanged: file routes run in Node at build time.
        </li>
      </ul>

      <h2>8. Images and fonts</h2>
      <ul>
        <li>
          <code>&lt;Image&gt;</code> from <code>astro:assets</code> → <code>&lt;Image&gt;</code> from{" "}
          <code>@nowaki-dev/runtime/image</code>, with{" "}
          <code>import hero from "./hero.jpg?image"</code>. It renders AVIF plus the original format at
          several widths, with the file's own width and height. Local images in Markdown and MDX go
          through the same pipeline.
        </li>
        <li>
          Fonts: list them in <code>nowaki.config.mjs</code>. Google fonts are downloaded at build
          time; local files are copied. Each family gets a size-adjusted fallback (from{" "}
          <code>.ttf</code> / <code>.otf</code> metrics) and a <code>--font-…</code> variable.
        </li>
      </ul>
      <Code src={`fonts: [
  { family: "Inter", provider: "google", weights: [400, 700], subsets: ["latin"] },
  { family: "Geist Variable", src: "./fonts/geist.woff2", weight: "100 900" },
  { family: "Noto Sans JP", src: "./fonts/noto-jp.woff2", preload: false }, // large: no preload
]`} />
      <p>
        <code>preload</code> is on by default; turn it off for large CJK files. Local fonts aren't
        subset, so keep a subsetting step if the site has one.
      </p>

      <h2>9. Build and compare</h2>
      <Code src={`nowaki build --adapter static   # → dist/static`} />
      <p>
        Compare with the Astro <code>dist/</code>. A file list diff catches missing pages and assets.
        For layout, load both builds in a browser at a couple of widths and compare element boxes.
        That is how the whitespace and specificity differences above were found. New in the output:{" "}
        <code>sitemap.xml</code>, <code>robots.txt</code> (with <code>site</code>), and{" "}
        <code>_headers</code> (security headers for hosts that read it).
      </p>
      <p>
        A page that fails to render (a server error) fails the build, rather than leaving a hole in
        the static output.
      </p>

      <div class="note">
        The features used above are covered in <a href="/docs/content/">Content sites</a>. The full
        guide is <a href={GUIDE}>on GitHub</a>.
      </div>
    </>
  );
}
