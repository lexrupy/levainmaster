# 0115 — Exportar e importar backup completo

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-11
- **Status:** concluída
- **Arquivos:** `app.js`, `index.html`, `app.css`, `ServiceWorker.js`

## Contexto

O pedido foi criar backup das receitas e configurações, acessível em Configurações pelo modal Sobre, com importação que avisa que os dados atuais serão substituídos.

## O que foi feito

- Configurações ganhou exportação e importação de backup JSON.
- O backup inclui a receita atual, receitas salvas, configurações de hidratação e calibrações do levain com a calibração ativa.
- A importação valida o arquivo, pede uma confirmação única e explícita de substituição e grava os dados persistentes antes de atualizar a tela.
- Se a gravação falhar, tenta restaurar os valores anteriores do armazenamento.
- Cache atualizado para `padeiro-v121`.

## Critérios de aceite

- [x] Exportar gera um JSON com todos os dados persistentes do app.
- [x] Importar mostra que receita atual, receitas salvas, configurações e calibrações serão substituídas.
- [x] Cancelar mantém os dados atuais.
- [x] Confirmar substitui o conjunto inteiro, sem perguntas item a item.
- [x] Arquivo inválido ou incompatível não altera os dados.

## Como verificar

Em Configurações, exportar o backup; alterar dados e depois importar o arquivo. Confirmar a substituição, validar a receita atual, lista de receitas, opções de hidratação e calibração ativa. Repetir cancelando a confirmação e com um JSON inválido.

## Fora do escopo

- Sincronização automática entre aparelhos ou nuvem.
- Mesclar dados ou substituir itens individualmente.
