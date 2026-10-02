# 0054 — Títulos centralizados nos cards de resumo

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-02
- **Status:** concluída
- **Arquivos:** `app.js`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

Nos cards de farinha, hidratação total e peso da massa, o título e o valor ficavam alinhados à esquerda.

## O que foi feito

- No card, no card 2 e no card 3, o título e o valor desses cards passam a ficar no centro.
- No card 3, a hidratação total do meio também fica centralizada; as barras da composição continuam à esquerda.
- `CACHE` subiu para `padeiro-v65`.

## Critérios de aceite

- [x] Farinha, hidratação total e peso da massa têm título e valor no centro nos três cards.

## Como verificar

- Servir por HTTP e abrir `card`, `card2` e `card3`. Recarregar uma vez se o service worker antigo ainda estiver no controle.
