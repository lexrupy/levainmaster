# 0091 — Renomear referências locais para Levain Master

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-05
- **Status:** concluída
- **Arquivos:** referências do app, testes, `AGENTS.md`, `ServiceWorker.js`, `manifest.webmanifest`

## Contexto

O repositório foi renomeado no GitHub para `levainmaster`. As referências locais precisam usar o novo endereço, e a marca visível deve ser “Levain Master”.

## O que foi feito

Atualizados os nomes e links do app, do manifesto de instalação, do cartão compartilhado, dos testes, das ferramentas e da documentação. O remoto `origin` aponta para `git@github.com:lexrupy/levainmaster.git`, e o endereço do GitHub Pages foi atualizado. O ícone existente foi mantido. As chaves de armazenamento e o prefixo interno dos caches foram preservados para manter os dados e instalações atuais; o cache subiu para `padeiro-v97` por causa dos arquivos publicados.

## Critérios de aceite

- [x] A interface, o manifesto e o cartão usam “Levain Master”.
- [x] Links e documentação apontam para o repositório e o Pages com o novo nome.
- [x] O ícone e as chaves locais de dados permanecem iguais.
- [x] O cache da PWA foi incrementado para a próxima publicação.

## Como verificar

Confira o nome no cabeçalho, em Sobre, no nome de instalação e na prévia do cartão. Rode `git remote -v` e abra o endereço do Pages indicado em `AGENTS.md`.

## Fora do escopo

Publicar no GitHub Pages e alterar registros históricos do backlog ou o título do estudo `teorias do levain.md`.
