# 0020 — Modais na altura toda da tela no celular, abrindo pelo topo

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-01
- **Status:** concluída
- **Arquivos:** `app.css`, `index.html`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

Os modais (Levain, Receitas e Sobre) eram cartões centralizados com 16 px de margem. Os curtos abriam no meio da tela, mais para baixo que o topo, e no celular sobrava espaço sem uso. No modal do levain, o Concluir ficava no fim do conteúdo.

## O que foi feito

- **Celular (até 640 px):** o modal ocupa a altura toda, com 8 px de margem em volta (mais as áreas seguras do aparelho) e os cantos arredondados.
- **Topo:** todos os modais abrem a partir do topo, em qualquer tamanho de tela.
- **Cabeçalho fixo:** o título e o × ficam presos no topo enquanto o conteúdo rola.
- **Rodapé fixo:** no levain, o Concluir fica preso no rodapé (`.sheet-foot`).
- **Telas maiores:** os modais continuam com até 528 px de largura.
- `CACHE` subiu para `padeiro-v28`.

## Critérios de aceite

- [x] Em 390 × 844 e 360 × 640, os três modais começam a 8 px do topo e terminam a 8 px da base
- [x] Rolando o modal do levain em 360 × 640, o cabeçalho continua no topo e o Concluir na base
- [x] Em 1024 × 768, os três modais começam a 16 px do topo, com 528 px de largura
