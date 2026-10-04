# 0083 — Temperatura com decimal some do campo

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-04
- **Status:** proposta
- **Arquivos:** `app.js`, `index.html`

## Contexto

O piso e o teto da sessão aceitam meio grau (`step="0.5"`) e a conta usa esse valor. Ao sair do campo, ou ao reabrir a telinha, `formatTempNumber` grava o quebrado com vírgula (`"24,5"`). O `input type="number"` rejeita a vírgula e o campo fica vazio. O relógio continua no valor antigo: 24,5–30 °C muda o pico, o rótulo do termômetro mostra `24,5–30`, e o piso reaparece em branco. Inteiros continuam visíveis. O mesmo formato entra ao trocar a calibração ativa.

O registro do teste não usa `formatTempNumber`. Lá, `22.5` permanece no campo.

## Proposta

O piso e o teto da sessão continuam visíveis depois do blur e ao reabrir a telinha, inclusive com meio grau. A conta segue o número que está na tela.

## Critérios de aceite

- [ ] Digitar piso 24,5, sair do campo, e o piso continua 24,5
- [ ] Fechar e abrir a telinha de novo mostra 24,5 e o teto que estava
- [ ] O rótulo do termômetro e a hora usam essa faixa
- [ ] Atalhos inteiros (24–26 e os demais) continuam preenchendo os dois campos
- [ ] Trocar a calibração ativa não esvazia um extremo quebrado

## Como verificar

No ativador e no simulador, a 390 px e a 560 px: informar 24,5–30, sair dos campos, fechar, reabrir e ler o pico. Repetir com um atalho inteiro.

## Fora do escopo

Não muda a fórmula da hora. Não mexe nos campos de temperatura do registro dos dois potes, que já conservam o decimal.
