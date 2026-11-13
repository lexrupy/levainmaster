# 0138 — Essência de baunilha (líquida e em pó) na lista

- **Autor:** Alexandre da Silva
- **Data:** 2026-11-13
- **Status:** concluída
- **Arquivos:** `calc.js`, `tests/calc.test.js`, `ServiceWorker.js`

## Contexto

A essência de baunilha que o Alexandre usa é líquida, em volume pequeno. Ele pediu inicialmente 99,9% de água; a conferência mostrou que a essência é uma solução com álcool e não é quase só água.

## O que foi feito

`ADDABLE` ganha "Essência de baunilha" (grupo "Ovos, leite e gordura"), com `water: 80` e sem `enrich`, então não conta para o pão enriquecido. A essência de verdade é uma solução com álcool, e a de pasta ou a de baunilha em pó seriam outros ingredientes; O padrão americano de extrato de baunilha exige no mínimo 35% de álcool em volume (21 CFR 169.175); as essências brasileiras listam água, álcool etílico e aroma, e o Open Food Facts estima de 62% a 67% de água para duas marcas (estimativa, não medição). O rótulo do Aroma de Baunilha da Dr. Oetker (https://www.oetker.com.br/produtos/p/aroma-de-baunilha) lista água, álcool etílico, corante caramelo IV e aromatizante, nessa ordem, sem teor de álcool: a água é o maior componente. Os 18,8% de álcool que circularam para esse produto vêm do Open Food Facts (https://world.openfoodfacts.org/product/7891048043035) e são **estimativa** calculada a partir da ordem dos ingredientes (faixa de 0% a 50%), não medida; a mesma página estima 62,5% de água (faixa de 25% a 100%) e registra 0 % vol na tabela nutricional, o que contradiz o álcool da lista. Como nenhum número do rótulo é medido, o app usa 80%, o **teto da faixa plausível** (100% menos o álcool estimado de 18,8%, o corante e o aroma). É de propósito: errar a água para cima deixa a massa mais firme, o que se corrige na sova, enquanto massa mole demais não se recupera. O uso típico é uma colher de sopa para 500 g de farinha, então a diferença para 65% fica abaixo de 0,5 ponto. Isso vale só para dado incerto como este; ingredientes com teor conhecido mostram o número real. Com a ficha técnica do fabricante, dá para refinar.

Também entra "Essência de baunilha em pó", com `water: 0` e sem `enrich`: é seca, como os outros pós, e fica fora da água da hidratação.

## Critérios de aceite

- A essência aparece no menu "+ Ingrediente" e mostra "80% de água".
- 2% de 500 g soma 8 g de água na hidratação.
- A versão em pó aparece no menu com "não soma água".

## Como verificar

`npm test`.
