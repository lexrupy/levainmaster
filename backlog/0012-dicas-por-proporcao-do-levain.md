# 0012 — Dicas por proporção do levain

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-01
- **Status:** concluída
- **Arquivos:** `calc.js`, `index.html`, `app.js`, `app.css`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

O modal de ativação mostrava a divisão em gramas e a hidratação, mas não dizia o que esperar de cada proporção: em quanto tempo o levain fica pronto, que textura tem e se o pão vai sair mais suave (láctico) ou mais azedo (acético).

## O que foi feito

`levainProfile(L, A, F)`, em `calc.js`, calcula o perfil a partir de duas coisas: a hidratação (água ÷ farinha da alimentação) e quantas vezes a farinha da alimentação supera a isca (F ÷ L). Por ser uma conta, vale também para o personalizado.

- **Textura**, pela hidratação: líquida (acima de 115%), cremosa (85–115%), pastosa (70–85%), massa firme (abaixo de 70%).
- **Pico a 24–26 °C**, pela alimentação: de 2 a 3 h (2:1:1) até 12 h ou mais (1:10:10). O levain firme fica um degrau mais lento.
- **Sabor**, numa escala de 5, de "Bem láctico" a "Bem acético". A base vem da hidratação, e a alimentação ajusta: até 1× sobe um degrau (mais acidez da isca), 4× ou mais desce um.
- **Dicas** de uso para a faixa de alimentação, de levain firme e de levain muito líquido, mais uma linha fixa sobre a temperatura.
- O perfil some quando a isca ou a farinha estão em 0.
- `CACHE` subiu para `padeiro-v21`.

| Proporção | Pico | Sabor | Textura |
|---|---|---|---|
| 2:1:1 | 2 a 3 h | Equilibrado | Cremosa |
| 1:1:1 | 3 a 4 h | Equilibrado | Cremosa |
| 1:2:2 | 4 a 6 h | Láctico | Cremosa |
| 1:3:3 | 6 a 8 h | Láctico | Cremosa |
| 1:4:4 | 8 a 12 h | Bem láctico | Cremosa |
| 1:5:5 | 8 a 12 h | Bem láctico | Cremosa |
| 1:10:10 | 12 h ou mais | Bem láctico | Cremosa |
| 2:4:5 | 8 a 12 h | Equilibrado | Pastosa |
| 1:2:3 | 8 a 12 h | Acético | Massa firme |

## Base

- Levain líquido favorece as bactérias lácticas (sabor mais suave, "de iogurte"); levain firme favorece o ácido acético (mais azedo) e dá mais força à massa. O frio também puxa para o acético. ([The Fresh Loaf: stiff vs. liquid](https://www.thefreshloaf.com/comment/58320))
- Alimentação pequena (1:1:1) fica pronta em 3–4 h e concentra a acidez da isca, o que pode enfraquecer o glúten; alimentação grande (1:5:5, 1:10:10) leva 8–12 h, dá um levain mais suave e com mais fermento. 2:1:1 serve para reanimar uma isca fraca. ([The Fresh Loaf: 1:10:10 vs. 1:1:1](https://www.thefreshloaf.com/node/64197), [You Knead Sourdough: feeding ratios](https://www.youkneadsourdough.com.au/blogs/guides/sourdough-starter-feeding-ratios))

## Critérios de aceite

- [x] O modal mostra textura, pico, escala de sabor e dicas para a proporção escolhida
- [x] 1:5:5 → cremosa, 8 a 12 h, "Bem láctico", 1º segmento da escala
- [x] 1:2:3 → massa firme, 8 a 12 h, "Acético", 4º segmento
- [x] 2:1:1 → 2 a 3 h, com a dica de reanimar a isca
- [x] Mudar as partes no personalizado atualiza o perfil; com a isca vazia, o perfil some
- [x] Cabe no modal em 390 px

## Fora do escopo

- Os tempos são aproximados. A temperatura não é um campo do app.
