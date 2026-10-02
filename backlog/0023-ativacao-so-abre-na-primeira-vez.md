# 0023 — A ativação do levain só abre sozinha na primeira vez

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-01
- **Status:** concluída
- **Arquivos:** `app.js`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

Trocar de levain para fermento seco e voltar para levain abria de novo o modal de ativação, mesmo com o levain já configurado. Só faz sentido abrir sozinho quando o levain ainda não foi configurado nessa receita.

## O que foi feito

- **Abre sozinho:** só na primeira vez que a receita usa levain. Isso vale quando a linha do fermento ainda não tem `levainPct`, o percentual que ela guarda ao sair do levain.
- **Voltando ao levain:** se ele já foi configurado, o modal não abre, e o percentual e a proporção voltam como estavam.
- **Lápis:** continua abrindo a ativação a qualquer momento.
- `CACHE` subiu para `padeiro-v32`.

## Critérios de aceite

- [x] Receita nova: escolher Levain abre a ativação
- [x] Levain → Seco → Levain: não abre
- [x] Levain → Fresco → Levain: não abre
- [x] O lápis abre a ativação
- [x] Uma receita salva com fermento seco, depois de usar levain 25% em 1:3:4, volta com 25% e 1:3:4 ao trocar para Levain, e não abre o modal
