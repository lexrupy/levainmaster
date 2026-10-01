#!/usr/bin/env python3
"""Gera as ilustrações de miolo (img/miolo-N-*.svg), uma por faixa de BANDS.

Mesmo pão, mesmo pano e mesmo enquadramento em todas; só os alvéolos mudam.
A semente é fixa, então rodar de novo gera os mesmos arquivos.

    python3 tools/gerar-miolos.py
"""

import math
import random
from pathlib import Path

W, H = 600, 400
VIEW = "36 44 528 352"         # recorte 3:2 que aproxima o pão
CX, BASE = 300, 338          # centro e base do miolo
A, B, P = 222, 246, 2.35     # semi-eixos e expoente da superelipse do miolo
CRUST = 13                   # espessura da casca

# (raio mínimo, raio máximo, quantidade), do maior para o menor.
# alongar: quanto o alvéolo pode esticar; torto: irregularidade do contorno;
# parede: espessura mínima entre alvéolos; brilho: paredes úmidas.
LEVELS = [
    dict(slug="1-firme", tiers=[(1.0, 2.6, 520)], alongar=1.2, torto=0.10, parede=1.6, brilho=0.0, poros=0.34),
    dict(slug="2-fechado", tiers=[(3.0, 4.6, 40), (1.2, 3.0, 460)], alongar=1.35, torto=0.12, parede=1.6, brilho=0.0, poros=0.30),
    dict(slug="3-macio", tiers=[(6.5, 11, 22), (3.0, 6.0, 150), (1.2, 3.0, 320)], alongar=1.8, torto=0.18, parede=1.8, brilho=0.0, poros=0.26),
    dict(slug="4-levemente-aberto", tiers=[(11, 18, 16), (5.0, 10, 90), (2.0, 5.0, 260)], alongar=1.9, torto=0.22, parede=2.0, brilho=0.05, poros=0.22),
    dict(slug="5-aberto-irregular", tiers=[(19, 32, 10), (9, 17, 32), (3.5, 8, 150), (1.5, 3.5, 220)], alongar=2.4, torto=0.30, parede=2.2, brilho=0.12, poros=0.20),
    dict(slug="6-muito-aberto", tiers=[(27, 40, 11), (13, 24, 24), (5, 11, 70), (2.0, 4.5, 150)], alongar=1.7, torto=0.24, parede=2.4, brilho=0.22, poros=0.18),
    dict(slug="7-rendado", tiers=[(34, 52, 14), (18, 28, 22), (8, 15, 40), (2.5, 6, 160)], alongar=1.2, torto=0.2, parede=1.6, brilho=0.34, poros=0.16),
]


def inside(x, y, margin=0.0):
    """Ponto dentro do miolo (metade de cima da superelipse, cortada na base)."""
    if y > BASE - margin:
        return False
    dx = abs(x - CX) / (A - margin)
    dy = abs(y - BASE) / (B - margin)
    return dx ** P + dy ** P <= 1


def outline(a, b, base_y, sag):
    """Contorno do pão: domo em superelipse e base levemente curva."""
    pts = []
    for i in range(121):
        t = math.pi * i / 120
        c, s = math.cos(t), math.sin(t)
        x = CX + a * math.copysign(abs(c) ** (2 / P), c)
        y = base_y - b * abs(s) ** (2 / P)
        pts.append((x, y))
    d = "M " + " L ".join(f"{x:.1f} {y:.1f}" for x, y in pts)
    return d + f" Q {CX} {base_y + sag} {pts[0][0]:.1f} {pts[0][1]:.1f} Z"


def blob(rng, x, y, r, along, torto):
    """Contorno fechado e irregular de um alvéolo (Catmull-Rom em Bézier)."""
    n = 9
    rot = rng.uniform(0, math.pi)
    k = rng.uniform(1, along)
    pts = []
    for i in range(n):
        t = 2 * math.pi * i / n
        rr = r * (1 + rng.uniform(-torto, torto))
        px, py = rr * math.cos(t) * k ** 0.5, rr * math.sin(t) / k ** 0.5
        pts.append((x + px * math.cos(rot) - py * math.sin(rot), y + px * math.sin(rot) + py * math.cos(rot)))
    d = f"M {pts[0][0]:.1f} {pts[0][1]:.1f}"
    for i in range(n):
        p0, p1, p2, p3 = pts[i - 1], pts[i], pts[(i + 1) % n], pts[(i + 2) % n]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d += f" C {c1[0]:.1f} {c1[1]:.1f} {c2[0]:.1f} {c2[1]:.1f} {p2[0]:.1f} {p2[1]:.1f}"
    return d + " Z", r * (1 + torto) * k ** 0.5


