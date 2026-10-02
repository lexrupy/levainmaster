# 0039 — Corrige atualização e estado corrompido

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-02
- **Status:** concluída
- **Arquivos:** `app.js`, `ServiceWorker.js`

## Contexto

Dois casos raros podiam deixar o app em estado inconsistente: a atualização do service worker podia ativar antes de ser consultada pela interface, sem oferecer recarga; e um item inválido na lista de ingredientes salva podia lançar erro ao abrir uma receita.

## O que foi feito

- `checkUpdate` guarda a referência do worker ativo antes de atualizar. Se não houver worker `installing` ou `waiting`, mas o ativo tiver mudado, mostra a nova versão instalada e oferece recarregar.
- `normalizeState` descarta entradas nulas, primitivas e arrays antes de validar e normalizar os ingredientes.
- `CACHE` passou para `padeiro-v53`.

## Critérios de aceite

- [x] Uma atualização que ativou durante `registration.update()` ainda apresenta a opção de recarga.
- [x] Ingredientes inválidos são ignorados; se faltarem ingredientes obrigatórios, a normalização rejeita o estado sem lançar erro.
- [x] O cache tem versão nova para publicar os arquivos alterados.

## Como verificar

- Revisar `checkUpdate` com worker ativo inalterado e com worker ativo substituído durante a atualização.
- Abrir uma receita com um item `null` ou primitivo em `ingredients`; confirmar que a entrada é ignorada ou que o estado inválido é recusado com segurança.
- Confirmar `padeiro-v53` em `ServiceWorker.js`.

## Fora do escopo

- Exercício manual da atualização em navegador com duas versões publicadas.
