import { DOCS_HEAD } from "../../lib/docs-style.ts";
import Code from "../../components/Code.tsx";

export const lang = "en";
export const title = "Nowaki docs · Routing for larger apps";
export const head = DOCS_HEAD;

const GALLERY = "https://github.com/Tettu0530/nowaki/tree/main/examples/gallery";

export default function LargerApps() {
  return (
    <>
      <h1>Routing for larger apps <span class="badge">v0.18</span></h1>
      <p class="lead">
        Route groups, parallel and intercepting routes, <code>redirects</code> /{" "}
        <code>rewrites</code> / <code>headers</code> in nowaki.config, <code>basePath</code> and{" "}
        <code>trailingSlash</code>, i18n routing, sessions, typed environment variables, remote
        images, and Markdoc. Apps that use none of these pay nothing for them.
      </p>

      <div class="note">
        The reference app is <a href={GALLERY}><code>examples/gallery</code></a>: a photo gallery
        under <code>basePath: "/gallery"</code> in English and Japanese. A photo opens in a modal on
        client navigation and as a full page on reload, sign-in uses <code>ctx.session</code> behind
        an <code>(account)</code> route group, and <code>env.ts</code> stops the build without{" "}
        <code>GALLERY_ADMIN_PASSWORD</code>. The samples below come from it. Since 0.19.3 it also
        meets the v0.19 exit criteria under <code>/gallery/posts</code>: ISR posts tagged{" "}
        <code>photos</code> / <code>photo:&lt;id&gt;</code>, a signed-in caption edit that calls{" "}
        <code>revalidateTag</code>, a list-to-post View Transition with <code>transitionName()</code>{" "}
        on the photo, a Likes island for HMR, and a <code>budget</code> (see{" "}
        <a href="/docs/routing/#on-demand-revalidation">On-demand revalidation</a> and{" "}
        <a href="/docs/routing/#view-transitions">View Transitions</a>).
      </div>

      <h2>Route groups</h2>
      <p>
        A directory named <code>(name)</code> under <code>routes/</code> groups files without adding
        a URL segment: <code>routes/(marketing)/about.tsx</code> serves <code>/about</code>. The
        group's <code>_layout</code>, <code>loading</code> and <code>error</code> apply to the files
        inside it. Its <code>_middleware</code> runs for the routes whose files are inside the
        group, not by URL, so it doesn't run for 404s. Two files serving the same URL because of
        groups (<code>(a)/about.tsx</code> and <code>(b)/about.tsx</code>) fail the build. Names
        starting with <code>.</code> (<code>(.)</code>, <code>(..)</code>) are reserved.
      </p>
      <Code src={`// routes/(account)/_middleware.ts: runs only for the routes inside (account)
import type { LoaderContext } from "@nowaki-dev/runtime";
import { localePath } from "@nowaki-dev/runtime/navigation";

export default async function requireUser(ctx: LoaderContext) {
  const user = await ctx.session.get<string>("user");
  if (!user) return ctx.redirect(localePath("/login", ctx.locale));
  ctx.state.user = user;
}`} />

      <h2>Parallel routes</h2>
      <p>
        A directory named <code>@name</code> under <code>routes/</code> is a slot of the{" "}
        <code>_layout</code> in its parent directory, which gets it as <code>slots.name</code>{" "}
        (typed by <code>LayoutProps</code>). The slot's file matching the URL renders there, with
        its own <code>loader</code> and params, else its <code>default.tsx</code>, else{" "}
        <code>slots.name</code> is <code>null</code>. Slot files are never routes of their own.
      </p>
      <Code src={`// routes/_layout.tsx
import type { LayoutProps } from "@nowaki-dev/runtime";

export default function Layout({ children, slots }: LayoutProps) {
  return (
    <div class="shell">
      {children}
      {slots.modal}   {/* routes/@modal/ */}
    </div>
  );
}`} />

      <h2>Intercepting routes</h2>
      <p>
        A file in a slot whose path has a <code>(.)</code>, <code>(..)</code> or <code>(...)</code>{" "}
        segment takes over that URL on client navigation. In the gallery,{" "}
        <code>routes/@modal/(.)photo/[id].tsx</code> handles a click on{" "}
        <code>&lt;a href="/photo/1"&gt;</code>: the router fetches just that file and swaps it into{" "}
        <code>&lt;nowaki-slot name="modal"&gt;</code>, the URL becomes <code>/photo/1</code>, and the
        gallery and its islands stay. Back closes it, forward reopens it, and a reload or a direct
        visit renders the full <code>routes/photo/[id].tsx</code> page. The marker counts URL
        segments from its directory (groups and slots don't count): <code>(.)</code> the same level,{" "}
        <code>(..)</code> one up, <code>(...)</code> the root.
      </p>
      <table>
        <tr><th>File</th><th>Role</th></tr>
        <tr><td><code>routes/_layout.tsx</code></td><td>Renders <code>slots.modal</code></td></tr>
        <tr><td><code>routes/@modal/(.)photo/[id].tsx</code></td><td>The modal, on client navigation</td></tr>
        <tr><td><code>routes/@modal/default.tsx</code></td><td>Returns <code>null</code> when no modal is open</td></tr>
        <tr><td><code>routes/photo/[id].tsx</code></td><td>The full page, on reload or direct visit</td></tr>
      </table>

      <h2>Redirects, rewrites and headers</h2>
      <p>
        <code>redirects</code>, <code>rewrites</code> and <code>headers</code> in nowaki.config are
        arrays, or async functions called once at build. The config is validated at build, before
        anything is built. A redirect keeps the request's query. A rewrite is internal: the page
        renders the destination route while <code>ctx.url</code> stays the URL the browser asked
        for. Config headers go on every response (pages, ISR hits, assets, <code>public/</code>{" "}
        files, redirects, 404s) unless the route set the same header, and don't apply to{" "}
        <code>/__nowaki/*</code> endpoints.
      </p>
      <Code src={`// nowaki.config.mjs
export default {
  redirects: [{ source: "/photos/[id]", destination: "/photo/[id]", permanent: true }],
  headers: [{ source: "/login", headers: { "x-robots-tag": "noindex" } }],
};`} />
      <p>
        <strong>With <code>i18n</code>, rules are locale-aware</strong>{" "}
        <span class="badge">v0.18.1</span>. A rule's source matches the path without its locale
        prefix, so a <code>/login</code> rule matches <code>/login</code> and{" "}
        <code>/ja/login</code>. An internal redirect destination lands on that page in the request's
        locale (<code>/ja/old</code> → <code>/ja/new</code>; <code>/en/old</code> → <code>/new</code>{" "}
        without <code>prefixDefaultLocale</code>), and a rewrite keeps the request's locale prefix,
        so <code>ctx.locale</code> / <code>getLocale()</code> stay right after it. External
        destinations, and destinations that start with a locale themselves, are kept as written.{" "}
        <code>locale: false</code> on a rule matches the path with the locale prefix and leaves the
        destination as written. Without <code>i18n</code> nothing changes.
      </p>
      <Code src={`// nowaki.config.mjs
export default {
  i18n: { locales: ["en", "ja"], defaultLocale: "en" },
  redirects: [
    { source: "/old", destination: "/new" },                       // /ja/old → /ja/new
    { source: "/ja/legacy", destination: "/ja/", locale: false },  // matched as written
  ],
};`} />
      <p>Where they apply:</p>
      <ul>
        <li><code>nowaki dev</code>, <code>nowaki start</code>, the node / bun / deno / vercel adapters and the Cloudflare worker apply them in this order: basePath, trailing slash, redirects, rewrites, then assets, <code>public/</code> files and routes.</li>
        <li>On Vercel, redirects and headers are also emitted as platform routes in <code>config.json</code>.</li>
        <li>The static adapter writes <code>_redirects</code> (rewrites as 200 rules) and appends the headers to <code>_headers</code>, warning about rules a static host can't express.</li>
        <li>With <code>i18n</code>, Vercel gets one native redirect route per locale (plus the unprefixed one) and header routes with an optional locale segment. Static <code>_redirects</code> / <code>_headers</code> get a line or block per locale; a static host has no lookahead, so a source that starts with a parameter also matches locale-prefixed paths there (the build warns).</li>
      </ul>

      <h2>basePath and trailingSlash</h2>
      <p>
        With <code>basePath: "/app"</code> the whole app lives under <code>/app</code>: asset URLs,
        server function calls, <code>&lt;Link href="/about"&gt;</code> (rendered as{" "}
        <code>/app/about</code>), <code>ctx.redirect("/login")</code>, canonical and sitemap URLs,
        and the session cookie's <code>Path</code>. A plain <code>&lt;a&gt;</code> is left as
        written. <code>import.meta.env.BASE_URL</code> is <code>"/app/"</code>. Config rules are
        relative to the base.
      </p>
      <p>
        <code>href(path, {`{ locale, basePath }`})</code> <span class="badge">v0.18.1</span> from{" "}
        <code>@nowaki-dev/runtime/navigation</code> (and <code>@nowaki-dev/runtime</code>) returns a
        path as the browser requests it, built the way <code>&lt;Link&gt;</code> builds its href: the
        current locale, then the basePath. Use it for URLs <code>&lt;Link&gt;</code> doesn't build,
        such as a form <code>action</code>, <code>fetch</code> or <code>location</code>.{" "}
        <code>locale</code> picks another locale (<code>false</code>: no prefix), and{" "}
        <code>basePath: false</code> leaves the base out. It works on the server and in islands.{" "}
        <code>examples/gallery</code> uses it instead of reading <code>import.meta.env.BASE_URL</code>{" "}
        by hand.
      </p>
      <Code src={`// routes/posts/[id].tsx
import { href } from "@nowaki-dev/runtime/navigation";

<form method="post" action={href(\`/posts/\${photo.id}\`)}>   {/* /gallery/ja/posts/… on a Japanese page */}
  …
</form>

href("/logout");                    // with the current locale and the base
href("/about", { locale: "en" });   // another locale
href("/about", { locale: false });  // no locale prefix
href("/about", { basePath: false }); // no base`} />
      <p>
        <code>trailingSlash</code> is <code>"never"</code>, <code>"always"</code> or{" "}
        <code>"ignore"</code> (the default, which keeps the request's path). With <code>"never"</code> or{" "}
        <code>"always"</code>, servers redirect GET and HEAD with a 308. With{" "}
        <code>"never"</code> the static adapter writes <code>about.html</code> instead of{" "}
        <code>about/index.html</code>, and canonical URLs, <code>og:url</code> and{" "}
        <code>sitemap.xml</code> drop the slash.
      </p>

      <h2>i18n routing</h2>
      <p>
        With <code>i18n: {`{ locales: ["en", "ja"], defaultLocale: "en" }`}</code>, every locale
        except the default is a URL prefix (<code>/ja/about</code>); the default has none, and{" "}
        <code>/en/about</code> redirects (308) to <code>/about</code>. Routes stay locale-agnostic:
        middleware, layouts and the 404 page see <code>/about</code>. <code>ctx.locale</code> and{" "}
        <code>getLocale()</code> (in components and islands too) give the locale;{" "}
        <code>localePath(path, locale)</code> and <code>&lt;Link locale="ja"&gt;</code> build
        localized links.
      </p>
      <p>
        <strong><code>&lt;Link&gt;</code> keeps the current locale</strong>{" "}
        <span class="badge">v0.18.1</span>: on <code>/ja/x</code>,{" "}
        <code>&lt;Link href="/about"&gt;</code> renders <code>/ja/about</code>. An href that already
        has a locale prefix keeps it, <code>locale="en"</code> switches as before, and{" "}
        <code>locale={"{false}"}</code> leaves the href as written (the base is still added). The
        server reads the request's locale and the browser reads{" "}
        <code>&lt;html data-nowaki-i18n&gt;</code>, so both render the same href. Without{" "}
        <code>i18n</code> nothing changes.
      </p>
      <ul>
        <li>Pages get <code>&lt;html lang&gt;</code> from the locale. When <code>site</code> is set, they get <code>&lt;link rel="alternate" hreflang&gt;</code> for every locale plus <code>x-default</code>, and sitemap.xml lists every locale.</li>
        <li>In content collections, a first-level directory named after a locale (<code>content/blog/ja/hello.md</code>) sets <code>entry.locale</code>. <code>getCollection</code> / <code>getEntry</code> return the current locale's entries unless given <code>{`{ locale: "ja" }`}</code> or <code>{`{ locale: "*" }`}</code>.</li>
        <li><code>staticPaths</code> runs once per locale, given <code>{`{ locale }`}</code>.</li>
        <li><code>prefixDefaultLocale: true</code> prefixes the default locale too.</li>
      </ul>
      <p>
        <code>i18n.detect: true</code> is opt-in. A GET or HEAD of <code>/</code> (or the{" "}
        <code>basePath</code>) picks a locale from <code>Accept-Language</code> and redirects (307)
        to that locale's root. A <code>nowaki_locale</code> cookie naming a configured locale wins
        over the header. <code>setLocale(locale)</code> sets it, and so does a click on a{" "}
        <code>&lt;Link locale&gt;</code> inside an island. Other URLs are never redirected.
      </p>
      <Code src={`// islands/LanguageSwitcher.tsx
import { getLocale, Link, type Href } from "@nowaki-dev/runtime/navigation";
import { locales } from "../lib/i18n.ts";

export default function LanguageSwitcher({ path }: { path: Href }) {
  const current = getLocale();
  return (
    <span class="lang">
      {locales.map(({ code, label }) =>
        code === current ? (
          <strong key={code} aria-current="true">{label}</strong>
        ) : (
          <Link key={code} href={path} locale={code}>{label}</Link>
        ),
      )}
    </span>
  );
}`} />
      <p>
        Static output can't negotiate: the build warns about <code>detect</code> and{" "}
        <code>/</code> serves the default locale. The static adapter still writes each locale under
        its prefix with its own <code>404.html</code>.
      </p>

      <h2>Sessions</h2>
      <p>
        <code>ctx.session</code> (and <code>getContext().session</code> in server functions) keeps
        JSON values per visitor: <code>get</code>, <code>set</code>, <code>delete</code>,{" "}
        <code>regenerate()</code> (call it on sign-in) and <code>destroy()</code>. By default they
        live in an AES-256-GCM encrypted cookie (<code>HttpOnly; SameSite=Lax</code>, 4 KB at
        most). With a <code>store</code> in an optional <code>session.ts</code>, they live server-side
        behind a signed random id. It uses WebCrypto only, so it works on every adapter.
      </p>
      <ul>
        <li>Keys come from <code>NOWAKI_SESSION_SECRET</code>; comma-separate several to rotate keys. Production throws on the first <code>ctx.session</code> without it, and dev generates <code>.nowaki/session-secret</code>.</li>
        <li>A cross-site non-GET request sees an empty, read-only session.</li>
        <li>A page that reads <code>ctx.session</code> can't be prerendered: static output fails with the page named.</li>
      </ul>
      <Code src={`// routes/login.tsx
import type { LoaderContext } from "@nowaki-dev/runtime";
import { env } from "@nowaki-dev/runtime/env/server";
import { localePath } from "@nowaki-dev/runtime/navigation";

export async function action(ctx: LoaderContext) {
  const form = await ctx.formData();
  if (form.get("password") !== env.GALLERY_ADMIN_PASSWORD) {
    ctx.status(401);
    return { error: true };
  }
  await ctx.session.regenerate();
  await ctx.session.set("user", "admin");
  return ctx.redirect(localePath("/account", ctx.locale));
}`} />

      <h2>Typed environment variables</h2>
      <p>
        Declare variables in <code>env.ts</code> at the app root with{" "}
        <code>defineEnv({`{ server, public }`})</code>, each with a Standard Schema (Zod, Valibot,
        ArkType). <code>nowaki build</code>, <code>dev</code> and <code>prerender</code> validate
        the environment first and fail on a missing or invalid variable, naming it but never printing
        its value. <code>nowaki start</code>, the node / bun / deno / vercel adapters and the dev
        renderer validate again at startup and refuse to start; the Cloudflare worker validates its
        vars and secrets before the first request and answers 500 until they are fixed.
        Server code reads <code>env.X</code> from <code>@nowaki-dev/runtime/env/server</code>;
        client code that imports that module fails the build. Public names start with{" "}
        <code>PUBLIC_</code> and are inlined as <code>import.meta.env.PUBLIC_*</code>.
      </p>
      <Code src={`// env.ts
import { defineEnv } from "@nowaki-dev/runtime/env";
import { z } from "zod";

export default defineEnv({
  server: {
    GALLERY_ADMIN_PASSWORD: z.string().min(1),
    NOWAKI_SESSION_SECRET: z.string().min(32),
  },
  public: {
    PUBLIC_GALLERY_TITLE: z.string().default("Sirocco"),
  },
});`} />

      <h2>Remote images</h2>
      <p>
        A remote <code>?image</code> import is fetched at build time and optimized like a local one,
        when an <code>images.remotePatterns</code> entry in nowaki.config allows the URL. A
        disallowed import fails the build. Nothing is fetched at runtime. Downloads are cached and
        refused for private, loopback and link-local addresses, redirects outside the patterns,
        bodies over 20 MB, responses slower than 15 s, and anything but PNG, JPEG, WebP or GIF.
      </p>
      <Code src={`import hero from "https://images.example.com/photos/a.jpg?image";`} />

      <h2>Markdoc</h2>
      <p>
        With the <code>@nowaki-dev/markdoc</code> plugin, a <code>.mdoc</code> file compiles to a
        Preact module at build and dev time. It exports the rendered document,{" "}
        <code>frontmatter</code> and <code>headings</code>. Capitalized tags render exports of the{" "}
        <code>components</code> module, islands included. Validation errors fail the build.{" "}
        <code>.mdoc</code> files can be content entries; they are not routes.
      </p>
      <Code src={`// nowaki.config.mjs
import { markdoc } from "@nowaki-dev/markdoc";

export default {
  plugins: [
    markdoc({
      components: "./markdoc/components.tsx",
      tags: {
        callout: { render: "Callout", attributes: { type: { type: String, matches: ["note", "warning"] } } },
      },
    }),
  ],
};`} />
    </>
  );
}
