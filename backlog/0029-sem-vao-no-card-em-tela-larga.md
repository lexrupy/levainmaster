# 0029 — Sem vão no meio do card principal em tela larga

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-01
- **Status:** concluída
- **Arquivos:** `app.css`, `ServiceWorker.js`

## Contexto

Em telas largas (app com 560 px), abria um vão grande entre a coluna da farinha e a da foto. A coluna da farinha tinha só a largura do conteúdo, a da foto ia no máximo a 236 px, e `justify-content: space-between` jogava a sobra no meio.

## O que foi feito

- A coluna da farinha passou a ser `minmax(max-content, 1fr)`: nunca menor que o conteúdo e, quando sobra espaço, fica com ele. A barra e a legenda se esticam junto.
- Saiu o `justify-content: space-between`.
- No celular nada muda, porque lá não sobra espaço.
- `CACHE` subiu para `padeiro-v38`.

## Critérios de aceite

- [x] Em 560 px e no computador, o vão entre as colunas é de 22 px, e a farinha, a barra e a legenda ocupam 256 px
- [x] Em 360, 390 e 412 px, a coluna da farinha continua com 150 px
- [x] Com 99999 g de farinha, a coluna cresce para caber o número, sem rolagem horizontal
