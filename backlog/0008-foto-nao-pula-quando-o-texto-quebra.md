# 0008 — A foto não pula quando o texto quebra

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-01
- **Status:** concluída
- **Arquivos:** `app.css`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

O card de cima centraliza as duas colunas na vertical. Quando o nome do pão ("Pão de fermentação natural", "Focaccia de alta hidratação") ou a textura ("Rígida, segura o formato") quebrava em duas linhas, a coluna da direita crescia e a foto subia uns 8 px. Passando o slider da água, a imagem ficava pulando.

## O que foi feito

A textura (`.side-feel`) e o pão (`.side-bread`) reservam sempre duas linhas (`min-height: 2 × 1,25em`) e cortam na segunda (`line-clamp: 2`). A coluna da direita fica com a mesma altura em todas as faixas.

`CACHE` subiu para `padeiro-v17`.

## Critérios de aceite

- [x] Passando o slider por 50, 60, 65, 70, 75, 80 e 90%, a foto fica na mesma posição dentro do card em 360, 390 e 560 px
- [x] O slider da água também não se mexe
- [x] "Pão de fermentação natural" e "Rígida, segura o formato" aparecem inteiros em 360 px

## Como verificar

Sirva a pasta e arraste o slider da água de ponta a ponta em 360 px: a foto e o slider não se mexem.

## Fora do escopo

Quando nenhum dos dois textos quebra, sobra uma linha vazia abaixo do pão. É o espaço reservado.
