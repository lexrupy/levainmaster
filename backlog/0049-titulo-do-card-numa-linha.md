# 0049 — Título do card numa linha

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-02
- **Status:** concluída
- **Arquivos:** `app.js`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

O ícone, o nome do app e o nome da receita estavam no mesmo bloco, e o nome da receita saía alinhado com o texto do título, não com a margem esquerda.

## O que foi feito

- Ícone e "Percentual do padeiro" ficam na mesma linha. A fonte do título passou de 24 px para 42 px.
- O nome da receita e a data ficam abaixo, alinhados à esquerda do card.
- `CACHE` subiu para `padeiro-v60`.

## Critérios de aceite

- [x] O ícone e "Percentual do padeiro" estão na mesma linha, com o título maior.
- [x] "Minha Receita" começa na margem esquerda, abaixo dessa linha.

## Como verificar

- Servir por HTTP e abrir `card` ou `/?card`. Conferir o topo da imagem.

## Fora do escopo

- Mudar o tamanho do nome da receita.
