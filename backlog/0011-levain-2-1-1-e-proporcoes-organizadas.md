# 0011 — Proporção 2:1:1 no levain e lista organizada

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-01
- **Status:** concluída
- **Arquivos:** `calc.js`, `index.html`, `app.js`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

Faltava a proporção 2:1:1, usada para reanimar uma isca fraca ou quando o levain precisa ficar pronto rápido. A lista também estava fora de ordem (1:1:1, 1:2:2, 1:2:3, 2:4:5, 1:3:3…), misturando os levains de hidratação 100% com os mais firmes.

## O que foi feito

- 2:1:1 entrou em `RATIOS`.
- `RATIOS` ganhou `group`, e `RATIO_GROUPS` monta os grupos. O seletor usa `<optgroup>`:
  - **Hidratação 100%**, da alimentação menor para a maior (do mais rápido para o mais lento): 2:1:1, 1:1:1, 1:2:2, 1:3:3, 1:4:4, 1:5:5, 1:10:10
  - **Mais firmes**, do mais úmido para o mais firme: 2:4:5 (80%), 1:2:3 (67%)
- Personalizado continua no fim.
- `CACHE` subiu para `padeiro-v20`.

## Critérios de aceite

- [x] O seletor mostra os dois grupos na ordem acima
- [x] Escolher 2:1:1 preenche 2 : 1 : 1; com 100 g de levain, a divisão é 50 / 25 / 25 g, com hidratação de 100%
- [x] Digitar 2, 1, 1 nas partes seleciona 2:1:1; uma combinação fora da lista mostra Personalizado

## Como verificar

Sirva a pasta, escolha Levain e abra o seletor de proporção.

## Fora do escopo

Dicas por proporção (tarefa 0012).
