#!/usr/bin/env bash
# Prerenders nowaki.dev (landing + docs) to static files.
# `pnpm prerender` (nowaki prerender) is the canonical flow; this is the manual equivalent.
# Output: public/  (deployable as-is to static hosts like Cloudflare Pages)
#   /        -> public/index.html
#   /ja      -> public/ja/index.html
#   /docs/*  -> public/docs/**/index.html  (one per routes/docs/*.tsx)
#   /_nowaki -> public/_nowaki/*   (content-hashed client assets)
# Requires: `pnpm install` (provides the nowaki CLI). Override with NOWAKI=/path/to/nowaki.
set -euo pipefail

SITE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${PORT:-8799}"
NOWAKI="${NOWAKI:-$SITE_DIR/node_modules/.bin/nowaki}"

cd "$SITE_DIR"

echo "[prerender] build"
rm -rf dist
"$NOWAKI" build .

echo "[prerender] start (port $PORT)"
"$NOWAKI" start . --port "$PORT" >/tmp/nowaki-prerender.log 2>&1 &
SERVER_PID=$!
# The nowaki bin is a wrapper; stop the server it spawned as well.
trap 'pkill -P "$SERVER_PID" 2>/dev/null; kill "$SERVER_PID" 2>/dev/null || true' EXIT

for _ in $(seq 1 60); do
  if curl -sf "http://127.0.0.1:$PORT/" >/dev/null 2>&1; then break; fi
  sleep 0.25
done

echo "[prerender] render pages -> public/"
rm -rf public
mkdir -p public/ja public/_nowaki
curl -sf "http://127.0.0.1:$PORT/" -o public/index.html
curl -sf "http://127.0.0.1:$PORT/ja" -o public/ja/index.html
for f in routes/docs/*.tsx; do
  name="$(basename "$f" .tsx)"
  case "$name" in
    _*) continue ;;
    index) route="/docs"; out="public/docs" ;;
    *) route="/docs/$name"; out="public/docs/$name" ;;
  esac
  mkdir -p "$out"
  curl -sf "http://127.0.0.1:$PORT$route" -o "$out/index.html"
done
cp -R dist/client/. public/_nowaki/

# Cloudflare Pages: long-lived immutable caching for hashed assets
cat > public/_headers <<'HEADERS'
/_nowaki/*
  Cache-Control: public, max-age=31536000, immutable
HEADERS

bash scripts/finalize-public.sh

echo "[prerender] done -> $SITE_DIR/public"
