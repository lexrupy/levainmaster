# 0126 — Fermento químico para bolos

- **Autor:** Alexandre da Silva
- **Data:** 2026-11-02
- **Status:** concluída
- **Arquivos:** `index.html`, `app.js`, `ServiceWorker.js`

## Contexto

Permitir montar receitas de bolo usando fermento químico no lugar do fermento biológico.

## O que foi feito

- Adicionada a opção “Fermento químico” ao seletor do fermento principal.
- Ao trocar para fermento químico, o percentual começa em 2% e continua editável; a água permanece em 0%.
- A troca entre fermento químico, biológico e levain conserva os percentuais e o tipo de fermento biológico usados anteriormente.
- O fermento químico usa ícone de pó e aparece como “Químico” no card e nos resumos de receitas.
- Cache da PWA atualizado para `padeiro-v139`.

## Critérios de aceite

- [x] É possível selecionar fermento químico como fermento principal.
- [x] Ele não soma água à hidratação nem usa a conversão de fermento seco/fresco.
- [x] O percentual é editável e alternar o tipo preserva a configuração anterior.

## Como verificar

Na linha do fermento principal, selecionar “Fermento químico”, conferir o percentual de 2%, editá-lo e alternar entre os tipos de fermento.

## Fora do escopo

Não foram adicionadas conversões entre fermento químico e fermento biológico.
