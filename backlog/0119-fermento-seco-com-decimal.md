# 0119 — Fermento seco com precisão de 0,1 g

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-17
- **Status:** concluída
- **Arquivos:** `calc.js`, `app.js`, `index.html`, `tests/calc.test.js`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

Todas as linhas da lista eram arredondadas para inteiros (`balanceShown`). Com 0,13% de fermento seco, 300 g de farinha davam "0" e 333 g davam "1", quando o real é 0,4 g.

## O que foi feito

- `isDryYeast` (`calc.js`) identifica o fermento seco (principal ou segundo). `balanceShown` aceita índices "finos", que ficam com 1 casa; os demais continuam inteiros e fecham o total.
- Cada linha de `compute` traz `fine`. A lista e o card compartilhado mostram "0,4 g" (`formatRowG`).
- Editar gramas do fermento seco usa passo 0,1 e o percentual, passo 0,01. As outras linhas não mudam.
- O peso final da massa (tela e card) arredonda para 0,5 g (`formatHalfG`).
- Cache `padeiro-v126`.

## Critérios de aceite

- [x] 0,13% com 300, 333 e 350 g mostra 0,4 / 0,4 / 0,5 g, nunca 0.
- [x] Demais ingredientes seguem em inteiros.
- [x] O peso da massa aparece em passos de 0,5 g.
- [x] A soma das linhas difere do peso da massa em menos de 0,5 g.

## Como verificar

`npm test`; no app, fermento seco a 0,13% e variar a farinha.

## Fora do escopo

- Fermento fresco e outros ingredientes com decimais.
