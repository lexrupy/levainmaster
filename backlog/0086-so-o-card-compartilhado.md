# 0086 — Só o card compartilhado

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-04
- **Status:** concluída
- **Arquivos:** `app.js`, `index.html`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

O botão Compartilhar já enviava só o desenho do card 4. Os cards 1, 2 e 3 continuavam no código, nas prévias `?card`, `?card2` e `?card3` e nas gravações do service worker. Não eram usados.

## O que foi feito

Ficou uma imagem só, a que era compartilhada. `makeRecipeCard` desenha esse card. A prévia abre em `?card`. O service worker responde em `card` e `card.png`. Os desenhos, os links e os caminhos `card2`, `card3` e `card4` saíram. `CACHE` subiu para `padeiro-v93`.

## Critérios de aceite

- [x] Compartilhar continua gerando essa imagem, com o nome da receita no arquivo
- [x] `?card` mostra a prévia, e `card.png` responde com PNG
- [x] `card2`, `card3` e `card4` não são mais imagens do app
- [x] A tela da calculadora, em 390 px e em 560 px, continua sem rolagem horizontal

## Como verificar

Servir por HTTP, abrir a calculadora e `/?card`. Abrir `card.png`. Confirmar que `card2.png` não é a imagem antiga. Usar Compartilhar. Repetir a largura em 390 px e 560 px.

## Fora do escopo

Não muda o desenho do card que é compartilhado. Não mexe nas tarefas antigas do backlog, que registram como os outros cards foram feitos.
