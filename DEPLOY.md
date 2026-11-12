# Deploying nowaki.dev

The site is fully static — the landing page (`/`, `/ja`) and the docs
(`/docs/*`), with no per-request data — so it ships to any static host. We pre-render it (with
Nowaki) and deploy to Cloudflare Pages.

## 1. Pre-render to static files

```bash
pnpm exec nowaki prerender . --out public
```

(`scripts/prerender.sh` is the equivalent manual flow.) Outputs `public/`:

- `index.html` (`/`), `ja/index.html` (`/ja`)
- `docs/index.html` (`/docs`), `docs/<page>/index.html` (`/docs/<page>`)
- `_nowaki/*` — content-hashed client assets (islands runtime + island chunks)
- `_headers` — immutable cache for `/_nowaki/*`

Requires a prior `pnpm install` (the `nowaki` CLI is a devDependency). The islands still hydrate client-side from `/_nowaki/`, so the page
is interactive on a purely static host.

## 2. Deploy to Cloudflare Pages (direct upload)

```bash
npx wrangler login                  # or export CLOUDFLARE_API_TOKEN=...
# The nowaki project lives in the Tettu0530 account (moved from VorEdge on 2026-11-12).
CLOUDFLARE_ACCOUNT_ID=50cb5fb0fc6ff6261641b0e8c9008ad4 \
  npx wrangler pages deploy public --project-name nowaki --branch main
```

The `nowaki` Pages project already exists, so each run publishes a new version.
To recreate it, run `npx wrangler pages project create nowaki --production-branch main --force`
once: wrangler 4.160+ otherwise delegates the new project to Workers and fails.
(DNS for nowaki.dev is already on Cloudflare, in the same account.)

## 3. Attach the domain

Cloudflare dashboard → **Workers & Pages → nowaki → Custom domains** → add
`nowaki.dev` (and `www.nowaki.dev` if desired).

## Notes

- Cloudflare Pages reserves `_headers` / `_redirects` / `_routes.json`; the
  `_nowaki/` asset directory is served normally.
- Styles are plain CSS inlined by the page; fonts are self-hosted Geist
  (`assets/fonts/`, Latin subsets, OFL). `pnpm prerender` copies the woff2
  files into `public/_nowaki/`, because Nowaki does not yet emit assets that
  server components import (Tettu0530/nowaki#17).
- `static/` is copied into `public/` as-is by `scripts/finalize-public.sh`:
  `robots.txt`, `llms.txt`, and `/.well-known/ai-catalog.json` (served as
  `application/ai-catalog+json` via `_headers`).
- Pages serves every page at a trailing-slash URL (`/ja/`, `/docs/routing/`)
  and 308-redirects the bare form, so internal links use the slash.
