# 0053 — Card 3 compacto

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-02
- **Status:** concluída
- **Arquivos:** `app.js`, `index.html`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

O card 2 ainda ocupa bastante altura com o bloco da tela. A ideia do card 3 é reunir farinha, peso, hidratação, composição e foto numa faixa só.

## O que foi feito

- `card` e `card2` continuam como estão.
- `card3` e `card3.png` desenham farinha e peso da massa empilhados à esquerda, hidratação total com as três barras no meio, e a foto com textura e pão típico à direita.
- Levain, ingredientes e composição da massa seguem como nos outros cards.
- A prévia abre em `?card3`.
- `CACHE` subiu para `padeiro-v64`.

## Critérios de aceite

- [x] `card`, `card2` e `card3` respondem com PNG inline, cada um com o seu desenho.
- [x] No card 3, os três blocos ficam lado a lado, sem o número da hidratação em cima das barras.

## Como verificar

- Servir por HTTP, abrir a calculadora e depois `/?card3` ou `card3`. Recarregar uma vez se o service worker antigo ainda estiver no controle.

## Fora do escopo

- Trocar o botão de compartilhar, que continua gerando o card atual.