def place(rng, level):
    placed = []  # (x, y, raio de colisão)
    shapes = []
    for rmin, rmax, count in level["tiers"]:
        tries = 0
        made = 0
        while made < count and tries < count * 2000:
            tries += 1
            r = rng.uniform(rmin, rmax)
            x = rng.uniform(CX - A, CX + A)
            y = rng.uniform(BASE - B, BASE)
            d, reach = blob(rng, x, y, r, level["alongar"], level["torto"])
            if not inside(x, y, reach + 4):
                continue
            wall = level["parede"]
            if any(math.hypot(x - px, y - py) < reach + pr + wall for px, py, pr in placed):
                continue
            placed.append((x, y, reach))
            shapes.append((d, x, y, r))
            made += 1
    return shapes


def svg(level, seed):
    rng = random.Random(seed)
    shapes = place(rng, level)
    crumb = outline(A, B, BASE, 6)
    crust = outline(A + CRUST, B + CRUST, BASE + 6, 7)
    holes = []
    for d, x, y, r in shapes:
        holes.append(f'<path d="{d}" fill="url(#hole)" stroke="#f7eedd" stroke-width="{0.5 + r * 0.03:.2f}" stroke-opacity="0.8"/>')
        if level["brilho"] and r > 9:
            holes.append(
                f'<ellipse cx="{x - r * 0.25:.1f}" cy="{y + r * 0.35:.1f}" rx="{r * 0.35:.1f}" ry="{r * 0.16:.1f}" '
                f'fill="#fffaf0" opacity="{level["brilho"]:.2f}"/>'
            )
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{VIEW}" width="{W}" height="{H}">
<defs>
  <radialGradient id="cloth" cx="50%" cy="38%" r="75%">
    <stop offset="0" stop-color="#f4efe7"/><stop offset="1" stop-color="#dcd3c6"/>
  </radialGradient>
  <filter id="weave" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.012 0.06" numOctaves="2" seed="4"/>
    <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.40  0 0 0 0 0.34  0 0 0 0.22 0"/>
  </filter>
  <linearGradient id="crust" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#8f5320"/><stop offset="0.35" stop-color="#b8742f"/>
    <stop offset="0.8" stop-color="#cf9348"/><stop offset="1" stop-color="#a5662a"/>
  </linearGradient>
  <linearGradient id="crumbtone" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#f1e5cd"/><stop offset="1" stop-color="#e9dbc0"/>
  </linearGradient>
  <linearGradient id="hole" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#a98a5f"/><stop offset="0.55" stop-color="#cdb48c"/><stop offset="1" stop-color="#eadbc0"/>
  </linearGradient>
  <filter id="pores" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="11"/>
    <feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.44  0 0 0 0 0.30  0 0 0 -2.2 1.25"/>
  </filter>
  <filter id="soft"><feGaussianBlur stdDeviation="10"/></filter>
  <clipPath id="crumbclip"><path d="{crumb}"/></clipPath>
</defs>
<rect width="{W}" height="{H}" fill="url(#cloth)"/>
<rect width="{W}" height="{H}" filter="url(#weave)"/>
<ellipse cx="{CX}" cy="{BASE + 18}" rx="{A + 30}" ry="16" fill="#5a4630" opacity="0.28" filter="url(#soft)"/>
<path d="{crust}" fill="url(#crust)"/>
<path d="{crumb}" fill="url(#crumbtone)"/>
<g clip-path="url(#crumbclip)">
  <rect width="{W}" height="{H}" filter="url(#pores)" opacity="{level["poros"]:.2f}"/>
  {"".join(holes)}
</g>
<path d="{crumb}" fill="none" stroke="#c99a5c" stroke-width="2.5" stroke-opacity="0.55"/>
</svg>
'''


def main():
    out = Path(__file__).resolve().parent.parent / "img"
    for i, level in enumerate(LEVELS):
        path = out / f"miolo-{level['slug']}.svg"
        path.write_text(svg(level, 1000 + i), encoding="utf-8")
        print(path.relative_to(out.parent), f"{path.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
