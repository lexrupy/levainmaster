# 0050 — Espaço do levain e linhas do card

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-02
- **Status:** concluída
- **Arquivos:** `app.js`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

No card, o bloco "Levain usado" encostava no título Ingredientes. Água, sal e outras linhas sem observação usavam a mesma altura da linha do levain, que reserva espaço para o texto de baixo.

## O que foi feito

- O vão entre o bloco do levain e a tabela passou de 28 px para 68 px.
- A linha sem observação fica em 52 px. Com observação (levain, equivalência do fermento, teor de água), a altura acompanha o texto, inclusive quando o nome quebra em duas linhas.
- `CACHE` subiu para `padeiro-v61`.

## Critérios de aceite

- [x] O bloco do levain não encosta em "Ingredientes".
- [x] Água e sal ocupam uma linha baixa; levain, fermento e manteiga mostram a observação embaixo, sem sobrepor o nome.

## Como verificar

- Servir por HTTP, abrir `/?card` com uma receita de levain e conferir `card`. Repetir sem levain: água e sal baixos, fermento com a equivalência.

## Fora do escopo

- Mudar o texto das observações ou o miolo do card.
