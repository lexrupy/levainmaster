<!-- SPDX-License-Identifier: LGPL-3.0-or-later -->

# 0107 — Receber JSON pelo compartilhamento

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-10
- **Status:** concluída
- **Arquivos:** `manifest.webmanifest`, `ServiceWorker.js`, `app.js`, `tests/service-worker.test.js`, `AGENTS.md`

## Contexto

O usuário quer encaminhar uma receita JSON de outro app, como o WhatsApp, diretamente para o Levain Master instalado no Android.

## O que foi feito

- A PWA declara no manifest que recebe arquivos `.json` ou `application/json` por `share_target`.
- O service worker recebe o POST multipart, guarda o arquivo temporariamente no cache e redireciona a abertura para o app.
- A página recupera o arquivo, usa a validação e importação existentes e abre Receitas com o resultado.
- Arquivo inválido ou ausente mostra uma mensagem no modal Receitas.
- O cache foi atualizado para `padeiro-v113`.

## Critérios de aceite

- [x] O manifest registra a PWA como destino de compartilhamento para JSON.
- [x] O service worker recebe e transporta o arquivo até a página sem depender de rede.
- [x] A página importa o arquivo pela rotina existente e apresenta o resultado.
- [x] O cache e seu teste apontam para v113.

## Como verificar

Depois de atualizar/reinstalar o app no Android, compartilhar um arquivo `.json` de receita a partir do WhatsApp e selecionar Levain Master. Conferir que Receitas abre com a nova receita. Repetir com um JSON inválido e conferir a mensagem de erro.

## Fora do escopo

Receber texto colado, imagens ou arquivos que não sejam receitas JSON do Levain Master.
