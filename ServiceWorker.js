const CACHE = "padeiro-v13";
const FILES = [
  "./",
  "./index.html",
  "./app.js",
  "./app.css",
  "./calc.js",
  "./manifest.webmanifest",
  "./ServiceWorker.js",
  "./vendor/vue.global.prod.js",
  "./vendor/pico.min.css",
  "./vendor/outfit-latin.woff2",
  "./img/miolo-firme.jpg",
  "./img/miolo-macio.jpg",
  "./img/miolo-aberto.jpg",
  "./img/miolo-umido.jpg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/icon-maskable-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const fresh = await fetch(request);
      if (fresh.ok) cache.put(request, fresh.clone());
      return fresh;
    } catch (error) {
      const cached = await cache.match(request, { ignoreSearch: true });
      if (cached) return cached;
      if (request.mode === "navigate") {
        const home = await cache.match("./index.html");
        if (home) return home;
      }
      throw error;
    }
  })());
});
