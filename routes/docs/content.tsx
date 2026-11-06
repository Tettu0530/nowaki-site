import { DOCS_HEAD } from "../../lib/docs-style.ts";
import Code from "../../components/Code.tsx";

export const lang = "en";
export const title = "Nowaki docs · Content sites";
export const head = DOCS_HEAD;

export default function Content() {
  return (
    <>
      <h1>Content sites <span class="badge">v0.17</span></h1>
      <p class="lead">
        Typed content collections in Markdown and MDX, build-time code highlighting, responsive
        images, SEO metadata with a generated sitemap, self-hosted fonts, <code>public/</code>, file
        routes, page scripts, and <code>&lt;html&gt;</code> attributes.
      </p>

      <h2>Content collections</h2>
      <p>
        Each directory under <code>content/</code> is a collection, declared in{" "}
        <code>content/config.ts</code> with <code>defineCollection({`{ schema }`})</code>. Any
        Standard Schema library works (zod, valibot, arktype). Entries are Markdown files with YAML
        frontmatter, or <code>.json</code> / <code>.yaml</code> data files (<code>type: "data"</code>).
      </p>
      <Code src={`// content/config.ts
import { defineCollection } from "@nowaki-dev/runtime/content";
import { z } from "zod";

export const docs = defineCollection({
  schema: z.object({ title: z.string(), order: z.number() }),
});

// routes/docs/[slug].tsx
import { getCollection, getEntry } from "@nowaki-dev/runtime/content";

export const staticPaths = async () =>
  (await getCollection("docs")).map((d) => ({ slug: d.slug }));

export const loader = async (ctx) => {
  const doc = await getEntry("docs", String(ctx.params.slug));
  return { title: doc.data.title, html: doc.html, headings: doc.headings };
};`} />
      <ul>
        <li>
          Loaders and <code>staticPaths</code> read entries with{" "}
          <code>getCollection(name, filter?)</code> and <code>getEntry(name, slug)</code> from{" "}
          <code>@nowaki-dev/runtime/content</code>.
        </li>
        <li>
          Markdown is rendered at build time, in Rust (comrak): GFM tables, task lists,
          strikethrough, footnotes, autolinks. Every heading gets an anchor id, and{" "}
          <code>headings</code> lists them for a table of contents.
        </li>
        <li>
          Frontmatter is checked against the schema when the app is built and when the server
          starts. An invalid entry fails the build, listing each problem as{" "}
          <code>content/blog/x.md: title: …</code>. In <code>nowaki dev</code>, a change under{" "}
          <code>content/</code> re-renders on the next request, and errors show in the error overlay.
        </li>
        <li>
          Typegen adds the collections to <code>.nowaki/types.d.ts</code>, so entries are typed by
          their schema's output.
        </li>
        <li>
          Collections work on <code>nowaki start</code>, the node / bun / deno / vercel adapters,{" "}
          <code>nowaki prerender</code> (<code>staticPaths</code> can call{" "}
          <code>getCollection</code>), and Cloudflare, where the content is inlined into the worker.
        </li>
      </ul>

      <h2>MDX</h2>
      <p>
        <code>.mdx</code> files are pages (<code>routes/guide.mdx</code>) and content entries (
        <code>content/docs/x.mdx</code>): Markdown with JSX, <code>{`{expressions}`}</code>, and{" "}
        <code>import</code> / <code>export</code>. They are parsed in Rust (markdown-rs: CommonMark,
        GFM, MDX) and compiled to TSX, so no JavaScript runs to compile them. Imported components and
        islands work as in TSX. Fenced code is highlighted, local images go through{" "}
        <code>&lt;Image&gt;</code>, and each module exports <code>headings</code>.
      </p>
      <p>
        An MDX entry's frontmatter is validated like a Markdown entry's. <code>entry.render()</code>{" "}
        returns <code>{`{ Content, headings }`}</code>; render <code>&lt;Content /&gt;</code> where a
        Markdown entry uses <code>html</code>. YAML frontmatter in an <code>.mdx</code> page is
        ignored; pages use <code>export const</code> (<code>title</code>, <code>meta</code>, …).
      </p>

      <h2>Code highlighting</h2>
      <p>
        Fenced code blocks with a language (<code>```tsx</code>) in Markdown and MDX are highlighted
        at build time in Rust with syntect. The colors are inline styles, so no client JS or theme CSS
        is needed, and an enforced CSP allows them. The theme is <code>InspiredGitHub</code> (light).
        Syntaxes come from two-face (bat's set), which adds TypeScript / TSX, Vue, Svelte, TOML, and
        more. A block without a language, or with an unknown one, stays plain escaped text.
        Highlighted code is cached on disk in <code>node_modules/.cache/nowaki/highlight</code>.
      </p>

      <h2>Images</h2>
      <p>
        <code>import hero from "./hero.jpg?image"</code> gives the image's size and generated
        variants. <code>&lt;Image&gt;</code> from <code>@nowaki-dev/runtime/image</code> renders a{" "}
        <code>&lt;picture&gt;</code> with them.
      </p>
      <Code src={`import { Image } from "@nowaki-dev/runtime/image";
import hero from "./hero.jpg?image";
import thumb from "./thumb.jpg?w=400,800&image";

<Image src={hero} alt="The harbor at dawn" />`} />
      <ul>
        <li>
          Variants: AVIF, then the original format (JPEG / PNG / WebP) as the fallback. Widths are
          640, 960, 1280, and 1920 below the original, plus the original (at most 2560); nothing is
          upscaled. <code>?w=400,800&amp;image</code> picks the widths, and <code>q=</code> the AVIF
          quality (default 60).
        </li>
        <li>
          <code>width</code> / <code>height</code> come from the file, so there is no layout shift.{" "}
          <code>loading="lazy"</code> and <code>decoding="async"</code> are the defaults, and{" "}
          <code>sizes</code> defaults to the rendered width.
        </li>
        <li>
          Every variant is cached in <code>node_modules/.cache/nowaki/images</code>. In dev, variants
          are encoded on first request at <code>/__nowaki/image</code>.
        </li>
        <li>
          In a content entry, <code>![alt](./hero.jpg "title")</code> becomes the same{" "}
          <code>&lt;picture&gt;</code>, resolved relative to the entry. A missing file fails the
          build. Root-relative (<code>/logo.svg</code>, from <code>public/</code>) and remote URLs
          stay as written.
        </li>
      </ul>

      <h2>SEO and metadata</h2>
      <p>
        <code>site</code> in <code>nowaki.config</code> (or <code>NOWAKI_SITE</code>, which wins) is
        the site's URL. Loaders, <code>meta()</code>, and file routes read it as{" "}
        <code>ctx.site</code>. A typed <code>meta</code> writes the head tags:{" "}
        <code>description</code>, <code>canonical</code> (<code>true</code> for this page),{" "}
        <code>robots</code>, <code>openGraph</code>, <code>twitter</code>, and <code>jsonLd</code>.
        Use <code>export const meta = {`{...}`}</code>, or a <code>meta()</code> function of the
        loader data.
      </p>
      <Code src={`// routes/index.tsx
export const title = "Home";
export const meta = {
  description: "What this site is about.",
  canonical: true,
  openGraph: { image: { url: "/og/index.png", width: 1200, height: 630, alt: "…" } },
  twitter: { card: "summary_large_image" },
};`} />
      <ul>
        <li>
          Relative URLs resolve against the site, and Open Graph / Twitter fall back to the page's
          title and description. JSON-LD can't close its <code>&lt;script&gt;</code>.
        </li>
        <li>
          A layout's <code>meta</code> object sets defaults for the pages under it;{" "}
          <code>openGraph</code> and <code>twitter</code> merge one level deep.
        </li>
        <li>
          With a site, <code>sitemap.xml</code> (every page, including dynamic ones from{" "}
          <code>staticPaths</code>) and <code>robots.txt</code> are generated, unless a route or a{" "}
          <code>public/</code> file provides them. <code>export const sitemap = false</code> leaves a
          page out, and so does a static <code>meta.robots</code> of noindex.
        </li>
        <li>
          In the static output, canonical URLs, the default <code>og:url</code>, and{" "}
          <code>sitemap.xml</code> give page URLs a trailing slash (<code>/docs/a/</code>), matching
          the files it writes. Servers keep the route's own path.
        </li>
      </ul>

      <h2>Self-hosted fonts</h2>
      <p>
        List fonts under <code>fonts</code> in <code>nowaki.config</code>; they are built at build
        time.
      </p>
      <Code src={`// nowaki.config.mjs
export default {
  site: "https://example.com",
  fonts: [
    { family: "Inter", provider: "google", weights: [400, 700], subsets: ["latin"] },
    { family: "Brand", src: "./fonts/brand.ttf" },
  ],
};`} />
      <ul>
        <li>
          Google fonts are downloaded once and served from the site, so pages never request a
          third-party host. There is one woff2 per subset with its <code>unicode-range</code>, so a
          page loads only the subsets it uses. Downloads are cached. Local fonts are copied as they
          are.
        </li>
        <li>
          Each face gets a hashed file and an <code>@font-face</code> (<code>font-display: swap</code>{" "}
          by default).
        </li>
        <li>
          Each family gets a fallback face (local Arial / Times New Roman / Courier New, chosen by{" "}
          <code>fallback</code>) whose <code>size-adjust</code> and ascent / descent / line-gap
          overrides come from the font's own metrics, so text doesn't shift when the font arrives.
        </li>
        <li>
          <code>--font-&lt;family&gt;</code> (or <code>variable</code>) holds the stack, as in{" "}
          <code>font-family: var(--font-inter)</code>.
        </li>
        <li>
          Every page gets the stylesheet and <code>&lt;link rel="preload"&gt;</code> for the latin,
          upright faces. <code>preload: false</code> turns the preloads off for a family.
        </li>
      </ul>

      <h2>public/</h2>
      <p>
        Files in <code>public/</code> are served as-is at their own path:{" "}
        <code>public/robots.txt</code> → <code>/robots.txt</code>. There is no transform. Under{" "}
        <code>nowaki start</code> and the node / bun / deno adapters they are sent with{" "}
        <code>cache-control: public, no-cache</code> and an ETag (304 when unchanged), since the names
        aren't hashed. A public file wins over a route at the same path. Dotfiles and dot-directories
        are left out, except <code>.well-known/</code>. A file under <code>public/_nowaki/</code> or{" "}
        <code>public/__nowaki/</code> is a build error.
      </p>

      <h2>File routes</h2>
      <p>
        A route whose last segment has an extension returns a file instead of a page:{" "}
        <code>routes/feed.xml.ts</code> → <code>/feed.xml</code>, and{" "}
        <code>routes/og/[card].png.ts</code> → <code>/og/intro.png</code>. Like an API route, it
        exports <code>GET</code> (or a default handler). A returned string or{" "}
        <code>Uint8Array</code> is the body, with the Content-Type of the extension; a{" "}
        <code>Response</code> is sent as it is, and objects are JSON.
      </p>
      <p>
        <code>nowaki build --adapter static</code> writes file routes to their own path, binary
        included. Static ones are always written; dynamic ones are written from{" "}
        <code>export const staticPaths</code>. <code>export const prerender = false</code> skips one.
        A page file's name can't end in a dot followed by letters or digits (<code>v1.2.tsx</code>);
        name such a page <code>v1.2/index.tsx</code>.
      </p>

      <h2>Page scripts</h2>
      <p>
        A route or layout can ship plain browser modules with no island, like Astro's{" "}
        <code>&lt;script&gt;</code>. Each module is bundled like an island, npm imports included, and
        loaded as <code>&lt;script type="module"&gt;</code>. It never runs on the server.
      </p>
      <Code src={`// routes/_layout.tsx
export const scripts = ["../scripts/hero.ts"];

// scripts/hero.ts
function setup() { /* find elements, attach handlers */ }
setup();
document.addEventListener("nowaki:page-load", setup);`} />
      <ul>
        <li>
          The list is read at build time, so it must be an array of string literals (relative paths
          or package names). An unreadable list or a missing module fails the build.
        </li>
        <li>
          Layouts' scripts come first, and duplicates load once. Scripts count in the route's
          first-load JS and <code>budget</code>.
        </li>
        <li>
          On client navigation the SPA router loads the new page's scripts and then dispatches{" "}
          <code>nowaki:page-load</code> on <code>document</code>. A module runs once, so a script that
          sets up the DOM should also listen for that event.
        </li>
      </ul>

      <h2>&lt;html&gt; and &lt;body&gt; attributes</h2>
      <p>
        A route or layout can <code>export const htmlAttrs</code> / <code>bodyAttrs</code>, and{" "}
        <code>meta()</code> can return them too:{" "}
        <code>{`export const htmlAttrs = { "data-theme": "paper" }`}</code>. Layouts apply first (root
        to leaf), then the route, then <code>meta()</code>. A later value wins, <code>false</code> /{" "}
        <code>null</code> removes one set earlier, <code>class</code> values are joined, and{" "}
        <code>true</code> renders a bare attribute. Values are escaped, and <code>on*</code>{" "}
        attributes are ignored. <code>export const lang</code> still sets <code>lang</code>. The SPA
        router swaps only the attributes the server set, so ones that client code added stay.
      </p>

      <div class="note">
        Moving a static Astro site? The <a href="/docs/migrate-astro/">Astro migration guide</a> maps
        components, styles, scripts, endpoints, images, and fonts to these features.
      </div>
    </>
  );
}
