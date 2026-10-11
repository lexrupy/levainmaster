# 0116 — Renomear uma receita salva

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-11
- **Status:** concluída
- **Arquivos:** `app.js`, `index.html`, `ServiceWorker.js`

## Contexto

Era preciso mudar o nome de uma receita salva sem duplicá-la e apagar a versão anterior. A lista não deve permitir editar os demais dados da receita.

## O que foi feito

- Cada receita salva ganhou a ação “Renomear”, com campo de nome e opções para salvar ou cancelar.
- A gravação atualiza apenas o nome e o nome correspondente dentro do estado salvo; preserva ID, data e restante da receita.
- Nomes vazios e nomes já usados por outra receita são recusados.
- Cache atualizado para `padeiro-v122`.

## Critérios de aceite

- [x] É possível renomear uma receita diretamente na lista.
- [x] Cancelar mantém o nome anterior.
- [x] Nome repetido ou vazio não é salvo.
- [x] Abrir a receita renomeada mostra o novo nome.
- [x] Os outros dados da receita e a data de gravação são preservados.

## Como verificar

Na lista de receitas, renomear uma receita, fechá-la e abri-la novamente; conferir que a fórmula não mudou. Repetir com o nome de outra receita e cancelar a edição.

## Fora do escopo

- Editar ingredientes ou quantidades de uma receita salva.
