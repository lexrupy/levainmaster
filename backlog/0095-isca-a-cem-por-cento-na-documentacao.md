# 0095 — A isca a 100% na documentação

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-05
- **Status:** concluída
- **Arquivos:** `teorias do levain.md`, `AGENTS.md`, `index.html`, `ServiceWorker.js`, `tests/service-worker.test.js`

## Contexto

A opção de Configurações parte a isca ao meio. Faltava dizer de onde vem essa conta e onde ela não serve. Não é uma regra geral dos autores para toda isca.

## O que foi feito

1. A seção 8 de `teorias do levain.md` registra a leitura: Maurizio Leo (The Perfect Loaf, 11 de setembro de 2024) diz que a fórmula completa inclui a farinha e a água do fermento, e nas receitas publicadas deixa a isca de fora, com a inclusão opcional nas planilhas. A King Arthur define o poolish como partes iguais e o levain entre 50% e 125%. O 125% do Hamelman e o lievito madre a 50% não são metade e metade.
2. `AGENTS.md` e o aviso da opção em Configurações dizem que a divisão ao meio vale para uma cultura guardada em partes iguais.
3. `CACHE` subiu para `padeiro-v102`.

## Critérios de aceite

- [x] A documentação não apresenta a isca a 100% como regra de todo autor.
- [x] Leo e a King Arthur estão citados com o que cada um diz.
- [x] O aviso da opção diz que a divisão ao meio vale para partes iguais de farinha e água.

## Como verificar

Ler a seção 8 de `teorias do levain.md` e o parágrafo da hidratação em `AGENTS.md`. No app, abrir Configurações e ler o aviso da opção, em 390 px e em 560 px.
