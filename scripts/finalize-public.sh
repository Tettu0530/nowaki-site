#!/usr/bin/env bash
# Post-processing shared by `pnpm prerender` and scripts/prerender.sh.
set -euo pipefail
cd "$(dirname "$0")/.."

# Static files served as-is: robots.txt, llms.txt, /.well-known/ai-catalog.json.
cp -R static/. public/

# The AI Catalog spec serves its well-known document as application/ai-catalog+json.
cat >> public/_headers <<'HEADERS'

/.well-known/ai-catalog.json
  Content-Type: application/ai-catalog+json
  Access-Control-Allow-Origin: *

/llms.txt
  Content-Type: text/markdown; charset=utf-8
  Access-Control-Allow-Origin: *
HEADERS

# nowaki prerender writes each config redirect once, without a trailing slash, and Cloudflare
# Pages matches `_redirects` sources exactly, so /docs/routing/ would 404. Add the slash form of
# every page-like source (reported upstream; drop this once the static output writes both).
if [ -f public/_redirects ]; then
  awk '{ print } $1 !~ /\/$/ && $1 !~ /\.[a-z0-9]+$/ && $1 !~ /[*:]/ && NF >= 2 { print $1 "/", $2, $3 }' public/_redirects > public/_redirects.tmp
  mv public/_redirects.tmp public/_redirects
fi
