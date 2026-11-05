import { DOCS_HEAD } from "../../lib/docs-style.ts";
import Code from "../../components/Code.tsx";

// Kept in line with the 0.15.0 and 0.16.0 CHANGELOG, ROADMAP and runtime types in Tettu0530/nowaki.
export const lang = "en";
export const title = "Nowaki docs · Jetstream islands";
export const head = DOCS_HEAD;

export default function Jetstream() {
  return (
    <>
      <h1>Jetstream islands <span class="badge">v0.16</span></h1>
      <p class="lead">
        Server-reactive islands. State lives on the server; events go to it over a WebSocket or one
        POST each, and the server answers with an HTML patch, with <strong>zero component
        JavaScript</strong> on the client.
      </p>

      <p>
        A regular island ships its component JS and runs in the browser. A Jetstream island ships
        none: the server holds its state, re-renders on events, and sends HTML that a 1.9&nbsp;KB
        (gzip) runtime morphs in. It's Nowaki's answer to "content-driven but dynamic" UIs (live
        counters, forms, polls, presence) without shipping a client framework.
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
        <li>The build emits <strong>no client chunk</strong> for live islands; it SSRs them inside a <code>&lt;nowaki-live&gt;</code> wrapper with the initial state and its signature.</li>
        <li>Under <code>nowaki dev</code> and <code>nowaki start</code>, the Rust front holds a <code>/__nowaki/live</code> WebSocket and keeps each island's state per connection. An event is bridged to the Node renderer, which verifies the signed state, runs the handler and renders the island again; the new HTML and the re-signed state are pushed down the socket and morphed into the DOM.</li>
        <li>On the node, bun, deno, vercel and cloudflare adapters, each event is a <code>POST /__nowaki/live-event</code> carrying the island's signed state; the reply is the new HTML, state and signature.</li>
        <li>Client and optimistic islands coexist on the same page.</li>
      </ul>

      <h2>Choosing the transport <span class="badge">v0.15</span></h2>
      <p>
        By default live.js uses the WebSocket and sends an event as a POST whenever the socket isn't
        open. A page can pin it with a meta tag in its head, which wins over the default:
      </p>
      <Code src={`// routes/live-post.tsx
export const head = \`<meta name="nowaki-live" content="post" />\`;`} />
      <p>
        <code>"post"</code> never opens the socket (presence stays at its SSR value);{" "}
        <code>"ws"</code> never falls back to POST. The POST route has the same CSRF gate as server
        functions (JSON only, an <code>x-nowaki-live: 1</code> header, cross-site requests rejected)
        and a 64&nbsp;KiB body cap.
      </p>

      <h2>Forms and inputs <span class="badge">v0.15</span></h2>
      <ul>
        <li><code>data-live-submit="handler"</code> on a <code>&lt;form&gt;</code> sends its fields as an object, without navigating.</li>
        <li><code>data-live-input="handler"</code> sends a field's value while typing, debounced by <code>data-live-debounce</code> (ms, 150 by default).</li>
        <li><code>data-live-change="handler"</code> fires on commit. Checkboxes and radios send <code>{`{ value, checked }`}</code>.</li>
        <li>Children with <code>data-key</code> are matched by key when a patch is applied, so filtered or reordered rows keep their elements, and a focused field's value is never overwritten.</li>
      </ul>
      <Code src={`// islands/LiveTodos.tsx (trimmed)
export const live = {
  state: () => ({ todos: [], filter: "", nextId: 1 }),
  on: {
    add: (s, form) => ({ ...s, todos: [{ id: s.nextId, text: form.text, done: false }, ...s.todos], nextId: s.nextId + 1 }),
    filter: (s, value) => ({ ...s, filter: String(value) }),
    toggle: (s, box) => ({ ...s, todos: s.todos.map((t) => (String(t.id) === box.value ? { ...t, done: box.checked } : t)) }),
  },
};

export default function LiveTodos({ state }) {
  return (
    <section>
      <form data-live-submit="add">
        <input name="text" />
        <button type="submit">add</button>
      </form>
      <input placeholder="filter" data-live-input="filter" data-live-debounce="100" />
      <ul>
        {state.todos.filter((t) => t.text.includes(state.filter)).map((t) => (
          <li data-key={String(t.id)}>
            <input type="checkbox" checked={t.done} data-live-change="toggle" value={String(t.id)} />
            {t.text}
          </li>
        ))}
      </ul>
    </section>
  );
}`} />

      <h2>Rooms <span class="badge">v0.15</span></h2>
      <p>
        <code>live.room(props)</code> names a room (1 to 120 characters, no whitespace) and{" "}
        <code>live.shared()</code> is its initial state. Every island in the same room shares that
        state: handlers receive and return it, and a change re-renders every member, on any
        connection in the process. <code>data-nowaki-presence="&lt;room&gt;"</code> shows how many
        connections are in the room.
      </p>
      <Code src={`// islands/LivePoll.tsx
export const live = {
  room: (props) => \`poll:\${props.id ?? "demo"}\`,
  shared: () => ({ a: 0, b: 0 }),
  on: {
    vote: (votes, option) =>
      option === "a" || option === "b" ? { ...votes, [option]: votes[option] + 1 } : votes,
  },
};

// routes/poll.tsx: open it in two tabs and vote in either
<LivePoll id="demo" />
people here: <strong data-nowaki-presence="poll:demo">0</strong>`} />

      <h2>Live queries <span class="badge">v0.15</span></h2>
      <p>
        An island lists topics in <code>live.subscribe</code> (or a function of its state) and
        reloads its state in <code>live.load</code>. After server code changes data (an action, a
        server function, an API route), <code>publish(topic)</code> reloads every subscribed island
        and pushes the patch, with no event from the browser.
      </p>
      <Code src={`// islands/LiveTicks.tsx
export const live = {
  state: () => ({ ticks: readTicks() }),
  subscribe: ["ticks"],
  load: (s) => ({ ...s, ticks: readTicks() }),
  on: {},
};

// routes/api/tick.ts
import { publish } from "@nowaki-dev/runtime";
export function POST(ctx) {
  const ticks = bumpTicks();
  publish("ticks");
  return ctx.json({ ticks });
}`} />
      <p>
        Since 0.16 a publish is rendered once <span class="badge">v0.16</span>: the first connection
        renders, and connections with the same island, state and topic reuse that HTML. An island with{" "}
        <code>live.authorize</code>, or whose render called <code>getContext()</code>, is still rendered
        per connection. The same applies to rooms.
      </p>

      <h2>Request context and authorization <span class="badge">v0.15</span></h2>
      <p>
        Handlers call <code>getContext()</code> to read the cookies and the{" "}
        <code>authorization</code>, <code>accept-language</code> and <code>user-agent</code> headers
        of the WebSocket upgrade. <code>live.authorize({`{ name, handler, state, payload }`})</code>{" "}
        runs after the signature check and before each handler; anything but <code>true</code>{" "}
        refuses the event with <code>{`{ type: "error", reason: "forbidden" }`}</code>. Cookies set
        after the socket opened are seen after the next reconnect.
      </p>
      <Code src={`import { getContext } from "@nowaki-dev/runtime";

export const live = {
  state: () => ({ count: 0, user: "guest" }),
  on: {
    greet: (s) => ({ ...s, user: getContext()?.cookies?.user ?? "guest" }),
    adminReset: (s) => ({ ...s, count: 0 }),
  },
  authorize: ({ handler }) => handler !== "adminReset" || getContext()?.cookies?.role === "admin",
};`} />

      <h2>Where it runs</h2>
      <table>
        <tr><th>Run with</th><th>Events</th><th>Server push (<code>publish</code>, rooms)</th><th>Presence</th></tr>
        <tr><td><code>nowaki dev</code>, <code>nowaki start</code></td><td>WebSocket (POST while it's down)</td><td>Yes, to connections in the same process</td><td>Yes</td></tr>
        <tr><td>node, bun, deno, vercel, cloudflare adapters</td><td>One POST per event</td><td>No: <code>publish</code> is a no-op and other room members aren't pushed</td><td>No</td></tr>
        <tr><td>Static output (<code>nowaki prerender</code>, static adapter)</td><td>None: the island keeps its first HTML, and no live.js is shipped</td><td>No</td><td>No</td></tr>
      </table>
      <p>
        Static output has no server to answer events, so since 0.16 its pages ship no live.js; the
        build lists the pages that have live islands, as a note.
      </p>

      <div class="note">
        <strong>One process.</strong> Rooms, <code>publish()</code> and presence live in one server
        process and don't reach other instances. Since 0.16, <code>nowaki start</code> writes the rooms'
        shared state to <code>.nowaki/live-rooms.json</code> (at most every 2 s after a change, and on
        shutdown) and loads it on the next start; <code>NOWAKI_LIVE_ROOMS_FILE</code> picks another
        file, or <code>off</code> keeps rooms in memory. <code>nowaki dev</code> and the adapters don't
        save rooms. Deferred: a resume token, and rooms shared across instances.
      </div>

      <h2>Presence &amp; scaling <span class="badge">v0.9</span></h2>
      <ul>
        <li><strong>Presence</strong>: the server broadcasts connection counts; clients receive <code>{`{ type: "presence", count }`}</code> and it's mirrored into <code>[data-nowaki-presence]</code> elements (and a <code>nowaki:presence</code> event). Over the WebSocket only.</li>
        <li><strong>Heartbeat</strong>: connections ping periodically and idle ones are dropped, so zombie connections don't leak state.</li>
        <li><strong>Connection cap</strong>: a global limit (<code>NOWAKI_LIVE_MAX</code>); over it, the client keeps the initial SSR view (graceful degradation).</li>
      </ul>

      <h2>Signatures, timeouts and errors <span class="badge">v0.14</span></h2>
      <ul>
        <li><strong>Signed state</strong>: every state is signed with HMAC-SHA256 over the island name, the issue time and the state, and verified before each render and handler. A signature older than <code>NOWAKI_LIVE_MAX_AGE</code> (86400 seconds by default) is not accepted; every patch is re-signed, so an island in use doesn't expire.</li>
        <li><strong>Stale pages</strong> <span class="badge">v0.16</span>: a genuine but expired signature comes back as <code>reason: "stale"</code> over the WebSocket and as HTTP 409 over POST. The client dispatches a cancelable <code>nowaki:live-stale</code> event and, unless the app calls <code>preventDefault()</code>, reloads the page for fresh signed state. A tampered or future-dated signature is still refused with 403.</li>
        <li><strong>Set <code>NOWAKI_LIVE_SECRET</code></strong> in production. Without it each process uses its own random key: state can't resume after a restart or on another instance, and production servers warn at startup. On the adapters, set it whenever more than one instance (or Worker isolate) can serve a request, or live events fail the signature check. The Cloudflare <code>wrangler.jsonc</code> enables <code>nodejs_compat_populate_process_env</code> so Worker vars and secrets reach <code>process.env</code>.</li>
        <li><strong>Renders off the session loop</strong>: one render at a time per connection, with up to 32 events queued behind it, so pings, presence and new events keep flowing.</li>
        <li><strong>Timeouts and errors</strong>: a render slower than <code>NOWAKI_LIVE_RENDER_TIMEOUT_MS</code> (10000 by default) or one that fails is reported as <code>{`{ type: "error", nid, reason }`}</code> (<code>timeout</code>, <code>render failed</code> or <code>busy</code>) and dispatched as a <code>nowaki:live-error</code> window event. The island keeps its last HTML and state.</li>
        <li><strong>Origin check</strong>: the WebSocket upgrade must come from the page's own origin. Behind a reverse proxy, set <code>NOWAKI_TRUST_PROXY=1</code>.</li>
        <li><strong>Own handlers only</strong>: an event can call only the island's own <code>live.on</code> handlers, not inherited methods such as <code>toString</code>. Validate payloads in your handlers as you would any server handler.</li>
      </ul>
    </>
  );
}
