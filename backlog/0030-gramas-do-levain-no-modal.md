# 0030 — Editar os gramas de levain no modal de ativação

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-01
- **Status:** concluída
- **Arquivos:** `index.html`, `app.js`, `app.css`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

No modal de ativação, os gramas de levain na massa eram só leitura. Para mudar a quantidade era preciso fechar o modal e editar a linha do fermento.

## O que foi feito

- **"N g na massa" editável:** o valor fica sublinhado e vira campo ao clicar, como os gramas da lista. Ao lado aparece também o percentual da farinha ("150 g na massa · 30% da farinha").
- **Atualiza na hora:** digitar os gramas recalcula o percentual do levain sobre a farinha, e a receita, a divisão isca : água : farinha, o perfil e a hidratação total acompanham.
- **Enter ou sair** confirma; **Esc** desfaz e não fecha o modal.
- **Levain como segundo fermento:** vale também quando o levain é o segundo fermento.
- **Com a farinha em 0:** o campo não abre.
- **Uma edição por vez:** o campo usa uma chave própria (`levainGrams`), para não abrir junto com o campo de gramas da lista.
- `CACHE` subiu para `padeiro-v39`.

## Critérios de aceite

Receita inicial com levain 20% em 1:2:2 (500 g de farinha):

- [x] O modal mostra "100 g na massa · 20% da farinha"
- [x] Digitar 150 e Enter: "150 g na massa · 30% da farinha", divisão 30 / 60 / 60 g, linha do levain em 30% e 150 g, hidratação total de 73% para 77%
- [x] Digitar 999 e Esc: volta a 150 g, e o modal continua aberto
- [x] Concluir fecha o modal com os 150 g mantidos
