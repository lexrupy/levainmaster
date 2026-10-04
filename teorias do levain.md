<!-- SPDX-License-Identifier: LGPL-3.0-or-later -->

# Teorias do levain

**Alexandre da Silva**

Percentual do padeiro · outubro de 2026

Estudo de cozinha. As seções de experimento são o que eu vi no pote. A discussão é a literatura que foi lida comigo enquanto o perfil do app estava em questão, e onde ela concorda ou destoa do que eu observei. A conta em `calc.js` (`levainProfile`) não mudou por causa deste texto.

---

## Resumo

Mantenho um levain em casa e um app que estima, a partir da proporção isca : água : farinha, a textura, o tempo até o pico a 24–26 °C e uma posição entre láctico e acético. Este texto registra o que eu já fiz e o que a leitura da literatura me devolveu.

Na madrugada de 1º de outubro de 2026 pesei 2 g de isca, 50 g de água e 50 g de farinha Rosesol tipo 1. Chamei de 1:20:20; a proporção real é 1:25:25. A cozinha estava na casa dos 20 °C. O volume chegou ao pico por volta de 12h30 e começou a baixar por volta de 13h30. O app, para uma alimentação acima de 10 vezes a isca, marca 16 a 24 h a 24–26 °C. O meu pico foi mais cedo, e numa cozinha mais fria. Por isso não coloquei temperatura em cima desse relógio: a regra prática de dobrar o tempo a cada 10 °C a menos alongaria ainda mais uma previsão que já passou do que eu vi.

No 100%, recém-misturado, o levain me parece mais firme que o iogurte comum daqui. Com o tempo ele se liquefaz, sobretudo depois da geladeira, e continua elástico. Acima de 100% eu ainda não fiz. No 2:4:5 (80% de água) ficou só um pouco mais pastoso: não se nivela sozinho, pede colher ou espátula, e quando fermenta sobe por igual, sem domo. O rótulo do app para essa faixa, “pastosa, mais firme que iogurte”, descreve o que eu vi. O domo, se aparecer, deve ser coisa de massa mais sólida, abaixo de uns 70%, que eu ainda não sovei na mão.

Sobre o sabor, a literatura que li com o app não pede para inverter a escala. Mais água puxa o láctico e, em geral, mais acidez total; a massa firme baixa a acidez total e sobe a parte do acético, e o pão pode sair até mais suave no conjunto porque a levedura ganha da bactéria. O quadro da Helena (helena.fermentonatural) fala de velocidade e de diluir a acidez que a isca carrega. Quando ela quer menos azedinho, diminui a isca e aumenta a farinha. Isso combina com a alimentação grande do app. Se a água não sobe junto, a hidratação cai e a minha escala anda para o acético. O 1:3:3, com água e farinha juntas, continua “láctico, suave”.

Ficou de fora, de propósito: o momento em que eu uso o levain depois do pico, um campo de temperatura, o tipo de farinha e o vigor da isca. O relógio e a escala ficam como estão.

## 1. Introdução

O app trata a farinha da receita como 100% e o levain como uma alimentação à parte. A ordem que eu uso é a brasileira, L:A:F, isca, água e farinha. A hidratação do levain é só a água da alimentação dividida pela farinha da alimentação. A água que já estava dentro da isca não entra. A umidade de laboratório da farinha, aqueles cerca de 12%, também não entra.

Eu quis saber se essa leitura de acidez estava de cabeça para baixo. Um vídeo que eu estava vendo parecia dizer que mais farinha deixa o fermento mais leve, mais láctico, e mais água deixa mais acético. Fui olhar o vídeo minuto a minuto e, em paralelo, a literatura que se costuma citar para essa alavanca. Este papel guarda os dois lados: o pote e o papel impresso.

Não medi pH, acidez titulável nem gás. O que eu tenho é hora de pico de volume, colher, aspecto e elasticidade. Onde a literatura fala em milimoles de lactato, eu digo se isso combina com o que o pote fez, e paro aí.

## 2. Como eu conto uma proporção

