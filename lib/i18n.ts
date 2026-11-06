import { BASE_CSS, LANDING_CSS, EXPLAINER_CSS, FONT_PRELOADS, FAVICON } from "./landing-style.ts";
import { HOME_CSS } from "./home-style.ts";

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
    nav: { docs: "Docs", jetstream: "Jetstream", architecture: "Architecture", github: "GitHub", compare: "Benchmarks", start: "Get started", lang: "Language", menu: "Menu" },
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
        { title: "About 4x faster rendering", body: "Production servers imported each route's module on every request, a round trip to the ESM loader hooks. Now it happens once: about 4x the throughput on <code>nowaki start</code> and the Node adapters." },
        { title: "A JS budget per route", body: "Every build prints each route's first-load JS. <code>export const budget = { js: 12 }</code> fails the build above 12\u00a0KB, and <code>{ js: 0 }</code> promises none." },
        { title: "MCP for coding agents", body: "While <code>nowaki dev</code> runs, agents such as Claude Code can read the routes, the module graph, recent errors and the config. Loopback only." },
        { title: "Less waiting on delivery", body: "Assets pre-compressed to br and gzip with ETags and 304s, ISR pages cached from the first request, streams no longer buffered, and <code>streaming = \"early\"</code> sends the shell before loaders run." },
        { title: "Jetstream, v0.15 finished", body: "Stale pages reload for fresh state, rooms survive a <code>nowaki start</code> restart, and a publish renders once for every viewer who can share it." },
        { title: "Hints for islands that need no JS", body: "<code>nowaki build</code> points out client islands that could be live islands, and ones that need not be islands at all." },
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
        { t: "Click", d: "A 2.0 KB runtime, no component code." },
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
        note: "Simulated in CSS, not to scale. Shown over the WebSocket of <code>nowaki dev</code> and <code>nowaki start</code>. The node, bun, deno, vercel and cloudflare adapters send each event as one POST instead, and static output renders the first HTML only.",
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
        note: "Median of {runs} runs on {machine}, {date}. Caches cleared before every run. Dev is timed from start until <code>/</code> returns the page, and the build includes writing the HTML (for Nowaki, <code>nowaki prerender</code>). First-load JavaScript is everything the browser runs for <code>/</code>: files and inline scripts, measured in headless Chromium. Nowaki's figure includes its {idle} KB client router, which loads once the page is idle. The app is tiny, so these numbers mostly show each framework's fixed cost.",
        method: "Apps, scripts and raw runs",
      },
      scale: {
        h3: "At scale: one blog, 1 to 1000 pages.",
        lead: "The same blog at four sizes: a dynamic route, a nested layout, Markdown, a search island, a sortable table, a form, an API route, and a theme toggle on every page. The slope is what each extra page costs.",
        charts: ["Static build, every page to HTML", "Dev server, first page, cold"],
        axis: "pages",
        jsTitle: "JavaScript on the home page, 1 to 10 Counter islands plus the theme toggle, gzip",
        perIsland: "per island",
        leader: "{leader} ships the least JavaScript at every size, and each island adds {a} KB there against {b} KB on Nowaki.",
        table: "Show the numbers (ms)",
        tableCols: ["Framework", "Build, {p} pages", "Dev, {p} pages"],
        note: "Median of 10 runs after a discarded warm-up, one framework at a time, on {machine}, {date}. Jetstream, images, HMR and Web Vitals are not compared yet.",
        method: "The app, the rules and every run",
      },
      prod: {
        h3: "In production: one Node process, 100 pages.",
        lead: "Requests per second on a post page, rendered on every request and then with each framework's ISR, and the memory each server holds at idle. More requests and less memory are better.",
        groups: ["Post page, rendered per request", "Post page, with the framework's ISR", "Memory at idle"],
        ordinals: ["first", "second", "third", "fourth", "fifth"],
        rank: "Rendered per request, Nowaki comes {rank}.",
        isr: "ISR hits are served by the Rust front alone. Above about 100,000 req/s the figure is likely bounded by the load generator on the same machine, not by the server. {noisr} have no built-in ISR.",
        csp: "With <code>NOWAKI_CSP=enforce</code>, Nowaki served {csp} req/s against {plain} without it: no measurable cost.",
        note: "Each framework's own server, one Node process, <code>NODE_ENV=production</code>, 100 pages. <code>oha</code> with 50 connections for 10 seconds after a 3-second warm-up; median of {runs} runs on {machine}, {date}. Memory is the whole process tree at idle.",
        mem: "Nowaki's memory is for the server binary started directly. Since 0.16 the npm <code>nowaki</code> command replaces itself with that binary on Linux and macOS; on Windows and older Node versions it keeps a Node wrapper process running (about 46 MB in 0.15).",
        ttfb: "Time to first byte on a post page, p50 over one keep-alive connection: Nowaki {us} ms, {other} {them} ms.",
        method: "How the servers were measured",
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
    home: {
      release: { label: "Latest release", name: "“Mistral”", summary: "content collections, MDX, images, SEO and fonts for content sites." },
      mapLabel: "A page as an island map: the sea is HTML with no JavaScript; Search hydrates on load, Comments when it scrolls into view; Likes is a Jetstream island whose events go to nowaki start and come back as HTML.",
      server: "Rust front, Node renderer",
      proofLead: "The copy buttons are the only code that runs when the page loads. The page router waits until you point at a link. Every animation on this page is CSS.",
      later: "Page router, loaded when a link is hovered, focused or touched (not counted above)",
      astro: "Coming from Astro? Read the migration guide",
      jet: {
        h2: "Live islands, zero component JS.",
        lead: "With Jetstream, an island keeps its state on the server. A click goes up, Node renders the island again, and a {live}\u00a0KB runtime morphs the new HTML in place.",
        lanes: [
          { h: "Browser", s: "0 bytes of component JS" },
          { h: "Rust front", s: "holds the WebSocket" },
          { h: "Node renderer", s: "runs the handler" },
        ],
        caps: [
          { t: "Click", d: "data-live=\"like\"" },
          { t: "Up", d: "over the socket" },
          { t: "Render", d: "new state, signed" },
          { t: "Down", d: "an HTML patch" },
          { t: "Morph", d: "in place" },
        ],
        note: "Simulated in CSS on this page. Press Like to send one event round the loop.",
        points: [
          { t: "Forms and inputs", d: "Submit, input and change events, with keyed rows that keep their elements." },
          { t: "Rooms and live queries", d: "Tabs in a room share one state, and <code>publish()</code> pushes server changes." },
          { t: "Every server target", d: "A WebSocket on <code>nowaki start</code>, one POST per event on the adapters." },
        ],
      },
      build: {
        lead: "A Rust toolchain (oxc) parses, bundles and hashes; Preact renders on Node, so npm packages keep working. Every build reports the JavaScript each route ships.",
        panes: ["Write a route", "Mark an island", "Ship"],
        counter: "// Counter.tsx: hydrates in view",
        likes: "// Likes.tsx: stays on the server",
      },
      bench: {
        h2: "Five frameworks, one blog.",
        lead: "The same blog in each framework, with search, a sortable table, a server-validated form, an API route and a theme toggle on every page, built and served on one machine, one framework at a time.",
        leads: "Nowaki is best on {n} of these {m}.",
        leastJs: "{leader} ships the least JavaScript.",
        tabs: ["Requests per second", "Static build", "Dev server", "JavaScript"],
        notes: [
          "A post page rendered on every request, each framework's own server in one Node process. Higher is better.",
          "Every page of a 1000-page blog written to HTML. Lower is better.",
          "From a cold start until the first page of the 1000-page blog returns. Lower is better.",
          "Everything the browser runs for the home page with one Counter island and the theme toggle every page carries, gzip, router included. Lower is better.",
        ],
        fanout: "p95 for one change to reach 1000 live connections.",
        ttfb: "time to first byte, p50. {other}: {them}\u00a0ms.",
        memLeast: "at idle, the least of the five servers.",
        mem: "at idle.",
        src: "Medians on {machine}, {date}: 5 runs for the servers, 10 after a warm-up for builds and dev. Source: Tettu0530/nowaki benchmarks/compare at {commit}.",
        more: "All benchmarks and the method",
      },
      fitLead: "A personal open-source project, MIT licensed. It is alpha: use it for side projects and experiments, not yet for production-critical work.",
    },
    benchPage: {
      title: "Benchmarks: five frameworks, measured · Nowaki",
      desc: "Every number on nowaki.dev, with the method: a small app's dev and build times, one blog at 1 to 1000 pages, and each framework's production server, measured against Astro, SvelteKit, Next.js and Nuxt.",
      h1: "Five frameworks, measured.",
      lead: "Every number on nowaki.dev comes from these runs: a small app for dev and build times, one blog at 1 to 1000 pages, and each framework's own production server. One framework at a time on one machine; results that favor others are shown as measured.",
      back: "Back to the overview",
      method: "Harness and raw runs",
    },
    docsSite: {
      h2: "A docs site, Nowaki against Astro",
      lead: "The same docs site in both: a typed content collection of Markdown and MDX entries, three highlighted code fences and one local photo per entry, a generated sitemap, and static output. Nowaki uses only its built-ins.",
      group: "{n} entries",
      cold: "no cache",
      warm: "with cache",
      slower: "Without a cache Nowaki is slower: AVIF takes much longer to encode than WebP, and Nowaki uses no C codecs, so it cannot use sharp or libwebp. With its cache it is faster at every size ({min}–{max}x).",
      js: "First-load JavaScript is {nowaki} KB for Nowaki and {astro} KB for Astro on a Markdown entry, an MDX entry and the docs index.",
      note: "Median of 5 runs after a warm-up on {machine}, {date}. No cache deletes the output and every framework cache first; with cache keeps the caches. Nowaki built from main at 70f9e0a, before the 0.17.0 release; Astro {astro}.",
      method: "The docs-site benchmark and its raw runs",
      guide: "Migrating from Astro",
    },
  },

  ja: {
    title: "Nowaki | Rust 製ツールチェーンのフルスタック Web フレームワーク",
    desc: "Nowaki（野分）は、Rust 製のツールチェーン（oxc）で動くフルスタック Web フレームワークです。ページはサーバーで HTML にレンダリングし、JavaScript を送るのは指定したアイランドだけです。Jetstream アイランドは、コンポーネントの JavaScript を一切送りません。npm でインストールでき、Rust は必要ありません。",
    ogTitle: "Nowaki | Rust 製ツールチェーンのフルスタック Web フレームワーク",
    nav: { docs: "ドキュメント", jetstream: "Jetstream", architecture: "アーキテクチャ", github: "GitHub", compare: "ベンチマーク", start: "はじめる", lang: "言語", menu: "メニュー" },
    hero: {
      latest: "最新リリース",
      notes: "リリースノート（英語）",
      h1a: "Full-stack like Next.js.",
      h1b: "<em>Islands</em> like Astro.",
      sub: "Nowaki は、ルート、loader、action をサーバーで実行し、ページを HTML で返すフルスタック Web フレームワークです。ブラウザに JavaScript を送るのは、指定したアイランドだけです。Jetstream アイランドなら、コンポーネントの JavaScript も送りません。",
      note: "npm でインストールでき、Rust は必要ありません。現在は alpha 版のため、API は今後変わる可能性があります。",
      docs: "クイックスタート（英語）",
      key: ["HTML（JS 0 KB）", "アイランド（ハイドレーション）", "Jetstream アイランド（サーバーで更新）", "模式図"],
    },
    release: {
      h2: "このリリースの新機能",
      items: [
        { title: "レンダリングが約4倍高速に", body: "これまで本番サーバーは、リクエストのたびにルートのモジュールを読み込み直していました。読み込みを最初の1回だけにしたことで、<code>nowaki start</code> と Node アダプターのスループットが約4倍になりました。" },
        { title: "ルートごとの JS バジェット", body: "ビルドのたびに、各ルートが最初に読み込む JS の量を表示します。<code>export const budget = { js: 12 }</code> と書くと、12 KB を超えたときにビルドが失敗します。<code>{ js: 0 }</code> なら、JS をまったく送らないことを保証できます。" },
        { title: "コーディングエージェント向けの MCP", body: "<code>nowaki dev</code> の実行中は、Claude Code などのエージェントが MCP でルート、モジュールグラフ、直近のエラー、設定を読み取れます。受け付けるのはローカルマシンからのリクエストだけです。" },
        { title: "配信の高速化", body: "アセットを br と gzip で事前に圧縮し、ETag を付けて配信します（変更がなければ 304）。ISR のページは最初のリクエストからキャッシュし、ストリーミングのレスポンスはバッファせずにそのまま流します。<code>streaming = \"early\"</code> を指定すると、loader の実行を待たずにシェルを送ります。" },
        { title: "Jetstream の仕上げ", body: "古くなったページは自動で再読み込みし、最新の状態を取得します。rooms は <code>nowaki start</code> を再起動しても保持されます。publish 時のレンダリングは1回だけ行い、結果を共有できるすべての接続に配ります。" },
        { title: "JS が不要なアイランドを検出", body: "<code>nowaki build</code> が、Jetstream アイランドに置き換えられるクライアントアイランドや、アイランドにする必要のないコンポーネントを指摘します。" },
      ],
    },
    proof: {
      h2: "このページの JavaScript は {kb} KB",
      lead: "このページで実行されるのは、2つのコピーボタンのコードだけです。動いて見える部分は、すべて CSS で実装しています。",
      groups: ["このサイト（gzip 圧縮後）"],
      bars: [
        { label: "このページ", value: "{kb} KB", group: 0 },
        { label: "アイランドのないページ", value: "0 KB", group: 0 },
      ],
      note: `Astro、SvelteKit、Next.js、Nuxt と同じアプリで比較した結果は、<a class="tlink" href="#bench">下にまとめています</a>。`,
      ledger: {
        h3: "{kb} KB の内訳",
        total: "合計（gzip -9）",
        note: "このサイトのビルド結果から算出しています。",
        roles: { "Island runtime": "アイランドランタイム", "Router core": "ルーターコア", "Page router": "ページルーター", "Preact": "Preact", "Preact hooks": "Preact hooks", "JSX runtime": "JSX ランタイム", "CopyCommand island": "コピーボタンのアイランド" },
      },
    },
    jet: {
      h2: "コンポーネントの JS なしで動くアイランド",
      lead: "Jetstream アイランドは、状態をサーバー側で持ちます。ボタンを押して試してみてください。",
      steps: [
        { t: "クリック", d: "ブラウザで動くのは 2.0 KB のランタイムだけ" },
        { t: "WebSocket", d: "Rust サーバーへ送信" },
        { t: "再レンダリング", d: "Node がアイランドをレンダリング" },
        { t: "パッチ", d: "新しい HTML をソケットで返送" },
        { t: "反映", d: "DOM をその場で更新" },
      ],
      demo: {
        like: "いいね",
        liked: "いいね済み",
        label: "いいね（Jetstream アイランドのシミュレーション）",
        state: "サーバーの状態",
        js: "このデモで使う JavaScript",
        jsVal: "0 バイト",
        more: "Jetstream の仕組み",
        note: "このデモは CSS で再現したもので、時間の比率は実際とは異なります。図は <code>nowaki dev</code> と <code>nowaki start</code> で WebSocket を使う場合です。node、bun、deno、vercel、cloudflare の各アダプターでは、イベントごとに POST を1回送ります。静的出力では、アイランドは最初の HTML のまま動きません。",
      },
    },
    build: {
      h2: "ルートを書いてから​公開するまで",
      more: "すべての機能を見る（英語）",
      tiles: [
        { t: "ファイルベースのルーティング", d: "レイアウト、ミドルウェア、loader、action、API ルートを、それぞれ1つのファイルで定義します。", href: "/docs/routing/" },
        { t: "デフォルトで JS ゼロ", d: "ページは HTML で返し、JavaScript を送るのは指定したコンポーネントだけです。", href: "/docs/" },
        { t: "Rust 製のツールチェーン", d: "パース、バンドル、ハッシュ化は oxc が担当します。レンダリングは Node 上の Preact で行うので、npm パッケージがそのまま使えます。", href: "/ja/architecture/" },
      ],
      legend: ["HTML（JS 0 KB）"],
      flow: { render: "HTML", ship: "クライアントに送る JavaScript は、アイランドとそのランタイムだけです。ページのほかの部分には JavaScript を送りません。" },
    },
    compare: {
      h2: "Next.js、Astro との比較",
      lead: "異なる点と、共通する点をまとめました。",
      cols: ["Nowaki", "Next.js", "Astro"],
      onlyTag: "Nowaki のみ",
      rows: [
        { feature: "クライアント JS ゼロで動くアイランド", nowaki: "Jetstream", next: "RSC でも React を送る", astro: "Server Islands は1回だけレンダリング", highlight: true },
        { feature: "ツールチェーン", nowaki: "Rust（oxc）", next: "Turbopack（SWC）", astro: "Vite、Rolldown" },
        { feature: "デフォルトの JavaScript", nowaki: "ゼロ（アイランドのみ）", next: "React とハイドレーション", astro: "ゼロ（アイランドのみ）" },
        { feature: "フルスタック開発", nowaki: "loader、action、API", next: "成熟", astro: "発展中" },
        { feature: "成熟度", nowaki: "alpha", next: "成熟", astro: "成熟" },
      ],
      note: "サーバー関数、ストリーミング SSR、デプロイアダプターは3つとも備えています。",
      bench: {
        h3: "5つのフレームワークを<wbr>同じアプリで計測",
        lead: "カウンターが1つだけある同じページを、同じマシンでビルドして起動しました。いずれも、値が小さいほど優れています。",
        groups: ["dev サーバーの初回表示（コールドスタート）", "本番ビルド（HTML の出力まで）", "初回に読み込む JavaScript（gzip 圧縮後）"],
        note: "{machine} で {runs} 回計測した中央値です（{date}）。計測のたびにキャッシュを削除しています。dev は起動から <code>/</code> がページを返すまで、ビルドは HTML の出力まで（Nowaki は <code>nowaki prerender</code>）の時間です。初回の JavaScript は、ヘッドレス Chromium で <code>/</code> を開いたときにブラウザが実行するすべて（外部ファイルとインラインスクリプト）を数えています。Nowaki の値には、ページがアイドル状態になってから読み込むクライアントルーター（{idle} KB）も含みます。アプリがごく小さいため、主に各フレームワークの固定コストを表す数値です。",
        method: "アプリ、スクリプト、計測データ（英語）",
      },
      scale: {
        h3: "1〜⁠1000ページの<wbr>ブログで計測",
        lead: "動的ルート、ネストしたレイアウト、Markdown、検索、並べ替えできる表、フォーム、API ルート、全ページ共通のテーマ切り替えを備えた同じブログを、4つの規模で生成して計測しました。線の傾きが、1ページあたりのコストを表します。",
        charts: ["静的ビルド（全ページを HTML に出力）", "dev サーバーの初回表示（コールドスタート）"],
        axis: "ページ数",
        jsTitle: "トップページの JavaScript（Counter のアイランド 1 → 10 個とテーマ切り替え、gzip 圧縮後）",
        perIsland: "アイランド1個あたり",
        leader: "JavaScript の量は、どの規模でも {leader} が最も少なくなりました。アイランドを1個増やすごとに、{leader} は {a} KB、Nowaki は {b} KB 増えます。",
        table: "数値を表で見る（ms）",
        tableCols: ["フレームワーク", "ビルド（{p}ページ）", "dev（{p}ページ）"],
        note: "{machine} でフレームワークを1つずつ計測し、ウォームアップの1回を除いた10回の中央値を示しています（{date}）。Jetstream、画像、HMR、Web Vitals はまだ比較していません。",
        method: "アプリ、ルール、すべての計測結果（英語）",
      },
      prod: {
        h3: "本番サーバーでの計測",
        lead: "100ページのブログを使い、記事ページが1秒間に処理できるリクエスト数を計測しました。条件は、リクエストごとにレンダリングする場合と、各フレームワークの ISR を使う場合の2通りです。あわせて、待機時のメモリ使用量も計測しています。リクエスト数は多いほど、メモリは少ないほど優れています。",
        groups: ["記事ページ（毎回レンダリング）", "記事ページ（ISR を使用）", "待機時のメモリ使用量"],
        ordinals: ["1位", "2位", "3位", "4位", "5位"],
        rank: "リクエストごとにレンダリングする場合、Nowaki は{rank}です。",
        isr: "ISR のキャッシュにヒットしたリクエストには、Node を通さず Rust のフロントだけで応答します。10万 req/s を超える値は、サーバーではなく、同じマシンで動かした計測ツールの限界で頭打ちになっている可能性があります。{noisr} には標準の ISR がありません。",
        csp: "<code>NOWAKI_CSP=enforce</code> を設定しても Nowaki は {csp} req/s で、CSP なしの {plain} req/s と比べて計測できるほどの差はありませんでした。",
        note: "各フレームワーク標準のサーバーを、Node のプロセス1つ、<code>NODE_ENV=production</code>、100ページの条件で動かしました。3秒のウォームアップのあと、<code>oha</code> で50接続、10秒間の負荷をかけています。値は {machine} で {runs} 回計測した中央値です（{date}）。メモリは待機時のプロセスツリー全体の使用量です。",
        mem: "Nowaki のメモリ使用量は、サーバーのバイナリを直接起動したときの値です。0.16 以降、Linux と macOS では npm の <code>nowaki</code> コマンドが自身のプロセスをこのバイナリに置き換えます。Windows や古い Node では Node のラッパープロセスが残り、0.15 の計測ではその分だけメモリが約 46 MB 増えていました。",
        ttfb: "記事ページの TTFB（keep-alive の接続1本、p50）は、Nowaki が {us} ms、{other} が {them} ms でした。",
        method: "サーバーの計測方法（英語）",
      },
    },
    fit: {
      h2: "向いている用途と現状",
      roadmap: "ロードマップ（英語）",
      forTitle: "向いている用途",
      for: ["コンテンツとサーバーのデータが中心のページ", "全ページにクライアントのランタイムを載せずに済むフォームや認証"],
      notTitle: "まだ向いていない用途",
      not: ["ほぼすべての画面が状態を持つアプリ", "本番環境のミッションクリティカルな用途（現在 alpha 版）"],
      soonTitle: "1.0 までの予定",
      soon: ["状態を保持する HMR", ".tsrx アイランドのスコープ付き CSS", "RSC のようなストリーミング境界", "公開 API の安定化"],
    },
    close: { h2: "コマンド1つで<wbr>はじめる", docs: "クイックスタート（英語）" },
    footer: {
      tagline: "Rust 製ツールチェーンのフルスタック Web フレームワーク。デフォルトで JS ゼロ、npm でインストールできます。",
      copyright: "MIT © 2026 Tettu0530",
      windName: "野分（のわき）：野の草を吹き分ける、秋の強い風",
      trademark: "Next.js は Vercel, Inc.、Astro は The Astro Technology Company の商標です。Nuxt、SvelteKit などの名称は、それぞれの権利者の商標です。Nowaki は独立したプロジェクトであり、いずれの企業とも提携・公認関係はありません。",
    },
    copy: { copy: "コピー", copied: "コピーしました" },
    home: {
      release: { label: "最新リリース", name: "「Mistral」", summary: "コンテンツコレクション、MDX、画像、SEO、フォントなど、コンテンツサイト向けの機能が入りました。" },
      mapLabel: "ページをアイランドの地図として描いた図。海の部分は JavaScript のない HTML です。Search は読み込み時に、Comments は画面に入ったときにハイドレートします。Likes は Jetstream アイランドで、イベントは nowaki start に送られ、HTML になって戻ってきます。",
      server: "Rust フロントと Node レンダラー",
      proofLead: "ページを読み込んだときに実行されるのは、コピーボタンのコードだけです。ページルーターは、リンクにカーソルを合わせたときなどに読み込みます。ページ上のアニメーションは、すべて CSS で実装しています。",
      later: "ページルーター（リンクへのホバー、フォーカス、タップで読み込み。上の合計には含めません）",
      astro: "Astro からの移行ガイド（英語）",
      jet: {
        h2: "コンポーネントの JS なしで動くアイランド",
        lead: "Jetstream アイランドは、状態をサーバーで持ちます。クリックがサーバーに届くと Node がアイランドを再レンダリングし、{live}\u00a0KB のランタイムが新しい HTML をその場で反映します。",
        lanes: [
          { h: "ブラウザ", s: "コンポーネントの JS は 0 バイト" },
          { h: "Rust フロント", s: "WebSocket を保持" },
          { h: "Node レンダラー", s: "handler を実行" },
        ],
        caps: [
          { t: "クリック", d: "data-live=\"like\"" },
          { t: "送信", d: "ソケット経由" },
          { t: "レンダリング", d: "新しい状態に署名" },
          { t: "返送", d: "HTML のパッチ" },
          { t: "反映", d: "その場で更新" },
        ],
        note: "このデモは CSS で再現したものです。「いいね」を押すと、イベントが1往復します。",
        points: [
          { t: "フォームと入力", d: "submit、input、change のイベントに対応し、キー付きの行は要素を保ったまま更新されます。" },
          { t: "rooms と live query", d: "同じ room のタブは1つの状態を共有し、<code>publish()</code> でサーバー側の変更を届けます。" },
          { t: "すべてのサーバー環境", d: "<code>nowaki start</code> では WebSocket、各アダプターではイベントごとに POST を1回送ります。" },
        ],
      },
      build: {
        lead: "パース、バンドル、ハッシュ化は Rust 製のツールチェーン（oxc）が担当します。レンダリングは Node 上の Preact で行うので、npm パッケージがそのまま使えます。ビルドのたびに、各ルートが送る JavaScript の量も表示します。",
        panes: ["ルートを書く", "アイランドを指定する", "デプロイする"],
        counter: "// Counter.tsx：画面に入ったらハイドレート",
        likes: "// Likes.tsx：サーバーで動作",
      },
      bench: {
        h2: "5つのフレームワークを<wbr>同じブログで比較",
        lead: "検索、並べ替えできる表、サーバーで検証するフォーム、API ルート、全ページ共通のテーマ切り替えを備えた同じブログを各フレームワークで作り、1台のマシンで1つずつビルドして動かしました。",
        leads: "Nowaki は {m} 項目のうち {n} 項目で最も良い値でした。",
        leastJs: "JavaScript の量は {leader} が最も少なくなっています。",
        tabs: ["1秒あたりのリクエスト数", "静的ビルド", "dev サーバー", "JavaScript の量"],
        notes: [
          "記事ページを毎回レンダリングした場合の値です。各フレームワーク標準のサーバーを、Node のプロセス1つで動かしています。多いほど優れています。",
          "1000ページのブログの全ページを HTML に出力するまでの時間です。短いほど優れています。",
          "コールドスタートから、1000ページのブログの最初のページを返すまでの時間です。短いほど優れています。",
          "Counter のアイランド1つと、全ページ共通のテーマ切り替えのアイランドがあるトップページで、ブラウザが実行する JavaScript の合計です（gzip 圧縮後、ルーターを含む）。少ないほど優れています。",
        ],
        fanout: "1つの変更が1000本の接続に届くまでの時間（p95）。",
        ttfb: "記事ページの TTFB（p50）。{other} は {them}\u00a0ms。",
        memLeast: "待機時のメモリ使用量。5つのサーバーの中で最も少ない値です。",
        mem: "待機時のメモリ使用量。",
        src: "{machine} で計測した中央値です（{date}）。サーバーは5回、ビルドと dev はウォームアップを除く10回計測しました。出典：Tettu0530/nowaki の benchmarks/compare（{commit}）。",
        more: "すべてのベンチマークと計測方法",
      },
      fitLead: "Tettu0530 による個人の OSS で、MIT ライセンスです。現在は alpha 版のため、本番環境の重要な用途ではなく、個人のプロジェクトや検証に使ってください。",
    },
    benchPage: {
      title: "ベンチマーク · Nowaki",
      desc: "nowaki.dev に載せている数値と計測方法の一覧です。小さなアプリでの開発・ビルドの時間、1〜1000ページのブログ、各フレームワークの本番サーバーを、Astro、SvelteKit、Next.js、Nuxt と比較しています。",
      h1: "5つのフレームワークの<wbr>計測結果",
      lead: "nowaki.dev に載せている数値は、すべてこのページの計測によるものです。小さなアプリでの開発・ビルドの時間、1〜1000ページのブログ、各フレームワーク標準の本番サーバーを、1台のマシンで1つずつ計測しました。Nowaki に不利な結果も、そのまま載せています。",
      back: "トップページに戻る",
      method: "計測スクリプトと生データ（英語）",
    },
    docsSite: {
      h2: "ドキュメントサイトでの Astro との比較",
      lead: "同じドキュメントサイトを両方で作りました。Markdown と MDX のエントリーからなる型付きのコンテンツコレクションで、エントリーごとにハイライト付きのコードブロック3つと手元の写真1枚があり、sitemap を生成して静的に出力します。Nowaki は組み込みの機能だけを使っています。",
      group: "{n} エントリー",
      cold: "キャッシュなし",
      warm: "キャッシュあり",
      slower: "キャッシュなしでは、Nowaki のほうが遅くなります。AVIF のエンコードは WebP よりはるかに時間がかかり、Nowaki は C のコーデックを使わないため、sharp や libwebp を使えないからです。キャッシュがあれば、どの規模でも Nowaki のほうが速くなります（{min}〜{max} 倍）。",
      js: "Markdown のエントリー、MDX のエントリー、ドキュメントの一覧のどのページでも、最初に読み込む JavaScript は Nowaki が {nowaki} KB、Astro が {astro} KB です。",
      note: "{machine} で、ウォームアップのあと5回計測した中央値です（{date}）。キャッシュなしは出力と各フレームワークのキャッシュをすべて消してから、キャッシュありはキャッシュを残して計測しました。Nowaki は 0.17.0 のリリース前の main（70f9e0a）からビルドしています。Astro は {astro} です。",
      method: "ドキュメントサイトのベンチマークと生データ（英語）",
      guide: "Astro からの移行ガイド（英語）",
    },
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
<style>${BASE_CSS}${LANDING_CSS}${HOME_CSS}</style>`;
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
