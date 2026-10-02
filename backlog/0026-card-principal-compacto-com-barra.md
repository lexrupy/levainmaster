# 0026 — Card principal compacto; barra no lugar da meia lua

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-01
- **Status:** concluída
- **Arquivos:** `index.html`, `app.js`, `app.css`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

O card principal tinha espaço sobrando: vão entre "Farinha" e o número, entre as setas ▲▼ e abaixo do número. A meia lua da composição ocupava 131 px de altura para mostrar três números. A coluna da direita era a mais alta e decidia a altura do card.

## O que foi feito

- **Cabeçalho:** o "100%" fica colado em "Farinha", não mais na ponta da coluna.
- **Número da farinha:** as setas ficaram coladas e menores (22 px cada, antes 32), e o "g" mais perto do número (folga de 0,15ch, antes 0,55ch). O bloco das gramas caiu de 96 para 54 px.
- **Barra no lugar da meia lua:** uma barra horizontal empilhada (farinha, água e outros), de 10 px e logo abaixo dos gramas, com a legenda colorida embaixo. Os vãos entre os trechos são de 2 px e as pontas são arredondadas. A barra lê melhor a divisão de um todo em partes e ocupa uma fração da altura.
- **Peso da massa em destaque:** fica na coluna da farinha, abaixo da barra, em número grande. Durante a tarefa, o peso no miolo da meia lua mostrou que o destaque ajuda a leitura.
- **Salvar receita:** o botão foi para a coluna da farinha. A coluna da direita ficou só com foto, hidratação total, textura e pão, e as duas colunas têm alturas parecidas.
- **Espaço até "Água":** menor.
- Saíram o SVG e o CSS da meia lua e do `.side-mass`.
- `CACHE` subiu para `padeiro-v35`.

## Resultado

| Largura | Antes | Depois |
|---|---|---|
| 360 px | 417 px | 343 px |
| 390 px | 417 px | 350 px |
| 560 px | 475 px | 409 px |

## Critérios de aceite

- [x] O card fica de 66 a 74 px mais baixo em 360, 390 e 560 px
- [x] A barra mostra farinha, água e outros na proporção da massa, com a legenda colorida
- [x] O peso da massa aparece em destaque logo abaixo da barra
- [x] A farinha cabe no campo de 1 a 5 dígitos, sem rolagem horizontal
- [x] Os atalhos do slider e o Salvar receita continuam funcionando

## Fora do escopo

Com 5 dígitos de farinha, a coluna da direita fica apertada. Já era assim antes.
