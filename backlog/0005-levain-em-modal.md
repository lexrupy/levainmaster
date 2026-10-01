# 0005 — Ativação do levain em modal, com resumo na linha do fermento

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-01
- **Status:** concluída
- **Arquivos:** `index.html`, `app.js`, `app.css`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

Com o fermento em Levain, o painel "Ativar o levain" abria embaixo da linha do fermento e empurrava o resto da lista. Depois de definida, a proporção quase não muda, e o painel ocupava espaço o tempo todo.

## O que foi feito

- O painel virou um modal (`<dialog>` nativo, com `showModal`). O conteúdo é o mesmo: gramas na massa, preset L:A:F, partes, divisão em gramas, hidratação do levain e as explicações.
- O modal abre sozinho quando o seletor muda para Levain. Também abre por um lápis à direita do seletor, que só aparece com o levain.
- Fecha pelo botão Concluir, pelo ×, por Esc ou por um clique no fundo escurecido.
- Na linha do fermento, com o modal fechado:
  - à direita do lápis, a proporção (`2:4:5`)
  - à direita do percentual, `Hidratação 80%`
  - na linha de baixo, `19 g de isca · 36 g de água · 45 g de farinha`
- Com o levain, o seletor fica estreito (6,6em) para a proporção caber em 390 px. A coluna do meio da linha do ingrediente passou a `minmax(0, 1fr)`, para os gramas não saírem do card.
- A dica do modal dizia "hidratação final da massa"; agora diz "hidratação total", como pede o `AGENTS.md`.
- Ao abrir, o foco vai para o modal, não para o ×.
- `CACHE` subiu para `padeiro-v13`.

## Critérios de aceite

- [x] Com fermento seco ou fresco não aparecem lápis, resumo nem painel
- [x] Escolher Levain abre o modal
- [x] Com 500 g de farinha, levain a 20% e 2:4:5, a linha mostra `2:4:5`, `Hidratação 80%` e `19 g de isca · 36 g de água · 45 g de farinha`
- [x] O lápis reabre o modal; Concluir, ×, Esc e o clique no fundo fecham
- [x] Mudar uma parte no modal atualiza o resumo ao fechar (2:5:5 → `Hidratação 100%`)
- [x] Voltar para seco tira lápis e resumo e restaura o percentual anterior
- [x] Sem rolagem horizontal, e os gramas dentro do card, em 390 px e 560 px
- [x] Nenhum texto da tela fala em "hidratação final"

## Como verificar

Sirva a pasta, escolha Levain e repita os critérios em 390 px e 560 px. Nesta tarefa eles foram conferidos no Chrome headless por um script avulso, fora do repositório (ver 0003).

## Fora do escopo

- O percentual do levain continua editável na linha, não no modal.
- Abrir o app com o levain já salvo não abre o modal.
