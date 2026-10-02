#!/usr/bin/env python3
"""Gera as ilustrações de miolo (img/miolo-N-*.svg), uma por faixa de BANDS.

Mesmo pão e mesmo enquadramento em todas; só os alvéolos mudam.
A semente é fixa, então rodar de novo gera os mesmos arquivos.

    python3 tools/gerar-miolos.py              # casca da foto (padrão)
    python3 tools/gerar-miolos.py --ilustrado  # pão todo desenhado

No padrão, a casca, o pano e a faixa clara junto da casca vêm da foto
CASCA_FOTO, embutida no SVG; o script acha o miolo na foto e gera só os
alvéolos dentro dele. Esse modo precisa de numpy e Pillow.

Antes de gerar, as ilustrações atuais vão para img/backup/AAAAMMDD-HHMMSS/
(pasta fora do git, no .gitignore).
"""

import base64
import io
import math
import random
import shutil
import sys
from collections import deque
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CASCA_FOTO = ROOT / "img" / "miolo-firme.jpg"  # foto original; o miolo dela é coberto

W, H = 600, 400
VIEW = "36 40 528 352"         # recorte 3:2 que aproxima o pão
CX, BASE = 300, 338          # centro e base do miolo
A, B, P = 222, 246, 2.35     # semi-eixos e expoente da superelipse do miolo
EAR = 0.70 * math.pi         # onde fica a pestana do corte (em cima, à esquerda)

# (raio mínimo, raio máximo, quantidade), do maior para o menor.
# alongar: quanto o alvéolo pode esticar; torto: irregularidade do contorno;
# parede: espessura mínima entre alvéolos; brilho: paredes úmidas.
LEVELS = [
    dict(slug="1-firme", tiers=[(1.4, 3.2, 560)], alongar=1.2, torto=0.10, parede=1.6, brilho=0.0, poros=0.34),
    dict(slug="2-fechado", tiers=[(3.0, 4.6, 40), (1.2, 3.0, 460)], alongar=1.35, torto=0.12, parede=1.6, brilho=0.0, poros=0.30),
    dict(slug="3-macio", tiers=[(6.5, 11, 22), (3.0, 6.0, 150), (1.2, 3.0, 320)], alongar=1.8, torto=0.18, parede=1.8, brilho=0.0, poros=0.26),
    dict(slug="4-levemente-aberto", tiers=[(11, 18, 16), (5.0, 10, 90), (2.0, 5.0, 260)], alongar=1.9, torto=0.22, parede=2.0, brilho=0.05, poros=0.22),
    dict(slug="5-aberto-irregular", tiers=[(19, 32, 10), (9, 17, 32), (3.5, 8, 150), (1.5, 3.5, 220)], alongar=2.4, torto=0.30, parede=2.2, brilho=0.12, poros=0.20),
    dict(slug="6-muito-aberto", tiers=[(27, 40, 11), (13, 24, 24), (5, 11, 70), (2.0, 4.5, 150)], alongar=1.7, torto=0.24, parede=2.4, brilho=0.22, poros=0.18),
    dict(slug="7-rendado", tiers=[(34, 52, 14), (18, 28, 22), (8, 15, 40), (2.5, 6, 160)], alongar=1.2, torto=0.2, parede=1.6, brilho=0.34, poros=0.16),
]


# --- O pão (igual em todas as faixas) ---------------------------------------

def superellipse(theta):
    c, s = abs(math.cos(theta)), abs(math.sin(theta))
    return 1 / ((c / A) ** P + (s / B) ** P) ** (1 / P)


def crumb_r(theta):
    """Raio do miolo a partir do centro da base, com uma ondulação leve."""
    wobble = 0.016 * math.sin(3 * theta + 0.7) + 0.010 * math.sin(7 * theta + 2.1) + 0.005 * math.sin(13 * theta + 0.4)
    lean = 0.025 * max(0.0, math.cos(theta - EAR)) ** 6  # o lado da pestana cresce um pouco mais
    return superellipse(theta) * (1 + wobble + lean)


def crust_t(theta):
    """Espessura da casca: grossa em cima, fina nas laterais, com a pestana levantada."""
    top = 7 + 12 * math.sin(theta) ** 1.6
    bumps = 0.9 * math.sin(11 * theta + 1.3) + 0.5 * math.sin(23 * theta)
    d = theta - EAR
    width = 0.035 * math.pi if d < 0 else 0.09 * math.pi
    ear = 11 * math.exp(-((d / width) ** 2))
    return top + bumps + ear


