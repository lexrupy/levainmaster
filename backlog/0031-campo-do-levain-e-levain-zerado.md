# 0031 — Campo de gramas do levain mais estreito; levain zerado mantém os cartões

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-01
- **Status:** concluída
- **Arquivos:** `index.html`, `app.css`, `ServiceWorker.js`

## Contexto

Dois problemas da 0030, vistos no teste local:

- **Campo largo demais:** o campo de gramas do levain no modal ocupava a largura toda. A regra de largura do campo de gramas só valia dentro da lista, e no modal o campo herdava os 100% do Pico.
- **Cartões sumindo:** com o levain em 0 g, os cartões Isca, Água e Farinha sumiam, e a hidratação do levain mostrava "—".

## O que foi feito

- **Campo do modal:** tem estilo próprio, com 5,2ch de largura (cabe até 4 dígitos), borda e alinhamento à direita.
- **Cartões com 0 g:** os de Isca, Água e Farinha aparecem sempre, com 0 g quando não há levain.
- **Hidratação do levain:** no modal e na linha do levain, passa a vir da proporção (`levainProfile`), não da divisão em gramas. Com 0 g, continua mostrando, por exemplo, 100% para 1:2:2.
- `CACHE` subiu para `padeiro-v40`.

## Critérios de aceite

- [x] Com 1500 g digitados, o campo tem 75 px e o número cabe
- [x] Com 0 g: "0 g na massa · 0% da farinha", cartões em 0 g / 0 g / 0 g e hidratação de 100% (1:2:2)
- [x] 100 g → 20%; 150 g → 30%, divisão 30 / 60 / 60 g, hidratação total de 77%
