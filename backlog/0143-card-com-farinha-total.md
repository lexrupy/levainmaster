# 0143 — Card e TXT com a farinha total

- Autor: Alexandre da Silva
- Data: 2026-11-21
- Status: feito

## Contexto
Com farinhas ou amidos extras, a tela mostra "300 g no total" ao lado de Farinha (tarefa 0133), mas o card compartilhado e o TXT mostravam só a farinha principal.

## O que foi feito
O rótulo do bloco FARINHA no card vira "FARINHA · 300 g NO TOTAL" quando há farinha extra, e o TXT traz "(300 g no total)" na linha da farinha. `CACHE` subiu para `padeiro-v179`.

## Critérios de aceite
- Sem farinha extra, nada muda.
- Com farinha extra, o card e o TXT trazem o total, igual ao selo da tela.

## Como verificar
Adicionar uma farinha extra e abrir Compartilhar.
