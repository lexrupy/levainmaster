// Percentual do padeiro — © 2026 Alexandre da Silva
// SPDX-License-Identifier: LGPL-3.0-or-later
const test = require("node:test");
const assert = require("node:assert/strict");
const Padeiro = require("../calc.js");

function close(actual, expected, label) {
  assert.ok(Math.abs(actual - expected) < 1e-9, (label || "valor") + ": " + actual + " ≠ " + expected);
}

function recipe(changes) {
  const state = Padeiro.defaultState();
  if (changes) changes(state);
  return Padeiro.compute(state);
}

function row(result, role) {
  return result.rows.find((item) => item.role === role);
}

test("receita inicial: 840 g, 65% e baguete", () => {
  const result = recipe();
  close(result.totalWeight, 840, "massa");
  close(result.hydration, 65, "hidratação");
  close(result.flour, 500, "farinha");
  assert.equal(result.band.pao, "Baguete");
  assert.equal(result.band.feel, "macia");
  assert.equal(result.enriched, false);
});

test("gramas são farinha vezes percentual", () => {
  const result = recipe();
  close(row(result, "water").grams, 325);
  close(row(result, "salt").grams, 10);
  close(row(result, "ferment").grams, 5);
});

test("os inteiros da lista fecham o peso da massa", () => {
  const shown = Padeiro.balanceShown([250, 162.5, 5, 2.5]);
  assert.deepEqual(shown, [250, 163, 5, 2]);
  const result = recipe((state) => {
    state.flour = 250;
  });
  const lines = [result.flour, ...result.rows.map((item) => item.shown)];
  assert.equal(lines.reduce((sum, value) => sum + value, 0), Math.round(result.totalWeight));
  close(result.hydration, 65);
  assert.equal(row(result, "water").shown, 163);
  assert.equal(row(result, "ferment").shown, 2);
});

test("hidratação soma água direta, teor do ingrediente e água da alimentação", () => {
  const eggs = recipe((state) => {
    state.ingredients.push({ id: "ovos", name: "Ovos", pct: 10, water: 75, role: "extra" });
  });
  close(eggs.hydration, 72.5, "ovos");
  close(eggs.flour, 500, "farinha com ovos");

  const levain = recipe((state) => {
    state.ingredients[2].ferment = "levain";
    state.ingredients[2].pct = 20;
    state.levain = { L: 1, A: 2, F: 2 };
  });
  close(levain.hydration, 73, "levain");
  close(levain.flour, 500, "farinha da receita");
  assert.equal(levain.levain.water, 40);
  assert.equal(levain.levain.flour, 40);
  assert.equal(levain.levain.seed, 20);
});

test("farinha da alimentação e água da isca ficam fora da conta", () => {
  const result = recipe((state) => {
    state.ingredients[2].ferment = "levain";
    state.ingredients[2].pct = 20;
    state.levain = { L: 1, A: 1, F: 1 };
  });
  close(result.flour, 500);
  close(result.directWater, 325);
  close(row(result, "ferment").water, result.levain.water);
  assert.ok(result.levain.seed > 0);
  close(result.hydration, (325 + result.levain.water) / 500 * 100);
});

test("pós e farinhas extras não somam água", () => {
  for (const name of ["Farinha integral", "Amido de milho", "Leite em pó integral", "Cacau em pó"]) {
    const result = recipe((state) => {
      state.ingredients.push({ id: name, name, pct: 20, water: 0, role: "extra" });
    });
    close(result.hydration, 65, name);
    close(result.flour, 500, name);
  }
});

test("o sal da margarina com sal não entra na linha do sal", () => {
  const result = recipe((state) => {
    state.ingredients.push({ id: "margarina", name: "Margarina com sal", pct: 10, water: 16, role: "extra" });
  });
  close(row(result, "salt").grams, 10);
  close(result.hydration, 66.6);
});

test("convertYeast troca seco e fresco e arredonda a 2 casas", () => {
  assert.equal(Padeiro.convertYeast(1, "seco", "fresco"), 3);
  assert.equal(Padeiro.convertYeast(3, "fresco", "seco"), 1);
  assert.equal(Padeiro.convertYeast(1.01, "seco", "fresco"), 3.03);
  assert.equal(Padeiro.convertYeast(1, "fresco", "seco"), 0.33);
  assert.equal(Padeiro.convertYeast("1,5", "seco", "fresco"), 4.5);
});

