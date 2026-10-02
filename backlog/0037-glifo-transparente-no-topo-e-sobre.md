# 0037 — Glifo transparente no topo e no Sobre

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-02
- **Status:** concluída
- **Arquivos:** `tools/gerar-icones.py`, `icons/glifo.png`, `index.html`, `app.css`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

O topo (34 px) e o Sobre (52 px) usavam o ícone de app, um quadrado bege com a ilustração no meio. Nesse tamanho a figura ficava pequena e o quadrado chamava mais atenção que ela.

## O que foi feito

- **Glifo:** `tools/gerar-icones.py` passou a gerar também `icons/glifo.png` (128 × 128, 28 KB), com a ilustração inteira (pão, pote, copo, trigo e selo de %) e o bege do papel transparente. O glifo é justo na figura, sem quadrado e sem moldura.
- **Uso na página:** o topo e o Sobre usam o glifo, sem cantos arredondados.
- **Tentativa descartada:** só o pão e o selo, que cortava o pote e o copo.
- **Cache:** o glifo entrou em `FILES`, e o `CACHE` subiu para `padeiro-v48`.

## Critérios de aceite

- [x] O topo e o Sobre mostram a figura sem o quadrado bege e sem cortes
- [x] O glifo é gerado pelo script, com backup do anterior
