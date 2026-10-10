<!-- SPDX-License-Identifier: LGPL-3.0-or-later -->

# 0106 — Fonte monoespaçada nas prescrições

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-10
- **Status:** concluída
- **Arquivos:** `app.css`, `app.js`, `ServiceWorker.js`, `tests/service-worker.test.js`, `AGENTS.md`

## Contexto

O usuário pediu uma fonte de largura fixa nas prescrições diversas para deixar o alinhamento de espaços e tabulações legível.

## O que foi feito

O editor e o bloco de prescrições no card usam fonte monoespaçada. O cache foi atualizado para `padeiro-v112`.

## Critérios de aceite

- [x] O texto no editor usa fonte monoespaçada.
- [x] O texto no PNG usa fonte monoespaçada.
- [x] O cache e seu teste apontam para v112.

## Como verificar

Abrir Prescrições diversas e conferir a largura uniforme dos caracteres; abrir a prévia do card com observações preenchidas.

## Fora do escopo

Alterar espaçamento, tabulação ou tamanho da fonte.
