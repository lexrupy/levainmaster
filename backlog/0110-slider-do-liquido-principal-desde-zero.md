<!-- SPDX-License-Identifier: LGPL-3.0-or-later -->

# 0110 — Levar o slider do líquido principal até zero

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-10
- **Status:** concluída
- **Arquivos:** `app.js`, `ServiceWorker.js`

## Contexto

Quando outros ingredientes e o levain contribuem bastante para a hidratação, o percentual do líquido principal pode ficar abaixo de 30%. O slider não permitia reduzir esse percentual sem editar as gramas do ingrediente.

## O que foi feito

- O limite mínimo usual do slider passou de 30% para 0%.
- O limite máximo continua acompanhando valores acima de 110%, preservando o valor atual até que ele volte ao intervalo usual.
- O cache subiu para `padeiro-v116`.

## Critérios de aceite

- [x] Slider permite selecionar 0% para o líquido principal.
- [x] Percentuais entre 0% e 110% permanecem no intervalo usual.
- [x] Percentuais acima de 110% continuam acessíveis sem serem substituídos pelo limite anterior.
- [x] Cache aponta para v116.

## Como verificar

Adicionar ingredientes que contribuam para a hidratação até o percentual do líquido principal ficar abaixo de 30%. Usar o slider para reduzir até 0% e confirmar que o percentual e as gramas atualizam. Conferir também que valores acima de 110% continuam ajustáveis.

## Fora do escopo

Alterar os atalhos de percentual abaixo do slider.
