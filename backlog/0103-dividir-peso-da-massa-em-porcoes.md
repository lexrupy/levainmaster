<!-- SPDX-License-Identifier: LGPL-3.0-or-later -->

# 0103 — Dividir o peso da massa em porções

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-10
- **Status:** concluída
- **Arquivos:** `calc.js`, `app.js`, `index.html`, `app.css`, `ServiceWorker.js`, `tests/service-worker.test.js`, `AGENTS.md`

## Contexto

O usuário pediu uma forma de consultar quantas porções de determinado peso saem da massa total.

## O que foi feito

O peso da massa continua exibido. Ao lado, um botão mostra "Uma porção" por padrão; ao tocar, vira um campo para escolher de 1 a 99 porções. A partir de duas, exibe quantidade e peso de cada porção, com uma casa decimal. A escolha fica salva com o estado e com as receitas, sem alterar a fórmula.

## Critérios de aceite

- [x] A receita nova começa em uma porção.
- [x] O texto permite editar a quantidade de porções.
- [x] Mais de uma porção exibe peso por porção.
- [x] Receitas salvas preservam a quantidade.
- [x] Limpar a tela restaura uma porção.
- [x] A escolha não altera peso nem hidratação da massa.
- [x] O teste de cache acompanha `v109`.

## Como verificar

Na receita inicial, confirmar o texto "Uma porção". Escolher 3 e conferir a indicação de peso por porção. Salvar e reabrir a receita; limpar e confirmar que volta a uma porção.

## Fora do escopo

Alterar a fórmula ou o peso total para arredondar porções em gramas inteiros.