test("caso 0001: isca não fica negativa e a soma fecha", () => {
  const result = recipe((state) => {
    state.ingredients[2].ferment = "levain";
    state.ingredients[2].pct = 0.68;
    state.levain = { L: 1, A: 8, F: 8 };
  });
  assert.deepEqual(
    [result.levain.seed, result.levain.water, result.levain.flour],
    [0, 2, 1]
  );
  const ratios = [...Padeiro.RATIOS.map((item) => [item.L, item.A, item.F]), [1, 8, 8], [3, 1, 1]];
  for (const [L, A, F] of ratios) {
    for (let grams = 0.1; grams <= 200; grams += 0.7) {
      const sample = recipe((state) => {
        state.ingredients[2].ferment = "levain";
        state.ingredients[2].pct = (grams / state.flour) * 100;
        state.levain = { L, A, F };
      });
      const parts = [sample.levain.seed, sample.levain.water, sample.levain.flour];
      assert.ok(parts.every((value) => value >= 0), parts.join(","));
      assert.equal(parts.reduce((sum, value) => sum + value, 0), Math.round(grams));
    }
  }
});

test("limites das faixas", () => {
  const edges = [
    [57, "Pão sovado"],
    [57.01, "Pão francês"],
    [62, "Pão francês"],
    [62.01, "Baguete"],
    [68, "Baguete"],
    [68.01, "Pão de fermentação natural"],
    [78, "Pão de fermentação natural"],
    [78.01, "Ciabatta"],
    [85, "Ciabatta"],
    [85.01, "Focaccia"],
    [95, "Focaccia"],
    [95.01, "Focaccia de alta hidratação"],
  ];
  for (const [hydration, bread] of edges) {
    const result = recipe((state) => {
      state.ingredients[0].pct = hydration;
    });
    assert.equal(result.band.pao, bread, String(hydration));
  }
});

test("num aceita vírgula e rejeita vazio e texto", () => {
  assert.equal(Padeiro.num("1,5"), 1.5);
  assert.equal(Padeiro.num(" 2.5 "), 2.5);
  assert.equal(Padeiro.num(""), 0);
  assert.equal(Padeiro.num("abc"), 0);
  assert.equal(Padeiro.num(null), 0);
});

test("matchRatio reconhece preset e personalizado", () => {
  assert.equal(Padeiro.matchRatio(1, 2, 2), "1:2:2");
  assert.equal(Padeiro.matchRatio(1, 5, 4), "1:5:4");
  assert.equal(Padeiro.matchRatio(2, 4, 5), "2:4:5");
  assert.equal(Padeiro.matchRatio(3, 1, 1), "custom");
  assert.equal(Padeiro.matchRatio("1", "2", "2"), "1:2:2");
});

test("ingrediente nulo não derruba a conta", () => {
  const result = recipe((state) => {
    state.ingredients.splice(1, 0, null);
  });
  close(result.totalWeight, 840);
  close(result.hydration, 65);
  assert.equal(Padeiro.isFerment(null), false);
  assert.doesNotThrow(() => Padeiro.enrichedBread([null, { role: "extra", name: "Ovos", pct: 20 }]));
  assert.equal(Padeiro.compute({ flour: 500, ingredients: [null] }).rows.length, 0);
});

test("pico calibrado nos exemplos combinados e piso de 0,5 h", () => {
  const calibration = { name: "Farinha Branca Tipo 1", t1Hours: 4, t5Hours: 10, tempLo: 22, tempHi: 22 };
  function time(L, A, F, lo, hi, cal) {
    const profile = Padeiro.levainProfile(L, A, F);
    return { profile, estimate: Padeiro.peakEstimate(profile, cal, lo, hi) };
  }
  const point = [
    [2, 1, 1, "1,5 h"],
    [1, 1, 1, "4 h"],
    [1, 2, 2, "6,5 h"],
    [1, 3, 3, "8 h"],
    [1, 5, 5, "10 h"],
    [1, 10, 10, "12,5 h"],
    [1, 25, 25, "16 h"],
    [4, 1, 1, "0,5 h"],
  ];
  for (const [L, A, F, expected] of point) {
    const got = time(L, A, F, 22, 22, calibration);
    assert.equal(got.estimate.time, expected, L + ":" + A + ":" + F);
    assert.equal(got.profile.time, Padeiro.levainProfile(L, A, F).time);
  }
  const wide = time(1, 25, 25, 20, 22, null);
  assert.equal(wide.profile.time, "16 a 24 h");
  assert.equal(wide.estimate.time, "21 a 31,5 h");
  assert.equal(time(1, 25, 25, 22, 23, null).estimate.time, "19,5 a 27,5 h");
  assert.equal(time(1, 1, 1, 24, 26, null).estimate.time, time(1, 1, 1, 24, 26, null).profile.time);
  assert.equal(time(4, 1, 1, 24, 26, null).estimate.time, "2 a 3 h");
});

test("pote aceita a mesma proporção com outro peso", () => {
  assert.equal(Padeiro.acceptJar("111", 20, 20, 20), true);
  assert.equal(Padeiro.acceptJar("155", 10, 50, 50), true);
  assert.equal(Padeiro.acceptJar("155", 20, 100, 100), true);
  assert.equal(Padeiro.acceptJar("155", 10, 40, 50), false);
  assert.equal(Padeiro.acceptJar("111", 20, 20, 30), false);
});
