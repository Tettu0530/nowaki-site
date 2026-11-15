import { DOCS_HEAD } from "../../lib/docs-style.ts";
import { GH } from "../../lib/i18n.ts";

export const lang = "en";
export const title = "Nowaki docs · Stability & support";
export const head = DOCS_HEAD;

// Kept in line with docs/STABILITY.md, SUPPORT.md, SECURITY.md and GOVERNANCE.md at v0.20.0 in
// Tettu0530/nowaki. The upstream SUPPORT.md table still says "0.19.3 today"; the latest 0.x is 0.20.0.
export default function Stability() {
  return (
    <>
      <h1>Stability &amp; support <span class="badge">v0.20</span></h1>
      <p class="lead">
        0.20.0 froze the public API. It is the last release that may break it; from 1.0.0 on, it
        changes only in a new major. This page says what is covered, what counts as breaking, and
        which releases get fixes.
      </p>

      <h2 id="road-to-1-0">Road to 1.0</h2>
      <ol>
        <li><strong>0.20.0</strong> made the last breaking changes and froze the surface below. CI now fails on a change to the <code>api/</code> snapshots that removes or changes an entry, unless the pull request has the <code>breaking</code> label and targets the next major.</li>
        <li><strong><code>1.0.0-rc.N</code></strong> release candidates follow on the npm <code>next</code> tag, every shared package at the same version. Only fixes, docs and performance work land.</li>
        <li>The candidate phase ends after at least 14 days with no change to the <code>api/</code> snapshots since the last candidate, with real apps on it and CI green on every OS. A snapshot change cuts a new candidate and restarts the 14 days.</li>
        <li><strong>1.0.0</strong> is released. The 1.0 performance targets are measured on the last candidate and published with their numbers; a missed target is reported, not a blocker.</li>
      </ol>
      <p>
        Until 1.0.0 the 0.x rule applies: a minor may break, a patch does not. Run{" "}
        <code>npx nowaki upgrade --check</code> in an app to list what it must change for the
        latest release (see <a href="/docs/quickstart/#upgrading-to-0-20">Upgrading to 0.20</a>).
      </p>

      <h2>Versions</h2>
      <p>
        <code>nowaki</code> (the CLI), <code>@nowaki-dev/runtime</code> and{" "}
        <code>create-nowaki</code> share one version and are released together. Use the same
        version of the CLI and the runtime in an app: the CLI refuses a runtime that is older than
        itself or of another major (on 0.x, another minor). Release candidates order as SemVer
        says, so a 1.0.0 CLI refuses a 1.0.0-rc runtime. <code>@nowaki-dev/markdoc</code> follows
        semver on its own line (0.2.0 now, 1.0.0 with Nowaki 1.0). The <code>nowaki-core</code>{" "}
        crate is the CLI's engine, not a supported API.
      </p>

      <h2 id="frozen">What is frozen</h2>
      <p>Everything public. There is no experimental tier: a public feature is either covered or listed as not covered.</p>
      <table>
        <tr><th>Area</th><th>Covered</th></tr>
        <tr><td>Runtime exports</td><td>Every name and type in the <code>.d.ts</code> files of <code>@nowaki-dev/runtime</code> and its documented subpaths (<code>./navigation</code>, <code>./content</code>, <code>./image</code>, <code>./env</code>, <code>./env/server</code>, <code>./session</code>, <code>./config</code>), Jetstream and the plugin API included.</td></tr>
        <tr><td>Route and island exports</td><td><code>default</code>, <code>loader</code>, <code>action</code>, the uppercase method exports, <code>meta</code>, <code>head</code>, <code>revalidate</code>, <code>tags</code>, <code>streaming</code>, <code>csrf</code>, <code>budget</code>, <code>viewTransition</code>, <code>live</code>, the <code>client:*</code> directives and the rest, as typed by <code>PageModule</code>, <code>LayoutModule</code>, <code>ApiModule</code>, <code>MiddlewareModule</code> and <code>IslandModule</code>.</td></tr>
        <tr><td>File conventions</td><td><code>routes/</code> file routing, <code>_layout</code>, <code>_middleware</code>, <code>_404</code>, <code>_500</code>, <code>loading</code>, <code>error</code>, <code>(group)</code>, <code>@slot</code>, the intercepts, <code>islands/</code>, <code>content/</code>, <code>public/</code>, <code>env.ts</code>, <code>session.ts</code>, <code>nowaki.config</code>. Other <code>_*</code> names under <code>routes/</code> are reserved.</td></tr>
        <tr><td><code>nowaki.config</code></td><td><code>site</code>, <code>fonts</code>, <code>basePath</code>, <code>trailingSlash</code>, <code>redirects</code>, <code>rewrites</code>, <code>headers</code>, <code>i18n</code>, <code>images</code>, <code>plugins</code> and their documented nested keys; any other key is an error.</td></tr>
        <tr><td>CLI</td><td><code>dev</code>, <code>build</code>, <code>start</code>, <code>prerender</code>, <code>upgrade</code>, <code>typegen</code>, their flags and defaults, and a failed build's exit code. Servers listen on <code>PORT</code>, else 3000.</td></tr>
        <tr><td>Environment, endpoints, headers</td><td>The <code>NOWAKI_*</code> settings you set, <code>GET /__nowaki/health</code>, <code>POST /__nowaki/revalidate</code>, the default security and cache headers, and the documented cookies.</td></tr>
        <tr><td>Client events and attributes</td><td><code>nowaki:page-load</code>, <code>nowaki:action</code>, the <code>nowaki:live-*</code> and <code>nowaki:presence</code> events, <code>data-live*</code>, <code>data-nowaki-transition</code> and the other documented attributes.</td></tr>
        <tr><td>Adapters</td><td>The deploy contract of <code>node</code>, <code>static</code>, <code>bun</code>, <code>deno</code>, <code>cloudflare</code> and <code>vercel</code>: output paths, start command and the variables each reads.</td></tr>
        <tr><td>Observability</td><td>The JSON log fields and the documented OpenTelemetry span names and attributes (new ones may be added).</td></tr>
      </table>
      <p>
        The exact list is the checked-in <a href={`${GH}/tree/main/api`}><code>api/</code> snapshots</a>.
      </p>

      <h2>Not covered</h2>
      <ul>
        <li><code>@nowaki-dev/runtime/client/*</code> and <code>/server/*</code>, which exist for generated code.</li>
        <li>The wire protocols between the client, the Rust front and the sidecars (<code>/__nowaki/fn</code>, <code>/__nowaki/live</code> and the other internal paths, <code>x-nowaki-*</code> headers, HMR messages).</li>
        <li>Other generated markup (<code>&lt;nowaki-island&gt;</code>, other <code>data-nowaki-*</code> attributes, inline script contents) and the layout of <code>dist/</code> beyond the deploy contract.</li>
        <li>Error and log message text, and the human-readable build report.</li>
        <li>Dev-only tools: the dev MCP tools, the dev toolbar and its data.</li>
        <li>Performance. Speed and size are not part of the contract; a regression is a bug, fixed in a patch.</li>
      </ul>

      <h2>What counts as breaking</h2>
      <p>
        A change is breaking when an app that worked on the previous 1.x release would stop working,
        stop type-checking, or behave differently without changing its code: removing or renaming
        anything frozen, a type change that breaks code which type-checked, a changed default (CSRF
        checks, security headers, cache headers, body limits, the CLI's port and host), changed
        documented HTML or headers, a change to which tags get the CSP nonce that blocks content,
        or a changed deploy contract. Additions are not breaking.
      </p>
      <p>
        <strong>Security exception.</strong> A change that closes a vulnerability or tightens a
        default defense may land in a minor, or in a patch with an advisory, even if it breaks some
        apps. It comes with an upgrade note, an opt-out where one is safe, and a row in{" "}
        <a href={`${GH}/blob/main/SECURITY.md`}>SECURITY.md</a>. The API-route CSRF check in 0.19.3
        is an example.
      </p>

      <h2>Deprecation and versioning</h2>
      <p>
        A frozen feature is removed only in a major, after a 1.x minor deprecated it: it is marked{" "}
        <code>@deprecated</code> in the types with its replacement, using it logs one warning per
        route module, and the CHANGELOG lists it. It keeps working until the next major.
      </p>
      <table>
        <tr><th>Release</th><th>May contain</th></tr>
        <tr><td>Patch (<code>1.0.x</code>)</td><td>Bug fixes, security fixes, docs. No new public surface.</td></tr>
        <tr><td>Minor (<code>1.x.0</code>)</td><td>Additions, deprecations, security tightening under the exception, a higher minimum Rust, dropping an end-of-life Node line.</td></tr>
        <tr><td>Major (<code>x.0.0</code>)</td><td>Breaking changes, each with an upgrade note and an accepted RFC.</td></tr>
      </table>

      <h2 id="supported-versions">Supported versions</h2>
      <table>
        <tr><th>Release line</th><th>Bug fixes</th><th>Security fixes</th></tr>
        <tr><td>Latest 0.x (0.20.0 now), until 1.0.0</td><td>Yes</td><td>Yes</td></tr>
        <tr><td>Older 0.x releases</td><td>No</td><td>No</td></tr>
        <tr><td><code>1.0.0-rc.N</code></td><td>Until 1.0.0</td><td>Until 1.0.0</td></tr>
        <tr><td>From 1.0.0: the latest 1.y minor</td><td>Yes</td><td>Yes</td></tr>
        <tr><td>Older 1.y minors</td><td>No: upgrade to the latest 1.y</td><td>No: upgrade to the latest 1.y</td></tr>
        <tr><td>1.x after 2.0.0 is released</td><td>No</td><td>For 6 months</td></tr>
      </table>
      <p>
        Minors don't break, so older minors get no backports. The same rules apply to{" "}
        <code>@nowaki-dev/markdoc</code> on its own line. <code>nowaki dev</code> is a development
        tool and is not supported for production traffic.
      </p>

      <h2>Platforms</h2>
      <table>
        <tr><th>Platform</th><th>Supported</th></tr>
        <tr><td>Node.js</td><td>LTS lines that are not end-of-life (<code>&gt;=22</code>). CI runs Node 22, 24 and 26 on Linux, and Node 22 on macOS and Windows. Node 22 reaches end-of-life on 2027-04-30.</td></tr>
        <tr><td>Bun, Deno</td><td>The current stable release, for the <code>bun</code> and <code>deno</code> adapters.</td></tr>
        <tr><td>Operating systems</td><td>Prebuilt CLI for macOS (arm64, x64), Linux (x64, arm64, glibc) and Windows (x64). Elsewhere, <code>cargo install nowaki</code>.</td></tr>
        <tr><td>Rust</td><td>Only to build from source: 1.97 or newer. It may rise in a minor.</td></tr>
        <tr><td>Preact</td><td><code>^10.25.0 || ^11.1.0</code></td></tr>
        <tr><td>TypeScript</td><td>Checked in CI with 5.9.3; the minimum rises only in a minor.</td></tr>
        <tr><td>Browsers</td><td>Nowaki's client code targets Baseline “Widely available” and falls back where a feature is missing. Your island code ships as you wrote it.</td></tr>
      </table>

      <h2>How the project is run</h2>
      <p>
        Nowaki is maintained by volunteers, with no paid support. A lead maintainer sets the roadmap
        and publishes releases; maintainers review and merge. A change to the frozen surface needs
        an accepted RFC first. Questions go to{" "}
        <a href={`${GH}/discussions`}>GitHub Discussions</a>, bugs to{" "}
        <a href={`${GH}/issues`}>Issues</a>, and vulnerabilities privately as{" "}
        <a href={`${GH}/blob/main/SECURITY.md`}>SECURITY.md</a> describes.
      </p>

      <div class="note">
        The full texts are{" "}
        <a href={`${GH}/blob/main/docs/STABILITY.md`}>docs/STABILITY.md</a>,{" "}
        <a href={`${GH}/blob/main/SUPPORT.md`}>SUPPORT.md</a> and{" "}
        <a href={`${GH}/blob/main/GOVERNANCE.md`}>GOVERNANCE.md</a>.
      </div>
    </>
  );
}
