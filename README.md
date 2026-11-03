# nowaki.dev

The landing page and docs for [Nowaki](https://github.com/Tettu0530/nowaki), built with Nowaki itself.

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
islands/      client islands (only the copy button; the island map is CSS)
lib/          copy (i18n.ts), landing and docs styles, version and bundle size
assets/fonts/ self-hosted Geist, Geist Mono, Geist Serif (Latin subsets, OFL)
static/       robots.txt, llms.txt, .well-known/ai-catalog.json (copied to public/)
scripts/      prerender.sh (manual static export)
```

## Deploy

The site is pre-rendered to static files and deployed to Cloudflare Pages. See [DEPLOY.md](./DEPLOY.md).

```bash
pnpm prerender    # writes public/
```

## License

[MIT](./LICENSE)
