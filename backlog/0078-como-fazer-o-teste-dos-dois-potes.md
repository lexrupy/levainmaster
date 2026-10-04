# 0078 — Como fazer o teste dos dois potes

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-04
- **Status:** concluída
- **Arquivos:** `index.html`, `app.js`, `app.css`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

O registro da calibração pedia nome, pesos e horas, com avisos curtos em cada pote. Faltava explicar o que o teste mede e como conduzir os dois potes antes de preencher.

## O que foi feito

Um modal separado, «Como fazer o teste dos dois potes», descreve o que a calibração muda, os pesos sugeridos, a folga aceita, o passo a passo e os limites. Abre pelo Sobre, pelo registro e pela telinha da temperatura. Se o registro já está aberto, o botão de baixo volta a ele e conserva o que foi digitado. Nos outros casos, o mesmo botão abre o registro. Abrir de novo volta o texto ao topo. `CACHE` subiu para `padeiro-v86`.

## Critérios de aceite

- [x] O Sobre, o registro e a telinha da temperatura abrem o modal
- [x] O texto diz o que o teste mede, os dois potes (20+20+20 e 20+100+100, com 10+50+50 aceito), o pico quando a massa perde estrutura, o descarte se um pico passou, e que sabor e textura não mudam
- [x] Aberto por cima do registro, voltar conserva o nome já digitado
- [x] Aberto pelo Sobre, «Registrar o teste» abre o formulário vazio
- [x] O modal cabe em 390 px e em 560 px, com o texto legível e sem vazar na horizontal

## Como verificar

Servir a pasta e abrir no navegador. No Sobre, tocar «Como fazer o teste» e ler o modal. Fechar, tocar «Registrar o teste» e ver o formulário. No formulário, digitar um nome, abrir de novo o modal e voltar: o nome continua. No simulador, abrir o termômetro e o mesmo modal. Repetir a 390 px e a 560 px.

## Fora do escopo

Não muda a conta de `peakEstimate` nem o que o formulário exige para gravar. Não reescreve `teorias do levain.md`.
