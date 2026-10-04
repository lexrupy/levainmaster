# 0076 — Calibração do levain

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-04
- **Status:** proposta
- **Arquivos:** `calc.js`, `app.js`, `index.html`, `app.css`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

As faixas de tempo de `levainProfile` valem para 24–26 °C e para um fermento genérico. Farinha, água, isca e cozinha mudam o relógio. O pico fechado de 1º de outubro de 2026, num 1:25:25 a cerca de 20 °C, veio em 12 h e meia, antes do começo da faixa de 16 a 24 h. O estudo está em `teorias do levain.md`.

A calibração é opcional. Quem nunca calibrou continua nas faixas, no sabor, na textura e nas dicas de hoje. O número não muda. Mesmo assim a implementação vai na branch `calibracao-do-levain`, a partir da `main`. A `main` publica o site no push. A tela Sobre e o rótulo da hora mudam para todo mundo, e o recurso é grande demais para entrar pela metade. O `CACHE` só sobe no merge, quando a branch estiver pronta. Até lá esta tarefa fica em `proposta`.

## O que foi feito

Nada no app. O combinado está abaixo.

### O que a calibração mexe

Só a hora até o pico de volume. Textura, posição láctico–acético, dicas e a água da alimentação na hidratação da massa ficam com `levainProfile`. Sem calibração ativa, a função devolve o mesmo `time` de hoje, inclusive o degrau das massas abaixo de 85%.

### O par obrigatório

Calibrar exige os dois potes, começados juntos, da mesma isca, da mesma farinha, da mesma água, no mesmo lugar. Um pote só não grava. Outra proporção não grava.

| Pote | Proporção | Isca sugerida | Água | Farinha |
| --- | --- | --- | --- | --- |
| A | 1:1:1 | 20 g | 20 g | 20 g |
| B | 1:5:5 | 20 g | 100 g | 100 g |

Outros pesos passam se a proporção se mantém. O 10 g + 50 g + 50 g é um 1:5:5 e entra. A conta usa alimentação 1 e alimentação 5, não o desvio da balança.

Aceite de cada pote, em relação à isca e entre água e farinha:

- 1:1:1: farinha/isca e água/farinha entre 0,9 e 1,1
- 1:5:5: farinha/isca entre 4,5 e 5,5, e água/farinha entre 0,9 e 1,1

Fora disso o teste não grava. Na tela, o tempo todo: «Outros pesos na mesma proporção são aceitos, mas um erro de pesagem influencia o cálculo final.»

### O que se anota

Nada menos que isto, senão não há calibração:

- nome, em geral a farinha, obrigatório, até 40 caracteres, só para reconhecer
- temperatura dos potes, em °C
- hora em que os dois foram misturados, a mesma
- hora do pico de volume do 1:1:1, confirmada quando começa a perder estrutura
- hora do pico de volume do 1:5:5, do mesmo jeito

O nome não entra na conta. As duas durações precisam ser positivas, e o 1:5:5 precisa ter levado mais tempo que o 1:1:1. Se um pico passou batido, o par se descarta. Não existe calibração pela metade.

### A conta

`r` é a farinha dividida pela isca. `t1` e `t5` são as horas medidas. `ln` é o logaritmo natural.

Para hidratação de 85% ou mais, na temperatura do teste:

`t(r) = t1 + (t5 − t1) × ln(r) / ln(5)`

Exemplo combinado: `t1` = 4 h, `t5` = 10 h, teste a 22 °C, estimativa a 22 °C. A hora mostrada arredonda para meia hora.

| Proporção | r | Conta | Na tela |
| --- | --- | --- | --- |
| 2:1:1 | 0,5 | 1,4 h | 1,5 h |
| 1:1:1 | 1 | 4 h | 4 h |
| 1:2:2 | 2 | 6,6 h | 6,5 h |
| 1:3:3 | 3 | 8,1 h | 8 h |
| 1:5:5 | 5 | 10 h | 10 h |
| 1:10:10 | 10 | 12,6 h | 12,5 h |
| 1:25:25 | 25 | 16 h | 16 h |

Abaixo de 85% a conta de cima segue para a mesma alimentação, e o resultado multiplica pela razão dos meios das faixas atuais: a faixa firme dividida pela faixa a 100%. Os meios são 2,5; 3,5; 5; 7; 10; 14; 20 h, na ordem de `PEAK_TIMES`. Exemplo: 1:2:3 tem alimentação 3. A 100% a faixa é «6 a 8 h» (meio 7). Firme, «8 a 12 h» (meio 10). No exemplo, a hora a 100% seria 8,1 h, e a firme 8,1 × 10/7 = 11,6 h, mostrada 11,5 h. A tela deixa ver que esse degrau é o da faixa geral, com menos certeza. Acima de 115% não encurta a hora, como hoje.

### Temperatura

A temperatura é uma faixa, inferior e superior, não um grau só e não uma média ponderada. Não há registro de quanto tempo cada grau prevaleceu. Uma câmera faria isso. O app não pede.

Quem tem fermentadora também configura piso e teto, ainda que a distância seja 1 °C. Atalhos de 2 °C (20–22, 22–24, 24–26) preenchem os dois campos. O livre aceita 24–25.

O registro do teste pede a faixa dos potes. Vazia, grava 24–26 °C. Com calibração ativa, o ativador e o simulador têm um ícone à direita, na mesma linha do peso do levain («g na massa» ou «g no total»). O ícone abre um modal com a faixa e os atalhos. A faixa começa na do teste. Sem calibração o ícone não aparece e a hora geral não se mexe.

