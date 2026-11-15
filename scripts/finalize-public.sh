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

# Nowaki 0.20.0 writes each config redirect once, without a trailing slash, and Cloudflare Pages
# matches `_redirects` sources exactly, so /docs/routing/ would 404. Add the slash form of every
# page-like source that lacks one. 1.0.0-rc.2 writes both forms itself, so this adds nothing
# there; delete it once the site builds on 1.0.
if [ -f public/_redirects ]; then
  awk 'NR == FNR { have[$1] = 1; next }
       { print }
       $1 !~ /\/$/ && $1 !~ /\.[a-z0-9]+$/ && $1 !~ /[*:]/ && NF >= 2 && !(($1 "/") in have) { print $1 "/", $2, $3 }' \
    public/_redirects public/_redirects > public/_redirects.tmp
  mv public/_redirects.tmp public/_redirects
fi
