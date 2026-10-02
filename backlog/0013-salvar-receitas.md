# 0013 — Salvar receitas com descrição, data e hora

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-01
- **Status:** concluída
- **Arquivos:** `app.js`, `index.html`, `app.css`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

O app guardava só a receita da tela. Não havia como recuperar uma mistura feita antes, como a do domingo com levain 1:5:5.

## O que foi feito

- Botão **Receitas** no topo, ao lado de Instalar, que abre um modal.
- **Salvar:** campo de descrição (obrigatório, até 80 caracteres) e um resumo da receita da tela. Salvar guarda a descrição, a data e hora e uma cópia do estado inteiro: farinha, ingredientes, fermento e a proporção L:A:F do levain.
- **Lista:** mais nova primeiro, com descrição, data e hora (pt-BR) e um resumo, por exemplo "800 g de farinha · hidratação 74,1% · Levain 20% · 1:5:5".
- **Abrir:** troca a receita da tela pela salva e fecha o modal.
- **Apagar:** pede um segundo toque ("Confirmar").
- Fica em `localStorage`, chave `percentual-padeiro-receitas-v1`. Abrir passa o estado por `normalizeState`, a limpeza que saiu de `loadState` para servir aos dois.
- Gravar no `localStorage` agora não quebra o app se o armazenamento estiver cheio ou bloqueado (`try/catch`).
- `CACHE` subiu para `padeiro-v23`.

## Critérios de aceite

- [x] Sem descrição, o botão Salvar fica desabilitado
- [x] Salvar duas receitas lista as duas, a mais nova em cima, com data e hora
- [x] As receitas continuam lá depois de recarregar a página
- [x] Abrir "Domingo com levain" restaura 800 g de farinha, levain 20% em 1:5:5 e hidratação total de 74,1%
- [x] Apagar pede confirmação: o primeiro toque mostra "Confirmar", o segundo apaga
- [x] Em 390 px, o campo e o botão Salvar cabem na mesma linha

## Fora do escopo

- Editar ou renomear uma receita salva.
- Exportar receitas ou passá-las para outro aparelho; elas ficam só neste navegador.
