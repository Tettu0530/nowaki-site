---
title: "nowaki.config"
source: "docs/reference/config.md"
generated: true
---

Generated from the source by `scripts/gen-reference.mjs`; do not edit by hand. The app's configuration file, read by `nowaki dev` and `nowaki build`.

File: `nowaki.config.mjs` or `nowaki.config.js` in the app root (the first one found), with the config as its default export.

```js
// nowaki.config.mjs
import { defineConfig } from "@nowaki-dev/runtime/config";

export default defineConfig({ site: "https://example.com" });
```

An unknown key is an error at every level, with a "did you mean" hint. Types: [runtime-config.md](/docs/reference/runtime-config/).

## Keys

| Key | Type | Description |
| --- | --- | --- |
| [`site`](#site) | `string` | The site's absolute URL (`https://example.com`), for canonical and Open Graph links, sitemap.xml and robots.txt. |
| [`fonts`](#fonts) | `FontConfig[]` | Self-hosted fonts, downloaded or copied at build time (see [`FontConfig`](/docs/reference/runtime-config/#fontconfig)). |
| [`basePath`](#basepath) | `string` | Serves the app under a path prefix (`"/app"`). |
| [`trailingSlash`](#trailingslash) | `"never" \| "always" \| "ignore"` | `"never"` / `"always"` redirect to the form without / with a trailing slash; `"ignore"` (the default) serves both. |
| [`redirects`](#redirects) | `RuleList<RedirectRule>` | Redirects, checked before routing. |
| [`rewrites`](#rewrites) | `RuleList<RewriteRule>` | Internal rewrites: the request is routed by `destination`, the browser keeps its URL. |
| [`headers`](#headers) | `RuleList<HeaderRule>` | Response headers by path. |
| [`i18n`](#i18n) | `I18nConfig` | Locales: the default one at `/`, the others under `/<locale>/`. |
| [`images`](#images) | `ImagesConfig` | `<Image>` options. |
| [`plugins`](#plugins) | `(NowakiPlugin \| false \| null \| undefined)[]` | Build-time plugins (`@nowaki-dev/markdoc`, or your own [`NowakiPlugin`](/docs/reference/runtime-config/#nowakiplugin)). |

### site

```ts
site?: string
```

The site's absolute URL (`https://example.com`), for canonical and Open Graph links,
sitemap.xml and robots.txt. `NOWAKI_SITE` wins over it at runtime.

### fonts

```ts
fonts?: FontConfig[]
```

Self-hosted fonts, downloaded or copied at build time (see [`FontConfig`](/docs/reference/runtime-config/#fontconfig)).

Accepted keys (from the validator):

- `fonts[]`: `family`, `fallback`, `variable`, `display`, `preload`
- `fonts[] (provider: "google")`: `provider`, `weights`, `styles`, `subsets`
- `fonts[] (local, src)`: `src`, `weight`, `style`
- `fonts[].src[]`: `path`, `weight`, `style`

See [`FontConfig`](/docs/reference/runtime-config/#fontconfig).

### basePath

```ts
basePath?: string
```

Serves the app under a path prefix (`"/app"`). `<Link>`, `href()` and `ctx.redirect` add it.

### trailingSlash

```ts
trailingSlash?: "never" | "always" | "ignore"
```

`"never"` / `"always"` redirect to the form without / with a trailing slash; `"ignore"` (the
default) serves both.

Accepted values (from the validator):

- `trailingSlash`: `never` \| `always` \| `ignore`

### redirects

```ts
redirects?: RuleList<RedirectRule>
```

Redirects, checked before routing. A function (possibly async) is called once, when
`nowaki dev` / `nowaki build` reads the config.

Accepted keys (from the validator):

- `redirects[]`: `source`, `destination`, `permanent`, `statusCode`, `locale`

See [`RuleList`](/docs/reference/runtime-config/#rulelist), [`RedirectRule`](/docs/reference/runtime-config/#redirectrule).

### rewrites

```ts
rewrites?: RuleList<RewriteRule>
```

Internal rewrites: the request is routed by `destination`, the browser keeps its URL.

Accepted keys (from the validator):

- `rewrites[]`: `source`, `destination`, `locale`

See [`RuleList`](/docs/reference/runtime-config/#rulelist), [`RewriteRule`](/docs/reference/runtime-config/#rewriterule).

### headers

```ts
headers?: RuleList<HeaderRule>
```

Response headers by path. They replace the default security headers of the same name.

Accepted keys (from the validator):

- `headers[]`: `source`, `headers`, `locale`
- `headers[].headers[]`: `key`, `value`

See [`RuleList`](/docs/reference/runtime-config/#rulelist), [`HeaderRule`](/docs/reference/runtime-config/#headerrule).

### i18n

```ts
i18n?: I18nConfig
```

Locales: the default one at `/`, the others under `/<locale>/`.

Accepted keys (from the validator):

- `i18n`: `locales`, `defaultLocale`, `prefixDefaultLocale`, `detect`

See [`I18nConfig`](/docs/reference/runtime-config/#i18nconfig).

### images

```ts
images?: ImagesConfig
```

`<Image>` options.

Accepted keys (from the validator):

- `images`: `remotePatterns`
- `images.remotePatterns[]`: `protocol`, `hostname`, `port`, `pathname`

See [`ImagesConfig`](/docs/reference/runtime-config/#imagesconfig).

### plugins

```ts
plugins?: (NowakiPlugin | false | null | undefined)[]
```

Build-time plugins (`@nowaki-dev/markdoc`, or your own [`NowakiPlugin`](/docs/reference/runtime-config/#nowakiplugin)). A falsy entry is
skipped, so `cond && plugin()` works.

See [`NowakiPlugin`](/docs/reference/runtime-config/#nowakiplugin).

## Plugin hooks

A plugin is an object with `load`, `resolveId`, `transform`, `name`: see [`NowakiPlugin`](/docs/reference/runtime-config/#nowakiplugin).
