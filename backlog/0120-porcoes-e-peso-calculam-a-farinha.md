# 0120 — Porções e peso calculam a farinha

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-26
- **Status:** concluída
- **Arquivos:** `calc.js`, `app.js`, `index.html`, `app.css`, `tests/calc.test.js`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

As porções só mostravam o peso de cada bola a partir da farinha. Para uma pizza de 6 massas de 270 g era preciso chutar a farinha até fechar.

## O que foi feito

- `flourForTotal` (`calc.js`) devolve a farinha que fecha um peso de massa com os percentuais atuais, subindo para o próximo múltiplo de 10 g (melhor sobrar que faltar).
- Com o campo de porções aberto, um ícone ao lado abre o modal "Porções e peso" (quantidade e peso de cada). A prévia mostra farinha, massa e g por porção. Recalcular grava farinha e porções.
- Cálculo pontual: o peso por porção não fica no estado; depois disso a tela se comporta como antes.

## Critérios de aceite

- [x] 6 × 270 g na receita inicial dão 970 g de farinha.
- [x] Total já exato (840 g) mantém 500 g.
- [x] Cancelar, Esc e clique no fundo não alteram a receita.

## Como verificar

`npm test`; no app, tocar em "Uma porção de massa", no ícone ao lado, e informar 6 e 270.

## Fora do escopo

- Perda de massa por porção; guardar o peso por porção na receita.
