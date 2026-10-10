# 0101 — Reordenar itens da receita

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-10
- **Status:** concluída
- **Arquivos:** `index.html`, `app.js`, `app.css`, `ServiceWorker.js`, `tests/ui/run.mjs`, `tests/service-worker.test.js`, `AGENTS.md`

## Contexto

O pedido foi permitir que a pessoa organize os ingredientes na ordem que prefere, inclusive no celular.

## O que foi feito

Adicionados botões acessíveis para mover cada linha um lugar para cima ou para baixo. Os limites da lista desabilitam o movimento impossível; a ordem continua no array de ingredientes, portanto é salva junto do estado e das receitas.

## Critérios de aceite

- [x] Cada ingrediente pode subir ou descer uma posição por vez.
- [x] A primeira linha não sobe e a última não desce.
- [x] A ordem alterada persiste no estado salvo.
- [x] Os botões cabem em 390 px e 560 px.
- [x] O service worker preserva `v107` e remove os caches antigos do app.
- [x] `npm test` e `npm run test:ui` passam.

## Como verificar

Em 390 px e 560 px, mover o Sal para baixo e para cima. Confirmar a ordem no estado salvo e que os botões de limite ficam desabilitados. Rodar as suítes abaixo.

```bash
npm run test:ui
```

## Fora do escopo

Arrastar e soltar as linhas.
