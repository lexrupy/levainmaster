# 0065 — Menos espaço entre o levain e os ingredientes no card 4

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-02
- **Status:** concluída
- **Arquivos:** `app.js`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

No card 4, o bloco do levain e o dos ingredientes são cartões do mesmo tipo, mas o vão entre eles era de 68 px. Entre os ingredientes e a composição o vão é de 28 px.

## O que foi feito

- O vão entre o levain e os ingredientes passou para 28 px, o mesmo da composição.
- Sem levain, a posição da lista não muda.
- `CACHE` subiu para `padeiro-v76`.

## Critérios de aceite

- [x] Com levain, a faixa branca entre os dois cartões tem 28 px.
- [x] O card 1 continua com o vão de 68 px.

## Como verificar

- Servir por HTTP, abrir `/?card4` e usar levain. Recarregar uma vez se o service worker antigo ainda estiver no controle.
