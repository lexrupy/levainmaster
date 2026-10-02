# 0010 — Casca da foto original com o miolo gerado encaixado

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-01
- **Status:** concluída
- **Arquivos:** `tools/gerar-miolos.py`, `img/miolo-N-*.svg`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

Depois da 0009, a casca desenhada ainda não chegava perto da foto original. A ideia foi usar a parte de fora real, igual nas quatro fotos, e gerar no Python só o miolo, encaixado no lugar certo.

## O que foi feito

- **Novo padrão:** o gerador usa `img/miolo-firme.jpg` como camada de fundo, embutida no SVG em JPEG 900 × 600. Casca, pestana, pano e a faixa clara junto da casca são os da foto.
- **Detecção do miolo:** o miolo é a região clara e pouco saturada ligada ao centro da foto; a casca a separa do pano. O contorno é traçado em 360° a partir do meio do miolo, pegando o maior raio com miolo em cada ângulo, e depois suavizado.
- **Encaixe:** o miolo gerado cobre esse contorno com a borda esfumada (máscara com desfoque), no tom mediano do miolo da foto.
- **Faixa 1:** os poros cresceram um pouco (1,4 a 3,2), porque sumiam no tom da foto.
- **Versão desenhada:** continua disponível com `--ilustrado`.
- **Dependências:** `numpy` e `Pillow`, só para gerar as imagens.
- `CACHE` subiu para `padeiro-v19`.

## Critérios de aceite

- [x] Casca, pestana e pano são os da foto original nas 7 faixas
- [x] O miolo gerado cobre o miolo da foto inteiro, inclusive a base e os cantos de baixo
- [x] Não aparece emenda entre o miolo gerado e a faixa clara da foto
- [x] A abertura dos alvéolos continua crescendo de uma faixa para a próxima
- [x] As 7 faixas carregam a sua imagem no app (slider em 50, 60, 65, 70, 75, 80 e 90%)
- [x] A geração anterior foi para `img/backup/` antes de ser sobrescrita
- [x] `--ilustrado` continua gerando o pão desenhado

## Como verificar

```bash
python3 tools/gerar-miolos.py
```

Sirva a pasta e passe o slider da água pelas faixas.

## Fora do escopo

- O miolo fica no tom acinzentado da foto.
- Cada SVG pesa de 150 a 340 KB por causa da foto embutida. Somadas, as 7 dão uns 1,6 MB no cache.
- O primeiro protótipo traçava o contorno a partir da base e deixava o miolo em "V", porque a base do miolo na foto é curva. Foi corrigido antes do commit.