Três números chegam. A hidratação é A ÷ F × 100. A alimentação é F ÷ L, quantas vezes a farinha nova supera a isca. As duas coisas andam separadas. Dá para deixar o levain a 100% e só mudar a isca (1:2:2, 1:5:5, 1:20:20). Dá para manter a isca e só mudar a água (1:2:2 contra 1:2:3).

| O que eu mexo | O que muda | O que eu espero |
| --- | --- | --- |
| Mais água, farinha quieta | Sobe a hidratação | Mais láctico, massa mais solta |
| Mais farinha, água quieta | Cai a hidratação e sobe a alimentação | Mais firme, e a escala do app anda para o acético |
| Mais farinha e mais água juntas | Alimentação sobe, hidratação fica | Mais suave pela diluição da isca, mesmo relógio de textura |
| Mais isca | Alimentação cai | Fica pronto mais cedo e herda o azedo que a isca já tinha |

O 2:4:5 que eu fiz é 80% (4 ÷ 5) e alimentação de 2,5 vezes (5 ÷ 2). O 1:25:25 da madrugada é 100% e alimentação de 25 vezes. Os dois não são “a mesma família” só porque os dois levam farinha e água em partes iguais ou quase.

## 3. O que o app afirma hoje

O perfil está em `levainProfile`, em `calc.js`. A textura sai só da hidratação. O tempo sai da alimentação, com um degrau a mais se a hidratação fica abaixo de 85%. A posição na escala de cinco sai da hidratação e depois de um ajuste pela alimentação. Os tempos estão escritos para 24–26 °C. Não há campo de temperatura.

| Hidratação | Textura no app |
| --- | --- |
| Acima de 115% | Líquida, escorre da colher |
| De 85% a 115% | Cremosa, como iogurte grosso |
| De 70% a 85% | Pastosa, mais firme que iogurte |
| Abaixo de 70% | Firme, de sovar na mão |

A base da escala: 95% ou mais começa em “láctico, suave”; 75% ou mais em “equilibrado”; 60% ou mais em “acético”; abaixo disso em “bem acético”. Se a farinha é no máximo 1 vez a isca, sobe um degrau, para o azedo. Se a farinha é 4 vezes ou mais, desce um degrau, para o suave. O resultado fica entre 0 e 4.

| Posição | Frase |
| --- | --- |
| 0 | Bem láctico: suave e cremoso |
| 1 | Láctico: suave, azedinho de iogurte |
| 2 | Equilibrado |
| 3 | Acético: mais azedo |
| 4 | Bem acético: azedo e pungente |

Os tempos, da alimentação menor para a maior: 2 a 3 h, 3 a 4 h, 4 a 6 h, 6 a 8 h, 8 a 12 h, 12 a 16 h, 16 a 24 h. Passou de 10 vezes a isca, cai na última faixa. Abaixo de 85% de água, anda uma faixa para o mais lento. Acima de 115% o app avisa que o líquido fermenta rápido e puxa o láctico, e o relógio não encurta.

A tabela inteira dos presets, como a função responde hoje, está no apêndice. Dois pontos me importam direto. O 1:3:3 cai em “láctico, suave”, 6 a 8 h, cremoso. O 1:10:10 e o 1:20:20 caem os dois em “bem láctico”; só o relógio muda, 12 a 16 h e 16 a 24 h. A dica da alimentação grande ainda diz “fermentação longa e bem suave”.

## 4. Experimentos

### 4.1 Pico de volume a cerca de 20 °C

**Quando.** Madrugada de 1º de outubro de 2026, por volta da meia-noite.

**O que eu pesei.** 2 g de isca, 50 g de água, 50 g de farinha. Na hora eu disse 1:20:20. A conta é 50 ÷ 2 = 25, então 1:25:25. Os 2 g + 50 g + 50 g fecham 102 g. Um total de 100 g nessa proporção seria 1,96 g + 49,02 g + 49,02 g, e o modal da receita, em inteiros, mostraria 2 g + 49 g + 49 g, o mesmo que mostra para o 1:20:20. Eu pesei o que a balança deixa ver, não o casamento com 100 g.

**Condições.** Cozinha na casa dos 20 °C. Não deixei um termômetro registrando a noite inteira. A farinha era Rosesol tipo 1. Na hora não anotei lote, fabricação nem validade; isso dá para completar depois, olhando a embalagem. Não anotei quantas vezes o volume subiu. Anotei a hora em que o volume parou de subir e a hora em que começou a murchar.

