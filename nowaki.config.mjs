// nowaki.dev's routing config. The docs chapters written by hand before 1.0 moved to the
// framework docs synced from Tettu0530/nowaki (content/docs/); old links keep working.
import { defineConfig } from "@nowaki-dev/runtime/config";

const moved = {
  "/docs/routing": "/docs/guides/routing/",
  "/docs/content": "/docs/guides/content/",
  "/docs/larger-apps": "/docs/guides/routing-config/",
  "/docs/server-functions": "/docs/guides/data/",
  "/docs/jetstream": "/docs/guides/jetstream/",
  "/docs/plugins": "/docs/guides/plugins/",
  "/docs/observability": "/docs/guides/observability/",
  "/docs/security": "/docs/guides/security/",
  "/docs/migrate": "/docs/migrate-from-nextjs/",
  "/docs/migrate-astro": "/docs/migrate-from-astro/",
};

export default defineConfig({
  // One rule per page: the trailing-slash form matches it too (and the static _redirects
  // is written without the slash, which Cloudflare Pages matches either way).
  redirects: Object.entries(moved).map(([from, to]) => ({ source: from, destination: to, permanent: true })),
});
