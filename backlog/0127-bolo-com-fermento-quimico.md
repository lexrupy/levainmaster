# 0127 — Identificar bolo com fermento químico

- **Autor:** Alexandre da Silva
- **Data:** 2026-11-02
- **Status:** concluída
- **Arquivos:** `calc.js`, `app.js`, `index.html`, `ServiceWorker.js`, `tests/calc.test.js`, `img/bolo.svg`

## Contexto

Com fermento químico como único fermento e hidratação total acima de 100%, classificar a fórmula como bolo e mostrar uma imagem correspondente.

## O que foi feito

- A classificação especial exige hidratação estritamente acima de 100% e exatamente um item reconhecido como fermento, do tipo químico.
- O resumo, o card compartilhado e o modal mostram “Bolo” e uma descrição de massa de bolo, em vez de associar a fórmula a uma faixa de pão.
- Criada uma ilustração vetorial de fatia de bolo e incluída no cache offline.
- Acrescentado teste para hidratação acima de 100%, exatamente 100% e presença de outro fermento.
- Cache da PWA atualizado para `padeiro-v140`.

## Critérios de aceite

- [x] Acima de 100%, o fermento químico sozinho classifica como bolo e usa a imagem de bolo.
- [x] Em 100% ou com outro fermento presente, a regra de bolo não se aplica.
- [x] A imagem está na lista de arquivos do service worker.

## Como verificar

Rodar `npm test`. No app, selecionar fermento químico, ajustar a água para passar de 100% e conferir o resumo e o card; depois adicionar levain ou voltar a 100% para conferir a regra.

## Fora do escopo

Não foram adicionadas faixas típicas nem contas específicas de massa de bolo.
