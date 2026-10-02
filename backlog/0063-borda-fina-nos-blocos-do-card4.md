# 0063 — Borda bege mais fina no card 4

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-02
- **Status:** concluída
- **Arquivos:** `app.js`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

No card 4, o miolo branco do levain e o da composição deixavam uma faixa bege larga nas laterais e embaixo. O título continua na faixa de cima.

## O que foi feito

- A margem esquerda, direita e inferior do miolo branco passou de 12 px para 6 px nos dois blocos.
- O canto do miolo acompanhou, de 14 px para 12 px.
- `CACHE` subiu para `padeiro-v74`.

## Critérios de aceite

- [x] A faixa bege das laterais e de baixo tem cerca de 6 px no levain e na composição.
- [x] A faixa do título não encolheu.

## Como verificar

- Servir por HTTP, abrir `/?card4` e usar levain. Recarregar uma vez se o service worker antigo ainda estiver no controle.
