# 0060 — Cards de resumo na largura do card 4

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-02
- **Status:** concluída
- **Arquivos:** `app.js`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

No card 4, os três cards de farinha, hidratação total e peso da massa eram mais estreitos que a foto, a lista de ingredientes e a composição. Os valores cabiam numa fonte maior.

## O que foi feito

- Os três cards passam a ocupar a mesma largura dos blocos de baixo: de 64 px a 1.016 px, com 308 px cada e 14 px de vão.
- O valor subiu de 34 px para 44 px.
- O card 1 permanece com os cards de 290 px e valor de 34 px.
- `CACHE` subiu para `padeiro-v71`.

## Critérios de aceite

- [x] A borda esquerda e a direita dos três cards coincidem com a da foto e a da lista de ingredientes.
- [x] Farinha, hidratação e peso continuam centralizados, com o número maior que o rótulo.

## Como verificar

- Servir por HTTP e abrir `/?card4`. Recarregar uma vez se o service worker antigo ainda estiver no controle.
