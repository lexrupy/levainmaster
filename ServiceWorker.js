// Levain Master — © 2026 Alexandre da Silva
// SPDX-License-Identifier: LGPL-3.0-or-later
const CACHE = "padeiro-v113";
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
  "./img/miolo-enriquecido.jpg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/icon-maskable-512.png",
  "./icons/glifo.jpg",
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
    caches.keys().then((keys) => Promise.all(keys.filter((key) => /^padeiro-v\d+$/.test(key) && key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim())
  );
});

// Rede primeiro, revalidando com o servidor (cache: "no-cache"); o que chegar
// atualiza o cache. Sem rede, com erro ou depois de NETWORK_TIMEOUT, vale o cache.
// /card (e card.png) não existe no servidor. A página manda o PNG e este worker
// responde com a imagem, para o navegador mostrar em vez de baixar.
const cardBlobs = { card: null };
let cardSeq = 0;

const CARD_HEADERS = {
  "Content-Type": "image/png",
  "Content-Disposition": "inline",
  "Cache-Control": "no-store",
};

function cardRequest(file) {
  return new Request(new URL(file, self.location).href);
}

function incomingRecipeRequest() {
  return new Request(new URL("./__incoming-recipe.json", self.location).href);
}

function cardKind(url) {
  if (/\/card(\.png)?$/.test(url.pathname)) return "card";
  return "";
}

function cardResponse(blob) {
  return new Response(blob.slice(0, blob.size, "image/png"), { headers: CARD_HEADERS });
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.method === "POST" && url.pathname === new URL("./share-recipe", self.location).pathname) {
    event.respondWith((async () => {
      try {
        const form = await request.formData();
        const file = form.get("recipe");
        if (!file || typeof file.name !== "string" || !file.name.toLowerCase().endsWith(".json") || file.size === 0) {
          return Response.redirect(new URL("./?incomingRecipeError=1", self.location).href, 303);
        }
        const cache = await caches.open(CACHE);
        await cache.put(incomingRecipeRequest(), new Response(file, {
          headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
        }));
        return Response.redirect(new URL("./?incomingRecipe=1", self.location).href, 303);
      } catch (error) {
        return Response.redirect(new URL("./?incomingRecipeError=1", self.location).href, 303);
      }
    })());
    return;
  }

  if (request.method !== "GET") return;

  if (url.pathname === new URL("./__incoming-recipe.json", self.location).pathname) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const key = incomingRecipeRequest();
      const incoming = await cache.match(key);
      if (!incoming) return new Response("Nenhuma receita recebida.", { status: 404 });
      await cache.delete(key);
      return incoming;
    })());
    return;
  }

  const kind = cardKind(url);
  if (kind) {
    event.respondWith((async () => {
      const blob = cardBlobs[kind];
      if (blob) return cardResponse(blob);
      const cache = await caches.open(CACHE);
      const hit = await cache.match(cardRequest("./" + kind + ".png"));
      if (hit) return hit;
      return new Response("Abra a calculadora uma vez para gerar o card.", {
        status: 404,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    })());
    return;
  }

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
  } else if (event.data && event.data.blob && Object.prototype.hasOwnProperty.call(cardBlobs, event.data.type)) {
    const kind = event.data.type;
    const blob = event.data.blob;
    const generation = Number(event.data.generation);
    // Uma geração que começou antes não pode gravar por cima da que já chegou.
    if (Number.isFinite(generation) && generation < cardSeq) {
      port.postMessage({ ok: false });
      return;
    }
    if (Number.isFinite(generation)) cardSeq = generation;
    cardBlobs[kind] = blob;
    event.waitUntil(
      caches
        .open(CACHE)
        .then((cache) => {
          if (cardBlobs[kind] !== blob) return false;
          return cache.put(cardRequest("./" + kind + ".png"), cardResponse(blob)).then(() => true);
        })
        .then((wrote) => port.postMessage({ ok: wrote !== false }), () => port.postMessage({ ok: false }))
    );
  } else if (event.data === "refresh") {
    event.waitUntil(
      caches
        .open(CACHE)
        .then((cache) => cache.addAll(FILES.map((file) => new Request(file, { cache: "reload" }))))
        .then(() => port.postMessage({ ok: true, files: FILES.length }), () => port.postMessage({ ok: false }))
    );
  }
});
