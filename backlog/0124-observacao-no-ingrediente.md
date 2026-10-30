# 0124 — Observação em cada ingrediente

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-30
- **Status:** concluída
- **Arquivos:** `calc.js`, `app.js`, `index.html`, `app.css`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

Um ingrediente pode ser usado em mais de uma etapa (3 g de fermento: 1 g no poolish e 2 g na massa). Dividir em etapas complicaria as contas; uma observação por ingrediente basta.

## O que foi feito

- Cada ingrediente tem `note` (texto, até 200 caracteres), limpa em `normalizeState` e salva com a receita, nas receitas salvas, no JSON e no backup.
- Um ícone de info logo acima do peso: apagado quando vazio, na cor do app quando preenchido. Tocar abre um campo sob o percentual (Enter, Esc ou sair do campo fecha). Preenchida, a observação aparece sob o percentual.
- No card compartilhado a observação segue a nota automática da linha ("… · observação"), em até 3 linhas.

## Critérios de aceite

- [x] Sem observação, a linha não muda.
- [x] Com observação, o ícone fica destacado e o texto aparece na linha e no card.

## Como verificar

No app, tocar no ícone acima do peso do fermento e escrever "1 g no poolish, 2 g na massa"; abrir Compartilhar.
