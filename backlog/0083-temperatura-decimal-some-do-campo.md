# 0083 — Temperatura com decimal some do campo

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-04
- **Status:** concluída
- **Arquivos:** `app.js`, `index.html`

## Contexto

O piso e o teto da sessão aceitam meio grau (`step="0.5"`) e a conta usa esse valor. Ao sair do campo, ou ao reabrir a telinha, `formatTempNumber` grava o quebrado com vírgula (`"24,5"`). O `input type="number"` rejeita a vírgula e o campo fica vazio. O relógio continua no valor antigo: 24,5–30 °C muda o pico, o rótulo do termômetro mostra `24,5–30`, e o piso reaparece em branco. Inteiros continuam visíveis. O mesmo formato entra ao trocar a calibração ativa.

O registro do teste não usa `formatTempNumber`. Lá, `22.5` permanece no campo.

## O que foi feito

O campo da sessão passa a receber o número com ponto (`24.5`), que o `input type="number"` aceita. O rótulo do termômetro continua com vírgula. O registro dos dois potes não usava esse formato e ficou como estava. `CACHE` subiu para `padeiro-v88`.

## Critérios de aceite

- [x] Digitar piso 24,5, sair do campo, e o piso continua 24,5
- [x] Fechar e abrir a telinha de novo mostra 24,5 e o teto que estava
- [x] O rótulo do termômetro e a hora usam essa faixa
- [x] Atalhos inteiros (24–26 e os demais) continuam preenchendo os dois campos
- [x] Trocar a calibração ativa não esvazia um extremo quebrado

## Como verificar

No ativador e no simulador, a 390 px e a 560 px: informar 24,5–30, sair dos campos, fechar, reabrir e ler o pico. Repetir com um atalho inteiro.

## Fora do escopo

Não muda a fórmula da hora. Não mexe nos campos de temperatura do registro dos dois potes, que já conservam o decimal.
