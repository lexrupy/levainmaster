# 0141 — Token do gist sem campo de senha

- Autor: Alexandre da Silva
- Data: 2026-11-14
- Status: feito

## Contexto
O campo do token da sincronização era `type="password"`, e o navegador oferecia salvar como senha.

## O que foi feito
O campo virou `type="text"`, com `autocomplete="off"`, sem correção ou maiúscula automática e com os atributos que gerenciadores de senha respeitam (`data-lpignore`, `data-1p-ignore`, `data-bwignore`). `CACHE` subiu para `padeiro-v170`.

## Critérios de aceite
- Salvar o token não dispara a oferta de salvar senha.

## Como verificar
Configurações → Sincronizar receitas → digitar um token e sair do campo.
