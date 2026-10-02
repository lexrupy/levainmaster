# 0038 — × de fechar centralizado

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-02
- **Status:** concluída
- **Arquivos:** `app.css`, `ServiceWorker.js`

## Contexto

O × dos modais ficava deslocado para a direita dentro do botão. O deslocamento aparecia ao passar o mouse, quando o fundo do hover acende, e parecia malfeito. A classe `.del` definia 36 × 36 px, mas mantinha o padding que o Pico põe nos botões.

## O que foi feito

- `.del` zera padding e margem e centraliza o × com `display: grid; place-items: center`. O × ficou um pouco maior (1,35rem).
- Vale para o × dos modais e para o × que remove ingredientes, que usam a mesma classe.
- `CACHE` subiu para `padeiro-v52`.

## Critérios de aceite

- [x] O × fica centralizado no quadrado de 36 px: 0 px de deslocamento horizontal e menos de 1 px vertical, que é a forma do caractere
- [x] Com o hover, o fundo fica simétrico em volta do ×
