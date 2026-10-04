# 0002 — Testes unitários das contas

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-01
- **Status:** concluída
- **Arquivos:** `tests/calc.test.js`, `package.json`, `AGENTS.md`

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
- `package.json` mínimo, com `"test": "node --test"` e `"test:ui"` para a tarefa 0003. Sem dependências.

## O que foi feito

`tests/calc.test.js` cobre a receita inicial, os gramas, a soma inteira da lista, a hidratação (água direta, teor e alimentação do levain), a farinha da alimentação e a água da isca de fora, pós e farinhas extras, o sal da margarina, `convertYeast`, o caso da 0001, os limites de `BANDS`, `num`, `matchRatio`, ingrediente nulo, o piso de 0,5 h do pico calibrado e o peso aceito no pote. `npm test` rodou 15 testes, todos passando. O `CACHE` não muda: nenhum arquivo da página foi alterado.

## Critérios de aceite

- [x] `npm test` (ou `node --test`) roda sem instalar nada
- [x] Cada regra da lista desta tarefa tem pelo menos um teste
- [x] O caso da 0001 tem teste próprio
- [x] `AGENTS.md` explica como rodar os testes

## Como verificar

`npm test` na raiz, sem instalar pacote. A saída lista 15 testes e zero falhas.

## Fora do escopo

Testes de tela (tarefa 0003).
