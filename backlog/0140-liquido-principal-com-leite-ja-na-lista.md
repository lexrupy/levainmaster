# 0140 — Líquido principal aceita o que já está na lista

- Autor: Alexandre da Silva
- Data: 2026-11-14
- Status: feito

## Contexto
Com Leite integral já adicionado como ingrediente, o seletor da água principal não oferecia Leite integral. O filtro era anterior à tarefa 0134, que permite repetir ingredientes.

## O que foi feito
`primaryLiquidChoices` devolve todos os `MAIN_LIQUIDS`. `CACHE` subiu para `padeiro-v169`.

## Critérios de aceite
- O seletor lista todos os líquidos, mesmo os que já estão como extra.

## Como verificar
Adicionar Leite integral em "+ Ingrediente" e abrir o seletor do líquido principal.
