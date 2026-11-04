// Copy for the explainer pages (/jetstream, /architecture, and /ja/ versions).
// Every statement is true of Nowaki 0.15.0 (checked against the v0.15.0 tag of
// Tettu0530/nowaki, its CHANGELOG, ROADMAP and SECURITY.md). Measured values: live.js 1968 B
// gzip from a 0.15.0 build of a page with one live island; {devMs} comes from benchmarks/results/summary.json.

export const LIVE_JS_KB = "1.9";

export const JETSTREAM = {
  en: {
    title: "Jetstream: live islands with no component JavaScript · Nowaki",
    desc: "How Nowaki's Jetstream islands work in 0.15: state on the server, events over a WebSocket or one POST each, HTML patches back, and a 1.9 KB runtime. Rooms, live queries and forms, where each part runs, and what is not there yet.",
    h1: "Live islands that ship no component JavaScript.",
    lead: "A Jetstream island keeps its state on the server. A click, a keystroke or a submitted form goes to the server, your handler runs, the island renders again, and the browser applies the new HTML in place. The component's code never leaves the server.",
    ctaDocs: "Read the Jetstream docs",
    ctaOther: "How Nowaki is built",
    write: {
      h2: "What you write.",
      lead: "An ordinary island file with one more export. Handlers are plain functions from state to state, and buttons name them with data-live instead of onClick.",
      points: [
        { t: "state", d: "Builds the first state, from the props you pass at the usage site." },
        { t: "on", d: "Maps handler names to functions. They may be async; returning nothing keeps the state." },
        { t: "Usage", d: "Put it on a page like any island: <code>&lt;LiveCounter /&gt;</code>. No client directive." },
      ],
    },
    trip: {
      h2: "One round trip.",
      lead: "What happens between a click and the new HTML, over the WebSocket of nowaki dev and nowaki start.",
      lanes: ["Browser", "Rust server", "Node renderer"],
      steps: [
        { t: "Event", d: "A click on <code>[data-live]</code> sends the island id and the handler name over the WebSocket at <code>/__nowaki/live</code>." },
        { t: "Forward", d: "Rust holds each island's state and signature for the connection and passes them, with the event, to the Node renderer on localhost." },
        { t: "Run", d: "Node checks the signature, runs the handler, renders the island to HTML and signs the new state." },
        { t: "Return", d: "The HTML, the new state and its signature go back to Rust." },
        { t: "Patch", d: "Rust pushes them down the same socket." },
        { t: "Morph", d: "live.js updates the island's DOM in place and keeps the signed state on the element." },
      ],
      note: "On the deploy adapters the same event is one <code>POST /__nowaki/live-event</code> that carries the island's signed state. The server checks it, runs the handler and answers with the new HTML, state and signature.",
    },
    rooms: {
      h2: "Rooms: one state, every tab.",
      lead: "Give an island a room, and every instance with the same room id shares one state. A vote in one tab re-renders the poll in every other tab, with no client code of yours.",
      points: [
        { t: "room", d: "Names the room from the props. Same name, same state." },
        { t: "shared", d: "The room's first state. Handlers receive it and return the next one, and every member gets the new HTML." },
        { t: "Presence", d: "<code>data-nowaki-presence=\"poll:demo\"</code> shows how many connections are in the room, over the WebSocket." },
      ],
      note: "Rooms are held in the memory of one server process. They don't reach other instances, and they start empty after a restart. On the deploy adapters a room island handles events, but the other members are not pushed.",
    },
    more: {
      h2: "Also new in 0.15.",
      rows: [
        { t: "Forms and inputs", d: "<code>data-live-submit</code> on a form sends its fields as an object, without navigating. <code>data-live-input</code> sends a field's value while typing, debounced by <code>data-live-debounce</code> (150 ms by default), and <code>data-live-change</code> fires on commit. Checkboxes and radios send <code>{ value, checked }</code>." },
        { t: "Keyed rows", d: "Children with <code>data-key</code> are matched by key when a patch arrives, so filtered or reordered rows keep their elements, and a focused field's value is never overwritten." },
        { t: "Live queries", d: "<code>live.subscribe</code> names topics and <code>live.load</code> reloads the state. After server code changes data, <code>publish(topic)</code> from <code>@nowaki-dev/runtime</code> reloads every subscribed island and pushes the patch, with no event from the browser. It reaches connections in the same process; on the deploy adapters it does nothing for now." },
        { t: "Request context", d: "Handlers call <code>getContext()</code> to read the cookies and the <code>authorization</code>, <code>accept-language</code> and <code>user-agent</code> headers of the WebSocket upgrade. <code>live.authorize</code> runs before each handler, and anything but <code>true</code> refuses the event." },
        { t: "Choosing the transport", d: "live.js uses the WebSocket where there is one, and sends an event as a POST whenever the socket isn't open. <code>&lt;meta name=\"nowaki-live\" content=\"post\"&gt;</code> or <code>\"ws\"</code> in a page's head pins it." },
      ],
    },
    reach: {
      h2: "What reaches the browser.",
      stats: [
        { v: "0 bytes", d: "of the island's component code. A live island gets no client chunk at all." },
        { v: "{live} KB", d: "gzip: live.js in 0.15.0, the whole runtime. It loads only on pages that have a live island." },
        { v: "1 socket", d: "per page under nowaki dev and nowaki start, events up and HTML down. On the adapters each event is one POST. The rest of the page is plain server-rendered HTML." },
      ],
      note: "Measured from a 0.15.0 build of a page with one live island.",
    },
    state: {
      h2: "State stays on the server, signed.",
      lead: "The browser keeps a copy of the state only to resume. It cannot change it.",
      rows: [
        { t: "Signed", d: "Every state carries an HMAC-SHA256 signature with its issue time. A tampered state is refused, and a signature older than <code>NOWAKI_LIVE_MAX_AGE</code> (a day by default) no longer verifies. Every patch is re-signed, so an island in use does not expire." },
        { t: "Per connection, or per room", d: "Without a room, the state belongs to one connection: two tabs are two islands. With <code>live.room</code>, every member shares one state." },
        { t: "One process", d: "Rooms, <code>publish()</code> and presence live in one server process. They don't reach other instances, and rooms start empty after a restart." },
        { t: "Survives a reconnect", d: "Patches carry the signed state and the element keeps it, so after a dropped connection the island resumes where it was. Events sent while the socket is down go over POST." },
        { t: "Set a secret", d: "Set <code>NOWAKI_LIVE_SECRET</code> in production. Without it each process signs with its own random key, so state cannot resume after a restart or on another instance, and production servers warn at startup. On the adapters it is required once more than one instance or Worker isolate can answer, or events fail the signature check." },
        { t: "Origin check", d: "The WebSocket upgrade must come from the page's own origin. A POST event passes the same gate as server functions: JSON only, an <code>x-nowaki-live</code> header, no cross-site requests, 64 KiB at most. Behind a reverse proxy, set <code>NOWAKI_TRUST_PROXY=1</code>." },
        { t: "Back-off", d: "If the socket drops, live.js retries with back-off and gives up after 8 failed attempts in a row. The island keeps its last HTML." },
        { t: "Slow renders", d: "A render runs off the connection loop, one at a time per connection with up to 32 events queued, so pings and presence keep flowing. If it takes longer than <code>NOWAKI_LIVE_RENDER_TIMEOUT_MS</code> (10 seconds by default) or fails, the island keeps its last HTML and the page gets a <code>nowaki:live-error</code> event." },
      ],
    },
    where: {
      h2: "Where it runs.",
      lead: "Every server target runs live islands. Pushes from the server need the WebSocket, which only the Rust server holds.",
      cols: ["Run with", "Jetstream"],
      rows: [
        { k: "<code>nowaki dev</code>", v: "Live over the WebSocket: events, <code>publish()</code>, rooms with presence", ok: true },
        { k: "<code>nowaki start</code>", v: "Live over the WebSocket: events, <code>publish()</code>, rooms with presence", ok: true },
        { k: "node, bun, deno, vercel and cloudflare adapters", v: "Live, one POST per event. No server push: <code>publish()</code> does nothing, other room members are not updated, and there is no presence.", ok: true },
        { k: "Static output (<code>nowaki prerender</code>, static adapter)", v: "First HTML only. live.js still loads, but nothing answers its POSTs: the island keeps its first HTML and the page gets <code>nowaki:live-error</code>." },
      ],
    },
    fit: {
      h2: "Where it fits, and what is not there yet.",
      forTitle: "A good fit",
      for: [
        "Small interactive parts backed by server data: likes, votes, counters, toggles, admin actions.",
        "Forms, filters and search boxes whose results come from the server.",
        "Shared state on one server: polls, presence, a small multiplayer view.",
        "Pages where shipping component code is the cost you want to avoid.",
      ],
      notTitle: "Not yet",
      not: [
        "Rooms, publish and presence across several instances: they live in one process.",
        "Rooms that survive a server restart (planned).",
        "Server push on the deploy adapters: events work, pushes don't.",
        "Notifications for stale state, and a resume token (planned).",
        "Static hosting: there is no server to answer events.",
      ],
    },
    close: { h2: "Try a live island.", docs: "Read the Jetstream docs" },
  },
  ja: {
    title: "Jetstream：コンポーネント JS を送らない live の島 · Nowaki",
    desc: "Nowaki 0.15 の Jetstream の仕組み。状態はサーバーに置き、イベントは WebSocket で、または1件ずつ POST で送り、HTML のパッチが返ってきます。ランタイムは 1.9 KB。rooms・live query・フォームと、それぞれが動く環境、まだできないことをまとめました。",
    h1: "コンポーネントの JavaScript を<wbr>送らない、live の島。",
    lead: "Jetstream の島は状態をサーバーに置きます。クリック・入力・フォームの送信がサーバーへ届くと、handler が実行されて島が描き直され、ブラウザは新しい HTML をその場で反映します。コンポーネントのコードはサーバーから出ません。",
    ctaDocs: "Jetstream のドキュメント（英語）",
    ctaOther: "Nowaki の仕組み",
    write: {
      h2: "書くもの。",
      lead: "ふつうの島のファイルに export を1つ足したものです。handler は状態を受け取って新しい状態を返すふつうの関数で、ボタンには onClick ではなく data-live でその名前を書きます。",
      points: [
        { t: "state", d: "使う側で渡した props から、最初の状態を作ります。" },
        { t: "on", d: "handler の名前と関数の対応です。async でもよく、何も返さなければ状態は変わりません。" },
        { t: "使い方", d: "ほかの島と同じく、<code>&lt;LiveCounter /&gt;</code> のようにページに置きます。client ディレクティブは要りません。" },
      ],
    },
    trip: {
      h2: "1往復で起きること。",
      lead: "nowaki dev と nowaki start の WebSocket を使う場合の、クリックから新しい HTML が反映されるまでの流れです。",
      lanes: ["ブラウザ", "Rust サーバー", "Node レンダラー"],
      steps: [
        { t: "イベント", d: "<code>[data-live]</code> をクリックすると、島の id と handler の名前が <code>/__nowaki/live</code> の WebSocket で送られます。" },
        { t: "転送", d: "Rust は接続ごとに各島の状態と署名を持っていて、イベントと一緒に localhost の Node レンダラーへ渡します。" },
        { t: "実行", d: "Node が署名を確かめ、handler を実行し、島を HTML に描き直して、新しい状態に署名します。" },
        { t: "返却", d: "HTML と新しい状態、その署名を Rust に返します。" },
        { t: "パッチ", d: "Rust がそれらを同じソケットでブラウザへ送ります。" },
        { t: "反映", d: "live.js が島の DOM をその場で更新し、署名付きの状態を要素に保存します。" },
      ],
      note: "デプロイ用のアダプタでは、同じイベントを <code>POST /__nowaki/live-event</code> 1回で送ります。リクエストには島の署名付きの状態が入っていて、サーバーはそれを確かめてから handler を実行し、新しい HTML・状態・署名を返します。",
    },
    rooms: {
      h2: "rooms：すべての\u2060タブで<wbr>1つの状態。",
      lead: "島に room を指定すると、同じ room id のインスタンスがすべて1つの状態を共有します。1つのタブで投票すると、ほかのすべてのタブで投票の島が描き直されます。クライアントのコードを書く必要はありません。",
      points: [
        { t: "room", d: "props から room の名前を決めます。名前が同じなら、状態も同じです。" },
        { t: "shared", d: "room の最初の状態です。handler はこれを受け取って次の状態を返し、メンバー全員に新しい HTML が届きます。" },
        { t: "在席表示", d: "<code>data-nowaki-presence=\"poll:demo\"</code> を付けた要素に、room にいる接続の数が表示されます。WebSocket のときだけです。" },
      ],
      note: "rooms はサーバーのプロセス1つのメモリに置きます。ほかのインスタンスには届かず、再起動すると空になります。デプロイ用のアダプタでも room の島はイベントを処理しますが、ほかのメンバーには push されません。",
    },
    more: {
      h2: "0.15 で入ったほかの機能。",
      rows: [
        { t: "フォームと入力", d: "フォームに <code>data-live-submit</code> を付けると、ページを移動せずに、入力欄の値をオブジェクトにまとめて送ります。<code>data-live-input</code> は入力中の値を送り、<code>data-live-debounce</code>（既定は150\u00a0ms）で間引きます。<code>data-live-change</code> は値が確定したときに送ります。チェックボックスとラジオボタンは <code>{ value, checked }</code> を送ります。" },
        { t: "key 付きの行", d: "<code>data-key</code> を付けた子要素は、パッチを当てるときに key で対応づけられます。絞り込みや並べ替えのあとも行の要素はそのまま残り、フォーカス中の入力欄の値が上書きされることもありません。" },
        { t: "live query", d: "<code>live.subscribe</code> でトピックを指定し、<code>live.load</code> で状態を読み直します。サーバーのコードでデータを変えたあと、<code>@nowaki-dev/runtime</code> の <code>publish(topic)</code> を呼ぶと、購読しているすべての島が読み直され、ブラウザからのイベントなしでパッチが届きます。届くのは同じプロセスの接続だけです。デプロイ用のアダプタでは、<code>publish()</code> は今のところ何もしません。" },
        { t: "リクエストの情報", d: "handler の中で <code>getContext()</code> を呼ぶと、WebSocket の接続を始めたリクエストの Cookie と、<code>authorization</code>・<code>accept-language</code>・<code>user-agent</code> のヘッダを読めます。<code>live.authorize</code> は handler の前に毎回実行され、<code>true</code> 以外を返すとイベントを拒否します。" },
        { t: "送り方の指定", d: "live.js は WebSocket があればそれを使い、ソケットがつながっていないあいだのイベントは POST で送ります。ページの head に <code>&lt;meta name=\"nowaki-live\" content=\"post\"&gt;</code> か <code>\"ws\"</code> を書くと、送り方を固定できます。" },
      ],
    },
    reach: {
      h2: "ブラウザに届くもの。",
      stats: [
        { v: "0 バイト", d: "島のコンポーネントのコードは届きません。live の島にはクライアント用のチャンク自体がありません。" },
        { v: "{live} KB", d: "gzip 後の live.js（0.15.0）。ランタイムはこれだけで、live の島があるページでだけ読み込みます。" },
        { v: "ソケット1本", d: "nowaki dev と nowaki start では、ページごとに1本で、イベントを送り HTML を受け取ります。アダプタでは、イベントごとに POST を1回送ります。ページのほかの部分はサーバーで描いたふつうの HTML です。" },
      ],
      note: "live の島を1つ置いたページを 0.15.0 でビルドして測りました。",
    },
    state: {
      h2: "状態は署名付きで<wbr>サーバーに置く。",
      lead: "ブラウザが状態の写しを持つのは、再開のためだけです。ブラウザから書き換えることはできません。",
      rows: [
        { t: "署名", d: "状態にはすべて、発行時刻を含む HMAC-SHA256 の署名が付きます。改ざんされた状態は受け付けず、<code>NOWAKI_LIVE_MAX_AGE</code>（既定は1日）より古い署名も無効になります。パッチのたびに署名し直すので、使われている島が期限切れになることはありません。" },
        { t: "接続ごとか room ごと", d: "room を指定しなければ、状態は接続ごとです。タブが2つなら島も2つです。<code>live.room</code> を指定すると、メンバー全員で1つの状態を共有します。" },
        { t: "プロセス1つ", d: "rooms・<code>publish()</code>・在席表示は、サーバーのプロセス1つの中で動きます。ほかのインスタンスには届かず、再起動すると rooms は空になります。" },
        { t: "再接続しても続く", d: "パッチには署名付きの状態が入っていて、要素がそれを保持します。そのため接続が切れたあとも、島は切れる前の状態から再開します。ソケットが切れているあいだのイベントは POST で送ります。" },
        { t: "秘密鍵を設定する", d: "本番では <code>NOWAKI_LIVE_SECRET</code> を設定してください。未設定だと鍵はプロセスごとにランダムなので、再起動のあとや別のインスタンスでは状態を再開できません。未設定のまま起動すると、本番のサーバーは警告を出します。アダプタでは、2つ以上のインスタンスや Worker の isolate がリクエストを受ける構成なら必須です。設定しないと、イベントが署名の確認で失敗します。" },
        { t: "Origin の確認", d: "受け付ける WebSocket の接続は、ページと同じオリジンからのものだけです。POST のイベントには、サーバー関数と同じ確認があります。受け付けるのは 64 KiB までの JSON だけで、<code>x-nowaki-live</code> ヘッダが必須です。別サイトからのリクエストは拒否します。リバースプロキシの後ろでは <code>NOWAKI_TRUST_PROXY=1</code> を設定してください。" },
        { t: "再試行", d: "ソケットが切れると、live.js はバックオフを挟みながら再接続を試し、8回続けて失敗するとやめます。島は最後の HTML のまま残ります。" },
        { t: "遅い描画", d: "描画は接続のループの外で、接続ごとに1件ずつ行います。キューで待てるイベントは最大32件です。描画の間も ping と接続数の配信は止まりません。描画が <code>NOWAKI_LIVE_RENDER_TIMEOUT_MS</code>（既定は10秒）を超えるか失敗すると、島は最後の HTML のまま残り、ページに <code>nowaki:live-error</code> イベントが届きます。" },
      ],
    },
    where: {
      h2: "動く環境。",
      lead: "サーバーのあるデプロイ先なら、どこでも live の島が動きます。サーバーからの push には WebSocket が必要で、その接続を保てるのは Rust のサーバーだけです。",
      cols: ["実行方法", "Jetstream"],
      rows: [
        { k: "<code>nowaki dev</code>", v: "WebSocket で live：イベント、<code>publish()</code>、在席表示つきの rooms", ok: true },
        { k: "<code>nowaki start</code>", v: "WebSocket で live：イベント、<code>publish()</code>、在席表示つきの rooms", ok: true },
        { k: "node・bun・deno・vercel・cloudflare アダプタ", v: "live（イベントごとに POST を1回）。サーバーからの push はありません。<code>publish()</code> は何もせず、room のほかのメンバーは更新されず、在席表示もありません。", ok: true },
        { k: "静的出力（<code>nowaki prerender</code>、static アダプタ）", v: "最初の HTML だけ。live.js は読み込まれますが、POST に応えるサーバーがありません。島は最初の HTML のまま残り、ページに <code>nowaki:live-error</code> が届きます。" },
      ],
    },
    fit: {
      h2: "向く場面と、まだできないこと。",
      forTitle: "向いている",
      for: [
        "サーバーのデータを使う小さな操作部分：いいね、投票、カウンター、切り替え、管理画面の操作。",
        "結果をサーバーで作るフォーム・絞り込み・検索欄。",
        "サーバーのプロセス1つの中で共有する状態：投票、在席表示、多人数で使う小さな画面。",
        "コンポーネントのコードを送るコストを避けたいページ。",
      ],
      notTitle: "まだできない",
      not: [
        "複数のインスタンスにまたがる rooms・publish・在席表示。今はプロセス1つの中だけです。",
        "サーバーを再起動しても残る rooms（予定）。",
        "デプロイ用のアダプタでの、サーバーからの push。イベントは動きますが、push はありません。",
        "状態が古くなったことの通知と、resume token（予定）。",
        "静的なホスティング。イベントに応えるサーバーがありません。",
      ],
    },
    close: { h2: "live の島を試す。", docs: "Jetstream のドキュメント（英語）" },
  },
} as const;

