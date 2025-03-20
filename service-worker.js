self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open("static").then((cache) =>
      cache.addAll([
        "./",
        "./index.html",
        "./layouts/1.html",
        "./layouts/2.html",
        "./js/script.js",
        "./js/1.js",
        "./js/2.js",
        "./js/app.js",
        "./css/style.css",
        "./css/1.css",
        "./css/2.css",
        "./css/all.css",
        "./manifest.json",
        "./icon-message-192.png",
        "./img/edit_icon.png",
        "./icons/ic_avatar.svg",
        "./icons/ic_back.svg",
        "./icons/ic_delete.svg",
        "./icons/ic_edit.svg",
        "./icons/ic_info.svg",
        "./icons/ic_more.svg",
        "./icons/ic_send.svg"
      ])
    )
  );
});

self.addEventListener("activate", (e) => {
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
