# 0122 — Lixeira de receitas

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-30
- **Status:** concluída
- **Arquivos:** `calc.js`, `app.js`, `index.html`, `app.css`, `tests/calc.test.js`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

Apagar receita era definitivo e, com a sincronização (0121), uma receita apagada voltava do gist.

## O que foi feito

- "Lixeira" no lugar de "Apagar": marca `deletedAt` e `updatedAt`. A lista tem as abas "Salvas (n)" e "Lixeira (n)".
- Na lixeira: "Restaurar" (se o nome já existe entre as salvas, vira "… (restaurada)") e "Excluir permanentemente" (pede confirmação).
- Excluir permanentemente guarda só o `id` com `purged: true` e `updatedAt`, sem o estado. Essa marca viaja na sincronização e no backup.
- `mergeRecipes` compara `updatedAt` (ou `savedAt` nas receitas antigas): lixeira, restauração, exclusão e renomear passam a se propagar.
- Nome repetido só vale contra receitas salvas, não contra a lixeira.

## Critérios de aceite

- [x] Receita na lixeira some da lista de salvas e aparece na aba Lixeira.
- [x] A cópia antiga do gist não desfaz a lixeira nem a exclusão definitiva.
- [x] Restaurar devolve a receita à lista.

## Como verificar

`npm test`; no app, Receitas › Lixeira numa receita, aba Lixeira, Restaurar e Excluir permanentemente; sincronizar em dois aparelhos.

## Fora do escopo

- Esvaziar a lixeira de uma vez; apagar as marcas de exclusão definitiva antigas.
