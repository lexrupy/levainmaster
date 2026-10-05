# 0088 — Ativação limpa só versões do cache do app

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-04
- **Status:** concluída
- **Arquivos:** `ServiceWorker.js`

## Contexto

Na ativação, o service worker apagava toda chave da Cache Storage diferente da versão atual. A Cache Storage é compartilhada pela origem, inclusive entre projetos publicados em subpastas, então isso podia remover caches de outros apps.

## O que foi feito

A limpeza agora reconhece apenas nomes no padrão `padeiro-vN` e preserva a versão atual. A versão do cache subiu para `padeiro-v96`.

## Critérios de aceite

- [x] Ao ativar, `padeiro-v95` é removido e `padeiro-v96` é preservado.
- [x] Chaves de cache que não pertencem ao padrão do app são preservadas.

## Como verificar

Inspecionar a condição de limpeza no evento `activate` e confirmar que ela exige `/^padeiro-v\\d+$/` antes de chamar `caches.delete`.

## Fora do escopo

Falhas de gravação de receitas, estado e calibrações no `localStorage`.
