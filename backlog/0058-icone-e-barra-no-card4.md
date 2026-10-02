# 0058 — Ícone e barra de percentual no card 4

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-02
- **Status:** concluída
- **Arquivos:** `app.js`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

Na lista de ingredientes do card 4, cada linha era só nome, percentual e gramas. No app, o ingrediente tem o ícone e uma barrinha do percentual.

## O que foi feito

- Cada linha do card 4 ganhou o mesmo ícone do app, num quadrado bege, à esquerda do nome.
- A barrinha do percentual (trilho `#f0e8dc`, preenchimento `#a68462`, até 100%) fica embaixo do item, com 5 px de espessura. O vão separa o texto da barra.
- O card, o card 2 e o card 3 não mudaram.
- `CACHE` subiu para `padeiro-v69`.

## Critérios de aceite

- [x] Água, sal e fermento mostram o ícone correspondente.
- [x] A barra fica abaixo do item, inclusive abaixo da observação do fermento e do levain.
- [x] Água a 65% preenche a maior parte da linha; sal a 2% e fermento a 1% ficam um trecho curto; levain a 20% fica entre os dois.

## Como verificar

- Servir por HTTP e abrir `/?card4`. Recarregar uma vez se o service worker antigo ainda estiver no controle.
- Trocar o fermento para levain e conferir o ícone, a observação e a barra de 20% embaixo.

## Fora do escopo

- O botão de compartilhar continua gerando o card 1.
