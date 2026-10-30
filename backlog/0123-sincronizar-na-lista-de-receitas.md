# 0123 — Botão Sincronizar na lista de receitas

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-30
- **Status:** concluída
- **Arquivos:** `index.html`, `app.css`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

Sincronizar exigia abrir Sobre › Configurações toda vez.

## O que foi feito

- No modal Receitas, ao lado de "Importar receita JSON", aparece "Sincronizar" quando há token configurado. Usa a mesma `syncRecipes`; o resultado aparece logo abaixo.

## Critérios de aceite

- [x] Sem token, só o botão de importar, na largura toda.
- [x] Com token, os dois botões lado a lado.

## Como verificar

Configurar o token, abrir Receitas e tocar em Sincronizar.
