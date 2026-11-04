import { DOCS_HEAD } from "../../lib/docs-style.ts";
import Code from "../../components/Code.tsx";
import { GH } from "../../lib/i18n.ts";

export const lang = "en";
export const title = "Nowaki docs · Security";
export const head = DOCS_HEAD;

// Kept in line with SECURITY.md and the 0.14.0 CHANGELOG in Tettu0530/nowaki.
export default function Security() {
  return (
    <>
      <h1>Security <span class="badge">v0.14</span></h1>
      <p class="lead">
        Nowaki turns the common defenses on by default. This chapter lists what is on, what stays
        your job, and the environment variables that change it.
      </p>

      <h2>On by default</h2>
      <table>
        <tr><th>Defense</th><th>What it does</th></tr>
        <tr><td>Security headers</td><td>Every response from <code>nowaki dev</code>, <code>nowaki start</code> (ISR hits and static assets included), every adapter, and the <code>_headers</code> file <code>nowaki prerender</code> writes carries <code>x-content-type-options: nosniff</code>, <code>x-frame-options: SAMEORIGIN</code>, <code>referrer-policy: strict-origin-when-cross-origin</code>, <code>cross-origin-opener-policy: same-origin</code>, and <code>content-security-policy: frame-ancestors 'self'</code> when the app sends no CSP. A header the response already sets is kept.</td></tr>
        <tr><td>Cross-site posts to page actions</td><td>A non-GET request to a route with an <code>action</code> gets 403 when <code>Origin</code> is another site or <code>null</code>, or <code>Sec-Fetch-Site</code> is <code>cross-site</code>. Requests without either header (curl, server-to-server) are allowed.</td></tr>
        <tr><td>Server function allowlist and RPC gate</td><td>Only exports of <code>"use server"</code> modules are reachable, and a call needs JSON, the <code>x-nowaki-rpc</code> header and a same-origin request.</td></tr>
        <tr><td>Server function limits</td><td>Bodies over <code>NOWAKI_FN_BODY_LIMIT</code> get 413, more than 16 arguments get 400, and in production only <code>ServerFnError</code> messages reach the client.</td></tr>
        <tr><td>Forwarded headers</td><td>The Rust front drops client-sent <code>x-forwarded-*</code>, <code>forwarded</code>, <code>x-real-ip</code> and internal <code>x-nowaki-*</code> headers and sets <code>x-forwarded-host</code> from <code>Host</code> itself.</td></tr>
        <tr><td>WebSocket Origin check</td><td>Cross-origin upgrades to the HMR and Jetstream sockets are refused.</td></tr>
        <tr><td>Jetstream POST events <span class="badge">v0.15</span></td><td><code>POST /__nowaki/live-event</code> has the server function gate: JSON only, the <code>x-nowaki-live: 1</code> header, cross-site requests rejected, and a 64&nbsp;KiB body cap. <code>live.authorize</code> can refuse any event, and an event can call only the island's own handlers.</td></tr>
        <tr><td>Jetstream state signature</td><td>HMAC over the island name, the issue time and the state, verified before each render and handler, rejected after <code>NOWAKI_LIVE_MAX_AGE</code>.</td></tr>
        <tr><td>Internal live endpoint <span class="badge">v0.14.1</span></td><td><code>nowaki dev</code> and <code>nowaki start</code> don't expose the sidecar's <code>/__nowaki/live-render</code> (404).</td></tr>
        <tr><td>Generic production 500s</td><td>Stack traces and file paths never reach the client.</td></tr>
      </table>

      <h2>Validate server function input</h2>
      <p>
        Every <code>"use server"</code> export is a public endpoint. Wrap it in{" "}
        <code>serverFn(schema, impl)</code> to validate its first argument with a Standard Schema
        library, and throw <code>ServerFnError</code> for messages the user should see (see{" "}
        <a href="/docs/server-functions/">Server functions</a>).
      </p>
      <Code src={`"use server";
import { serverFn, ServerFnError, getContext } from "@nowaki-dev/runtime";
import { z } from "zod";

export const rename = serverFn(z.string().trim().min(1).max(80), async (name) => {
  const user = getContext()?.cookies?.user;
  if (!user) throw new ServerFnError("Sign in first", { status: 401 });
  return save(user, name);
});`} />

      <h2>Cross-site requests</h2>
      <p>
        Page actions reject cross-site writes. API routes still accept them, with a one-time
        warning, unless they opt in; any route can opt out. <code>_middleware</code> runs before the
        check.
      </p>
      <Code src={`// routes/api/webhook.ts
export const csrf = false;   // a webhook that other sites post to

// routes/api/settings.ts
export const csrf = true;    // reject cross-site writes here too`} />
      <p>
        Behind a proxy that rewrites <code>Host</code>, forward the public host as{" "}
        <code>x-forwarded-host</code> and set <code>NOWAKI_TRUST_PROXY=1</code> for{" "}
        <code>nowaki start</code> and the node, bun and deno adapters, or same-origin posts are
        rejected too. Since 0.15 the adapters ignore a client-sent <code>x-forwarded-host</code>{" "}
        unless that variable is set; on Vercel, whose edge sets it, it is always used.
      </p>

      <h2>Content Security Policy (opt-in)</h2>
      <p>
        <code>NOWAKI_CSP=report-only</code> sends <code>Content-Security-Policy-Report-Only</code> and{" "}
        <code>NOWAKI_CSP=enforce</code> sends <code>Content-Security-Policy</code>, with{" "}
        <code>script-src</code> and <code>style-src-elem</code> limited to <code>'self'</code> plus a
        nonce that Nowaki adds to every <code>&lt;script&gt;</code> and <code>&lt;style&gt;</code> in
        the HTML, including <code>export const head</code>. <code>nowaki start</code>'s ISR cache
        re-nonces each response.
      </p>
      <p>
        Start with <code>report-only</code>: inline event handlers, <code>javascript:</code> URLs and
        third-party scripts are blocked under <code>enforce</code>. A response that sets its own CSP is
        left alone. A CDN that caches HTML caches the nonce too, so every visitor of a cached copy
        gets the same one.
      </p>

      <h2>Still your job</h2>
      <ul>
        <li>Authorize server functions with <code>getContext()</code> (cookies, headers): the allowlist only limits which exports exist, not who calls them.</li>
        <li>Validate payloads in Jetstream <code>on</code> handlers as you would any server handler.</li>
        <li>Authenticate requests that carry no <code>Origin</code> or <code>Sec-Fetch-Site</code> (curl, server-to-server) another way: the cross-site check lets them through.</li>
        <li>Send your own header where a default is too strict, for example <code>cross-origin-opener-policy: same-origin-allow-popups</code> for an OAuth popup that needs <code>window.opener</code>.</li>
      </ul>

      <h2>Environment variables</h2>
      <table>
        <tr><th>Variable</th><th>Default</th><th>Effect</th></tr>
        <tr><td><code>NOWAKI_CSP</code></td><td>unset</td><td><code>report-only</code> or <code>enforce</code> turns on the nonce-based CSP.</td></tr>
        <tr><td><code>NOWAKI_CSP_REPORT_URI</code></td><td>unset</td><td>Adds a <code>report-uri</code> to the policy.</td></tr>
        <tr><td><code>NOWAKI_SECURITY_HEADERS</code></td><td>on</td><td><code>off</code> removes the default headers. On the vercel adapter, set it at build time too.</td></tr>
        <tr><td><code>NOWAKI_TRUST_PROXY</code></td><td>unset</td><td><code>1</code> uses the proxy's first <code>x-forwarded-host</code> / <code>x-forwarded-proto</code> for the same-origin and WebSocket checks and passes <code>x-forwarded-for</code>. Leave it unset when clients reach <code>nowaki start</code> directly.</td></tr>
        <tr><td><code>NOWAKI_LIVE_SECRET</code></td><td>random per process</td><td>The key that signs Jetstream state. Set it in production, and on the adapters whenever more than one instance or Worker isolate can serve a request.</td></tr>
        <tr><td><code>NOWAKI_LIVE_MAX_AGE</code></td><td>86400</td><td>Seconds after which a Jetstream signature is rejected.</td></tr>
        <tr><td><code>NOWAKI_LIVE_RENDER_TIMEOUT_MS</code></td><td>10000</td><td>A live render slower than this is reported to the client as <code>timeout</code>.</td></tr>
        <tr><td><code>NOWAKI_FN_BODY_LIMIT</code></td><td>1 MiB</td><td>Server function request bodies over this get 413.</td></tr>
      </table>

      <div class="note">
        Nowaki is alpha and not yet recommended for production-critical work. The full policy,
        including how to report a vulnerability, is in{" "}
        <a href={`${GH}/blob/main/SECURITY.md`}>SECURITY.md</a>.
      </div>
    </>
  );
}
