# 0028 — Margem lateral pela metade e cantos menores

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-01
- **Status:** concluída
- **Arquivos:** `app.css`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

Depois da 0027, ainda sobravam 16 px entre os cards e a borda da tela, e os cantos continuavam arredondados demais para o tamanho dos cards.

## O que foi feito

- **Margem lateral:** 8 px entre os cards e a borda da tela (antes 16). A barra do topo acompanha, com 8 px nas laterais, e o ícone fica alinhado com os cards.
- **Cantos:**
  - cards principais: 14 px (antes 18);
  - ingredientes, "+ Ingrediente" e foto do miolo: 10 px (antes 14);
  - modais: 14 px (antes 18).
- **Espaço entre os cards principais:** 8 px (antes 10).
- `CACHE` subiu para `padeiro-v37`.

## Critérios de aceite

- [x] Em 360, 390 e 560 px, os cards ficam a 8 px das duas bordas
- [x] Os cantos medem 14 px nos cards e 10 px nos ingredientes, na foto e no "+ Ingrediente"
- [x] Sem rolagem horizontal

## Efeito colateral

Com o card mais largo, a foto do miolo (3:2) cresce, e o card principal fica de 7 a 11 px mais alto em 360 e 390 px (340 e 356 px). Em 560 px fica igual.
