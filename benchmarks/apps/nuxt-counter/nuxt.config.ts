// Same app as the others: one server-rendered page with one interactive counter.
// `/` is prerendered at build time so its HTML (and the JS it loads) can be measured,
// like Next's prerendered `/` and Astro's static output.
export default defineNuxtConfig({
  compatibilityDate: "2026-11-01",
  devtools: { enabled: false },
  telemetry: false,
  nitro: { prerender: { routes: ["/"] } },
});
