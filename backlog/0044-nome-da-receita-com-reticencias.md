# 0044 — Nome da receita com reticências

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-02
- **Status:** concluída
- **Arquivos:** `index.html`, `app.css`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

O nome da receita entra na largura da coluna da farinha. Um nome longo aumentava essa coluna e empurrava a foto do miolo para a direita.

## O que foi feito

- O nome não participa da largura da coluna: ocupa só o espaço que farinha, legenda e botões já definem.
- O que passa dessa largura corta com reticências. O lápis continua visível.
- O toque longo ou o ponteiro mostra o nome inteiro. Na edição, o campo também fica dentro da coluna.
- `CACHE` subiu para `padeiro-v55`.

## Critérios de aceite

- [x] "Minha Receita" aparece inteiro, sem reticências, em 390 px e 560 px.
- [x] Um nome de cerca de 60 caracteres corta com reticências e não muda a posição nem a largura da foto.
- [x] Durante a edição, o campo não alarga o card nem cria rolagem horizontal.

## Como verificar

- Servir a pasta por HTTP, nomear a receita com um texto longo e comparar a foto com o nome curto em 390 px e 560 px.
- Abrir a edição e continuar digitando: a foto permanece no mesmo lugar.

## Fora do escopo

- Quebrar o nome em várias linhas.
