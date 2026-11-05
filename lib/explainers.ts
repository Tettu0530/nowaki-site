// Copy for the explainer pages (/jetstream, /architecture, and /ja/ versions).
// Every statement is true of Nowaki 0.16.0 (checked against the v0.16.0 tag of
// Tettu0530/nowaki, its CHANGELOG, ROADMAP and SECURITY.md). Measured values: live.js 2051 B
// gzip from a 0.16.0 server build of a page with one live island; {devMs} comes from benchmarks/results/summary.json.

export const LIVE_JS_KB = "2.0";

export const JETSTREAM = {
  en: {
    title: "Jetstream: live islands with no component JavaScript · Nowaki",
    desc: "How Nowaki's Jetstream islands work in 0.16: state on the server, events over a WebSocket or one POST each, and HTML patches back. Rooms, live queries and forms, where each part runs, and what is not there yet.",
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
      note: "Rooms are shared within one server process and don't reach other instances. Since 0.16, <code>nowaki start</code> saves them to <code>.nowaki/live-rooms.json</code> and restores them after a restart (<code>NOWAKI_LIVE_ROOMS_FILE=off</code> keeps them in memory); <code>nowaki dev</code> and the adapters don't save them. On the deploy adapters a room island handles events, but the other members are not pushed.",
    },
    fanout: {
      h2: "One change, 1000 connections.",
      lead: "How long one change on the server takes to reach every subscribed connection under nowaki start: 1000 WebSocket connections, the same change repeated 150 times.",
      stats: [
        { v: "27.0\u00a0ms", d: "p95 per patch for a live query: one publish() reaching 1000 subscribed islands. 63.2\u00a0ms on 0.15." },
        { v: "29.5\u00a0ms", d: "p95 per patch for a room: one vote reaching the other 999 members. 67.5\u00a0ms on 0.15." },
        { v: "0 missed", d: "of more than 149,850 patches in each scenario." },
      ],
      note: "Median of 3 sets on an Apple M2, with Nowaki 0.16.0 built from the v0.16.0 tag. The receiving client is one Node process on the same machine, so handling 1000 messages is part of each number. In 0.15 every connection asked for its own render, one after another; 0.16 renders once per publish and shares it with every connection that can use it (<a class=\"tlink\" href=\"https://github.com/Tettu0530/nowaki/issues/97\">issue #97</a>). The deploy adapters have no server push, so this applies to nowaki dev and nowaki start only.",
      method: "The harness and every set",
      href: "https://github.com/Tettu0530/nowaki/blob/a97a3c0/BENCHMARKS.md#jetstream-fan-out--1000-connections",
    },
    more: {
      h2: "Also new in 0.15.",
      rows: [
        { t: "Forms and inputs", d: "<code>data-live-submit</code> on a form sends its fields as an object, without navigating. <code>data-live-input</code> sends a field's value while typing, debounced by <code>data-live-debounce</code> (150 ms by default), and <code>data-live-change</code> fires on commit. Checkboxes and radios send <code>{ value, checked }</code>." },
        { t: "Keyed rows", d: "Children with <code>data-key</code> are matched by key when a patch arrives, so filtered or reordered rows keep their elements, and a focused field's value is never overwritten." },
        { t: "Live queries", d: "<code>live.subscribe</code> names topics and <code>live.load</code> reloads the state. After server code changes data, <code>publish(topic)</code> from <code>@nowaki-dev/runtime</code> reloads every subscribed island and pushes the patch, with no event from the browser. It reaches connections in the same process; on the deploy adapters it does nothing for now." },
        { t: "Request context", d: "Handlers call <code>getContext()</code> to read the cookies and the <code>authorization</code>, <code>accept-language</code> and <code>user-agent</code> headers of the WebSocket upgrade. <code>live.authorize</code> runs before each handler, and anything but <code>true</code> refuses the event. An island that reads the request, or has <code>live.authorize</code>, is rendered per connection on a publish; the rest share one render." },
        { t: "Choosing the transport", d: "live.js uses the WebSocket where there is one, and sends an event as a POST whenever the socket isn't open. <code>&lt;meta name=\"nowaki-live\" content=\"post\"&gt;</code> or <code>\"ws\"</code> in a page's head pins it." },
      ],
    },
    reach: {
      h2: "What reaches the browser.",
      stats: [
        { v: "0 bytes", d: "of the island's component code. A live island gets no client chunk at all." },
        { v: "{live} KB", d: "gzip: live.js in 0.16.0, the whole runtime. It loads only on pages that have a live island." },
        { v: "1 socket", d: "per page under nowaki dev and nowaki start, events up and HTML down. On the adapters each event is one POST. The rest of the page is plain server-rendered HTML." },
      ],
      note: "Measured from a 0.16.0 server build of a page with one live island.",
    },
    state: {
      h2: "State stays on the server, signed.",
      lead: "The browser keeps a copy of the state only to resume. It cannot change it.",
      rows: [
        { t: "Signed", d: "Every state carries an HMAC-SHA256 signature with its issue time. A tampered state is refused, and a signature older than <code>NOWAKI_LIVE_MAX_AGE</code> (a day by default) no longer verifies. Every patch is re-signed, so an island in use does not expire. Since 0.16 an expired but genuine state is reported as stale: the page gets a cancelable <code>nowaki:live-stale</code> event and reloads for fresh state." },
        { t: "Per connection, or per room", d: "Without a room, the state belongs to one connection: two tabs are two islands. With <code>live.room</code>, every member shares one state." },
        { t: "One process", d: "Rooms, <code>publish()</code> and presence live in one server process and don't reach other instances. Since 0.16, <code>nowaki start</code> keeps rooms across a restart in <code>.nowaki/live-rooms.json</code>." },
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
        { k: "Static output (<code>nowaki prerender</code>, static adapter)", v: "First HTML only. There is no server to answer events, so since 0.16 static pages ship no live.js." },
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
        "Server push on the deploy adapters: events work, pushes don't.",
        "A resume token for a state that has gone stale (deferred).",
        "Static hosting: there is no server to answer events.",
      ],
    },
    close: { h2: "Try a live island.", docs: "Read the Jetstream docs" },
  },
  ja: {
    title: "Jetstream アイランドの仕組み · Nowaki",
    desc: "Nowaki 0.16 の Jetstream の仕組みを解説します。状態はサーバーに置き、ブラウザはイベントを WebSocket または POST で送って HTML のパッチを受け取ります。rooms、live query、フォームの使い方に加え、各機能の動作環境と、まだできないことをまとめています。",
    h1: "コンポーネントの JavaScript を<wbr>送らないアイランド",
    lead: "Jetstream アイランドは状態をサーバーで管理します。クリックや入力、フォームの送信がサーバーに届くと handler が実行され、アイランドが再レンダリングされます。ブラウザは新しい HTML をその場で反映します。コンポーネントのコードがサーバーの外に出ることはありません。",
    ctaDocs: "Jetstream のドキュメント（英語）",
    ctaOther: "Nowaki のアーキテクチャ",
    write: {
      h2: "基本的な書き方",
      lead: "通常のアイランドのファイルに、export を1つ追加するだけです。handler は、状態を受け取って新しい状態を返すだけの関数です。ボタンには onClick の代わりに、data-live 属性で handler の名前を指定します。",
      points: [
        { t: "state", d: "使う側で渡した props から、初期状態を作ります。" },
        { t: "on", d: "handler の名前と関数を対応づけます。async 関数も使え、何も返さなければ状態は変わりません。" },
        { t: "使い方", d: "ほかのアイランドと同じように、<code>&lt;LiveCounter /&gt;</code> と書いてページに置きます。client ディレクティブは不要です。" },
      ],
    },
    trip: {
      h2: "1回のやり取りの流れ",
      lead: "nowaki dev と nowaki start で WebSocket を使う場合に、クリックしてから新しい HTML が反映されるまでの流れです。",
      lanes: ["ブラウザ", "Rust サーバー", "Node レンダラー"],
      steps: [
        { t: "イベント", d: "<code>[data-live]</code> の要素をクリックすると、アイランドの id と handler の名前が <code>/__nowaki/live</code> の WebSocket で送信されます。" },
        { t: "転送", d: "Rust は接続ごとに各アイランドの状態と署名を保持しており、イベントと一緒に localhost の Node レンダラーへ渡します。" },
        { t: "実行", d: "Node が署名を検証して handler を実行し、アイランドを HTML にレンダリングして、新しい状態に署名します。" },
        { t: "返却", d: "HTML と新しい状態、その署名を Rust に返します。" },
        { t: "パッチ", d: "Rust が、受け取った HTML と状態、署名を同じソケットでブラウザに送ります。" },
        { t: "反映", d: "live.js がアイランドの DOM をその場で更新し、署名付きの状態を要素に保存します。" },
      ],
      note: "デプロイ用のアダプターでは、同じイベントを <code>POST /__nowaki/live-event</code> 1回で送信します。リクエストにはアイランドの署名付きの状態が含まれます。サーバーは署名を検証してから handler を実行し、新しい HTML、状態、署名を返します。",
    },
    rooms: {
      h2: "rooms：複数の⁠タブで<wbr>状態を共有",
      lead: "アイランドに room を指定すると、同じ room id のインスタンスがすべて1つの状態を共有します。1つのタブで投票すると、ほかのすべてのタブで投票のアイランドが再レンダリングされます。クライアント側のコードは不要です。",
      points: [
        { t: "room", d: "props から room の名前を決めます。名前が同じなら、同じ状態を共有します。" },
        { t: "shared", d: "room の初期状態です。handler はこれを受け取って次の状態を返し、メンバー全員に新しい HTML が届きます。" },
        { t: "プレゼンス", d: "<code>data-nowaki-presence=\"poll:demo\"</code> を付けた要素に、room に接続している数を表示します。WebSocket の場合のみ使えます。" },
      ],
      note: "rooms は1つのサーバープロセスの中だけで共有され、ほかのインスタンスからは見えません。0.16 以降は、<code>nowaki start</code> が rooms を <code>.nowaki/live-rooms.json</code> に保存し、再起動後に復元します（<code>NOWAKI_LIVE_ROOMS_FILE=off</code> でメモリのみに保持）。<code>nowaki dev</code> とアダプターでは保存しません。デプロイ用のアダプターでも room のアイランドはイベントを処理しますが、ほかのメンバーへの push は行いません。",
    },
    fanout: {
      h2: "1000接続への配信",
      lead: "nowaki start で、サーバー側の1つの変更が、購読しているすべての接続に届くまでの時間を計測しました。WebSocket の接続を1000本開き、同じ変更を150回繰り返しています。",
      stats: [
        { v: "27.0 ms", d: "live query のパッチ1通ごとの p95。1回の publish() が、購読している1000個のアイランドに届くまでの時間です。0.15 では 63.2 ms でした。" },
        { v: "29.5 ms", d: "room のパッチ1通ごとの p95。1票が、ほかの999接続に届くまでの時間です。0.15 では 67.5 ms でした。" },
        { v: "取りこぼし 0", d: "シナリオごとに 149,850 通を超えるパッチを送り、届かなかったものはありませんでした。" },
      ],
      note: "Apple M2 で3セット計測した中央値です。Nowaki は v0.16.0 のタグからビルドしました。受信側のクライアントは同じマシン上の Node プロセス1つなので、1000通を処理する時間も数値に含まれます。0.15 では接続ごとに順番にレンダリングしていましたが、0.16 では publish ごとに1回だけレンダリングし、その結果を使えるすべての接続で共有します（<a class=\"tlink\" href=\"https://github.com/Tettu0530/nowaki/issues/97\">Issue #97</a>）。デプロイ用のアダプターにはサーバーからの push がないため、この数値は nowaki dev と nowaki start にのみ当てはまります。",
      method: "計測方法とすべての結果（英語）",
      href: "https://github.com/Tettu0530/nowaki/blob/a97a3c0/BENCHMARKS.md#jetstream-fan-out--1000-connections",
    },
    more: {
      h2: "0.15 で追加された機能",
      rows: [
        { t: "フォームと入力", d: "フォームに <code>data-live-submit</code> を付けると、ページ遷移なしで入力値をオブジェクトにまとめて送信します。<code>data-live-input</code> は入力中の値を送信し、<code>data-live-debounce</code>（デフォルトは150 ms）で間引きます。<code>data-live-change</code> は値が確定したときに送信します。チェックボックスとラジオボタンは <code>{ value, checked }</code> を送ります。" },
        { t: "キー付きの行", d: "<code>data-key</code> を付けた子要素は、パッチの適用時にキーで対応づけられます。絞り込みや並べ替えのあとも各行の要素は保たれ、フォーカス中の入力欄の値が上書きされることもありません。" },
        { t: "live query", d: "<code>live.subscribe</code> でトピックを指定し、<code>live.load</code> で状態を再取得します。サーバー側でデータを変更したあとに <code>@nowaki-dev/runtime</code> の <code>publish(topic)</code> を呼ぶと、購読中のすべてのアイランドが状態を再取得し、ブラウザからのイベントなしでパッチが届きます。届くのは同じプロセスの接続だけです。デプロイ用のアダプターでは、現時点で <code>publish()</code> は何もしません。" },
        { t: "リクエストコンテキスト", d: "handler の中で <code>getContext()</code> を呼ぶと、WebSocket 接続を開始したリクエストの Cookie と、<code>authorization</code>、<code>accept-language</code>、<code>user-agent</code> ヘッダーを読み取れます。<code>live.authorize</code> は毎回 handler の前に実行され、<code>true</code> 以外を返すとイベントを拒否します。リクエストの情報を読むアイランドや <code>live.authorize</code> を持つアイランドは、publish のときに接続ごとにレンダリングされ、それ以外のアイランドは1回のレンダリング結果を共有します。" },
        { t: "通信方式の指定", d: "live.js は WebSocket が使えればそれを使い、ソケットが開いていない間のイベントは POST で送信します。ページの head に <code>&lt;meta name=\"nowaki-live\" content=\"post\"&gt;</code> または <code>\"ws\"</code> を書くと、通信方式を固定できます。" },
      ],
    },
    reach: {
      h2: "ブラウザに届くもの",
      stats: [
        { v: "0 バイト", d: "アイランドのコンポーネントのコードは届きません。Jetstream アイランドには、クライアント用のチャンク自体がありません。" },
        { v: "{live} KB", d: "gzip 圧縮後の live.js（0.16.0）。ランタイムはこれだけで、Jetstream アイランドのあるページでのみ読み込みます。" },
        { v: "接続1本", d: "nowaki dev と nowaki start では、1ページにつき1本の WebSocket でイベントを送り、HTML を受け取ります。アダプターでは、イベントごとに POST を1回送ります。ページのほかの部分は、サーバーでレンダリングした通常の HTML です。" },
      ],
      note: "Jetstream アイランドを1つ置いたページを、0.16.0 のサーバー向けビルドで計測しました。",
    },
    state: {
      h2: "署名付きの状態を<wbr>サーバーで管理",
      lead: "ブラウザが状態のコピーを持つのは、再開のためだけです。ブラウザ側から書き換えることはできません。",
      rows: [
        { t: "署名", d: "すべての状態に、発行時刻を含む HMAC-SHA256 の署名が付きます。改ざんされた状態は拒否され、<code>NOWAKI_LIVE_MAX_AGE</code>（デフォルトは1日）より古い署名も無効になります。パッチのたびに署名し直すので、使用中のアイランドが期限切れになることはありません。0.16 以降、期限が切れただけの正当な状態は「古い状態」として扱われます。ページにはキャンセル可能な <code>nowaki:live-stale</code> イベントが届き、キャンセルしなければ再読み込みして最新の状態を取得します。" },
        { t: "接続単位または room 単位", d: "room を指定しない場合、状態は接続ごとに分かれます。タブが2つあれば、アイランドも2つです。<code>live.room</code> を指定すると、メンバー全員で1つの状態を共有します。" },
        { t: "単一プロセス", d: "rooms、<code>publish()</code>、プレゼンスは1つのサーバープロセスの中だけで動作し、ほかのインスタンスには及びません。0.16 以降は、<code>nowaki start</code> を再起動しても rooms が <code>.nowaki/live-rooms.json</code> から復元されます。" },
        { t: "再接続後も継続", d: "パッチには署名付きの状態が含まれ、要素がそれを保持します。そのため接続が切れても、アイランドは切断前の状態から再開します。ソケットが切れている間のイベントは POST で送信します。" },
        { t: "シークレットの設定", d: "本番環境では <code>NOWAKI_LIVE_SECRET</code> を設定してください。未設定の場合、鍵はプロセスごとにランダムに生成されるため、再起動後や別のインスタンスでは状態を再開できません。また、本番サーバーは起動時に警告を出します。アダプターでは、2つ以上のインスタンスや Worker の isolate がリクエストを受ける構成なら必須で、設定しないとイベントが署名の検証で失敗します。" },
        { t: "オリジンの検証", d: "WebSocket の接続は、ページと同じオリジンからのものだけを受け付けます。POST によるイベントには、サーバー関数と同じ検証をかけます。受け付けるのは 64 KiB までの JSON だけで、<code>x-nowaki-live</code> ヘッダーが必須です。別サイトからのリクエストは拒否します。リバースプロキシの背後では <code>NOWAKI_TRUST_PROXY=1</code> を設定してください。" },
        { t: "再試行", d: "ソケットが切れると、live.js はバックオフを挟みながら再接続を試み、8回続けて失敗すると停止します。アイランドは最後の HTML のまま残ります。" },
        { t: "時間のかかるレンダリング", d: "レンダリングは接続のループの外で、接続ごとに1件ずつ実行します（キューに入れられるイベントは最大32件）。そのため、レンダリング中も ping やプレゼンスの配信は止まりません。レンダリングが <code>NOWAKI_LIVE_RENDER_TIMEOUT_MS</code>（デフォルトは10秒）を超えるか失敗すると、アイランドは最後の HTML のまま残り、ページに <code>nowaki:live-error</code> イベントが届きます。" },
      ],
    },
    where: {
      h2: "動作環境",
      lead: "サーバーのあるデプロイ先なら、どこでも Jetstream アイランドが動きます。ただし、サーバーからの push には WebSocket が必要で、その接続を維持できるのは Rust サーバーだけです。",
      cols: ["実行方法", "Jetstream"],
      rows: [
        { k: "<code>nowaki dev</code>", v: "WebSocket で動作：イベント、<code>publish()</code>、プレゼンス付きの rooms", ok: true },
        { k: "<code>nowaki start</code>", v: "WebSocket で動作：イベント、<code>publish()</code>、プレゼンス付きの rooms", ok: true },
        { k: "node、bun、deno、vercel、cloudflare アダプター", v: "動作（イベントごとに POST を1回）。サーバーからの push はなく、<code>publish()</code> は何もしません。room のほかのメンバーは更新されず、プレゼンスもありません。", ok: true },
        { k: "静的出力（<code>nowaki prerender</code>、static アダプター）", v: "最初の HTML のみ。イベントを処理するサーバーがないため、0.16 以降は静的なページに live.js を含めません。" },
      ],
    },
    fit: {
      h2: "向いている用途と今後の課題",
      forTitle: "向いている用途",
      for: [
        "サーバーのデータを使う小さな操作：いいね、投票、カウンター、切り替え、管理画面の操作",
        "結果をサーバーで生成するフォーム、絞り込み、検索欄",
        "1つのサーバープロセス内で共有する状態：投票、プレゼンス、複数人で使う小さな画面",
        "コンポーネントのコードを送るコストを避けたいページ",
      ],
      notTitle: "まだできないこと",
      not: [
        "複数インスタンスにまたがる rooms、publish、プレゼンス（現在は1つのプロセス内のみ）",
        "デプロイ用アダプターでのサーバーからの push（イベントは動作しますが、push はありません）",
        "古くなった状態を引き継ぐ resume token（見送り）",
        "静的ホスティング（イベントを処理するサーバーがありません）",
      ],
    },
    close: { h2: "Jetstream アイランドを試す", docs: "Jetstream のドキュメント（英語）" },
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
        { t: "Rust front", sub: "axum", items: ["files under /_nowaki/ from memory: immutable, br or gzip, ETag and 304", "HTML assembly: preload links, island and live scripts", "ISR cache (x-nowaki-cache: HIT, STALE, MISS), filled at startup", "the Jetstream WebSocket at /__nowaki/live"] },
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
    title: "アーキテクチャ：Rust のツールチェーンと Node のレンダラー · Nowaki",
    desc: "Nowaki のアーキテクチャを解説します。oxc がコンパイルとバンドルを行い、Rust サーバーがファイルの配信と HTML の組み立てを担当し、Node が Preact でレンダリングします。アイランドはディレクティブに従ってハイドレートされます。npm でネイティブバイナリとして配布しています。",
    h1: "Rust の<wbr>ツールチェーンと<wbr>Node の<wbr>レンダラー",
    lead: "Nowaki は oxc でコンパイルし、Rust サーバーで配信します。コンポーネントは Node 上の Preact でレンダリングするため、npm パッケージがそのまま使えます。このページでは、1つのアプリをソースコードからブラウザまで順に追っていきます。",
    ctaDocs: "ドキュメント（英語）",
    ctaOther: "Jetstream の仕組み",
    system: {
      h2: "1つのコマンドで<wbr>2つの⁠ランタイムを起動",
      lead: "nowaki start は両方を起動します。外部からのリクエストを受けるのは Rust のフロントで、Node のレンダラーは localhost の外には公開されません。",
      boxes: [
        { t: "ブラウザ", items: ["サーバーがレンダリングした HTML", "islands.js が client:* に従ってアイランドをハイドレート", "ページルーターはアイドル時に取得", "live.js は Jetstream アイランドのあるページのみ"] },
        { t: "Rust フロント", sub: "axum", items: ["/_nowaki/ のファイルをメモリから配信（immutable、br または gzip、ETag と 304）", "HTML の組み立て：preload リンク、アイランドと Jetstream のスクリプト", "ISR キャッシュ（x-nowaki-cache：HIT・STALE・MISS）、起動時に事前レンダリング", "Jetstream の WebSocket（/__nowaki/live）"] },
        { t: "Node レンダラー", sub: "Preact", items: ["ルートのサーバーレンダリング", "loader と action", "サーバー関数（\"use server\"）", "Jetstream の handler"] },
      ],
      links: ["HTTP、WebSocket", "127.0.0.1 上の HTTP"],
    },
    build: {
      h2: "ビルド：パースから<wbr>ハッシュ化まで oxc で",
      lead: "nowaki build はパイプライン全体を Rust で実行します。Node が関わるのは、プラグインや .tsrx のアイランドを使う場合だけです。",
      steps: [
        { t: "パース", d: "oxc がすべてのモジュールをパースします。" },
        { t: "変換", d: "TypeScript の型を取り除き、JSX を Preact 向けにコンパイルします。" },
        { t: "グラフ", d: "import を oxc_resolver で解決し、1つのモジュールグラフにまとめます。" },
        { t: "結合", d: "アイランドごとに、そのアイランドだけが使うモジュールを1つのチャンクにまとめます。" },
        { t: "圧縮", d: "oxc の minifier で圧縮します。依存関係と共有コードは重複しないようにチャンクに分け、Preact も1つにまとめます。" },
        { t: "ハッシュ", d: "すべてのファイル名に xxh3 のコンテンツハッシュを付けます。" },
        { t: "出力", d: "ブラウザ向けの dist/client（manifest.json 付き）と、レンダラー向けの dist/server を出力します。" },
      ],
    },
    request: {
      h2: "リクエスト：最初に Rust が受け取る",
      rows: [
        { t: "静的ファイル", d: "<code>/_nowaki/</code> のハッシュ付きファイルは、Rust が1年間の immutable キャッシュヘッダーを付けて直接返します。" },
        { t: "ページ", d: "Node がルートをレンダリングし、本文、タイトル、head を返します。Rust はそれをもとにドキュメントを組み立て、modulepreload のリンクとアイランドのランタイムを追加します。live.js を追加するのは、Jetstream アイランドのあるページだけです。" },
        { t: "ISR", d: "<code>revalidate</code> を export したルートは Rust がキャッシュし、バックグラウンドで再検証します。再検証はパスごとに1件ずつ行います。" },
        { t: "サーバー関数", d: "呼び出しは <code>POST /__nowaki/fn</code> に届きます。呼び出せるのは、<code>\"use server\"</code> のモジュールが export した関数だけです。" },
      ],
    },
    security: {
      h2: "デフォルトで安全",
      lead: "0.14 以降、よくある脆弱性はデフォルトの設定で防いでいます。あくまでデフォルト値なので、アプリ側で設定した値が優先されます。",
      rows: [
        { t: "セキュリティヘッダー", d: "<code>nowaki dev</code>、<code>nowaki start</code>（ISR のヒットと静的ファイルを含む）、すべてのアダプターのレスポンスと、<code>nowaki prerender</code> が出力する <code>_headers</code> に、<code>nosniff</code>、<code>x-frame-options: SAMEORIGIN</code>、Referrer-Policy、<code>cross-origin-opener-policy: same-origin</code> を付けます。アプリが CSP を送らない場合は、<code>frame-ancestors 'self'</code> も付けます。" },
        { t: "クロスサイトの送信", d: "別サイトから action への GET 以外のリクエストには 403 を返します。API ルートでは、当面は警告を出すだけです。<code>export const csrf</code> で、ルートごとに検証の有無を切り替えられます。" },
        { t: "サーバー関数", d: "<code>serverFn(schema, impl)</code> は、Standard Schema に対応したライブラリで第1引数を検証してからコードを実行します。引数を受け取るのに検証のない関数には、<code>nowaki build</code> が警告を出します。本番環境でクライアントに届くのは <code>ServerFnError</code> のメッセージだけです。1 MiB を超える body には 413 を返します。" },
        { t: "CSP（オプトイン）", d: "<code>NOWAKI_CSP=report-only</code> または <code>enforce</code> を設定すると、すべての <code>&lt;script&gt;</code> と <code>&lt;style&gt;</code> にレスポンスごとの nonce を付けます。ISR のキャッシュから返す場合も、nonce は毎回生成し直します。デフォルトでは無効です。" },
        { t: "転送ヘッダー", d: "Rust のフロントは、クライアントが付けた <code>x-forwarded-*</code> を破棄し、ホストを自身で設定します。リバースプロキシの背後では <code>NOWAKI_TRUST_PROXY=1</code> を設定してください。" },
      ],
      more: "セキュリティのドキュメント（英語）",
    },
    client: {
      h2: "クライアント：<wbr>先にアイランド、<wbr>ルーターは後から",
      rows: [
        { t: "アイランド", d: "islands.js がアイランドを見つけ、<code>client:load</code>、<code>idle</code>、<code>visible</code>、<code>media</code>、<code>only</code> の各ディレクティブに従ってチャンクを import します。" },
        { t: "ルーター", d: "クライアントルーターはページがアイドル状態になってから取得するため、最初に読み込むのはアイランドだけです。表示したページは30秒間キャッシュします。" },
        { t: "Jetstream アイランド", d: "Jetstream アイランドにはチャンクがなく、live.js が1本のソケットで処理します。アダプターでは、イベントごとに POST を1回送ります。" },
      ],
    },
    dev: {
      h2: "開発時：<wbr>リクエストに⁠応じて<wbr>コンパイル",
      rows: [
        { t: "オンデマンド変換", d: "nowaki dev は、ブラウザから要求されたときにファイルを変換し、結果をメモリと <code>node_modules/.cache/nowaki</code> に保存します。" },
        { t: "アイランド単位の更新", d: "<code>islands/</code> のファイルを編集すると、そのアイランドだけを再レンダリングします（ローカルの状態はリセットされます）。それ以外を編集した場合はページを再読み込みします。エラーは全画面のオーバーレイで表示します。" },
        { t: "最初のページまで {devMs} ms", d: "5つのフレームワークの比較に使ったカウンターアプリで、nowaki dev を起動してから最初のページを返すまでの時間です。" },
      ],
    },
    ship: {
      h2: "npm で配布",
      rows: [
        { t: "ネイティブバイナリ", d: "<code>nowaki</code> パッケージは、optional dependencies の仕組みで、お使いの OS（macOS、Linux、Windows）向けのビルド済みバイナリをインストールします。Rust のツールチェーンは不要です。" },
        { t: "Node 22 以上", d: "レンダラーは Node で動作し、コンポーネントのライブラリには Preact 10 または 11 を使います。" },
        { t: "cargo でのインストール", d: "<code>cargo install nowaki</code> で、同じ CLI を crates.io からビルドすることもできます。" },
      ],
    },
    deploy: {
      h2: "デプロイ先",
      cols: ["デプロイ先", "出力", "Jetstream"],
      rows: [
        { k: "<code>nowaki start</code>", o: "Rust フロントと Node レンダラー", j: "WebSocket で動作（サーバーからの push あり）", ok: true },
        { k: "node、bun、deno", o: "<code>dist/server/index.mjs</code>", j: "動作（イベントごとに POST を1回）", ok: true },
        { k: "static", o: "<code>dist/static</code> に prerender した HTML（<code>404.html</code>、<code>staticPaths</code> に対応）", j: "最初の HTML のみ" },
        { k: "cloudflare", o: "<code>dist/worker</code> の Worker と <code>wrangler.jsonc</code>", j: "動作（イベントごとに POST を1回）", ok: true },
        { k: "vercel", o: "<code>.vercel/output</code> の Build Output API v3", j: "動作（イベントごとに POST を1回）", ok: true },
      ],
    },
    close: { h2: "ソースを読む、アプリを作る", docs: "ドキュメント（英語）" },
  },
} as const;
