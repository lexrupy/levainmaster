# 0082 — Ingrediente nulo na receita salva impede o app de abrir

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-04
- **Status:** proposta
- **Arquivos:** `app.js`, `calc.js`, `index.html`

## Contexto

`normalizeState` descarta item nulo antes de usar uma receita na tela. A lista de receitas não passa por essa limpeza. `loadRecipes` guarda qualquer item com `id` e `state`. O modal, mesmo fechado, chama `summaryOf(recipe.state)` porque `quickSave` começa falso. `summaryOf` chama `compute`, e `isFerment` lê `item.role`. Um `null` na lista derruba a renderização e o app não monta.

O app atual não grava esse estado. O buraco é uma lista já corrompida no `localStorage`, o caso da tarefa 0039, que ficou sem proteção neste caminho.

## Proposta

Uma receita salva com ingrediente nulo não impede o app de abrir. A lista mostra o que der para ler, ou omite essa receita. Abrir continua passando por `normalizeState`.

## Critérios de aceite

- [ ] Uma lista com uma receita válida e outra com um ingrediente `null` abre o app
- [ ] A receita válida continua abrindo
- [ ] A corrompida não derruba a tela; ou some da lista, ou abre só se `normalizeState` a aceitar
- [ ] Receita gravada pelo app, sem corrupção, continua igual

## Como verificar

No console, gravar em `percentual-padeiro-receitas-v1` uma receita cujo `state.ingredients` contenha `null`, recarregar e abrir Receitas.

## Fora do escopo

Não muda o formato das receitas novas. Não apaga calibrações.
