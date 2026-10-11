# 0112 — Indicar a consistência dos ingredientes nos ícones

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-11
- **Status:** concluída
- **Arquivos:** `app.js`, `index.html`, `app.css`, `ServiceWorker.js`

## Contexto

O pedido foi facilitar a leitura dos ingredientes durante a mistura sem mudar a ordem, que já pode ser organizada pela pessoa. A sugestão foi usar um brilho suave no fundo dos ícones para distinguir líquidos e pastosos, sólidos, e sal/gorduras.

## O que foi feito

- Ícones de líquidos adicionados e ingredientes pastosos usam um halo azul claro.
- Ingredientes sólidos e secos usam um halo cinza claro.
- Sal e gorduras usam um tom lilás intermediário.
- Levain e purês/frutas cozidos ficam no grupo azul; o teor de água não determina a categoria.
- O halo usa gradientes e sombras muito leves, sem alterar a ordenação nem os dados salvos.
- A versão do cache subiu para `padeiro-v118`.

## Critérios de aceite

- [x] Água, leite, ovos, mel e ingredientes pastosos aparecem em azul.
- [x] Farinhas, pós, açúcar e fermento biológico seco aparecem em cinza.
- [x] Sal, manteiga e margarinas aparecem em lilás.
- [x] A ordem dos ingredientes permanece controlada pelos botões existentes.

## Como verificar

Abrir a lista em 390 px e conferir os ícones de água/leite, batata, farinha, fermento seco, sal e manteiga. Confirmar que o halo é discreto e não compete com o ícone.

## Fora do escopo

- Agrupar ou reordenar ingredientes automaticamente.
- Classificar ingredientes personalizados por consistência.
