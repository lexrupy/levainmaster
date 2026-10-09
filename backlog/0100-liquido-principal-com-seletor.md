# 0100 — Líquido principal com seletor e sal removível

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-05
- **Status:** concluída
- **Arquivos:** `calc.js`, `app.js`, `index.html`, `ServiceWorker.js`, `tests/calc.test.js`, `tests/service-worker.test.js`, `tests/ui/run.mjs`, `AGENTS.md`

## Contexto

Na panificação doce e enriquecida (como pães de leite, brioches e massas ricas), a água é frequentemente substituída parcial ou totalmente por leite, ovos ou outros líquidos. Anteriormente, a linha de "Água" era estática, forçando o padeiro a manter uma linha de água zerada ao lado dos ingredientes adicionados. Além disso, o sal era obrigatório, impedindo receitas tradicionais sem sal como o Pão Toscano.

## O que foi feito

1. **Seletor de Líquido Principal (`calc.js`, `app.js`, `index.html`):**
   - A linha de líquido base agora conta com um `<select>` com as opções de `MAIN_LIQUIDS`: Água (100%), Leite integral (87%), Leite desnatado (91%), Leitelho (90%), Iogurte (85%) e Ovos (75%).
   - O rótulo e atalhos do slider do topo acompanham dinamicamente o nome do líquido selecionado (ex.: "Leite integral 65%").
   - A hidratação total desconta os sólidos e calcula a água livre com exatidão conforme o teor do líquido escolhido.
   - `enrichedBread` reconhece o líquido principal para a classificação do pão (ex.: Leite integral vira "Pão de leite", Ovos vira "Brioche").
   - O ícone do ingrediente atualiza automaticamente (droplet para água, garrafa para leite, ovo para ovos).
2. **Sem duplicidade e outros líquidos:**
   - O líquido selecionado como principal sai do menu "+ Ingrediente".
   - Se o líquido principal for leite, a "Água" passa a estar disponível no "+ Ingrediente" para receitas mistas.
3. **Sal removível:**
   - A linha de Sal ganhou o botão `×` para remoção.
   - Quando removido, o Sal passa a constar no menu "+ Ingrediente" sob "Base da receita" para ser re-adicionado a qualquer momento.
   - `normalizeState` atualizado para exigir apenas o fermento como obrigatório.
4. **Testes e Cache:**
   - Testes unitários para cálculo e enriquecimento com líquido principal e receita sem sal (`tests/calc.test.js`).
   - Automação de interface no Chrome (`tests/ui/run.mjs`) cobrindo a troca do líquido e remoção/restauração do sal.
   - `CACHE` subiu para `padeiro-v106`.

## Critérios de aceite

- [x] A linha da água possui um seletor permitindo escolher entre Água, Leite integral, Leite desnatado, Leitelho, Iogurte e Ovos.
- [x] O slider do topo e os atalhos atualizam o rótulo para o líquido principal selecionado.
- [x] A hidratação total é calculada corretamente com base no teor de água do líquido.
- [x] O Sal pode ser removido com `×` e re-adicionado pelo menu "+ Ingrediente".
- [x] Todos os testes unitários (`npm test`) e de interface (`npm run test:ui`) passam.

## Como verificar

1. Na receita inicial (65% de água), troque o seletor de "Água" para "Leite integral".
2. Veja o slider do topo mudar o nome para "Leite integral", a hidratação total recalcular para 56,6% e o pão ser classificado como "Pão de leite".
3. Clique em "+ Ingrediente" e veja que "Leite integral" sumiu das opções e "Água" apareceu.
4. Clique no `×` ao lado de Sal: o sal é removido e a massa fecha sem sal.
5. Clique em "+ Ingrediente" e selecione "Sal" para restaurá-lo.
6. Rode `npm test` e `npm run test:ui`.
