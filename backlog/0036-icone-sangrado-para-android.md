# 0036 — Ícone sangrado, que não fica quadrado no Android

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-02
- **Status:** concluída
- **Arquivos:** `tools/gerar-icones.py`, `icons/*.png`, `icons/fonte-icone.png`, `.gitignore`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

O ícone era um cartão quadrado com moldura dupla sobre fundo cinza. O Android recorta o ícone "maskable" em círculo ou forma arredondada, e o resultado era um quadrado bege com moldura dentro do círculo, com os cantos cinza.

## O que foi feito

- **Gerador:** `tools/gerar-icones.py` gera os ícones a partir da arte original, guardada como `icons/fonte-icone.png`.
  - recorta a ilustração (pão, pote, copo e selo de %), sem a moldura, com as bordas esfumadas;
  - põe a ilustração sobre um fundo bege contínuo (`#e5d6b5`, a cor do cartão), que vai até as bordas;
  - no `icon-maskable-512.png`, deixa a ilustração inteira dentro do círculo central de 80%, a área segura que o Android garante;
  - no `icon-512`, `icon-192` e `apple-touch-icon` (180), a ilustração é maior, porque esses não são recortados (o iPhone só arredonda os cantos).
- **Backup:** antes de gerar, o script copia os ícones atuais para `icons/backup/AAAAMMDD-HHMMSS/`, no `.gitignore`. Os ícones anteriores também continuam no histórico do git.
- `CACHE` subiu para `padeiro-v47`.

## Critérios de aceite

- [x] Com máscara de círculo, squircle e quadrado arredondado, o ícone não mostra moldura nem cantos de outra cor
- [x] A ilustração inteira fica dentro do círculo de 80% no maskable
- [x] Os quatro ícones são gerados de novo pelo script, com backup dos anteriores

## Como verificar

```bash
python3 tools/gerar-icones.py
```

No Android, remova o app da tela inicial e instale de novo: o launcher costuma guardar o ícone antigo.
