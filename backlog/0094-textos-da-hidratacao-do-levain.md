# 0094 — Textos da hidratação do levain

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-05
- **Status:** concluída
- **Arquivos:** `index.html`, `app.js`, `calc.js`, `AGENTS.md`, `teorias do levain.md`, `ServiceWorker.js`, `tests/calc.test.js`, `tests/service-worker.test.js`

## Contexto

A hidratação total passou a contar a água e a farinha da alimentação do levain. A água e a farinha da isca entram quando a opção de Configurações está ligada, metade e metade. Vários textos ainda diziam que só a água da alimentação entrava e que a isca ficava sempre de fora.

## O que foi feito

1. O aviso do modal do levain separa as duas contas: a hidratação do levain continua sendo água ÷ farinha da alimentação, sem a isca; a hidratação total da massa leva a água e a farinha da alimentação sempre, e a isca só com a opção ligada.
2. O texto da opção em Configurações diz que a alimentação já entra e que a opção acrescenta a isca.
3. O atalho de segundo fermento diz "soma água e farinha da alimentação".
4. `AGENTS.md`, o comentário de `calc.js` e o parágrafo do app em `teorias do levain.md` descrevem a mesma regra. A umidade presa em farinha e pó secos continua de fora.
5. `CACHE` subiu para `padeiro-v101`.

## Critérios de aceite

- [x] O modal do levain não diz mais que a água da isca fica fora da hidratação total.
- [x] Configurações deixa claro que a alimentação já entra e que a opção acrescenta a isca, 50% água e 50% farinha.
- [x] O menu "+ Ingrediente" diz que o levain soma água e farinha da alimentação.
- [x] `AGENTS.md` não manda mais deixar a água da isca sempre de fora.

## Como verificar

Servir a pasta. Com fermento em Levain, abrir o modal e ler os dois avisos, com a opção da isca desligada e ligada. Em Configurações, ler o texto da opção. Em "+ Ingrediente", com fermento biológico, ler a nota do Levain. Repetir em 390 px e em 560 px.
