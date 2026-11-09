# 0134 — Ingrediente repetido na lista

- **Autor:** Alexandre da Silva
- **Data:** 2026-11-09
- **Status:** concluída
- **Arquivos:** `app.js`, `tests/ui/run.mjs`, `AGENTS.md`, `ServiceWorker.js`

## Contexto

Receitas por partes repetem o ingrediente: o leite do tangzhong e o da massa, a água do tangzhong e a da massa. O menu "+ Ingrediente" escondia tudo o que já estava na lista.

## O que foi feito

`menuGroups` não filtra mais por nome. Água e todos os itens de `ADDABLE` podem entrar de novo (como `role: "extra"`, com id próprio); o sal também repete: a linha `role: "salt"` (id `sal`) é uma só, e o segundo sal entra como `extra` com água 0, sem mexer na regra da margarina com sal.

## Critérios de aceite

- Com "Farinha de trigo" na lista, ela continua no menu.
- "Água" aparece no menu mesmo com a água principal na lista.
- "Sal" continua no menu com o sal na lista; o segundo entra como extra.

## Como verificar

`npm run test:ui` com o servidor no ar.
