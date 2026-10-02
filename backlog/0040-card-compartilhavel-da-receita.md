# 0040 — Card compartilhável da receita

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-02
- **Status:** em andamento
- **Arquivos:** `index.html`, `app.js`, `app.css`, `ServiceWorker.js`

## Contexto

Compartilhar a receita que está na tela em um formato visual, com os dados completos que ajudam outra pessoa a reproduzi-la.

## O que foi feito

- Adicionado ao lado de “Salvar receita” um botão apenas com o ícone de compartilhamento.
- O botão gera uma imagem PNG vertical com o nome da receita atual (inicialmente “Minha Receita”), imagem do miolo, farinha, hidratação, peso da massa, textura, pão típico, ingredientes com percentuais e gramas, proporção, quantidades da alimentação, hidratação, textura, tempo de pico e perfil de acidez do levain, teor de água personalizado e composição da massa.
- O rodapé “Feito com Percentual do padeiro” fica em uma faixa própria abaixo da composição, com respiro para não encostar no conteúdo.
- Em navegadores que compartilham arquivos, abre o menu de compartilhamento do sistema. Nos demais, baixa o PNG para compartilhar manualmente.
- O status informa quando a imagem está sendo preparada, baixada, compartilhada ou quando o compartilhamento é cancelado.
- `CACHE` passou para `padeiro-v54`.

## Critérios de aceite

- [x] O botão de compartilhamento aparece só com o ícone, ao lado de “Salvar receita”, com nome acessível para leitor de tela.
- [x] O PNG contém os dados gerais, imagem do miolo e todos os ingredientes com percentual e gramas.
- [x] O botão compartilha o estado atual da tela, inclusive depois de abrir uma receita salva.
- [x] Quando há levain, o PNG informa proporção, gramas usados e da alimentação, hidratação, textura, tempo de pico e perfil de acidez.
- [x] O crédito do rodapé fica separado do quadro de composição e do restante do conteúdo.
- [x] O botão compartilha o arquivo quando suportado e oferece o download como alternativa.
- [ ] Conferir visualmente em navegador a 390 px e 560 px e validar a imagem exportada.

## Como verificar

- Com a página servida por HTTP, tocar no ícone ao lado de “Salvar receita” e confirmar a abertura do compartilhamento ou o download do PNG.
- Abrir uma receita salva em “Receitas” e compartilhar; conferir que o PNG contém a receita carregada.
- Abrir o PNG e conferir todos os ingredientes, percentuais, gramas, imagem do miolo, hidratação, textura, pão típico, peso e composição.
- Conferir o card principal em larguras de aproximadamente 390 px e 560 px.

## Fora do escopo

- Exportação em PDF ou geração de link público da receita.
