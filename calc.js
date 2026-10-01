(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.Padeiro = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const RATIOS = [
    { id: "1:1:1", L: 1, A: 1, F: 1 },
    { id: "1:2:2", L: 1, A: 2, F: 2 },
    { id: "1:2:3", L: 1, A: 2, F: 3 },
    { id: "2:4:5", L: 2, A: 4, F: 5 },
    { id: "1:3:3", L: 1, A: 3, F: 3 },
    { id: "1:4:4", L: 1, A: 4, F: 4 },
    { id: "1:5:5", L: 1, A: 5, F: 5 },
    { id: "1:10:10", L: 1, A: 10, F: 10 },
  ];

  const BANDS = [
    { max: 57, feel: "firme", sensacao: "Firme, fácil de modelar", pao: "Bagel", miolo: "Miolo denso, de alvéolos pequenos", img: "img/miolo-1-firme.svg" },
    { max: 62, feel: "firme", sensacao: "Rígida, segura o formato", pao: "Pretzel", miolo: "Miolo fechado e uniforme", img: "img/miolo-2-fechado.svg" },
    { max: 67, feel: "macia", sensacao: "Macia e elástica", pao: "Baguete", miolo: "Miolo uniforme, levemente aberto", img: "img/miolo-3-macio.svg" },
    { max: 72, feel: "macia", sensacao: "Levemente pegajosa", pao: "Pão de fermentação natural", miolo: "Miolo levemente aberto", img: "img/miolo-4-levemente-aberto.svg" },
    { max: 78, feel: "pegajosa", sensacao: "Pegajosa", pao: "Ciabatta", miolo: "Alvéolos abertos e irregulares", img: "img/miolo-5-aberto-irregular.svg" },
    { max: 84, feel: "umida", sensacao: "Bem úmida", pao: "Focaccia", miolo: "Miolo muito aberto", img: "img/miolo-6-muito-aberto.svg" },
    { max: Infinity, feel: "umida", sensacao: "Extremamente úmida", pao: "Focaccia de alta hidratação", miolo: "Miolo rendado, de alvéolos grandes", img: "img/miolo-7-rendado.svg" },
  ];

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
    { group: "Cozidos e frutas", name: "Batata inglesa cozida", water: 77 },
    { group: "Cozidos e frutas", name: "Batata-doce cozida", water: 80 },
    { group: "Cozidos e frutas", name: "Mandioca cozida", water: 69 },
    { group: "Cozidos e frutas", name: "Abóbora cozida", water: 90 },
    { group: "Cozidos e frutas", name: "Banana", water: 75 },
    { group: "Ovos, leite e gordura", name: "Ovos", water: 75 },
    { group: "Ovos, leite e gordura", name: "Leite integral", water: 87 },
    { group: "Ovos, leite e gordura", name: "Leite desnatado", water: 91 },
    { group: "Ovos, leite e gordura", name: "Leite em pó integral", water: 0 },
    { group: "Ovos, leite e gordura", name: "Leite em pó desnatado", water: 0 },
    { group: "Ovos, leite e gordura", name: "Cacau em pó", water: 0 },
    { group: "Ovos, leite e gordura", name: "Leitelho", water: 90 },
    { group: "Ovos, leite e gordura", name: "Iogurte", water: 85 },
    { group: "Ovos, leite e gordura", name: "Manteiga", water: 16 },
    { group: "Ovos, leite e gordura", name: "Margarina sem sal", water: 16 },
    { group: "Ovos, leite e gordura", name: "Margarina com sal", water: 16 },
    { group: "Ovos, leite e gordura", name: "Mel", water: 17 },
    { group: "Ovos, leite e gordura", name: "Melado", water: 22 },
  ];

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
    const ferment = ingredients.find((item) => item.role === "ferment");
    const levainOn = !!(ferment && ferment.ferment === "levain");
    const levainGrams = levainOn ? gramsOf(flour, ferment.pct) : 0;
    const ratio = state.levain || { L: 1, A: 2, F: 2 };
    const levain = levainOn ? weighLevain(splitLevain(levainGrams, ratio.L, ratio.A, ratio.F)) : null;

    const rows = ingredients.map((item) => {
      const grams = gramsOf(flour, item.pct);
      let water = grams * (Math.max(0, num(item.water)) / 100);
      if (item.role === "ferment" && item.ferment === "levain") {
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
      flourShare,
      waterShare,
      otherShare,
    };
  }

  return {
    RATIOS,
    BANDS,
    ADDABLE,
    num,
    matchRatio,
    splitLevain,
    gramsOf,
    convertYeast,
    compute,
    defaultState,
  };
});
