# 0099 — Açúcar, açúcar mascavo e adoçante culinário nos ingredientes

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-05
- **Status:** concluída
- **Arquivos:** `calc.js`, `app.js`, `ServiceWorker.js`, `tests/calc.test.js`, `tests/service-worker.test.js`, `AGENTS.md`

## Contexto

O app já suportava a classificação de pães enriquecidos na categoria de açúcares ("Pão adoçado"), mas contava apenas com "Mel" (17% de água) e "Melado" (22% de água) na lista de ingredientes adicionáveis. Os ingredientes básicos secos para adoçar massas — açúcar branco cristal/refinado, açúcar mascavo e adoçante culinário de forno e fogão — não constavam no menu "+ Ingrediente".

## O que foi feito

1. **Inclusão em `ADDABLE` (`calc.js`):** Adicionados sob o grupo "Ovos, leite e gordura":
   - `Açúcar` (água 0%, enrich: "açúcar")
   - `Açúcar mascavo` (água 0%, enrich: "açúcar")
   - `Adoçante culinário` (água 0%, enrich: "açúcar")
   Por serem pós e granulados secos, têm água livre 0% na convenção do app e pontuam na categoria de enriquecimento de açúcar (classificando como "Pão adoçado" a partir de 5%).
2. **Ícones (`app.js`):** Mapeados para `ICONS.flour` no dicionário `ICON_BY_NAME`, acompanhando a identidade visual dos ingredientes secos em pó do app.
3. **Testes e Documentação:** Cobertos nos testes unitários (`tests/calc.test.js`) de ingredientes secos que não somam água e na classificação de pão enriquecido. `CACHE` incrementado para `padeiro-v105`.

## Critérios de aceite

- [x] "Açúcar", "Açúcar mascavo" e "Adoçante culinário" aparecem no menu "+ Ingrediente", todos com "não soma água".
- [x] Adicionar qualquer um deles soma normalmente ao peso da massa em gramas, mantendo a hidratação inalterada (água 0%).
- [x] A partir de 5% de qualquer um deles (sem outros enriquecedores predominantes), o pão é classificado como "Pão adoçado".
- [x] Todos os testes unitários (`npm test`) e de interface (`npm run test:ui`) passam.

## Como verificar

1. Abra a calculadora e clique em "+ Ingrediente".
2. No grupo "Ovos, leite e gordura", confirme a presença de "Açúcar", "Açúcar mascavo" e "Adoçante culinário".
3. Adicione qualquer um deles a 10%: confira que a hidratação se mantém intacta, o peso da massa aumenta e o pão vira "Pão adoçado".
4. Rode `npm test` e `npm run test:ui`.
