# 0041 — Nome da receita na tela

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-02
- **Status:** em andamento
- **Arquivos:** `calc.js`, `app.js`, `index.html`, `app.css`, `ServiceWorker.js`

## Contexto

Já é possível salvar receitas com um nome e carregar uma receita salva. A tela atual ainda não tem um nome próprio, então o modal de salvar começa vazio e o card compartilhado usa um título genérico.

## O que foi feito

- Adicionado “Minha Receita” no espaço acima dos controles de farinha, dentro da coluna da farinha, com um lápis indicando que o texto pode ser editado ao tocar.
- Ao sair da edição sem texto, o nome volta para “Minha Receita”.
- O modal de salvar usa esse nome como padrão e continua permitindo alterá-lo. O nome confirmado passa a ser o nome atual da tela e fica junto da receita salva.
- Ao abrir uma receita salva, o nome dela volta para o campo da tela.
- O card de compartilhamento usa o nome atual, começando por “Minha Receita”.
- `CACHE` permanece em `padeiro-v54`, versão de publicação das mudanças pendentes do card compartilhável e do nome.

## Critérios de aceite

- [x] “Minha Receita” aparece no topo da coluna da farinha e o toque no nome abre a edição, com até 80 caracteres.
- [x] Ao salvar, o modal já contém o nome da tela e permite editá-lo.
- [x] O nome escolhido ao salvar é preservado no estado atual e na receita salva.
- [x] Abrir uma receita salva restaura seu nome na tela.
- [x] O card compartilhável exibe o nome atual em vez do título genérico.
- [ ] Conferir visualmente em navegador a 390 px e 560 px.

## Como verificar

- Tocar em “Minha Receita”, alterar o nome e tocar fora; conferir que o texto volta à exibição normal.
- Tocar em “Salvar receita” e conferir que o nome veio preenchido; editar antes de salvar e confirmar que o novo nome fica na tela e na lista.
- Abrir a receita salva e conferir o nome no campo; gerar o card e conferir o título.
- Conferir o layout em larguras de aproximadamente 390 px e 560 px.

## Fora do escopo

- Renomear diretamente uma receita já salva na lista. Para alterar o nome, abrir a receita e salvá-la novamente.
