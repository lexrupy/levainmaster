# 0021 — Botão "Salvar receita" no card principal

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-01
- **Status:** concluída (posição em avaliação)
- **Arquivos:** `index.html`, `app.js`, `app.css`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

Para salvar uma receita era preciso abrir Receitas no topo e achar o campo no meio da lista.

## O que foi feito

- **Botão "Salvar receita":** fica na coluna da direita do card principal, abaixo do peso da massa. No celular, ocupa o espaço que sobrava ao lado da meia lua, sem aumentar o card.
- **Modo curto:** o botão abre o modal de receitas em modo curto (`quickSave`): título "Salvar receita", só o campo de descrição, já focado, e o botão Salvar. No celular, esse modal tem a altura do conteúdo, não a da tela.
- **Confirmação:** Enter ou Salvar guarda a receita, fecha o modal e o botão do card mostra "Salva ✓" por 2 s.
- **Receitas, no topo:** continua abrindo o modal completo, com a lista.
- `CACHE` subiu para `padeiro-v29`.

## Critérios de aceite

- [x] O botão abre "Salvar receita" com o foco no campo e sem a lista
- [x] Salvar fecha o modal, o botão mostra "Salva ✓" e volta a "Salvar receita" depois de 2 s
- [x] A receita aparece na lista de Receitas
- [x] A foto não se mexe ao passar pelas faixas em 360, 390 e 560 px, e não há rolagem horizontal

## Em avaliação

A posição do botão foi escolhida para ser avaliada no uso. Alternativas: ao lado do "100%" da farinha, ou no cabeçalho de "Detalhamento da receita".
