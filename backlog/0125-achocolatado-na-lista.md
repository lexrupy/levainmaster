# 0125 — Achocolatado na lista de ingredientes

- **Autor:** Alexandre da Silva
- **Data:** 2026-11-02
- **Status:** concluída
- **Arquivos:** `calc.js`, `app.js`, `ServiceWorker.js`

## Contexto

Adicionar achocolatado à lista de ingredientes. Cacau em pó já constava na lista.

## O que foi feito

- Incluído “Achocolatado (Nescau)” no grupo de ovos, leite e gordura, com água 0 por ser pó e classificação de açúcar para a categoria de massa enriquecida.
- Reutilizado o ícone de farinha/pó.
- Cache da PWA atualizado para `padeiro-v138`.

## Critérios de aceite

- [x] “Cacau em pó” e “Achocolatado (Nescau)” aparecem na lista de ingredientes.
- [x] Achocolatado não adiciona água à hidratação e usa o ícone de pó.

## Como verificar

Na tela, abrir “+ Ingrediente” e conferir os dois itens no grupo “Ovos, leite e gordura”.

## Fora do escopo

Não foram adicionadas outras marcas de achocolatado.
