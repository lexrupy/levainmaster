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
- **Testado e descartado:** a temperatura no rótulo ("PICO · a 24–26 °C") e ao lado do tempo ("8 a 12 h · a 24–26 °C"). Ao lado do tempo, a coluna alarga e a textura volta a quebrar em 360–412 px. Ficou a forma inicial: "PICO", o tempo e, embaixo, "a 24–26 °C" em letra pequena.
- `CACHE` subiu para `padeiro-v41` e, ao voltar para a forma inicial, para `padeiro-v43`.

## Critérios de aceite

- [x] Em 360, 390, 412 e 560 px, a textura de 1:2:2, 2:4:5 e 1:2:3 cabe numa linha
- [x] O pico fica alinhado à direita da linha
