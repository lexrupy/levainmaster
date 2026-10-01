# 0007 — Uma ilustração de miolo para cada textura

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-01
- **Status:** concluída
- **Arquivos:** `tools/gerar-miolos.py`, `img/miolo-N-*.svg`, `calc.js`, `ServiceWorker.js`, `AGENTS.md`

## Contexto

`BANDS` tem 7 texturas, mas só havia 4 fotos. Três pares de faixas mostravam a mesma imagem, e o miolo não mudava quando a hidratação passava, por exemplo, de Firme para Rígida.

## O que foi feito

- Sete ilustrações novas em SVG, uma por faixa, geradas por `tools/gerar-miolos.py`. O pão, a casca, o pano e o enquadramento são os mesmos em todas; só os alvéolos mudam: quantidade, tamanho, irregularidade, espessura das paredes e o brilho das paredes úmidas nas faixas altas.
- O script usa semente fixa, então rodar de novo gera os mesmos arquivos. Para ajustar uma faixa, mude `LEVELS` e gere de novo.
- As fotos `img/miolo-*.jpg` continuam no repositório como backup, mas saem do cache da PWA.

| Faixa | Textura | Pão | Imagem |
|---|---|---|---|
| até 57% | Firme, fácil de modelar | Bagel | `miolo-1-firme.svg` |
| até 62% | Rígida, segura o formato | Pretzel | `miolo-2-fechado.svg` |
| até 67% | Macia e elástica | Baguete | `miolo-3-macio.svg` |
| até 72% | Levemente pegajosa | Fermentação natural | `miolo-4-levemente-aberto.svg` |
| até 78% | Pegajosa | Ciabatta | `miolo-5-aberto-irregular.svg` |
| até 84% | Bem úmida | Focaccia | `miolo-6-muito-aberto.svg` |
| acima | Extremamente úmida | Focaccia de alta hidratação | `miolo-7-rendado.svg` |

- `CACHE` subiu para `padeiro-v16`.

## Critérios de aceite

- [x] Cada uma das 7 faixas mostra uma imagem diferente (slider em 50, 60, 65, 70, 75, 80 e 90%)
- [x] A abertura dos alvéolos cresce de uma faixa para a próxima
- [x] As 7 imagens têm o mesmo pão, pano e enquadramento, em 3:2
- [x] As fotos atuais não foram apagadas
- [x] As imagens novas estão no cache offline
- [x] Na miniatura, a imagem mantém os cantos arredondados

## Como verificar

```bash
python3 tools/gerar-miolos.py
```

Depois sirva a pasta e passe o slider da água pelas faixas.

## Fora do escopo

- As ilustrações não têm o realismo das fotos. Se quiser voltar às fotos, basta apontar `img` em `BANDS` para os `.jpg` e gerar as três que faltam (Rígida, Pegajosa, Bem úmida) a partir da mesma base.
- Quando o nome do pão ou a textura quebra em duas linhas, a imagem sobe 8 px. Fica para a tarefa 0008.
