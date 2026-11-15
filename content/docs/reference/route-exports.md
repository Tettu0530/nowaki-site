---
title: "Route and island module exports"
source: "docs/reference/route-exports.md"
generated: true
---

Generated from the source by `scripts/gen-reference.mjs`; do not edit by hand. What a route or island module may export, with the types `@nowaki-dev/runtime` gives them. File names and directories are in [file-conventions.md](/docs/reference/file-conventions/).

Check a module against its type with `satisfies` (see [PageModule](/docs/reference/runtime/#pagemodule)).

## PageModule

The exports a page route module (`routes/**/*.tsx`, also `_404` / `_500`) may have, with their types.

Declared in [runtime.md](/docs/reference/runtime/#pagemodule).

| Export | Type | Description |
| --- | --- | --- |
| `default` (required) | `(props: RouteProps<D>) => unknown` | The page component. See [`RouteProps`](/docs/reference/runtime/#routeprops). |
| `loader` | `Loader<D>` | A server-only loader. See [`Loader`](/docs/reference/runtime/#loader). |
| `action` | `Action` | Runs on every method but GET, HEAD and OPTIONS. See [`Action`](/docs/reference/runtime/#action). |
| `meta` | `Meta \| MetaFn<D>` | The page's metadata: an object, or a function of the loader data (see [`MetaFn`](/docs/reference/runtime/#metafn)). See [`Meta`](/docs/reference/runtime/#meta), [`MetaFn`](/docs/reference/runtime/#metafn). |
| `title` | `string` | `<title>`. |
| `head` | `string` | Raw HTML put in `<head>` as written (no escaping: never build it from user input). |
| `lang` | `string` | `<html lang>`. |
| `htmlAttrs` | `DocumentAttrs` | Attributes for `<html>` / `<body>` (`export const htmlAttrs` / `bodyAttrs` in a route or layout, or from `meta()`). See [`DocumentAttrs`](/docs/reference/runtime/#documentattrs). |
| `bodyAttrs` | `DocumentAttrs` | Attributes for `<html>` / `<body>` (`export const htmlAttrs` / `bodyAttrs` in a route or layout, or from `meta()`). See [`DocumentAttrs`](/docs/reference/runtime/#documentattrs). |
| `revalidate` | `Revalidate` | `export const revalidate` on a page route: ISR. See [`Revalidate`](/docs/reference/runtime/#revalidate). |
| `tags` | `RouteTags` | `export const tags` on an ISR page (one with `export const revalidate`): the cache tags its cached copies carry, so `revalidateTag(tag)` can purge them. See [`RouteTags`](/docs/reference/runtime/#routetags). |
| `streaming` | `Streaming` | `export const streaming` on a page route. See [`Streaming`](/docs/reference/runtime/#streaming). |
| `csrf` | `Csrf` | `export const csrf` on a page with an `action`, an API route (`routes/api/**`), or a file route (`feed.xml.ts`). See [`Csrf`](/docs/reference/runtime/#csrf). |
| `budget` | `RouteBudget` | `export const budget` on a page route: the most first-load client JS the page may ship, in KB of gzip (the islands runtime, the islands it can render, and the live runtime). See [`RouteBudget`](/docs/reference/runtime/#routebudget). |
| `viewTransition` | `ViewTransition` | `export const viewTransition = true` on a page route: client navigations to and from the page run as View Transitions (`document.startViewTransition`), and full page loads between two such pages get a cross-document one (`@view-transition { navigation: auto }`), also on pages that ship no JS. See [`ViewTransition`](/docs/reference/runtime/#viewtransition). |
| `staticPaths` | `StaticPaths` | `export const staticPaths` on a dynamic route: the params to prerender with `nowaki prerender` or the static adapter, one page per entry. See [`StaticPaths`](/docs/reference/runtime/#staticpaths). |
| `prerender` | `boolean` | `false` leaves the page out of `nowaki prerender` / the static adapter. |
| `sitemap` | `boolean` | `false` leaves the page out of the generated sitemap.xml. |
| `scripts` | `PageScripts` | `export const scripts` on a page route or layout: modules shipped to the browser as `<script type="module">`, bundled like an island but with no component and no hydration. See [`PageScripts`](/docs/reference/runtime/#pagescripts). |

## LayoutModule

The exports a `_layout` module may have.

Declared in [runtime.md](/docs/reference/runtime/#layoutmodule).

| Export | Type | Description |
| --- | --- | --- |
| `default` (required) | `(props: LayoutProps<D>) => unknown` | The layout component. See [`LayoutProps`](/docs/reference/runtime/#layoutprops). |
| `loader` | `Loader<D>` | A server-only loader. See [`Loader`](/docs/reference/runtime/#loader). |
| `meta` | `Meta \| MetaFn<D>` | Defaults for every page under the layout: the page's (and nearer layouts') values win, and `openGraph` and `twitter` merge one level deep. See [`Meta`](/docs/reference/runtime/#meta), [`MetaFn`](/docs/reference/runtime/#metafn). |
| `title` | `string` | The `<title>` of pages under the layout that set none. |
| `head` | `string` | Raw HTML added to the `<head>` of every page under the layout (root layout first, before the page's own `head`). |
| `lang` | `string` | `<html lang>` of pages under the layout that set none. |
| `htmlAttrs` | `DocumentAttrs` | Attributes for `<html>` / `<body>` (`export const htmlAttrs` / `bodyAttrs` in a route or layout, or from `meta()`). See [`DocumentAttrs`](/docs/reference/runtime/#documentattrs). |
| `bodyAttrs` | `DocumentAttrs` | Attributes for `<html>` / `<body>` (`export const htmlAttrs` / `bodyAttrs` in a route or layout, or from `meta()`). See [`DocumentAttrs`](/docs/reference/runtime/#documentattrs). |
| `scripts` | `PageScripts` | `export const scripts` on a page route or layout: modules shipped to the browser as `<script type="module">`, bundled like an island but with no component and no hydration. See [`PageScripts`](/docs/reference/runtime/#pagescripts). |

## ApiModule

The exports an API route (`routes/api/**`) or a file route (`feed.xml.ts`, `og/[card].png.ts`) may have: one handler per request method (uppercase; a method without one gets 405 unless there is a `default`), `csrf`, and for prerendered file routes `staticPaths` / `prerender`.

Declared in [runtime.md](/docs/reference/runtime/#apimodule).

| Export | Type | Description |
| --- | --- | --- |
| `GET` | `ApiHandler` | An API route handler (a method export or `default`). See [`ApiHandler`](/docs/reference/runtime/#apihandler). |
| `POST` | `ApiHandler` | An API route handler (a method export or `default`). See [`ApiHandler`](/docs/reference/runtime/#apihandler). |
| `PUT` | `ApiHandler` | An API route handler (a method export or `default`). See [`ApiHandler`](/docs/reference/runtime/#apihandler). |
| `PATCH` | `ApiHandler` | An API route handler (a method export or `default`). See [`ApiHandler`](/docs/reference/runtime/#apihandler). |
| `DELETE` | `ApiHandler` | An API route handler (a method export or `default`). See [`ApiHandler`](/docs/reference/runtime/#apihandler). |
| `HEAD` | `ApiHandler` | An API route handler (a method export or `default`). See [`ApiHandler`](/docs/reference/runtime/#apihandler). |
| `OPTIONS` | `ApiHandler` | An API route handler (a method export or `default`). See [`ApiHandler`](/docs/reference/runtime/#apihandler). |
| `default` | `ApiHandler` | Handles every method without its own export. See [`ApiHandler`](/docs/reference/runtime/#apihandler). |
| `csrf` | `Csrf` | `export const csrf` on a page with an `action`, an API route (`routes/api/**`), or a file route (`feed.xml.ts`). See [`Csrf`](/docs/reference/runtime/#csrf). |
| `staticPaths` | `StaticPaths` | `export const staticPaths` on a dynamic route: the params to prerender with `nowaki prerender` or the static adapter, one page per entry. See [`StaticPaths`](/docs/reference/runtime/#staticpaths). |
| `prerender` | `boolean` | `false` leaves the file route out of `nowaki prerender` / the static adapter. |

## MiddlewareModule

A `_middleware` module: its default export runs before the routes under its directory.

Declared in [runtime.md](/docs/reference/runtime/#middlewaremodule).

| Export | Type | Description |
| --- | --- | --- |
| `default` (required) | `Middleware` | Middleware. See [`Middleware`](/docs/reference/runtime/#middleware). |

## IslandModule

An island module (`islands/*.tsx`): the component, and `live` for a Jetstream island.

Declared in [runtime.md](/docs/reference/runtime/#islandmodule).

| Export | Type | Description |
| --- | --- | --- |
| `default` (required) | `(props: any) => unknown` | The island component. |
| `live` | `Live<S>` | `export const live` in an island module: a live island (Jetstream). See [`Live`](/docs/reference/runtime/#live). |

## Where each export applies

From `api/route-exports.txt`, the exports the runtime reads. `<METHOD>` stands for the request-method exports of API and file routes. The `client:*` directives go on island elements, not in a module: see [client-events.md](/docs/reference/client-events/#island-directives).

| Export | Type and modules |
| --- | --- |
| `<METHOD>` | [`ApiHandler`](/docs/reference/runtime/#apihandler) (API / file routes: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS, ... as [`ApiModule`](/docs/reference/runtime/#apimodule) lists them; uppercase only, a lowercase export is an error) |
| `action` | [`Action`](/docs/reference/runtime/#action) (page) |
| `bodyAttrs` | [`DocumentAttrs`](/docs/reference/runtime/#documentattrs) (page, layout) |
| `budget` | [`RouteBudget`](/docs/reference/runtime/#routebudget) (page; a literal, read from the AST) |
| `client:idle` | boolean (island usage) |
| `client:load` | boolean (island usage) |
| `client:media` | string (island usage) |
| `client:only` | boolean (island usage) |
| `client:visible` | boolean (island usage) |
| `csrf` | [`Csrf`](/docs/reference/runtime/#csrf) (page with an action, API and file routes) |
| `default` | component \| [`ApiHandler`](/docs/reference/runtime/#apihandler) \| [`Middleware`](/docs/reference/runtime/#middleware) (page, layout, slot, _404, _500, loading, error, island; API / file route fallback; _middleware) |
| `head` | string (page, layout; [`PageModule`](/docs/reference/runtime/#pagemodule) / [`LayoutModule`](/docs/reference/runtime/#layoutmodule)) |
| `htmlAttrs` | [`DocumentAttrs`](/docs/reference/runtime/#documentattrs) (page, layout) |
| `lang` | string (page, layout; [`PageModule`](/docs/reference/runtime/#pagemodule) / [`LayoutModule`](/docs/reference/runtime/#layoutmodule)) |
| `live` | [`Live`](/docs/reference/runtime/#live) (island) |
| `loader` | [`Loader`](/docs/reference/runtime/#loader) (page, layout, slot) |
| `meta` | [`Meta`](/docs/reference/runtime/#meta) \| [`MetaFn`](/docs/reference/runtime/#metafn) (page, layout) |
| `prerender` | boolean, false opts out (page, file route; [`PageModule`](/docs/reference/runtime/#pagemodule) / [`ApiModule`](/docs/reference/runtime/#apimodule)) |
| `revalidate` | [`Revalidate`](/docs/reference/runtime/#revalidate) (ISR page) |
| `scripts` | [`PageScripts`](/docs/reference/runtime/#pagescripts) (page, layout; read from the AST) |
| `sitemap` | boolean, false opts out (page) |
| `staticPaths` | [`StaticPaths`](/docs/reference/runtime/#staticpaths) (dynamic page, file route) |
| `streaming` | [`Streaming`](/docs/reference/runtime/#streaming) (page) |
| `tags` | [`RouteTags`](/docs/reference/runtime/#routetags) (ISR page) |
| `title` | string (page, layout; [`PageModule`](/docs/reference/runtime/#pagemodule) / [`LayoutModule`](/docs/reference/runtime/#layoutmodule)) |
| `viewTransition` | [`ViewTransition`](/docs/reference/runtime/#viewtransition) (page) |

Not route exports any more (the runtime refuses them with an error):

- `middleware`: removed in 0.20.0 (the old _middleware alias of default; still read only to refuse it with an error)
