# 0006 — Composição da massa em meia lua abaixo da farinha

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-01
- **Status:** concluída
- **Arquivos:** `index.html`, `app.js`, `app.css`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

A composição da massa era uma barra vertical fina encostada na foto do miolo. A legenda Farinha / Água / Outros ficava numa linha à parte, acima do slider da água, longe da barra.

## O que foi feito

- Gráfico em meia lua (SVG) logo abaixo dos gramas de farinha. Os trechos vão da esquerda para a direita, na ordem farinha, água, outros, com um vão de 2 unidades entre eles e um trilho claro no fundo. O desenho é calculado em `compArcs`, em `app.js`.
- A legenda fica logo embaixo da meia lua, em três colunas: o nome na cor do trecho e o valor na cor do texto.
- As cores antigas da barra reprovavam no validador de paleta: pouco contraste com o fundo, pouca saturação, e farinha × água parecidas até para visão normal. As novas (`--comp-flour` #b8792e, `--comp-water` #2f80c0, `--comp-other` #6e9a35) passam em todas as checagens, inclusive para daltonismo. Os nomes da legenda usam o mesmo matiz escurecido (`--comp-*-text`) para chegar a 4,5:1.
- O SVG tem `aria-label` com os três percentuais, e cada trecho mostra uma dica (`<title>`) ao passar o mouse.
- Saíram a barra vertical (`.comp-vert`) e a linha de legenda (`.comp`, `.legend`). A foto ocupa sozinha a coluna da direita.
- `CACHE` subiu para `padeiro-v14`.

## Critérios de aceite

- [x] A meia lua aparece logo abaixo dos gramas de farinha
- [x] Receita inicial: Farinha 59,5%, Água 38,7%, Outros 1,8%, e o tamanho dos trechos acompanha esses valores
- [x] Farinha, Água e Outros aparecem na cor do respectivo trecho
- [x] A barra vertical e a legenda acima do slider não existem mais
- [x] Sem rolagem horizontal em 360 px, 390 px e 560 px
- [x] As cores passam no `validate_palette.js` (modo claro)

## Como verificar

Sirva a pasta e mude a água, a farinha e os ingredientes: os trechos e a legenda acompanham. Conferido no Chrome headless em 360, 390 e 560 px.

## Fora do escopo

- Com 5 dígitos de farinha, a coluna da direita (foto e hidratação) fica apertada. Já era assim antes desta tarefa.
- O app não tem modo escuro, então as cores não foram validadas para fundo escuro.
- O meio da meia lua ficou vazio. Dá para pôr ali o peso da massa, tirando-o da coluna da direita.
