#!/usr/bin/env python3
# Percentual do padeiro — © 2026 Alexandre da Silva
# SPDX-License-Identifier: LGPL-3.0-or-later
"""Gera os ícones do app (icons/*.png) a partir de icons/fonte-icone.png.

A arte original é um cartão com moldura. O Android recorta o ícone "maskable"
em círculo ou forma arredondada, e só garante o círculo central de 80% (área
segura). Por isso os ícones aqui são sangrados: fundo bege até as bordas e a
ilustração (pão, pote, copo e selo de %) recortada da arte, sem a moldura,
centralizada e no tamanho que cabe em cada caso.

    python3 tools/gerar-icones.py

Gera também icons/glifo.jpg, o ícone da página (topo e Sobre): a arte
recortada por dentro da moldura, sem a borda, para a figura aparecer maior
em 34 e 52 px.

Antes de gerar, os ícones atuais vão para icons/backup/AAAAMMDD-HHMMSS/
(pasta fora do git, no .gitignore). Precisa de Pillow.
"""

import shutil
from datetime import datetime
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
ICONS = ROOT / "icons"
SOURCE = ICONS / "fonte-icone.png"

PAPER = (229, 214, 181)        # bege do cartão da arte original
ART_BOX = (48, 132, 472, 468)  # ilustração dentro da moldura, em px da arte de 512
INNER_BOX = (38, 36, 476, 474)  # quadrado por dentro da moldura dupla da arte de 512
GLYPH = "glifo.jpg"  # sem transparência: JPEG fica bem mais leve
GLYPH_SIZE = 256  # o Sobre mostra com 104 px; 256 cobre telas de alta densidade

# nome, tamanho, fração do lado que a ilustração pode ocupar (pela diagonal)
OUTPUTS = [
    # maskable: a ilustração inteira cabe no círculo de 80%, com folga
    ("icon-maskable-512.png", 512, 0.76),
    # "any": quadrado sangrado, sem recorte; pode ocupar mais
    ("icon-512.png", 512, 0.96),
    ("icon-192.png", 192, 0.96),
    # iPhone arredonda os cantos sozinho
    ("apple-touch-icon.png", 180, 0.90),
]


def art():
    """A ilustração recortada, com as bordas esfumadas para sumir no fundo."""
    crop = Image.open(SOURCE).convert("RGB").crop(ART_BOX)
    w, h = crop.size
    feather = 18
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle((feather, feather, w - feather, h - feather), radius=feather * 2, fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(feather / 2))
    return crop, mask


def icon(size, fill):
    crop, mask = art()
    w, h = crop.size
    # a diagonal da ilustração ocupa `fill` do lado (no maskable, cabe no círculo)
    diag = (w ** 2 + h ** 2) ** 0.5
    scale = size * fill / diag
    tw, th = round(w * scale), round(h * scale)
    canvas = Image.new("RGB", (size, size), PAPER)
    canvas.paste(crop.resize((tw, th), Image.LANCZOS), ((size - tw) // 2, (size - th) // 2), mask.resize((tw, th), Image.LANCZOS))
    return canvas


def glyph():
    """A arte original recortada por dentro da moldura: o quadro sem a borda."""
    crop = Image.open(SOURCE).convert("RGB").crop(INNER_BOX)
    return crop.resize((GLYPH_SIZE, GLYPH_SIZE), Image.LANCZOS)


def backup():
    names = [name for name, *_ in OUTPUTS] + [GLYPH]
    current = [ICONS / name for name in names if (ICONS / name).exists()]
    if not current:
        return
    dest = ICONS / "backup" / datetime.now().strftime("%Y%m%d-%H%M%S")
    dest.mkdir(parents=True, exist_ok=True)
    for path in current:
        shutil.copy2(path, dest / path.name)
    print(f"backup: {dest.relative_to(ROOT)} ({len(current)} arquivos)")


def main():
    backup()
    for name, size, fill in OUTPUTS:
        path = ICONS / name
        icon(size, fill).save(path, optimize=True)
        print(path.relative_to(ROOT), f"{size}x{size}", f"{path.stat().st_size // 1024} KB")
    path = ICONS / GLYPH
    glyph().save(path, quality=88, optimize=True, progressive=True)
    print(path.relative_to(ROOT), f"{GLYPH_SIZE}x{GLYPH_SIZE}", f"{path.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
