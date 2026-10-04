# Percentual do padeiro

Calculadora de percentual do padeiro em português, instalável como PWA no Android. A referência visual é o Flourwise, mas o app não é uma cópia e não traz presets de tipo de pão (ciabatta, pizza, brioche). A faixa de hidratação só informa a textura e um pão típico, num lugar só.

Responda ao Alexandre em português.

## Licença

© 2026 Alexandre da Silva, sob a GNU LGPL 3.0 ou posterior: texto em `COPYING.LESSER`, que remete à GPL 3.0 em `COPYING`. Cada arquivo do projeto começa com `SPDX-License-Identifier: LGPL-3.0-or-later`. As dependências em `vendor/` mantêm as licenças delas: Vue e Pico CSS (MIT, aviso no topo de cada arquivo) e a fonte Outfit (SIL OFL 1.1, texto em `vendor/OFL-Outfit.txt`, que precisa acompanhar a fonte). O modal Sobre mostra autoria, licença e créditos.

## Arquivos

Não há bundler nem CDN. Tudo que a página carrega está no repositório.

- `index.html` — template Vue no DOM
- `app.js` — estado, localStorage, instalação
- `calc.js` — contas. Expõe `window.Padeiro` e `module.exports`
- `app.css` — visual por cima do Pico
- `ServiceWorker.js` — cache da PWA. O nome do arquivo é esse
- `manifest.webmanifest`, `icons/`, `img/`, `vendor/`

Os ícones em `icons/` são gerados por `python3 tools/gerar-icones.py` a partir de `icons/fonte-icone.png`, a arte original, que não deve ser apagada. São sangrados (fundo bege até as bordas, sem a moldura da arte), e no `icon-maskable-512.png` a ilustração cabe no círculo central de 80%, a área que o Android garante ao recortar. O topo e o Sobre usam `icons/glifo.jpg`: a arte recortada por dentro da moldura dupla, sem a borda, gerada pelo mesmo script. Cada geração copia antes os ícones atuais para `icons/backup/`, no `.gitignore`.

`vendor/` traz Vue 3.5 (`vue.global.prod.js`, com compilador), Pico.css 2.1 e a fonte Outfit. Não troque por CDN.

## Publicação

O app é publicado pelo GitHub Pages, direto da branch `main`, pasta raiz: `https://lexrupy.github.io/percentualpadeiro/`. Os caminhos são todos relativos, então ele funciona na subpasta. O `.nojekyll` vazio na raiz faz o Pages servir os arquivos como estão. Publicar é fazer push na `main` com o `CACHE` novo.

## Como abrir

O service worker só registra em HTTP. Sirva a pasta e abra no navegador:

```bash
python3 -m http.server 8769 --bind 127.0.0.1
```

`file://` não instala o app. Depois de mudar HTML, CSS, JS ou imagens cacheadas, suba a constante `CACHE` em `ServiceWorker.js` (`padeiro-v82` hoje). O app funciona 100% offline depois da primeira visita. A estratégia é rede primeiro, revalidando com o servidor (`cache: "no-cache"`); sem rede, com erro ou depois de 3 s (`NETWORK_TIMEOUT`), vale o cache, e a busca segue em segundo plano atualizando o cache. A instalação de uma versão nova baixa os arquivos com `cache: "reload"` e só apaga a versão anterior depois que a nova está completa; se falhar, a anterior continua. Todo arquivo que a página carrega precisa estar em `FILES`. O número da versão que o app mostra vem de `CACHE` (`padeiro-v82` → versão 82): subir o `CACHE` é publicar uma versão nova. O ícone ao lado do nome abre o modal Sobre, com a versão, se o app está offline e se os dados estão protegidos. "Verificar atualizações" chama `registration.update()`: com versão nova, instala e oferece recarregar; sem versão nova, pede ao service worker (mensagem `refresh`) para baixar de novo todos os arquivos direto do servidor. A página fala com o service worker por `postMessage` (`version`, `refresh`). A página pede `navigator.storage.persist()` para o navegador não apagar o cache e as receitas quando faltar espaço.

