# 0102 — Separar setas do botão de excluir

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-10
- **Status:** concluída
- **Arquivos:** `index.html`, `app.css`, `ServiceWorker.js`, `tests/ui/run.mjs`, `tests/service-worker.test.js`, `AGENTS.md`

## Contexto

O usuário observou que as setas de ordenação muito próximas do botão × poderiam causar exclusões acidentais.

## O que foi feito

As setas foram posicionadas uma acima e outra abaixo do ícone do ingrediente. O botão × permanece no lado oposto da linha.

## Critérios de aceite

- [x] Seta para cima aparece acima do ícone e a de baixo abaixo dele.
- [x] O botão de excluir fica separado das setas.
- [x] Os controles continuam acessíveis e sem rolagem horizontal em 390 px e 560 px.
- [x] O service worker mantém `v108` e remove as versões anteriores do app.
- [x] `npm test` e `npm run test:ui` passam.

## Como verificar

Rodar `npm test` e `npm run test:ui`; o cenário da tela confere a posição das setas em 390 px e 560 px.

## Fora do escopo

Mudar o gesto de reordenação ou o comportamento do botão de excluir.
