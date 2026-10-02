# 0048 — Ícone do app no topo do card

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-02
- **Status:** concluída
- **Arquivos:** `app.js`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

O card compartilhado abria só com o texto "Percentual do padeiro". O ícone do app já identifica a marca no celular e no topo da calculadora.

## O que foi feito

- O `icons/icon-192.png` entra à esquerda do título, com cantos arredondados.
- O nome do app, o nome da receita e a data ficam alinhados ao lado do ícone.
- Se a imagem não carregar, o texto continua no lugar de antes.
- `CACHE` subiu para `padeiro-v59`.

## Critérios de aceite

- [x] O card mostra o ícone à esquerda de "Percentual do padeiro" e do nome da receita.
- [x] Farinha, hidratação e peso continuam na linha de baixo, sem encostar no ícone.

## Como verificar

- Servir por HTTP, abrir `/?card` ou `card` e olhar o topo da imagem.

## Fora do escopo

- Trocar o ícone da tela da calculadora.
