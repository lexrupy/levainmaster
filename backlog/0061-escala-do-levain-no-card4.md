# 0061 — Escala do levain no card 4

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-02
- **Status:** concluída
- **Arquivos:** `app.js`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

O bloco do levain no card 4 descrevia a acidez numa linha de texto. No modal, a mesma informação é a escala de cinco trechos, do láctico ao acético. Desenhar essa escala sobre o bege do bloco fazia o trilho sumir.

## O que foi feito

- O bloco ganhou a escala do modal: cinco trechos, o marcado em `#7d6244` e os outros em `#efe6da`, com "Láctico · suave", "Acético · azedo" e o nome do perfil.
- O título "LEVAIN USADO" fica marrom sobre o bege. O restante do bloco é branco e o texto é preto.
- Em 1:2:2 o segundo trecho acende ("Láctico: suave, azedinho de iogurte"). Em 1:1:2 acende o último ("Bem acético: azedo e pungente").
- Os outros cards continuam com a linha de texto.
- `CACHE` subiu para `padeiro-v72`.

## Critérios de aceite

- [x] A escala aparece no bloco do levain do card 4, com um trecho marcado.
- [x] O título é marrom e o miolo do bloco é branco, com o texto em preto.
- [x] Trocar a proporção move o trecho marcado.

## Como verificar

- Servir por HTTP, abrir `/?card4`, usar levain e comparar 1:2:2 com 1:1:2. Recarregar uma vez se o service worker antigo ainda estiver no controle.
