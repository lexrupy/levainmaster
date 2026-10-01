# 0001 — Levain mostrava isca negativa

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-01
- **Status:** concluída
- **Arquivos:** `calc.js`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

`weighLevain` arredonda isca, água e farinha para gramas inteiros e joga a diferença para a isca, para que as três partes somem o total arredondado. Quando a isca é pequena e arredonda para 0, a diferença pode ser −1, e a tela mostrava −1 g de isca.

Exemplo: 500 g de farinha, levain a 0,68% (3,4 g), proporção 1:8:8. Antes: isca −1 g, água 2 g, farinha 2 g.

## O que foi feito

A diferença continua indo para a isca, exceto quando a deixaria negativa. Nesse caso vai para a maior entre farinha e água, como já acontecia com isca zero.

`CACHE` subiu para `padeiro-v11`.

## Critérios de aceite

- [x] Com 500 g, levain 0,68% e 1:8:8, a divisão é isca 0 g, água 2 g, farinha 1 g
- [x] Nenhuma parte fica negativa para os presets e para 1:8:8 e 3:1:1, com o levain de 0,1 a 200 g
- [x] As três partes somam o total arredondado
- [x] A receita inicial continua com massa de 840 g e hidratação de 65%

## Como verificar

```bash
node -e 'const P=require("./calc.js"); const s=P.defaultState(); s.ingredients[2].ferment="levain"; s.ingredients[2].pct=0.68; s.levain={L:1,A:8,F:8}; console.log(P.compute(s).levain)'
```

## Fora do escopo

Com muito pouco levain e proporções altas, a isca pode receber 1 g que na conta exata seria 0,05 g. A soma fecha, mas a divisão fica distorcida em gramas inteiros. Não vale mexer enquanto o app só mostra gramas inteiros.
