# 0017 — Modal do levain mais compacto; "Levain" vira "Isca"

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-01
- **Status:** concluída
- **Arquivos:** `index.html`, `app.css`, `ServiceWorker.js`

## Contexto

O modal de ativação empilhava o seletor de proporção, os três campos L:A:F, três cartões de gramas e a hidratação, cada um numa linha. Com o perfil da 0012, ficou comprido. E "Levain" como nome da parte L confundia com o levain inteiro.

## O que foi feito

- **Linha 1:** o seletor de proporção fica ao lado dos campos Isca : Água : Farinha, todos com o rótulo em cima.
- **Linha 2:** os cartões de gramas (Isca, Água, Farinha) ficaram menores, e a hidratação do levain passou para um cartão à direita deles, em destaque.
- A parte L passou a se chamar **Isca**, no campo e no cartão.
- Abaixo de 340 px, o seletor desce para uma linha própria. Os rótulos dos cartões não quebram; se faltar espaço, terminam em reticências.
- Saiu o CSS de `.levain-hyd`, que não tinha mais uso.
- `CACHE` subiu para `padeiro-v25`.

## Critérios de aceite

- [x] Em 390 px, proporção e partes ficam numa linha, e gramas e hidratação em outra
- [x] Com 100 g de levain em 2:4:5: Isca 19 g, Água 36 g, Farinha 45 g, Hidratação 80%
- [x] Os rótulos dizem Proporção, Isca, Água, Farinha
- [x] Nada transborda do modal em 320, 360, 390 e 560 px
- [x] Em 390 px, o modal inteiro cabe sem rolar (724 px de altura)

## Fora do escopo

Em 320 px, "Hidratação" aparece abreviada com reticências.
