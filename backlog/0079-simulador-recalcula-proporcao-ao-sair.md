# 0079 — O simulador troca a proporção ao sair do grama

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-04
- **Status:** concluída
- **Arquivos:** `app.js`, `index.html`, `calc.js`

## Contexto

No simulador, isca, água e farinha aparecem com duas casas. O campo recalcula o L:A:F ao perder o foco, mesmo quando o número não mudou. `settleSimGram` arredonda de novo e chama `setSimGram`, que trata esses gramas já arredondados como peso novo. A proporção escolhida vira outra e a hora pode pular de faixa. Nada disso grava na receita, mas fica no simulador até fechar a página.

Exemplos medidos com `splitLevain` e `ratioFromGrams`:

- 26 g no preset 1:5:5 mostra 2,36 / 11,82 / 11,82 e «8 a 12 h». Sair da isca vira 1:5,01:5,01 e «12 a 16 h».
- 20 g no 1:10:10 mostra 0,95 / 9,52 / 9,52 e «12 a 16 h». Sair do campo vira 95:952:952, alimentação 10,02, e «16 a 24 h».
- 23 g no 1:4:4 vira 1:3,99:3,99. A hora geral continua «8 a 12 h» e o sabor passa de «Bem láctico» para «Láctico».
- 100 g no 1:1:1 mostra 33,33 três vezes. Sair de um campo muda o total de 100 para 99,99. A proporção continua 1:1:1.

O degrau está em `speedIndex`: alimentação 5 cai em «8 a 12 h» e 5,01 já cai em «12 a 16 h».

## O que foi feito

`settleSimGram` só devolve o campo às duas casas quando o número já estava nessa precisão. A proporção fica. Um peso diferente, ou com mais casas do que as duas exibidas, continua chamando `setSimGram`. `CACHE` subiu para `padeiro-v87`.

## Critérios de aceite

- [x] 26 g em 1:5:5, sair da isca sem digitar, continua 1:5:5 e «8 a 12 h»
- [x] 20 g em 1:10:10, sair de um grama sem digitar, continua «12 a 16 h»
- [x] 23 g em 1:4:4, sair sem digitar, conserva «Bem láctico»
- [x] 100 g em 1:1:1, sair sem digitar, conserva o total 100
- [x] Digitar outro peso de isca, água ou farinha ainda recalcula a proporção

## Como verificar

Abrir o simulador, escolher cada preset acima, focar e sair de cada grama sem alterar o texto. Repetir digitando um peso diferente e ver a proporção acompanhar.

## Fora do escopo

Não muda o arredondamento de duas casas na exibição. Não grava o simulador na receita.
