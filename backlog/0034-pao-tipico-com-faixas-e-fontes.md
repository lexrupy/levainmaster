# 0034 — "Típico de", modal do pão e limites revistos pelas fontes

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-01
- **Status:** concluída
- **Arquivos:** `calc.js`, `app.js`, `index.html`, `app.css`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

As faixas de hidratação de `BANDS` vieram no primeiro commit (`16722ba`) sem fonte registrada. Comparadas com fontes de panificação, os limites do meio para cima estavam baixos: um pão de fermentação natural a 75% aparecia como "Ciabatta", e uma ciabatta típica (80–90%) como "Focaccia". Além disso, os pães se sobrepõem (dá para fazer focaccia a 60%), então nenhum limite acerta sempre.

## O que foi feito

- **Limites revistos** para seguir as fontes:

| Pão | Antes | Agora |
|---|---|---|
| Pão sovado | até 57% | até 57% |
| Pão francês | até 62% | até 62% |
| Baguete | até 67% | até 68% |
| Pão de fermentação natural | até 72% | até 78% |
| Ciabatta | até 78% | até 85% |
| Focaccia | até 84% | até 95% |
| Focaccia de alta hidratação | acima de 84% | acima de 95% |

- **No card:** o pão aparece como "Típico de **<pão>**", com o nome clicável (sublinhado tracejado).
- **O modal do pão mostra:**
  - a faixa típica de hidratação (`BREAD_INFO`);
  - se a massa está dentro, abaixo ou acima dela;
  - uma explicação do pão e de suas variações;
  - uma nota de que as faixas se sobrepõem;
  - a tabela de todos os pães, com a faixa típica e a faixa em que o app usa cada nome. Tocar num pão da tabela mostra os detalhes dele.
- **Pão enriquecido** (Brioche, Pão de leite etc.): o modal explica que o nome vem dos ingredientes, sem faixa de hidratação.
- **Faixas aproximadas:** as do pão sovado e do pão francês não têm fonte com números e ficam marcadas com asterisco.
- A textura e a imagem também mudam com os limites novos.
- `CACHE` subiu para `padeiro-v45`.

## Faixas típicas usadas e fontes

| Pão | Faixa típica | Base |
|---|---|---|
| Pão sovado | 50–57% (aprox.) | massa firme, como o bagel (52–58%) |
| Pão francês | 58–63% (aprox.) | "pão de baixa hidratação" |
| Baguete | 62–68% | tabelas de hidratação |
| Pão de fermentação natural | 70–82% | tabelas de hidratação |
| Ciabatta | 80–90% | tabelas de hidratação |
| Focaccia | 75–88% | tabelas de hidratação; genovese tradicional 55–60%, modernas 70–80%, super-hidratadas 110–120% |
| Focaccia de alta hidratação | 90–120% | focaccias super-hidratadas |

- [The Fresh Loaf: typical hydration range](https://www.thefreshloaf.com/comment/533186)
- [Wild Yeast: baker's percentage](https://wildyeastblog.com/bakers-percentage-2)
- [Miss Vickie: dough hydration calculator (tabela por tipo de pão)](https://missvickie.com/dough-hydration-calculator/)
- [Italian Recipe Book: traditional focaccia (genovese ~55–60%)](https://italianrecipebook.com/traditional-focaccia)
- [GialloZafferano: high hydration focaccia](https://www.giallozafferano.com/recipes/high-hydration-focaccia.html)
- [Pizzamaking.com: focaccia de 55–65% a 110–120%](https://www.pizzamaking.com/forum/index.php?msg=662338)
- [Viva: como fazer pão francês em casa ("pão de baixa hidratação")](https://viva.com.br/estilo-de-vida/como-fazer-pao-frances-em-casa-confira-dicas-e-receita-de-chef.html)

## Critérios de aceite

- [x] 75% → "Típico de Pão de fermentação natural"; 82% → Ciabatta; 90% → Focaccia; 100% → Focaccia de alta hidratação
- [x] Em 360 px, "Típico de <pão>" cabe nas duas linhas reservadas, inclusive com "Focaccia de alta hidratação"
- [x] O nome abre o modal com "Hidratação típica: 70% a 82%" e "Sua massa está com 75%, dentro da faixa típica."
- [x] Na tabela, tocar em Focaccia mostra a faixa de 75% a 88% e destaca a linha
- [x] Com ovos a 20%, "Típico de Brioche" abre a explicação de pão enriquecido

## Fora do escopo

- Uma fonte com números para pão sovado e pão francês.
