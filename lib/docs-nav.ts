// The docs sidebar: the site's own Overview and Quickstart, then the framework docs synced from
// Tettu0530/nowaki (content/docs/, see scripts/sync-docs.mjs) in the order of its docs/README.md.
// The pager and the chapter numbers follow this order.
export type DocLink = { href: string; label: string; mono?: boolean };
export type DocGroup = { title: string; items: DocLink[] };

const g = (slug: string, label: string, mono = false): DocLink => ({ href: `/docs/${slug}/`, label, mono });

export const DOC_GROUPS: DocGroup[] = [
  {
    title: "Start",
    items: [
      { href: "/docs/", label: "Overview" },
      { href: "/docs/quickstart/", label: "Quickstart" },
    ],
  },
  {
    title: "Guides",
    items: [
      g("guides/routing", "Routing"),
      g("guides/data", "Data"),
      g("guides/layouts-and-middleware", "Layouts and middleware"),
      g("guides/islands", "Islands and hydration"),
      g("guides/jetstream", "Jetstream live islands"),
      g("guides/content", "Content"),
      g("guides/images-and-fonts", "Images and fonts"),
      g("guides/seo", "SEO and metadata"),
      g("guides/routing-config", "Routing config"),
      g("guides/i18n", "i18n"),
      g("guides/sessions-and-env", "Sessions and env"),
      g("guides/caching", "Caching"),
      g("guides/view-transitions", "View Transitions"),
      g("guides/observability", "Observability"),
      g("guides/security", "Security"),
      g("guides/dev-experience", "Dev experience"),
      g("guides/plugins", "Plugins"),
    ],
  },
  {
    title: "Deploy",
    items: [
      g("deploy", "Where to deploy"),
      g("deploy/self-hosted", "nowaki start", true),
      g("deploy/node", "Node"),
      g("deploy/bun", "Bun"),
      g("deploy/deno", "Deno"),
      g("deploy/cloudflare", "Cloudflare Workers"),
      g("deploy/vercel", "Vercel"),
      g("deploy/static", "Static output"),
    ],
  },
  {
    title: "Reference",
    items: [
      g("reference", "Reference index"),
      g("reference/runtime", "@nowaki-dev/runtime", true),
      g("reference/runtime-config", "…/config", true),
      g("reference/runtime-content", "…/content", true),
      g("reference/runtime-env", "…/env", true),
      g("reference/runtime-env-server", "…/env/server", true),
      g("reference/runtime-image", "…/image", true),
      g("reference/runtime-jsx-dev-runtime", "…/jsx-dev-runtime", true),
      g("reference/runtime-jsx-runtime", "…/jsx-runtime", true),
      g("reference/runtime-navigation", "…/navigation", true),
      g("reference/runtime-session", "…/session", true),
      g("reference/markdoc", "@nowaki-dev/markdoc", true),
      g("reference/markdoc-render", "…/markdoc/render", true),
      g("reference/route-exports", "Route module exports"),
      g("reference/file-conventions", "File conventions"),
      g("reference/config", "nowaki.config", true),
      g("reference/cli", "CLI"),
      g("reference/env-vars", "Environment variables"),
      g("reference/endpoints", "Endpoints"),
      g("reference/headers", "Headers and cookies"),
      g("reference/client-events", "Client events"),
    ],
  },
  {
    title: "Upgrade and migrate",
    items: [
      g("upgrade-to-1.0", "Upgrading to 1.0"),
      g("migrate-from-nextjs", "From Next.js"),
      g("migrate-from-astro", "From Astro"),
    ],
  },
  {
    title: "Help",
    items: [
      g("troubleshooting", "Troubleshooting"),
      g("stability", "Stability and support"),
    ],
  },
];

export const DOC_NAV: DocLink[] = DOC_GROUPS.flatMap((grp) => grp.items);
