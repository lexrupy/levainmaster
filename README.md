<!-- SPDX-License-Identifier: LGPL-3.0-or-later -->

# Levain Master

Calculadora de percentual do padeiro, em português. A farinha da receita vale 100%. O app mostra os gramas, o peso da massa, a hidratação total e, a partir dela, a textura e um pão típico.

**[Abrir o Levain Master](https://lexrupy.github.io/levainmaster/)**

Dá para instalar no Android. Depois da primeira visita, funciona sem rede.

## O que ele faz

- Ingredientes em percentual da farinha, com o peso em gramas.
- Fermento seco, fresco ou levain. A ordem do levain é a brasileira, L:A:F (isca, água e farinha).
- Hidratação total com a água da receita, a água dos ingredientes e a água e a farinha da alimentação do levain. A isca só entra se essa opção estiver ligada em Configurações.
- Receitas salvas no próprio aparelho, card para compartilhar e um simulador de levain que não grava na receita.

O estudo das proporções está em [teorias do levain.md](<teorias do levain.md>).

## No computador

O link acima abre a cópia publicada. Para servir esta pasta:

```bash
python3 -m http.server 8769 --bind 127.0.0.1
```

Abra [http://127.0.0.1:8769/](http://127.0.0.1:8769/). `python3 start.py` sobe em [http://127.0.0.1:8765/](http://127.0.0.1:8765/). Abrir o arquivo direto (`file://`) não instala o app.

## Testes

```bash
npm test
```

Não precisa instalar nada. `npm run test:ui` usa o Chrome já instalado e a página em `http://127.0.0.1:8769`.

## Licença

© 2026 Alexandre da Silva, sob a [GNU LGPL 3.0 ou posterior](https://www.gnu.org/licenses/lgpl-3.0.html). O texto está em [COPYING.LESSER](COPYING.LESSER) e remete à GPL 3.0 em [COPYING](COPYING).

Vue e Pico CSS estão em `vendor/` sob a licença MIT. A fonte Outfit está sob a SIL Open Font License 1.1, em [vendor/OFL-Outfit.txt](vendor/OFL-Outfit.txt).
