import { DOCS_HEAD } from "../../lib/docs-style.ts";
import Code from "../../components/Code.tsx";

export const lang = "en";
export const title = "Nowaki docs · Observability";
export const head = DOCS_HEAD;

// Kept in line with the 0.19.3 CHANGELOG ("Observability") in Tettu0530/nowaki.
export default function Observability() {
  return (
    <>
      <h1>Observability <span class="badge">v0.19</span></h1>
      <p class="lead">
        Server-Timing, JSON logs, OpenTelemetry traces and a health endpoint. All of it is off
        unless you turn it on, and when off it costs a request one check.
      </p>

      <table>
        <tr><th>Feature</th><th>Turned on by</th></tr>
        <tr><td><code>Server-Timing</code></td><td>On in <code>nowaki dev</code>; <code>NOWAKI_SERVER_TIMING=1</code> elsewhere</td></tr>
        <tr><td>JSON logs</td><td><code>NOWAKI_LOG=json</code></td></tr>
        <tr><td>OpenTelemetry traces</td><td><code>OTEL_EXPORTER_OTLP_ENDPOINT</code> or <code>OTEL_EXPORTER_OTLP_TRACES_ENDPOINT</code></td></tr>
        <tr><td><code>GET /__nowaki/health</code></td><td>Nothing to set: it does nothing until a client requests it, and holds no data</td></tr>
      </table>

      <h2>Server-Timing</h2>
      <p>
        The <code>Server-Timing</code> header is on in <code>nowaki dev</code> and opt-in elsewhere
        with <code>NOWAKI_SERVER_TIMING=1</code>. It stays off in production by default because
        timings can tell a visitor something, such as whether a lookup found a user.
      </p>
      <p>
        The handler reports <code>mw</code>, <code>loader</code>, <code>render</code> and{" "}
        <code>action</code>; <code>nowaki start</code> adds <code>isr;desc=HIT|STALE|MISS</code> and{" "}
        <code>total</code>. An ISR hit carries only its own entries, never the timings of the render
        that filled the cache. A streamed page has what was known when its headers went out.
      </p>
      <p>
        After a client navigation or an HMR page update, <code>nowaki:page-load</code> carries the
        response's <code>timing</code> (its <code>Server-Timing</code> header), and the{" "}
        <a href="/docs/quickstart/#dev-toolbar">dev toolbar</a> shows the timing of the last load.
      </p>

      <h2>JSON logs</h2>
      <p>
        With <code>NOWAKI_LOG=json</code>, the Rust front and the Node runtime write one JSON object
        per line: <code>time</code>, <code>level</code>, <code>msg</code>, <code>source</code>, plus{" "}
        <code>trace_id</code> / <code>span_id</code> inside a traced request and the error with its
        stack. <code>nowaki start</code> adds an access log line per request. Sidecar lines that are
        already JSON pass through unchanged. Errors still reach clients as generic messages.
      </p>
      <Code src={`NOWAKI_LOG=json npm run start`} />

      <h2>OpenTelemetry traces</h2>
      <p>
        Traces are exported as OTLP/HTTP JSON when <code>OTEL_EXPORTER_OTLP_ENDPOINT</code> or{" "}
        <code>OTEL_EXPORTER_OTLP_TRACES_ENDPOINT</code> is set and <code>OTEL_SDK_DISABLED</code>{" "}
        isn't true. The exporters are built in (one in Rust, and a fetch-based JS one that also runs on
        the Cloudflare worker), so there are no new dependencies. Spans are batched in a bounded queue
        and dropped when it is full, never holding up a request.
      </p>
      <Code src={`# a local collector
OTEL_EXPORTER_OTLP_ENDPOINT=http://127.0.0.1:4318 \\
OTEL_SERVICE_NAME=my-app \\
npm run start`} />
      <table>
        <tr><th>Variable</th><th>Effect</th></tr>
        <tr><td><code>OTEL_EXPORTER_OTLP_ENDPOINT</code></td><td>Turns tracing on and sets where spans go.</td></tr>
        <tr><td><code>OTEL_EXPORTER_OTLP_TRACES_ENDPOINT</code></td><td>Turns tracing on, for traces only.</td></tr>
        <tr><td><code>OTEL_SDK_DISABLED</code></td><td><code>true</code> keeps tracing off.</td></tr>
        <tr><td><code>OTEL_SERVICE_NAME</code></td><td>The service name on the spans.</td></tr>
        <tr><td><code>OTEL_EXPORTER_OTLP_HEADERS</code></td><td>Headers sent with each export.</td></tr>
        <tr><td><code>OTEL_TRACES_SAMPLER</code> / <code>OTEL_TRACES_SAMPLER_ARG</code></td><td>The sampler and its argument.</td></tr>
      </table>
      <p>
        On <code>nowaki start</code> one request is one trace, from the Rust front to the render:
      </p>
      <Code src={`GET <route>          SERVER span in Rust (under an incoming traceparent)
└─ CLIENT span       Rust front → Node sidecar
   └─ SERVER span    the sidecar
      ├─ middleware
      ├─ loader
      ├─ render
      └─ action, server function and live event spans`} />
      <p>
        Jetstream WebSocket events and publish refreshes get a trace of their own. When the app has
        registered a tracer with <code>@opentelemetry/api</code>, the runtime creates its spans there
        instead.
      </p>
      <div class="note">
        The Rust exporter speaks plain HTTP, so point it at a local collector. An{" "}
        <code>https://</code> endpoint turns off the Rust spans with a warning; the Node exporter
        still sends its own.
      </div>

      <h2>Health endpoint</h2>
      <p>
        <code>GET /__nowaki/health</code> (also under <code>basePath</code>) returns{" "}
        <code>{`{"status":"ok"}`}</code>. It is never cached and has no data in it.
      </p>
      <ul>
        <li><code>nowaki start</code> answers it in Rust: 200 while the sidecar answers a ping (1 s timeout, cached for 1 s), 503 otherwise.</li>
        <li>The node, bun, deno, Vercel and Cloudflare adapters answer it before routing.</li>
      </ul>
      <Code src={`curl -i http://127.0.0.1:3000/__nowaki/health
# HTTP/1.1 200 OK
# {"status":"ok"}`} />
    </>
  );
}
