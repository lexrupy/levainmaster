# 0052 — Cards de resumo no card 2

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-02
- **Status:** concluída
- **Arquivos:** `app.js`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

No card 2 sobrava um vão à esquerda da foto, acima da farinha. Os três cards do card atual (farinha, hidratação total e peso da massa) cabem ali.

## O que foi feito

- Os três cards entram nesse vão, na largura da coluna da farinha.
- O valor fica mais baixo dentro de cada card, para caber na altura do vão.
- `CACHE` subiu para `padeiro-v63`.

## Critérios de aceite

- [x] Farinha, hidratação total e peso da massa aparecem à esquerda da foto, acima do bloco da farinha.
- [x] O rótulo e o valor cabem no card, e o valor não encosta no rótulo nem na borda de baixo.

## Como verificar

- Servir por HTTP, abrir `/?card2` e conferir o topo. Recarregar uma vez se o service worker antigo ainda estiver no controle.

## Fora do escopo

- Mudar os três cards do card atual.
