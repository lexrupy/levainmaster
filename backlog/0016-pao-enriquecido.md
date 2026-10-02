# 0016 — Pão enriquecido muda o nome e a imagem do miolo

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-01
- **Status:** concluída
- **Arquivos:** `calc.js`, `index.html`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

O nome do pão vinha só da hidratação. Com ovos ou batata na massa, o app ainda dizia "Focaccia" ou "Ciabatta", o que é um contrassenso. Uma tabela completa de ingrediente × tipo de pão seria trabalho demais para o objetivo da ferramenta, então a regra é deliberadamente simples.

## O que foi feito

- Os ingredientes de `ADDABLE` que enriquecem a massa ganharam o campo `enrich`:
  - **ovos:** Ovos
  - **leite:** leites, leite em pó, leitelho, iogurte
  - **gordura:** manteiga, margarinas
  - **açúcar:** mel, melado
  - **purês:** batata, batata-doce, mandioca, abóbora, banana
  - Farinhas, amidos e cacau não entram. Ingredientes personalizados também não.
- `enrichedBread` decide o nome quando os enriquecedores somam **5% ou mais** da farinha:
  1. **Brioche** com ovos a partir de 15%, ou ovos junto com gordura a partir de 15%
  2. senão, um purê a partir de 10% dá nome ao pão: "Pão de batata", "Pão de batata-doce", "Pão de mandioca", "Pão de abóbora", "Pão de banana"
  3. senão, a categoria que pesa mais: "Pão enriquecido com ovos", "Pão de leite", "Pão amanteigado" ou "Pão adoçado"
- Enriquecido, o resumo mostra a imagem do miolo macio, fechado e uniforme, em vez da que viria da hidratação.
- A textura da massa ("Bem úmida", etc.) continua vindo da hidratação.
- `compute` devolve `enriched`, `bread` e `img`.
- `CACHE` subiu para `padeiro-v24`.

## Critérios de aceite

Receita inicial com água a 80%:

- [x] Sem extras: Focaccia, imagem muito aberta
- [x] Ovos 3%: continua Focaccia (abaixo de 5%)
- [x] Ovos 10%: "Pão enriquecido com ovos"
- [x] Ovos 20%: Brioche, imagem do miolo macio
- [x] Ovos 5% + manteiga 20%: Brioche
- [x] Batata cozida 25%: "Pão de batata"
- [x] Leite 30% + mel 5%: "Pão de leite"
- [x] Manteiga 8%: "Pão amanteigado"
- [x] Fubá 20%: continua Focaccia
- [x] Remover os ovos volta para Focaccia e para a imagem anterior

## Fora do escopo

- Uma tabela de tipos de pão por combinação de ingredientes.
- Açúcar refinado e óleo ainda não estão na lista de ingredientes.
