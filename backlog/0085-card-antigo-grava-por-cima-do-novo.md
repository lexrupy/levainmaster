# 0085 — Uma geração antiga do card pode gravar por cima da nova

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-04
- **Status:** concluída
- **Arquivos:** `app.js`, `ServiceWorker.js`

## Contexto

`refreshCardPreview` numera cada geração e desiste se outra começou, antes de desenhar e antes de gravar. A gravação espera a resposta do service worker. Uma mensagem que já saiu pode chegar depois da geração nova e o worker ficava com a imagem da receita anterior. `card.png` lê esse blob.

A tarefa foi escrita quando ainda havia quatro cards. A 0086 deixou só o card compartilhado. O buraco que sobrou é o mesmo: a mensagem antiga não pode gravar por cima. Compartilhar não passa por esse cache: chama `makeRecipeCard()` na hora.

## O que foi feito

Cada gravação leva o número da geração. O service worker guarda o maior número já aceito e recusa um menor, respondendo `ok: false`. Se o blob na memória já foi trocado, o cache também não recebe a imagem antiga. A página confere a geração de novo antes de mandar e depois da resposta. `CACHE` subiu para `padeiro-v94`.

## Critérios de aceite

- [x] Uma geração antiga não grava o card depois que uma mais nova foi aceita
- [x] `card.png` fica com a imagem da geração mais nova
- [x] Compartilhar continua gerando a imagem na hora, sem depender dessa fila

## Como verificar

Com o service worker ativo, mandar um card de geração maior e, em seguida, outro de geração menor. `card.png` tem de ser o primeiro. A resposta da geração menor é `ok: false`. Usar Compartilhar e confirmar que a imagem sai na hora.

## Fora do escopo

Não muda o desenho do card. Não coloca os markdown do backlog no cache.
