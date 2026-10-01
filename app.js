const { createApp, reactive, computed, watch, ref, onMounted } = Vue;

const STORAGE_KEY = "percentual-padeiro-v1";
const FLOUR_MAX = 99999;

const ICONS = {
  water: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3s6 6.4 6 10.2A6 6 0 0 1 6 13.2C6 9.4 12 3 12 3z"/></svg>',
  salt: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="8" width="12" height="12" rx="2"/><path d="M9 8V6h6v2"/><path d="M9 12h6M9 15h6"/></svg>',
  yeast: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="14" r="3.2"/><circle cx="15" cy="10" r="2.4"/><circle cx="15.5" cy="16" r="1.7"/></svg>',
  levain: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 10c0-3 1.8-5 4-5s4 2 4 5v8H8v-8z"/><path d="M9 18h6"/><path d="M10 10h.01M14 12h.01M12 14h.01"/></svg>',
  egg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.2c2.6 0 4.8 4 4.8 8 0 3.6-2.1 6.6-4.8 6.6s-4.8-3-4.8-6.6c0-4 2.2-8 4.8-8z"/><circle cx="12" cy="13.2" r="1.3"/></svg>',
  milk: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8l1.2-3h5.6L16 8v11H8V8z"/><path d="M8 11h8"/></svg>',
  butter: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="8" width="16" height="9" rx="1.5"/><path d="M8 8V6h8v2"/></svg>',
  honey: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6v4l2 3v9a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3v-9l2-3V3z"/><path d="M9 7h6"/></svg>',
  flour: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 9h10l-1 11H8L7 9z"/><path d="M8 9c0-2 1.6-3 4-3s4 1 4 3"/><path d="M9 13h6"/></svg>',
  tuber: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 9c2-3 7-3 9 1 1.5 3 .5 7-3 8-4 1-8-1-8-5 0-1.5.6-3 2-4z"/><path d="M10 11h.01M14 13h.01M12 16h.01"/></svg>',
  fruit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7c2 0 4 2.2 4 6.2S14.2 20 12 20s-4-2.8-4-6.8S10 7 12 7z"/><path d="M12 7c1-2 3-3 4-3"/></svg>',
  generic: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="6"/></svg>',
};

const ICON_BY_NAME = {
  Ovos: ICONS.egg,
  "Leite integral": ICONS.milk,
  "Leite desnatado": ICONS.milk,
  "Leite em pó integral": ICONS.flour,
  "Leite em pó desnatado": ICONS.flour,
  "Cacau em pó": ICONS.flour,
  Leitelho: ICONS.milk,
  Iogurte: ICONS.milk,
  Manteiga: ICONS.butter,
  "Margarina sem sal": ICONS.butter,
  "Margarina com sal": ICONS.butter,
  Mel: ICONS.honey,
  Melado: ICONS.honey,
  Fubá: ICONS.flour,
  "Farinha de mandioca": ICONS.flour,
  "Amido de milho": ICONS.flour,
  "Polvilho doce": ICONS.flour,
  "Polvilho azedo": ICONS.flour,
  "Farinha de centeio": ICONS.flour,
  "Farinha integral": ICONS.flour,
  "Farinha de aveia": ICONS.flour,
  "Farinha de arroz": ICONS.flour,
  "Batata inglesa cozida": ICONS.tuber,
  "Batata-doce cozida": ICONS.tuber,
  "Mandioca cozida": ICONS.tuber,
  "Abóbora cozida": ICONS.fruit,
  Banana: ICONS.fruit,
};

function iconFor(item) {
  if (item.role === "water") return ICONS.water;
  if (item.role === "salt") return ICONS.salt;
  if (item.role === "ferment") return item.ferment === "levain" ? ICONS.levain : ICONS.yeast;
  return ICON_BY_NAME[item.name] || ICONS.generic;
}

function loadState() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!raw || !Array.isArray(raw.ingredients)) return Padeiro.defaultState();
    const roles = new Set(raw.ingredients.map((item) => item.role));
    if (!roles.has("water") || !roles.has("salt") || !roles.has("ferment")) return Padeiro.defaultState();
    raw.ingredients.forEach((item) => {
      if (item.role === "ferment" && item.ferment !== "levain" && item.ferment !== "fresco" && item.ferment !== "seco") {
        item.ferment = "seco";
        item.name = "Fermento seco";
      }
      if (item.role === "extra" && !item.custom) {
        const spec = Padeiro.ADDABLE.find((entry) => entry.name === item.name);
        if (spec) item.water = spec.water;
      }
    });
    const flour = Padeiro.num(raw.flour);
    raw.flour = flour > 0 ? Math.min(FLOUR_MAX, flour) : 500;
    raw.levain = raw.levain || { L: 1, A: 2, F: 2 };
    raw.levain.L = Padeiro.num(raw.levain.L);
    raw.levain.A = Padeiro.num(raw.levain.A);
    raw.levain.F = Padeiro.num(raw.levain.F);
    return raw;
  } catch (error) {
    return Padeiro.defaultState();
  }
}

