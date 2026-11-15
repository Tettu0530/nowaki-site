---
title: "Nowaki reference"
source: "docs/reference/README.md"
generated: true
---

Generated from the source by `scripts/gen-reference.mjs`; do not edit by hand. Every page here is written by `node scripts/gen-reference.mjs` from the type declarations, the `api/` snapshots and the code, and CI fails when they are out of date. To change a page, change its source (usually a `.d.ts` doc comment or `scripts/gen-reference-data.mjs`) and regenerate: see [CONTRIBUTING.md](https://github.com/Tettu0530/nowaki/blob/v1.0.0-rc.2/CONTRIBUTING.md#api-reference).

What is covered by semver, and what is not: [STABILITY.md](/docs/stability/). The exact list of stable names: [`api/`](https://github.com/Tettu0530/nowaki/blob/v1.0.0-rc.2/api/README.md).

## Packages

| Import | Page | Exports |
| --- | --- | --- |
| `@nowaki-dev/runtime` | [runtime.md](/docs/reference/runtime/) | `RouteParams`, `CookieOptions`, `ResponseInit`, `Session`, `NowakiResult`, `LoaderContext`, `Loader`, `Action`, `StaticPaths`, `RouteBudget`, `Streaming`, `Csrf`, `ApiHandler`, `Middleware`, `DocumentAttrs`, `Meta`, `OpenGraphImage`, `MetaFn`, `RouteProps`, `PageProps`, `LayoutProps`, `LoadingComponent`, `ErrorPageProps`, `Live`, `publish`, `RouteTags`, `revalidatePath`, `revalidateTag`, `getContext`, `nonce`, `StandardSchemaV1`, `StandardSchemaResult`, `serverFn`, `ServerFnError`, `ViewTransition`, `Revalidate`, `PageScripts`, `PageModule`, `LayoutModule`, `ApiModule`, `MiddlewareModule`, `IslandModule`, `getLocale`, `href`, `localePath`, `setLocale` |
| `@nowaki-dev/runtime/config` | [runtime-config.md](/docs/reference/runtime-config/) | `NowakiConfig`, `RuleList`, `RedirectRule`, `RewriteRule`, `HeaderRule`, `I18nConfig`, `ImagesConfig`, `FontConfig`, `GoogleFont`, `LocalFont`, `PluginCode`, `NowakiPlugin`, `defineConfig` |
| `@nowaki-dev/runtime/content` | [runtime-content.md](/docs/reference/runtime-content/) | `ContentHeading`, `CollectionDefinition`, `ContentEntry`, `Collections`, `CollectionData`, `defineCollection`, `CollectionQuery`, `getCollection`, `getEntry` |
| `@nowaki-dev/runtime/env` | [runtime-env.md](/docs/reference/runtime-env/) | `EnvDefinition`, `EnvOutput`, `EnvValues`, `ServerEnvOf`, `PublicEnvOf`, `defineEnv` |
| `@nowaki-dev/runtime/env/server` | [runtime-env-server.md](/docs/reference/runtime-env-server/) | `ServerEnv`, `env` |
| `@nowaki-dev/runtime/image` | [runtime-image.md](/docs/reference/runtime-image/) | `ImageSource`, `ImageProps`, `Image` |
| `@nowaki-dev/runtime/jsx-dev-runtime` | [runtime-jsx-dev-runtime.md](/docs/reference/runtime-jsx-dev-runtime/) | `ServerFormAction`, `FormAttributes`, `Fragment`, `jsx`, `jsxDEV`, `jsxs` |
| `@nowaki-dev/runtime/jsx-runtime` | [runtime-jsx-runtime.md](/docs/reference/runtime-jsx-runtime/) | `ServerFormAction`, `FormAttributes`, `Fragment`, `jsx`, `jsxDEV`, `jsxs` |
| `@nowaki-dev/runtime/navigation` | [runtime-navigation.md](/docs/reference/runtime-navigation/) | `NowakiRoutes`, `RoutePath`, `Href`, `route`, `LinkProps`, `Link`, `HrefOptions`, `href`, `getLocale`, `localePath`, `setLocale`, `routePath`, `transitionName` |
| `@nowaki-dev/runtime/session` | [runtime-session.md](/docs/reference/runtime-session/) | `StoredSession`, `SessionStore`, `SessionOptions`, `SessionConfig`, `defineSession` |
| `@nowaki-dev/markdoc` | [markdoc.md](/docs/reference/markdoc/) | `Schema`, `MarkdocOptions`, `markdoc`, `compileMarkdoc`, `Tag`, `nodes`, `tags`, `functions`, `NowakiPlugin` |
| `@nowaki-dev/markdoc/render` | [markdoc-render.md](/docs/reference/markdoc-render/) | `MarkdocNode`, `renderMarkdoc` |

## App surface

- [Route and island module exports](/docs/reference/route-exports/): `PageModule`, `LayoutModule`, `ApiModule`, `MiddlewareModule`, `IslandModule`
- [File conventions](/docs/reference/file-conventions/): `routes/`, `islands/`, `content/`, `public/`, `env.ts`, `session.ts`, `nowaki.config.mjs`
- [nowaki.config](/docs/reference/config/): every key
- [CLI](/docs/reference/cli/): `nowaki` commands and flags, `create-nowaki`
- [Environment variables](/docs/reference/env-vars/)
- [Endpoints](/docs/reference/endpoints/): `/__nowaki/health`, `/__nowaki/revalidate`, reserved paths
- [Headers and cookies](/docs/reference/headers/): security headers, CSP, cache headers, `x-nowaki-cache`, cookies
- [Client events and attributes](/docs/reference/client-events/): `client:*` directives, `nowaki:*` events, `data-live*`, `data-nowaki-*`

## Other docs

- [Guides, one per feature (index)](/docs/)
- [Deployment, one page per adapter](/docs/deploy/)
- [Troubleshooting](/docs/troubleshooting/)
- [Upgrading to 1.0](/docs/upgrade-to-1.0/)
- [Migrating from Next.js](/docs/migrate-from-nextjs/)
- [Migrating from Astro](/docs/migrate-from-astro/)
- [Stability and versioning](/docs/stability/)