A hora do par, a 100% e depois do degrau firme, é o centro. O meio da faixa só serve de referência interna dessa conta. Não aparece na tela como se aquele grau tivesse prevalecido. A tela mostra o intervalo: o extremo quente encurta, o extremo frio alonga.

`t(T) = t(centro) × 2 ^ ((meio da faixa do teste − T) / 10)`

O quente da faixa pedida entra nessa fórmula e dá a hora curta. O frio dá a hora longa. As duas arredondam para meia hora. Faixa de 1 °C deixa o intervalo estreito. Faixa larga deixa a estimativa larga, que é o aviso. Acima de 30 °C no teto, a tela diz que a levedura perde ritmo e o número é só um guia. Não se esfria nem se esquenta a faixa geral.

### Onde fica na tela

O ícone ao lado do nome abre o Sobre, como hoje. Nesse modal, depois dos fatos e antes de instalar:

- a calibração em uso, ou «Faixa geral»
- a lista das calibrações nomeadas, para escolher uma ou nenhuma
- o botão para registrar o teste dos dois potes
- apagar uma calibração pelo modal de confirmação já existente

Nenhuma devolve as faixas gerais. Apagar a que estava em uso também. Quem usa sempre a mesma farinha escolhe uma vez.

No modal do levain e no simulador, a hora mostra a origem: o nome da calibração, ou «Faixa geral». Não há seletor de calibração ali. Com calibração ativa, a hora é o intervalo da faixa de temperatura, não um grau médio e não o texto «16 a 24 h». Sem calibração, o texto da hora é o de `PEAK_TIMES`, igual ao de hoje.

### O que fica gravado

Chave nova no `localStorage`, `percentual-padeiro-calibracoes-v1`, separada de `percentual-padeiro-v1` e de `percentual-padeiro-receitas-v1`. Cada item tem `id`, `name`, `savedAt`, `t1Hours`, `t5Hours`, `tempLo`, `tempHi` e os pesos anotados. Faixa vazia no registro grava 24 e 26. A ativa é um `id` ou vazio. A faixa pedida no modal não vai para a receita. Fica na sessão, começando na faixa do teste. Abrir uma receita não troca a calibração. Limpar a receita da tela não apaga a lista. Outra farinha, ou a mesma daqui a semanas, é outro par, com outro nome. Não se edita a conta de um par já gravado: grava-se outro ou apaga-se.

A hora calibrada não entra em `levainProfile`. Uma função ao lado recebe o perfil, a calibração ativa e a faixa pedida. Sem calibração, o chamador usa `profile.time`.

## Critérios de aceite

- [ ] Sem calibração, os presets do apêndice A de `teorias do levain.md` mantêm hora, sabor e textura. O 1:25:25 segue «16 a 24 h» e «Bem láctico: suave e cremoso». O 2:4:5 segue «8 a 12 h» e «Pastosa, mais firme que iogurte»
- [ ] Sem calibração, o ativador e o simulador não mostram o ícone de temperatura nem seletor de calibração
- [ ] O teste grava com nome, hora de mistura e os dois picos, com o 1:5:5 mais lento que o 1:1:1. Faixa vazia fica 24–26 °C
- [ ] 10 g + 50 g + 50 g é aceito como 1:5:5. Um 1:2:2 não grava
- [ ] O aviso sobre erro de pesagem está na tela de registro
- [ ] Com `t1` = 4, `t5` = 10 e faixa de teste 22–23 °C, o 1:25:25 nessa mesma faixa mostra um intervalo estreito em volta de 16 h, com o nome da calibração. Uma faixa mais quente encurta as duas pontas. Uma mais fria alonga. Não aparece média ponderada. O sabor não muda
- [ ] Abaixo de 85% a hora passa pelo degrau da faixa geral, no exemplo do 1:2:3
- [ ] Escolher «Faixa geral», ou apagar a calibração em uso, devolve o texto antigo da hora
- [ ] Limpar a receita da tela não remove as calibrações
- [ ] Sobre, registro e modal do levain cabem a 390 px e a 560 px
- [ ] A branch não está na `main` enquanto isso não estiver conferido

## Como verificar

Na branch, `node` compara `levainProfile` dos presets com e sem o módulo de calibração carregado e nenhuma calibração ativa. Os tempos têm de ser os de hoje.

No navegador, sem calibração, abrir o levain da receita e o simulador e ler a hora geral. Registrar o par do exemplo (4 h e 10 h, faixa 22–23 °C), escolher o nome no Sobre e conferir o intervalo do 1:25:25. Abrir o ícone à direita do peso, mudar a faixa e ver as pontas andarem juntas. Confirmar que não há campo de média. Confirmar um 1:2:3. Voltar para «Faixa geral» e ver a faixa antiga. Limpar a receita e ver que a calibração continua no Sobre. Repetir a 390 px e a 560 px.

## Fora do escopo

Não muda sabor, textura nem dicas. Não modela o momento de uso depois do pico. Não calibra com um pote só. Não pede média ponderada nem quanto tempo cada grau prevaleceu. Não coloca temperatura em cima da faixa geral. Não reescreve a dica «Fermentação longa e bem suave» quando a hora calibrada for curta. Não usa o 2:50:50 de 3 de outubro: a queda de estrutura não foi anotada. Não grava a calibração dentro da receita salva.
