# 0129 — Farinha só recalcula ao sair do campo

- **Autor:** Alexandre da Silva
- **Data:** 2026-11-08
- **Status:** concluída
- **Arquivos:** `app.js`, `tests/ui/run.mjs`, `ServiceWorker.js`

## Contexto

Recalcular os ingredientes a cada tecla passava por valores intermediários da digitação (1, 10, 100…), perdendo precisão. Substitui a regra da tarefa 0125, em que a farinha digitada valia na hora.

## O que foi feito

`flourField` só guarda o rascunho (limitado a `FLOUR_MAX`); `state.flour` muda em `settleFlour`, ao sair do campo ou com Enter. Campo vazio mantém a farinha anterior; 0 vale 0 ao sair. As setas continuam valendo na hora.

## Critérios de aceite

- Digitar não altera os gramas dos outros ingredientes até o campo perder o foco.
- Ao sair, tudo recalcula com o valor final.

## Como verificar

`npm run test:ui` com o servidor no ar.
