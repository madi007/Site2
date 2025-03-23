const CACHE_NAME = 'pwa-cache-v2';
const urlsToCache = [
    './',
    './index.html',
    './layouts/1.html',
    './layouts/2.html',
    './js/script.js',
    './js/1.js',
    './js/2.js',
    './js/app.js',
    './css/style.css',
    './css/1.css',
    './css/2.css',
    './css/all.css',
    './manifest.json',
    './icon-message-192.png',
    './img/edit_icon.png',
    './icons/ic_avatar.svg',
    './icons/ic_back.svg',
    './icons/ic_delete.svg',
    './icons/ic_edit.svg',
    './icons/ic_info.svg',
    './icons/ic_more.svg',
    './icons/ic_send.svg'
];

// Установка Service Worker и кэширование ресурсов
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

// Активация и удаление старых кэшей
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Перехват запросов
self.addEventListener('fetch', event => {
    if (event.request.mode === 'navigate') {
        // Обрабатываем переходы между страницами
        event.respondWith(
            fetch(event.request)
                .catch(() => caches.match('./index.html'))
        );
    } else {
        // Обрабатываем все остальные запросы
        event.respondWith(
            caches.match(event.request).then(response => {
                return response || fetch(event.request);
            })
        );
    }
});
