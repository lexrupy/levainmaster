# 0121 — Sincronizar as receitas com um gist do GitHub

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-30
- **Status:** concluída
- **Arquivos:** `calc.js`, `app.js`, `index.html`, `tests/calc.test.js`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

As receitas salvas só existiam em cada aparelho. O app é de uso pessoal, não precisa de privacidade; só terceiros não podem modificar. Um gist do GitHub atende: a leitura é aberta e a gravação exige o token do dono.

## O que foi feito

- Seção "Sincronizar receitas" em Configurações: id do gist, token clássico (escopo `gist`; o fine-grained não tem gists) e o botão "Sincronizar receitas". Id e token ficam em `percentual-padeiro-sync-v1`, só no aparelho.
- `mergeRecipes` (`calc.js`) junta pelo `id`; no mesmo `id` vale o `savedAt` mais recente, e o empate fica com a local. Não apaga: receita apagada num lado volta na próxima junção.
- Lê o arquivo `levainmaster-receitas.json` do gist, valida cada receita com `normalizeState`, junta, grava local e, com token, envia de volta. Sem id, o token cria um gist secreto. Sem token, só lê.
- Só as receitas salvas: receita atual, opções e calibrações ficam de fora.

## Critérios de aceite

- [x] A junção traz receitas novas e a versão mais recente de uma existente.
- [x] Sem token, nada é enviado e a tela diz isso.
- [x] Erros de rede, token e gist inexistente aparecem na tela.

## Como verificar

`npm test` (teste de `mergeRecipes`); no app, Sobre › Configurações, token novo e "Sincronizar receitas"; abrir o id em outro aparelho.

## Fora do escopo

- Sincronização automática. Exclusões e renomeações passaram a propagar na tarefa 0122.
