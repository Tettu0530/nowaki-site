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
npx wrangler pages deploy public --project-name nowaki
```

The first run creates the `nowaki` Pages project; later runs publish a new
version. (DNS for nowaki.dev is already on Cloudflare.)

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
