// A code plate for the docs, highlighted on the server (docs stay zero-JS).
// A first line that is only a file-path comment ("// routes/x.tsx", "# app/.env")
// becomes the plate's filename strip instead of a comment.

const TOKEN =
  /(\/\*[\s\S]*?\*\/|\/\/[^\n]*|(?:^|(?<=\s))#[^\n]*|"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|\b(?:import|export|from|const|let|var|async|await|function|return|default|type|interface|new|if|else|for|of|in|true|false|null|undefined|class|extends)\b)/gm;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function highlight(src: string): string {
  let out = "";
  let last = 0;
  for (const m of src.matchAll(TOKEN)) {
    const t = m[0];
    out += esc(src.slice(last, m.index));
    const cls = t.startsWith("//") || t.startsWith("/*") || t.startsWith("#") ? "c" : t[0] === '"' || t[0] === "'" ? "s" : "k";
    out += `<span class="${cls}">${esc(t)}</span>`;
    last = (m.index ?? 0) + t.length;
  }
  return out + esc(src.slice(last));
}

const FILE_LINE = /^(?:\/\/|#)\s*([\w@.\-]*[/.][\w@.\-/[\]]+\.\w+)\s*\n/;

export default function Code({ src }: { src: string }) {
  const m = src.match(FILE_LINE);
  const file = m?.[1];
  const body = m ? src.slice(m[0].length) : src;
  return (
    <figure class="plate">
      {file ? <figcaption class="plate__file">{file}</figcaption> : null}
      <pre>
        <code dangerouslySetInnerHTML={{ __html: highlight(body) }} />
      </pre>
    </figure>
  );
}
