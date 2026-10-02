# 0067 — Cabeçalho INGREDIENTE e PESO no card 4

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-02
- **Status:** concluída
- **Arquivos:** `app.js`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

No card 4, o título da lista era "Ingredientes", maior e marrom. PERCENTUAL e GRAMAS já estavam na mesma fonte menor e maiúscula.

## O que foi feito

- O título passou a "INGREDIENTE", na mesma fonte, cor e tamanho de PERCENTUAL.
- GRAMAS passou a PESO, no mesmo alinhamento à direita.
- `CACHE` subiu para `padeiro-v78`.

## Critérios de aceite

- [x] Os três rótulos aparecem como INGREDIENTE, PERCENTUAL e PESO.
- [x] Os três usam a mesma fonte.

## Como verificar

- Servir por HTTP e abrir `/?card4`. Recarregar uma vez se o service worker antigo ainda estiver no controle.