def polar(theta, r):
    return CX + r * math.cos(theta), BASE - r * math.sin(theta)


def inside(x, y, margin=0.0):
    """Ponto dentro do miolo, com folga."""
    if y > BASE - margin:
        return False
    theta = math.atan2(BASE - y, x - CX)
    return math.hypot(x - CX, BASE - y) <= crumb_r(theta) - margin


def path_of(pts, close=True):
    return "M " + " L ".join(f"{x:.1f} {y:.1f}" for x, y in pts) + (" Z" if close else "")


def loaf():
    """Contornos do miolo, da casca, da parte clara do corte e da fissura."""
    n = 240
    thetas = [math.pi * i / n for i in range(n + 1)]
    inner = [polar(t, crumb_r(t)) for t in thetas]
    outer = [polar(t, crumb_r(t) + crust_t(t)) for t in thetas]
    left_in, right_in = inner[-1], inner[0]
    base = [(left_in[0] + (right_in[0] - left_in[0]) * i / 20, BASE + 1.2 * math.sin(i * 1.7)) for i in range(1, 20)]
    crumb = path_of(inner + [(left_in[0] + 2, BASE + 1)] + base + [(right_in[0] - 2, BASE + 1)])
    left_out, right_out = outer[-1], outer[0]
    crust = path_of(outer + [(left_out[0] + 5, BASE + 8), (CX, BASE + 11), (right_out[0] - 5, BASE + 8)])
    # pestana: a fissura do corte entra na casca em diagonal, sob a borda levantada
    t0, t1 = EAR - 0.06 * math.pi, EAR + 0.005 * math.pi
    steps = [t0 + (t1 - t0) * i / 16 for i in range(17)]
    crack = [polar(t, crumb_r(t) + 1.5 + crust_t(t) * 0.62 * (t - t0) / (t1 - t0)) for t in steps]
    # brilho: uma faixa clara logo abaixo da borda de cima
    shine = [polar(t, crumb_r(t) + crust_t(t) - 3.5) for t in thetas[30:211]]
    return crumb, crust, path_of(crack, close=False), path_of(shine, close=False)


# --- Os alvéolos (mudam por faixa) ------------------------------------------

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
            if not inside(x, y, reach + 5):
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
    crumb, crust, crack, shine = loaf()
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
  <linearGradient id="table" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#f5f0e8"/><stop offset="1" stop-color="#e8dfd2"/>
  </linearGradient>
  <linearGradient id="crust" x1="0" y1="{BASE - B - 34}" x2="0" y2="{BASE + 12}" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#5a2c0e"/><stop offset="0.18" stop-color="#7c4115"/>
    <stop offset="0.45" stop-color="#a9662a"/><stop offset="0.78" stop-color="#c88a42"/>
    <stop offset="0.94" stop-color="#b9783a"/><stop offset="1" stop-color="#6e4020"/>
  </linearGradient>
  <clipPath id="crustclip"><path d="{crust}"/></clipPath>
  <filter id="glow"><feGaussianBlur stdDeviation="2.2"/></filter>
  <filter id="relief" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="4" seed="7" result="n"/>
    <feDiffuseLighting in="n" surfaceScale="2.4" lighting-color="#fff6e8" result="l">
      <feDistantLight azimuth="235" elevation="52"/>
    </feDiffuseLighting>
    <feComposite in="SourceGraphic" in2="l" operator="arithmetic" k1="1.15" k2="0" k3="0" k4="0" result="lit"/>
    <feComposite in="lit" in2="SourceAlpha" operator="in"/>
  </filter>
  <filter id="crumbrelief" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.35" numOctaves="3" seed="3" result="n"/>
    <feDiffuseLighting in="n" surfaceScale="1.4" lighting-color="#ffffff" result="l">
      <feDistantLight azimuth="235" elevation="60"/>
    </feDiffuseLighting>
    <feComposite in="SourceGraphic" in2="l" operator="arithmetic" k1="0.35" k2="0.72" k3="0" k4="0" result="lit"/>
    <feComposite in="lit" in2="SourceAlpha" operator="in"/>
  </filter>
  <linearGradient id="crumbtone" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#f3e8d2"/><stop offset="1" stop-color="#eadcc2"/>
  </linearGradient>
  <linearGradient id="hole" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#a98a5f"/><stop offset="0.55" stop-color="#cdb48c"/><stop offset="1" stop-color="#eadbc0"/>
  </linearGradient>
  <filter id="pores" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="11"/>
    <feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.44  0 0 0 0 0.30  0 0 0 -2.2 1.25"/>
  </filter>
  <filter id="soft"><feGaussianBlur stdDeviation="10"/></filter>
  <filter id="band"><feGaussianBlur stdDeviation="4"/></filter>
  <clipPath id="crumbclip"><path d="{crumb}"/></clipPath>