Não há suíte de testes. `node -e` consegue importar `calc.js`. Mudança de tela precisa ser exercida no navegador, no celular (cerca de 390 px) e na largura máxima do app (560 px).

## Contas

A farinha da receita é 100%. Gramas de um ingrediente = farinha × percentual / 100. Unidade só em gramas. Farinha máxima no campo: 99.999 g (`FLOUR_MAX` em `app.js`). O campo encolhe com a quantidade de dígitos.

Receita inicial: 500 g de farinha, 65% de água, 2% de sal, 1% de fermento seco. Massa 840 g, hidratação 65%.

A hidratação total é a água contada ÷ farinha da receita × 100. Entra a água direta, a água da alimentação do levain e o teor de água de cada ingrediente. A farinha da alimentação do levain não entra nos 100%. A umidade de laboratório da farinha (~12%) não conta, nem a da farinha base. Farinha, amido, leite em pó e cacau em pó ficam com água 0. Os teores estão em `ADDABLE`, em `calc.js`. O sal da margarina com sal não soma na linha do sal.

O fermento biológico é seco (padrão, 1%) ou fresco. A mesma força pesa o triplo no fresco: `convertYeast` multiplica ou divide por 3 e arredonda a 2 casas. Trocar seco ↔ fresco converte o percentual. O levain fica no mesmo seletor; sair e voltar restaura o fermento anterior. Fermento não contribui água.

A receita pode ter dois fermentos: o principal (`role: "ferment"`, com o seletor seco / fresco / levain) e um segundo (`role: "ferment2"`), adicionado pelo "+ Ingrediente" e sempre do tipo que falta: levain junto de fermento biológico, ou fermento seco ou fresco (reforço) junto de levain. Enquanto houver o segundo, o seletor principal esconde o tipo dele, para não haver dois levains. `isFerment` (`calc.js`) reconhece os dois, e a água da alimentação entra na hidratação seja o levain o principal ou o segundo. O levain não é outra tela. O botão Levain, ao lado de Receitas, abre o mesmo modal como simulador: o total e a proporção recalculam isca, água e farinha com gramas soltas, e digitar esses pesos recalcula a proporção. Nada disso grava na receita nem aparece como percentual da farinha. Com o fermento em Levain, a ativação abre num modal (`<dialog>`): sozinha só na primeira vez que a receita usa levain (`levainPct` ainda vazio), e sempre pelo lápis ao lado do seletor. Voltar para um levain já configurado não abre o modal. Na linha do fermento ficam a proporção (à direita do lápis), a hidratação do levain (à direita do percentual) e os gramas de isca, água e farinha. O modal mostra o levain em gramas e em % da farinha; os gramas são editáveis ali (campo `levainGrams`, que recalcula o percentual como os gramas da lista). Ele pede a proporção L:A:F (levain : água : farinha), ordem brasileira. Os presets só preenchem os campos e ficam em três grupos: mais líquidos (1:5:4, 125%, levain líquido do Hamelman); hidratação 100% (2:1:1, 1:1:1, 1:2:2, 1:3:3, 1:4:4, 1:5:5, 1:10:10, 1:20:20, da alimentação menor para a maior); e mais firmes, do mais úmido para o mais firme (2:4:5 e 1:4:5 a 80%, 1:2:3 a 67%, 1:1:2 e 1:5:10 a 50%, como o lievito madre). Ou personalizado. A hidratação do levain é água da alimentação ÷ farinha da alimentação. A água já presente na isca não entra. A água da alimentação entra na hidratação total da massa. Os gramas exibidos são inteiros que somam o total arredondado; a sobra vai para a isca.

O modal mostra o perfil da ativação de `levainProfile` (`calc.js`): textura, tempo até o pico a 24–26 °C, posição entre láctico e acético numa escala de 5 e dicas. Ele vem da hidratação do levain e de quantas vezes a farinha da alimentação supera a isca, então também vale para o personalizado. Mais líquido e mais quente puxa para o láctico; mais firme e mais frio, para o acético; alimentação pequena herda mais acidez da isca.

