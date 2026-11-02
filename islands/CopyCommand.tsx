import { useState } from "preact/hooks";

// Copies the command to the clipboard on click. Under SSR the command is readable as-is.
export default function CopyCommand({
  cmd,
  labelCopy = "copy",
  labelCopied = "copied",
}: {
  cmd: string;
  labelCopy?: string;
  labelCopied?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* do nothing where the clipboard is unavailable */
    }
  };

  return (
    <button type="button" onClick={copy} class="copybar" data-copied={copied ? "" : undefined} aria-label={`${labelCopy}: ${cmd}`}>
      <span class="copybar__prompt" aria-hidden="true">
        $
      </span>
      <code class="copybar__cmd">{cmd}</code>
      <span class="copybar__state" aria-live="polite">
        {copied ? labelCopied : labelCopy}
      </span>
    </button>
  );
}
