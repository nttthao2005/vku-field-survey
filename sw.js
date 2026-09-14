const CACHE_NAME = "vku-field-survey-v2";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./css/style.css",

    "./js/app.js",
    "./js/camera.js",
    "./js/db.js",
    "./js/location.js",
    "./js/sync.js",

    "./manifest.json",

    "./assets/icons/icon-192.png",
    "./assets/icons/icon-512.png"
];


self.addEventListener("install", (event) => {

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(FILES_TO_CACHE);
            })
    );

    self.skipWaiting();
});


self.addEventListener("activate", (event) => {

    event.waitUntil(
        caches.keys().then((cacheNames) => {

            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );

        })
    );

    self.clients.claim();
});


self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);

    // Không can thiệp vào Google Apps Script
    if (url.hostname === "script.google.com") {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {

                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request)
                    .catch(() => {
                        return new Response("", {
                            status: 503,
                            statusText: "Offline"
                        });
                    });

            })
    );
});