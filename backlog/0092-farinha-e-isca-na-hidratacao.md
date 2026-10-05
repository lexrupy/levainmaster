# 0092 — Farinha do levain no divisor e opção de incluir a isca

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-05
- **Status:** concluída
- **Arquivos:** `calc.js`, `app.js`, `index.html`, `ServiceWorker.js`, `tests/calc.test.js`, `tests/ui/run.mjs`, `tests/service-worker.test.js`, `AGENTS.md`

## Contexto

Antes desta tarefa, o cálculo da hidratação total somava a água da alimentação do levain no numerador, mas ignorava a farinha da alimentação no divisor (a farinha base da receita permanecia fixa em 100%). Isso gerava uma assimetria matemática na hidratação total, distorcendo a firmeza percebida da massa e as faixas de pão típico quando a dosagem de levain variava. Além disso, a água e a farinha originais da isca não podiam ser consideradas na hidratação mesmo quando o padeiro desejava um cálculo estritamente balanceado.

## O que foi feito

1. **Farinha da alimentação na hidratação (`calc.js`):** A farinha proveniente da alimentação do levain (`levain.flour`) passou a ser somada à farinha total da massa no divisor (`totalFlour = flour + addedFlour`), de modo que a hidratação total passe a refletir a proporção real de água sobre farinha na bacia.
2. **Opção para incluir a isca (`calc.js`, `app.js`, `index.html`):** Criada uma configuração global ("Considerar água e farinha da isca nos cálculos") no modal Sobre. Quando ativada, a isca do levain é considerada como 50% água e 50% farinha (100% de hidratação), adicionando `seed / 2` tanto à água quanto à farinha total da massa.
3. **Persistência reativa:** A configuração é salva na chave `percentual-padeiro-config-v1` no `localStorage`, recarrega automaticamente com o app e reage de imediato em toda a interface e no card compartilhado.
4. **Dica no modal do Levain:** Atualizado o texto informativo para mostrar com exatidão quantos gramas de água e de farinha do levain estão entrando no cálculo da hidratação total.
5. **Testes e Cache:** Atualizados os testes unitários (`tests/calc.test.js`), teste de ciclo de vida do cache (`tests/service-worker.test.js`), e adicionado cenário em `tests/ui/run.mjs` cobrindo o acionamento e a persistência da nova opção em 390 px e 560 px. O cache do service worker foi incrementado para `padeiro-v98`.

## Critérios de aceite

- [x] A hidratação total inclui a farinha da ativação do levain no divisor.
- [x] O modal Sobre possui o checkbox "Considerar água e farinha da isca nos cálculos" com dica explicativa de 50% água / 50% farinha.
- [x] Ao marcar/desmarcar a opção, a hidratação e o resumo da massa são recalculados instantaneamente na tela.
- [x] O estado da opção é salvo em `localStorage` e persiste entre recarregamentos.
- [x] Todos os testes unitários (`npm test`) e de interface (`npm run test:ui`) passam.

## Como verificar

1. Abra o app e selecione o fermento Levain a 20% com proporção 1:2:2 (em 500 g de farinha: 100 g de levain = 20 g isca, 40 g água, 40 g farinha).
2. Sem marcar a opção de isca, confira que a hidratação total é `(325 + 40) / (500 + 40) * 100 = 67,6%` (em vez dos 73% antigos).
3. Abra o Sobre (ícone no topo) e marque "Considerar água e farinha da isca nos cálculos". Feche o Sobre e confira que a hidratação ajusta para `(325 + 50) / (500 + 50) * 100 = 68,2%`.
4. Recarregue a página e confirme que o checkbox permanece marcado.
5. Rode `npm test` e `npm run test:ui` para verificar a suíte completa automatizada.
