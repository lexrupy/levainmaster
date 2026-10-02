# 0047 — O service worker serve a imagem do card

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-02
- **Status:** concluída
- **Arquivos:** `ServiceWorker.js`, `app.js`, `index.html`, `AGENTS.md`

## Contexto

Interceptar `card.png` ainda deixava a prévia dependente da página em `?card`. O link de teste precisa responder com a imagem em si.

## O que foi feito

- Ao abrir a calculadora, e a cada mudança da receita, a página manda o PNG ao service worker.
- `card` e `card.png` não existem no disco. O worker responde os dois com `image/png` e `Content-Disposition: inline`.
- Cada resposta usa uma cópia do blob, para o corpo não se esgotar no segundo acesso.
- A prévia em `?card` mostra essa imagem servida. `CACHE` subiu para `padeiro-v58`.

## Critérios de aceite

- [x] Depois de abrir a calculadora, `card` e `card.png` respondem `image/png` com corpo PNG.
- [x] Mudar a receita troca os bytes servidos.
- [x] A prévia usa `card.png`, não um blob.

## Como verificar

- Servir por HTTP, abrir a raiz, esperar o worker e pedir `card` e `card.png`.
- Mover o slider e pedir `card` de novo.
- Abrir `/?card` e conferir que a imagem aponta para `card.png`.

## Fora do escopo

- Gerar o desenho dentro do service worker, sem a página.
