// Levain Master — © 2026 Alexandre da Silva
// SPDX-License-Identifier: LGPL-3.0-or-later
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.Padeiro = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  // L:A:F em grupos: mais líquidos; hidratação 100%, da alimentação menor para a maior
  // (mais rápido → mais lento); e mais firmes, do mais úmido para o mais firme
  // (no empate, o de alimentação menor primeiro).
  const RATIOS = [
    { id: "1:5:4", L: 1, A: 5, F: 4, group: "Mais líquidos" },
    { id: "2:1:1", L: 2, A: 1, F: 1, group: "Hidratação 100%" },
    { id: "1:1:1", L: 1, A: 1, F: 1, group: "Hidratação 100%" },
    { id: "1:2:2", L: 1, A: 2, F: 2, group: "Hidratação 100%" },
    { id: "1:3:3", L: 1, A: 3, F: 3, group: "Hidratação 100%" },
    { id: "1:4:4", L: 1, A: 4, F: 4, group: "Hidratação 100%" },
    { id: "1:5:5", L: 1, A: 5, F: 5, group: "Hidratação 100%" },
    { id: "1:10:10", L: 1, A: 10, F: 10, group: "Hidratação 100%" },
    { id: "1:20:20", L: 1, A: 20, F: 20, group: "Hidratação 100%" },
    { id: "2:4:5", L: 2, A: 4, F: 5, group: "Mais firmes" },
    { id: "1:4:5", L: 1, A: 4, F: 5, group: "Mais firmes" },
    { id: "1:2:3", L: 1, A: 2, F: 3, group: "Mais firmes" },
    { id: "1:1:2", L: 1, A: 1, F: 2, group: "Mais firmes" },
    { id: "1:5:10", L: 1, A: 5, F: 10, group: "Mais firmes" },
  ];

  const RATIO_GROUPS = RATIOS.reduce((groups, ratio) => {
    let group = groups.find((item) => item.name === ratio.group);
    if (!group) groups.push((group = { name: ratio.group, items: [] }));
    group.items.push(ratio);
    return groups;
  }, []);

  // Faixas do app: escolhem textura, pão típico e imagem pela hidratação total.
  // Os limites seguem as faixas típicas das fontes (backlog/0034); os pães se sobrepõem,
  // então o nome é só um exemplo típico ("Típico de ...").
  const BANDS = [
    { max: 57, feel: "firme", sensacao: "Firme, fácil de modelar", pao: "Pão sovado", miolo: "Miolo denso, de alvéolos pequenos", img: "img/miolo-1-firme.svg" },
    { max: 62, feel: "firme", sensacao: "Rígida, segura o formato", pao: "Pão francês", miolo: "Miolo fechado e uniforme", img: "img/miolo-2-fechado.svg" },
    { max: 68, feel: "macia", sensacao: "Macia e elástica", pao: "Baguete", miolo: "Miolo uniforme, levemente aberto", img: "img/miolo-3-macio.svg" },
    { max: 78, feel: "macia", sensacao: "Levemente pegajosa", pao: "Pão de fermentação natural", miolo: "Miolo levemente aberto", img: "img/miolo-4-levemente-aberto.svg" },
    { max: 85, feel: "pegajosa", sensacao: "Pegajosa", pao: "Ciabatta", miolo: "Alvéolos abertos e irregulares", img: "img/miolo-5-aberto-irregular.svg" },
    { max: 95, feel: "umida", sensacao: "Bem úmida", pao: "Focaccia", miolo: "Miolo muito aberto", img: "img/miolo-6-muito-aberto.svg" },
    { max: Infinity, feel: "umida", sensacao: "Extremamente úmida", pao: "Focaccia de alta hidratação", miolo: "Miolo rendado, de alvéolos grandes", img: "img/miolo-7-rendado.svg" },
  ];

  // Faixa típica de hidratação de cada pão, segundo as fontes (backlog/0034).
  // approx: sem fonte com números; faixa estimada pelo app.
  const BREAD_INFO = {
    "Pão sovado": {
      min: 50, max: 57, approx: true,
      text: "Massa firme e bem sovada, de miolo fechado e macio. Pães de massa firme, como o bagel, ficam entre 52% e 58%.",
    },
    "Pão francês": {
      min: 58, max: 63, approx: true,
      text: "O pãozinho de padaria é de baixa hidratação: massa firme, casca fina e crocante e miolo leve.",
    },
    Baguete: {
      min: 62, max: 68,
      text: "Massa macia e elástica, que segura a modelagem comprida. Casca crocante e miolo uniforme, levemente aberto.",
    },
    "Pão de fermentação natural": {
      min: 70, max: 82,
      text: "Os pães rústicos de levain costumam ficar nessa faixa. Mais água abre o miolo, mas deixa a massa mais difícil de modelar.",
    },
    Ciabatta: {
      min: 80, max: 90,
      text: "Massa muito úmida, trabalhada com dobras em vez de sova. Alvéolos grandes e irregulares.",
    },
    Focaccia: {
      min: 75, max: 88,
      text: "Varia muito: a genovese tradicional fica perto de 55% a 60%; as modernas, de 70% a 80%; e há versões super-hidratadas, de 110% a 120%. Assada em forma, com bastante azeite.",
    },
    "Focaccia de alta hidratação": {
      min: 90, max: 120,
      text: "Massa quase líquida, que só se trabalha com dobras e forma bem untada. Miolo rendado, de alvéolos grandes.",
    },
  };

  const ENRICHED_INFO = "Pão enriquecido: o nome vem dos ingredientes, não da hidratação. Ovos, leite, gordura, açúcar ou purês somando 5% ou mais da farinha deixam o miolo mais fechado e macio, e a água deles entra na hidratação total.";

  // Água que entra na hidratação da massa. Farinha e pó secos ficam em 0:
  // a umidade de laboratório (~12%) não é água livre, e a farinha base também não conta a dela.
  const ADDABLE = [
    { group: "Farinhas e amidos", name: "Fubá", water: 0 },
    { group: "Farinhas e amidos", name: "Farinha de mandioca", water: 0 },
    { group: "Farinhas e amidos", name: "Amido de milho", water: 0 },
    { group: "Farinhas e amidos", name: "Polvilho doce", water: 0 },
    { group: "Farinhas e amidos", name: "Polvilho azedo", water: 0 },
    { group: "Farinhas e amidos", name: "Farinha de centeio", water: 0 },
    { group: "Farinhas e amidos", name: "Farinha integral", water: 0 },
    { group: "Farinhas e amidos", name: "Farinha de aveia", water: 0 },
    { group: "Farinhas e amidos", name: "Farinha de arroz", water: 0 },
    { group: "Cozidos e frutas", name: "Batata inglesa cozida", water: 77, enrich: "batata" },
    { group: "Cozidos e frutas", name: "Batata-doce cozida", water: 80, enrich: "batata-doce" },
    { group: "Cozidos e frutas", name: "Mandioca cozida", water: 69, enrich: "mandioca" },
    { group: "Cozidos e frutas", name: "Abóbora cozida", water: 90, enrich: "abóbora" },
    { group: "Cozidos e frutas", name: "Banana", water: 75, enrich: "banana" },
    { group: "Ovos, leite e gordura", name: "Ovos", water: 75, enrich: "ovos" },
    { group: "Ovos, leite e gordura", name: "Leite integral", water: 87, enrich: "leite" },
    { group: "Ovos, leite e gordura", name: "Leite desnatado", water: 91, enrich: "leite" },
    { group: "Ovos, leite e gordura", name: "Leite em pó integral", water: 0, enrich: "leite" },
    { group: "Ovos, leite e gordura", name: "Leite em pó desnatado", water: 0, enrich: "leite" },
    { group: "Ovos, leite e gordura", name: "Cacau em pó", water: 0 },
    { group: "Ovos, leite e gordura", name: "Leitelho", water: 90, enrich: "leite" },
    { group: "Ovos, leite e gordura", name: "Iogurte", water: 85, enrich: "leite" },
    { group: "Ovos, leite e gordura", name: "Manteiga", water: 16, enrich: "gordura" },
    { group: "Ovos, leite e gordura", name: "Margarina sem sal", water: 16, enrich: "gordura" },
    { group: "Ovos, leite e gordura", name: "Margarina com sal", water: 16, enrich: "gordura" },
    { group: "Ovos, leite e gordura", name: "Açúcar", water: 0, enrich: "açúcar" },
    { group: "Ovos, leite e gordura", name: "Açúcar mascavo", water: 0, enrich: "açúcar" },
    { group: "Ovos, leite e gordura", name: "Adoçante culinário", water: 0, enrich: "açúcar" },
    { group: "Ovos, leite e gordura", name: "Mel", water: 17, enrich: "açúcar" },
    { group: "Ovos, leite e gordura", name: "Melado", water: 22, enrich: "açúcar" },
  ];

  const MAIN_LIQUIDS = [
    { name: "Água", water: 100 },
    { name: "Leite integral", water: 87, enrich: "leite" },
    { name: "Leite desnatado", water: 91, enrich: "leite" },
    { name: "Leitelho", water: 90, enrich: "leite" },
    { name: "Iogurte", water: 85, enrich: "leite" },
    { name: "Ovos", water: 75, enrich: "ovos" },
  ];

  // Pão enriquecido: quando ovos, leite, gordura, açúcar ou purês somam 5% ou mais,
  // o nome do pão vem deles, não da hidratação (ovos numa "focaccia" seria contrassenso).
  const ENRICHED_MIN = 5;
  const BASE_MIN = 10;
  const ENRICHED_NAMES = {
    batata: "Pão de batata",
    "batata-doce": "Pão de batata-doce",
    mandioca: "Pão de mandioca",
    "abóbora": "Pão de abóbora",
    banana: "Pão de banana",
    ovos: "Pão enriquecido com ovos",
    leite: "Pão de leite",
    gordura: "Pão amanteigado",
    "açúcar": "Pão adoçado",
  };
  const BASES = ["batata", "batata-doce", "mandioca", "abóbora", "banana"];

  function enrichedBread(ingredients) {
    const totals = {};
    let sum = 0;
    ingredients.forEach((item) => {
      if (!item || item.custom || (item.role !== "extra" && item.role !== "water")) return;
      const spec = ADDABLE.find((entry) => entry.name === item.name);
      if (!spec || !spec.enrich) return;
      const pct = Math.max(0, num(item.pct));
      totals[spec.enrich] = (totals[spec.enrich] || 0) + pct;
      sum += pct;
    });
    if (sum < ENRICHED_MIN) return null;
    const eggs = totals.ovos || 0;
    const fat = totals.gordura || 0;
    if (eggs >= 15 || (eggs > 0 && fat >= 15)) return "Brioche";
    const base = BASES.filter((key) => (totals[key] || 0) >= BASE_MIN).sort((x, y) => totals[y] - totals[x])[0];
    if (base) return ENRICHED_NAMES[base];
    const top = Object.keys(totals).sort((x, y) => totals[y] - totals[x])[0];
    return ENRICHED_NAMES[top];
  }

  function num(value) {
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;
    const n = parseFloat(String(value ?? "").trim().replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  }

  function matchRatio(L, A, F) {
    const l = num(L);
    const a = num(A);
    const f = num(F);
    const found = RATIOS.find((r) => r.L === l && r.A === a && r.F === f);
    return found ? found.id : "custom";
  }

  // L:A:F = levain (isca) : água : farinha.
  // Hidratação do levain: água da alimentação ÷ farinha da alimentação. A isca não entra nessa conta.
  function splitLevain(totalGrams, L, A, F) {
    const total = Math.max(0, num(totalGrams));
    const l = Math.max(0, num(L));
    const a = Math.max(0, num(A));
    const f = Math.max(0, num(F));
    const sum = l + a + f;
    if (total <= 0 || sum <= 0) {
      return { seed: 0, water: 0, flour: 0, hydration: null, valid: false };
    }
    return {
      seed: (total * l) / sum,
      water: (total * a) / sum,
      flour: (total * f) / sum,
      hydration: f > 0 ? (a / f) * 100 : null,
      valid: true,
    };
  }

  function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a;
  }

  // Pesos soltos → proporção. 2 g, 50 g e 50 g viram 1:25:25.
  // Números quebrados demais voltam para 1 : água/isca : farinha/isca, com 2 casas.
  function ratioFromGrams(seed, water, flour) {
    const s = Math.max(0, num(seed));
    const a = Math.max(0, num(water));
    const f = Math.max(0, num(flour));
    if (s + a + f <= 0) return { L: 0, A: 0, F: 0 };
    const scaled = [s, a, f].map((n) => Math.round(n * 100));
    const g = scaled.reduce((x, y) => gcd(x, y)) || 1;
    const L = scaled[0] / g;
    const A = scaled[1] / g;
    const F = scaled[2] / g;
    if (s > 0 && (L > 100 || A > 1000 || F > 1000)) {
      return { L: 1, A: Math.round((a / s) * 100) / 100, F: Math.round((f / s) * 100) / 100 };
    }
    return { L, A, F };
  }

  // O fermento fresco pesa o triplo do seco para a mesma força.
  function convertYeast(pct, from, to) {
    const value = Math.max(0, num(pct));
    let out = value;
    if (from === "seco" && to === "fresco") out = value * 3;
    if (from === "fresco" && to === "seco") out = value / 3;
    return Math.round(out * 100) / 100;
  }

  // Perfil da ativação, a partir da hidratação (água ÷ farinha) e de quantas vezes
  // a farinha da alimentação supera a isca. Tempos para 24–26 °C.
  // Mais líquido e mais quente puxa para o láctico (suave, cremoso); mais firme
  // e mais frio puxa para o acético (azedo). Alimentação pequena herda mais
  // acidez da isca; alimentação grande dá um levain mais suave.
  const FLAVORS = [
    "Bem láctico: suave e cremoso",
    "Láctico: suave, azedinho de iogurte",
    "Equilibrado",
    "Acético: mais azedo",
    "Bem acético: azedo e pungente",
  ];

  const PEAK_TIMES = ["2 a 3 h", "3 a 4 h", "4 a 6 h", "6 a 8 h", "8 a 12 h", "12 a 16 h", "16 a 24 h"];

  function levainProfile(L, A, F) {
    const l = Math.max(0, num(L));
    const a = Math.max(0, num(A));
    const f = Math.max(0, num(F));
    if (l <= 0 || f <= 0) return null;
    const hydration = (a / f) * 100;
    const feed = f / l;
    const stiff = hydration < 85;

    let texture = "Cremosa, como iogurte grosso";
    if (hydration > 115) texture = "Líquida, escorre da colher";
    else if (hydration < 70) texture = "Firme, de sovar na mão";
    else if (stiff) texture = "Pastosa, mais firme que iogurte";

    let speed = speedIndex(feed);
    if (stiff) speed = Math.min(PEAK_TIMES.length - 1, speed + 1);

    let score = hydration >= 95 ? 1 : hydration >= 75 ? 2 : hydration >= 60 ? 3 : 4;
    if (feed <= 1) score += 1;
    else if (feed >= 4) score -= 1;
    score = Math.max(0, Math.min(4, score));

    const tips = [];
    if (feed <= 0.5) tips.push("Bom para reanimar uma isca fraca ou ter o levain pronto rápido. Carrega muita acidez da isca: use no pico, sem deixar passar.");
    else if (feed <= 1) tips.push("Fica pronto rápido e concentra a acidez da isca. Passado do ponto, enfraquece o glúten da massa.");
    else if (feed <= 3) tips.push("Meio-termo de tempo e acidez: dá para alimentar de manhã e usar à tarde.");
    else if (feed <= 5) tips.push("Bom para alimentar à noite e usar de manhã. Mais fermento e menos acidez: sabor suave e miolo aberto.");
    else tips.push("Fermentação longa e bem suave. Útil em dias quentes ou para esperar a noite toda sem passar do ponto.");
    if (stiff) tips.push("Levain firme dá mais força à massa e puxa para o acético.");
    if (hydration > 115) tips.push("Muito líquido fermenta rápido e puxa para o láctico.");

    return {
      hydration,
      feed,
      texture,
      time: PEAK_TIMES[speed],
      score,
      flavor: FLAVORS[score],
      tips,
    };
  }

  // Mesma escada de levainProfile, sem o degrau das massas abaixo de 85%.
  function speedIndex(feed) {
    return feed <= 0.5 ? 0 : feed <= 1 ? 1 : feed <= 2 ? 2 : feed <= 3 ? 3 : feed <= 5 ? 4 : feed <= 10 ? 5 : 6;
  }

  // Meio de cada texto de PEAK_TIMES, na mesma ordem. Serve só ao degrau firme.
  const PEAK_MIDS = [2.5, 3.5, 5, 7, 10, 14, 20];

  function roundHalfHour(hours) {
    return Math.round(hours * 2) / 2;
  }

  function formatHalfHour(hours) {
    const n = roundHalfHour(hours);
    const abs = Math.abs(n);
    const text = Number.isInteger(abs) ? String(abs) : String(abs).replace(".", ",");
    return (n < 0 ? "-" : "") + text;
  }

  function formatHourSpan(shortH, longH) {
    let a = roundHalfHour(shortH);
    let b = roundHalfHour(longH);
    if (a > b) {
      const swap = a;
      a = b;
      b = swap;
    }
    if (a === b) return formatHalfHour(a) + " h";
    return formatHalfHour(a) + " a " + formatHalfHour(b) + " h";
  }

  function parsePeakBand(text) {
    const match = /^(\d+(?:,\d+)?)\s+a\s+(\d+(?:,\d+)?)\s+h$/.exec(String(text || "").trim());
    if (!match) return null;
    return { lo: Number(match[1].replace(",", ".")), hi: Number(match[2].replace(",", ".")) };
  }

  function orderedRange(lo, hi) {
    const a = num(lo);
    const b = num(hi);
    if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
    return a <= b ? { lo: a, hi: b } : { lo: b, hi: a };
  }

  // O pote do teste entra se a proporção está na faixa, não se o peso é o sugerido.
  // 1:1:1: farinha/isca e água/farinha entre 0,9 e 1,1.
  // 1:5:5: farinha/isca entre 4,5 e 5,5, e água/farinha entre 0,9 e 1,1.
  function acceptJar(kind, seed, water, flour) {
    const s = num(seed);
    const w = num(water);
    const f = num(flour);
    if (!(s > 0) || !(w > 0) || !(f > 0)) return false;
    const flourPerSeed = f / s;
    const waterPerFlour = w / f;
    const waterOk = waterPerFlour >= 0.9 && waterPerFlour <= 1.1;
    if (kind === "111") return flourPerSeed >= 0.9 && flourPerSeed <= 1.1 && waterOk;
    if (kind === "155") return flourPerSeed >= 4.5 && flourPerSeed <= 5.5 && waterOk;
    return false;
  }

  // Hora até o pico. Não altera levainProfile.
  // Sem calibração e em 24–26 °C devolve profile.time intacto.
  // Sem calibração e noutra faixa, desliza as duas pontas do texto geral.
  // Com calibração, o centro é t1 + (t5 − t1) × ln(alimentação) / ln(5);
  // abaixo de 85% multiplica pela razão dos meios da faixa geral; a temperatura
  // abre o intervalo entre o teto (mais curto) e o piso (mais longo).
  function peakEstimate(profile, calibration, tempLo, tempHi) {
    if (!profile || typeof profile.time !== "string" || !(num(profile.feed) > 0)) return null;
    const requested = orderedRange(tempLo, tempHi);
    if (!requested) return null;
    const hot = requested.hi > 30;

    if (!calibration) {
      if (requested.lo === 24 && requested.hi === 26) {
        return { time: profile.time, label: "Faixa geral", stiff: false, hot, general: true };
      }
      const band = parsePeakBand(profile.time);
      if (!band) return { time: profile.time, label: "Faixa geral", stiff: false, hot, general: true };
      const shortH = band.lo * Math.pow(2, (26 - requested.hi) / 10);
      const longH = band.hi * Math.pow(2, (24 - requested.lo) / 10);
      return { time: formatHourSpan(shortH, longH), label: "Faixa geral", stiff: false, hot, general: true };
    }

    const t1 = num(calibration.t1Hours);
    const t5 = num(calibration.t5Hours);
    const feed = num(profile.feed);
    if (!(t1 > 0) || !(t5 > t1)) return null;
    let center = t1 + (t5 - t1) * (Math.log(feed) / Math.log(5));
    const stiff = num(profile.hydration) < 85;
    if (stiff) {
      const base = speedIndex(feed);
      const firm = Math.min(PEAK_TIMES.length - 1, base + 1);
      center *= PEAK_MIDS[firm] / PEAK_MIDS[base];
    }
    const test = orderedRange(calibration.tempLo, calibration.tempHi) || { lo: 24, hi: 26 };
    const mid = (test.lo + test.hi) / 2;
    let shortH = center * Math.pow(2, (mid - requested.hi) / 10);
    let longH = center * Math.pow(2, (mid - requested.lo) / 10);
    // Alimentação muito menor que a isca leva o log abaixo de zero. A tela não mostra hora negativa nem 0 h.
    if (roundHalfHour(shortH) < 0.5) shortH = 0.5;
    if (roundHalfHour(longH) < 0.5) longH = 0.5;
    const name = String(calibration.name || "").trim() || "Calibração";
    return { time: formatHourSpan(shortH, longH), label: name, stiff, hot, general: false };
  }

  // Fermento principal ("ferment") ou segundo fermento ("ferment2"): um biológico e um levain.
  function isFerment(item) {
    return !!item && (item.role === "ferment" || item.role === "ferment2");
  }

  function gramsOf(flour, pct) {
    return (Math.max(0, num(flour)) * Math.max(0, num(pct))) / 100;
  }

  // Inteiros que somam o arredondado do total. O grama do empate em ,5 fica na primeira linha.
  function balanceShown(values) {
    const exact = values.map((value) => Math.max(0, num(value)));
    const shown = exact.map((value) => Math.floor(value));
    let left = Math.round(exact.reduce((sum, value) => sum + value, 0)) - shown.reduce((sum, value) => sum + value, 0);
    const order = exact
      .map((value, index) => ({ index, frac: value - shown[index] }))
      .sort((a, b) => b.frac - a.frac || a.index - b.index);
    let guard = 0;
    while (left > 0 && order.length && guard < exact.length * 4) {
      shown[order[guard % order.length].index] += 1;
      left -= 1;
      guard += 1;
    }
    return shown;
  }

  function weighLevain(split) {
    if (!split || !split.valid) return split;
    const total = Math.round(split.seed + split.water + split.flour);
    const parts = {
      seed: Math.round(split.seed),
      water: Math.round(split.water),
      flour: Math.round(split.flour),
    };
    const diff = total - (parts.seed + parts.water + parts.flour);
    // A sobra vai para a isca, a menos que a deixe negativa.
    if (split.seed > 0 && parts.seed + diff >= 0) parts.seed += diff;
    else if (parts.flour >= parts.water) parts.flour += diff;
    else parts.water += diff;
    return { ...split, ...parts };
  }

  function defaultState() {
    return {
      recipeName: "Minha Receita",
      flour: 500,
      ingredients: [
        { id: "agua", name: "Água", pct: 65, water: 100, role: "water" },
        { id: "sal", name: "Sal", pct: 2, water: 0, role: "salt" },
        { id: "fermento", name: "Fermento seco", pct: 1, water: 0, role: "ferment", ferment: "seco" },
      ],
      levain: { L: 1, A: 2, F: 2 },
    };
  }

  // Hidratação total = toda a água contada ÷ toda a farinha contada.
  // Por padrão (includeLevain = true), entram a água e a farinha da alimentação do levain.
  // Se includeLevain for falso, nem a água nem a farinha do levain entram na hidratação total.
  // Com includeSeed ligado (e includeLevain verdadeiro), 50% da isca conta como água e 50% como farinha.
  function compute(state, config) {
    const flour = Math.max(0, num(state.flour));
    const includeLevain =
      config && config.includeLevain !== undefined
        ? !!config.includeLevain
        : state && state.includeLevain !== undefined
        ? !!state.includeLevain
        : true;
    const includeSeed = includeLevain && !!((config && config.includeSeed) || (state && state.includeSeed));
    const ingredients = (Array.isArray(state.ingredients) ? state.ingredients : []).filter(
      (item) => item && typeof item === "object"
    );
    // O levain pode ser o fermento principal (role "ferment") ou o segundo (role "ferment2").
    const levainRow = ingredients.find((item) => isFerment(item) && item.ferment === "levain");
    const levainOn = !!levainRow;
    const levainGrams = levainOn ? gramsOf(flour, levainRow.pct) : 0;
    const ratio = state.levain || { L: 1, A: 2, F: 2 };
    const levain = levainOn ? weighLevain(splitLevain(levainGrams, ratio.L, ratio.A, ratio.F)) : null;

    const rows = ingredients.map((item) => {
      const grams = gramsOf(flour, item.pct);
      let water = grams * (Math.max(0, num(item.water)) / 100);
      let addedFlour = 0;
      if (isFerment(item) && item.ferment === "levain") {
        if (includeLevain && levain && levain.valid) {
          water = levain.water;
          addedFlour = levain.flour;
          if (includeSeed) {
            const seedHalf = levain.seed / 2;
            water += seedHalf;
            addedFlour += seedHalf;
          }
        } else {
          water = 0;
        }
      }
      return {
        id: item.id,
        name: item.name,
        pct: num(item.pct),
        waterPct: num(item.water),
        role: item.role,
        ferment: item.ferment || "",
        custom: !!item.custom,
        grams,
        water,
        addedFlour,
      };
    });

    const shown = balanceShown([flour, ...rows.map((row) => row.grams)]);
    rows.forEach((row, index) => {
      row.shown = shown[index + 1];
    });

    const totalFlour = flour + rows.reduce((sum, row) => sum + (row.addedFlour || 0), 0);
    const totalWater = rows.reduce((sum, row) => sum + row.water, 0);
    const totalWeight = flour + rows.reduce((sum, row) => sum + row.grams, 0);
    const hydration = totalFlour > 0 ? (totalWater / totalFlour) * 100 : 0;
    const band = BANDS.find((item) => hydration <= item.max) || BANDS[BANDS.length - 1];
    const enriched = enrichedBread(ingredients);
    const flourShare = totalWeight > 0 ? (totalFlour / totalWeight) * 100 : 0;
    const waterShare = totalWeight > 0 ? (totalWater / totalWeight) * 100 : 0;
    const otherShare = Math.max(0, 100 - flourShare - waterShare);
    const directWater = rows.find((row) => row.role === "water");

    return {
      flour,
      totalFlour,
      rows,
      levainOn,
      levain,
      levainGrams,
      includeLevain,
      totalWater,
      directWater: directWater ? directWater.water : 0,
      totalWeight,
      hydration,
      band,
      enriched: !!enriched,
      bread: enriched || band.pao,
      // Pão enriquecido tem miolo fechado e macio, qualquer que seja a hidratação.
      img: enriched ? "img/miolo-enriquecido.jpg" : band.img,
      flourShare,
      waterShare,
      otherShare,
    };
  }

  return {
    RATIOS,
    RATIO_GROUPS,
    BREAD_INFO,
    ENRICHED_INFO,
    BANDS,
    ADDABLE,
    MAIN_LIQUIDS,
    num,
    matchRatio,
    splitLevain,
    ratioFromGrams,
    levainProfile,
    acceptJar,
    peakEstimate,
    isFerment,
    enrichedBread,
    gramsOf,
    balanceShown,
    convertYeast,
    compute,
    defaultState,
  };
});
