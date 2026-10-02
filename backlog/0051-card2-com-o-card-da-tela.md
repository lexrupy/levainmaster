# 0051 — Card 2 com o card da tela

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-02
- **Status:** concluída
- **Arquivos:** `app.js`, `index.html`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

O card compartilhado não seguia o card principal da tela. A versão nova precisa conviver com a atual, para comparar.

## O que foi feito

- `card` e `card.png` continuam com o desenho atual.
- `card2` e `card2.png` repetem o ícone, o título, o nome e a data. Abaixo entram a farinha com a pílula 100%, a barra da composição, o peso da massa, a foto, a hidratação total, a textura, o pão típico e o slider da água com os atalhos 55%, 65%, 72% e 85%.
- Levain, ingredientes e composição da massa seguem como no card atual.
- A prévia `?card2` mostra essa imagem. `?card` continua no card atual, com um link de um para o outro.
- `CACHE` subiu para `padeiro-v62`.

## Critérios de aceite

- [x] `card` segue o desenho anterior e `card2` abre a imagem nova, os dois como PNG inline.
- [x] No card 2, ícone, título, nome e data ficam em cima; farinha, barras, foto e slider vêm em seguida; levain, ingredientes e composição fecham.

## Como verificar

- Servir por HTTP, abrir a calculadora e depois `card2` ou `/?card2`. Repetir em `card`. Recarregar uma vez se o service worker antigo ainda estiver no controle.

## Fora do escopo

- Trocar o botão de compartilhar, que continua gerando o card atual.
