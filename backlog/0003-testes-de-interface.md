# 0003 — Testes de interface no navegador

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-01
- **Status:** concluída
- **Arquivos:** `tests/ui/chrome.mjs`, `tests/ui/run.mjs`, `package.json`, `AGENTS.md`

## Contexto

Boa parte das regras é de tela: o resumo ao lado da farinha, o seletor de fermento que restaura o anterior ao sair do levain, o campo da farinha que encolhe, o card que não pode ser `sticky`, a foto que muda com a faixa. Hoje isso só é conferido à mão em 390 px e 560 px.

O app usa Vue com template no DOM e não tem build. Testar componentes isolados não funciona bem aqui. O que funciona é abrir a página de verdade num navegador e usá-la como o usuário usa.

## Proposta

Playwright como dependência só de desenvolvimento. Ele não entra no app nem no cache da PWA.

- O Playwright sobe o `python3 -m http.server` sozinho (`webServer` na config)
- Usar o Chrome já instalado (`channel: "chrome"`) para não baixar navegadores
- Dois projetos de viewport: celular (390 px) e largura máxima (560 px)
- Cada teste começa com `localStorage` limpo
- Ler valores pelos `data-*` que já existem (`data-final-hyd`, `data-total`, `data-grams`, `data-levain-*`)

## O que foi feito

A decisão ficou no script em Node, sem Playwright e sem `node_modules`. `tests/ui/chrome.mjs` sobe o Chrome já instalado e fala com a página pelo protocolo de depuração. `tests/ui/run.mjs` (`npm run test:ui`) percorre os nove cenários em 390 px e em 560 px, com `localStorage` limpo, e também os casos das tarefas 0082, 0084, o card compartilhado e a 0085. O servidor em `http://127.0.0.1:8769` precisa estar no ar. A hidratação de 55% compara o número com folga de 0,05 e o texto visível `55%`, porque o atributo guarda o float cru (`55.00000000000001`) e a tela mostra uma casa. Nada em `vendor/`, `index.html` ou `ServiceWorker.js` importa esses arquivos. Não há `node_modules` para ignorar.

Primeiros cenários:

1. Receita inicial mostra 840 g e 65%
2. Mudar a farinha recalcula os gramas; ▲▼ somam e tiram 50 g; acima de 99.999 trava
3. Slider da água muda a hidratação total, a textura e a foto
4. Seco → fresco triplica o percentual; fresco → seco divide
5. Seco → Levain → Seco restaura o percentual anterior
6. Levain: presets preenchem L:A:F, digitar 1:2:2 seleciona o preset, o personalizado aparece
7. Adicionar Ovos soma água na hidratação; remover tira
8. O estado sobrevive a um recarregamento
9. Sem rolagem horizontal em 390 px; o card de cima não é `sticky`

Comparação de captura de tela (`toHaveScreenshot`) fica para depois. Ela quebra com qualquer ajuste de CSS e só vale quando o visual estabilizar.

## Critérios de aceite

- [x] `npm run test:ui` roda os nove cenários em 390 px e em 560 px
- [x] Não há Playwright nem `node_modules`; o `.gitignore` não precisou de pasta de relatório
- [x] Nada em `vendor/`, `index.html` ou `ServiceWorker.js` depende do executor
- [x] `AGENTS.md` explica como rodar, sem passo de instalação

## Como verificar

Com `python3 -m http.server 8769 --bind 127.0.0.1` no ar, `npm run test:ui`. A última linha é `UI OK`.

## Decisão

Sem dependência. O Chrome instalado é controlado por `tests/ui/chrome.mjs`. Comparação de captura de tela continua de fora.
