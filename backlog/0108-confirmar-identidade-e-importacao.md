<!-- SPDX-License-Identifier: LGPL-3.0-or-later -->

# 0108 — Confirmar identidade e importação da receita

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-10
- **Status:** concluída
- **Arquivos:** `app.js`, `ServiceWorker.js`, `tests/service-worker.test.js`, `AGENTS.md`

## Contexto

Ao receber um JSON pelo compartilhamento, o app abria Receitas sem pedir autorização clara antes de adicionar a receita. Também era preciso identificar explicitamente os arquivos próprios do Levain Master.

## O que foi feito

- O JSON exportado inclui `appKey: "levainmaster"`, além do campo `format` já existente.
- O importador confere a chave e a versão antes de aceitar o estado. Mantém compatibilidade com arquivos anteriores identificados por `format`.
- Antes de persistir, pergunta se a pessoa quer importar e mostra o nome da receita. Cancelar não altera a lista.
- O cache subiu para `padeiro-v114`.

## Critérios de aceite

- [x] O JSON exportado tem chave própria do app.
- [x] Arquivo sem identificação compatível é recusado, sem salvar.
- [x] Receita identificada mostra confirmação com o nome.
- [x] Só a confirmação grava a receita na lista.
- [x] Cancelamento informa que a importação foi cancelada.
- [x] Cache e teste do service worker apontam para v114.

## Como verificar

Exportar uma receita e conferir `appKey` no JSON. Importar o arquivo e confirmar a pergunta com o nome; repetir e cancelar. Tentar importar um JSON sem a chave e o formato do Levain Master.

## Fora do escopo

Alterar o formato do estado ou a compatibilidade com versões anteriores do JSON.
