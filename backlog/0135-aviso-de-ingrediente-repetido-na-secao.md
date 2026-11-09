# 0135 — Aviso de ingrediente repetido na mesma seção

- **Autor:** Alexandre da Silva
- **Data:** 2026-11-09
- **Status:** concluída
- **Arquivos:** `app.js`, `index.html`, `app.css`, `tests/ui/run.mjs`, `ServiceWorker.js`

## Contexto

Com ingredientes repetíveis (0134), repetir na mesma seção costuma ser engano; em seções diferentes é normal.

## O que foi feito

`duplicateIds` percorre a lista na ordem e zera a contagem a cada seção. Duas linhas com o mesmo nome (sem diferenciar maiúsculas) na mesma seção, ou ambas fora de seção, ganham o aviso "Ingrediente repetido nesta seção" acima da linha. Só avisa; nada é bloqueado e as contas não mudam.

## Critérios de aceite

- Repetir em seções diferentes não avisa.
- Repetir na mesma seção avisa nas duas linhas; remover uma tira o aviso.

## Como verificar

`npm run test:ui` com o servidor no ar.
