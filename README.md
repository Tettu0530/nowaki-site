# nowaki.dev

The landing page and docs for [Nowaki](https://github.com/nowaki-dev/nowaki), built with Nowaki itself.

It uses the published `@nowaki-dev/runtime` and `nowaki` packages from npm, so the site also serves as a check that a released Nowaki works outside the framework's own monorepo.

## Develop

Requires Node.js 22+ and pnpm.

```bash
pnpm install
pnpm dev          # http://127.0.0.1:3000
```

## Layout

```
routes/       pages: / (landing), /ja, and /docs/*
components/   shared server components
islands/      the few client islands (wind animation, copy button, ...)
lib/i18n.ts   landing copy for the en and ja locales
scripts/      prerender.sh (manual static export)
```

## Deploy

The site is pre-rendered to static files and deployed to Cloudflare Pages. See [DEPLOY.md](./DEPLOY.md).

```bash
pnpm prerender    # writes public/
```

## License

[MIT](./LICENSE)