**O que aconteceu.** Pico de volume por volta de 12h30. Começou a baixar por volta de 13h30. Cerca de 12 horas e meia até o pico, e mais ou menos uma hora no alto.

**O que o app dizia.** Alimentação de 25 vezes, hidratação 100%, tempo “16 a 24 h” a 24–26 °C, sabor “bem láctico”, textura “cremosa, como iogurte grosso”.

**Onde fecha.** A alimentação grande realmente esperou a manhã e a hora do almoço. Não foi um levain de 4 a 6 h.

**Onde não fecha.** O pico chegou antes do começo da faixa, e a cozinha estava uns 5 °C abaixo da temperatura para a qual a faixa foi escrita. Se eu esfriasse o relógio atual com a regra de que a cada 10 °C a menos o tempo dobra (Q10 por volta de 2), aqueles 16 a 24 h virariam algo como 22 a 34 h. A previsão ficaria pior, não melhor. O relógio de base, no meu fermento, já é lento demais para receber um desconto de frio.

### 4.2 Textura do levain a 100%

**O que eu fiz.** Alimentações a 100% de água, a família do 1:2:2, do 1:5:5 e também a da seção 4.1. Ainda não passei de 100%.

**Logo depois de misturar.** Parece mais firme que um iogurte normal daqui. É pasta. A farinha ainda não teve tempo de se abrir.

**Com o tempo.** Vai se liquefazendo. Depois da geladeira isso aparece mais. Mesmo assim, na colher, ainda estica: a elasticidade não some quando o volume murcha.

**O que o app diz.** Entre 85% e 115% a frase é “cremosa, como iogurte grosso”.

**Onde fecha.** É comida de colher, da família do iogurte, não uma massa de sovar e não um caldo. O “iogurte grosso” chega mais perto do que eu sinto depois que descansa do que o iogurte de pote comum, que aqui é mais fino.

**Onde eu calibro o rótulo.** A frase descreve o levain que já descansou e fermentou. No minuto em que a farinha acaba de entrar, o meu 100% é mais duro que esse iogurte. A pesquisa que acompanhou a conversa leu isso assim: a rede ainda está inteira; proteases e ácido vão cortando; na geladeira o gás se dissolve, a espuma murcha e o ácido segue devagar. O que sobra de elástico é glúten que ainda estica e já não segura o volume. Eu não medi gás nem proteína. A leitura combina com a colher.

### 4.3 A proporção 2:4:5

**O que eu pesei.** Isca, água e farinha em 2:4:5. Hidratação 80%. Alimentação 2,5 vezes a isca.

**Logo depois de misturar.** Um pouco mais pastoso que o 100%. Ainda não é firme de verdade. Não se assenta sozinho no recipiente. Para nivelar, colher ou espátula.

**Quando a fermentação pega.** Sobe uniforme. A superfície sobe plana. Não forma domo.

**O que eu suspeito.** Domo talvez apareça em proporções mais sólidas. Não sei se vou fazer uma massa a ponto de sovar na mão. Quero saber onde isso acontece.

**O que o app diz.** Abaixo de 85% e a partir de 70%, “pastosa, mais firme que iogurte”. O 2:4:5 cai em equilibrado, 8 a 12 h, por causa do degrau de lentidão da massa firme. O “de sovar na mão” só começa abaixo de 70%: o 1:2:3 está a 67%, o 1:1:2 e o 1:5:10 a 50%.

**Onde fecha.** O salto do 100% para o 80% foi pequeno, exatamente um passo de textura, não uma mudança de família. Não nivelar sozinho é o que essa pasta faz. Subir em bloco, sem pele no topo, também. A massa ainda cede inteira quando o gás empurra.

**O que fica em aberto.** Eu já tinha notado que os firmes, os que não são duros, seguram a estrutura por mais tempo. O 2:4:5 segurou o bastante para não virar caldo, e não chegou a ser o firme que faz cúpula. O domo continua hipótese para a faixa que eu não fiz.

### 4.4 O peso inteiro

