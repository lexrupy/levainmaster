<!-- SPDX-License-Identifier: LGPL-3.0-or-later -->

# 0105 — Observações e transferência de receitas

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-10
- **Status:** concluída
- **Arquivos:** `calc.js`, `app.js`, `index.html`, `app.css`, `ServiceWorker.js`, `tests/service-worker.test.js`, `tests/ui/run.mjs`, `AGENTS.md`

## Contexto

O usuário pediu um campo de observações livres no fim dos ingredientes, incluído no card compartilhado, e formas de exportar e importar receitas entre dispositivos.

## O que foi feito

- O botão "Prescrições diversas" abre um campo de texto puro. Quebras de linha, espaços e tabulações são mantidos no estado e desenhados no fim do card quando há conteúdo.
- Observações e quantidade de porções fazem parte do estado salvo da receita.
- O botão de compartilhar abre uma prévia do card com ações para compartilhar a imagem ou exportar a receita como JSON.
- A área Receitas importa o JSON exportado e adiciona a receita à lista local, incluindo nome, ingredientes, observações e porções.
- O importador confere o formato e normaliza o estado antes de persistir.
- O cache subiu para `padeiro-v111`; os seletores do fluxo de compartilhar no roteiro de UI acompanham a nova prévia.

## Critérios de aceite

- [x] O campo de observações aparece após "+ Ingrediente" e preserva texto puro, linhas, espaços e tabulações.
- [x] Observações preenchidas aparecem depois da composição no PNG; sem observações, o card não reserva esse bloco.
- [x] O card abre em prévia com ações para compartilhar a imagem e exportar JSON.
- [x] O JSON inclui estado integral da receita, inclusive quantidade de porções e observações.
- [x] Importar o JSON válido salva a receita no dispositivo; arquivo inválido mostra uma mensagem e não altera a lista.
- [x] O cache e o teste do service worker apontam para v111.

## Como verificar

Preencher observações com linhas em branco, espaços iniciais e uma tabulação; abrir a prévia e conferir o bloco ao fim do card. Exportar o JSON, limpar ou abrir outro dispositivo e importar em Receitas; abrir a receita e conferir ingredientes, nome, porções e observações.

## Fora do escopo

Exportar ou importar configurações globais e calibrações do levain.
