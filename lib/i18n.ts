import { BASE_CSS, LANDING_CSS, EXPLAINER_CSS, FONT_PRELOADS, FAVICON } from "./landing-style.ts";

export const locales = ["en", "ja"] as const;
export type Locale = (typeof locales)[number];

export const GH = "https://github.com/Tettu0530/nowaki";
export const SITE_GH = "https://github.com/Tettu0530/nowaki-site";
export const CRATES = "https://crates.io/crates/nowaki";
export const NPM = "https://www.npmjs.com/package/nowaki";

export const STRINGS = {
  en: {
    title: "Nowaki: a full-stack web framework on a Rust toolchain, installed with npm",
    desc: "Nowaki (野分) is a full-stack web framework on a Rust toolchain (oxc). Pages render to HTML; only the islands you mark ship JavaScript, and Jetstream islands ship none. Installed with npm, no Rust required.",
    ogTitle: "Nowaki: full-stack like Next.js, islands like Astro, installed with npm",
    nav: { docs: "Docs", jetstream: "Jetstream", architecture: "Architecture", github: "GitHub", compare: "Compare", start: "Get started", lang: "Language", menu: "Menu" },
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
        { title: "Security headers by default", body: "nosniff, SAMEORIGIN framing, a referrer policy and COOP on every response, adapters included. Headers you set are kept." },
        { title: "Cross-site posts stopped", body: `Page actions answer cross-site posts with 403. <code>export const csrf</code> switches it per route.` },
        { title: "Validated server functions", body: `<code>serverFn(schema, impl)</code> checks input with zod, valibot or arktype. Only <code>ServerFnError</code> messages reach the client.` },
        { title: "CSP with nonces, opt-in", body: `<code>NOWAKI_CSP=report-only</code> or <code>enforce</code> adds a per-response nonce to every script and style.` },
      ],
    },
    proof: {
      h2: "This page ships {kb} KB of JavaScript.",
      lead: "Two copy buttons are the only code that runs here. Everything that moves is CSS.",
      groups: ["This site, gzip"],
      bars: [
        { label: "This page", value: "{kb} KB", group: 0 },
        { label: "A page with no islands", value: "0 KB", group: 0 },
      ],
      note: `How that compares with Astro, SvelteKit, Next.js and Nuxt on one app is <a class="tlink" href="#bench">measured below</a>.`,
      ledger: { h3: "What the {kb} KB is", total: "Total, gzip -9", note: "Computed from this build." },
    },
    jet: {
      h2: "One click, zero component JavaScript.",
      lead: "A live island keeps its state on the server. Press it.",
      steps: [
        { t: "Click", d: "A 1.5 KB runtime, no component code." },
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
        more: "How Jetstream works",
        note: "Simulated in CSS, not to scale. Live on <code>nowaki dev</code> and <code>nowaki start</code>; the other adapters render the island's first HTML only.",
      },
    },
    build: {
      h2: "Write a route. Mark an island. Ship.",
      more: "All features in the docs",
      tiles: [
        { t: "File-based routing", d: "Layouts, middleware, loaders, actions and API routes, one file each.", href: "/docs/routing/" },
        { t: "Islands, zero JS by default", d: "Pages render to HTML. Only the components you mark ship JavaScript.", href: "/docs/" },
        { t: "A Rust toolchain", d: "oxc parses, bundles and hashes. Node renders with Preact, so npm packages work.", href: "/architecture/" },
      ],
      legend: ["HTML, 0 KB JS"],
      flow: { render: "HTML", ship: "Client JavaScript is the island and its runtime. The rest of the page ships none." },
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
      bench: {
        h3: "Five frameworks, one app, measured.",
        lead: "The same page with one counter, built and started on one machine. Lower is better.",
        groups: ["Dev server, first page, cold", "Production build, HTML included", "JavaScript on first load, gzip"],
        note: "Median of {runs} runs on {machine}, {date}. Caches cleared before every run. Dev is timed from start until <code>/</code> returns the page, and the build includes writing the HTML (for Nowaki, <code>nowaki prerender</code>). First-load JavaScript is everything the browser runs for <code>/</code>: files and inline scripts, measured in headless Chromium. Nowaki's {idle} KB includes its client router, which loads once the page is idle. The app is tiny, so these numbers mostly show each framework's fixed cost.",
        method: "Apps, scripts and raw runs",
      },
      scale: {
        h3: "At scale: one blog, 1 to 1000 pages.",
        lead: "The same blog, with a dynamic route, a nested layout and Markdown, generated at four sizes. The slope is what each extra page costs.",
        charts: ["Static build, every page to HTML", "Dev server, first page, cold"],
        axis: "pages",
        jsTitle: "JavaScript on the home page, 1 to 10 islands, gzip",
        perIsland: "per island",
        leader: "{leader} ships the least JavaScript at every size, and each island adds {a} KB there against {b} KB on Nowaki.",
        table: "Show the numbers (ms)",
        tableCols: ["Framework", "Build, {p} pages", "Dev, {p} pages"],
        note: "Median of 10 runs after a discarded warm-up, one framework at a time, on {machine}, {date}. Jetstream, images, HMR, production throughput and Web Vitals are not compared yet.",
        method: "The app, the rules and every run",
      },
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
      trademark: "Next.js is a trademark of Vercel, Inc. Astro is a trademark of The Astro Technology Company. Nuxt, SvelteKit and other names are trademarks of their respective owners. Nowaki is an independent project, not affiliated with or endorsed by any of them.",
    },
    copy: { copy: "copy", copied: "copied" },
  },

  ja: {
    title: "Nowaki: npm で入る、Rust 製ツールチェーンのフルスタックWebフレームワーク",
    desc: "Nowaki（野分）は Rust（oxc）のツールチェーンで動くフルスタックWebフレームワークです。ページは HTML で返し、JavaScript を送るのはマークした島だけ。Jetstream の島はそれすら送りません。npm で入り、Rust は不要です。",
    ogTitle: "Nowaki: Next.js 流のフルスタック、Astro 流の Islands。npm で入る",
    nav: { docs: "ドキュメント", jetstream: "Jetstream", architecture: "仕組み", github: "GitHub", compare: "比較", start: "はじめる", lang: "言語", menu: "メニュー" },
    hero: {
      latest: "最新リリース",
      notes: "リリースノート（英語）",
      h1a: "Next.js\u00a0流のフルスタック。",
      h1b: "Astro\u00a0流の <em>Islands</em>。",
      sub: "ルート・loader・action を HTML で返します。JavaScript を送るのはマークした島だけ。Jetstream の島はそれすら送りません。",
      note: "Rust は不要。alpha 版なので、API はまだ変わることがあります。",
      docs: "クイックスタート（英語）",
      key: ["HTML、JS は 0 KB", "島、ハイドレートする", "Jetstream、live のまま", "図解"],
    },
    release: {
      h2: "このリリースで入ったもの",
      items: [
        { title: "既定のセキュリティヘッダ", body: "nosniff・SAMEORIGIN・Referrer-Policy・COOP を、アダプタも含むすべてのレスポンスに付けます。アプリが付けたヘッダは上書きしません。" },
        { title: "別サイトからの送信を遮断", body: `別サイトから action への送信には 403 を返します。<code>export const csrf</code> でルートごとに切り替えられます。` },
        { title: "サーバー関数の入力を検証", body: `<code>serverFn(schema, impl)</code> で、zod・valibot・arktype を使って入力を検証できます。クライアントに届くのは <code>ServerFnError</code> のメッセージだけです。` },
        { title: "CSP と nonce（opt-in）", body: `<code>NOWAKI_CSP=report-only</code> か <code>enforce</code> を設定すると、すべての script と style にレスポンスごとの nonce を付けます。` },
      ],
    },
    proof: {
      h2: "このページが送る JavaScript は {kb} KB。",
      lead: "ここで実行されるコードは2つのコピーボタンだけです。動いているものはすべて CSS です。",
      groups: ["このサイト（gzip 後）"],
      bars: [
        { label: "このページ", value: "{kb} KB", group: 0 },
        { label: "島の無いページ", value: "0 KB", group: 0 },
      ],
      note: `Astro・SvelteKit・Next.js・Nuxt と同じアプリで比べた実測値は、<a class="tlink" href="#bench">下にあります</a>。`,
      ledger: {
        h3: "{kb} KB の内訳",
        total: "合計（gzip -9）",
        note: "このビルドから計算しています。",
        roles: { "Island runtime": "島ランタイム", "Router core": "ルーターのコア", "Page router": "ページルーター", "Preact": "Preact", "Preact hooks": "Preact hooks", "JSX runtime": "JSX ランタイム", "CopyCommand island": "コピーボタンの島" },
      },
    },
    jet: {
      h2: "1回のクリック、コンポーネント JS はゼロ。",
      lead: "live の島は状態をサーバーに置きます。押してみてください。",
      steps: [
        { t: "クリック", d: "1.5 KB のランタイムだけ。コンポーネントのコードは無し。" },
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
        more: "Jetstream の仕組み",
        note: "CSS によるシミュレーションで、時間の比率は実際とは異なります。live に動くのは <code>nowaki dev</code> と <code>nowaki start</code> で、ほかのアダプタでは島の最初の HTML だけを描きます。",
      },
    },
    build: {
      h2: "ルートを書き、島をマークして、公開する。",
      more: "すべての機能はドキュメントへ（英語）",
      tiles: [
        { t: "ファイルベースのルーティング", d: "layout・middleware・loader・action・API ルートを、1ファイルずつ。", href: "/docs/routing/" },
        { t: "デフォルトで島・JS ゼロ", d: "ページは HTML で返し、JavaScript を送るのはマークしたコンポーネントだけ。", href: "/docs/" },
        { t: "Rust のツールチェーン", d: "oxc がパース・バンドル・ハッシュ化。Node 上の Preact で描画するので、npm パッケージがそのまま使えます。", href: "/ja/architecture/" },
      ],
      legend: ["HTML、JS は 0 KB"],
      flow: { render: "HTML", ship: "クライアントの JavaScript は、島とそのランタイムだけ。ページのほかの部分は 0 KB です。" },
    },
    compare: {
      h2: "Next.js・Astro と並べると。",
      lead: "違うところと、違わないところ。",
      cols: ["Nowaki", "Next.js", "Astro"],
      onlyTag: "Nowaki だけ",
      rows: [
        { feature: "live の島、クライアント JS ゼロ", nowaki: "Jetstream", next: "RSC は React を送る", astro: "Server Islands は一度描くだけ", highlight: true },
        { feature: "ツールチェーン", nowaki: "Rust（oxc）", next: "Turbopack（SWC）", astro: "Vite、Rolldown" },
        { feature: "デフォルトの JavaScript", nowaki: "ゼロ。島だけ", next: "React とハイドレーション", astro: "ゼロ。島だけ" },
        { feature: "フルスタックなアプリ", nowaki: "loader・action・API", next: "成熟", astro: "成長中" },
        { feature: "成熟度", nowaki: "alpha", next: "成熟", astro: "成熟" },
      ],
      note: "サーバー関数・ストリーミング SSR・デプロイアダプタは3つのどれにもあります。",
      bench: {
        h3: "5つのフレームワークを<wbr>同じアプリで実測。",
        lead: "カウンターが1つあるだけの同じページを、同じマシンでビルドして起動しました。小さいほど良い値です。",
        groups: ["dev サーバーで最初のページまで（cold）", "本番ビルド（HTML の書き出しまで）", "初回に読み込む JavaScript（gzip 後）"],
        note: "{machine} で {runs} 回測った中央値（{date}）。毎回キャッシュを消してから測っています。dev は起動から <code>/</code> がページを返すまで、ビルドは HTML の書き出しまで（Nowaki は <code>nowaki prerender</code>）の時間です。初回の JavaScript は、ヘッドレス Chromium で <code>/</code> を開いたときにブラウザが実行するものすべて（ファイルとインラインスクリプト）です。Nowaki の値には、ページがアイドル状態になってから読み込むクライアントルーター {idle} KB を含みます。アプリがごく小さいため、主に各フレームワークの固定費を表す数値です。",
        method: "アプリ・スクリプト・生データ（英語）",
      },
      scale: {
        h3: "同じブログを<wbr>1〜\u20601000ページまで<wbr>増やして実測。",
        lead: "動的ルート・ネストしたレイアウト・Markdown を使った同じブログを、4つの規模で生成して測りました。線の傾きは1ページあたりのコストです。",
        charts: ["静的ビルド（全ページを HTML に）", "dev サーバーで最初のページまで（cold）"],
        axis: "ページ",
        jsTitle: "ホームの JavaScript（島 1 → 10 個、gzip 後）",
        perIsland: "島1個あたり",
        leader: "{leader} はどの規模でも JavaScript が最も少なく、島を1個増やすごとに {leader} では {a} KB、Nowaki では {b} KB 増えます。",
        table: "数値の一覧（ms）",
        tableCols: ["フレームワーク", "ビルド（{p}ページ）", "dev（{p}ページ）"],
        note: "{machine} でフレームワークを1つずつ、ウォームアップの1回を除いて10回測った中央値（{date}）。Jetstream・画像・HMR・本番のスループット・Web Vitals は、まだ比べていません。",
        method: "アプリ・ルール・すべての計測（英語）",
      },
    },
    fit: {
      h2: "向く場面と、現在地。",
      roadmap: "ロードマップを読む（英語）",
      forTitle: "向いている",
      for: ["本文とサーバーデータが大半のページ。", "全ページにランタイムを積まないフォームと認証。"],
      notTitle: "まだ向いていない",
      not: ["ほぼすべてが状態を持つアプリ。", "本番クリティカルな用途。alpha です。"],
      soonTitle: "1.0 までに",
      soon: ["状態を保つ HMR", ".tsrx 島の scoped CSS", "RSC 風のストリーミング境界", "公開 API の安定化"],
    },
    close: { h2: "コマンドひとつで<wbr>始める。", docs: "クイックスタートを読む（英語）" },
    footer: {
      tagline: "Rust ツールチェーンのフルスタックWebフレームワーク。デフォルトで JS ゼロ、npm で入ります。",
      copyright: "MIT © 2026 Tettu0530",
      windName: "野分 · 秋の台風の風",
      trademark: "Next.js は Vercel, Inc.、Astro は The Astro Technology Company の商標です。Nuxt・SvelteKit などの名称は、それぞれの権利者の商標です。Nowaki は独立したプロジェクトであり、いずれとも提携・公認関係はありません。",
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

/** <head> for an explainer page: /<slug>/ in English, /ja/<slug>/ in Japanese. */
export function explainerHead(locale: Locale, slug: string, title: string, desc: string): string {
  const en = `https://nowaki.dev/${slug}/`;
  const ja = `https://nowaki.dev/ja/${slug}/`;
  return `
<meta name="description" content="${desc}" />
<meta name="theme-color" content="#0b0d10" />
${FAVICON}
<meta property="og:type" content="article" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${desc}" />
<meta property="og:locale" content="${locale === "ja" ? "ja_JP" : "en_US"}" />
<meta property="og:url" content="${locale === "ja" ? ja : en}" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="alternate" hreflang="en" href="${en}" />
<link rel="alternate" hreflang="ja" href="${ja}" />
<link rel="alternate" hreflang="x-default" href="${en}" />
${FONT_PRELOADS}
<style>${BASE_CSS}${LANDING_CSS}${EXPLAINER_CSS}</style>`;
}
