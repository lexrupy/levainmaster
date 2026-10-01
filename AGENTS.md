# Percentual do padeiro

Calculadora de percentual do padeiro em português, instalável como PWA no Android. A referência visual é o Flourwise, mas o app não é uma cópia e não traz presets de tipo de pão (ciabatta, pizza, brioche). A faixa de hidratação só informa a textura e um pão típico, num lugar só.

Responda ao Alexandre em português.

## Arquivos

Não há bundler nem CDN. Tudo que a página carrega está no repositório.

- `index.html` — template Vue no DOM
- `app.js` — estado, localStorage, instalação
- `calc.js` — contas. Expõe `window.Padeiro` e `module.exports`
- `app.css` — visual por cima do Pico
- `ServiceWorker.js` — cache da PWA. O nome do arquivo é esse
- `manifest.webmanifest`, `icons/`, `img/`, `vendor/`

`vendor/` traz Vue 3.5 (`vue.global.prod.js`, com compilador), Pico.css 2.1 e a fonte Outfit. Não troque por CDN.

## Como abrir

O service worker só registra em HTTP. Sirva a pasta e abra no navegador:

```bash
python3 -m http.server 8769 --bind 127.0.0.1
```

`file://` não instala o app. Depois de mudar HTML, CSS, JS ou imagens cacheadas, suba a constante `CACHE` em `ServiceWorker.js` (`padeiro-v18` hoje). A estratégia é rede primeiro, cache se a rede falhar.

Não há suíte de testes. `node -e` consegue importar `calc.js`. Mudança de tela precisa ser exercida no navegador, no celular (cerca de 390 px) e na largura máxima do app (560 px).

## Contas

A farinha da receita é 100%. Gramas de um ingrediente = farinha × percentual / 100. Unidade só em gramas. Farinha máxima no campo: 99.999 g (`FLOUR_MAX` em `app.js`). O campo encolhe com a quantidade de dígitos.

Receita inicial: 500 g de farinha, 65% de água, 2% de sal, 1% de fermento seco. Massa 840 g, hidratação 65%.

A hidratação total é a água contada ÷ farinha da receita × 100. Entra a água direta, a água da alimentação do levain e o teor de água de cada ingrediente. A farinha da alimentação do levain não entra nos 100%. A umidade de laboratório da farinha (~12%) não conta, nem a da farinha base. Farinha, amido, leite em pó e cacau em pó ficam com água 0. Os teores estão em `ADDABLE`, em `calc.js`. O sal da margarina com sal não soma na linha do sal.

O fermento biológico é seco (padrão, 1%) ou fresco. A mesma força pesa o triplo no fresco: `convertYeast` multiplica ou divide por 3 e arredonda a 2 casas. Trocar seco ↔ fresco converte o percentual. O levain fica no mesmo seletor; sair e voltar restaura o fermento anterior. Fermento não contribui água.

O levain não é outra tela. Com o fermento em Levain, a ativação abre num modal (`<dialog>`): ao escolher Levain no seletor ou pelo lápis ao lado dele. Na linha do fermento ficam a proporção (à direita do lápis), a hidratação do levain (à direita do percentual) e os gramas de isca, água e farinha. O modal usa o percentual já digitado, em gramas, e pede a proporção L:A:F (levain : água : farinha), ordem brasileira. Os presets só preenchem os campos: 1:1:1, 1:2:2, 1:2:3, 2:4:5, 1:3:3, 1:4:4, 1:5:5, 1:10:10, ou personalizado. A hidratação do levain é água da alimentação ÷ farinha da alimentação. A água já presente na isca não entra. A água da alimentação entra na hidratação total da massa. Os gramas exibidos são inteiros que somam o total arredondado; a sobra vai para a isca.

`BANDS` escolhe textura, pão típico e foto do miolo a partir da hidratação total. Cada faixa tem a sua ilustração 3:2 (`img/miolo-N-*.svg`), gerada por `python3 tools/gerar-miolos.py` com semente fixa: mesmo pão e enquadramento, só os alvéolos mudam. Para ajustar uma faixa, mude `LEVELS` no script e gere de novo. O contorno, a casca e a pestana ficam em `loaf()` e são iguais em todas. Cada geração copia antes as ilustrações atuais para `img/backup/AAAAMMDD-HHMMSS/`, pasta que está no `.gitignore`. As fotos `img/miolo-*.jpg` ficam como backup e não entram no cache. Não repita textura nem tipo de pão em outro ponto da tela.

O estado fica em `localStorage`, chave `percentual-padeiro-v1`.

## Tela

O card de cima reúne a farinha e o resumo. Ele rola com a página para os ingredientes aparecerem. Não deixe esse card `position: sticky`.

À direita da farinha: foto retangular 3:2 e, abaixo dela, o texto **Hidratação total** com o percentual, a textura, o pão e o peso da massa. O rótulo não é "hidratação final": isso soaria como pão assado. Abaixo dos gramas de farinha fica a meia lua da composição da massa (farinha, água e outros, da esquerda para a direita), com a legenda logo embaixo. Os nomes da legenda têm a cor do trecho correspondente, num tom mais escuro para chegar a 4,5:1; o valor fica na cor do texto. As cores ficam em `--comp-*`, em `app.css`, e passaram pelo validador de paleta. O slider da água da receita permanece embaixo, como controle, e não é a hidratação total.

O campo da farinha não reserva espaço para 999999 g. Há um vão entre os botões ▲▼ e a foto.

## Backlog e commits

Cada melhoria ou correção tem uma tarefa em `backlog/` (modelo em `backlog/README.md`: autor, data, status, contexto, o que foi feito, critérios de aceite, como verificar). Uma melhoria por commit, e o commit leva a tarefa com o status atualizado. A mensagem do commit diz o que mudou e por quê, em português.

## O que não fazer

- Não criar botões de receita pronta nem travar a farinha base quando entram outras farinhas. Elas se somam.
- Não contar a água da isca nem a umidade presa em farinha e pó secos.
- Não inverter a ordem do levain para farinha:água.
- Não colocar a página dentro do service worker. O app é `index.html` + manifest + `ServiceWorker.js`.
