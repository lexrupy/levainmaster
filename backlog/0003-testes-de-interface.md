# 0003 — Testes de interface no navegador

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-01
- **Status:** proposta
- **Arquivos:** `tests/ui/*.spec.js`, `playwright.config.js`, `package.json`, `.gitignore`

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

- [ ] `npm run test:ui` roda os cenários nos dois tamanhos
- [ ] `node_modules/` e os relatórios do Playwright estão no `.gitignore`
- [ ] Nada em `vendor/`, `index.html` ou `ServiceWorker.js` depende do Playwright
- [ ] `AGENTS.md` explica como instalar e rodar

## Decisão em aberto

Este é o primeiro `node_modules` do projeto, ainda que só para desenvolvimento. A alternativa sem dependência seria um script em `node` que controla o Chrome pelo protocolo de depuração. Funciona, mas dá bem mais código para manter.
