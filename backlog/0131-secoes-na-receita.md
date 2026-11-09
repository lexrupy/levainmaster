# 0131 — Seções na receita

- **Autor:** Alexandre da Silva
- **Data:** 2026-11-08
- **Status:** concluída
- **Arquivos:** `app.js`, `index.html`, `app.css`, `calc.js`, `tests/calc.test.js`, `ServiceWorker.js`

## Contexto

Receitas feitas por partes (pão com tangzhong, por exemplo) precisam de títulos que agrupem os ingredientes.

## O que foi feito

Seção é um item da lista (`role: "section"`, com `id` e `name`), incluído por "+ Seção" no menu de ingredientes. Sobe e desce com as mesmas setas dos ingredientes e pode ser removida (os ingredientes ficam). Os ingredientes abaixo dela pertencem a ela até a próxima seção; sem seção, ficam soltos. `compute` ignora seções. O card desenha o título de cada seção entre os ingredientes. Salvar, exportar e sincronizar levam as seções porque elas estão em `state.ingredients`.

## Critérios de aceite

- Sem seção criada, nada muda na tela.
- A seção não entra em peso, percentual nem hidratação.

## Como verificar

`npm test`; na tela, "+ Seção", mover e abrir o card.
