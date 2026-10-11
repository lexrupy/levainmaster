# 0117 — Exportar todas as receitas persistidas no backup

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-11
- **Status:** concluída
- **Arquivos:** `app.js`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

O backup exportado no celular continha só duas receitas, embora houvesse mais receitas salvas. A exportação montava o arquivo a partir da lista em memória da página, que pode ficar desatualizada em relação ao armazenamento persistente.

## O que foi feito

- A exportação agora lê diretamente as chaves persistidas de receita atual, receitas salvas, calibrações e configurações.
- Valida cada receita e calibração. Se encontrar dados inválidos, não cria um backup parcial e explica o problema.
- A mensagem de sucesso informa quantas receitas foram incluídas.
- Cache atualizado para `padeiro-v123`.

## Critérios de aceite

- [x] O arquivo inclui cada receita da lista persistida, mesmo que a lista em memória esteja desatualizada.
- [x] O arquivo não é criado silenciosamente com receitas inválidas omitidas.
- [x] A tela informa a quantidade de receitas exportadas.

## Como verificar

Exportar o backup no aparelho com várias receitas e conferir a quantidade informada e o array `data.recipes` no JSON. Confirmar que receitas e dados auxiliares continuam presentes.

## Fora do escopo

- Sincronizar automaticamente listas que mudaram em outra aba enquanto ela está aberta.
