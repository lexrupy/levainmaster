# 0022 — Modal de confirmação genérico, usado ao apagar receita

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-01
- **Status:** concluída
- **Arquivos:** `app.js`, `index.html`, `app.css`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

Para apagar uma receita, o botão Apagar virava "Confirmar" no primeiro toque. Era confuso e não havia como desistir depois do primeiro toque.

## O que foi feito

- **Modal genérico:** `askConfirm({ title, message, confirmLabel, cancelLabel, danger })` abre um modal de confirmação e devolve uma Promise: `true` se confirmou, `false` se cancelou. Serve para outras confirmações no futuro.
- **Formas de cancelar:** o foco começa em **Cancelar**; Cancelar, Esc e clique no fundo valem `false`.
- **Ação perigosa:** com `danger`, o botão de confirmar fica vermelho.
- **Por cima de outro modal:** abre sobre o modal de receitas, e cancelar volta para ele.
- **Apagar receita:** usa o modal com "Apagar receita?", o nome e a data da receita e "Não dá para desfazer."; o botão Apagar da lista não muda mais de texto.
- `CACHE` subiu para `padeiro-v30`.

## Critérios de aceite

- [x] Apagar abre a confirmação com o nome e a data da receita, e o foco em Cancelar
- [x] Cancelar fecha só a confirmação; o modal de receitas continua aberto e nada é apagado
- [x] O clique no fundo também cancela
- [x] Com cliques reais, o primeiro Esc fecha só a confirmação e o segundo fecha as receitas
- [x] Confirmar apaga a receita da lista e do `localStorage`
- [x] Cancelar e Apagar têm a mesma altura em 390 px
- [x] A confirmação aparece centralizada na tela (ajuste posterior; os outros modais continuam abrindo pelo topo)

## Observação

Em teste automatizado com cliques simulados por script, o Esc fecha os dois modais juntos: o Chrome agrupa modais abertos sem um toque real do usuário entre eles. Com toques reais, cada Esc fecha um modal.
