# 0055 — Card 4, cópia do primeiro

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-02
- **Status:** concluída
- **Arquivos:** `app.js`, `index.html`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

O próximo desenho começa do card atual, sem alterar o card, o card 2 nem o card 3.

## O que foi feito

- `makeRecipeCard4` é uma cópia de `makeRecipeCard`.
- O service worker serve `card4` e `card4.png`. A prévia abre em `?card4`.
- `CACHE` subiu para `padeiro-v66`.

## Critérios de aceite

- [x] `card4` devolve a mesma imagem que `card`.
- [x] `card`, `card2` e `card3` continuam respondendo com PNG.

## Como verificar

- Servir por HTTP, abrir `/?card4` e comparar com `/?card`. Recarregar uma vez se o service worker antigo ainda estiver no controle.
