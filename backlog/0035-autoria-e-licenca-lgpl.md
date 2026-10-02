# 0035 — Autoria e licença LGPL no Sobre e no repositório

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-02
- **Status:** concluída
- **Arquivos:** `index.html`, `app.css`, `app.js`, `calc.js`, `ServiceWorker.js`, `tools/gerar-miolos.py`, `COPYING`, `COPYING.LESSER`, `vendor/OFL-Outfit.txt`, `AGENTS.md`

## Contexto

O app não dizia quem o fez nem sob que licença. A escolha foi a LGPL.

## O que foi feito

- **Licença:** GNU LGPL 3.0 ou posterior (`LGPL-3.0-or-later`). Texto oficial em `COPYING.LESSER` e, como a LGPL 3 remete à GPL 3, também a GPL em `COPYING`, ambos baixados de gnu.org.
- **Em cada arquivo do projeto:** `index.html`, `app.js`, `calc.js`, `app.css`, `ServiceWorker.js` e `tools/gerar-miolos.py` começam com o copyright e `SPDX-License-Identifier: LGPL-3.0-or-later`.
- **Modal Sobre:** ganhou um rodapé com "© 2026 Alexandre da Silva", a licença com link para gnu.org, o link do código-fonte e os créditos das dependências.
- **Compatibilidade das dependências** em `vendor/`:
  - Vue 3.5 e Pico CSS 2.1: MIT, permissiva e compatível com a LGPL; o aviso de copyright já está no topo de cada arquivo.
  - Fonte Outfit: SIL Open Font License 1.1, que deixa empacotar a fonte com qualquer software, desde que o texto da licença a acompanhe. Ele faltava e agora está em `vendor/OFL-Outfit.txt`, baixado do repositório do Google Fonts.
- `CACHE` subiu para `padeiro-v46`.

## Critérios de aceite

- [x] O Sobre mostra autoria, licença com link, código-fonte e créditos de Vue, Pico CSS e Outfit
- [x] `COPYING`, `COPYING.LESSER` e `vendor/OFL-Outfit.txt` estão no repositório com os textos oficiais
- [x] Os arquivos do projeto têm o cabeçalho SPDX, e o app continua funcionando (receita inicial: 840 g)

## Fora do escopo

- As fotos `img/miolo-*.jpg`, base da casca das ilustrações, ficam sob a licença do projeto, considerando que são do autor. Se vierem de outra fonte, a licença delas precisa ser conferida.
