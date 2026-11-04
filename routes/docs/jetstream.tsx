import { DOCS_HEAD } from "../../lib/docs-style.ts";
import Code from "../../components/Code.tsx";

export const lang = "en";
export const title = "Nowaki docs · Jetstream islands";
export const head = DOCS_HEAD;

export default function Jetstream() {
  return (
    <>
      <h1>Jetstream islands <span class="badge">v0.6</span></h1>
      <p class="lead">
        Server-reactive islands. State lives on the server; interactions go over a WebSocket and the
        server pushes an HTML patch, with <strong>zero component JavaScript</strong> on the client.
      </p>

      <p>
        A regular island ships its component JS and runs in the browser. A Jetstream island ships
        none: the server holds its state per connection, re-renders on events, and sends a DOM patch
        that a 1.5&nbsp;KB (gzip) runtime morphs in. It's Nowaki's answer to "content-driven but dynamic"
        UIs (live counters, dashboards, presence) without shipping a client framework.
      </p>

      <h2>Write one</h2>
      <p>
        Give an island an <code>export const live</code> with initial <code>state</code> and{" "}
        <code>on</code> handlers. Buttons reference handlers with <code>data-live</code>: no{" "}
        <code>onClick</code>, no client component.
      </p>
      <Code src={`// islands/LiveCounter.tsx
export const live = {
  state: () => ({ count: 0 }),
  on: {
    inc: (s) => ({ ...s, count: s.count + 1 }),
    dec: (s) => ({ ...s, count: s.count - 1 }),
    reset: () => ({ count: 0 }),
  },
};

export default function LiveCounter({ state }) {
  return (
    <div>
      <button data-live="dec">-</button>
      <strong>live: {state.count}</strong>
      <button data-live="inc">+</button>
    </div>
  );
}`} />

      <h2>How it works</h2>
      <ul>
        <li>The build emits <strong>no client chunk</strong> for live islands; it SSRs them inside a <code>&lt;nowaki-live&gt;</code> wrapper with the initial state.</li>
        <li>The Rust front holds a <code>/__nowaki/live</code> WebSocket and keeps each island's state per connection.</li>
        <li>A <code>data-live</code> click is bridged to the Node renderer, which verifies the signed state, runs the handler and renders the island again; the new HTML and the re-signed state are pushed as a patch and morphed into the DOM. Only click events are wired so far.</li>
        <li>Client and optimistic islands coexist on the same page.</li>
      </ul>

      <h2>Presence &amp; scaling <span class="badge">v0.9</span></h2>
      <ul>
        <li><strong>Presence</strong>: the server broadcasts the live connection count; clients receive <code>{`{ type: "presence", count }`}</code> and it's mirrored into <code>[data-nowaki-presence]</code> elements (and a <code>nowaki:presence</code> event).</li>
        <li><strong>Heartbeat</strong>: connections ping periodically and idle ones are dropped, so zombie connections don't leak state.</li>
        <li><strong>Connection cap</strong>: a global limit (<code>NOWAKI_LIVE_MAX</code>); over it, the client keeps the initial SSR view (graceful degradation).</li>
      </ul>

      <h2>Signatures, timeouts and errors <span class="badge">v0.14</span></h2>
      <ul>
        <li><strong>Signed state</strong>: every state is signed with HMAC-SHA256 over the island name, the issue time and the state, and verified before each render and handler. A signature older than <code>NOWAKI_LIVE_MAX_AGE</code> (86400 seconds by default) is rejected; every patch is re-signed, so an island in use doesn't expire.</li>
        <li><strong>Set <code>NOWAKI_LIVE_SECRET</code></strong> in production. Without it each process uses its own random key: state can't resume after a restart or on another instance, and production servers warn at startup.</li>
        <li><strong>Renders off the session loop</strong>: one render at a time per connection, with up to 32 events queued behind it, so pings, presence and new events keep flowing.</li>
        <li><strong>Timeouts and errors</strong>: a render slower than <code>NOWAKI_LIVE_RENDER_TIMEOUT_MS</code> (10000 by default) or one that fails is reported as <code>{`{ type: "error", nid, reason }`}</code> (<code>timeout</code>, <code>render failed</code> or <code>busy</code>) and dispatched as a <code>nowaki:live-error</code> window event. The island keeps its last HTML and state.</li>
        <li><strong>Origin check</strong>: the WebSocket upgrade must come from the page's own origin. Behind a reverse proxy, set <code>NOWAKI_TRUST_PROXY=1</code>.</li>
      </ul>

      <div class="note">
        Live updates run under <code>nowaki dev</code> and <code>nowaki start</code>, where the Rust
        front holds the socket. The node, bun, deno, vercel and cloudflare adapters render a live
        island's initial HTML and ship no live client; static output (<code>nowaki prerender</code>)
        still loads live.js, which stops after 8 failed connection attempts. Validate payloads in your{" "}
        <code>on</code> handlers as you would any server handler.
      </div>
    </>
  );
}
