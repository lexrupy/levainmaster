<!-- SPDX-License-Identifier: LGPL-3.0-or-later -->

# 0104 — Ajustar o texto das porções

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-10
- **Status:** concluída
- **Arquivos:** `index.html`, `ServiceWorker.js`, `tests/service-worker.test.js`, `AGENTS.md`

## Contexto

O usuário pediu um texto único para a porção: no singular, "uma porção de massa"; no plural, "X porções de X g", sem repetir "de massa".

## O que foi feito

O botão ao lado do peso da massa agora mostra "Uma porção de massa" no padrão e "X porções de Y g" quando há mais de uma. O texto acessível acompanha o rótulo visível. O cache foi atualizado para v110.

## Critérios de aceite

- [x] Uma porção mostra "Uma porção de massa".
- [x] Mais de uma porção mostra quantidade e peso, sem "de massa".
- [x] A versão do cache e seu teste apontam para v110.

## Como verificar

Ao lado do peso da massa, conferir o texto padrão; selecionar 3 porções e conferir "3 porções de Y g".

## Fora do escopo

Alterar o cálculo ou o limite de porções.
