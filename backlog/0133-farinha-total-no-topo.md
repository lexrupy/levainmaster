# 0133 — Farinha total (principal + extras) no topo

- **Autor:** Alexandre da Silva
- **Data:** 2026-11-09
- **Status:** concluída
- **Arquivos:** `calc.js`, `index.html`, `tests/calc.test.js`, `ServiceWorker.js`

## Contexto

Com farinha de trigo extra (tangzhong), a farinha do topo mostra só a principal. Na receita do shokupan, 240 g + 25 g.

## O que foi feito

`compute` devolve `extraFlour` (farinhas e amidos extras, sem a farinha do levain). Quando é maior que zero, o selo ao lado de "Farinha" mostra `265 g no total` e, ao tocar, abre um modal com a farinha principal, cada extra e o total em vez de `100%`. Os percentuais da lista continuam sobre a farinha principal.

## Critérios de aceite

- Sem farinha extra, o selo continua `100%`.
- Com 240 g principal e 25 g extra, mostra `265 g no total`.

## Como verificar

`npm test`; na tela, incluir "Farinha de trigo".
