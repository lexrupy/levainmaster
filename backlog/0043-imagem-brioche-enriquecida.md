# 0043 — Imagem de brioche para massa enriquecida

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-02
- **Status:** em andamento
- **Arquivos:** `AGENTS.md`, `calc.js`, `tools/gerar-miolos.py`, `img/brioche.jpeg`, `img/miolo-enriquecido.jpg`, `ServiceWorker.js`

## Contexto

Massas enriquecidas com ovos, leite, gordura, açúcar ou purê já usam uma imagem própria, mas compartilhavam a imagem genérica de miolo macio. A foto da fatia de brioche fornecida pelo usuário deixa essa categoria mais reconhecível.

Estudos de pão com gema relatam alterações na densidade e no tamanho médio das células, e estudos sobre gordura também encontram diferenças de textura e estrutura. Esses efeitos dependem da fórmula e do processo; a foto é uma referência visual de brioche, não uma previsão universal do miolo de qualquer receita enriquecida ([estudo com gema](https://www.sciencedirect.com/science/article/pii/S2212429220310269), [estudo com gordura](https://www.scielo.br/j/bjps/a/t5mP3cqDJRXFRSbgJsw6fqS/?lang=en), [estudo de estrutura do miolo](https://www.cerealsgrains.org/publications/cc/2001/January/Pages/78_1_1.aspx)).

## O que foi feito

- A imagem usada na tela é baseada na foto fornecida em `img/brioche.jpeg`; o original fica intacto.
- `tools/gerar-miolos.py --enriquecido` gera o recorte 3:2 em 600 × 400, preservando as proporções originais do pão.
- O gerador também mantém a ilustração SVG pura do brioche, disponível por `--enriquecido-svg`.
- Receitas classificadas como enriquecidas apontam para a imagem específica; a textura e o pão típico continuam determinados pela hidratação.
- Incluída a imagem na lista de arquivos do service worker para uso offline.

## Critérios de aceite

- [x] A imagem especial usa a fotografia de brioche fornecida e mantém o formato 3:2.
- [x] O gerador processa somente a foto com `--enriquecido` e preserva a geração ilustrada por `--enriquecido-svg`.
- [x] Receita enriquecida usa `img/miolo-enriquecido.jpg`; receitas comuns continuam usando a faixa de hidratação.
- [x] O arquivo entra no cache offline.
- [ ] Conferir visualmente a tela e o card compartilhável em navegador.

## Como verificar

- Executar `python3 tools/gerar-miolos.py --enriquecido` e confirmar a geração de `img/miolo-enriquecido.jpg`.
- Executar `python3 tools/gerar-miolos.py --enriquecido-svg` e confirmar que continua possível gerar o brioche ilustrado em SVG.
- Conferir uma fórmula enriquecida com ovos e gordura e uma fórmula sem enriquecedores em hidratações distintas.
- Conferir no navegador o enquadramento da imagem no cartão e no card compartilhável.

## Fora do escopo

- Afirmar um padrão anatômico único para todo pão enriquecido ou alterar as faixas de hidratação.
