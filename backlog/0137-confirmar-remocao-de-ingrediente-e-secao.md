# 0137 — Confirmar a remoção de ingrediente e de seção

- **Autor:** Alexandre da Silva
- **Data:** 2026-11-09
- **Status:** concluída
- **Arquivos:** `app.js`, `tests/ui/run.mjs`, `ServiceWorker.js`

## Contexto

O × de um ingrediente ou de uma seção apagava na hora, sem volta.

## O que foi feito

`removeIngredient` e `removeSection` pedem confirmação no modal genérico `askConfirm` (com `danger`). Cancelar, Esc e clique no fundo mantêm tudo. Remover a seção não apaga os ingredientes dela. Nas seções, as setas de mover voltaram para a direita; à esquerda fica só o marcador redondo.

## Critérios de aceite

- O × abre a confirmação; só confirmar remove.
- Cancelar mantém o ingrediente ou a seção.

## Como verificar

`npm run test:ui` com o servidor no ar.