Isto não é um pote. É a decisão de como o modal da receita mostra os gramas, tomada depois de eu esbarrar nela.

Quero 100 g em 1:20:20. A divisão exata é 2,44 g + 48,78 g + 48,78 g, e o app mostra 2 g + 49 g + 49 g. Quero 100 g em 1:25:25. A divisão exata é 1,96 g + 49,02 g + 49,02 g, e o app mostra os mesmos 2 g + 49 g + 49 g. Os dois arredondamentos já somam 100 g; a sobra nem precisou ir para a isca. No 1:40:40 a isca exata é cerca de 1,23 g, arredonda para 1 g, e aí sim ganha 1 g para fechar 100 g, e também aparece 2 + 49 + 49.

O 2 g + 50 g + 50 g que eu pesei é 102 g, e é um 1:25:25 limpo. A 250 g as duas proporções se separam: 1:20:20 vira 6 g + 122 g + 122 g; 1:25:25 vira 4 g + 123 g + 123 g.

Eu decidi manter os inteiros na receita. Eles somam o total arredondado, e o que sobra fica na isca. O modal da receita não mostra décimos. O simulador, o botão Levain ao lado de Receitas, fica solto da receita: 100 g de 1:25:25 aparecem como 1,96 g + 49,02 g + 49,02 g, e digitar 2, 50 e 50 reescreve a proporção para 1:25:25 e o total para 102 g. Foi assim que eu consegui ler a proporção que eu realmente tinha feito.

## 5. Discussão

### 5.1 A escala não estava invertida

A dúvida era direta. Mais farinha seria mais láctico, mais água seria mais acético, e o app estaria ao contrário.

A leitura que me trouxeram aponta o inverso, com um detalhe que importa na boca.

Martínez-Anaya, Benedito de Barber e Collar Esteve (1994) mediram pH, acidez titulável, láctico e acético em massas ácidas de trigo, com duas cepas de *Lactobacillus plantarum*, com e sem levedura. Variaram extração da farinha, rendimento da massa e temperatura (25, 30 e 35 °C). Na análise de fatores, a extração explicou 53% da variação e governou a acidez total e o acético. O rendimento da massa, que é a água, explicou 27% e andou com o láctico. A temperatura ficou com 16% e não se amarrou a uma variável só. O rendimento mais alto que eles usaram (240 g de massa por 100 g de farinha, cerca de 140% de água) deu o máximo de láctico. O mais baixo (160 g, cerca de 60% de água) deu a menor acidez total e a menor quantidade dos dois ácidos. A farinha de mais cinza (1,68%) deu a maior acidez total e o maior acético.

Ognean (2015) fez fermentos tipo I com farinha:água de 1:0,6, 1:1, 1:2 e 1:3, e refrescos de 1:3 e 1:4. Mais água favoreceu o láctico. A razão láctico:acético foi 15,5 na massa mais úmida e 6,5 na mais seca. O mais líquido também produziu mais gás. O refresco 1:4 se comportou de modo parecido com o 1:3. O resumo dela ainda separa acidez de rendimento: pouca água pode concentrar a acidez titulável, enquanto o rendimento de ácido, e sobretudo o láctico, favorece a massa úmida.

Isso combina com a escala do app. Mais água, posição mais láctica. Massa mais firme, posição mais acética, e menos acidez no total. O “mais azedo” do firme é uma parte maior de acético dentro de um total que pode ser menor. Andrew Janjigian (2023) diz a mesma coisa para quem faz pão: o firme favorece o acético em relação ao láctico, e o efeito sozinho é moderado; ao mesmo tempo o firme favorece a levedura em relação à bactéria, então o pão pode sair mais suave no conjunto. O líquido favorece o láctico e o azedo bacteriano. O Massa Madre Blog, em português, descreve o líquido como iogurte e o firme como vinagre. A minha escala fala a língua do caráter (láctico contra acético), não a língua do “quanto azeda no total”.