`BANDS` escolhe textura, pão típico e imagem do miolo a partir da hidratação total. Os limites (até 57% pão sovado, 62% pão francês, 68% baguete, 78% fermentação natural, 85% ciabatta, 95% focaccia, acima disso focaccia de alta hidratação) seguem as faixas típicas das fontes registradas em `backlog/0034`. Como os pães se sobrepõem, o card diz "Típico de <pão>", e o nome abre um modal com a faixa típica de `BREAD_INFO`, se a massa está dentro dela e a tabela de todos os pães. Mudou um limite ou uma faixa? Atualize `BREAD_INFO` e a tarefa com a fonte. Cada faixa tem a sua imagem 3:2 (`img/miolo-N-*.svg`), gerada por `python3 tools/gerar-miolos.py` com semente fixa. A casca, o pano e a faixa clara junto da casca vêm da foto `img/miolo-firme.jpg`, embutida em cada SVG; o script acha o miolo na foto pela cor, traça o contorno e gera só os alvéolos dentro dele. Não apague `img/miolo-firme.jpg`: é a fonte da casca. Esse modo precisa de `numpy` e `Pillow` (só para gerar, o app não usa). `--ilustrado` gera o pão todo desenhado, sem a foto. Para ajustar uma faixa, mude `LEVELS` e gere de novo. `--enriquecido` gera `img/miolo-enriquecido.jpg`, recortando `img/brioche.jpeg` em 600 × 400 sem deformar as proporções do pão. `--enriquecido-svg` mantém a geração da ilustração SVG pura do brioche. Cada geração copia antes as imagens atuais para `img/backup/AAAAMMDD-HHMMSS/`, pasta que está no `.gitignore`. As fotos `img/miolo-*.jpg` não entram no cache. Quando ovos, leite, gordura, açúcar ou purês (campo `enrich` em `ADDABLE`) somam 5% ou mais, o pão é enriquecido: o nome vem de `enrichedBread` (Brioche com ovos a partir de 15%, ou ovos com gordura a partir de 15%; "Pão de batata" e afins com o purê a partir de 10%; senão, a categoria que pesa mais), e a imagem é a fatia de brioche. A textura da massa continua vindo da hidratação. A ilustração é uma referência visual da categoria, não uma regra sobre o miolo real de toda fórmula enriquecida. Não repita textura nem tipo de pão em outro ponto da tela.

O estado fica em `localStorage`, chave `percentual-padeiro-v1`. As receitas salvas ficam na chave `percentual-padeiro-receitas-v1`: uma lista com `id`, `name` (a descrição), `savedAt` (data e hora em ISO) e `state` (cópia do estado inteiro, com o L:A:F). Apagar uma receita pede confirmação no modal genérico `askConfirm({ title, message, confirmLabel, cancelLabel, danger })`, que devolve uma Promise com `true` ou `false`; Cancelar, Esc e clique no fundo valem `false`. Use o mesmo modal para outras confirmações. Ele fica centralizado na tela; os outros modais abrem pelo topo. O botão "Salvar receita" do card principal abre o mesmo modal em modo curto (`quickSave`), só com a descrição; ao salvar, fecha e o botão mostra "Salva ✓" por 2 s. À esquerda dele, a borracha (mesmo tamanho do compartilhar) pede confirmação e devolve a tela à receita inicial. Abrir uma receita só copia o estado para a tela: não há edição da receita salva, e limpar não apaga a lista. Abrir uma receita passa o estado por `normalizeState`, a mesma limpeza do carregamento.

## Tela

O card de cima reúne a farinha e o resumo. Ele rola com a página para os ingredientes aparecerem. Não deixe esse card `position: sticky`. A barra do topo (ícone, nome e Receitas) é fixa (`sticky`), ela sim; o card não. O "Instalar o app" fica no modal Sobre, para o nome caber numa linha.

