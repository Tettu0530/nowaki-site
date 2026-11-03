import { BASE_CSS, LANDING_CSS, FONT_PRELOADS, FAVICON } from "./landing-style.ts";

export const locales = ["en", "ja"] as const;
export type Locale = (typeof locales)[number];

export const GH = "https://github.com/Tettu0530/nowaki";
export const CRATES = "https://crates.io/crates/nowaki";
export const NPM = "https://www.npmjs.com/package/nowaki";

export const STRINGS = {
  en: {
    title: "Nowaki: a full-stack web framework on a Rust toolchain, installed with npm",
    desc: "Nowaki (野分) is a full-stack web framework on a Rust toolchain (oxc). Pages render to HTML; only the islands you mark ship JavaScript, and Jetstream islands ship none. Installed with npm, no Rust required.",
    ogTitle: "Nowaki: full-stack like Next.js, islands like Astro, installed with npm",
    nav: { docs: "Docs", github: "GitHub", compare: "Compare", start: "Get started", lang: "Language", menu: "Menu" },
    hero: {
      latest: "Latest release",
      notes: "Release notes",
      h1a: "Full-stack like Next.js.",
      h1b: "<em>Islands</em> like Astro.",
      sub: "Routes, loaders and actions, rendered to HTML. Only the islands you mark ship JavaScript, and a Jetstream island ships none.",
      note: "No Rust needed. Alpha: the API may still change.",
      docs: "Quickstart",
      key: ["HTML, 0 KB JS", "Island, hydrates", "Jetstream, stays live", "Illustration"],
    },
    release: {
      h2: "New in this release",
      items: [
        { title: "Static dynamic routes", body: `<code>export const staticPaths</code> on a <code>[param]</code> route prerenders one page per entry, plus <code>404.html</code>.` },
        { title: "React libraries render", body: `<code>react</code> imports in node_modules resolve to <code>preact/compat</code> on the server too.` },
        { title: "Runs on Windows", body: `<code>nowaki dev</code>, <code>build</code> and <code>start</code>. Also preact 11.` },
        { title: "Jetstream keeps its state", body: "Patches carry signed state, so a reconnect resumes where it was." },
      ],
    },
    proof: {
      h2: "This page ships {kb} KB of JavaScript.",
      lead: "Two copy buttons are the only code that runs here. Everything that moves is CSS.",
      groups: ["This site, gzip", "Same counter app: first-load JS, gzip", "Same counter app: production build", "Same counter app: dev server ready, cold"],
      bars: [
        { label: "This page", value: "{kb} KB", group: 0 },
        { label: "A page with no islands", value: "0 KB", group: 0 },
        { label: "Nowaki", value: "9.1 KB", group: 1 },
        { label: "Astro 7.4", value: "10.4 KB", group: 1, muted: true },
        { label: "Next.js 16.4, app router", value: "132.0 KB", group: 1, muted: true },
        { label: "Nowaki", value: "20 ms", group: 2 },
        { label: "Astro 7.4", value: "721 ms", group: 2, muted: true },
        { label: "Next.js 16.4", value: "2087 ms", group: 2, muted: true },
        { label: "Nowaki", value: "82 ms", group: 3 },
        { label: "Astro 7.4", value: "1119 ms", group: 3, muted: true },
        { label: "Next.js 16.4", value: "261 ms", group: 3, muted: true },
      ],
      note: "Head-to-head from <code>benchmarks/head-to-head.mjs</code>, all three on one machine. Numbers move between runs; the orders of magnitude are the point.",
      ledger: { h3: "What the {kb} KB is", total: "Total, gzip -9", note: "Computed from this build." },
    },
    jet: {
      h2: "One click, zero component JavaScript.",
      lead: "A live island keeps its state on the server. Press it.",
      steps: [
        { t: "Click", d: "A ~2 KB runtime, no component code." },
        { t: "WebSocket", d: "To the Rust server." },
        { t: "Re-render", d: "Node renders the island." },
        { t: "Patch", d: "HTML back down the socket." },
        { t: "Morph", d: "Applied in place." },
      ],
      demo: {
        like: "Like",
        liked: "Liked",
        label: "Like (a simulated Jetstream island)",
        state: "Server state",
        js: "JavaScript this demo uses",
        jsVal: "0 bytes",
        note: "Simulated in CSS, not to scale. Live on <code>nowaki dev</code> and <code>nowaki start</code>; the other adapters render the island's first HTML only.",
      },
    },
    build: {
      h2: "Write a route. Mark an island. Ship.",
      more: "All features in the docs",
      tiles: [
        { t: "Islands, zero JS by default", d: "Pages render to HTML. Only the components you mark ship JavaScript.", href: "/docs/" },
        { t: "File-based routing", d: "Layouts, middleware, loaders, actions and API routes, one file each.", href: "/docs/routing/" },
        { t: "A Rust toolchain", d: "oxc parses, bundles and hashes. Node renders with Preact, so npm packages work.", href: "/docs/quickstart/" },
      ],
      legend: ["HTML, 0 KB JS", "Island"],
      resolver: { idle: "waiting for a request", label: "Resolver", params: "params", method: "method" },
    },
    compare: {
      h2: "Next to Next.js and Astro.",
      lead: "Where it differs, and where it doesn't.",
      cols: ["Nowaki", "Next.js", "Astro"],
      onlyTag: "Only Nowaki",
      rows: [
        { feature: "Live islands, zero client JS", nowaki: "Jetstream", next: "RSC ships React", astro: "Server Islands render once", highlight: true },
        { feature: "Toolchain", nowaki: "Rust (oxc)", next: "Turbopack (SWC)", astro: "Vite, Rolldown" },
        { feature: "JavaScript by default", nowaki: "Zero, islands only", next: "React and hydration", astro: "Zero, islands only" },
        { feature: "Full-stack app", nowaki: "Loaders, actions, API", next: "Mature", astro: "Growing" },
        { feature: "Maturity", nowaki: "Alpha", next: "Mature", astro: "Mature" },
      ],
      note: "Server functions, streaming SSR and deploy adapters exist in all three.",
    },
    fit: {
      h2: "Where it fits, and where it stands.",
      roadmap: "Read the roadmap",
      forTitle: "A good fit",
      for: ["Pages that are mostly content and server data.", "Forms and auth without a client runtime everywhere."],
      notTitle: "Not yet",
      not: ["Apps where nearly everything is stateful.", "Production-critical work: it is alpha."],
      soonTitle: "Before 1.0",
      soon: ["State-preserving HMR", "Scoped CSS for .tsrx islands", "RSC-style streaming boundaries", "A stable public API"],
    },
    close: { h2: "Start with one command.", docs: "Read the quickstart" },
    footer: {
      tagline: "A full-stack web framework on a Rust toolchain. Zero JS by default, installed with npm.",
      copyright: "MIT © 2026 Tettu0530",
      windName: "野分 · an autumn typhoon wind",
      trademark: "Next.js is a trademark of Vercel, Inc. Astro is a trademark of The Astro Technology Company. Nowaki is an independent project, not affiliated with or endorsed by either.",
    },
    copy: { copy: "copy", copied: "copied" },
  },

  ja: {
    title: "Nowaki: npm で入る、Rust 製ツールチェーンのフルスタックWebフレームワーク",
    desc: "Nowaki（野分）は Rust（oxc）のツールチェーンで動くフルスタックWebフレームワークです。ページは HTML で返し、JavaScript を送るのはマークした島だけ。Jetstream の島はそれすら送りません。npm で入り、Rust は不要です。",
    ogTitle: "Nowaki: Next.js 流のフルスタック、Astro 流の Islands。npm で入る",
    nav: { docs: "ドキュメント", github: "GitHub", compare: "比較", start: "はじめる", lang: "言語", menu: "メニュー" },
    hero: {
      latest: "最新リリース",
      notes: "リリースノート（英語）",
      h1a: "Next.js 流のフルスタック。",
      h1b: "Astro 流の <em>Islands</em>。",
      sub: "ルート・loader・action を HTML で返します。JavaScript を送るのはマークした島だけ。Jetstream の島はそれすら送りません。",
      note: "Rust は不要。alpha 版なので、API はまだ変わります。",
      docs: "クイックスタート（英語）",
      key: ["HTML、JS は 0 KB", "島、ハイドレートする", "Jetstream、live のまま", "図解"],
    },
    release: {
      h2: "このリリースで入ったもの",
      items: [
        { title: "動的ルートも静的に書き出す", body: `<code>[param]</code> のルートに <code>staticPaths</code> を書けば1ページずつ prerender。<code>404.html</code> も。` },
        { title: "React のライブラリも SSR", body: `node_modules の <code>react</code> を、サーバー側でも <code>preact/compat</code> に向けます。` },
        { title: "Windows で動く", body: `<code>nowaki dev</code>・<code>build</code>・<code>start</code>。preact 11 にも対応。` },
        { title: "Jetstream が状態を保つ", body: "patch に署名付きの state を載せ、再接続しても続きから。" },
      ],
    },
    proof: {
      h2: "このページが送る JavaScript は {kb} KB。",
      lead: "ここで動くコードは2つのコピーボタンだけです。動いているものはすべて CSS です。",
      groups: ["このサイト（gzip 後）", "同じカウンタアプリ：first-load JS（gzip 後）", "同じカウンタアプリ：本番ビルド", "同じカウンタアプリ：dev サーバーの起動（cold）"],
      bars: [
        { label: "このページ", value: "{kb} KB", group: 0 },
        { label: "島の無いページ", value: "0 KB", group: 0 },
        { label: "Nowaki", value: "9.1 KB", group: 1 },
        { label: "Astro 7.4", value: "10.4 KB", group: 1, muted: true },
        { label: "Next.js 16.4（app router）", value: "132.0 KB", group: 1, muted: true },
        { label: "Nowaki", value: "20 ms", group: 2 },
        { label: "Astro 7.4", value: "721 ms", group: 2, muted: true },
        { label: "Next.js 16.4", value: "2087 ms", group: 2, muted: true },
        { label: "Nowaki", value: "82 ms", group: 3 },
        { label: "Astro 7.4", value: "1119 ms", group: 3, muted: true },
        { label: "Next.js 16.4", value: "261 ms", group: 3, muted: true },
      ],
      note: "直接比較は <code>benchmarks/head-to-head.mjs</code> によるもので、3つとも同じマシンで測っています。数値は回ごとに揺れます。見てほしいのは桁の違いです。",
      ledger: {
        h3: "{kb} KB の内訳",
        total: "合計（gzip -9）",
        note: "このビルドから計算しています。",
        roles: { "Island runtime": "島ランタイム", "Router core": "ルーターのコア", "Page router": "ページルーター", "Preact": "Preact", "Preact hooks": "Preact hooks", "JSX runtime": "JSX ランタイム", "CopyCommand island": "コピーボタンの島" },
      },
    },
    jet: {
      h2: "1回のクリック、コンポーネント JS はゼロ。",
      lead: "live の島は、状態をサーバーに置きます。押してみてください。",
      steps: [
        { t: "クリック", d: "~2 KB のランタイムだけ。コンポーネントのコードは無し。" },
        { t: "WebSocket", d: "Rust サーバーへ。" },
        { t: "再描画", d: "Node が島を描き直す。" },
        { t: "パッチ", d: "HTML をソケットで返す。" },
        { t: "反映", d: "その場で DOM に当てる。" },
      ],
      demo: {
        like: "いいね",
        liked: "いいね済み",
        label: "いいね（Jetstream の島のシミュレーション）",
        state: "サーバーの状態",
        js: "このデモが使う JavaScript",
        jsVal: "0 バイト",
        note: "CSS によるシミュレーションで、時間の比率は実際とは異なります。live に動くのは <code>nowaki dev</code> と <code>nowaki start</code> で、ほかのアダプタでは島の最初の HTML だけを描きます。",
      },
    },
    build: {
      h2: "ルートを書き、島をマークして、公開する。",
      more: "すべての機能はドキュメントへ（英語）",
      tiles: [
        { t: "デフォルトで島・JS ゼロ", d: "ページは HTML で返し、JavaScript を送るのはマークしたコンポーネントだけ。", href: "/docs/" },
        { t: "ファイルベースのルーティング", d: "layout・middleware・loader・action・API ルートを、1ファイルずつ。", href: "/docs/routing/" },
        { t: "Rust のツールチェーン", d: "oxc がパース・バンドル・ハッシュ化。描画は Node の Preact なので npm パッケージがそのまま使えます。", href: "/docs/quickstart/" },
      ],
      legend: ["HTML、JS は 0 KB", "島"],
      resolver: { idle: "リクエスト待ち", label: "Resolver", params: "params", method: "method" },
    },
    compare: {
      h2: "Next.js・Astro と並べると。",
      lead: "違うところと、違わないところ。",
      cols: ["Nowaki", "Next.js", "Astro"],
      onlyTag: "Nowaki だけ",
      rows: [
        { feature: "生きた島、クライアント JS ゼロ", nowaki: "Jetstream", next: "RSC は React を送る", astro: "Server Islands は一度描くだけ", highlight: true },
        { feature: "ツールチェーン", nowaki: "Rust（oxc）", next: "Turbopack（SWC）", astro: "Vite、Rolldown" },
        { feature: "デフォルトの JavaScript", nowaki: "ゼロ。島だけ", next: "React とハイドレーション", astro: "ゼロ。島だけ" },
        { feature: "フルスタックなアプリ", nowaki: "loader・action・API", next: "成熟", astro: "成長中" },
        { feature: "成熟度", nowaki: "alpha", next: "成熟", astro: "成熟" },
      ],
      note: "サーバー関数・ストリーミング SSR・デプロイアダプタは3つともにあります。",
    },
    fit: {
      h2: "向く場面と、いまの現在地。",
      roadmap: "ロードマップを読む（英語）",
      forTitle: "向いている",
      for: ["本文とサーバーデータが大半のページ。", "全ページにランタイムを積まずに、フォームと認証。"],
      notTitle: "まだ向いていない",
      not: ["ほぼすべてが状態を持つアプリ。", "本番クリティカルな用途。alpha です。"],
      soonTitle: "1.0 までに",
      soon: ["状態を保つ HMR", ".tsrx 島の scoped CSS", "RSC 風のストリーミング境界", "公開 API の安定化"],
    },
    close: { h2: "コマンドひとつで始める。", docs: "クイックスタートを読む（英語）" },
    footer: {
      tagline: "Rust ツールチェーンのフルスタックWebフレームワーク。デフォルトで JS ゼロ、npm で入ります。",
      copyright: "MIT © 2026 Tettu0530",
      windName: "野分 · 秋の台風の風",
      trademark: "Next.js は Vercel, Inc.、Astro は The Astro Technology Company の商標です。Nowaki は独立したプロジェクトであり、いずれとも提携・公認関係はありません。",
    },
    copy: { copy: "コピー", copied: "コピー済み" },
  },
} as const;

export function headFor(locale: Locale): string {
  const s = STRINGS[locale];
  const url = locale === "ja" ? "https://nowaki.dev/ja/" : "https://nowaki.dev/";
  return `
<meta name="description" content="${s.desc}" />
<meta name="theme-color" content="#0b0d10" />
${FAVICON}
<meta property="og:type" content="website" />
<meta property="og:title" content="${s.ogTitle}" />
<meta property="og:description" content="${s.desc}" />
<meta property="og:locale" content="${locale === "ja" ? "ja_JP" : "en_US"}" />
<meta property="og:url" content="${url}" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="alternate" hreflang="en" href="https://nowaki.dev/" />
<link rel="alternate" hreflang="ja" href="https://nowaki.dev/ja/" />
<link rel="alternate" hreflang="x-default" href="https://nowaki.dev/" />
${FONT_PRELOADS}
<style>${BASE_CSS}${LANDING_CSS}</style>`;
}
