import { DOCS_HEAD } from "../../lib/docs-style.ts";
import Code from "../../components/Code.tsx";

export const lang = "en";
export const title = "Nowaki docs · Server functions";
export const head = DOCS_HEAD;

export default function ServerFunctions() {
  return (
    <>
      <h1>Server functions <span class="badge">v0.8</span></h1>
      <p class="lead">
        A module with a top-of-file <code>"use server"</code> directive becomes an RPC boundary. Its
        exports run only on the server; the browser gets a tiny <code>fetch</code> proxy.
      </p>

      <h2>Write one</h2>
      <Code src={`// actions/todos.ts
"use server";

import { getContext } from "@nowaki-dev/runtime/server/functions.mjs";

const store: string[] = [];

export async function addTodo(text: string) {
  store.push(text.trim());
  return store.slice();
}

export async function whoami() {
  const ctx = getContext();              // request context, RPC-time only
  return ctx?.cookies?.user ?? "anonymous";
}`} />
      <p>
        <code>getContext</code> and the framework types come from{" "}
        <code>@nowaki-dev/runtime</code>:
      </p>
      <Code src={`import { getContext } from "@nowaki-dev/runtime";
import type { LoaderContext, PageProps, Meta } from "@nowaki-dev/runtime";`} />

      <h2>Validate input <span class="badge">v0.14</span></h2>
      <p>
        Wrap a function in <code>serverFn(schema, impl)</code> and its first argument is checked
        with any <a href="https://standardschema.dev">Standard Schema</a> library (zod, valibot,
        arktype) before your code runs. Invalid input gets a 400 whose <code>data.issues</code> lists
        the problems. <code>nowaki build</code> warns about <code>"use server"</code> exports that
        take arguments without it.
      </p>
      <Code src={`// actions/todos.ts
"use server";

import { serverFn, ServerFnError } from "@nowaki-dev/runtime";
import { z } from "zod";

export const addTodo = serverFn(z.string().trim().min(1).max(200), async (text) => {
  if (await isFull()) throw new ServerFnError("The list is full", { status: 409 });
  return save(text);
});`} />
      <p>
        Throw <code>ServerFnError(message, {`{ status, data }`})</code> for errors the user should
        see: its status, message and <code>data</code> reach the client, where the thrown
        <code>Error</code> carries <code>status</code> and <code>data</code>. In production any other
        error becomes a generic <code>Internal Server Error</code> (500) and is logged; dev still shows
        the message. Request bodies over <code>NOWAKI_FN_BODY_LIMIT</code> (1 MiB by default) get 413,
        and calls with more than 16 arguments get 400.
      </p>

      <h2>Call it from an island</h2>
      <p>Import and call it like a normal async function. The browser only ships the proxy.</p>
      <Code src={`// islands/Todos.tsx
import { useState } from "preact/hooks";
import { addTodo } from "../actions/todos.ts";

export default function Todos({ initial = [] }) {
  const [todos, setTodos] = useState(initial);
  return <button onClick={async () => setTodos(await addTodo("new"))}>add</button>;
}`} />
      <p>
        On the server you can call the same function directly (no HTTP), e.g. from a route{" "}
        <code>loader</code>: so server-to-server calls stay in-process.
      </p>

      <h2>How it works</h2>
      <ul>
        <li>The build strips the implementation (and its server-only imports) from the client bundle and emits a proxy that posts <code>{`{ id, args }`}</code> to <code>/__nowaki/fn</code>.</li>
        <li>Each export gets a stable id (a hash of <code>module#export</code>) computed identically on both sides.</li>
        <li>Dispatch is <strong>allowlisted</strong>: the server maps id → {`{ module, export }`} from a build-time table. A client can't reach an arbitrary export.</li>
        <li><code>getContext()</code> exposes the request context (cookies, headers) via AsyncLocalStorage during the call.</li>
        <li>Works in dev, <code>nowaki start</code>, and on edge adapters.</li>
      </ul>

      <div class="note">
        Treat each server function like a public HTTP endpoint: <strong>validate its arguments</strong>{" "}
        (they arrive as JSON from the client; <code>serverFn</code> does it for the first one) and check
        authorization with <code>getContext()</code>. Stack traces never reach the client.
      </div>

      <h2>Authoring rules</h2>
      <ul>
        <li>Server modules live under <code>routes/</code>, <code>islands/</code>, <code>components/</code>, <code>lib/</code>, or <code>actions/</code>.</li>
        <li>Use explicit file extensions in imports (<code>../actions/todos.ts</code>).</li>
        <li>Exports should be async functions that take JSON-serializable arguments and return JSON-serializable values.</li>
      </ul>
    </>
  );
}
