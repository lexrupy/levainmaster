# 0071 — Simulador de levain

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-02
- **Status:** concluída
- **Arquivos:** `index.html`, `app.js`, `app.css`, `calc.js`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

O modal de ativação reparte o levain da receita em gramas inteiras que fecham o peso. Por isso `1:20:20` e `1:25:25` em 100 g aparecem iguais. Faltava um lugar para experimentar a proporção com as gramas soltas, sem gravar na receita.

## O que foi feito

- **Botão Levain:** na barra do topo, à esquerda de Receitas. Abre o mesmo modal com o título "Simulador de levain".
- **Sem vínculo:** o total começa em 100 g e a proporção em `1:2:2`. Não mostra percentual da farinha e não altera `state` nem as receitas salvas. Fechar não grava.
- **Dois caminhos:** mudar o total ou a proporção recalcula isca, água e farinha, sem forçar a soma inteira. Digitar os três pesos soma o total e preenche a proporção personalizada (`2`, `50`, `50` vira `1:25:25`).
- O lápis da receita continua abrindo "Ativar o levain", com o percentual da farinha e as gramas inteiras de sempre.
- `CACHE` subiu para `padeiro-v82`.

## Critérios de aceite

- [x] O botão Levain abre o simulador sem a receita ter levain, e o título não fala em percentual da farinha
- [x] `1:25:25` com total 102 g mostra 2 g, 50 g e 50 g
- [x] Digitar 2, 50 e 50 preenche a proporção `1:25:25` e o total 102
- [x] Fechar o simulador deixa a receita da tela e a lista salva como estavam
- [x] O modal aberto pelo lápis continua ligado à receita

## Como verificar

Servir a pasta, abrir Levain no topo, mudar a proporção e os pesos. Conferir que a farinha da receita não muda. Com a receita em levain, o lápis ainda mostra os gramas da massa.
