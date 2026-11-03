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
