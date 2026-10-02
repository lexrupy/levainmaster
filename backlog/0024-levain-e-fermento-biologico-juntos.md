# 0024 — Levain e fermento biológico na mesma receita

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-01
- **Status:** concluída
- **Arquivos:** `calc.js`, `app.js`, `index.html`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

Há receitas com levain e um pouco de fermento seco junto (de 0,1% a 0,5%), para acelerar ou dar segurança à fermentação, e receitas com fermento biológico e um levain para sabor. O app só permitia um fermento.

## O que foi feito

- **Dois fermentos:** a receita pode ter um segundo fermento (`role: "ferment2"`), no máximo um, sempre do tipo que falta em relação ao principal.
- **No "+ Ingrediente"**, o grupo **Segundo fermento** oferece:
  - com fermento seco ou fresco no principal: **Levain** (começa em 20% e abre a ativação);
  - com levain no principal: **Fermento seco** (0,3%) ou **Fermento fresco** (0,9%), como reforço.
- **Linha do segundo fermento:**
  - biológico: tem seletor seco ↔ fresco, que converte o percentual (×3), e mostra a equivalência;
  - levain: tem lápis, proporção, hidratação e divisão em gramas, como o principal;
  - nos dois casos, o × remove.
- **Sem conflito:** enquanto houver o segundo, o seletor principal esconde o tipo dele. Não dá para ter dois levains, nem dois biológicos.
- **Contas:** `isFerment` reconhece os dois. A água da alimentação do levain entra na hidratação seja ele o principal ou o segundo; o fermento biológico não soma água.
- **Resumo da receita salva:** lista os dois, por exemplo "Levain 20% · 1:2:2 + Fermento fresco 0,9%".
- **Estado salvo:** `normalizeState` descarta um segundo fermento inválido (do mesmo tipo do principal, ou repetido). Sem migração das receitas antigas, combinado.
- `CACHE` subiu para `padeiro-v33`.

## Critérios de aceite

Receita inicial (500 g, água 65%):

- [x] Com fermento seco, o menu oferece "Levain" como segundo fermento
- [x] Adicionar o levain abre a ativação; a hidratação vai de 65% para 73% (20% em 1:2:2), e o seletor principal passa a oferecer só seco e fresco
- [x] Com o segundo já na receita, o menu não oferece outro
- [x] Remover o levain devolve a hidratação a 65% e o Levain ao seletor principal
- [x] Com levain no principal, o menu oferece Fermento seco e Fermento fresco; o seco de reforço entra com 0,3%, não muda a hidratação e soma 1,5 g à massa
- [x] Trocar o reforço de seco para fresco converte 0,3% em 0,9% ("Equivale a 0,3% de seco")
- [x] Salvar e abrir a receita traz os dois fermentos de volta

## Fora do escopo

Migrar receitas e estados salvos antes desta mudança.
