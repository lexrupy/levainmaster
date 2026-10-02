# 0059 — Linha do levain compacta no card 4

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-02
- **Status:** concluída
- **Arquivos:** `app.js`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

O card 4 já destaca a proporção, a alimentação e o perfil do levain num bloco próprio. A lista de ingredientes repetia isso numa segunda linha, e a linha ficava mais alta que a da água e a do sal.

## O que foi feito

- No card 4, a linha do levain não traz mais a observação. Nome, percentual, gramas, ícone e barra permanecem.
- O bloco destacado do levain continua igual.
- Fermento biológico e teor de água de outros ingredientes mantêm a observação, nos cards em que ela já existia.
- `CACHE` subiu para `padeiro-v70`.

## Critérios de aceite

- [x] Com levain, a linha do ingrediente fica na mesma altura da água e do sal.
- [x] O bloco do levain continua com proporção, alimentação, textura, pico e acidez.
- [x] Os cards 1, 2 e 3 continuam com a observação na linha do levain.

## Como verificar

- Servir por HTTP, abrir `/?card4`, trocar o fermento para levain e fechar o modal. Recarregar uma vez se o service worker antigo ainda estiver no controle.

## Fora do escopo

- A observação "Equivale a …% de fresco/seco" e o teor de água de ingredientes como manteiga e leite.
