// content/docs/ holds the framework docs synced from Tettu0530/nowaki by scripts/sync-docs.mjs.
// Their frontmatter is written by that script, so the schema only checks its shape.
import { defineCollection } from "@nowaki-dev/runtime/content";

type DocMeta = { title: string; source: string; generated: boolean };

const docMeta = {
  "~standard": {
    version: 1 as const,
    vendor: "nowaki-site",
    validate(value: unknown) {
      const v = (value ?? {}) as Record<string, unknown>;
      const issues: { message: string; path?: string[] }[] = [];
      if (typeof v.title !== "string" || !v.title) issues.push({ message: "title: a string is required", path: ["title"] });
      if (typeof v.source !== "string" || !v.source) issues.push({ message: "source: a string is required", path: ["source"] });
      if (issues.length) return { issues };
      return { value: { title: v.title, source: v.source, generated: v.generated === true } as DocMeta };
    },
  },
};

export const docs = defineCollection({ schema: docMeta });
