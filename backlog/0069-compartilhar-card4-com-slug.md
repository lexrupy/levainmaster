# 0069 — Compartilhar o card 4 com o nome da receita

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-02
- **Status:** concluída
- **Arquivos:** `app.js`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

O botão Compartilhar ainda gerava o primeiro card. O arquivo baixado se chamava sempre `receita-percentual-do-padeiro.png`, sem relação com o nome da receita na tela.

## O que foi feito

- O botão chama `makeRecipeCard4`. `makeRecipeCard`, `makeRecipeCard2` e `makeRecipeCard3` continuam no código e nas prévias `?card`, `?card2` e `?card3`.
- O PNG, no compartilhamento e no download, usa um slug do nome: minúsculas, sem acento, trechos separados por hífen. "Pão de Centeio" vira `pao-de-centeio.png`. "Minha Receita" vira `minha-receita.png`. Nome vazio ou só pontuação cai em `minha-receita.png`.
- `CACHE` subiu para `padeiro-v80`.

## Critérios de aceite

- [x] Compartilhar gera o card 4, com fermentação ao lado da foto.
- [x] O arquivo usa o slug do nome da receita.
- [x] Os cards 1, 2 e 3 continuam nas prévias.

## Como verificar

- Servir por HTTP, nomear a receita (por exemplo "Pão de Centeio") e tocar em Compartilhar. O PNG mostra FERMENTAÇÃO e o arquivo se chama `pao-de-centeio.png`.
- Abrir `?card`, `?card2`, `?card3` e `?card4` e conferir que cada prévia ainda aparece.
- Recarregar uma vez se o service worker antigo ainda estiver no controle.
