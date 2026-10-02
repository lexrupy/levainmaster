# 0033 — Mais proporções de levain: líquido, 1:20:20 e firmes de lievito madre

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-01
- **Status:** concluída
- **Arquivos:** `calc.js`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

As nove proporções cobriam o uso comum a 100% de hidratação, mas faltavam os extremos: levain mais líquido que 100%, uma alimentação maior que 1:10:10 e os levains firmes de estilo italiano (lievito madre, a 45–50%).

## O que foi feito

Cinco proporções novas (ordem do app: isca : água : farinha). O seletor passou a ter três grupos:

| Grupo | Proporções |
|---|---|
| Mais líquidos | **1:5:4** (125%) |
| Hidratação 100% | 2:1:1, 1:1:1, 1:2:2, 1:3:3, 1:4:4, 1:5:5, 1:10:10, **1:20:20** |
| Mais firmes | 2:4:5 (80%), **1:4:5** (80%), 1:2:3 (67%), **1:1:2** (50%), **1:5:10** (50%) |

- **1:5:4:** levain líquido do Hamelman, que costuma montar o levain a 125%.
- **1:20:20:** fermentação muito longa ou dias quentes.
- **1:4:5:** entre o 1:4:4 e o 2:4:5, mais firme e com menos isca.
- **1:1:2:** refresco diário do lievito madre (100 g de madre, 100 g de farinha, 50 g de água).
- **1:5:10:** lievito madre para fermentação longa.

Nas fontes, as proporções firmes costumam vir na ordem isca : farinha : água. Aqui todas foram convertidas para a ordem do app.

**Tempos de pico:** a faixa de alimentação acima de 10× ganhou um tempo próprio. As duas faixas longas viraram intervalos curtos, para caber ao lado da textura em 360 px:

| Alimentação | Antes | Agora |
|---|---|---|
| de 5× a 10× | 12 h ou mais | 12 a 16 h |
| acima de 10× | (não havia) | 16 a 24 h |

`CACHE` subiu para `padeiro-v44`.

## Perfis das novas

| Proporção | Pico | Sabor | Textura |
|---|---|---|---|
| 1:5:4 | 8 a 12 h | Bem láctico | Líquida |
| 1:20:20 | 16 a 24 h | Bem láctico | Cremosa |
| 1:4:5 | 12 a 16 h | Láctico | Pastosa |
| 1:1:2 | 6 a 8 h | Bem acético | Firme |
| 1:5:10 | 16 a 24 h | Acético | Firme |

## Critérios de aceite

- [x] O seletor mostra os três grupos na ordem acima
- [x] Cada proporção nova preenche as partes, e digitar as partes seleciona o preset
- [x] Com 150 g de levain, 1:5:4 divide em 15 / 75 / 60 g a 125%, e 1:1:2 em 37 / 38 / 75 g a 50%
- [x] Em 360 px, a textura cabe numa linha em todas as proporções novas

## Fontes

- [The Fresh Loaf: Hamelman 125% liquid levain](https://www.thefreshloaf.com/comment/479920)
- [The Fresh Loaf: levain build question](https://thefreshloaf.com/comment/434966)
- [Miss Vickie: stiff sourdough starter, proporções do lievito madre](https://missvickie.com/stiff-sourdough-starter-calculator/)
- [Katie Parla: lievito madre per pane carasau](https://www.cookbooks.katieparla.com/recipes/lievito-madre-per-pane-carasau)

## Fora do escopo

- Proporções com meio (1:1,5:3, 2:5:10): os campos aceitam só inteiros; dá para fazer no Personalizado.
- Lievito madre abaixo de 50% de hidratação.
