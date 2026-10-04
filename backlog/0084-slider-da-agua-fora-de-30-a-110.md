# 0084 — O slider da água apaga percentual fora de 30–110

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-04
- **Status:** concluída
- **Arquivos:** `index.html`, `app.js`

## Contexto

O percentual da água aceita qualquer número ≥ 0 pelo campo da linha. O slider está preso em 30–110, passo 1, com `v-model.number="waterPct"`. Com a água em 20%, o rótulo fica 20% e o controle fica no mínimo, 30. Com 120%, o rótulo fica 120% e o controle fica em 110. Uma seta no slider grava o valor da ponta por cima do que foi digitado: 120% vira 109%. O valor digitado só sobrevive enquanto o slider não emite `input`.

## Proposta

Um percentual fora de 30–110 permanece até o usuário escolher outro de propósito. O controle não pode mostrar 30 enquanto o rótulo diz 20, nem 110 enquanto o rótulo diz 120.

## O que foi feito

O mínimo do slider é o menor entre 30 e a água da receita, e o máximo é o maior entre 110 e essa água. Em 20% o polegar fica em 20; em 120%, em 120. A seta anda um passo a partir desse número, em vez de gravar 30 ou 109. Os atalhos continuam os mesmos e a posição deles usa o mínimo e o máximo de agora. `CACHE` subiu para `padeiro-v92`.

## Critérios de aceite

- [x] Água em 20%: o rótulo fica 20% e uma seta no slider não grava outro percentual sozinha
- [x] Água em 120%: o rótulo fica 120% e uma seta no slider não grava 109%
- [x] Arrastar o slider para um valor de propósito continua gravando esse percentual
- [x] Atalhos 55%, 65%, 72% e 85% continuam levando a água direto ao valor
- [x] A hidratação total continua podendo diferir da água da receita

## Como verificar

Editar o percentual da água para 20 e para 120. Ler o rótulo e o slider. Usar as setas do slider e confirmar que o percentual digitado só muda se o usuário escolher outro. Repetir a 390 px e a 560 px.

## Fora do escopo

Não limita o campo da linha a 30–110. Não muda os atalhos.
