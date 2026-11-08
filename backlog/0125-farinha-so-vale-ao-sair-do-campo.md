# 0125 — A farinha só vale ao sair do campo

- **Autor:** Alexandre da Silva
- **Data:** 2026-11-08
- **Status:** concluída
- **Arquivos:** `app.js`, `index.html`, `tests/ui/run.mjs`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

Ao apagar o campo da farinha para digitar outro valor, a farinha virava 0 na hora e os gramas, a hidratação e o card dos demais ingredientes zeravam no meio da digitação.

## O que foi feito

- O texto digitado fica num rascunho (`flourDraft`); a receita só muda quando o campo perde o foco (ou com Enter).
- Ao sair: número válido vale (limitado a 0–99.999 g); campo vazio ou inválido volta à farinha anterior; 0 digitado vale 0.
- Com o campo vazio, a farinha mantida aparece esmaecida dentro dele (`placeholder`), para não parecer que o valor sumiu.
- Os botões ▲▼ descartam o rascunho e somam direto.

## Critérios de aceite

- [x] Apagar o campo não altera os gramas dos demais ingredientes.
- [x] Sair do campo vazio devolve a farinha anterior.
- [x] Digitar 600 e sair recalcula a receita.

## Como verificar

`npm run test:ui` (checks "farinha apagada não zera os outros" e "farinha vazia volta à anterior").

## Fora do escopo

- Recalcular durante a digitação.