createApp({
  setup() {
    const state = reactive(loadState());
    const menuOpen = ref(false);
    const canInstall = ref(false);
    let deferredPrompt = null;
    const gramsFormat = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
    const pctFormat = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });

    const result = computed(() => Padeiro.compute(state));
    const ratioId = computed(() => Padeiro.matchRatio(state.levain.L, state.levain.A, state.levain.F));
    const menuGroups = computed(() => {
      const present = new Set(state.ingredients.map((row) => row.name));
      const groups = [];
      Padeiro.ADDABLE.forEach((spec) => {
        if (present.has(spec.name)) return;
        let group = groups.find((item) => item.name === spec.group);
        if (!group) {
          group = { name: spec.group, items: [] };
          groups.push(group);
        }
        group.items.push(spec);
      });
      return groups;
    });

    const waterPct = computed({
      get() {
        const water = state.ingredients.find((item) => item.role === "water");
        return water ? water.pct : 0;
      },
      set(value) {
        const water = state.ingredients.find((item) => item.role === "water");
        if (water) water.pct = Math.max(0, Padeiro.num(value));
      },
    });

    const waterDiffers = computed(() => Math.abs(result.value.hydration - waterPct.value) >= 0.15);

    function formatG(value) {
      return gramsFormat.format(Math.round(Padeiro.num(value)));
    }

    function formatPct(value) {
      return pctFormat.format(Padeiro.num(value));
    }

    const flourDigits = computed(() => {
      const text = String(Math.round(Math.abs(Padeiro.num(state.flour))));
      return Math.min(5, Math.max(1, text.length));
    });

    function clampFlour() {
      if (state.flour === "" || state.flour == null || Number.isNaN(state.flour)) return;
      const n = Padeiro.num(state.flour);
      if (n > FLOUR_MAX) state.flour = FLOUR_MAX;
      else if (n < 0) state.flour = 0;
    }

    function bumpFlour(delta) {
      state.flour = Math.min(FLOUR_MAX, Math.max(0, Math.round(Padeiro.num(state.flour) + delta)));
    }

    function yeastName(kind) {
      return kind === "fresco" ? "Fermento fresco" : "Fermento seco";
    }

    function setFerment(kind) {
      const row = state.ingredients.find((item) => item.role === "ferment");
      if (!row || row.ferment === kind) return;
      if (kind === "levain") {
        row.yeastPct = row.pct;
        row.yeastKind = row.ferment === "fresco" ? "fresco" : "seco";
        row.pct = row.levainPct != null ? row.levainPct : 20;
        row.ferment = "levain";
        row.name = "Levain";
        return;
      }
      let sourceKind = row.ferment === "fresco" ? "fresco" : "seco";
      let sourcePct = row.pct;
      if (row.ferment === "levain") {
        row.levainPct = row.pct;
        sourceKind = row.yeastKind === "fresco" ? "fresco" : "seco";
        sourcePct = row.yeastPct != null ? row.yeastPct : sourceKind === "fresco" ? 3 : 1;
      }
      row.pct = Padeiro.convertYeast(sourcePct, sourceKind, kind);
      row.ferment = kind;
      row.yeastKind = kind;
      row.yeastPct = row.pct;
      row.name = yeastName(kind);
      row.water = 0;
    }

    function yeastEquivalent(pct, from, to) {
      return Padeiro.convertYeast(pct, from, to);
    }

    function onRatio(id) {
      const preset = Padeiro.RATIOS.find((item) => item.id === id);
      if (!preset) return;
      state.levain.L = preset.L;
      state.levain.A = preset.A;
      state.levain.F = preset.F;
    }

    function setPart(key, value) {
      state.levain[key] = Math.max(0, Padeiro.num(value));
    }

    function addIngredient(spec) {
      state.ingredients.push({
        id: "extra-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        name: spec.name,
        pct: 0,
        water: spec.water,
        role: "extra",
        custom: false,
      });
      menuOpen.value = false;
    }

    function addCustom() {
      state.ingredients.push({
        id: "extra-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        name: "",
        pct: 0,
        water: 0,
        role: "extra",
        custom: true,
      });
      menuOpen.value = false;
    }

    function removeIngredient(id) {
      const index = state.ingredients.findIndex((item) => item.id === id && item.role === "extra");
      if (index >= 0) state.ingredients.splice(index, 1);
    }

    function barWidth(pct) {
      return Math.max(0, Math.min(100, Padeiro.num(pct))) + "%";
    }

    function rowOf(id) {
      return result.value.rows.find((row) => row.id === id) || { grams: 0, water: 0 };
    }

    async function install() {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      canInstall.value = false;
    }

    watch(
      state,
      () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      },
      { deep: true }
    );

    onMounted(() => {
      window.addEventListener("beforeinstallprompt", (event) => {
        event.preventDefault();
        deferredPrompt = event;
        if (!window.matchMedia("(display-mode: standalone)").matches) canInstall.value = true;
      });
      document.addEventListener("click", (event) => {
        if (!event.target.closest(".add-wrap")) menuOpen.value = false;
      });
    });

    return {
      state,
      result,
      waterPct,
      waterDiffers,
      ratioId,
      ratios: Padeiro.RATIOS,
      menuGroups,
      menuOpen,
      canInstall,
      formatG,
      formatPct,
      flourDigits,
      clampFlour,
      bumpFlour,
      setFerment,
      yeastEquivalent,
      onRatio,
      setPart,
      addIngredient,
      addCustom,
      removeIngredient,
      barWidth,
      rowOf,
      iconFor,
      install,
    };
  },
}).mount("#app");
