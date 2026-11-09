# 0130 — Gramas redondas viravam 199 g

- **Autor:** Alexandre da Silva
- **Data:** 2026-11-08
- **Status:** concluída
- **Arquivos:** `calc.js`, `tests/calc.test.js`, `ServiceWorker.js`

## Contexto

Ao mudar a farinha e voltar ao valor original, ingredientes que mostravam 200 g passavam a 199 g. O percentual guardado vinha de uma edição em gramas (200 ÷ 300 × 100 = 66,666…%) e a conta de volta dava 199,99999999999997, que `Math.floor` cortava.

## O que foi feito

`balanceShown` soma 1e-9 antes do `Math.floor`, absorvendo o erro de ponto flutuante. O percentual guardado não muda, então não há perda de precisão. Teste em `tests/calc.test.js`.

## Critérios de aceite

- 66,666…% de 300 g de farinha mostra 200 g, não 199 g.

## Como verificar

`npm test`.
