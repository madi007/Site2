const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
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
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).catch(() => caches.match('idcard.html'));
        })
    );
});