</defs>
<rect x="0" y="0" width="{W}" height="{H}" fill="url(#table)"/>
<ellipse cx="{CX}" cy="{BASE + 16}" rx="{A + 34}" ry="14" fill="#4a3420" opacity="0.32" filter="url(#soft)"/>
<path d="{crust}" fill="url(#crust)" filter="url(#relief)"/>
<path d="{shine}" fill="none" stroke="#f3cf98" stroke-width="4" opacity="0.35" filter="url(#glow)" clip-path="url(#crustclip)"/>
<path d="{crack}" fill="none" stroke="#e0ad6c" stroke-width="3.2" stroke-linecap="round" opacity="0.7" transform="translate(1.2 1.6)"/>
<path d="{crack}" fill="none" stroke="#3a1a06" stroke-width="2" stroke-linecap="round" opacity="0.9"/>
<path d="{crumb}" fill="url(#crumbtone)" filter="url(#crumbrelief)"/>
<g clip-path="url(#crumbclip)">
  <rect width="{W}" height="{H}" filter="url(#pores)" opacity="{level["poros"]:.2f}"/>
  {"".join(holes)}
  <path d="{crumb}" fill="none" stroke="#d9b880" stroke-width="16" opacity="0.55" filter="url(#band)"/>
</g>
<path d="{crumb}" fill="none" stroke="#9a6428" stroke-width="1.6" stroke-opacity="0.7"/>
</svg>
'''


def backup(out):
    current = sorted(out.glob("miolo-[0-9]-*.svg"))
    if not current:
        return
    dest = out / "backup" / datetime.now().strftime("%Y%m%d-%H%M%S")
    dest.mkdir(parents=True, exist_ok=True)
    for path in current:
        shutil.copy2(path, dest / path.name)
    print(f"backup: {dest.relative_to(out.parent)} ({len(current)} arquivos)")


# --- Casca da foto ------------------------------------------------------------

def use_photo():
    """Acha o miolo na foto e passa a usar o contorno dele para encaixar os alvéolos.

    Devolve a foto em base64, o contorno do miolo e o tom mediano do miolo.
    """
    global inside, CX, BASE, A, B
    import numpy as np
    from PIL import Image

    photo = Image.open(CASCA_FOTO).convert("RGB")
    pw, ph = photo.size
    scale = W / pw
    px = np.asarray(photo).astype(float) / 255
    hi, lo = px.max(-1), px.min(-1)
    crumbish = (hi > 0.62) & ((hi - lo) / (hi + 1e-6) < 0.30)  # claro e pouco saturado
    # o miolo é a região clara ligada ao centro da foto; a casca o separa do pano
    seen = np.zeros_like(crumbish)
    start = (ph // 2, pw // 2)
    seen[start] = True
    queue = deque([start])
    while queue:
        y, x = queue.popleft()
        for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
            if 0 <= ny < ph and 0 <= nx < pw and not seen[ny, nx] and crumbish[ny, nx]:
                seen[ny, nx] = True
                queue.append((ny, nx))
    ys, xs = np.nonzero(seen)
    cx, cy = (xs.min() + xs.max()) / 2, (ys.min() + ys.max()) / 2 + 20
    # contorno em 360° a partir do meio do miolo: o maior raio com miolo em cada ângulo
    n = 720
    radii = []
    for i in range(n):
        t = 2 * math.pi * i / n
        r = last = 0
        while True:
            x, y = int(round(cx + r * math.cos(t))), int(round(cy - r * math.sin(t)))
            if not (0 <= x < pw and 0 <= y < ph):
                break
            if seen[y, x]:
                last = r
            r += 1
        radii.append(last)
    radii = np.array(radii, float)
    radii = np.convolve(np.concatenate([radii[-3:], radii, radii[:3]]), np.ones(7) / 7, mode="valid") * scale
    ocx, ocy = cx * scale, cy * scale

    def outline_r(t):
        f = (t % (2 * math.pi)) / (2 * math.pi) * n
        i = int(f) % n
        return radii[i] + (radii[(i + 1) % n] - radii[i]) * (f - int(f))

    def inside_photo(x, y, margin=0.0):
        return math.hypot(x - ocx, ocy - y) <= outline_r(math.atan2(ocy - y, x - ocx)) - margin

    inside = inside_photo
    CX, BASE = ocx, ys.max() * scale
    A, B = radii.max(), BASE - (ocy - radii.max())

    pts = [(ocx + (outline_r(t) + 3) * math.cos(t), ocy - (outline_r(t) + 3) * math.sin(t)) for t in (2 * math.pi * i / 360 for i in range(360))]
    buf = io.BytesIO()
    photo.resize((900, 600), Image.LANCZOS).save(buf, "JPEG", quality=80, optimize=True, progressive=True)
    tone = np.median(px[seen], axis=0)
    return base64.b64encode(buf.getvalue()).decode(), path_of(pts), tone


def hex_of(rgb):
    return "#" + "".join(f"{int(max(0, min(1, v)) * 255):02x}" for v in rgb)


def svg_photo(level, seed, photo, crumb, tone):
    rng = random.Random(seed)
    shapes = place(rng, level)
    holes = []
    for d, x, y, r in shapes:
        holes.append(f'<path d="{d}" fill="url(#hole)" stroke="#f3e9d6" stroke-width="{0.5 + r * 0.03:.2f}" stroke-opacity="0.7"/>')
        if level["brilho"] and r > 9:
            holes.append(
                f'<ellipse cx="{x - r * 0.25:.1f}" cy="{y + r * 0.35:.1f}" rx="{r * 0.35:.1f}" ry="{r * 0.16:.1f}" '
                f'fill="#fffaf0" opacity="{level["brilho"]:.2f}"/>'
            )
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">
<defs>
  <linearGradient id="crumbtone" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="{hex_of(tone * 1.05)}"/><stop offset="1" stop-color="{hex_of(tone * 0.98)}"/>
  </linearGradient>
  <linearGradient id="hole" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#8f7550"/><stop offset="0.55" stop-color="#b59c76"/><stop offset="1" stop-color="#d9c8a8"/>
  </linearGradient>
  <filter id="crumbrelief" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.35" numOctaves="3" seed="3" result="n"/>
    <feDiffuseLighting in="n" surfaceScale="1.4" lighting-color="#ffffff" result="l">
      <feDistantLight azimuth="235" elevation="60"/>
    </feDiffuseLighting>
    <feComposite in="SourceGraphic" in2="l" operator="arithmetic" k1="0.35" k2="0.72" k3="0" k4="0" result="lit"/>
    <feComposite in="lit" in2="SourceAlpha" operator="in"/>
  </filter>
  <filter id="pores" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="11"/>
    <feColorMatrix values="0 0 0 0 0.50  0 0 0 0 0.40  0 0 0 0 0.27  0 0 0 -2.2 1.25"/>
  </filter>
  <filter id="feather"><feGaussianBlur stdDeviation="2.5"/></filter>
  <mask id="edge"><path d="{crumb}" fill="#fff" filter="url(#feather)"/></mask>
</defs>
<image width="{W}" height="{H}" href="data:image/jpeg;base64,{photo}"/>
<g mask="url(#edge)">
  <path d="{crumb}" fill="url(#crumbtone)" filter="url(#crumbrelief)"/>
  <rect width="{W}" height="{H}" filter="url(#pores)" opacity="{level["poros"]:.2f}"/>
  {"".join(holes)}
</g>
</svg>
'''


def main():
    out = ROOT / "img"
    illustrated = "--ilustrado" in sys.argv[1:]
    photo = None if illustrated else use_photo()
    backup(out)
    for i, level in enumerate(LEVELS):
        path = out / f"miolo-{level['slug']}.svg"
        text = svg(level, 1000 + i) if illustrated else svg_photo(level, 1000 + i, *photo)
        path.write_text(text, encoding="utf-8")
        print(path.relative_to(out.parent), f"{path.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
