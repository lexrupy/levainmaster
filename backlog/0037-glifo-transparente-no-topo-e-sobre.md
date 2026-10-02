# 0037 — Glifo transparente no topo e no Sobre

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-02
- **Status:** concluída
- **Arquivos:** `tools/gerar-icones.py`, `icons/glifo.jpg`, `index.html`, `app.css`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

O topo (34 px) e o Sobre (52 px) usavam o ícone de app, um quadrado bege com a ilustração no meio. Nesse tamanho a figura ficava pequena e o quadrado chamava mais atenção que ela.

## O que foi feito

- **Glifo:** `tools/gerar-icones.py` passou a gerar também `icons/glifo.jpg` (128 × 128, 28 KB), com a ilustração inteira (pão, pote, copo, trigo e selo de %) e o bege do papel transparente. O glifo é justo na figura, sem quadrado e sem moldura.
- **Uso na página:** o topo e o Sobre usam o glifo, sem cantos arredondados.
- **Tentativa descartada:** só o pão e o selo, que cortava o pote e o copo.
- **Ajuste posterior:** o glifo transparente foi trocado pela arte original de 512 px recortada por dentro da moldura dupla (`INNER_BOX`, de (38, 36) a (476, 474)), com o fundo de papel da arte e cantos levemente arredondados (7 px no topo, 10 px no Sobre). O `CACHE` subiu para `padeiro-v49`.
- **Sobre maior:** o glifo passou de 52 para 104 px, com o título e a versão maiores, centralizados ao lado. O arquivo virou `icons/glifo.jpg`, de 256 px: sem transparência, o JPEG tem 17 KB, contra 29 KB do PNG de 128 px. O `CACHE` subiu para `padeiro-v50`.
- **Cache:** o glifo entrou em `FILES`, e o `CACHE` subiu para `padeiro-v48`.

## Critérios de aceite

- [x] O topo e o Sobre mostram a figura sem o quadrado bege e sem cortes
- [x] O glifo é gerado pelo script, com backup do anterior
- [x] O glifo final não mostra nenhuma linha da moldura
- [x] No Sobre, o glifo tem 104 px (o dobro), com título (1,4rem) e versão (1,05rem) maiores ao lado
