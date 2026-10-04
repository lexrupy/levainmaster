# 0080 — Os gramas da lista não fecham o peso da massa

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-04
- **Status:** concluída
- **Arquivos:** `app.js`, `calc.js`, `index.html`

## Contexto

Cada linha da receita arredonda com `Math.round` em `formatG`. O peso da massa arredonda a soma exata, uma vez só. Dois valores em ,5 sobem cada um e a soma das linhas fica 1 g acima do total. O levain já reparte a sobra em `weighLevain` para os inteiros fecharem. A lista de ingredientes não.

Exemplo: farinha 250 g, água no atalho 65%, sal 2%, fermento 1%.

- Água 162,5 g aparece 163 g
- Fermento 2,5 g aparece 3 g
- Sal 5 g, farinha 250 g
- Soma na tela: 421 g
- Massa exata e exibida: 420 g

O mesmo 1 g aparece com 250 g ou 750 g nos atalhos 55% e 85%. A receita inicial (500 g, 65%) fecha em 840 g porque nenhum peso cai em ,5.

## O que foi feito

`balanceShown` reparte os inteiros para somarem o peso arredondado da massa. No empate de ,5 o grama fica na primeira linha: a água de 162,5 g continua 163 g e o fermento de 2,5 g aparece 2 g. A hidratação segue nos gramas exatos. O card usa o mesmo inteiro da lista. `CACHE` subiu para `padeiro-v89`.

## Critérios de aceite

- [x] Farinha 250 g, água 65%, sal 2%, fermento 1%: a soma das linhas inteiras é o peso da massa mostrado
- [x] O mesmo fecha em 250 g e 750 g com água a 55% e a 85%
- [x] A receita inicial continua 840 g e hidratação 65%
- [x] A hidratação continua saindo dos gramas exatos, não dos inteiros da lista

## Como verificar

Montar os três exemplos e somar farinha, água, sal e fermento como aparecem na lista. Comparar com o peso da massa do card.

## Fora do escopo

Não muda `weighLevain`. Não passa a mostrar decimais na lista da receita.
