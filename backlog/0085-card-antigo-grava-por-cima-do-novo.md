# 0085 — Uma geração antiga do card pode gravar por cima da nova

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-04
- **Status:** proposta
- **Arquivos:** `app.js`, `ServiceWorker.js`

## Contexto

`refreshCardPreview` numera cada geração e desiste se outra começou, antes de desenhar e antes de gravar. Dentro do loop de `storeCard` não há essa checagem. Cada gravação espera a resposta do service worker. Se uma geração mais nova começa a gravar nesse intervalo, a antiga ainda manda `card2`, `card3` ou `card4`, e o worker fica com a imagem da receita anterior. A prévia e `card.png` (e `card2`, `card3`, `card4`) leem esse blob.

Enquanto a geração nova ainda desenha o canvas, a trava funciona. Compartilhar não passa por esse cache: chama `makeRecipeCard4()` na hora.

## Proposta

Uma geração antiga não grava nenhum card depois que uma mais nova começou. A imagem servida em `card.png` e nas outras três é a da última receita.

## Critérios de aceite

- [ ] Se a geração muda no meio das quatro gravações, a antiga não manda os cards que faltam
- [ ] A geração nova termina com os quatro blobs dela no worker
- [ ] Compartilhar continua gerando o card 4 na hora, sem depender dessa fila

## Como verificar

Com o service worker ativo, mudar a receita, esperar a gravação dos quatro cards começar e mudar de novo antes de ela acabar. Abrir `card.png`, `card2.png`, `card3.png` e `card4.png` e conferir que os quatro são da receita mais nova. O teste precisa forçar a sobreposição; no uso lento ela não aparece.

## Fora do escopo

Não muda o desenho dos cards. Não coloca os markdown do backlog no cache.
