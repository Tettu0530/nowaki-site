---
title: "@nowaki-dev/markdoc/render"
source: "docs/reference/markdoc-render.md"
generated: true
---

Generated from the source by `scripts/gen-reference.mjs`; do not edit by hand. Source: [`packages/nowaki-markdoc/render.d.ts`](https://github.com/Tettu0530/nowaki/blob/v1.0.0-rc.1/packages/nowaki-markdoc/render.d.ts). All of it is covered by semver ([STABILITY.md](/docs/stability/)).

Types for `@nowaki-dev/markdoc/render`: the renderer the compiled `.mdoc` modules import.

## Exports

| Name | Kind | Summary |
| --- | --- | --- |
| [`MarkdocNode`](#markdocnode) | Type | A serialized Markdoc tree: `[name, attributes, children]` for a tag ("" for a fragment), a string for text. |
| [`renderMarkdoc`](#rendermarkdoc) | Function | Renders a tree with Preact. |

## Declarations

### MarkdocNode

Type. `import type { MarkdocNode } from "@nowaki-dev/markdoc/render";`

```ts
export type MarkdocNode = string | [
    string,
    Record<string, unknown>,
    MarkdocNode[]
];
```

A serialized Markdoc tree: `[name, attributes, children]` for a tag ("" for a fragment), a
string for text.

Used by: [`renderMarkdoc`](#rendermarkdoc).

### renderMarkdoc

Function. `import { renderMarkdoc } from "@nowaki-dev/markdoc/render";`

```ts
export function renderMarkdoc(node: MarkdocNode | null, components?: Record<string, unknown>): import("preact").ComponentChild;
```

Renders a tree with Preact. Capitalized names must be exports of `components`. Throws for an
unknown component and for elements that run code (`script`, `style`, `iframe`, ...); `on*`
attributes and `javascript:` / `data:` URLs are dropped.

Uses: [`MarkdocNode`](#markdocnode).
