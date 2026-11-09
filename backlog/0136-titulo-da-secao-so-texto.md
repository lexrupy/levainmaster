# 0136 — Título da seção só texto até tocar

- **Autor:** Alexandre da Silva
- **Data:** 2026-11-09
- **Status:** concluída
- **Arquivos:** `app.js`, `index.html`, `app.css`, `tests/ui/run.mjs`, `ServiceWorker.js`

## Contexto

O título da seção aparecia sempre como campo de texto, com cara de formulário.

## O que foi feito

Fora da edição, o título é um botão com texto em caixa alta, marrom escuro (`--brown`), em fonte um pouco maior que a do campo (1,05 rem), com uma linha do fim do título até o ×. À esquerda fica um marcador redondo no lugar do ícone; as setas de mover e o × ficam à direita, e o × pede confirmação (`askConfirm`). A linha some durante a edição. Tocar nele abre o campo (`editingSectionId`), com foco e seleção; sair do campo ou Enter volta ao texto. A seção recém-criada já nasce em edição.

## Critérios de aceite

- Sem edição, não há campo: só o texto em caixa alta.
- Tocar no título abre a edição; sair volta ao texto.

## Como verificar

`npm run test:ui` com o servidor no ar.
