# 0004 — Editar gramas e percentual ao clicar; campo vazio vale 0

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-01
- **Status:** concluída
- **Arquivos:** `app.js`, `index.html`, `app.css`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

Os gramas de cada ingrediente eram só leitura: para chegar a 7 g de sal era preciso fazer a conta do percentual de cabeça. O percentual ficava sempre como campo aberto, o que poluía a lista.

Os campos numéricos também tratavam o vazio de jeitos diferentes. Com a água vazia, o slider ia para o meio (70%) enquanto a conta usava 0. As partes do levain escreviam "0" no campo no meio da digitação. A farinha vazia voltava para 500 g ao recarregar.

## O que foi feito

- Percentual e gramas de cada ingrediente aparecem como texto, com um sublinhado tracejado. Ao clicar, viram campo com o valor selecionado.
- Digitar gramas recalcula o percentual: gramas ÷ farinha × 100. O percentual é guardado sem arredondar, para os gramas ficarem iguais ao digitado. Na tela ele aparece com até 2 casas.
- Enter ou sair do campo confirma. Esc desfaz.
- Com a farinha em 0, os gramas não abrem para edição, porque não há percentual a calcular.
- Vale para todos os ingredientes, inclusive água (o slider acompanha) e levain (a divisão L:A:F acompanha).
- Campo vazio vale 0 na conta enquanto se digita, sem escrever "0" no campo. Ao sair, o campo mostra 0. Isso vale para farinha, percentual, gramas, teor de água do personalizado e partes L:A:F.
- Ao carregar o estado salvo, os números passam por `num`. A farinha só volta para 500 g se o valor salvo for inválido; 0 continua 0.
- `CACHE` subiu para `padeiro-v12`.

## Critérios de aceite

- [x] Sem clique, nenhum campo de percentual ou gramas aparece na lista
- [x] Receita inicial: clicar em 325 g da água, digitar 350 → água 70%, hidratação total 70%, slider em 70
- [x] Sal com 500 g de farinha: digitar 7 g e Enter → 1,4%
- [x] Esc devolve o valor anterior
- [x] Apagar o percentual do fermento e sair → 0%, 0 g, "Equivale a 0% de fresco"
- [x] Apagar a farinha: a conta vai a 0 na hora; ao sair, o campo mostra 0 e os gramas ficam desabilitados
- [x] Apagar uma parte do levain: o campo fica vazio enquanto se digita, a proporção vira Personalizado e, ao sair, aparece 0
- [x] Levain: digitar 150 g com 1000 g de farinha → 15%, divisão 30 / 60 / 60 com 1:2:2
- [x] O estado sobrevive a um recarregamento
- [x] Sem rolagem horizontal em 390 px e 560 px

## Como verificar

Sirva a pasta (`python3 -m http.server 8769 --bind 127.0.0.1`) e repita os critérios em 390 px e 560 px. Nesta tarefa eles foram conferidos no Chrome headless por um script avulso via protocolo de depuração, fora do repositório (ver 0003).

## Fora do escopo

- O campo da farinha continua sempre aberto; só os ingredientes ganharam o clique.
- Os gramas seguem inteiros na tela. Dá para digitar 2,5 g, mas o texto mostra 3 g; o percentual guarda o valor exato.
