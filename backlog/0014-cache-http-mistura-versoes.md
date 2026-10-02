# 0014 — O navegador pode misturar versões dos arquivos

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-01
- **Status:** concluída (na 0018)
- **Arquivos:** `ServiceWorker.js`

## Contexto

O service worker busca primeiro na rede, mas usa `fetch(request)` sem `cache`. Sem `Cache-Control` no servidor (o `python3 -m http.server` não manda), o navegador pode responder com uma cópia antiga do cache HTTP. Na tarefa 0011, o teste carregou um `index.html` antigo com o `app.js` novo, e o seletor de proporção apareceu vazio.

## Proposta

Buscar com `fetch(request, { cache: "no-cache" })`, que revalida com o servidor a cada vez e cai no cache da PWA se estiver sem internet.

## Critérios de aceite

- [x] Depois de mudar `index.html` e `app.js`, um recarregamento traz os dois novos
- [x] Sem internet, o app continua abrindo pelo cache da PWA
