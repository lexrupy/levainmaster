# 0002 — Testes unitários das contas

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-01
- **Status:** proposta
- **Arquivos:** `tests/calc.test.js`, `package.json`

## Contexto

Não há suíte de testes. `calc.js` concentra as regras (hidratação, levain, conversão de fermento, faixas) e já exporta `module.exports`, então dá para testar sem navegador. A tarefa 0001 só foi conferida com um `node -e` avulso.

## Proposta

Usar o executor que já vem no Node (`node:test` e `node:assert`). Ele não instala nada e combina com a regra do projeto de não depender de nada de fora.

- `tests/calc.test.js` cobrindo:
  - receita inicial: 840 g, 65%, faixa Baguete
  - hidratação com água direta, ingredientes com teor de água e água da alimentação do levain
  - farinha da alimentação e água da isca fora da conta
  - pós e farinhas extras com água 0
  - `convertYeast` seco ↔ fresco e o arredondamento a 2 casas
  - `splitLevain` / divisão em gramas: soma fecha, nada negativo (caso da 0001)
  - limites de cada faixa em `BANDS` (57, 62, 67…)
  - `num` com vírgula, vazio e texto
  - `matchRatio` com presets e personalizado
- `package.json` mínimo, só com `"test": "node --test"`. Sem dependências.

## Critérios de aceite

- [ ] `npm test` (ou `node --test`) roda sem instalar nada
- [ ] Cada regra da seção "Contas" do `AGENTS.md` tem pelo menos um teste
- [ ] O caso da 0001 tem teste próprio
- [ ] `AGENTS.md` explica como rodar os testes

## Fora do escopo

Testes de tela (tarefa 0003).
