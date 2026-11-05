/*
 * ALFA FOOTBALL の Service Worker（specs/pwa-publish.md §3）。
 * 目的は「ホーム画面に追加したアプリが、一度開いた画面なら電波が無くても開く」こと。
 * - ページ（HTML）：ネットワーク優先。取れなければ前回のものを出す → 公開し直せば次に開いたとき新しくなる
 * - /_next/static/ のファイル：名前にハッシュが入っていて中身が変わらないので、キャッシュ優先
 * - そのほか（アイコン・3D モデルなど）：キャッシュを先に返し、裏で取り直す
 * データ（localStorage）には触らない。別オリジン・GET 以外・範囲指定の要求は素通しする。
 * 置き場所からの相対で動くので、ルート配信でも GitHub Pages のサブパス（/リポジトリ名/）でも同じファイルで動く。
 */
const PREFIX = "alfa-football-";
const CACHE = PREFIX + "v1";
const SCOPE = self.registration.scope; // 末尾は "/"

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.add(new Request(SCOPE, { cache: "reload" })))
      .catch(() => undefined)
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      // 同じオリジン（*.github.io）に別のサイトのキャッシュがあり得るので、自分の接頭辞のものだけ消す
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith(PREFIX) && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function store(request, response) {
  if (response && response.ok && response.type === "basic") {
    const copy = response.clone();
    caches
      .open(CACHE)
      .then((cache) => cache.put(request, copy))
      .catch(() => undefined);
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" || request.headers.has("range")) return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.href.startsWith(SCOPE)) return;

  // ページ：ネットワーク優先 → 前回のページ → 入口のページ
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => store(request, response))
        .catch(() => caches.match(request).then((hit) => hit || caches.match(SCOPE)))
    );
    return;
  }

  // ハッシュ付きの静的ファイル：キャッシュ優先
  if (url.pathname.includes("/_next/static/")) {
    event.respondWith(
      caches.match(request).then((hit) => hit || fetch(request).then((response) => store(request, response)))
    );
    return;
  }

  // そのほか：キャッシュを先に返し、裏で取り直す
  event.respondWith(
    caches.match(request).then((hit) => {
      const fresh = fetch(request)
        .then((response) => store(request, response))
        .catch(() => hit);
      return hit || fresh;
    })
  );
});
