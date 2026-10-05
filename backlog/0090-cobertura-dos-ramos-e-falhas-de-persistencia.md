# 0090 — Cobrir ramos e falhas de persistência

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-05
- **Status:** concluída
- **Arquivos:** `tests/calc.test.js`, `tests/service-worker.test.js`, `tests/ui/run.mjs`, `package.json`, `AGENTS.md`

## Contexto

A suíte exercitava os cálculos mais comuns e vários fluxos da interface, mas faltavam ramos de cálculos e testes para os dois riscos corrigidos nas tarefas 0088 e 0089.

## O que foi feito

Foram acrescentados casos para proporções inválidas e extensas, perfis de levain, pães enriquecidos, levain como segundo fermento, arredondamento dos pesos, limites de aceitação dos potes e estimativas calibradas. Um teste isolado executa a ativação do service worker com Cache Storage simulada e confirma que só versões antigas do próprio app são removidas. A suíte de interface agora simula erros de quota para a receita atual, salvar/apagar receitas e calibrações, incluindo a recuperação após uma gravação bem-sucedida. `npm run test:coverage` gera o relatório nativo do Node.

## Critérios de aceite

- [x] `npm test` passa com testes de cálculo e de ativação do service worker.
- [x] `npm run test:ui` passa com os fluxos existentes e as falhas simuladas de persistência.
- [x] O relatório de cobertura aponta pelo menos 99% de linhas em `calc.js`.
- [x] Nenhuma dependência externa nova é necessária.

## Como verificar

Rode `npm test`, `npm run test:ui` com o servidor em `127.0.0.1:8769` e `npm run test:coverage`.

## Fora do escopo

Cobertura de cada função privada de `app.js` e de ramos defensivos inalcançáveis com entradas válidas.