Röcken, Rick e Reinkemeier (1992) são o freio. Eles variaram temperatura (25 a 40 °C), rendimento da massa (180 a 320) e frutose (0 a 10 g por 100 g de farinha) num fermento com *Lactobacillus brevis*. O quociente de fermentação, mols de láctico por mols de acético, foi de 0,9 a 4,5. A temperatura não foi significativa naquele desenho. A frutose, que serve de aceptor de elétrons e empurra a bactéria heterofermentativa para o acetato, mexeu mais no quociente do que a quantidade de água. A hidratação é uma alavanca de verdade. Não é a mais forte. Farinha integral, oxigênio e açúcares da própria farinha podem falar mais alto do que o slider de água. A escala não vê isso.

Spicher e Rabe (1980), com bactérias heterofermentativas de fermento, viram o lactato depender mais da temperatura do que o acetato, entre 25 e 35 °C. Depois de 24 h a quantidade de acetato era mais estável que a de lactato. Isso sustenta a frase do app de que mais quente puxa o láctico. Não sustenta um campo de temperatura em cima do meu relógio, pelo motivo da seção 4.1.

Gänzle, Ehmann e Hammes (1998) modelaram o crescimento de *Lactobacillus sanfranciscensis* e *Candida milleri* com a temperatura do processo. As duas curvas não são a mesma. A levedura perde ritmo quando passa de cerca de 30 °C; a bactéria ainda sobe um pouco além. Uma regra única de Q10, colada na faixa de 16 a 24 h, não é o modelo desses organismos. Serve só para mostrar que esfriar a faixa atual me afastaria das 12h30 que eu cronometrei.

### 5.2 O que a Helena estava dizendo

O vídeo é o reel de helena.fermentonatural em <https://www.instagram.com/p/Dd99uncIrwm/>. O quadro tem o cabeçalho ISCA, ÁGUA, FARINHA. A ordem é a mesma do app. Não havia colunas trocadas.

O quadro organiza velocidade, não o nome do ácido. Do que eu vi, com as legendas conferidas:

| Ritmo no quadro | O que ela mexe | Exemplos no quadro |
| --- | --- | --- |
| Rápida | Sobe a isca, sobe a água, desce a farinha | 1:1:1, 2:1:1, 1:0,5:1 |
| Neutra | Desce a isca, sobe a água, sobe a farinha | 1:2:2, 1:2:3, 1:3:3, 1:1,6:2 |
| Demorada | Desce a isca, desce a água, sobe a farinha | 1:1:5, 1:1,5:6, 1:10:10 |

A lógica que o quadro desenha: mais isca e menos farinha andam mais rápido; água circula e também anda mais rápido; mais farinha neutra a isca e alonga a fermentação. Na linha demorada há um círculo de mais acidez e mais sabor.

Por volta de 4:37, quando ela quer uma fermentação em que não se sinta tanto o azedinho, ela fala em diminuir a isca e aumentar a farinha, e aponta o trecho “+ FAR = ISCA NEUTRA”. Em seguida, sabor menos ácido, porque aquela alimentação não carrega a acidez acumulada da isca. Ela também diz que dá para aumentar a água. Mais adiante, farinha demais é o outro lado: a fermentação fica lenta e o sabor acumula. Em nenhum momento ela diz láctico nem acético.

**Onde eu concordo com ela e com o app ao mesmo tempo.** Diminuir a isca e aumentar a farinha é a alimentação grande. No app, farinha igual ou acima de 4 vezes a isca desce um degrau, para o suave. O 1:3:3, água e farinha subindo juntas, hidratação 100%, fica em “láctico: suave, azedinho de iogurte”. Para chegar em “bem láctico” a isca tem de ser pequena de verdade: 1:4:4, 1:5:5, 1:10:10, 1:20:20. Foi o que eu mesmo concluí fuçando o simulador. “Pra ficar bem suave, realmente bem pouca isca.”

**Onde a frase dela e a minha escala não são a mesma alavanca.** O gesto “mais farinha” com a água parada baixa a hidratação. A escala, que é guiada pela água, anda para o acético. O que ela está neutralizando é a acidez que a isca traz, não o tipo de ácido que a água escolhe. As duas coisas podem acontecer juntas: a isca fica diluída e, se a massa seca, a parte de acético sobe. Para o objetivo que ela fala aos 4:37, água e farinha sobem juntas. É o 1:3:3, o 1:5:5, o 1:10:10.

