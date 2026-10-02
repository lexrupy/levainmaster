# 0027 — Barra do topo fixa e compacta; cards com menos padding e cantos menores

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-01
- **Status:** concluída
- **Arquivos:** `index.html`, `app.css`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

No topo, o ícone e o nome estavam pequenos perto do botão Receitas, e sobrava espaço entre o topo e o primeiro card. Os cards tinham cantos muito arredondados e padding generoso. Ao rolar, o topo sumia.

## O que foi feito

- **Barra do topo fixa (`sticky`):** ícone, nome e Receitas ficam visíveis ao rolar. A barra ocupa a largura toda da coluna, cobre a área do relógio (`safe-area`) e tem fundo levemente translúcido com desfoque.
- **"Instalar o app" foi para o modal Sobre:** com ele na barra, o nome quebrava em duas linhas e a barra ficava com 71 px. Agora o nome cabe numa linha e a barra tem 51 px.
- **Proporção:** ícone de 34 px (antes 30) e nome em 1,05rem, negrito (antes 0,95rem).
- **Botões centralizados:** a margem que o Pico põe embaixo dos botões tirava o Receitas do centro vertical; foi zerada.
- **Cards:**
  - **principais:** cantos de 18 px (antes 24), padding de 14 px (antes 20/18) e 10 px entre eles;
  - **ingredientes:** cantos de 14 px (antes 18), padding de 10 px e 8 px entre eles;
  - **"+ Ingrediente":** cantos de 14 px.
- **Espaço até o primeiro card:** o card agora começa em 59 px do topo da página (antes 88).
- `CACHE` subiu para `padeiro-v36`.

## Critérios de aceite

- [x] Em 360, 390 e 560 px, a barra tem 51 px, o nome cabe numa linha e o Receitas fica centralizado
- [x] Rolando a página, a barra continua no topo
- [x] O primeiro card começa em 59 px (antes 88)
- [x] O card de ingredientes encolhe 32 px (de 477 para 445)
- [x] Sem rolagem horizontal

## Fora do escopo

O "Instalar o app" do Sobre só aparece quando o navegador oferece a instalação; não foi testado no headless.
