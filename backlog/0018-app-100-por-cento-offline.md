# 0018 — App 100% offline e protegido contra limpeza automática

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-01
- **Status:** concluída
- **Arquivos:** `ServiceWorker.js`, `index.html`, `AGENTS.md`

## Contexto

Depois de instalado ou de entrar no cache do service worker, o app tem que funcionar sem internet e só sair se o usuário remover. Havia três falhas:

1. **Instalação com arquivo velho:** a instalação baixava os arquivos passando pelo cache HTTP e podia gravar uma versão antiga no cache novo.
2. **Sinal fraco trava a abertura:** a busca na rede não tinha limite de tempo. Com sinal fraco, que não chega a cair, o app ficava esperando em vez de abrir pelo cache.
3. **Versões misturadas:** a busca normal também passava pelo cache HTTP e podia misturar `index.html` e `app.js` de versões diferentes (tarefa 0014).

Além disso, sem armazenamento persistente o navegador pode apagar o cache e o `localStorage`, inclusive as receitas salvas, quando o aparelho fica sem espaço.

## O que foi feito

- **Instalação:** baixa os arquivos com `cache: "reload"`. A versão nova só entra se todos baixarem; a anterior só é apagada depois disso. Sem internet, a anterior continua.
- **Busca:**
  - vai à rede com `cache: "no-cache"`, revalidando com o servidor;
  - sem rede, com erro ou depois de 3 s (`NETWORK_TIMEOUT`), responde pelo cache;
  - a busca continua em segundo plano (`event.waitUntil`) e atualiza o cache quando chega;
  - qualquer URL de navegação do app sem cache próprio cai no `index.html`.
- **Armazenamento:** a página pede `navigator.storage.persist()`, para o navegador só apagar os dados do app se o usuário mandar.
- **Cobertura:** conferido que todo arquivo que a página carrega está em `FILES` e que nada vem de fora.
- `CACHE` subiu para `padeiro-v26`.

## Critérios de aceite

Testado no Chrome headless com um servidor de verdade, desligado ou lento de propósito:

- [x] Na primeira visita, o cache `padeiro-v26` fica com os 21 arquivos
- [x] Com o servidor desligado, o app abre em cerca de 110 ms: monta a tela, aplica CSS e fonte e carrega as 7 imagens do miolo
- [x] Offline, o modal do levain abre e a receita salva antes continua na lista
- [x] Offline, `./?x=1` e `./index.html` também abrem o app
- [x] Com o servidor levando 10 s por resposta, o app abre pelo cache em cerca de 3,1 s

## Fora do escopo

- O Chrome só concede o armazenamento persistente a apps instalados ou muito usados; no teste headless, `persisted()` ficou `false`. No celular, com o app instalado, a tendência é aprovar.
