# 0025 — Atalhos no slider da água

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-01
- **Status:** concluída
- **Arquivos:** `index.html`, `app.js`, `app.css`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

Os valores 55%, 65%, 72% e 85% abaixo do slider da água eram só marcações. Chegar exatamente num deles arrastando o polegar dava trabalho no celular.

## O que foi feito

- As marcações viraram botões (`waterMarks`): tocar leva a água direto ao valor.
- O atalho do valor atual fica em negrito.
- A posição de cada um é calculada pelo valor (`--f`), descontando o polegar de 26 px. Antes eram porcentagens fixas, ajustadas à mão.
- `CACHE` subiu para `padeiro-v34`.

## Critérios de aceite

- [x] Tocar em 55%, 65%, 72% e 85% leva o slider e o valor da água a esses números, e a hidratação total acompanha
- [x] O atalho do valor atual aparece em negrito
