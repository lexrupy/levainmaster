# 0057 — Barra de composição no card 4

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-02
- **Status:** concluída
- **Arquivos:** `app.js`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

No rodapé do card 4, a composição da massa era uma linha de texto. No card principal e no card 2 ela é a barra empilhada de farinha, água e outros.

## O que foi feito

- O bloco "Composição da massa" do card 4 ganhou a mesma barra e a legenda colorida.
- O card, o card 2 e o card 3 não mudaram.
- `CACHE` subiu para `padeiro-v68`.

## Critérios de aceite

- [x] A barra e a legenda (Farinha, Água, Outros) aparecem no rodapé do card 4.
- [x] O crédito "Feito com Percentual do padeiro" continua abaixo, sem encostar no bloco.

## Como verificar

- Servir por HTTP e abrir `/?card4`. Recarregar uma vez se o service worker antigo ainda estiver no controle.
