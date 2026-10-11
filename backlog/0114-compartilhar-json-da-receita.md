# 0114 — Compartilhar o JSON da receita

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-11
- **Status:** concluída
- **Arquivos:** `app.js`, `ServiceWorker.js`

## Contexto

O botão de exportar receita JSON baixava o arquivo diretamente, dificultando enviá-lo a outro aparelho.

## O que foi feito

- Em navegadores compatíveis, o botão agora abre o compartilhamento do sistema com o arquivo JSON anexado.
- Se o navegador não aceitar compartilhar arquivos, o JSON continua sendo baixado como alternativa.
- Cancelar a folha de compartilhamento não inicia um download inesperado.
- Cache atualizado para `padeiro-v120`.

## Critérios de aceite

- [x] Compartilhar JSON oferece o arquivo de receita às opções do sistema operacional.
- [x] Navegadores sem compartilhamento de arquivos baixam o JSON.
- [x] Cancelar o compartilhamento não baixa o arquivo.

## Como verificar

Em um navegador móvel compatível, abrir Compartilhar receita e tocar em Exportar receita JSON; selecionar um destino de outro aparelho. Em um navegador sem Web Share de arquivos, confirmar o download alternativo.

## Fora do escopo

- Mudar a importação individual de receitas.
