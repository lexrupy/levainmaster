# 0125 — A farinha não zera ao digitar

- **Autor:** Alexandre da Silva
- **Data:** 2026-11-08
- **Status:** concluída
- **Arquivos:** `app.js`, `index.html`, `tests/ui/run.mjs`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

Ao apagar o campo da farinha para digitar outro valor, a farinha virava 0 na hora e os gramas, a hidratação e o card dos demais ingredientes zeravam no meio da digitação.

## O que foi feito

- O texto digitado fica num rascunho (`flourDraft`). Número válido acima de zero vale na hora (limitado a 99.999 g); vazio ou 0 mantém a farinha anterior.
- Ao sair do campo (ou com Enter): vazio volta à farinha anterior; 0 digitado vale 0.
- Esperar só a saída do campo não funcionou no celular: fechar o teclado nem sempre tira o foco, e o valor digitado não chegava a valer.
- Com o campo vazio, a farinha mantida aparece esmaecida dentro dele (`placeholder`), para não parecer que o valor sumiu.
- As setas (botões ▲▼ e teclado) andam por etapas: 5 em 5 até 50 g, 10 em 10 até 100 g, 20 em 20 até 300 g e 50 em 50 acima. Cada etapa para na divisa; descer de 100 dá 90, e subir de 45 dá 50.
- Os botões ▲▼ descartam o rascunho e somam direto.

## Critérios de aceite

- [x] Apagar o campo não altera os gramas dos demais ingredientes.
- [x] Sair do campo vazio devolve a farinha anterior.
- [x] Digitar 600 recalcula a receita na hora, sem precisar sair do campo.

## Como verificar

`npm run test:ui` (checks "farinha apagada não zera os outros" e "farinha vazia volta à anterior").

## Fora do escopo

- Recalcular com campo vazio ou 0 durante a digitação.
