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

      <h2>API routes</h2>
      <p>
        Files under <code>routes/api/</code> are handlers. Export per-method functions
        (<code>GET</code>, <code>POST</code>, …) or a <code>default</code>; return a{" "}
        <code>Response</code> (streaming supported) or a value to JSON-encode. Unmatched methods get a
        405.
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
        so the same page gets ISR for free on a CDN or edge adapter (Cloudflare, Vercel). Since 0.16,{" "}
        <code>nowaki start</code> renders every ISR page once right after startup (static routes with a
        positive <code>revalidate</code>, plus the <code>staticPaths</code> of dynamic ones, capped at{" "}
        <code>NOWAKI_ISR_MAX</code>), so the first visitor already gets a cached page; route middleware
        and loaders run at boot, and <code>NOWAKI_ISR_WARM=0</code> turns it off. Responses
        that set a cookie are treated as per-user and never cached, so keep ISR pages free of
        request-specific data.
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
        re-hydrating, so visited pages stay interactive. The router loads <em>after</em> first paint
        (on idle), so it never weighs down initial load: first paint ships only the hydration
        runtime, and the navigation machinery streams in behind it. Three conventions shape that
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
    </>
  );
}
