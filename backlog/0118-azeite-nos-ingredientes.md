# 0118 — Azeite no menu de ingredientes

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-16
- **Status:** concluída
- **Arquivos:** `calc.js`, `app.js`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

O azeite é gordura comum em pães (focaccia, ciabatta) e não estava no "+ Ingrediente".

## O que foi feito

- `Azeite` entra em `ADDABLE`, no grupo "Ovos, leite e gordura", com água 0 (óleo puro) e `enrich: "gordura"`, como a manteiga.
- Ícone próprio (garrafa com gota) e halo de líquido, pois a classificação considera a consistência.
- Cache atualizado para `padeiro-v124`.

## Critérios de aceite

- [x] Azeite aparece no menu e soma gramas pelo percentual da farinha.
- [x] Não contribui água na hidratação total.
- [x] Conta como gordura para o pão enriquecido.

## Como verificar

Adicionar Azeite a 5% ou mais: a hidratação não muda e o card mostra "Pão amanteigado".

## Fora do escopo

- Outros óleos.
