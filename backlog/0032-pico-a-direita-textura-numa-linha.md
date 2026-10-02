# 0032 — Pico à direita e textura do levain numa linha

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-01
- **Status:** concluída
- **Arquivos:** `app.css`, `calc.js`, `ServiceWorker.js`

## Contexto

No perfil do modal de ativação, Textura e Pico dividiam a linha meio a meio, e a textura ("Pastosa, mais firme que um iogurte") quebrava em duas linhas.

## O que foi feito

- **Pico na ponta direita:** fica alinhado à direita e com a largura do próprio conteúdo. A textura fica com o resto da linha.
- **Textos de textura mais curtos**, com o mesmo sentido, para caber também em 360 px:

| Antes | Agora |
|---|---|
| Cremosa, como um iogurte grosso | Cremosa, como iogurte grosso |
| Pastosa, mais firme que um iogurte | Pastosa, mais firme que iogurte |
| Massa firme, que se sova na mão | Firme, de sovar na mão |

- Reduzir a fonte em telas estreitas foi testado e não bastou; ficou de fora.
- **Ajuste posterior:** a temperatura subiu para o rótulo ("PICO · a 24–26 °C", mesma cor e peso), e embaixo fica só "8 a 12 h". O bloco caiu de três para duas linhas. A coluna do pico tem a largura do "8 a 12 h"; o rótulo avança para a esquerda, sobre o espaço livre ao lado de "Textura", sem alargar a coluna.
- `CACHE` subiu para `padeiro-v41` e, no ajuste, para `padeiro-v42`.

## Critérios de aceite

- [x] Em 360, 390, 412 e 560 px, a textura de 1:2:2, 2:4:5 e 1:2:3 cabe numa linha
- [x] O pico fica alinhado à direita da linha
- [x] "PICO · a 24–26 °C" fica numa linha, na mesma cor do "PICO", e não encosta em "Textura" (126 px de folga em 360 px)
