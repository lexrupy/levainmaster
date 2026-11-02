# 0128 — Categoria ampla para massa rápida

- **Autor:** Alexandre da Silva
- **Data:** 2026-11-02
- **Status:** concluída
- **Arquivos:** `calc.js`, `app.js`, `index.html`, `ServiceWorker.js`, `tests/calc.test.js`, `img/muffin.svg`

## Contexto

Fermento químico como único fermento e hidratação acima de 100% não provam que a fórmula será um bolo: pode resultar em muffin, panqueca ou outra massa rápida.

## O que foi feito

- Substituída a classificação “Bolo” por “Massa rápida”, mantendo a regra do fermento químico único e hidratação acima de 100%.
- Trocada a ilustração por um muffin, como exemplo visual da categoria.
- O modal explica o critério e deixa claro que a categoria não identifica o preparo final.
- Testes cobrem a hidratação acima de 100%, exatamente 100% e a presença de outro fermento.
- Cache da PWA atualizado para `padeiro-v141`.

## Critérios de aceite

- [x] O app classifica como “Massa rápida” sob o critério definido, sem afirmar que é bolo.
- [x] O resumo e o card usam a ilustração de muffin.
- [x] O modal explica o critério e cita possibilidades de preparo.

## Como verificar

Rodar `npm test`. No app, selecionar fermento químico, ajustar a hidratação para acima de 100% e abrir o detalhe de “Massa rápida”.

## Fora do escopo

O app não tenta distinguir entre bolo, muffin, panqueca e outras massas rápidas.