**Onde ela me deixa uma pergunta aberta.** Se farinha demais acumula sabor numa fermentação longa, então o tempo até o pico devolve ácido e desconta parte da diluição. O app hoje não faz essa conta. O 1:10:10 e o 1:20:20 dividem o mesmo “bem láctico”, e a dica ainda promete fermentação longa e bem suave. Eu acho plausível que o 1:20:20, com 16 a 24 h no papel e 12h30 no meu pote, não seja mais suave que o 1:10:10. Não provei os dois. Uma hipótese que chegou a ser desenhada, e que eu não mandei entrar no código, era esta: a alimentação grande continua descendo um degrau; a faixa de 12 a 16 h devolve um degrau; a de 16 a 24 h devolve outro. O 1:10:10 passaria a “láctico, suave” e o 1:20:20 a “equilibrado”. Ficou no papel. O relógio que dispararia esses degraus já erra a hora do meu pico. Usar um relógio lento para punir o sabor longo seria punir com a hora errada.

### 5.3 Tempo, temperatura e farinha

A proporção manda no tempo até o pico de volume. A hidratação manda em como esse volume aparece e por quanto tempo a estrutura segura o gás. Eu não achei, e a leitura também não me trouxe, uma tabela estável do tipo “esta proporção dobra, aquela sobe 25%”. Quem trabalha a 100% costuma chamar o pico quando o volume anda perto do dobro, e uma cultura forte pode chegar perto do triplo antes de a espuma ceder. Eu não medi o múltiplo no dia 1º. Medi a hora.

A faixa do app para alimentação acima de 10 vezes nasceu da prática de padeiros (alimentações de 1:5:5 e 1:10:10 levando a manhã ou a noite), registrada nas notas do próprio app, e foi partida em 12 a 16 h e 16 a 24 h quando entrou o 1:20:20. O meu único ponto experimental nessa faixa é 12h30 a cerca de 20 °C. Um ponto não recalibra sete faixas.

Temperatura média do dia, que eu tinha vontade de informar para o app estimar o tempo, continua uma boa ideia. Entra depois que o relógio a 24–26 °C deixar de ser lento para o meu fermento, e com a curva de Gänzle e colegas (1998) na cabeça: não é um botão linear de 20 a 35 °C. Passado do pico, eu fui explícito: o app não tem como considerar o momento de uso. Considera o pico. Isso não vamos modelar.

### 5.4 Volume, domo e a palavra “firme”

Janjigian (2023) desenha a fronteira prática assim. Líquido é 100%, ou mais água que farinha, até cerca de 125%. Firme é mais farinha que água, de cerca de 50% até cerca de 80%. Entre 50% e 65% ele acha incômodo misturar na mão. O compromisso que ele usa é 75%: ainda sova rápido, sem batedeira.

O meu 2:4:5 está a 80%, na borda macia desse “firme”. O que eu vi combina com essa borda. Não é caldo, não se nivela, e também não é massa de sovar. O app chama isso de pastoso e reserva “sovar na mão” para baixo de 70%. As duas réguas quase se encontram. A dele chama 80% de firme; a do app chama 80% de pastoso. O pote fica com o app: ligeiramente mais pastoso, não firme de verdade.

O domo pede uma superfície que estique como pele, com a borda presa no vidro, mais fria, enquanto o miolo empurra o centro. Isso é massa com glúten contínuo e pouca água. No 100% e no 80% a massa cede em todo lugar ao mesmo tempo, e o bloco sobe plano. Foi o que eu vi no 2:4:5. Abaixo de 70%, o “dobrou” deixa de ser a única régua. O pico passa a ser o domo, o cheiro e os alvéolos por dentro. Essa massa retém gás, pode parecer alta produzindo menos, e pode estar no pico tendo subido pouco. Eu não fiz o 1:2:3 nem o 1:1:2. O domo fica como expectativa, não como observação.

