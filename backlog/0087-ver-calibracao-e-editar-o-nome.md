# 0087 — Ver a calibração e editar o nome

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-04
- **Status:** concluída
- **Arquivos:** `index.html`, `app.js`, `app.css`, `ServiceWorker.js`, `AGENTS.md`, `tests/ui/run.mjs`

## Contexto

Depois de gravar o teste dos dois potes, o Sobre só mostrava o nome e o botão de apagar. Os pesos, as horas e a temperatura ficavam escondidos. O nome também não podia ser corrigido. O link «Como fazer o teste» estava no Sobre e de novo dentro do registro.

## O que foi feito

Cada calibração ganhou «Ver». O modal mostra a temperatura dos potes, a hora da mistura, os pesos e o pico de cada pote. O único campo editável é o nome, com no máximo 40 caracteres. Nome vazio não grava. Fechar sem «Salvar nome» descarta o que foi digitado. Os outros valores não mudam.

O registro avisa, junto do botão de gravar, que pesos, horas e temperatura não poderão ser editados depois. O link do passo a passo saiu do Sobre e ficou no registro e na telinha da temperatura. `CACHE` subiu para `padeiro-v95`.

## Critérios de aceite

- [x] Ver mostra os pesos, as horas e a temperatura gravados
- [x] Salvar nome troca só o nome; fechar sem salvar conserva o anterior; nome vazio não grava
- [x] O registro informa que o restante não volta a ser editado
- [x] O Sobre não tem mais o link «Como fazer o teste»; o registro tem
- [x] Em 390 px e em 560 px a tela não ganha rolagem horizontal

## Como verificar

Servir a pasta. No Sobre, registrar um par e abrir Ver. Trocar o nome, fechar sem salvar e salvar de verdade. Conferir que as horas continuam as mesmas. Repetir em 390 px e em 560 px. `npm run test:ui` cobre o mesmo caminho.
