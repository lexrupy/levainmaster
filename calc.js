// Percentual do padeiro — © 2026 Alexandre da Silva
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
    { group: "Ovos, leite e gordura", name: "Mel", water: 17, enrich: "açúcar" },
    { group: "Ovos, leite e gordura", name: "Melado", water: 22, enrich: "açúcar" },
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
      if (item.role !== "extra" || item.custom) return;
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
  // A hidratação do levain é só a alimentação (água ÷ farinha). A isca não entra.
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

    let speed = feed <= 0.5 ? 0 : feed <= 1 ? 1 : feed <= 2 ? 2 : feed <= 3 ? 3 : feed <= 5 ? 4 : feed <= 10 ? 5 : 6;
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

  // Fermento principal ("ferment") ou segundo fermento ("ferment2"): um biológico e um levain.
  function isFerment(item) {
    return item.role === "ferment" || item.role === "ferment2";
  }

  function gramsOf(flour, pct) {
    return (Math.max(0, num(flour)) * Math.max(0, num(pct))) / 100;
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
      flour: 500,
      ingredients: [
        { id: "agua", name: "Água", pct: 65, water: 100, role: "water" },
        { id: "sal", name: "Sal", pct: 2, water: 0, role: "salt" },
        { id: "fermento", name: "Fermento seco", pct: 1, water: 0, role: "ferment", ferment: "seco" },
      ],
      levain: { L: 1, A: 2, F: 2 },
    };
  }

  // Hidratação final = toda a água contada ÷ farinha da receita.
  // Entra a água da receita, a água da alimentação do levain e o teor de água de cada ingrediente.
  function compute(state) {
    const flour = Math.max(0, num(state.flour));
    const ingredients = Array.isArray(state.ingredients) ? state.ingredients : [];
    // O levain pode ser o fermento principal (role "ferment") ou o segundo (role "ferment2").
    const levainRow = ingredients.find((item) => isFerment(item) && item.ferment === "levain");
    const levainOn = !!levainRow;
    const levainGrams = levainOn ? gramsOf(flour, levainRow.pct) : 0;
    const ratio = state.levain || { L: 1, A: 2, F: 2 };
    const levain = levainOn ? weighLevain(splitLevain(levainGrams, ratio.L, ratio.A, ratio.F)) : null;

    const rows = ingredients.map((item) => {
      const grams = gramsOf(flour, item.pct);
      let water = grams * (Math.max(0, num(item.water)) / 100);
      if (isFerment(item) && item.ferment === "levain") {
        water = levain && levain.valid ? levain.water : 0;
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
      };
    });

    const totalWater = rows.reduce((sum, row) => sum + row.water, 0);
    const totalWeight = flour + rows.reduce((sum, row) => sum + row.grams, 0);
    const hydration = flour > 0 ? (totalWater / flour) * 100 : 0;
    const band = BANDS.find((item) => hydration <= item.max) || BANDS[BANDS.length - 1];
    const enriched = enrichedBread(ingredients);
    const flourShare = totalWeight > 0 ? (flour / totalWeight) * 100 : 0;
    const waterShare = totalWeight > 0 ? (totalWater / totalWeight) * 100 : 0;
    const otherShare = Math.max(0, 100 - flourShare - waterShare);
    const directWater = rows.find((row) => row.role === "water");

    return {
      flour,
      rows,
      levainOn,
      levain,
      levainGrams,
      totalWater,
      directWater: directWater ? directWater.water : 0,
      totalWeight,
      hydration,
      band,
      enriched: !!enriched,
      bread: enriched || band.pao,
      // Pão enriquecido tem miolo fechado e macio, qualquer que seja a hidratação.
      img: enriched ? BANDS.find((item) => item.feel === "macia").img : band.img,
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
    num,
    matchRatio,
    splitLevain,
    levainProfile,
    isFerment,
    enrichedBread,
    gramsOf,
    convertYeast,
    compute,
    defaultState,
  };
});
