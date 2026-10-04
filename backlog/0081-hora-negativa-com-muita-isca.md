# 0081 — Calibração com muita isca mostra hora negativa

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-04
- **Status:** concluída
- **Arquivos:** `calc.js`, `app.js`

## Contexto

Com um par gravado, o centro é `t1 + (t5 − t1) × ln(alimentação) / ln(5)`, sem piso. Se a farinha da alimentação fica bem abaixo da isca, o centro é negativo e a tela mostra isso como pico. Os exemplos já combinados continuam positivos: o 2:1:1 dá 1,5 h.

Medido com t1 = 4 h, t5 = 10 h e faixa de teste 22–23 °C, pedido na mesma faixa:

- 4:1:1 mostra «-1 h»
- 10:1:1 mostra «-4,5 h»
- 3:1:1 mostra «0 h»
- 2:1:1 continua «1,5 h»

A proporção personalizada do ativador e do simulador aceita esses L:A:F. Sem calibração, a faixa geral desses feeds continua «2 a 3 h».

## O que foi feito

Quando a ponta calibrada arredondaria para menos de meia hora, a tela mostra 0,5 h. Com t1 = 4 h e t5 = 10 h, 4:1:1, 10:1:1 e 3:1:1 ficam em «0,5 h». Os pontos de alimentação 0,5 ou maior não mudam. Sem calibração, a faixa geral continua a de hoje. `CACHE` subiu para `padeiro-v90`.

## Critérios de aceite

- [x] Com t1 = 4 h e t5 = 10 h, 4:1:1 e 10:1:1 não mostram hora negativa
- [x] 3:1:1 não mostra «0 h»
- [x] 2:1:1 na temperatura do teste continua 1,5 h
- [x] 1:1:1, 1:5:5 e 1:25:25 na temperatura do teste continuam 4 h, 10 h e 16 h
- [x] Sem calibração, o 4:1:1 em 24–26 °C continua «2 a 3 h»

## Como verificar

`node` com `peakEstimate` nos cinco feeds, com e sem o par de exemplo. Repetir no ativador com a proporção personalizada.

## Fora do escopo

Não muda sabor, textura nem dicas. Não altera `levainProfile`. Não recalibra os exemplos de alimentação 0,5 ou maior.
