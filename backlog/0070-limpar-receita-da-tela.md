# 0070 — Limpar a receita da tela

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-02
- **Status:** concluída
- **Arquivos:** `index.html`, `app.js`, `app.css`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

A tela acumula a receita em que se está trabalhando. Faltava um jeito de voltar à receita inicial sem apagar o que já foi salvo. Abrir uma receita só copia o estado para a tela: não existe modo de edição da receita salva.

## O que foi feito

- **Borracha:** botão redondo de 34 px, igual ao de compartilhar, à esquerda de Salvar receita. O ícone é uma borracha, no mesmo traço do compartilhar.
- **Confirmação:** usa `askConfirm`. Cancelar, Esc e clique no fundo deixam a tela como está. Confirmar devolve a receita inicial (500 g, 65% de água, 2% de sal, 1% de fermento seco, nome Minha Receita).
- **Lista intacta:** a chave `percentual-padeiro-receitas-v1` não é lida nem escrita. Só o estado da tela (`percentual-padeiro-v1`) muda, pelo mesmo `watch` de sempre.
- `CACHE` subiu para `padeiro-v81`.

## Critérios de aceite

- [x] A borracha fica à esquerda de Salvar receita e tem o mesmo tamanho do compartilhar, em 390 px e em 560 px
- [x] Confirmar zera a tela para a receita inicial, mesmo depois de abrir uma receita salva
- [x] Cancelar não muda a tela. Esc e clique no fundo usam o mesmo modal de sempre
- [x] A lista de receitas salvas continua igual depois de limpar

## Como verificar

Servir a pasta e, no navegador, alterar a farinha, abrir uma receita salva, tocar a borracha, cancelar e confirmar. Conferir o `localStorage` da lista.

## Fora do escopo

Não há modo de edição da receita salva. Limpar não grava por cima de uma receita da lista.
