# Backlog

Cada melhoria ou correção vira uma tarefa aqui e um commit. O commit traz o arquivo da tarefa junto com a mudança.

## Nome do arquivo

`NNNN-titulo-curto.md`, com número sequencial de quatro dígitos. O número não é reaproveitado.

## Status

- `proposta` — combinada, ainda não feita
- `em andamento`
- `concluída` — feita, critérios conferidos e commitada
- `descartada` — não vai ser feita; diga o motivo na descrição

## Modelo

```markdown
# NNNN — Título

- **Autor:** Nome
- **Data:** AAAA-MM-DD
- **Status:** proposta | em andamento | concluída | descartada
- **Arquivos:** `calc.js`, `index.html`

## Contexto

Por que a tarefa existe: o problema, o pedido ou a ideia.

## O que foi feito

A mudança em si, e as decisões que não ficam óbvias no código.

## Critérios de aceite

- [ ] Condição verificável, com valores de exemplo quando houver
- [ ] ...

## Como verificar

Comandos ou passos no navegador (celular ~390 px e 560 px quando mexer na tela).

## Fora do escopo

O que ficou de lado de propósito.
```

Data é a do início da tarefa. Ao concluir, marque os critérios e troque o status no mesmo commit da mudança.
