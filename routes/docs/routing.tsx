import { DOCS_HEAD } from "../../lib/docs-style.ts";
import Code from "../../components/Code.tsx";

export const lang = "en";
export const title = "Nowaki docs · Routing & data";
export const head = DOCS_HEAD;

export default function Routing() {
  return (
    <>
      <h1>Routing &amp; data</h1>
      <p class="lead">
        File-based routes with nested layouts, middleware, server loaders, form actions, and API
        routes. If you've used Next.js or Remix, this will feel familiar.
      </p>
      <p>
        Route groups, slots, intercepting routes, i18n and config redirects are covered in{" "}
        <a href="/docs/larger-apps/">Routing for larger apps</a>.
      </p>

      <h2>File conventions</h2>
      <table>
        <tr><th>File</th><th>Maps to</th></tr>
        <tr><td><code>routes/index.tsx</code></td><td><code>/</code></td></tr>
        <tr><td><code>routes/about.tsx</code></td><td><code>/about</code></td></tr>
        <tr><td><code>routes/blog/[slug].tsx</code></td><td><code>/blog/:slug</code> (dynamic param)</td></tr>
        <tr><td><code>routes/files/[...path].tsx</code></td><td><code>/files/*</code> (catch-all; <code>params.path</code> is an array)</td></tr>
        <tr><td><code>routes/api/posts.ts</code></td><td><code>/api/posts</code> (handler, not a page)</td></tr>
        <tr><td><code>routes/_layout.tsx</code></td><td>Wraps pages in its directory (nests)</td></tr>
        <tr><td><code>routes/_middleware.ts</code></td><td>Runs before routes (nests)</td></tr>
        <tr><td><code>routes/_404.tsx</code> · <code>_500.tsx</code></td><td>Not-found / error pages (<code>_404</code> is also written as <code>404.html</code> by <code>nowaki prerender</code>)</td></tr>
      </table>
      <p>Static segments win over dynamic ones at the same depth, so <code>/users/me</code> beats <code>/users/[id]</code>, and a catch-all <code>[...path]</code> only matches once nothing more specific does.</p>

      <h2>Loaders run on the server</h2>
      <p>
        A route can export a <code>loader</code>. It runs only on the server (so secrets and DB
        access stay there) and its result is passed to the page as <code>data</code>.
      </p>
      <Code src={`// routes/blog/[slug].tsx
import type { LoaderContext, PageProps } from "@nowaki-dev/runtime";

export const loader = async ({ params }: LoaderContext) => ({
  post: await db.post(params.slug),   // server-only
});

export default function Post({ data }: PageProps<typeof loader>) {
  return <article><h1>{data.post.title}</h1></article>;   // data is fully typed
}`} />
      <p>
        The optional types ship with <code>@nowaki-dev/runtime</code>: <code>PageProps&lt;typeof
        loader&gt;</code> infers the page's <code>data</code> from the loader's return type, and{" "}
        <code>LoaderContext</code> types <code>params</code>, cookies, headers, and the request
        helpers. JavaScript routes work too; the types are there when you want them.
      </p>

      <h2>Actions handle mutations</h2>
      <p>
        A non-GET request runs the route's <code>action</code>. Return a <code>Response</code>,{" "}
        <code>ctx.redirect()</code> (Post/Redirect/Get), or data to re-render the page with.
      </p>
      <Code src={`// routes/guestbook.tsx
export async function action(ctx) {
  const form = await ctx.formData();
  ctx.setCookie("guestbook", add(form.get("msg")));
  return ctx.redirect("/guestbook");   // PRG
}`} />

      <h2>Layouts &amp; middleware nest</h2>
      <p>
        <code>_layout.tsx</code> wraps every page under its directory and composes from root to leaf.{" "}
        <code>_middleware.ts</code> runs before the route (root → leaf); return a <code>Response</code> to
        short-circuit, which is useful for auth, redirects, and response headers.
      </p>
      <Code src={`// routes/_middleware.ts
export default function (ctx) {
  if (ctx.url.pathname.startsWith("/admin") && !ctx.cookies.session) {
    return ctx.redirect("/login");
  }
  ctx.setHeader("x-frame-options", "DENY");
}`} />

      <h2>CSS <span class="badge">v0.16.1</span></h2>
      <p>
        CSS that a route, a layout, or a component they use imports is linked into the page. The
        build follows each page route's imports (the route, every <code>_layout</code> above it, and
        their components), writes each file once to <code>dist/client</code> as{" "}
        <code>&lt;name&gt;.&lt;hash&gt;.css</code>, and adds a{" "}
        <code>&lt;link rel="stylesheet"&gt;</code> to the page's <code>head</code>, layouts first. That
        holds for <code>nowaki start</code>, every adapter, <code>nowaki prerender</code> and streaming
        shells, and the SPA router swaps the links on client navigation. Under{" "}
        <code>nowaki dev</code> the links come from the dev server, and since 0.19 a changed
        stylesheet is swapped in without a reload (see <a href="/docs/quickstart/#hmr">HMR</a>).
      </p>
      <Code src={`// routes/_layout.tsx
import "../styles/site.css";          // linked on every page under this layout

// routes/blog/[slug].tsx
import styles from "./post.module.css"; // CSS Modules: scoped class names, linked too

// a plain .css import's default export is its text
import css from "./print.css";
export const head = \`<style>\${css}</style>\`;`} />
      <p>
        CSS Modules are scoped the same way as their class names, and CSS from packages is included.
      </p>

      <h2>API routes</h2>
      <p>
        Files under <code>routes/api/</code> are handlers. Export per-method functions
        (<code>GET</code>, <code>POST</code>, …) or a <code>default</code>; return a{" "}
        <code>Response</code> (streaming supported) or a value to JSON-encode. Unmatched methods get a
        405. Since 0.19, a cross-site POST, PUT, PATCH or DELETE gets 403 before the handler runs,
        as for page actions; see <a href="/docs/security/#cross-site-requests">Cross-site requests</a>{" "}
        for who is affected and <code>export const csrf = false</code>.
      </p>
      <Code src={`// routes/api/echo.ts
export const GET = (ctx) => ctx.json({ q: ctx.url.searchParams.get("q") });
export const POST = async (ctx) => ctx.json({ received: await ctx.bodyJson() });`} />

      <h2>Streaming SSR</h2>
      <p>
        Opt a route into streaming with <code>export const streaming = true</code>: loaders run first,
        then the shell is sent and the body streams in. Since 0.16, <code>nowaki dev</code> and{" "}
        <code>nowaki start</code> pass streamed responses (streaming pages, <code>ReadableStream</code>{" "}
        API responses, SSE) through as they are written; regular pages are still assembled whole.
      </p>
      <p>
        <code>export const streaming = "early"</code> <span class="badge">v0.16</span> sends the
        document shell before any loader runs, so the first byte doesn't wait for data. Once the shell
        is sent, the status and headers are fixed: <code>meta</code> sees only the static{" "}
        <code>title</code> and <code>head</code>, a loader redirect becomes a client-side{" "}
        <code>location.replace</code>, a loader error renders the nearest <code>error.tsx</code> with
        status 200, and cookies set by a loader are not sent. The shell always loads the islands
        runtime.
      </p>

      <h2>First-load JS budgets <span class="badge">v0.16</span></h2>
      <p>
        Every <code>nowaki build</code> and <code>nowaki prerender</code> prints the gzip size of the
        JavaScript each page route loads first (the islands runtime and its preloads, every client
        island the route and its layouts can render, and the live runtime), and writes it to{" "}
        <code>dist/route-js.json</code>. The lazy router chunk is not counted. A route can set a budget
        that fails the build when it goes over:
      </p>
      <Code src={`// routes/index.tsx
export const budget = { js: 12 };   // KB, gzip

// routes/about.tsx
export const budget = { js: 0 };    // this page ships no client JS`} />
      <p>
        The value is read from the AST and must be a number literal; a budget the build can't read fails
        the build instead of being ignored. The build also points out client islands that could ship no
        JS: ones that only keep state and handle click or form events (they could be live islands), and
        ones with no state or handlers (they could be plain components). <code>NOWAKI_HINTS=0</code>{" "}
        hides the hints.
      </p>

      <h2>Incremental static regeneration (ISR)</h2>
      <p>
        Export <code>revalidate</code> (seconds) and the rendered HTML is cached and served instantly,
        then regenerated in the background once it goes stale. The first request after the window gets
        the cached (stale) HTML while a fresh render runs, so no one waits on a slow loader.
      </p>
      <Code src={`// routes/blog/[slug].tsx
export const revalidate = 60;   // cache for 60s, then revalidate

export const loader = async ({ params }) => ({ post: await db.post(params.slug) });`} />
      <p>
        Under <code>nowaki start</code>, the Rust front keeps the cache in memory (single-flight
        revalidation, an <code>x-nowaki-cache: HIT&#8202;|&#8202;STALE&#8202;|&#8202;MISS</code> header
        per response). Nowaki also sends <code>Cache-Control: s-maxage, stale-while-revalidate</code>,
        so a CDN in front of the app, such as Vercel's, can cache the page too. Cloudflare doesn't
        cache what a Worker returns, so since 0.19 the cloudflare adapter's Worker keeps its own ISR
        cache (see <a href="#on-demand-revalidation">On-demand revalidation</a>). Since 0.16,{" "}
        <code>nowaki start</code> renders every ISR page once right after startup (static routes with a
        positive <code>revalidate</code>, plus the <code>staticPaths</code> of dynamic ones, capped at{" "}
        <code>NOWAKI_ISR_MAX</code>), so the first visitor already gets a cached page; route middleware
        and loaders run at boot, and <code>NOWAKI_ISR_WARM=0</code> turns it off. Responses
        that set a cookie are treated as per-user and never cached, so keep ISR pages free of
        request-specific data.
      </p>
      <p>
        What a render reads from the request decides how shared caches may keep it{" "}
        <span class="badge">v0.16.2</span>. A page whose render read <code>cookie</code>,{" "}
        <code>authorization</code>, every header, or the body is sent with{" "}
        <code>Cache-Control: private, no-cache</code>, so a CDN never serves one visitor's page to
        another. A page that read other headers stays <code>public, s-maxage</code> and names them in{" "}
        <code>Vary</code>. <code>streaming = "early"</code> pages send their headers before any
        loader runs, so they are never marked shareable.
      </p>

      <h2 id="on-demand-revalidation">On-demand revalidation <span class="badge">v0.19</span></h2>
      <p>
        <code>revalidatePath(path)</code> and <code>revalidateTag(tag)</code> from{" "}
        <code>@nowaki-dev/runtime</code> purge ISR pages before their <code>revalidate</code> window
        ends. <code>export const tags</code> tags a page: an array, or a function of{" "}
        <code>{`{ params, data }`}</code>. Purged pages are deleted, so the next request renders
        fresh. This post from <code>examples/gallery</code> is tagged <code>photos</code> and{" "}
        <code>photo:&lt;id&gt;</code>, and its caption action purges only that post:
      </p>
      <Code src={`// routes/posts/[id].tsx
import { revalidateTag } from "@nowaki-dev/runtime";
import { localePath } from "@nowaki-dev/runtime/navigation";

export const revalidate = 3600;
export const tags = ({ params }) => ["photos", \`photo:\${params.id}\`];

export async function action(ctx) {
  const id = String(ctx.params.id);
  setCaption(id, String((await ctx.formData()).get("caption") ?? "").trim());
  revalidateTag(\`photo:\${id}\`);   // this post, in every locale
  return ctx.redirect(localePath(\`/posts/\${id}\`, ctx.locale), 303);
}`} />
      <p>
        <code>revalidatePath</code> takes an app path, as in <code>&lt;Link href&gt;</code>, and
        purges every query and <code>Vary</code> variant, every locale, the basePath form, and both
        trailing-slash forms under <code>"ignore"</code>. Page actions and API routes now run inside
        the request context, so <code>getContext()</code> works there too.
      </p>
      <table>
        <tr><th>Where</th><th>What a call purges</th></tr>
        <tr><td><code>nowaki start</code></td><td>The in-memory ISR cache. Called from a page action, an API route, a server function or a live handler, the purge happens before that response is sent, so the redirect after an action already shows new content. Calls outside a request (or after its response was sent) reach the cache through the sidecar's stdout.</td></tr>
        <tr><td>vercel adapter</td><td>ISR pages send <code>Vercel-Cache-Tag</code> with their <code>tags</code> and their own path, and a call deletes those tags from Vercel's CDN (<code>dangerouslyDeleteByTag</code> from <code>@vercel/functions</code>) before the action's response goes out, waiting at most 2 s.</td></tr>
        <tr><td>cloudflare adapter</td><td><code>revalidatePath</code> deletes the page from the local data center's Cache API. With <code>CLOUDFLARE_ZONE_ID</code> and <code>CLOUDFLARE_API_TOKEN</code> set on the Worker, both calls also purge every data center by <code>Cache-Tag</code> through the zone purge API, waiting at most 2 s before the action's response.</td></tr>
        <tr><td><code>nowaki dev</code></td><td>Nothing: dev has no cache and only records the calls (the dev toolbar and the MCP endpoint list them).</td></tr>
        <tr><td>node, bun, deno adapters, static output</td><td>Nothing: they have no cache to purge, so the calls are a no-op (warned once).</td></tr>
      </table>
      <p>
        <strong>More than one <code>nowaki start</code> process.</strong> The ISR cache is per
        process. To fan a purge out, set <code>NOWAKI_REVALIDATE_SECRET</code> and send{" "}
        <code>POST /__nowaki/revalidate</code> to each instance. The endpoint is off (404) without
        the secret.
      </p>
      <Code src={`curl -X POST https://app.example.com/__nowaki/revalidate \\
  -H "Authorization: Bearer $NOWAKI_REVALIDATE_SECRET" \\
  -H "content-type: application/json" \\
  -d '{ "paths": ["/blog/hello"], "tags": ["posts"] }'`} />
      <p>
        <strong>Vercel.</strong> Add <code>@vercel/functions</code> to the app's dependencies; the
        build copies it into the function. Without it the tags are still sent (purge them from the
        dashboard or the REST API) and the first revalidate call warns once. Tags longer than
        Vercel's 256 bytes are sent as a hash.
      </p>
      <p>
        <strong>Cloudflare.</strong> The Worker now caches ISR pages in the Cache API of each data
        center. It stores the same pages <code>nowaki start</code> does: an{" "}
        <code>export const revalidate</code> render with status 200 and a shared{" "}
        <code>Cache-Control</code>. A page that reads cookies, the session or{" "}
        <code>authorization</code>, sets a cookie, or streams is never stored. Variants follow what
        the render read (headers and the query), stale pages are served while one background render
        (<code>ctx.waitUntil</code>) replaces them, <code>NOWAKI_CSP</code> re-nonces each cached
        response, and responses show <code>x-nowaki-cache: HIT</code> / <code>STALE</code> /{" "}
        <code>MISS</code>. The token needs the Cache Purge permission. Without the two variables (and
        on workers.dev, which has no zone) the purge is local only and <code>revalidateTag</code>{" "}
        clears nothing (warned once). The Cache API works on custom domains, not in the dashboard
        editor or previews. Apps without ISR pages run as before.
      </p>

      <h2>Static paths for dynamic routes <span class="badge">v0.13</span></h2>
      <p>
        <code>nowaki prerender</code> and the static adapter write every static route as it is. A
        dynamic <code>[param]</code> or <code>[...rest]</code> route is prerendered only when it
        exports <code>staticPaths</code>: an array of params, or a sync or async function that
        returns one. Each entry becomes one page, and the route's loader runs for it at build time.
      </p>
      <Code src={`// routes/blog/[slug].tsx
import type { StaticPaths } from "@nowaki-dev/runtime";

export const staticPaths: StaticPaths = async () =>
  (await db.posts()).map((p) => ({ slug: p.slug }));   // one page per post

// routes/files/[...path].tsx: a rest param takes an array
export const staticPaths = [{ path: ["docs", "intro"] }];   // → /files/docs/intro`} />
      <p>
        Dynamic routes without <code>staticPaths</code> are skipped, and values that would escape
        the output directory (<code>..</code>, <code>/</code>, an empty string) are rejected. Under{" "}
        <code>nowaki dev</code> and <code>nowaki start</code> the export is ignored and the route
        renders on request as usual.
      </p>

      <h2>Typed routes</h2>
      <p>
        <code>nowaki dev</code> and <code>nowaki build</code> generate{" "}
        <code>.nowaki/types.d.ts</code> from your <code>routes/</code> (or run <code>nowaki
        typegen</code>). It makes navigation type-safe: <code>route()</code> builds a dynamic href
        from typed params, and <code>&lt;Link&gt;</code> only accepts known paths.
      </p>
      <Code src={`import { route, Link } from "@nowaki-dev/runtime/navigation";

<Link href="/about">About</Link>                    // ok: known static route
<a href={route("/blog/[slug]", { slug })}>Post</a>   // ok: params typed & encoded

route("/blog/[slug]");          // ✗ missing params
route("/nope");                 // ✗ unknown route
<Link href="/typo" />           // ✗ not a route`} />
      <p>
        Catch-all params are arrays: <code>route("/files/[...path]", {`{ path: ["a", "b"] }`})</code>{" "}
        becomes <code>/files/a/b</code>. The generated file is gitignored; commit nothing.
      </p>

      <h2>Loading &amp; error UI, and the Router Cache</h2>
      <p>
        Pages with an island get a client router: internal links navigate by swapping the body and
        re-hydrating, so visited pages stay interactive. The router loads on intent{" "}
        <span class="badge">v0.17</span>: it starts loading when a same-origin link is hovered,
        focused, or touched, so first paint ships only the hydration runtime. A click that comes
        before it arrives is replayed as a client navigation once it loads. Three conventions shape that
        experience, and they mirror Next.js' <code>loading.tsx</code> / <code>error.tsx</code>.
      </p>
      <table>
        <tr><th>File</th><th>What it does</th></tr>
        <tr><td><code>routes/loading.tsx</code></td><td>Shown while a navigation is in flight (after ~150ms, so fast navigations don't flicker). Nests by directory.</td></tr>
        <tr><td><code>routes/error.tsx</code></td><td>Shown when a navigation fails. Gets <code>{`{ error, reset }`}</code>; the router fills any <code>data-nowaki-error</code> element with the message and wires <code>data-nowaki-reset</code> to retry.</td></tr>
      </table>
      <Code src={`// routes/error.tsx
import type { ErrorPageProps } from "@nowaki-dev/runtime";

export default function Error({ error, reset }: ErrorPageProps) {
  return (
    <div>
      <h1>Something went wrong</h1>
      <p data-nowaki-error>{error.message}</p>
      <button data-nowaki-reset onClick={reset}>Try again</button>
    </div>
  );
}`} />
      <p>
        The router also keeps a <strong>Router Cache</strong>: visited pages are held for ~30s (LRU),
        so back/forward and revisits are instant with no refetch. Tune it per app with{" "}
        <code>{`<meta name="nowaki-router-cache" content="60">`}</code> (seconds, <code>0</code> disables),
        and opt a single link out with <code>data-no-router</code>. If there's no <code>loading.tsx</code>,
        a slim top progress bar is shown instead; if there's no <code>error.tsx</code>, a minimal retry
        screen appears.
      </p>

      <h2 id="view-transitions">View Transitions <span class="badge">v0.19</span></h2>
      <p>
        The client router can run a navigation inside <code>document.startViewTransition</code>.
        It is opt-in:
      </p>
      <ul>
        <li><code>&lt;Link viewTransition&gt;</code>, or <code>data-nowaki-transition</code> on an <code>&lt;a&gt;</code> or on an element around links, does it for that navigation.</li>
        <li><code>export const viewTransition = true</code> on a route does it for every navigation to and from the page, and adds <code>@view-transition {`{ navigation: auto }`}</code>, so full page loads between such pages (zero-JS pages, static output) transition too.</li>
        <li>Slot modals (intercepting routes) transition the same way.</li>
      </ul>
      <p>
        <code>transitionName(name)</code> from <code>@nowaki-dev/runtime/navigation</code> returns a{" "}
        <code>style</code> with a valid <code>view-transition-name</code>, for an element that should
        morph into the next page's. In <code>examples/gallery</code> a post card's thumbnail and the
        post's photo share a name:
      </p>
      <Code src={`// routes/posts/index.tsx
import { Image } from "@nowaki-dev/runtime/image";
import { Link, route, transitionName } from "@nowaki-dev/runtime/navigation";

<Link viewTransition href={route("/posts/[id]", { id: photo.id })}>
  <Image src={photo.image} alt={photoTitle(photo)} width={120} style={transitionName(\`photo-\${photo.id}\`)} />
</Link>

// routes/posts/[id].tsx
<Image src={photo.image} alt={photoTitle(photo)} style={transitionName(\`photo-\${photo.id}\`)} />
<Link viewTransition href="/posts">All posts</Link>`} />
      <p>
        The transition carries the type <code>forward</code> or <code>back</code>. It is skipped when
        the browser lacks the API, the visitor prefers reduced motion, or the browser already
        animated a back gesture; the page is then swapped as before. Hydration, page scripts and{" "}
        <code>nowaki:page-load</code> run after the new page is in, and a navigation superseded
        during a transition swaps nothing. Pages without the export render byte-identical HTML, and
        the code is in the lazy router chunk, so first-load JS is unchanged.
      </p>
    </>
  );
}
