# 0046 — card.png interceptado pelo service worker

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-02
- **Status:** concluída
- **Arquivos:** `ServiceWorker.js`, `app.js`, `index.html`, `AGENTS.md`

## Contexto

A prévia em `?card` usava um endereço `blob:`. Esse tipo de URL não passa pelo service worker, então o navegador de mesa tratava o arquivo como download em vez de página para olhar e ajustar.

## O que foi feito

- A página gera o PNG e entrega ao service worker, que guarda em `card.png`.
- Todo GET de `card.png` é interceptado. A resposta vem com `Content-Type: image/png` e `Content-Disposition: inline`, sem ir à rede.
- A prévia e "Abrir em tamanho real" apontam para esse endereço. Sem worker ativo, a prévia ainda usa o blob para não ficar em branco.
- `CACHE` subiu para `padeiro-v57`.

## Critérios de aceite

- [x] Com o worker ativo, a imagem da prévia é `card.png`, não um blob.
- [x] `card.png` responde `image/png` e `inline`, e não dispara download.
- [x] Mudar a receita grava de novo e a prévia atualiza.

## Como verificar

- Servir por HTTP, abrir `/?card` e esperar o worker assumir a página.
- Conferir que a imagem aponta para `card.png` e que abrir esse endereço mostra o PNG.
- Mover o slider e ver a imagem mudar.

## Fora do escopo

- Um link público da receita que outra pessoa abre sem ter o app.
