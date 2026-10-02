# 0068 — Fermentação ao lado da foto no card 4

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-02
- **Status:** concluída
- **Arquivos:** `app.js`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

No card 4, ao lado da foto só havia textura e pão típico. A fermentação da receita não aparecia nesse bloco.

## O que foi feito

- A coluna ficou em três pares, nesta ordem: FERMENTAÇÃO, TEXTURA e PÃO TÍPICO.
- O valor da fermentação é Levain, Seco, Fresco ou Misto, quando há mais de um tipo.
- A foto subiu para 300 px de altura. Os três pares usam fonte maior, ficam mais juntos e o bloco está no centro vertical da foto.
- O nome mais largo, "Pão de fermentação natural", cabe numa linha. "Focaccia de alta hidratação" e "Pão enriquecido com ovos" também.
- `CACHE` subiu para `padeiro-v79`.

## Critérios de aceite

- [x] A ordem é fermentação, textura e pão típico.
- [x] Seco, fresco, levain e misto aparecem conforme a receita.
- [x] O bloco de texto acompanha a altura da foto.
- [x] Os nomes longos não quebram a linha.

## Como verificar

- Servir por HTTP e abrir `/?card4`. Trocar o fermento e, com levain, acrescentar fermento seco para ver "Misto". Subir a água para cerca de 75% para ver "Pão de fermentação natural". Recarregar uma vez se o service worker antigo ainda estiver no controle.
