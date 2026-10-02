# 0064 — Ingredientes no mesmo cartão do card 4

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-02
- **Status:** concluída
- **Arquivos:** `app.js`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

No card 4, o levain e a composição já são um cartão bege com título e miolo branco. A lista de ingredientes ainda ficava solta no fundo do card.

## O que foi feito

- A lista ganhou o mesmo cartão: título "Ingredientes" marrom na faixa bege, itens no branco.
- A borda bege das laterais e de baixo tem 6 px, como nos outros dois blocos.
- Ícone, percentual, gramas e a barrinha continuam, agora dentro do miolo.
- `CACHE` subiu para `padeiro-v75`.

## Critérios de aceite

- [x] O título fica no bege e as linhas de água, sal e levain no branco.
- [x] A borda bege das laterais e de baixo tem cerca de 6 px.
- [x] A composição continua logo abaixo, sem encostar no crédito.

## Como verificar

- Servir por HTTP, abrir `/?card4` e usar levain. Recarregar uma vez se o service worker antigo ainda estiver no controle.
