# 0019 — Ícone no topo, modal Sobre e "Verificar atualizações"

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-01
- **Status:** concluída
- **Arquivos:** `index.html`, `app.js`, `app.css`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

Com o app funcionando offline (0018), o usuário não tinha como saber que versão estava usando nem como buscar uma versão nova.

## O que foi feito

- **Topo:** o ícone do app fica ao lado do nome; o conjunto é um botão que abre o modal **Sobre**.
- **O modal mostra:**
  - a versão atual, tirada do nome do cache do service worker (`padeiro-v27` → "Versão 27");
  - se o app está disponível offline e se os dados estão protegidos (`storage.persisted()`);
  - sem proteção, uma explicação curta.
- **Verificar atualizações:**
  - sem internet, avisa e mantém a versão atual, que funciona offline;
  - com internet, chama `registration.update()`;
  - se houver versão nova, espera instalar e ativar, mostra "Versão N instalada. Recarregue para usar." e o botão **Recarregar agora**;
  - se não houver, pede ao service worker (mensagem `refresh`) para baixar de novo todos os arquivos com `cache: "reload"`, ou seja, força a busca online, e confirma;
  - se o servidor não responder, avisa e mantém a versão atual.
- **Service worker:** responde às mensagens `version` e `refresh` por `MessageChannel`.
- **Nome do app:** quando não cabe numa linha (com os botões Receitas e Instalar em 390 px), quebra em duas, alinhado à esquerda.
- `CACHE` subiu para `padeiro-v27`.

## Critérios de aceite

Testado no Chrome headless servindo uma cópia do app:

- [x] Clicar no ícone abre o Sobre com "Versão 27" e "Disponível offline: Sim"
- [x] Sem versão nova: "Você já está na versão mais recente (27). Arquivos conferidos com o servidor."
- [x] Publicando `padeiro-v28` na cópia: "Versão 28 instalada. Recarregue para usar." e o botão Recarregar
- [x] Depois de recarregar: "Versão 28", e só o cache `padeiro-v28` fica
- [x] Com o servidor desligado: "Não foi possível falar com o servidor. Você continua com a versão 28."

## Como publicar uma versão

Subir o `CACHE` em `ServiceWorker.js` e publicar os arquivos. Quem usa o app recebe a versão nova sozinho, na próxima visita com internet, ou na hora, pelo Verificar atualizações.