À direita da farinha: foto retangular 3:2 e, abaixo dela, o texto **Hidratação total** com o percentual, a textura e o pão. O rótulo não é "hidratação final": isso soaria como pão assado. Na coluna da farinha, colados nos gramas, ficam a barra empilhada da composição da massa (farinha, água e outros, da esquerda para a direita, com a legenda logo embaixo), o peso da massa em destaque e o botão Salvar receita; as duas colunas ficam com alturas parecidas. Os nomes da legenda têm a cor do trecho correspondente, num tom mais escuro para chegar a 4,5:1; o valor fica na cor do texto. As cores ficam em `--comp-*`, em `app.css`, e passaram pelo validador de paleta. O slider da água da receita permanece embaixo, como controle, e não é a hidratação total. Os atalhos 55%, 65%, 72% e 85% abaixo do slider são botões: tocar leva a água direto ao valor.

O campo da farinha não reserva espaço para 999999 g. Há um vão entre os botões ▲▼ e a foto. O nome da receita fica na coluna da farinha: se passar da largura dela, corta com reticências e não empurra a foto. A prévia de teste do card compartilhado abre em `?card`. O service worker serve a própria imagem em `card` e em `card.png` (`Content-Type: image/png`, `Content-Disposition: inline`), sem passar pelo servidor. A página grava o PNG no worker ao abrir e a cada mudança da receita. O card 2 fica em `card2` e `card2.png`, e a prévia em `?card2`: o topo (ícone, título, nome e data) é o do card atual; no vão à esquerda da foto ficam os três cards de farinha, hidratação total e peso da massa; abaixo entra o card da tela (farinha, barra da composição, foto, hidratação total e slider da água); levain, ingredientes e composição seguem como no card atual. O botão Compartilhar envia o card 4, e o arquivo baixado usa o nome da receita em minúsculas, com hífens. Os cards 1, 2 e 3 continuam no código e nas prévias. O card 4 fica em `card4` e `?card4`. Começou como cópia do primeiro card; ao lado da foto, a ordem é fermentação (Levain, Seco, Fresco ou Misto), textura e pão típico; a foto acompanha essa altura. O nome da textura usa a cor do app (`firme`, `macia`, `pegajosa`, `úmida`). Os três cards de farinha, hidratação e peso ocupam a mesma largura dos blocos de baixo, e o valor usa uma fonte maior. A composição da massa, embaixo, usa a barra empilhada do card principal: o título fica no bege e o gráfico no branco. A lista de ingredientes fica no mesmo cartão dos outros blocos: cabeçalho INGREDIENTE, PERCENTUAL e PESO na mesma fonte, e os itens no branco, com a borda fina. Cada ingrediente tem o ícone do app e, abaixo da linha, a barrinha do percentual. A linha do levain não repete proporção nem alimentação: isso fica no bloco destacado, e o item fica na altura da água e do sal. O bloco do levain tem o título marrom sobre o bege e o restante em branco, com o texto em preto e a escala do modal (cinco trechos do láctico ao acético). A borda bege das laterais e de baixo é fina, igual à da composição. O card 3 fica em `card3` e `?card3`: farinha e peso da massa empilhados à esquerda, hidratação total com as barras da composição no meio, foto com textura e pão típico à direita; levain, ingredientes e composição seguem iguais. No card, o bloco do levain fica afastado da tabela de ingredientes. A linha sem observação (água, sal, farinha seca) é baixa; levain, fermento e teor de água mantêm o texto embaixo.

## Backlog e commits

Cada melhoria ou correção tem uma tarefa em `backlog/` (modelo em `backlog/README.md`: autor, data, status, contexto, o que foi feito, critérios de aceite, como verificar). Uma melhoria por commit, e o commit leva a tarefa com o status atualizado. A mensagem do commit diz o que mudou e por quê, em português.

## O que não fazer

- Não criar botões de receita pronta nem travar a farinha base quando entram outras farinhas. Elas se somam.
- Não contar a água da isca nem a umidade presa em farinha e pó secos.
- Não inverter a ordem do levain para farinha:água.
- Não colocar a página dentro do service worker. O app é `index.html` + manifest + `ServiceWorker.js`.
