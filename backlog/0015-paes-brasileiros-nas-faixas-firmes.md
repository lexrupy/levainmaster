# 0015 — Pães brasileiros no lugar de Bagel e Pretzel

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-01
- **Status:** concluída
- **Arquivos:** `calc.js`, `ServiceWorker.js`

## Contexto

As duas faixas mais firmes citavam Bagel e Pretzel, pães pouco comuns no Brasil e sem tradução corrente em português.

## O que foi feito

Os pães típicos dessas faixas passaram a ser pães brasileiros da mesma hidratação:

| Faixa | Antes | Agora |
|---|---|---|
| até 57% | Bagel | Pão sovado |
| até 62% | Pretzel | Pão francês |

A baguete (até 67%) e as outras faixas continuam iguais. `CACHE` subiu para `padeiro-v22`.

## Critérios de aceite

- [x] Com o slider em 50%, o resumo mostra "Pão sovado"; em 60%, "Pão francês"
- [x] Nenhum texto da tela cita Bagel ou Pretzel
