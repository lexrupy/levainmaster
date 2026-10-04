# 0072 — Borracha na diagonal

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-04
- **Status:** concluída
- **Arquivos:** `index.html`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

O botão de limpar a tela passou por três ícones: vassoura, borracha na diagonal e borracha deitada. A deitada foi a que ficou publicada. A do meio, entre a vassoura e a deitada, lia melhor.

## O que foi feito

O SVG do botão voltou para a borracha na diagonal (corpo, base e faixa do meio). O botão, o tamanho e a confirmação ficaram como estavam. `CACHE` subiu para `padeiro-v83`.

## Critérios de aceite

- [x] O ícone é a borracha na diagonal, à esquerda de Salvar receita, no mesmo botão de 34 px, em 390 px e em 560 px
- [x] Tocar ainda abre a confirmação de limpar a tela

## Como verificar

Servir a pasta e olhar o botão ao lado de Salvar receita, no celular (~390 px) e na largura máxima (560 px). Tocar e cancelar.

## Fora do escopo

Não muda o que limpar faz, nem a lista de receitas salvas.
