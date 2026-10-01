# 0009 — Casca mais realista nas ilustrações; backup a cada geração

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-01
- **Status:** concluída
- **Arquivos:** `tools/gerar-miolos.py`, `img/miolo-N-*.svg`, `.gitignore`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

As ilustrações da 0007 acertaram o miolo, mas a parte que não muda era simples demais: um domo perfeito com uma casca de espessura uniforme, sem nada da foto anterior. Gerar de novo também sobrescrevia as imagens sem guardar a versão anterior.

## O que foi feito

- **Contorno:** o pão tem uma ondulação leve e o lado da pestana cresce um pouco mais. Não é mais uma superelipse perfeita.
- **Casca:** grossa e escura em cima, fina e dourada nas laterais, com uma base fina e escura. Tem relevo de tostado (`feDiffuseLighting` sobre ruído) e um brilho leve logo abaixo da borda de cima.
- **Pestana:** em cima à esquerda, a casca se levanta e uma fissura do corte entra na diagonal.
- **Miolo:** relevo fino na superfície e uma faixa mais densa e amarelada junto da casca.
- **Fundo:** liso, sem o pano.
- **Igual em todas:** o contorno, a casca e a pestana ficam em `loaf()`. Só os alvéolos mudam entre as faixas.
- **Backup:** antes de gerar, o script copia as ilustrações atuais para `img/backup/AAAAMMDD-HHMMSS/`. A pasta está no `.gitignore`; as versões commitadas continuam no histórico do git.
- A geração da 0007 foi recuperada do commit `c3e71f1` para `img/backup/20261001-c3e71f1/`.
- `CACHE` subiu para `padeiro-v18`.

## Critérios de aceite

- [x] O contorno não é uma curva perfeita, e a casca é mais grossa em cima que nas laterais
- [x] A casca tem relevo e variação de cor; a pestana aparece em cima, à esquerda
- [x] O pão, a casca e a pestana são idênticos nas 7 faixas
- [x] Sem o pano no fundo
- [x] Rodar o script cria uma pasta nova em `img/backup/` com as 7 ilustrações anteriores
- [x] `img/backup/` não aparece no `git status`
- [x] As 7 faixas continuam carregando a sua imagem no app, com os cantos arredondados

## Como verificar

```bash
python3 tools/gerar-miolos.py   # imprime a pasta de backup e as 7 imagens
git status --short              # img/backup/ não aparece
```

## Fora do escopo

- Continua sendo ilustração, não foto.
- O `img/backup/` só existe na máquina onde o script rodou.