export const ARCHITECTURE = {
  en: {
    title: "Architecture: a Rust toolchain in front, a Node renderer behind · Nowaki",
    desc: "How Nowaki is built: oxc compiles and bundles, a Rust server serves files and assembles HTML, Node renders Preact, and islands hydrate on their directive. Shipped as a native binary through npm.",
    h1: "A Rust toolchain in front, a Node renderer behind.",
    lead: "Nowaki compiles with oxc and serves with a Rust server, and renders your components with Preact on Node, so npm packages keep working. This page follows one app from source to the browser.",
    ctaDocs: "Read the docs",
    ctaOther: "How Jetstream works",
    system: {
      h2: "Two runtimes, one command.",
      lead: "nowaki start runs both. The Rust front faces the network; the Node renderer stays on localhost.",
      boxes: [
        { t: "Browser", items: ["HTML from the server", "islands.js hydrates each island on its client:* directive", "the page router, fetched when idle", "live.js, only on pages with a live island"] },
        { t: "Rust front", sub: "axum", items: ["files under /_nowaki/, cached as immutable", "HTML assembly: preload links, island and live scripts", "ISR cache (x-nowaki-cache: HIT, STALE, MISS)", "the Jetstream WebSocket at /__nowaki/live"] },
        { t: "Node renderer", sub: "Preact", items: ["server rendering of the route", "loaders and actions", "server functions (\"use server\")", "Jetstream handlers"] },
      ],
      links: ["HTTP, WebSocket", "HTTP on 127.0.0.1"],
    },
    build: {
      h2: "Build: oxc from parse to hash.",
      lead: "nowaki build runs the whole pipeline in Rust. Node takes part only when you add plugins or .tsrx islands.",
      steps: [
        { t: "Parse", d: "oxc parses every module." },
        { t: "Transform", d: "TypeScript is stripped and JSX compiled for Preact." },
        { t: "Graph", d: "Imports are resolved with oxc_resolver into one module graph." },
        { t: "Hoist", d: "Each island's own modules are concatenated into one chunk." },
        { t: "Minify", d: "The oxc minifier runs; dependencies and shared code become deduplicated chunks, with one Preact." },
        { t: "Hash", d: "An xxh3 content hash goes into every file name." },
        { t: "Write", d: "dist/client with manifest.json for the browser, dist/server for the renderer." },
      ],
    },
    request: {
      h2: "Request: Rust first.",
      rows: [
        { t: "Static files", d: "Hashed files under <code>/_nowaki/</code> come straight from Rust with a one-year immutable cache header." },
        { t: "Pages", d: "Node renders the route and returns its body, title and head. Rust assembles the document, adds modulepreload links and the island runtime, and adds live.js only when the page has a live island." },
        { t: "ISR", d: "Routes that export <code>revalidate</code> are cached in Rust and revalidated in the background, one request per path at a time." },
        { t: "Server functions", d: "Calls go to <code>POST /__nowaki/fn</code>; only functions exported from <code>\"use server\"</code> modules can be reached." },
      ],
    },
    security: {
      h2: "Secure by default.",
      lead: "Since 0.14 the defaults close the common holes. They are only defaults: what your app sets wins.",
      rows: [
        { t: "Security headers", d: "Every response from <code>nowaki dev</code>, <code>nowaki start</code> (ISR hits and static files included), every adapter, and the <code>_headers</code> that <code>nowaki prerender</code> writes carries <code>nosniff</code>, <code>x-frame-options: SAMEORIGIN</code>, a referrer policy and <code>cross-origin-opener-policy: same-origin</code>, plus <code>frame-ancestors 'self'</code> when the app sends no CSP." },
        { t: "Cross-site posts", d: "Page actions answer a cross-site non-GET request with 403. API routes only warn for now; <code>export const csrf</code> turns the check on or off per route." },
        { t: "Server functions", d: "<code>serverFn(schema, impl)</code> validates the first argument with any Standard Schema library before your code runs, and <code>nowaki build</code> warns about functions that take arguments without it. In production only <code>ServerFnError</code> messages reach the client, and bodies over 1 MiB get 413." },
        { t: "CSP, opt-in", d: "With <code>NOWAKI_CSP=report-only</code> or <code>enforce</code>, every <code>&lt;script&gt;</code> and <code>&lt;style&gt;</code> gets a per-response nonce, made fresh even for ISR hits. It is off by default." },
        { t: "Forwarded headers", d: "The Rust front drops client-sent <code>x-forwarded-*</code> headers and sets the host itself. Behind a reverse proxy, set <code>NOWAKI_TRUST_PROXY=1</code>." },
      ],
      more: "Security in the docs",
    },
    client: {
      h2: "Client: islands first, router later.",
      rows: [
        { t: "Islands", d: "islands.js finds each island and imports its chunk on its directive: <code>client:load</code>, <code>idle</code>, <code>visible</code>, <code>media</code> or <code>only</code>." },
        { t: "Router", d: "The client router is fetched once the page is idle, so the first load carries only the islands. Visited pages stay cached for 30 seconds." },
        { t: "Live islands", d: "Jetstream islands get no chunk; live.js handles them over one socket, or one POST per event on the adapters." },
      ],
    },
    dev: {
      h2: "Dev: compile on request.",
      rows: [
        { t: "On demand", d: "nowaki dev transforms a file when the browser asks for it, and keeps the result in memory and on disk in <code>node_modules/.cache/nowaki</code>." },
        { t: "One island at a time", d: "Editing a file in <code>islands/</code> re-renders that island alone (its local state resets); other edits reload the page. Errors appear as a full-screen overlay." },
        { t: "First page in {devMs} ms", d: "From starting nowaki dev until it returns the first page, for the counter app in our five-framework head-to-head." },
      ],
    },
    ship: {
      h2: "Shipped through npm.",
      rows: [
        { t: "A native binary", d: "The <code>nowaki</code> package installs a prebuilt binary for macOS, Linux or Windows through optional dependencies. No Rust toolchain is needed." },
        { t: "Node 22 or later", d: "Node runs the renderer, with Preact 10 or 11 as the component library." },
        { t: "Or cargo", d: "<code>cargo install nowaki</code> builds the same CLI from crates.io." },
      ],
    },
    deploy: {
      h2: "Deploy targets.",
      cols: ["Target", "Output", "Jetstream"],
      rows: [
        { k: "<code>nowaki start</code>", o: "The Rust front with the Node renderer", j: "Live over the WebSocket, with server push", ok: true },
        { k: "node, bun, deno", o: "<code>dist/server/index.mjs</code>", j: "Live, one POST per event", ok: true },
        { k: "static", o: "Prerendered HTML in <code>dist/static</code>, with <code>404.html</code> and <code>staticPaths</code>", j: "First HTML only" },
        { k: "cloudflare", o: "A Worker in <code>dist/worker</code> with <code>wrangler.jsonc</code>", j: "Live, one POST per event", ok: true },
        { k: "vercel", o: "Build Output API v3 in <code>.vercel/output</code>", j: "Live, one POST per event", ok: true },
      ],
    },
    close: { h2: "Read the code, or start an app.", docs: "Read the docs" },
  },
  ja: {
    title: "仕組み：前に Rust のツールチェーン、後ろに Node のレンダラー · Nowaki",
    desc: "Nowaki の仕組み。oxc がコンパイルしてバンドルし、Rust サーバーがファイルを配信して HTML を組み立て、Node が Preact で描画し、島はディレクティブに従ってハイドレートします。npm でネイティブバイナリとして配布しています。",
    h1: "前に\u00a0Rust\u00a0の<wbr>ツールチェーン、後ろに\u00a0Node\u00a0の<wbr>レンダラー。",
    lead: "Nowaki は oxc でコンパイルし、Rust サーバーで配信します。コンポーネントは Node 上の Preact で描画するので、npm パッケージがそのまま使えます。このページでは1つのアプリをソースからブラウザまでたどります。",
    ctaDocs: "ドキュメント（英語）",
    ctaOther: "Jetstream の仕組み",
    system: {
      h2: "2つのランタイムを<wbr>1つのコマンドで動かす。",
      lead: "nowaki start は両方を起動します。ネットワークに面するのは Rust のフロントで、Node のレンダラーは localhost の外に出ません。",
      boxes: [
        { t: "ブラウザ", items: ["サーバーが描いた HTML", "islands.js が client:* に従って島をハイドレート", "ページルーターはアイドル状態になってから取得", "live.js は live の島があるページだけ"] },
        { t: "Rust フロント", sub: "axum", items: ["/_nowaki/ のファイルを immutable で配信", "HTML の組み立て：preload リンク、島と live のスクリプト", "ISR キャッシュ（x-nowaki-cache：HIT・STALE・MISS）", "Jetstream の WebSocket（/__nowaki/live）"] },
        { t: "Node レンダラー", sub: "Preact", items: ["ルートのサーバー描画", "loader と action", "サーバー関数（\"use server\"）", "Jetstream の handler"] },
      ],
      links: ["HTTP、WebSocket", "127.0.0.1 上の HTTP"],
    },
    build: {
      h2: "ビルド：パースから<wbr>ハッシュまで\u00a0oxc。",
      lead: "nowaki build はパイプライン全体を Rust で実行します。Node が関わるのは、プラグインや .tsrx の島を使うときだけです。",
      steps: [
        { t: "パース", d: "oxc がすべてのモジュールをパースします。" },
        { t: "変換", d: "TypeScript の型を取り除き、JSX を Preact 向けにコンパイルします。" },
        { t: "グラフ", d: "import を oxc_resolver で解決し、1つのモジュールグラフにします。" },
        { t: "結合", d: "島ごとに、その島だけが使うモジュールを1つのチャンクにまとめます。" },
        { t: "圧縮", d: "oxc の minifier をかけます。依存と共有コードは重複のないチャンクになり、Preact は1つだけです。" },
        { t: "ハッシュ", d: "すべてのファイル名に xxh3 のコンテンツハッシュを付けます。" },
        { t: "書き出し", d: "ブラウザ向けの dist/client（manifest.json 付き）と、レンダラー向けの dist/server を書き出します。" },
      ],
    },
    request: {
      h2: "リクエスト：まず Rust\u00a0が受ける。",
      rows: [
        { t: "静的ファイル", d: "<code>/_nowaki/</code> のハッシュ付きファイルは、Rust が1年の immutable のキャッシュヘッダーを付けて直接返します。" },
        { t: "ページ", d: "Node がルートを描画して本文・タイトル・head を返し、Rust が文書を組み立てます。modulepreload のリンクと島のランタイムを足し、live の島があるページにだけ live.js を足します。" },
        { t: "ISR", d: "<code>revalidate</code> を export したルートは Rust がキャッシュし、バックグラウンドで再検証します。再検証はパスごとに1件ずつです。" },
        { t: "サーバー関数", d: "呼び出しは <code>POST /__nowaki/fn</code> に届きます。呼べるのは <code>\"use server\"</code> のモジュールが export した関数だけです。" },
      ],
    },
    security: {
      h2: "設定なしで安全。",
      lead: "0.14 から、よくある穴は既定の設定でふさいでいます。あくまで既定値なので、アプリが自分で設定した値が優先されます。",
      rows: [
        { t: "セキュリティヘッダ", d: "<code>nowaki dev</code>・<code>nowaki start</code>（ISR のヒットと静的ファイルを含む）・すべてのアダプタが返すレスポンスと、<code>nowaki prerender</code> が書き出す <code>_headers</code> には、<code>nosniff</code>、<code>x-frame-options: SAMEORIGIN</code>、Referrer-Policy、<code>cross-origin-opener-policy: same-origin</code> を付けます。アプリが CSP を送らないときは <code>frame-ancestors 'self'</code> も付けます。" },
        { t: "別サイトからの送信", d: "別サイトから action への GET 以外のリクエストには 403 を返します。API ルートは当面、警告を出すだけです。<code>export const csrf</code> でルートごとに確認の有効・無効を切り替えられます。" },
        { t: "サーバー関数", d: "<code>serverFn(schema, impl)</code> は、Standard Schema に対応したライブラリで最初の引数を検証してからコードを実行します。引数を取るのに検証のない関数には、<code>nowaki build</code> が警告を出します。本番でクライアントに届くのは <code>ServerFnError</code> のメッセージだけです。1 MiB を超える body には 413 を返します。" },
        { t: "CSP（opt-in）", d: "<code>NOWAKI_CSP=report-only</code> か <code>enforce</code> を設定すると、すべての <code>&lt;script&gt;</code> と <code>&lt;style&gt;</code> にレスポンスごとの nonce を付けます。ISR のキャッシュから返すときも、nonce は毎回新しく作ります。既定では無効です。" },
        { t: "転送ヘッダ", d: "Rust のフロントは、クライアントが付けた <code>x-forwarded-*</code> を捨て、ホストを自分で設定します。リバースプロキシの後ろでは <code>NOWAKI_TRUST_PROXY=1</code> を設定してください。" },
      ],
      more: "Security のドキュメント（英語）",
    },
    client: {
      h2: "クライアント：先に島、ルーターはあとで。",
      rows: [
        { t: "島", d: "islands.js が島を見つけ、<code>client:load</code>・<code>idle</code>・<code>visible</code>・<code>media</code>・<code>only</code> のディレクティブに従ってチャンクを import します。" },
        { t: "ルーター", d: "クライアントのルーターはページがアイドル状態になってから取得するので、最初の読み込みは島だけです。表示したページは30秒キャッシュします。" },
        { t: "live の島", d: "Jetstream の島にはチャンクがなく、live.js が1本のソケットで扱います。アダプタでは、イベントごとに POST を1回送ります。" },
      ],
    },
    dev: {
      h2: "開発：リクエストされたら<wbr>コンパイル。",
      rows: [
        { t: "必要なときに", d: "nowaki dev は、ブラウザが求めたときにファイルを変換し、結果をメモリと <code>node_modules/.cache/nowaki</code> に保存します。" },
        { t: "島は1つずつ", d: "<code>islands/</code> のファイルを編集すると、その島だけを描き直し、島のローカル状態はリセットされます。ほかの編集ではページを再読み込みします。エラーは全画面のオーバーレイで表示します。" },
        { t: "{devMs} ms で最初のページ", d: "5つのフレームワークの比較で使ったカウンターアプリで、nowaki dev を起動してから最初のページを返すまでの時間です。" },
      ],
    },
    ship: {
      h2: "npm で配布。",
      rows: [
        { t: "ネイティブバイナリ", d: "<code>nowaki</code> パッケージは optional dependencies を通じて macOS・Linux・Windows 向けのビルド済みバイナリを入れます。Rust のツールチェーンは要りません。" },
        { t: "Node 22 以上", d: "レンダラーは Node で動き、コンポーネントのライブラリは Preact 10 か 11 です。" },
        { t: "cargo でも", d: "<code>cargo install nowaki</code> で、同じ CLI を crates.io からビルドできます。" },
      ],
    },
    deploy: {
      h2: "デプロイ先。",
      cols: ["デプロイ先", "出力", "Jetstream"],
      rows: [
        { k: "<code>nowaki start</code>", o: "Rust フロントと Node レンダラー", j: "WebSocket で live、サーバーからの push もあり", ok: true },
        { k: "node・bun・deno", o: "<code>dist/server/index.mjs</code>", j: "live（イベントごとに POST を1回）", ok: true },
        { k: "static", o: "<code>dist/static</code> に prerender した HTML（<code>404.html</code>、<code>staticPaths</code> に対応）", j: "最初の HTML だけ" },
        { k: "cloudflare", o: "<code>dist/worker</code> の Worker と <code>wrangler.jsonc</code>", j: "live（イベントごとに POST を1回）", ok: true },
        { k: "vercel", o: "<code>.vercel/output</code> の Build Output API v3", j: "live（イベントごとに POST を1回）", ok: true },
      ],
    },
    close: { h2: "コードを読むか、アプリを始めるか。", docs: "ドキュメント（英語）" },
  },
} as const;
