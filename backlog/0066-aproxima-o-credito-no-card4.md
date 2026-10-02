# 0066 — Crédito mais perto da composição no card 4

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-02
- **Status:** concluída
- **Arquivos:** `app.js`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

No card 4, entre o cartão da composição e o texto "Feito com Percentual do padeiro" sobrava mais espaço do que entre os outros cartões.

## O que foi feito

- O card encolheu 26 px. O crédito continua a 62 px do fundo, então sobe junto e fica a cerca de 28 px da composição.
- `CACHE` subiu para `padeiro-v77`.

## Critérios de aceite

- [x] A faixa branca entre a composição e o crédito tem cerca de 28 px.
- [x] O texto não encosta na borda arredondada de baixo.

## Como verificar

- Servir por HTTP e abrir `/?card4`. Recarregar uma vez se o service worker antigo ainda estiver no controle.
