# 0062 — Composição com miolo branco no card 4

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-02
- **Status:** concluída
- **Arquivos:** `app.js`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

O bloco da composição da massa no card 4 era todo bege. A barra empilhada ficava menos destacada do que a escala do levain, que já separa o título bege do miolo branco.

## O que foi feito

- O título "COMPOSIÇÃO DA MASSA" continua marrom sobre o bege.
- A barra e a legenda ficam num miolo branco.
- As cores da barra e dos nomes (farinha, água, outros) não mudaram.
- `CACHE` subiu para `padeiro-v73`.

## Critérios de aceite

- [x] Só a faixa do título é bege; o gráfico está no branco.
- [x] Farinha, água e outros continuam com as cores da barra e o percentual em preto.
- [x] O crédito não encosta no bloco.

## Como verificar

- Servir por HTTP e abrir `/?card4`. Recarregar uma vez se o service worker antigo ainda estiver no controle.
