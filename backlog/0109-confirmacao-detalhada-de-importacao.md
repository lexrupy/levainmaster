<!-- SPDX-License-Identifier: LGPL-3.0-or-later -->

# 0109 — Confirmar identificação e detalhes da receita importada

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-10
- **Status:** concluída
- **Arquivos:** `app.js`, `app.css`, `ServiceWorker.js`, `tests/service-worker.test.js`, `AGENTS.md`

## Contexto

O pedido foi que a importação manual confirme o tipo de arquivo, mostre o nome e o tipo de pão da receita, e só grave depois da confirmação.

## O que foi feito

- O JSON exportado inclui o tipo de pão que aparece na receita.
- A caixa de confirmação informa que o arquivo foi reconhecido como receita do Levain Master (JSON), exibe o nome e o tipo de pão, e pergunta se deseja importar.
- Para arquivos antigos sem tipo de pão gravado, calcula o tipo a partir do estado importado.
- O cache subiu para `padeiro-v115`.

## Critérios de aceite

- [x] O JSON registra o tipo de pão da exportação.
- [x] O importador valida a identificação e a versão do formato.
- [x] A confirmação exibe tipo de arquivo, nome da receita e tipo de pão.
- [x] A receita só é gravada após a confirmação.
- [x] Cache e teste do service worker apontam para v115.

## Como verificar

Exportar uma receita, abrir Receitas e selecionar o JSON pelo botão manual. Conferir a identificação, o nome e o tipo de pão na confirmação; cancelar e confirmar que a receita não entrou; repetir e confirmar a importação.

## Fora do escopo

Editar a receita antes de importar.
