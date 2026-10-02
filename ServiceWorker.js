// Percentual do padeiro — © 2026 Alexandre da Silva
// SPDX-License-Identifier: LGPL-3.0-or-later
const CACHE = "padeiro-v46";
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
  "./img/miolo-1-firme.svg",
  "./img/miolo-2-fechado.svg",
  "./img/miolo-3-macio.svg",
  "./img/miolo-4-levemente-aberto.svg",
  "./img/miolo-5-aberto-irregular.svg",
  "./img/miolo-6-muito-aberto.svg",
  "./img/miolo-7-rendado.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/icon-maskable-512.png",
];

// Sem resposta da rede nesse tempo, serve o cache (sinal fraco não trava o app).
const NETWORK_TIMEOUT = 3000;

// A versão nova só entra se todos os arquivos baixarem. Se falhar (sem internet,
// por exemplo), a versão anterior continua instalada e funcionando.
// cache: "reload" ignora o cache HTTP para não gravar um arquivo antigo na versão nova.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(FILES.map((file) => new Request(file, { cache: "reload" }))))
      .then(() => self.skipWaiting())
  );
});

// Só apaga as versões antigas depois que a nova está completa.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim())
  );
});

// Rede primeiro, revalidando com o servidor (cache: "no-cache"); o que chegar
// atualiza o cache. Sem rede, com erro ou depois de NETWORK_TIMEOUT, vale o cache.
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const network = fetch(request.url, { cache: "no-cache", credentials: "same-origin" }).then((fresh) => {
      if (fresh.ok) cache.put(request, fresh.clone());
      return fresh;
    });
    // Mesmo respondendo pelo cache, deixa a busca terminar para atualizar o cache.
    event.waitUntil(network.then(() => undefined, () => undefined));
    const fallback = async () => {
      const cached = await cache.match(request, { ignoreSearch: true });
      if (cached) return cached;
      if (request.mode === "navigate") return cache.match("./index.html");
      return undefined;
    };
    try {
      const fresh = await Promise.race([
        network,
        new Promise((resolve, reject) => setTimeout(() => reject(new Error("timeout")), NETWORK_TIMEOUT)),
      ]);
      if (fresh.ok) return fresh;
      return (await fallback()) || fresh;
    } catch (error) {
      // Sem cache para este pedido, espera a rede mesmo que demore.
      return (await fallback()) || network;
    }
  })());
});

// Conversa com a página (modal Sobre): "version" devolve o nome do cache;
// "refresh" baixa de novo todos os arquivos direto do servidor.
self.addEventListener("message", (event) => {
  const port = event.ports && event.ports[0];
  if (!port) return;
  if (event.data === "version") {
    port.postMessage({ version: CACHE });
  } else if (event.data === "refresh") {
    event.waitUntil(
      caches
        .open(CACHE)
        .then((cache) => cache.addAll(FILES.map((file) => new Request(file, { cache: "reload" }))))
        .then(() => port.postMessage({ ok: true, files: FILES.length }), () => port.postMessage({ ok: false }))
    );
  }
});
