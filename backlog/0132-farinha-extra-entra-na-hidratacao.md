# 0132 — Farinha de trigo como ingrediente e farinhas extras na hidratação

- **Autor:** Alexandre da Silva
- **Data:** 2026-11-08
- **Status:** concluída
- **Arquivos:** `calc.js`, `tests/calc.test.js`, `AGENTS.md`, `ServiceWorker.js`

## Contexto

Em receitas feitas por partes (tangzhong), parte da mesma farinha do topo entra como ingrediente.

## O que foi feito

"Farinha de trigo" entra em `ADDABLE`. As farinhas e amidos extras (`isExtraFlour`) somam ao divisor da hidratação e à fatia de farinha da composição; continuam sendo percentual da farinha principal e somam ao peso. Substitui a regra anterior, em que não contavam.

## Critérios de aceite

- 500 g de farinha, 65% de água e 20% de farinha extra: hidratação 325 ÷ 600.

## Como verificar

`npm test`.
