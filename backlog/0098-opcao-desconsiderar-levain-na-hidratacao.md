# 0098 — Opção para desconsiderar o levain na hidratação total

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-05
- **Status:** concluída
- **Arquivos:** `calc.js`, `app.js`, `index.html`, `ServiceWorker.js`, `tests/calc.test.js`, `tests/service-worker.test.js`, `tests/ui/run.mjs`, `AGENTS.md`

## Contexto

Embora o modelo padrão decomponha o levain em farinha e água adicionadas à bacia, muitos padeiros preferem o modelo de bancada/receita direta, onde a hidratação nominal da receita corresponde exclusivamente aos líquidos adicionados diretamente sobre a farinha base, tratando o levain apenas como um ingrediente por peso. Faltava uma opção para permitir desligar a contribuição do levain na hidratação calculada.

## O que foi feito

1. **Parâmetro `includeLevain` (`calc.js`):** A função `compute()` passou a aceitar `includeLevain` (padrão `true`). Quando `false`, nem a água nem a farinha da alimentação (e nem da isca) entram na hidratação total da massa. O levain continua pesando normalmente no peso total da massa final.
2. **Configuração global (`app.js`, `index.html`):** Adicionado o checkbox "Considerar levain na hidratação da massa" no modal de Configurações, marcado por padrão para manter o comportamento atual. O checkbox da isca só é exibido se o levain estiver incluído na hidratação.
3. **Persistência reativa:** O estado de `includeLevain` é gravado na chave `percentual-padeiro-config-v1` no `localStorage`, recarrega automaticamente com o app e atualiza instantaneamente a tela e a imagem do card compartilhado.
4. **Dica dinâmica no modal do levain:** Atualizada a mensagem informativa para indicar quando o levain está configurado para não afetar o percentual de hidratação total.
5. **Testes e Cache:** Adicionados testes unitários em `tests/calc.test.js` e automação de interface em `tests/ui/run.mjs` testando a desativação da opção e a persistência após recarregamento. `CACHE` subiu para `padeiro-v103`.

## Critérios de aceite

- [x] O checkbox "Considerar levain na hidratação da massa" vem marcado como padrão.
- [x] Desmarcar a opção faz a hidratação total considerar apenas a água direta da receita (ex.: 65% em 500 g com 325 g de água), sem somar água nem farinha do levain.
- [x] O peso total da massa continua somando os gramas do levain.
- [x] O estado da opção persiste no `localStorage` após recarregar.
- [x] Todos os testes unitários (`npm test`) e de interface (`npm run test:ui`) passam.

## Como verificar

1. Em uma receita com 500 g de farinha, 65% de água e 20% de levain (1:2:2), a hidratação calculada com levain é 67,6%.
2. Abra Sobre → Configurações e desmarque "Considerar levain na hidratação da massa".
3. Feche o modal e verifique que a hidratação total passa a exibir exatamente 65% (a água direta). O peso total da massa continua 945 g (com levain).
4. Abra o modal do levain e veja o aviso: "O levain está configurado para não entrar no cálculo da hidratação total da massa".
5. Recarregue a página e confirme que a opção permanece desmarcada e a hidratação continua em 65%.
6. Rode `npm test` e `npm run test:ui`.
