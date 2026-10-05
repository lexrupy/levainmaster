# 0089 — Informar falhas ao persistir os dados

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-04
- **Status:** concluída
- **Arquivos:** `app.js`, `index.html`, `app.css`, `AGENTS.md`

## Contexto

As gravações no `localStorage` ignoravam erros. A tela podia indicar que uma receita foi salva mesmo quando o navegador rejeitava a gravação; falhas no estado e nas calibrações também ficavam silenciosas.

## O que foi feito

Falhas de estado, receitas e calibrações agora aparecem na tela e são removidas do aviso quando uma gravação posterior da mesma categoria funciona. A lista de receitas só muda depois de persistir a nova lista; se salvar ou apagar falhar, a lista em memória continua como estava. A receita atual e as calibrações continuam utilizáveis na sessão, com aviso de que as alterações podem se perder ao fechar o app.

## Critérios de aceite

- [x] Uma falha ao persistir a receita atual mostra um aviso visível.
- [x] Uma falha ao salvar ou apagar receita não confirma sucesso nem altera a lista exibida.
- [x] Falha ao persistir calibrações informa que as alterações não estão garantidas após fechar o app.
- [x] Uma gravação posterior bem-sucedida limpa o aviso daquela categoria.

## Como verificar

Simular rejeição de `localStorage.setItem` separadamente para cada chave: editar a receita, salvar/apagar uma receita e alterar/gravar uma calibração. Confirmar os avisos e que a lista de receitas só muda depois de uma gravação bem-sucedida. Restaurar `setItem` e confirmar que o aviso correspondente desaparece após nova gravação.

## Fora do escopo

Recuperação automática de espaço no armazenamento e exportação de dados.
