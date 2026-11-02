import { BASE_CSS, LANDING_CSS, FONT_PRELOADS, FAVICON } from "./landing-style.ts";

export const locales = ["en", "ja"] as const;
export type Locale = (typeof locales)[number];

export const GH = "https://github.com/nowaki-dev/nowaki";
export const CRATES = "https://crates.io/crates/nowaki";
export const NPM = "https://www.npmjs.com/package/nowaki";

export const STRINGS = {
  en: {
    title: "Nowaki: a full-stack web framework on a Rust toolchain, installed with npm",
    desc: "Nowaki (野分) is a full-stack web framework with layouts, middleware, server loaders, actions, SSR and API routes, on a Rust toolchain (oxc). Pages render to HTML; only the islands you mark ship JavaScript, and Jetstream islands ship none. Dev server ready in under 100 ms, installed with npm, no Rust required.",
    ogTitle: "Nowaki: full-stack like Next.js, islands like Astro, installed with npm",
    nav: { docs: "Docs", github: "GitHub", compare: "Compare", start: "Get started", lang: "Language", menu: "Menu" },
    hero: {
      latest: "Latest release",
      notes: "Release notes",
      h1a: "Full-stack like Next.js.",
      h1b: "Islands like Astro.",
      sub: "Routes, layouts, loaders, actions and API routes, rendered to HTML. Only the islands you mark ship JavaScript, and a Jetstream island ships none: its state stays on the server. The toolchain is Rust (oxc); the dev server is up in under 100 ms.",
      rustfree: "No Rust needed: the CLI is a prebuilt binary on npm.",
      alpha: "Alpha: the API still changes, so don't run production on it yet.",
      docs: "Quickstart",
    },
    release: {
      h2: "New in this release",
      since: "Since 0.11",
      items: [
        { title: "Lazy hydration", body: `Astro-style <code>client:*</code> directives decide when an island hydrates, so islands below the fold cost nothing until they are needed.` },
        { title: "Type safety end to end", body: `Typed routes, typed env, and typed <code>client:*</code> directives, checked by your editor before anything runs.` },
        { title: "Image optimization in Rust", body: "Image assets are optimized by a pure‑Rust pipeline at build time. No sharp, no native addon to install." },
        { title: "Vercel adapter", body: "Deploy to Vercel through the Build Output API v3, next to the Node, static, Bun, Deno and Cloudflare adapters." },
      ],
    },
    proof: {
      h2: "This page ships {kb} KB of JavaScript.",
      lead: "The only thing that runs in your browser here is two copy buttons. With Preact, the island runtime and the page router included, that is {kb} KB gzipped; the wind and the scroll motion are plain CSS. Built as the same counter app, Nowaki ships about a fifth of Next's JavaScript and has its dev server up in 74 ms.",
      groups: ["This site, gzip", "Same counter app: first‑load JS, uncompressed", "Same counter app: dev server ready, cold"],
      bars: [
        { label: "This page: copy-button island, runtime, router", value: "{kb} KB", group: 0 },
        { label: "A page with no islands", value: "0 KB", group: 0 },
        { label: "Nowaki", value: "21.6 KB", group: 1 },
        { label: "Astro", value: "23.1 KB", group: 1, muted: true },
        { label: "Next.js app router", value: "103.0 KB", group: 1, muted: true },
        { label: "Nowaki", value: "74 ms", group: 2 },
        { label: "Astro", value: "544 ms", group: 2, muted: true },
        { label: "Next.js", value: "1374 ms", group: 2, muted: true },
      ],
      note: "This site is measured on its own production build. The head‑to‑head builds the same one‑counter app on each framework with <code>benchmarks/head-to-head.mjs</code>. First-load JS is compared uncompressed, because that is the figure Next reports.",
      ledger: { h3: "What the {kb} KB is", total: "Total, gzip -9", note: "Computed from this build at render time." },
    },
    jet: {
      h2: "One click, zero component JavaScript.",
      lead: "Mark an island live and its state stays on the server. The browser gets a ~2 KB runtime and HTML patches, never the component's code. Here is one click, end to end.",
      steps: [
        { t: "Click", d: "The browser runs only the ~2 KB runtime. The island's component code never ships." },
        { t: "WebSocket", d: "The event travels to the Rust server, which holds the connection, presence and heartbeat." },
        { t: "Re-render", d: "The Node renderer re-renders that one island with Preact." },
        { t: "Patch", d: "Rust pushes the resulting HTML patch back down the socket." },
        { t: "Morph", d: "The runtime morphs the patch into the DOM in place. Client islands keep working beside it." },
      ],
      only: "LiveView's idea, applied per island. RSC re-renders still ship React; Astro's Server Islands render once and don't update. Neither does this.",
    },
    code: {
      h2: "Write a route. Mark an island. Handle a form.",
      lead: `Routes are components with an optional server-only <code>loader</code>. A non-GET request runs the route's <code>action</code>. Components under <code>islands/</code> are the only thing that hydrates.`,
      tabs: ["A route with a loader", "A form with an action", "File conventions"],
      conventions: [
        { f: "routes/_layout.tsx", d: "Shared layout, nests per directory" },
        { f: "routes/_middleware.ts", d: "Runs before routes: auth, redirects, headers" },
        { f: "routes/blog/[slug].tsx", d: "Dynamic route with a server loader" },
        { f: "routes/api/posts.ts", d: "GET / POST handlers, streaming Response" },
        { f: "routes/_404.tsx · _500.tsx", d: "Not‑found and error pages" },
        { f: "islands/Counter.tsx", d: "Hydrates in the browser. Nothing else does." },
      ],
    },
    more: {
      h2: "Everything else a full‑stack app needs.",
      lead: "Built for dynamic apps in the Next.js and Remix lineage.",
      items: [
        { title: "Full-stack routing", body: `File-based <code>routes/</code> with nested <code>_layout</code>s, <code>_middleware</code>, server <code>loader</code>s, form <code>action</code>s, and <code>api/</code> handlers with method dispatch and streaming.` },
        { title: "Server functions", body: `A <code>"use server"</code> module becomes an allowlisted RPC boundary: its code stays on the server, and the client gets a tiny <code>fetch</code> proxy.` },
        { title: "Rust toolchain, Node at render time", body: "oxc parses, transforms, bundles and scope-hoists in Rust, with a persistent disk cache. Pages render in a Rust-managed Node sidecar with Preact, so your npm packages keep working." },
        { title: "Island‑to‑island SPA router", body: "Moving between pages with islands is client-side and instant, with prefetch and scroll restoration. Pages with no islands stay zero-JS." },
        { title: "CSS Modules, assets, source maps", body: `<code>*.module.css</code> with scoped class names, hashed <code>import</code>s for images and fonts, and source maps in dev and prod.` },
        { title: "Errors you can read", body: "A full-screen overlay with a code frame, hot reload, and live island swap on save." },
      ],
    },
    compare: {
      h2: "Next to Next.js and Astro.",
      lead: "None of these ideas is new on its own. Nowaki's bet is the combination. Here is where it differs, and where it doesn't.",
      cols: ["Nowaki", "Next.js", "Astro"],
      onlyTag: "Only Nowaki",
      rows: [
        { feature: "Server‑reactive islands, zero client JS", nowaki: "Jetstream: state on the server, HTML patches over a WebSocket, no component JS", next: "RSC re-renders ship the React runtime", astro: "Server Islands defer SSR (one-shot, not live)", highlight: true },
        { feature: "Toolchain", nowaki: "Rust (oxc) builds it; in production a Rust server takes requests and sockets and hands rendering to Node (Preact)", next: "Turbopack (SWC) builds it; a JS runtime serves it", astro: "Vite → Rolldown builds it; a JS runtime serves it" },
        { feature: "JavaScript by default", nowaki: "Zero, islands only", next: "Ships React and hydrates", astro: "Zero, islands only" },
        { feature: "Full-stack app DX", nowaki: "Routing, loaders, actions, middleware, API, server functions", next: "Yes, mature", astro: "Growing, content-first" },
        { feature: "Install without the toolchain's language", nowaki: "npm, no Rust", next: "npm", astro: "npm" },
        { feature: "Maturity", nowaki: "Alpha", next: "Mature, huge ecosystem", astro: "Mature" },
      ],
      note: "Server functions, streaming SSR, plugins and deploy adapters exist in Next and Astro too, so they are not on this table as differences. Next and Astro are mature and battle-tested; Nowaki is alpha.",
    },
    fit: {
      h2: "Where it fits, and where it stands.",
      lead: "Nowaki fits apps that are mostly content and server data but still dynamic: marketing with auth, docs with interactive widgets, dashboards on real server data, commerce. The kind of page where Next's app-router baseline alone is ~103 KB of JavaScript (uncompressed) before your code.",
      forTitle: "A good fit",
      for: [
        "You write Next.js‑style apps, but most of each page is static content and server data.",
        "You want forms, auth and dynamic routes without paying for a client runtime on every page.",
        "You like the Remix‑style loader and action model, with JavaScript shipped only where it is used.",
      ],
      notTitle: "Not yet",
      not: [
        "Fully interactive single‑page apps where almost everything is stateful. Full hydration or RSC fits better there.",
        "Production‑critical work today. Nowaki is alpha and the API still moves.",
      ],
      statusTitle: "Status: alpha",
      status: "The core works end to end and is covered by tests in a real browser. The API may still change before 1.0.",
      soonTitle: "Before 1.0",
      soon: ["State‑preserving (prefresh) HMR", "Scoped CSS for .tsrx islands", "RSC-style streaming boundaries", "A stable public API"],
      roadmap: "Read the full roadmap",
    },
    close: { h2: "Start with one command.", docs: "Read the quickstart" },
    how: {
      steps: [
        { cmd: "", title: "Scaffold", body: `Lays down file-based <code>routes/</code> and <code>islands/</code>. The CLI is a prebuilt binary, so there is no Rust to install.` },
        { cmd: "npm run dev", title: "Develop", body: "The Rust oxc pipeline transforms on demand. Islands hydrate; everything else stays HTML." },
        { cmd: "npm run build · start", title: "Ship", body: "Scope-hoisted, content-hashed bundles served in production. Or prerender to static files and put them on a CDN." },
      ],
    },
    footer: {
      tagline: "A full-stack web framework on a Rust toolchain. Zero JS by default, installed with npm.",
      copyright: "MIT © 2026 VorEdge",
      windName: "野分 · an autumn typhoon wind",
      trademark: "Next.js is a trademark of Vercel, Inc. Astro is a trademark of The Astro Technology Company. Nowaki is an independent project, not affiliated with or endorsed by either.",
    },
    copy: { copy: "copy", copied: "copied" },
  },

  ja: {
    title: "Nowaki: npm で入る、Rust 製ツールチェーンのフルスタックWebフレームワーク",
    desc: "Nowaki（野分）は layout・middleware・server loader・action・SSR・API ルートを備えたフルスタックWebフレームワークです。ツールチェーンは Rust（oxc）。ページは HTML で返し、JavaScript を送るのはマークした島だけ。Jetstream の島はそれすら送りません。dev 起動は 100 ms 以内、npm で入り、Rust は不要です。",
    ogTitle: "Nowaki: Next.js 流のフルスタック、Astro 流の Islands。npm で入る",
    nav: { docs: "ドキュメント", github: "GitHub", compare: "比較", start: "はじめる", lang: "言語", menu: "メニュー" },
    hero: {
      latest: "最新リリース",
      notes: "リリースノート（英語）",
      h1a: "Next.js 流のフルスタック。",
      h1b: "Astro 流の Islands。",
      sub: "ルート・レイアウト・loader・action・API ルートを備え、ページは HTML で返します。JavaScript を送るのは、マークした島（Islands）だけ。Jetstream の島はそれすら送らず、状態をサーバーに置きます。ツールチェーンは Rust（oxc）で、dev サーバーは 100 ms 以内に立ち上がります。",
      rustfree: "Rust は不要。CLI はビルド済みバイナリとして npm から入ります。",
      alpha: "alpha 版です。API はまだ変わるので、本番運用にはまだ使わないでください。",
      docs: "クイックスタート（英語）",
    },
    release: {
      h2: "このリリースで入ったもの",
      since: "0.11 からの変更",
      items: [
        { title: "遅延ハイドレーション", body: `Astro と同じ書き方の <code>client:*</code> ディレクティブで、島をいつハイドレートするか決められます。画面外の島は、必要になるまでコストゼロ。` },
        { title: "端から端まで型安全", body: `ルート・環境変数・<code>client:*</code> ディレクティブに型が付き、実行前にエディタが検査します。` },
        { title: "Rust で画像を最適化", body: "画像アセットはビルド時に Rust だけのパイプラインで最適化されます。sharp もネイティブアドオンも不要。" },
        { title: "Vercel アダプタ", body: "Build Output API v3 で Vercel にデプロイ。Node・静的・Bun・Deno・Cloudflare のアダプタと並びます。" },
      ],
    },
    proof: {
      h2: "このページが送る JavaScript は {kb} KB。",
      lead: "このページでブラウザ上で動くのは、2つのコピーボタンだけです。Preact・島ランタイム・ページルーターを含めて gzip 後 {kb} KB。風とスクロールの演出は素の CSS です。同じカウンタアプリで比べると、Nowaki が送る JavaScript は Next のおよそ5分の1。dev サーバーは 74 ms で立ち上がります。",
      groups: ["このサイト（gzip 後）", "同じカウンタアプリ：first‑load JS（非圧縮）", "同じカウンタアプリ：dev サーバーの起動（cold）"],
      bars: [
        { label: "このページ：コピーボタンの島・ランタイム・ルーター", value: "{kb} KB", group: 0 },
        { label: "島の無いページ", value: "0 KB", group: 0 },
        { label: "Nowaki", value: "21.6 KB", group: 1 },
        { label: "Astro", value: "23.1 KB", group: 1, muted: true },
        { label: "Next.js の app router", value: "103.0 KB", group: 1, muted: true },
        { label: "Nowaki", value: "74 ms", group: 2 },
        { label: "Astro", value: "544 ms", group: 2, muted: true },
        { label: "Next.js", value: "1374 ms", group: 2, muted: true },
      ],
      note: "このサイトは自身の本番ビルドで実測しています。直接比較は、カウンタ1個の同じアプリを各フレームワークで作り、<code>benchmarks/head-to-head.mjs</code> で測ったものです。first‑load JS を非圧縮で比べているのは、Next が報告する数字がそれだからです。",
      ledger: { h3: "{kb} KB の内訳", total: "合計（gzip -9）", note: "このビルドから、描画時に計算しています。", roles: { "Island runtime": "島ランタイム", "Router core": "ルーターのコア", "Page router": "ページルーター", "Preact": "Preact", "Preact hooks": "Preact hooks", "JSX runtime": "JSX ランタイム", "CopyCommand island": "コピーボタンの島" } },
    },
    jet: {
      h2: "1回のクリック、コンポーネント JS はゼロ。",
      lead: "島を live にすると、状態はサーバーに残ります。ブラウザに届くのは ~2 KB のランタイムと HTML パッチだけで、コンポーネントのコードは届きません。1回のクリックを最初から最後まで追います。",
      steps: [
        { t: "クリック", d: "ブラウザで動くのは ~2 KB のランタイムだけ。島のコンポーネントのコードは送られません。" },
        { t: "WebSocket", d: "イベントは Rust サーバーへ。接続・presence・ハートビートは Rust が持ちます。" },
        { t: "再描画", d: "Node のレンダラーが、その島だけを Preact で描き直します。" },
        { t: "パッチ", d: "Rust が、できた HTML パッチをソケットで送り返します。" },
        { t: "反映", d: "ランタイムがパッチを DOM にその場で当てます（morph）。クライアント島は隣でそのまま動きます。" },
      ],
      only: "LiveView の発想を島ごとに。RSC の再描画は React を送り、Astro の Server Islands は一度描画したら更新しません。どちらにもない仕組みです。",
    },
    code: {
      h2: "ルートを書き、島をマークし、フォームを処理する。",
      lead: `ルートは、サーバーでだけ動く <code>loader</code> を持てるコンポーネントです。GET 以外のリクエストはルートの <code>action</code> が処理します。ブラウザでハイドレートされるのは <code>islands/</code> の中だけです。`,
      tabs: ["loader 付きのルート", "action 付きのフォーム", "ファイル規約"],
      conventions: [
        { f: "routes/_layout.tsx", d: "共有レイアウト。ディレクトリ単位でネスト" },
        { f: "routes/_middleware.ts", d: "ルートの前に実行。認証・リダイレクト・ヘッダ" },
        { f: "routes/blog/[slug].tsx", d: "動的ルートと server loader" },
        { f: "routes/api/posts.ts", d: "GET / POST ハンドラ、streaming Response" },
        { f: "routes/_404.tsx · _500.tsx", d: "Not Found ページとエラーページ" },
        { f: "islands/Counter.tsx", d: "ブラウザでハイドレート。ほかは何もしない" },
      ],
    },
    more: {
      h2: "フルスタックのアプリに要るものは、ひと通り。",
      lead: "Next.js・Remix の系譜にある、動的なアプリ向けに作っています。",
      items: [
        { title: "フルスタックなルーティング", body: `file-based の <code>routes/</code> に、ネストする <code>_layout</code>・<code>_middleware</code>・server <code>loader</code>・フォーム用の <code>action</code>、メソッド分岐と streaming に対応した <code>api/</code> ハンドラ。` },
        { title: "サーバー関数", body: `<code>"use server"</code> のモジュールは allowlist 制の RPC 境界になります。コードはサーバーに残り、クライアントに届くのは小さな <code>fetch</code> プロキシだけです。` },
        { title: "ツールチェーンは Rust、描画は Node", body: "パース・変換・バンドル・スコープホイスティングは oxc が Rust で行い、ディスクキャッシュも持ちます。ページの描画は Rust が管理する Node サイドカー上の Preact なので、npm パッケージはそのまま使えます。" },
        { title: "島から島への SPA ルーター", body: "島のあるページどうしの移動はクライアント側で即座に。prefetch とスクロール復元付き。島の無いページは JS ゼロのままです。" },
        { title: "CSS Modules・アセット・ソースマップ", body: `クラス名をスコープ化する <code>*.module.css</code>、画像やフォントのハッシュ付き <code>import</code>、dev と本番の両方でソースマップ。` },
        { title: "読めるエラー表示", body: "コードフレーム付きの全画面オーバーレイ、ホットリロード、保存時の島の差し替え。" },
      ],
    },
    compare: {
      h2: "Next.js・Astro と並べると。",
      lead: "どのアイデアも、単体では新しくありません。Nowaki が賭けているのはその組み合わせです。違うところと、違わないところを示します。",
      cols: ["Nowaki", "Next.js", "Astro"],
      onlyTag: "Nowaki だけ",
      rows: [
        { feature: "サーバーリアクティブな島（クライアント JS ゼロ）", nowaki: "Jetstream：状態はサーバー、HTML パッチを WebSocket で送る、コンポーネント JS ゼロ", next: "RSC の再描画は React ランタイムを送る", astro: "Server Islands は SSR を遅延（1回きりで、更新はしない）", highlight: true },
        { feature: "ツールチェーン", nowaki: "ビルドは Rust（oxc）。本番は Rust サーバーがリクエストとソケットを受け持ち、描画は Node（Preact）に任せる", next: "ビルドは Turbopack（SWC）、配信は JS ランタイム", astro: "ビルドは Vite → Rolldown、配信は JS ランタイム" },
        { feature: "デフォルトの JavaScript", nowaki: "ゼロ。島だけ", next: "React を送って hydrate", astro: "ゼロ。島だけ" },
        { feature: "フルスタックなアプリの DX", nowaki: "ルーティング・loader・action・middleware・API・サーバー関数", next: "あり。成熟", astro: "成長中。コンテンツ寄り" },
        { feature: "ツールチェーンの言語なしで入る", nowaki: "npm。Rust 不要", next: "npm", astro: "npm" },
        { feature: "成熟度", nowaki: "alpha", next: "成熟。巨大なエコシステム", astro: "成熟" },
      ],
      note: "サーバー関数・ストリーミング SSR・プラグイン・デプロイアダプタは Next・Astro にもあるので、この表では違いとして挙げていません。Next と Astro は成熟し実戦で鍛えられていますが、Nowaki は alpha です。",
    },
    fit: {
      h2: "向く場面と、いまの現在地。",
      lead: "Nowaki が向くのは、本文とサーバーデータが大半だけれど動的なアプリです。認証付きのマーケティングサイト、対話ウィジェット入りのドキュメント、本物のサーバーデータを扱う管理画面、EC。Next の app router では、土台だけで約 103 KB（非圧縮）の JavaScript を送ってしまう層です。",
      forTitle: "向いている",
      for: [
        "Next.js 風にアプリを書くが、各ページの大半は静的なコンテンツとサーバーデータ。",
        "フォーム・認証・動的ルートは欲しいが、全ページでクライアントランタイムのコストは払いたくない。",
        "Remix 風の loader / action が好きで、JavaScript は使う所にだけ送りたい。",
      ],
      notTitle: "まだ向いていない",
      not: [
        "ほぼすべてが状態を持つ、全面インタラクティブな SPA。そこでは全 hydrate や RSC のほうが合います。",
        "今日の本番クリティカルな用途。Nowaki は alpha で、API はまだ変わります。",
      ],
      statusTitle: "現状：alpha",
      status: "コアはエンドツーエンドで動き、実ブラウザでのテストで確認しています。1.0 までは API が変わることがあります。",
      soonTitle: "1.0 までに",
      soon: ["状態を保つ HMR（prefresh）", ".tsrx 島の scoped CSS", "RSC 風のストリーミング境界", "公開 API の安定化"],
      roadmap: "ロードマップ全文を読む（英語）",
    },
    close: { h2: "コマンドひとつで始める。", docs: "クイックスタートを読む（英語）" },
    how: {
      steps: [
        { cmd: "", title: "雛形を作る", body: `file-based の <code>routes/</code> と <code>islands/</code> を生成します。CLI はビルド済みバイナリなので、Rust を入れる必要はありません。` },
        { cmd: "npm run dev", title: "開発する", body: "Rust の oxc パイプラインが必要なときに変換します。島はハイドレートされ、それ以外は HTML のまま。" },
        { cmd: "npm run build · start", title: "公開する", body: "スコープホイスティング済み・content-hash 付きのバンドルを本番で配信。静的ファイルに prerender して CDN に置くこともできます。" },
      ],
    },
    footer: {
      tagline: "Rust ツールチェーンのフルスタックWebフレームワーク。デフォルトで JS ゼロ、npm で入ります。",
      copyright: "MIT © 2026 VorEdge",
      windName: "野分 · 秋の台風の風",
      trademark: "Next.js は Vercel, Inc.、Astro は The Astro Technology Company の商標です。Nowaki は独立したプロジェクトであり、いずれとも提携・公認関係はありません。",
    },
    copy: { copy: "コピー", copied: "コピー済み" },
  },
} as const;

export function headFor(locale: Locale): string {
  const s = STRINGS[locale];
  const url = locale === "ja" ? "https://nowaki.dev/ja" : "https://nowaki.dev/";
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
<link rel="alternate" hreflang="ja" href="https://nowaki.dev/ja" />
<link rel="alternate" hreflang="x-default" href="https://nowaki.dev/" />
${FONT_PRELOADS}
<style>${BASE_CSS}${LANDING_CSS}</style>`;
}