Acima de 100% eu não fui. Até 115% o app continua na textura cremosa. O 1:5:4, 125%, é o preset do levain líquido associado ao Hamelman, e o app o chama de “líquida, escorre da colher”, com a dica de que fermenta rápido e puxa o láctico. O relógio desse preset, alimentação de 4 vezes, continua 8 a 12 h: a água a mais não encurta a faixa. Ognean (2015) viu o mais líquido produzir mais gás. Se eu fizer um acima de 100%, o que vou olhar é se ele nasce solto, espuma e murcha mais cedo, e se a elasticidade some. Até lá a dica é literatura, não o meu pote.

O lievito madre que o app guarda em 1:1:2 e 1:5:10, a 50%, está na zona que Janjigian acha dura de misturar na mão e na zona em que o app espera domo, alvéolo e cheiro, com sabor bem acético ou acético. Também não fiz.

## 6. O que ficou de fora do modelo

Estas decisões são minhas, tomadas depois das seções 4 e 5. O código continua o da seção 3.

1. Não inverter a escala. A literatura de acidez e o quadro da Helena não pedem isso. O quadro dela é outra alavanca.
2. Não modelar o momento de uso, depois do pico. O marco é o pico de volume.
3. Não somar temperatura em cima das faixas atuais. O meu pico a 20 °C foi mais cedo que a faixa escrita para 24–26 °C.
4. Não deixar as horas até o pico mudarem o sabor, enquanto o relógio não for o do meu fermento. A hipótese do degrau de volta está escrita na seção 5.2 e parada.
5. Tipo de farinha e vigor da isca não entram na conta.
6. Manter, na receita, gramas inteiros que fecham o peso do levain, com a sobra na isca. O simulador fica com as casas decimais e sem vínculo com a receita.

## 7. Conclusão

O que eu vi confirma três leituras e derruba uma pressa.

Confirma a textura. O 100% é cremoso depois que descansa, mais firme que o iogurte comum no instante da mistura, e afrouxa com o tempo e com a geladeira sem perder o elástico. O 80% do 2:4:5 é o passo seguinte: não se nivela, sobe plano, e ainda não é massa de sovar nem de domo.

Confirma o sentido da acidez. Mais água puxa o láctico. Alimentação grande dilui o azedo da isca, que é o que a Helena aponta aos 4:37 quando a água sobe junto. Massa firme muda o caráter para o acético e pode, ao mesmo tempo, azedar menos o pão, porque a levedura leva vantagem. Extração da farinha e aceptores como a frutose pesam tanto ou mais que a água. A escala é uma bússola, não um ensaio.

Derruba a pressa de colocar temperatura ou de punir o sabor pela hora longa. O único pico que eu cronometrei, 12h30 a cerca de 20 °C num 1:25:25, é mais rápido que a faixa quente do app.

## Referências

Gänzle, M. G., Ehmann, M., & Hammes, W. P. (1998). Modeling of growth of *Lactobacillus sanfranciscensis* and *Candida milleri* in response to process parameters of sourdough fermentation. *Applied and Environmental Microbiology*, 64(7), 2616–2623. <https://doi.org/10.1128/AEM.64.7.2616-2623.1998>

Helena, perfil helena.fermentonatural. Reel sobre proporções do fermento natural. <https://www.instagram.com/p/Dd99uncIrwm/>

Janjigian, A. (2023, 12 de julho). Stiffed: on stiff vs. liquid levains. *Wordloaf*. <https://newsletter.wordloaf.org/stiffed/>

Martínez-Anaya, M. A., Benedito de Barber, C., & Collar Esteve, C. (1994). Effect of processing conditions on acidification properties of wheat sour doughs. *International Journal of Food Microbiology*, 22(4), 249–255. <https://doi.org/10.1016/0168-1605(94)90176-7>

Massa Madre Blog. Levain: líquido ou firme? <https://massamadreblog.com.br/know-how/levain-liquido-ou-firme/>

Ognean, C. F. (2015). The technological evaluation of sourdoughs prepared in different conditions. *Management of Sustainable Development*, 7(1), 33–36. <https://doi.org/10.1515/msd-2015-0019>

Röcken, W., Rick, M., & Reinkemeier, M. (1992). Controlled production of acetic acid in wheat sour doughs. *Zeitschrift für Lebensmittel-Untersuchung und -Forschung*, 195, 259–263. <https://doi.org/10.1007/BF01202806>

