# 0082 — Ingrediente nulo na receita salva impede o app de abrir

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-04
- **Status:** concluída
- **Arquivos:** `app.js`, `calc.js`

## Contexto

`normalizeState` descarta item nulo antes de usar uma receita na tela. A lista de receitas não passa por essa limpeza. `loadRecipes` guarda qualquer item com `id` e `state`. O modal, mesmo fechado, chama `summaryOf(recipe.state)` porque `quickSave` começa falso. `summaryOf` chama `compute`, e `isFerment` lê `item.role`. Um `null` na lista derruba a renderização e o app não monta.

O app atual não grava esse estado. O buraco é uma lista já corrompida no `localStorage`, o caso da tarefa 0039, que ficou sem proteção neste caminho.

## Proposta

Uma receita salva com ingrediente nulo não impede o app de abrir. A lista mostra o que der para ler, ou omite essa receita. Abrir continua passando por `normalizeState`.

## O que foi feito

`compute` ignora item que não é objeto, então o resumo da lista não quebra com um `null` no meio dos ingredientes. `isFerment` e `enrichedBread` também recusam item vazio. `summaryOf` só percorre a lista se ela for um array. Abrir continua em `normalizeState`, que já descartava o nulo e recusa a receita se faltarem água, sal ou fermento. O formato do que o app grava não mudou. `CACHE` subiu para `padeiro-v91`.

## Critérios de aceite

- [x] Uma lista com uma receita válida e outra com um ingrediente `null` abre o app
- [x] A receita válida continua abrindo
- [x] A corrompida não derruba a tela; ou some da lista, ou abre só se `normalizeState` a aceitar
- [x] Receita gravada pelo app, sem corrupção, continua igual

## Como verificar

No console, gravar em `percentual-padeiro-receitas-v1` uma receita cujo `state.ingredients` contenha `null`, recarregar e abrir Receitas.

## Fora do escopo

Não muda o formato das receitas novas. Não apaga calibrações.
