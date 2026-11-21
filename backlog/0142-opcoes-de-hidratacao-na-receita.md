# 0142 — Opções de hidratação gravadas na receita

- Autor: Alexandre da Silva
- Data: 2026-11-21
- Status: feito

## Contexto
"Considerar levain na hidratação" e "Considerar água e farinha da isca" ficavam só em Configurações, por aparelho. A mesma receita dava hidratações diferentes no celular e no PC.

## O que foi feito
`includeLevain` e `includeSeed` passaram a fazer parte do estado da receita (salvas, JSON, backup e gist). `compute` dá preferência ao valor da receita; a configuração do aparelho só cobre receita sem ele (`normalizeState` preenche com o padrão do aparelho). Os checkboxes de Configurações editam a receita aberta e a escolha vira o padrão do aparelho. O card compartilhado mostra o que entrou na hidratação, e a prévia ganhou "Exportar receita TXT" (ingredientes, seções, levain e observações). `CACHE` subiu para `padeiro-v171`.

## Critérios de aceite
- Mesma receita, mesma hidratação em qualquer aparelho.
- O card informa a base da hidratação no bloco do levain.
- O TXT sai pela folha de compartilhamento ou é baixado.

## Como verificar
`npm test`; alternar as opções em Configurações e ver a hidratação, o card e o TXT mudarem.