Spicher, G., & Rabe, E. (1980). Die Mikroflora des Sauerteiges. XI. Mitteilung: Der Einfluß der Temperatur auf die Lactat-/Acetatbildung in mit heterofermentativen Milchsäurebakterien angestellten Sauerteigen. *Zeitschrift für Lebensmittel-Untersuchung und -Forschung*, 171, 437–442. <https://doi.org/10.1007/BF01907235>

The Fresh Loaf. Discussões usadas na montagem das faixas do app: fermento firme e líquido, <https://www.thefreshloaf.com/comment/58320>; alimentação 1:10:10 e 1:1:1, <https://www.thefreshloaf.com/node/64197>; levain líquido a 125% no Hamelman, <https://www.thefreshloaf.com/node/67229>. O preset 1:5:4 do app é essa hidratação de 125%, não uma transcrição de página.

You Knead Sourdough. Feeding ratios. <https://www.youkneadsourdough.com.au/blogs/guides/sourdough-starter-feeding-ratios>

As faixas de pão da massa, que não são o assunto deste estudo, estão em `backlog/0034`. As decisões de produto do perfil estão em `backlog/0012` e `backlog/0033`.

## Apêndice A. O que `levainProfile` responde hoje

Gerado da função, não de memória. Hidratação é A ÷ F. Alimentação é F ÷ L. O tempo já inclui o degrau extra quando a hidratação fica abaixo de 85%.

| Proporção | Água | Alimentação | Pico a 24–26 °C | Sabor | Textura |
| --- | --- | --- | --- | --- | --- |
| 1:5:4 | 125% | 4× | 8 a 12 h | Bem láctico: suave e cremoso | Líquida, escorre da colher |
| 2:1:1 | 100% | 0,5× | 2 a 3 h | Equilibrado | Cremosa, como iogurte grosso |
| 1:1:1 | 100% | 1× | 3 a 4 h | Equilibrado | Cremosa, como iogurte grosso |
| 1:2:2 | 100% | 2× | 4 a 6 h | Láctico: suave, azedinho de iogurte | Cremosa, como iogurte grosso |
| 1:3:3 | 100% | 3× | 6 a 8 h | Láctico: suave, azedinho de iogurte | Cremosa, como iogurte grosso |
| 1:4:4 | 100% | 4× | 8 a 12 h | Bem láctico: suave e cremoso | Cremosa, como iogurte grosso |
| 1:5:5 | 100% | 5× | 8 a 12 h | Bem láctico: suave e cremoso | Cremosa, como iogurte grosso |
| 1:10:10 | 100% | 10× | 12 a 16 h | Bem láctico: suave e cremoso | Cremosa, como iogurte grosso |
| 1:20:20 | 100% | 20× | 16 a 24 h | Bem láctico: suave e cremoso | Cremosa, como iogurte grosso |
| 2:4:5 | 80% | 2,5× | 8 a 12 h | Equilibrado | Pastosa, mais firme que iogurte |
| 1:4:5 | 80% | 5× | 12 a 16 h | Láctico: suave, azedinho de iogurte | Pastosa, mais firme que iogurte |
| 1:2:3 | 67% | 3× | 8 a 12 h | Acético: mais azedo | Firme, de sovar na mão |
| 1:1:2 | 50% | 2× | 6 a 8 h | Bem acético: azedo e pungente | Firme, de sovar na mão |
| 1:5:10 | 50% | 10× | 16 a 24 h | Acético: mais azedo | Firme, de sovar na mão |

## Apêndice B. Gerar o PDF

O arquivo é Markdown comum. Com pandoc e um motor que entenda português:

```bash
pandoc "teorias do levain.md" -o "teorias do levain.pdf" \
  --pdf-engine=xelatex \
  -V lang=pt-BR \
  -V geometry:margin=2.4cm \
  -V mainfont="TeX Gyre Pagella" \
  -V fontsize=11pt
```

O comentário de licença na primeira linha não entra no miolo. Se o motor não achar a fonte, troque `mainfont` por uma família com acentos instalada na máquina. O PDF não faz parte do cache do app. O que a página carrega continua sendo `index.html`, `calc.js` e o resto listado em `ServiceWorker.js`.
