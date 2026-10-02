# 0042 — Nome duplicado ao salvar

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-02
- **Status:** em andamento
- **Arquivos:** `app.js`, `index.html`, `app.css`, `ServiceWorker.js`

## Contexto

Ao salvar com o nome de uma receita já existente, é preciso escolher entre substituir a salva ou manter as duas.

## O que foi feito

- Nomes são comparados ignorando maiúsculas, acentos e espaços excedentes.
- A confirmação oferece “Substituir” ou “Criar novo”; cancelar, Esc e clique no fundo não salvam.
- Substituir preserva o identificador da receita original e atualiza seus dados e data. Criar novo mantém ambas.
- `CACHE` permanece em `padeiro-v54`, versão de publicação das mudanças pendentes.

## Critérios de aceite

- [x] Nome duplicado abre a escolha entre substituir e criar nova receita.
- [x] Cancelar, Esc e clique fora fecham a confirmação sem salvar.
- [x] Substituir atualiza a receita correspondente; criar novo mantém a anterior.
- [ ] Exercitar os três fluxos no navegador.

## Como verificar

- Salvar receitas chamadas “Pão”, “pão” e “ pao ” e conferir a confirmação.
- Escolher substituir e confirmar que só há uma receita atualizada.
- Escolher criar novo e confirmar que há duas receitas com mesmo nome.
- Repetir com Cancelar, Esc e clique no fundo; confirmar que nenhuma gravação acontece.

## Fora do escopo

- Impedir nomes repetidos na lista de receitas.
