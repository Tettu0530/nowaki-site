// The framework docs, synced as Markdown from Tettu0530/nowaki (scripts/sync-docs.mjs) and
// rendered at build time by Nowaki's content collections. No client JavaScript.
import { getCollection, getEntry } from "@nowaki-dev/runtime/content";
import type { LoaderContext } from "@nowaki-dev/runtime";
import { DOCS_HEAD } from "../../lib/docs-style.ts";
import { GH } from "../../lib/i18n.ts";
import SOURCE from "../../lib/docs-source.json" with { type: "json" };

export const lang = "en";
export const head = DOCS_HEAD;

type Data = { title: string; html: string; source: string; generated: boolean };

export const staticPaths = async () =>
  (await getCollection("docs")).map((e) => ({ slug: e.slug.split("/") }));

export async function loader(ctx: LoaderContext) {
  const p = ctx.params.slug as string | string[];
  const slug = Array.isArray(p) ? p.join("/") : String(p);
  const entry = await getEntry("docs", slug);
  if (!entry) {
    ctx.status(404);
    return { title: "Not found", html: "<p>This page doesn't exist. Start from the <a href=\"/docs/\">overview</a>.</p>", source: "", generated: false } satisfies Data;
  }
  const d = entry.data as { title: string; source: string; generated: boolean };
  return { title: d.title, html: entry.html ?? "", source: d.source, generated: d.generated } satisfies Data;
}

export const meta = ({ data }: { data: Data }) => ({ title: `Nowaki docs · ${data.title.replace(/`/g, "")}` });

// "Self-hosting with `nowaki start`" → code spans in titles, as on GitHub.
function Title({ text }: { text: string }) {
  const parts = text.split(/`([^`]+)`/);
  return <>{parts.map((s, i) => (i % 2 ? <code>{s}</code> : s))}</>;
}

// Which release the synced docs describe. A release candidate is labeled as one, next to the
// stable release it doesn't break (update STABLE when 1.0.0 ships and the docs sync to it).
const VERSION = SOURCE.ref.replace(/^v/, "");
const STABLE = "0.20.0";
const IS_RC = /-rc\./.test(VERSION);

export default function Doc({ data }: { data: Data }) {
  const at = `${GH}/blob/${SOURCE.ref}/${data.source}`;
  return (
    <>
      <h1>
        <Title text={data.title} />
      </h1>
      {data.source ? (
        <p class="docmeta">
          {IS_RC ? (
            <span>
              Describes Nowaki <b>{VERSION}</b>, the 1.0 release candidate. The stable release,{" "}
              {STABLE}, works the same: nothing breaks between them.
            </span>
          ) : (
            <span>
              Describes Nowaki <b>{VERSION}</b>.
            </span>
          )}
          <span>
            {data.generated ? "Generated from the source. " : ""}
            <a href={at}>{data.source}</a> on GitHub
          </span>
        </p>
      ) : null}
      <div class="md" dangerouslySetInnerHTML={{ __html: data.html }} />
    </>
  );
}
