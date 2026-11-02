import { DOCS_HEAD } from "../../lib/docs-style.ts";
import Code from "../../components/Code.tsx";

export const lang = "en";
export const title = "Nowaki docs · Plugins & virtual modules";
export const head = DOCS_HEAD;

export default function Plugins() {
  return (
    <>
      <h1>Plugins &amp; virtual modules</h1>
      <p class="lead">
        Extend the build with a <code>nowaki.config.mjs</code>. Plugins run in a Node host during
        dev and build (never in the production request path) and stay out of the way when unused.
      </p>

      <h2>The config</h2>
      <Code src={`// nowaki.config.mjs
export default {
  plugins: [
    {
      name: "my-plugin",
      transform(code, id) { /* return new code or null */ },
      resolveId(source, importer) { /* claim a specifier or return null */ },
      load(id) { /* return source for a virtual id or null */ },
    },
  ],
};`} />

      <h2>Transform hook</h2>
      <p>
        <code>transform(code, id)</code> runs before oxc on every transformable source. Return new
        code, or <code>null</code> to leave it unchanged (the fast path).
      </p>
      <Code src={`transform(code, id) {
  if (!code.includes("__BUILD_DATE__")) return null;
  return code.replaceAll("__BUILD_DATE__", JSON.stringify(new Date().toISOString()));
}`} />

      <h2>Virtual modules <span class="badge">v0.9</span></h2>
      <p>
        Provide modules that don't exist on disk. <code>resolveId</code> claims a bare specifier;{" "}
        <code>load</code> returns its source. Useful for generated config, build info, or a routes
        manifest.
      </p>
      <Code src={`{
  name: "build-info",
  resolveId(source) {
    return source === "virtual:build-info" ? source : null;
  },
  load(id) {
    if (id !== "virtual:build-info") return null;
    return \`export const builtAt = \${Date.now()};\`;
  },
}`} />
      <Code src={`// any island
import { builtAt } from "virtual:build-info";`} />
      <p>
        On the client the generated source is bundled inline into the island chunk; for SSR it's
        inlined as a self-contained <code>data:</code> module. Resolution only calls into the plugin
        when the normal resolver fails, so there's no overhead for ordinary imports. (For SSR, keep
        virtual modules self-contained: they shouldn't have relative imports.)
      </p>

      <h2>The .tsrx bridge</h2>
      <p>
        If <code>@tsrx/preact</code> is installed, <code>.tsrx</code> files are compiled to standard
        JSX before joining the oxc pipeline; it is an optional, app-level dependency.
      </p>

      <div class="note">
        Plugins execute as Node code during dev/build with your project's privileges, so treat them
        like any build dependency. They do not run in production serving.
      </div>
    </>
  );
}
