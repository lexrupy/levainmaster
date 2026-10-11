# 0111 — Pão de batata tem prioridade sobre brioche

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-11
- **Status:** concluída
- **Arquivos:** `calc.js`, `ServiceWorker.js`

## Contexto

Uma receita com 50% de batata, 18,33% de ovos e 10% de manteiga foi classificada como Brioche. A regra de ovos a partir de 15% era avaliada antes da regra de purês, embora a batata seja o ingrediente que define claramente essa fórmula.

## O que foi feito

- A classificação por purê (a partir de 10%) agora é avaliada antes da regra de Brioche.
- A versão do cache subiu para `padeiro-v117`.

## Critérios de aceite

- [x] Batata inglesa a 50%, ovos a 18,33% e manteiga a 10% classificam como “Pão de batata”.
- [x] Ovos a 20%, sem purê, continuam classificando como “Brioche”.
- [x] Purês abaixo de 10% não tomam a classificação de Brioche.

## Como verificar

Importar a receita “Pao batata Chef Mancuzo” enviada em 2026-10-11 e conferir que o pão típico é “Pão de batata”. Conferir também uma receita com ovos a 20% e sem purê.

## Fora do escopo

- Rever a classificação das demais combinações de ingredientes enriquecedores.
