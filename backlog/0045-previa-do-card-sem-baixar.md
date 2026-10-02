# 0045 — Prévia do card sem baixar

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-02
- **Status:** concluída
- **Arquivos:** `index.html`, `app.js`, `app.css`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

O botão de compartilhar gera o PNG e, no navegador de mesa, baixa o arquivo. Para ajustar o card, faz falta ver a imagem na própria página.

## O que foi feito

- `?card` mostra a prévia no topo, acima da calculadora.
- A imagem é a mesma gerada para compartilhar e atualiza quando a receita muda.
- "Abrir em tamanho real" abre o PNG numa aba, sem download. "Fechar prévia" volta ao app.
- O botão de compartilhar continua baixando ou abrindo o menu do sistema.
- `CACHE` subiu para `padeiro-v56`.

## Critérios de aceite

- [x] `/?card` mostra a imagem do card e não dispara download.
- [x] Mudar a água atualiza a imagem da prévia.
- [x] Sem `?card`, o app segue igual e o botão de compartilhar continua baixando.

## Como verificar

- Servir por HTTP e abrir `/?card`. Conferir a imagem e a ausência de download.
- Mover o slider da água e ver o percentual do card mudar.
- Abrir `./` e confirmar que a prévia não aparece.

## Fora do escopo

- Publicar um link permanente da receita para outra pessoa.
