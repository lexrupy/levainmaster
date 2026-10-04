// Percentual do padeiro — © 2026 Alexandre da Silva
// SPDX-License-Identifier: LGPL-3.0-or-later
const { createApp, reactive, computed, watch, ref, onMounted, nextTick } = Vue;

const STORAGE_KEY = "percentual-padeiro-v1";
const RECIPES_KEY = "percentual-padeiro-receitas-v1";
const CAL_KEY = "percentual-padeiro-calibracoes-v1";
const TEMP_BANDS = [
  { lo: 18, hi: 20 },
  { lo: 20, hi: 22 },
  { lo: 22, hi: 24 },
  { lo: 24, hi: 26 },
  { lo: 26, hi: 28 },
  { lo: 28, hi: 30 },
];

// Pergunta algo ao service worker que controla a página e espera a resposta.
function askWorker(message, timeout = 4000) {
  return new Promise((resolve) => {
    const worker = navigator.serviceWorker && navigator.serviceWorker.controller;
    if (!worker) return resolve(null);
    const channel = new MessageChannel();
    const timer = setTimeout(() => resolve(null), timeout);
    channel.port1.onmessage = (event) => {
      clearTimeout(timer);
      resolve(event.data);
    };
    worker.postMessage(message, [channel.port2]);
  });
}

// "padeiro-v27" → "27"
function versionLabel(cacheName) {
  const match = /v(\d+)$/.exec(cacheName || "");
  return match ? match[1] : "";
}

function recipeNameKey(name) {
  return String(name || "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("pt-BR");
}

function recipeFileName(name) {
  const slug = recipeNameKey(name).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return (slug || "minha-receita") + ".png";
}

// Espera um service worker novo terminar de instalar e ativar.
function untilActive(worker) {
  return new Promise((resolve) => {
    if (worker.state === "activated" || worker.state === "redundant") return resolve(worker.state);
    worker.addEventListener("statechange", () => {
      if (worker.state === "activated" || worker.state === "redundant") resolve(worker.state);
    });
  });
}
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
  if (Padeiro.isFerment(item)) return item.ferment === "levain" ? ICONS.levain : ICONS.yeast;
  return ICON_BY_NAME[item.name] || ICONS.generic;
}

// Limpa um estado salvo (na tela ou numa receita). Devolve null se não der para usar.
function normalizeState(raw) {
  if (!raw || !Array.isArray(raw.ingredients)) return null;
  // Descarta entradas inválidas antes de ler campos; localStorage e receitas antigas
  // podem conter dados incompletos ou parcialmente corrompidos.
  raw.ingredients = raw.ingredients.filter((item) => item && typeof item === "object" && !Array.isArray(item));
  const roles = new Set(raw.ingredients.map((item) => item.role));
  if (!roles.has("water") || !roles.has("salt") || !roles.has("ferment")) return null;
  // Segundo fermento: só um, e do tipo que falta (levain com biológico, ou o contrário).
  const main = raw.ingredients.find((item) => item.role === "ferment");
  const mainIsLevain = !!(main && main.ferment === "levain");
  let hasSecond = false;
  raw.ingredients = raw.ingredients.filter((item) => {
    if (item.role !== "ferment2") return true;
    const ok = !hasSecond && (mainIsLevain ? item.ferment === "seco" || item.ferment === "fresco" : item.ferment === "levain");
    hasSecond = hasSecond || ok;
    return ok;
  });
  raw.ingredients.forEach((item) => {
    item.pct = Math.max(0, Padeiro.num(item.pct));
    item.water = Math.max(0, Padeiro.num(item.water));
    if (item.role === "ferment" && item.ferment !== "levain" && item.ferment !== "fresco" && item.ferment !== "seco") {
      item.ferment = "seco";
      item.name = "Fermento seco";
    }
    if (item.role === "extra" && !item.custom) {
      const spec = Padeiro.ADDABLE.find((entry) => entry.name === item.name);
      if (spec) item.water = spec.water;
    }
  });
  // Campo vazio vale 0. Só falta de valor ou valor inválido volta para 500.
  const flour = raw.flour === "" ? 0 : Number(raw.flour);
  raw.flour = Number.isFinite(flour) ? Math.min(FLOUR_MAX, Math.max(0, flour)) : 500;
  raw.levain = raw.levain || { L: 1, A: 2, F: 2 };
  raw.levain.L = Math.max(0, Padeiro.num(raw.levain.L));
  raw.levain.A = Math.max(0, Padeiro.num(raw.levain.A));
  raw.levain.F = Math.max(0, Padeiro.num(raw.levain.F));
  raw.recipeName = typeof raw.recipeName === "string" ? raw.recipeName.slice(0, 80) : "Minha Receita";
  return raw;
}

function loadState() {
  try {
    return normalizeState(JSON.parse(localStorage.getItem(STORAGE_KEY) || "null")) || Padeiro.defaultState();
  } catch (error) {
    return Padeiro.defaultState();
  }
}

function loadRecipes() {
  try {
    const list = JSON.parse(localStorage.getItem(RECIPES_KEY) || "[]");
    return Array.isArray(list) ? list.filter((item) => item && item.id && item.state) : [];
  } catch (error) {
    return [];
  }
}

function emptyCalForm() {
  return {
    name: "",
    tempLo: "",
    tempHi: "",
    mixAt: "",
    peak111: "",
    peak155: "",
    seed111: 20,
    water111: 20,
    flour111: 20,
    seed155: 20,
    water155: 100,
    flour155: 100,
  };
}

function isTempText(value) {
  return /^-?\d+(?:[.,]\d+)?$/.test(String(value).trim());
}

function formatTempNumber(value) {
  const n = Padeiro.num(value);
  const rounded = Math.round(n * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded).replace(".", ",");
}

// O input type=number rejeita vírgula. O rótulo é que usa o formato com vírgula.
function formatTempField(value) {
  const n = Padeiro.num(value);
  const rounded = Math.round(n * 10) / 10;
  return String(rounded);
}

function formatTempRange(lo, hi) {
  return formatTempNumber(lo) + "–" + formatTempNumber(hi) + " °C";
}

function formatHoursLoose(hours) {
  const n = Math.round(hours * 10) / 10;
  return (Number.isInteger(n) ? String(n) : String(n).replace(".", ",")) + " h";
}

function hoursBetween(start, end) {
  const a = new Date(start).getTime();
  const b = new Date(end).getTime();
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  return (b - a) / 3600000;
}

function loadCalibrations() {
  try {
    const raw = JSON.parse(localStorage.getItem(CAL_KEY) || "null");
    const items = Array.isArray(raw && raw.items) ? raw.items : [];
    const clean = [];
    items.forEach((item) => {
      if (!item || typeof item !== "object" || !item.id) return;
      const name = String(item.name || "").trim().slice(0, 40);
      const t1Hours = Padeiro.num(item.t1Hours);
      const t5Hours = Padeiro.num(item.t5Hours);
      if (!name || !(t1Hours > 0) || !(t5Hours > t1Hours)) return;
      let tempLo = item.tempLo === undefined || item.tempLo === "" ? 24 : Padeiro.num(item.tempLo);
      let tempHi = item.tempHi === undefined || item.tempHi === "" ? 26 : Padeiro.num(item.tempHi);
      if (tempLo > tempHi) {
        const swap = tempLo;
        tempLo = tempHi;
        tempHi = swap;
      }
      clean.push({
        id: String(item.id),
        name,
        savedAt: typeof item.savedAt === "string" ? item.savedAt : "",
        t1Hours,
        t5Hours,
        tempLo,
        tempHi,
        mixAt: typeof item.mixAt === "string" ? item.mixAt : "",
        peak111At: typeof item.peak111At === "string" ? item.peak111At : "",
        peak155At: typeof item.peak155At === "string" ? item.peak155At : "",
        seed111: Padeiro.num(item.seed111),
        water111: Padeiro.num(item.water111),
        flour111: Padeiro.num(item.flour111),
        seed155: Padeiro.num(item.seed155),
        water155: Padeiro.num(item.water155),
        flour155: Padeiro.num(item.flour155),
      });
    });
    const activeId = clean.some((item) => item.id === (raw && raw.activeId)) ? String(raw.activeId) : "";
    return { activeId, items: clean };
  } catch (error) {
    return { activeId: "", items: [] };
  }
}

createApp({
  setup() {
    const state = reactive(loadState());
    const menuOpen = ref(false);
    const levainDialog = ref(null);
    const recipesDialog = ref(null);
    const aboutDialog = ref(null);
    const tempDialog = ref(null);
    const calDialog = ref(null);
    const calGuideDialog = ref(null);
    const calGuideOverForm = ref(false);
    const breadDialog = ref(null);
    const calStore = reactive(loadCalibrations());
    const startingCal = calStore.items.find((item) => item.id === calStore.activeId) || null;
    const sessionTemp = reactive({
      lo: startingCal ? startingCal.tempLo : 24,
      hi: startingCal ? startingCal.tempHi : 26,
    });
    const tempFields = reactive({
      lo: String(sessionTemp.lo),
      hi: String(sessionTemp.hi),
    });
    const calForm = reactive(emptyCalForm());
    const breadShown = ref("");
    const about = reactive({ version: "", offline: false, persisted: false, checking: false, status: "", reload: false });
    const recipes = ref(loadRecipes());
    const recipeName = ref("");
    const recipeNameEditing = ref(false);
    // Modal de confirmação genérico: askConfirm({ title, message, confirmLabel, cancelLabel, danger })
    // devolve uma Promise com true (confirmou) ou false (cancelou, Esc ou clique no fundo).
    const confirmDialog = ref(null);
    const duplicateDialog = ref(null);
    const duplicateName = ref("");
    const confirmState = reactive({ title: "", message: "", confirmLabel: "Confirmar", cancelLabel: "Cancelar", danger: false });
    let confirmResolve = null;
    let duplicateResolve = null;
    const quickSave = ref(false);
    const savedFlash = ref(false);
    let flashTimer = null;
    const sharingCard = ref(false);
    const shareStatus = ref("");
    const cardQuery = new URLSearchParams(location.search);
    const card4Preview = cardQuery.has("card4");
    const card3Preview = cardQuery.has("card3");
    const card2Preview = cardQuery.has("card2");
    const cardPreview = cardQuery.has("card") || card2Preview || card3Preview || card4Preview;
    const previewName = card4Preview ? "card4" : card3Preview ? "card3" : card2Preview ? "card2" : "card";
    const cardPreviewUrl = ref("");
    let cardPreviewTimer = 0;
    let cardPreviewObjectUrl = "";
    let cardGeneration = 0;
    const dateFormat = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" });
    const canInstall = ref(false);
    let deferredPrompt = null;
    const gramsFormat = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
    const pctFormat = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });
    const pctFineFormat = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });
    // Percentual e gramas de um ingrediente aparecem como texto e viram campo ao clicar.
    // Enquanto o campo está aberto, o texto digitado fica aqui para o Vue não reescrevê-lo.
    const editing = reactive({ key: null, text: "", undo: 0 });

    const result = computed(() => Padeiro.compute(state));
    const ratioId = computed(() => Padeiro.matchRatio(state.levain.L, state.levain.A, state.levain.F));
    const levainItem = computed(() => state.ingredients.find((item) => Padeiro.isFerment(item) && item.ferment === "levain") || null);
    const levainProfile = computed(() => Padeiro.levainProfile(state.levain.L, state.levain.A, state.levain.F));
    // Segundo fermento: o tipo que falta em relação ao principal.
    const secondFerment = computed(() => state.ingredients.find((item) => item.role === "ferment2") || null);
    const fermentChoices = computed(() => {
      if (secondFerment.value) return [];
      const main = state.ingredients.find((item) => item.role === "ferment");
      if (main && main.ferment === "levain") {
        return [
          { kind: "seco", name: "Fermento seco", note: "reforço, sem água" },
          { kind: "fresco", name: "Fermento fresco", note: "reforço, sem água" },
        ];
      }
      return [{ kind: "levain", name: "Levain", note: "soma a água da alimentação" }];
    });

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

    // Barra da composição: farinha, água e outros, da esquerda para a direita.
    const compParts = computed(() =>
      [
        { key: "flour", label: "Farinha", share: result.value.flourShare },
        { key: "water", label: "Água", share: result.value.waterShare },
        { key: "other", label: "Outros", share: result.value.otherShare },
      ].filter((part) => part.share > 0.05)
    );

    const waterPct = computed({
      get() {
        const water = state.ingredients.find((item) => item.role === "water");
        return water ? Padeiro.num(water.pct) : 0;
      },
      set(value) {
        const water = state.ingredients.find((item) => item.role === "water");
        if (water) water.pct = Math.max(0, Padeiro.num(value));
      },
    });

    // Atalhos abaixo do slider da água: tocar leva direto ao valor.
    const waterMarks = [55, 65, 72, 85];
    // O trilho usual é 30–110. Fora disso, a ponta acompanha o número e fica lá
    // enquanto a água não volta para dentro: se o mínimo só mudasse depois do valor,
    // o navegador gravaria 30 ou 109 por cima do que foi digitado.
    const sliderBound = reactive({ min: 30, max: 110 });
    const sliderMin = computed(() => sliderBound.min);
    const sliderMax = computed(() => sliderBound.max);
    let syncingSlider = false;

    function syncSliderBound(value) {
      const pct = Math.max(0, Padeiro.num(value));
      if (pct < 30 || pct > 110) {
        if (pct < sliderBound.min) sliderBound.min = pct;
        if (pct > sliderBound.max) sliderBound.max = pct;
      } else {
        sliderBound.min = 30;
        sliderBound.max = 110;
      }
    }

    function onWaterSlide(event) {
      if (syncingSlider) return;
      waterPct.value = Math.max(0, Padeiro.num(event.target.value));
    }

    function settleSlider() {
      const min = sliderBound.min;
      const max = sliderBound.max;
      const shown = waterPct.value;
      syncingSlider = true;
      nextTick(() => {
        const input = document.getElementById("agua");
        if (input) {
          input.min = String(min);
          input.max = String(max);
          input.value = String(shown);
        }
        syncingSlider = false;
      });
    }

    syncSliderBound(waterPct.value);
    watch(waterPct, (value) => {
      syncSliderBound(value);
      settleSlider();
    });

    const waterDiffers = computed(() => Math.abs(result.value.hydration - waterPct.value) >= 0.15);

    function formatG(value) {
      return gramsFormat.format(Math.round(Padeiro.num(value)));
    }

    function formatPct(value) {
      return pctFormat.format(Padeiro.num(value));
    }

    function formatPctFine(value) {
      return pctFineFormat.format(Padeiro.num(value));
    }

    function editKey(item, field) {
      return field + ":" + item.id;
    }

    function isEditing(item, field) {
      return editing.key === editKey(item, field);
    }

    // field: "pct" ou um campo de gramas ("grams" na lista, "levainGrams" no modal do levain).
    // Os de gramas recalculam o percentual sobre a farinha; chaves diferentes evitam abrir os dois juntos.
    function startEdit(item, field) {
      const grams = field !== "pct";
      if (grams && result.value.flour <= 0) return;
      editing.key = editKey(item, field);
      editing.undo = item.pct;
      editing.text = grams
        ? String(rowOf(item.id).shown)
        : String(Math.round(Padeiro.num(item.pct) * 100) / 100);
    }

    // Vazio vale 0. Gramas viram percentual sobre a farinha da receita.
    function onEdit(item, field, text) {
      editing.text = text;
      const value = Math.max(0, Padeiro.num(text));
      if (field === "pct") item.pct = value;
      else if (result.value.flour > 0) item.pct = (value / result.value.flour) * 100;
    }

    function endEdit() {
      editing.key = null;
    }

    function cancelEdit(item) {
      item.pct = editing.undo;
      endEdit();
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

    // Ao sair do campo, vazio vira 0 de verdade.
    function settleFlour() {
      state.flour = Math.min(FLOUR_MAX, Math.max(0, Padeiro.num(state.flour)));
    }

    function settleWater(item) {
      item.water = Math.min(100, Math.max(0, Padeiro.num(item.water)));
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
        // A ativação só abre sozinha na primeira vez que a receita usa levain.
        // Voltando a um levain já configurado, ela fica fechada (o lápis edita).
        const firstTime = row.levainPct == null;
        row.pct = firstTime ? 20 : row.levainPct;
        row.ferment = "levain";
        row.name = "Levain";
        if (firstTime) nextTick(openLevain);
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

    // A ativação do levain fica num modal; a linha do fermento mostra o resumo.
    // O simulador reusa o modal, com gramas soltas, sem gravar na receita.
    const levainSim = ref(false);
    const sim = reactive({ total: 100, L: 1, A: 2, F: 2, seed: 20, water: 40, flour: 40 });

    function simGrams(value) {
      return Math.round(Padeiro.num(value) * 100) / 100;
    }

    function fillSimGrams() {
      const split = Padeiro.splitLevain(sim.total, sim.L, sim.A, sim.F);
      sim.seed = split.valid ? simGrams(split.seed) : 0;
      sim.water = split.valid ? simGrams(split.water) : 0;
      sim.flour = split.valid ? simGrams(split.flour) : 0;
    }

    function openLevain() {
      levainSim.value = false;
      const dialog = levainDialog.value;
      if (dialog && !dialog.open) dialog.showModal();
    }

    function openLevainSim() {
      levainSim.value = true;
      const dialog = levainDialog.value;
      if (dialog && !dialog.open) dialog.showModal();
    }

    function closeLevain() {
      const dialog = levainDialog.value;
      if (dialog && dialog.open) dialog.close();
    }

    // Clique fora do conteúdo (no fundo escurecido) fecha.
    function onDialogClick(event) {
      if (event.target === levainDialog.value) closeLevain();
    }

    // Modal do pão típico: faixa de hidratação das fontes, explicação e a lista dos outros.
    const breadRows = computed(() => {
      let low = 0;
      return Padeiro.BANDS.map((band) => {
        const info = Padeiro.BREAD_INFO[band.pao] || {};
        const appRange = band.max === Infinity ? "acima de " + low + "%" : (low ? low + 1 : "até ") + (low ? "–" : "") + band.max + "%";
        low = band.max;
        return { name: band.pao, appRange, typical: info.min != null ? info.min + "–" + info.max + "%" : "", approx: !!info.approx };
      });
    });

    const breadDetail = computed(() => {
      const name = breadShown.value;
      const info = Padeiro.BREAD_INFO[name];
      const hyd = result.value.hydration;
      if (!info) return { name, enriched: true, text: Padeiro.ENRICHED_INFO };
      let where = "dentro da faixa típica";
      if (hyd < info.min) where = "abaixo da faixa típica";
      else if (hyd > info.max) where = "acima da faixa típica";
      return { name, enriched: false, min: info.min, max: info.max, approx: !!info.approx, text: info.text, where, current: name === result.value.bread };
    });

    function openBread(name) {
      breadShown.value = name || result.value.bread;
      const dialog = breadDialog.value;
      if (dialog && !dialog.open) dialog.showModal();
    }

    function closeBread() {
      const dialog = breadDialog.value;
      if (dialog && dialog.open) dialog.close();
    }

    function onBreadClick(event) {
      if (event.target === breadDialog.value) closeBread();
    }

    // Sobre: versão, situação offline e busca de atualização.
    async function refreshAbout() {
      const answer = await askWorker("version");
      if (answer && answer.version) about.version = versionLabel(answer.version);
      else {
        const keys = "caches" in window ? await caches.keys().catch(() => []) : [];
        about.version = versionLabel(keys.find((key) => key.startsWith("padeiro-")));
      }
      about.offline = !!(navigator.serviceWorker && navigator.serviceWorker.controller);
      about.persisted = !!(navigator.storage && navigator.storage.persisted && (await navigator.storage.persisted().catch(() => false)));
    }

    function openAbout() {
      about.status = "";
      about.reload = false;
      refreshAbout();
      const dialog = aboutDialog.value;
      if (dialog && !dialog.open) dialog.showModal();
    }

    function closeAbout() {
      const dialog = aboutDialog.value;
      if (dialog && dialog.open) dialog.close();
    }

    function onAboutClick(event) {
      if (event.target === aboutDialog.value) closeAbout();
    }

    async function checkUpdate() {
      if (about.checking) return;
      const current = about.version ? "a versão " + about.version : "a versão atual";
      const registration = navigator.serviceWorker ? await navigator.serviceWorker.getRegistration().catch(() => null) : null;
      if (!registration) {
        about.status = "Este navegador não permite atualizar o app por aqui.";
        return;
      }
      if (!navigator.onLine) {
        about.status = "Sem internet agora. Você continua com " + current + ", que funciona offline.";
        return;
      }
      about.checking = true;
      about.reload = false;
      about.status = "Procurando atualização…";
      const activeBefore = registration.active;
      try {
        await registration.update();
        const fresh = registration.installing || registration.waiting;
        if (fresh) {
          about.status = "Baixando a versão nova…";
          const state = await untilActive(fresh);
          if (state === "redundant") {
            about.status = "A atualização não terminou. Você continua com " + current + ".";
          } else {
            await new Promise((resolve) => setTimeout(resolve, 300));
            await refreshAbout();
            about.status = "Versão " + about.version + " instalada. Recarregue para usar.";
            about.reload = true;
          }
        } else if (registration.active && registration.active !== activeBefore) {
          // O worker pode instalar e ativar entre update() e esta leitura.
          // Nesse caso, não há worker installing/waiting para aguardar, mas a página
          // ainda precisa ser recarregada para usar os arquivos da nova versão.
          await new Promise((resolve) => setTimeout(resolve, 300));
          await refreshAbout();
          about.status = "Versão " + about.version + " instalada. Recarregue para usar.";
          about.reload = true;
        } else {
          const answer = await askWorker("refresh", 20000);
          about.status = answer && answer.ok
            ? "Você já está na versão mais recente (" + about.version + "). Arquivos conferidos com o servidor."
            : "Não foi possível falar com o servidor. Você continua com " + current + ".";
        }
      } catch (error) {
        about.status = "Não foi possível falar com o servidor. Você continua com " + current + ".";
      } finally {
        about.checking = false;
      }
    }

    function reloadApp() {
      location.reload();
    }

    // Receitas salvas: descrição, data e hora e uma cópia do estado inteiro (com o L:A:F).
    function persistRecipes() {
      try {
        localStorage.setItem(RECIPES_KEY, JSON.stringify(recipes.value));
      } catch (error) {}
    }

    // O nome da tela vira o padrão no modal e pode ser ajustado antes de salvar.
    function openRecipes(quick = false) {
      quickSave.value = quick === true;
      recipeName.value = state.recipeName || "";
      const dialog = recipesDialog.value;
      if (dialog && !dialog.open) dialog.showModal();
      if (quickSave.value) nextTick(() => document.getElementById("recipe-name")?.focus());
    }

    function closeRecipes() {
      const dialog = recipesDialog.value;
      if (dialog && dialog.open) dialog.close();
    }

    function onRecipesClick(event) {
      if (event.target === recipesDialog.value) closeRecipes();
    }

    async function saveRecipe() {
      const name = recipeName.value.trim();
      if (!name) return;
      const duplicateIndex = recipes.value.findIndex((item) => recipeNameKey(item.name) === recipeNameKey(name));
      let replaceIndex = -1;
      if (duplicateIndex >= 0) {
        duplicateName.value = recipes.value[duplicateIndex].name || name;
        const choice = await askDuplicate();
        if (choice === null) return;
        if (choice === "replace") replaceIndex = duplicateIndex;
      }
      state.recipeName = name;
      const updated = {
        id: replaceIndex >= 0
          ? recipes.value[replaceIndex].id
          : "r-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        name,
        savedAt: new Date().toISOString(),
        state: JSON.parse(JSON.stringify(state)),
      };
      if (replaceIndex >= 0) recipes.value.splice(replaceIndex, 1);
      recipes.value.unshift(updated);
      persistRecipes();
      recipeName.value = "";
      if (quickSave.value) {
        closeRecipes();
        savedFlash.value = true;
        clearTimeout(flashTimer);
        flashTimer = setTimeout(() => (savedFlash.value = false), 2000);
      }
    }

    function editRecipeName() {
      recipeNameEditing.value = true;
      nextTick(() => document.getElementById("screen-recipe-name")?.focus());
    }

    function finishRecipeNameEdit() {
      const clean = String(state.recipeName || "").trim();
      state.recipeName = clean || "Minha Receita";
      recipeNameEditing.value = false;
    }

    function openRecipe(recipe) {
      const saved = normalizeState(JSON.parse(JSON.stringify(recipe.state)));
      if (!saved) return;
      endEdit();
      state.flour = saved.flour;
      state.ingredients = saved.ingredients;
      state.levain = saved.levain;
      state.recipeName = typeof recipe.name === "string" ? recipe.name.slice(0, 80) : saved.recipeName;
      closeRecipes();
    }

    // Zera só a tela. Abrir uma receita copia o estado; não existe edição da receita salva.
    async function clearRecipe() {
      const ok = await askConfirm({
        title: "Limpar a receita?",
        message: "A tela volta à receita inicial: 500 g de farinha, 65% de água, 2% de sal e 1% de fermento seco, com o nome Minha Receita. As receitas salvas e as calibrações do levain continuam.",
        confirmLabel: "Limpar",
        danger: true,
      });
      if (!ok) return;
      const fresh = Padeiro.defaultState();
      endEdit();
      recipeNameEditing.value = false;
      savedFlash.value = false;
      clearTimeout(flashTimer);
      state.flour = fresh.flour;
      state.ingredients = fresh.ingredients;
      state.levain = fresh.levain;
      state.recipeName = fresh.recipeName;
    }

    function askConfirm(options) {
      if (confirmResolve) confirmResolve(false);
      Object.assign(confirmState, { title: "", message: "", confirmLabel: "Confirmar", cancelLabel: "Cancelar", danger: false }, options);
      return new Promise((resolve) => {
        confirmResolve = resolve;
        const dialog = confirmDialog.value;
        if (dialog && !dialog.open) dialog.showModal();
      });
    }

    function answerConfirm(answer) {
      const resolve = confirmResolve;
      confirmResolve = null;
      const dialog = confirmDialog.value;
      if (dialog && dialog.open) dialog.close();
      if (resolve) resolve(answer);
    }

    function onConfirmClick(event) {
      if (event.target === confirmDialog.value) answerConfirm(false);
    }

    function askDuplicate() {
      if (duplicateResolve) duplicateResolve(null);
      return new Promise((resolve) => {
        duplicateResolve = resolve;
        const dialog = duplicateDialog.value;
        if (dialog && !dialog.open) dialog.showModal();
      });
    }

    function answerDuplicate(choice) {
      const resolve = duplicateResolve;
      duplicateResolve = null;
      const dialog = duplicateDialog.value;
      if (dialog && dialog.open) dialog.close();
      if (resolve) resolve(choice);
    }

    function onDuplicateClick(event) {
      if (event.target === duplicateDialog.value) answerDuplicate(null);
    }

    async function deleteRecipe(recipe) {
      const when = formatDate(recipe.savedAt);
      const ok = await askConfirm({
        title: "Apagar receita?",
        message: "“" + recipe.name + "”" + (when ? ", salva em " + when + "," : "") + " vai ser apagada. Não dá para desfazer.",
        confirmLabel: "Apagar",
        danger: true,
      });
      if (!ok) return;
      recipes.value = recipes.value.filter((item) => item.id !== recipe.id);
      persistRecipes();
    }

    function formatDate(iso) {
      const date = new Date(iso);
      return Number.isNaN(date.getTime()) ? "" : dateFormat.format(date);
    }

    function summaryOf(saved) {
      const source = saved && typeof saved === "object" ? saved : {};
      const res = Padeiro.compute(source);
      const lv = source.levain || {};
      const text = (Array.isArray(source.ingredients) ? source.ingredients : [])
        .filter((item) => Padeiro.isFerment(item))
        .map((item) =>
          item.ferment === "levain"
            ? "Levain " + formatPct(item.pct) + "% · " + [lv.L, lv.A, lv.F].map((v) => Padeiro.num(v)).join(":")
            : (item.ferment === "fresco" ? "Fermento fresco " : "Fermento seco ") + formatPct(item.pct) + "%"
        )
        .join(" + ");
      return formatG(res.flour) + " g de farinha · hidratação " + formatPct(res.hydration) + "% · " + text;
    }

    function roundedRect(ctx, x, y, width, height, radius, fill) {
      cardRoundPath(ctx, x, y, width, height, radius);
      ctx.fillStyle = fill;
      ctx.fill();
    }

    function cardRoundPath(ctx, x, y, width, height, radius) {
      const r = Math.min(radius, width / 2, height / 2);
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + width - r, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + r);
      ctx.lineTo(x + width, y + height - r);
      ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
      ctx.lineTo(x + r, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }

    function cardLines(ctx, text, maxWidth, maxLines = 2) {
      const words = String(text || "").split(/\s+/);
      let line = "";
      let lines = [];
      for (const word of words) {
        const next = line ? line + " " + word : word;
        if (ctx.measureText(next).width > maxWidth && line) {
          lines.push(line);
          line = word;
        } else line = next;
      }
      if (line) lines.push(line);
      if (lines.length > maxLines) {
        lines = lines.slice(0, maxLines);
        let last = lines[maxLines - 1];
        while (last && ctx.measureText(last + "…").width > maxWidth) last = last.slice(0, -1);
        lines[maxLines - 1] = last.trimEnd() + "…";
      }
      return lines;
    }

    function cardText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 2) {
      const lines = cardLines(ctx, text, maxWidth, maxLines);
      lines.forEach((part, index) => ctx.fillText(part, x, y + index * lineHeight));
      return lines.length;
    }

    // Ícone do ingrediente, o mesmo traço do app, num quadrado bege.
    function drawIngredientIcon(ctx, item, x, y, box) {
      roundedRect(ctx, x, y, box, box, Math.round(box * 0.3), "#f6f1e8");
      const svg = iconFor(item);
      const glyph = box * 0.52;
      const attr = (source, name) => {
        const found = new RegExp(name + '="([\\d.]+)"').exec(source);
        return found ? Number(found[1]) : 0;
      };
      ctx.save();
      ctx.translate(x + (box - glyph) / 2, y + (box - glyph) / 2);
      ctx.scale(glyph / 24, glyph / 24);
      ctx.strokeStyle = "#7d6244";
      ctx.lineWidth = 1.7;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (const match of svg.matchAll(/<path d="([^"]+)"/g)) ctx.stroke(new Path2D(match[1]));
      for (const match of svg.matchAll(/<circle([^>]*)\/?>/g)) {
        ctx.beginPath();
        ctx.arc(attr(match[1], "cx"), attr(match[1], "cy"), attr(match[1], "r"), 0, Math.PI * 2);
        ctx.stroke();
      }
      for (const match of svg.matchAll(/<rect([^>]*)\/?>/g)) {
        const rx = attr(match[1], "rx");
        cardRoundPath(ctx, attr(match[1], "x"), attr(match[1], "y"), attr(match[1], "width"), attr(match[1], "height"), rx);
        ctx.stroke();
      }
      ctx.restore();
    }

    async function makeRecipeCard() {
      if (document.fonts?.ready) await document.fonts.ready;
      const width = 1080;
      const pad = 64;
      const rows = result.value.rows;
      const hasLevain = result.value.levainOn;
      const levainBlockY = 610;
      const levainBlockHeight = 202;
      const levainGap = 68;
      const top = levainBlockY + (hasLevain ? levainBlockHeight + levainGap : 0);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas indisponível");

      // Linha sem observação fica baixa. Levain, fermento e teor de água guardam o texto embaixo.
      function ingredientNote(row) {
        if (row.ferment === "levain" && result.value.levain?.valid) {
          const lv = result.value.levain;
          return "Levain " + state.levain.L + ":" + state.levain.A + ":" + state.levain.F
            + " · hidratação " + formatPct(levainProfile.value?.hydration || 0) + "%"
            + " · " + formatG(lv.seed) + " g isca, " + formatG(lv.water) + " g água, " + formatG(lv.flour) + " g farinha";
        }
        if (row.custom) return "Teor de água " + formatPct(row.waterPct) + "%";
        if (row.waterPct > 0 && row.waterPct < 100) return formatPct(row.waterPct) + "% de água";
        if (row.ferment === "seco" || row.ferment === "fresco") {
          const to = row.ferment === "seco" ? "fresco" : "seco";
          return "Equivale a " + formatPct(Padeiro.convertYeast(row.pct, row.ferment, to)) + "% de " + to;
        }
        return "";
      }

      const layouts = rows.map((row) => {
        const note = ingredientNote(row);
        ctx.font = "600 23px Outfit, sans-serif";
        const nameLines = Math.max(1, cardLines(ctx, row.name || "Ingrediente", 480, 2).length);
        let noteLines = 0;
        if (note) {
          ctx.font = "500 15px Outfit, sans-serif";
          noteLines = Math.max(1, cardLines(ctx, note, width - pad * 2, 2).length);
        }
        const nameY = 34;
        const nameStep = 27;
        if (!noteLines) {
          return { row, note, height: nameY + (nameLines - 1) * nameStep + 18, nameY, noteY: 0 };
        }
        const noteY = nameY + (nameLines - 1) * nameStep + 24;
        return { row, note, height: noteY + (noteLines - 1) * 18 + 20, nameY, noteY };
      });
      const rowsHeight = layouts.reduce((sum, item) => sum + item.height, 0);
      const height = top + rowsHeight + 260;
      canvas.width = width;
      canvas.height = height;

      ctx.fillStyle = "#f3efe6";
      ctx.fillRect(0, 0, width, height);
      roundedRect(ctx, 36, 36, width - 72, height - 72, 34, "#fffdfb");

      const iconSize = 80;
      const iconX = pad;
      const iconY = 56;
      let titleX = pad;
      try {
        const icon = new Image();
        icon.src = "icons/icon-192.png";
        await icon.decode();
        ctx.save();
        cardRoundPath(ctx, iconX, iconY, iconSize, iconSize, 20);
        ctx.clip();
        ctx.drawImage(icon, iconX, iconY, iconSize, iconSize);
        ctx.restore();
        titleX = iconX + iconSize + 20;
      } catch (error) {}

      const titleSize = 42;
      ctx.fillStyle = "#7d6244";
      ctx.font = "700 " + titleSize + "px Outfit, sans-serif";
      ctx.fillText("PERCENTUAL DO PADEIRO", titleX, iconY + iconSize / 2 + titleSize * 0.32);
      ctx.fillStyle = "#2c241c";
      ctx.font = "700 48px Outfit, sans-serif";
      cardText(ctx, state.recipeName.trim() || "Minha Receita", pad, iconY + iconSize + 52, width - pad * 2, 54, 1);
      ctx.fillStyle = "#8d7f70";
      ctx.font = "500 22px Outfit, sans-serif";
      ctx.fillText(new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(new Date()), pad, iconY + iconSize + 86);

      const statY = 250;
      const statW = 290;
      const statGap = 18;
      const stats = [
        ["FARINHA", formatG(result.value.flour) + " g"],
        ["HIDRATAÇÃO TOTAL", formatPct(result.value.hydration) + "%"],
        ["PESO DA MASSA", formatG(result.value.totalWeight) + " g"],
      ];
      stats.forEach(([label, value], index) => {
        const x = pad + index * (statW + statGap);
        roundedRect(ctx, x, statY, statW, 108, 18, "#f7f2ea");
        ctx.textAlign = "center";
        ctx.fillStyle = "#8d7f70";
        ctx.font = "650 17px Outfit, sans-serif";
        ctx.fillText(label, x + statW / 2, statY + 34);
        ctx.fillStyle = "#2c241c";
        ctx.font = "700 34px Outfit, sans-serif";
        ctx.fillText(value, x + statW / 2, statY + 79);
      });
      ctx.textAlign = "left";

      const imageX = pad;
      const imageY = 370;
      const imageW = 420;
      const imageH = 210;
      roundedRect(ctx, imageX, imageY, imageW, imageH, 20, "#efe6da");
      try {
        const image = new Image();
        image.src = result.value.img;
        await image.decode();
        const scale = Math.max(imageW / image.naturalWidth, imageH / image.naturalHeight);
        const cropW = imageW / scale;
        const cropH = imageH / scale;
        ctx.save();
        cardRoundPath(ctx, imageX, imageY, imageW, imageH, 20);
        ctx.clip();
        ctx.drawImage(image, (image.naturalWidth - cropW) / 2, (image.naturalHeight - cropH) / 2, cropW, cropH, imageX, imageY, imageW, imageH);
        ctx.restore();
      } catch (error) {
        ctx.fillStyle = "#7d6244";
        ctx.font = "600 22px Outfit, sans-serif";
        ctx.fillText("Miolo do pão", imageX + 24, imageY + imageH / 2);
      }

      const infoX = 520;
      ctx.fillStyle = "#8d7f70";
      ctx.font = "650 18px Outfit, sans-serif";
      ctx.fillText("TEXTURA", infoX, 400);
      ctx.fillStyle = "#2c241c";
      ctx.font = "600 27px Outfit, sans-serif";
      cardText(ctx, result.value.band.sensacao, infoX, 442, 420, 34, 2);
      ctx.fillStyle = "#8d7f70";
      ctx.font = "650 18px Outfit, sans-serif";
      ctx.fillText(result.value.enriched ? "PÃO ENRIQUECIDO" : "PÃO TÍPICO", infoX, 510);
      ctx.fillStyle = "#2c241c";
      ctx.font = "600 26px Outfit, sans-serif";
      cardText(ctx, result.value.bread, infoX, 548, 420, 33, 2);

      if (hasLevain) {
        const lv = result.value.levain;
        const profile = levainProfile.value;
        roundedRect(ctx, pad, levainBlockY, width - pad * 2, levainBlockHeight, 18, "#f7f2ea");
        ctx.fillStyle = "#7d6244";
        ctx.font = "700 22px Outfit, sans-serif";
        ctx.fillText("LEVAIN USADO", pad + 22, levainBlockY + 38);
        ctx.fillStyle = "#2c241c";
        ctx.font = "600 17px Outfit, sans-serif";
        ctx.fillText("Na massa: " + formatG(result.value.levainGrams) + " g (" + formatPctFine(levainItem.value?.pct || 0) + "%) · proporção L:A:F " + state.levain.L + ":" + state.levain.A + ":" + state.levain.F, pad + 22, levainBlockY + 76);
        ctx.fillStyle = "#2c241c";
        ctx.font = "500 16px Outfit, sans-serif";
        const feedParts = lv?.valid
          ? formatG(lv.seed) + " g isca + " + formatG(lv.water) + " g água + " + formatG(lv.flour) + " g farinha · hidratação " + formatPct(lv.hydration) + "%"
          : "Alimentação ainda não configurada";
        cardText(ctx, "Alimentação: " + feedParts, pad + 22, levainBlockY + 109, width - pad * 2 - 44, 22, 2);
        const texture = profile ? profile.texture : "—";
        const peak = peakCaption(profile);
        ctx.fillText("Textura: " + texture + " · Pico: " + peak, pad + 22, levainBlockY + 151);
        const acidity = profile ? profile.flavor + " · nível " + (profile.score + 1) + "/5" : "—";
        ctx.fillText("Perfil de acidez: " + acidity, pad + 22, levainBlockY + 184);
      }

      const headingY = top;
      ctx.fillStyle = "#2c241c";
      ctx.font = "700 30px Outfit, sans-serif";
      ctx.fillText("Ingredientes", pad, headingY);
      ctx.fillStyle = "#8d7f70";
      ctx.font = "650 17px Outfit, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText("PERCENTUAL", 790, headingY);
      ctx.fillText("GRAMAS", width - pad, headingY);
      ctx.textAlign = "left";

      let rowY = headingY + 28;
      layouts.forEach((item) => {
        const row = item.row;
        const y = rowY;
        ctx.strokeStyle = "#efe6da";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pad, y);
        ctx.lineTo(width - pad, y);
        ctx.stroke();
        ctx.fillStyle = "#2c241c";
        ctx.font = "600 23px Outfit, sans-serif";
        cardText(ctx, row.name || "Ingrediente", pad, y + item.nameY, 480, 27, 2);
        ctx.fillStyle = "#7d6244";
        ctx.font = "600 22px Outfit, sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(formatPctFine(row.pct) + "%", 790, y + item.nameY);
        ctx.fillStyle = "#2c241c";
        ctx.font = "700 24px Outfit, sans-serif";
        ctx.fillText(formatG(row.shown) + " g", width - pad, y + item.nameY);
        ctx.textAlign = "left";
        if (item.note) {
          ctx.fillStyle = "#8d7f70";
          ctx.font = "500 15px Outfit, sans-serif";
          cardText(ctx, item.note, pad, y + item.noteY, width - pad * 2, 18, 2);
        }
        rowY += item.height;
      });

      const footerY = rowY + 28;
      roundedRect(ctx, pad, footerY, width - pad * 2, 82, 16, "#f7f2ea");
      ctx.fillStyle = "#7d6244";
      ctx.font = "650 18px Outfit, sans-serif";
      ctx.fillText("COMPOSIÇÃO DA MASSA", pad + 20, footerY + 30);
      ctx.fillStyle = "#2c241c";
      ctx.font = "600 19px Outfit, sans-serif";
      ctx.fillText("Farinha " + formatPct(result.value.flourShare) + "%   ·   Água " + formatPct(result.value.waterShare) + "%   ·   Outros " + formatPct(result.value.otherShare) + "%", pad + 20, footerY + 61);
      ctx.fillStyle = "#8d7f70";
      ctx.font = "500 16px Outfit, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Feito com Percentual do padeiro", width / 2, height - 62);
      ctx.textAlign = "left";

      return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Não foi possível gerar a imagem")), "image/png"));
    }

    // Card 4 começa igual ao primeiro. As próximas mudanças ficam só aqui.
    async function makeRecipeCard4() {
      if (document.fonts?.ready) await document.fonts.ready;
      const width = 1080;
      const pad = 64;
      const rows = result.value.rows;
      const hasLevain = result.value.levainOn;
      const imageY = 370;
      const imageH = 300;
      const levainBlockY = imageY + imageH + 30;
      const levainBlockHeight = 272;
      const levainGap = 28;
      const top = levainBlockY + (hasLevain ? levainBlockHeight + levainGap : 0);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas indisponível");

      // Linha sem observação fica baixa. O levain não repete aqui o bloco destacado.
      function ingredientNote(row) {
        if (row.ferment === "levain") return "";
        if (row.custom) return "Teor de água " + formatPct(row.waterPct) + "%";
        if (row.waterPct > 0 && row.waterPct < 100) return formatPct(row.waterPct) + "% de água";
        if (row.ferment === "seco" || row.ferment === "fresco") {
          const to = row.ferment === "seco" ? "fresco" : "seco";
          return "Equivale a " + formatPct(Padeiro.convertYeast(row.pct, row.ferment, to)) + "% de " + to;
        }
        return "";
      }

      const ingFrame = 6;
      const rowPad = 16;
      const iconBox = 36;
      const nameX = pad + ingFrame + rowPad + iconBox + 14;
      const trackH = 5;
      const rowRight = width - pad - ingFrame - rowPad;
      const noteMax = rowRight - nameX;
      const layouts = rows.map((row) => {
        const note = ingredientNote(row);
        ctx.font = "600 23px Outfit, sans-serif";
        const nameLines = Math.max(1, cardLines(ctx, row.name || "Ingrediente", 480, 2).length);
        let noteLines = 0;
        if (note) {
          ctx.font = "500 15px Outfit, sans-serif";
          noteLines = Math.max(1, cardLines(ctx, note, noteMax, 2).length);
        }
        const nameY = 34;
        const nameStep = 27;
        // A barra fica embaixo do item: o vão separa o texto dela.
        const barSpace = 8 + trackH;
        if (!noteLines) {
          const content = Math.max(nameY + (nameLines - 1) * nameStep + 10, 8 + iconBox);
          return { row, note, height: content + barSpace, nameY, noteY: 0 };
        }
        const noteY = nameY + (nameLines - 1) * nameStep + 24;
        const content = Math.max(noteY + (noteLines - 1) * 18 + 6, 8 + iconBox);
        return { row, note, height: content + barSpace, nameY, noteY };
      });
      const rowsHeight = layouts.reduce((sum, item) => sum + item.height, 0);
      const ingHead = 52;
      const ingTopPad = 6;
      const ingBotPad = 8;
      const footerGap = 28;
      const footerH = 156;
      const ingBlockH = ingHead + ingTopPad + rowsHeight + ingBotPad + ingFrame;
      const height = top + ingBlockH + footerGap + footerH + 102;
      canvas.width = width;
      canvas.height = height;

      ctx.fillStyle = "#f3efe6";
      ctx.fillRect(0, 0, width, height);
      roundedRect(ctx, 36, 36, width - 72, height - 72, 34, "#fffdfb");

      const iconSize = 80;
      const iconX = pad;
      const iconY = 56;
      let titleX = pad;
      try {
        const icon = new Image();
        icon.src = "icons/icon-192.png";
        await icon.decode();
        ctx.save();
        cardRoundPath(ctx, iconX, iconY, iconSize, iconSize, 20);
        ctx.clip();
        ctx.drawImage(icon, iconX, iconY, iconSize, iconSize);
        ctx.restore();
        titleX = iconX + iconSize + 20;
      } catch (error) {}

      const titleSize = 42;
      ctx.fillStyle = "#7d6244";
      ctx.font = "700 " + titleSize + "px Outfit, sans-serif";
      ctx.fillText("PERCENTUAL DO PADEIRO", titleX, iconY + iconSize / 2 + titleSize * 0.32);
      ctx.fillStyle = "#2c241c";
      ctx.font = "700 48px Outfit, sans-serif";
      cardText(ctx, state.recipeName.trim() || "Minha Receita", pad, iconY + iconSize + 52, width - pad * 2, 54, 1);
      ctx.fillStyle = "#8d7f70";
      ctx.font = "500 22px Outfit, sans-serif";
      ctx.fillText(new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(new Date()), pad, iconY + iconSize + 86);

      const statY = 250;
      const statGap = 14;
      const statSpan = width - pad * 2;
      const statW = (statSpan - statGap * 2) / 3;
      const stats = [
        ["FARINHA", formatG(result.value.flour) + " g"],
        ["HIDRATAÇÃO TOTAL", formatPct(result.value.hydration) + "%"],
        ["PESO DA MASSA", formatG(result.value.totalWeight) + " g"],
      ];
      stats.forEach(([label, value], index) => {
        const x = pad + index * (statW + statGap);
        roundedRect(ctx, x, statY, statW, 108, 18, "#f7f2ea");
        ctx.textAlign = "center";
        ctx.fillStyle = "#8d7f70";
        ctx.font = "650 17px Outfit, sans-serif";
        ctx.fillText(label, x + statW / 2, statY + 34);
        ctx.fillStyle = "#2c241c";
        ctx.font = "700 44px Outfit, sans-serif";
        ctx.fillText(value, x + statW / 2, statY + 82);
      });
      ctx.textAlign = "left";

      const imageX = pad;
      const imageW = 420;
      roundedRect(ctx, imageX, imageY, imageW, imageH, 20, "#efe6da");
      try {
        const image = new Image();
        image.src = result.value.img;
        await image.decode();
        const scale = Math.max(imageW / image.naturalWidth, imageH / image.naturalHeight);
        const cropW = imageW / scale;
        const cropH = imageH / scale;
        ctx.save();
        cardRoundPath(ctx, imageX, imageY, imageW, imageH, 20);
        ctx.clip();
        ctx.drawImage(image, (image.naturalWidth - cropW) / 2, (image.naturalHeight - cropH) / 2, cropW, cropH, imageX, imageY, imageW, imageH);
        ctx.restore();
      } catch (error) {
        ctx.fillStyle = "#7d6244";
        ctx.font = "600 22px Outfit, sans-serif";
        ctx.fillText("Miolo do pão", imageX + 24, imageY + imageH / 2);
      }

      const infoX = 520;
      const fermentKinds = new Set(rows.filter((row) => Padeiro.isFerment(row)).map((row) => row.ferment));
      const fermentacao = fermentKinds.size > 1 ? "Misto"
        : fermentKinds.has("levain") ? "Levain"
        : fermentKinds.has("fresco") ? "Fresco"
        : fermentKinds.has("seco") ? "Seco"
        : "—";
      ctx.fillStyle = "#8d7f70";
      ctx.font = "650 20px Outfit, sans-serif";
      ctx.fillText("FERMENTAÇÃO", infoX, 418);
      ctx.fillStyle = "#2c241c";
      ctx.font = "600 32px Outfit, sans-serif";
      ctx.fillText(fermentacao, infoX, 460);
      ctx.fillStyle = "#8d7f70";
      ctx.font = "650 20px Outfit, sans-serif";
      ctx.fillText("TEXTURA", infoX, 506);
      const feelColor = { firme: "#7a6244", macia: "#2f7a45", pegajosa: "#8a5a20", umida: "#8a3e28" }[result.value.band.feel] || "#8d7f70";
      ctx.fillStyle = feelColor;
      ctx.font = "600 32px Outfit, sans-serif";
      cardText(ctx, result.value.band.sensacao, infoX, 548, 480, 38, 2);
      ctx.fillStyle = "#8d7f70";
      ctx.font = "650 20px Outfit, sans-serif";
      ctx.fillText(result.value.enriched ? "PÃO ENRIQUECIDO" : "PÃO TÍPICO", infoX, 594);
      ctx.fillStyle = "#2c241c";
      ctx.font = "600 32px Outfit, sans-serif";
      cardText(ctx, result.value.bread, infoX, 636, 480, 38, 2);

      if (hasLevain) {
        const lv = result.value.levain;
        const profile = levainProfile.value;
        roundedRect(ctx, pad, levainBlockY, width - pad * 2, levainBlockHeight, 18, "#f7f2ea");
        ctx.fillStyle = "#7d6244";
        ctx.font = "700 22px Outfit, sans-serif";
        ctx.fillText("LEVAIN USADO", pad + 22, levainBlockY + 36);
        const bodyX = pad + 6;
        const bodyY = levainBlockY + 54;
        const bodyW = width - pad * 2 - 12;
        const bodyH = levainBlockHeight - 60;
        roundedRect(ctx, bodyX, bodyY, bodyW, bodyH, 12, "#fffdfb");
        const textX = bodyX + 18;
        const textW = bodyW - 36;
        ctx.fillStyle = "#2c241c";
        ctx.font = "600 17px Outfit, sans-serif";
        ctx.fillText("Na massa: " + formatG(result.value.levainGrams) + " g (" + formatPctFine(levainItem.value?.pct || 0) + "%) · proporção L:A:F " + state.levain.L + ":" + state.levain.A + ":" + state.levain.F, textX, bodyY + 32);
        ctx.font = "500 16px Outfit, sans-serif";
        const feedParts = lv?.valid
          ? formatG(lv.seed) + " g isca + " + formatG(lv.water) + " g água + " + formatG(lv.flour) + " g farinha · hidratação " + formatPct(lv.hydration) + "%"
          : "Alimentação ainda não configurada";
        cardText(ctx, "Alimentação: " + feedParts, textX, bodyY + 60, textW, 22, 2);
        const texture = profile ? profile.texture : "—";
        const peak = peakCaption(profile);
        ctx.fillText("Textura: " + texture + " · Pico: " + peak, textX, bodyY + 92);

        // A escala do modal: cinco trechos, do láctico ao acético, um marcado.
        const scaleX = textX;
        const scaleY = bodyY + 112;
        const scaleW = textW;
        const scaleH = 14;
        const scaleGap = 8;
        const segW = (scaleW - scaleGap * 4) / 5;
        const score = profile ? profile.score : -1;
        for (let i = 0; i < 5; i++) {
          roundedRect(ctx, scaleX + i * (segW + scaleGap), scaleY, segW, scaleH, scaleH / 2, i === score ? "#7d6244" : "#efe6da");
        }
        ctx.fillStyle = "#2c241c";
        ctx.font = "600 15px Outfit, sans-serif";
        ctx.fillText("Láctico · suave", scaleX, scaleY + 36);
        ctx.textAlign = "right";
        ctx.fillText("Acético · azedo", scaleX + scaleW, scaleY + 36);
        ctx.textAlign = "left";
        ctx.font = "650 20px Outfit, sans-serif";
        ctx.fillText(profile ? profile.flavor : "—", scaleX, scaleY + 64);
      }

      const ingY = top;
      const ingBodyX = pad + ingFrame;
      const ingBodyY = ingY + ingHead;
      const ingBodyW = width - pad * 2 - ingFrame * 2;
      const ingBodyH = ingTopPad + rowsHeight + ingBotPad;
      roundedRect(ctx, pad, ingY, width - pad * 2, ingBlockH, 16, "#f7f2ea");
      ctx.fillStyle = "#8d7f70";
      ctx.font = "650 17px Outfit, sans-serif";
      ctx.fillText("INGREDIENTE", pad + 20, ingY + 34);
      ctx.textAlign = "right";
      ctx.fillText("PERCENTUAL", 790, ingY + 34);
      ctx.fillText("PESO", rowRight, ingY + 34);
      ctx.textAlign = "left";
      roundedRect(ctx, ingBodyX, ingBodyY, ingBodyW, ingBodyH, 12, "#fffdfb");

      let rowY = ingBodyY + ingTopPad;
      const rowLeft = ingBodyX + rowPad;
      layouts.forEach((item) => {
        const row = item.row;
        const y = rowY;
        const trackW = rowRight - rowLeft;
        const trackY = y + item.height - trackH;
        roundedRect(ctx, rowLeft, trackY, trackW, trackH, trackH / 2, "#f0e8dc");
        const pct = Math.max(0, Math.min(100, Number(row.pct) || 0));
        const fillW = trackW * pct / 100;
        if (fillW > 1) roundedRect(ctx, rowLeft, trackY, Math.max(trackH, fillW), trackH, trackH / 2, "#a68462");
        drawIngredientIcon(ctx, row, rowLeft, y + 8, iconBox);
        ctx.fillStyle = "#2c241c";
        ctx.font = "600 23px Outfit, sans-serif";
        cardText(ctx, row.name || "Ingrediente", nameX, y + item.nameY, 500, 27, 2);
        ctx.fillStyle = "#7d6244";
        ctx.font = "600 22px Outfit, sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(formatPctFine(row.pct) + "%", 790, y + item.nameY);
        ctx.fillStyle = "#2c241c";
        ctx.font = "700 24px Outfit, sans-serif";
        ctx.fillText(formatG(row.shown) + " g", rowRight, y + item.nameY);
        ctx.textAlign = "left";
        if (item.note) {
          ctx.fillStyle = "#8d7f70";
          ctx.font = "500 15px Outfit, sans-serif";
          cardText(ctx, item.note, nameX, y + item.noteY, noteMax, 18, 2);
        }
        rowY += item.height;
      });

      const footerY = ingY + ingBlockH + footerGap;
      roundedRect(ctx, pad, footerY, width - pad * 2, footerH, 16, "#f7f2ea");
      ctx.fillStyle = "#7d6244";
      ctx.font = "650 18px Outfit, sans-serif";
      ctx.fillText("COMPOSIÇÃO DA MASSA", pad + 20, footerY + 32);
      const bodyX = pad + 6;
      const bodyY = footerY + 48;
      const bodyW = width - pad * 2 - 12;
      roundedRect(ctx, bodyX, bodyY, bodyW, footerH - 54, 12, "#fffdfb");
      const barX = bodyX + 16;
      const barW = bodyW - 32;
      const parts = compParts.value;
      const barY = bodyY + 16;
      const barH = 16;
      if (parts.length) {
        const gap = 3;
        const inner = barW - gap * (parts.length - 1);
        const totalShare = parts.reduce((sum, part) => sum + part.share, 0) || 1;
        const widths = parts.map((part) => Math.max(6, Math.round(inner * part.share / totalShare)));
        const used = widths.reduce((sum, item) => sum + item, 0);
        widths[widths.length - 1] = Math.max(4, widths[widths.length - 1] + inner - used);
        const colors = { flour: "#b8792e", water: "#2f80c0", other: "#6e9a35" };
        let bx = barX;
        widths.forEach((w, index) => {
          roundedRect(ctx, bx, barY, Math.max(4, w), barH, parts.length === 1 ? 6 : 3, colors[parts[index].key] || "#b8792e");
          bx += w + gap;
        });
      }
      const legend = [
        ["Farinha", result.value.flourShare, "#9e6828"],
        ["Água", result.value.waterShare, "#2c78b4"],
        ["Outros", result.value.otherShare, "#5a7e2b"],
      ];
      legend.forEach(([label, share, color], index) => {
        const x = index === 0 ? barX : index === 2 ? barX + barW : barX + barW / 2;
        ctx.textAlign = index === 0 ? "left" : index === 2 ? "right" : "center";
        ctx.fillStyle = color;
        ctx.font = "650 16px Outfit, sans-serif";
        ctx.fillText(label, x, bodyY + 50);
        ctx.fillStyle = "#2c241c";
        ctx.font = "680 22px Outfit, sans-serif";
        ctx.fillText(formatPct(share) + "%", x, bodyY + 76);
      });
      ctx.textAlign = "left";
      ctx.fillStyle = "#8d7f70";
      ctx.font = "500 16px Outfit, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Feito com Percentual do padeiro", width / 2, height - 62);
      ctx.textAlign = "left";

      return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Não foi possível gerar a imagem")), "image/png"));
    }

    // Card 2: o topo do card atual (ícone, título, nome, data) e, abaixo,
    // o card da tela (farinha, barra, foto, hidratação, slider da água).
    // Levain, ingredientes e composição seguem como no card atual.
    async function makeRecipeCard2() {
      if (document.fonts?.ready) await document.fonts.ready;
      const width = 1080;
      const pad = 64;
      const rows = result.value.rows;
      const hasLevain = result.value.levainOn;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas indisponível");

      function ingredientNote(row) {
        if (row.ferment === "levain" && result.value.levain?.valid) {
          const lv = result.value.levain;
          return "Levain " + state.levain.L + ":" + state.levain.A + ":" + state.levain.F
            + " · hidratação " + formatPct(levainProfile.value?.hydration || 0) + "%"
            + " · " + formatG(lv.seed) + " g isca, " + formatG(lv.water) + " g água, " + formatG(lv.flour) + " g farinha";
        }
        if (row.custom) return "Teor de água " + formatPct(row.waterPct) + "%";
        if (row.waterPct > 0 && row.waterPct < 100) return formatPct(row.waterPct) + "% de água";
        if (row.ferment === "seco" || row.ferment === "fresco") {
          const to = row.ferment === "seco" ? "fresco" : "seco";
          return "Equivale a " + formatPct(Padeiro.convertYeast(row.pct, row.ferment, to)) + "% de " + to;
        }
        return "";
      }

      const layouts = rows.map((row) => {
        const note = ingredientNote(row);
        ctx.font = "600 23px Outfit, sans-serif";
        const nameLines = Math.max(1, cardLines(ctx, row.name || "Ingrediente", 480, 2).length);
        let noteLines = 0;
        if (note) {
          ctx.font = "500 15px Outfit, sans-serif";
          noteLines = Math.max(1, cardLines(ctx, note, width - pad * 2, 2).length);
        }
        const nameY = 34;
        const nameStep = 27;
        if (!noteLines) {
          return { row, note, height: nameY + (nameLines - 1) * nameStep + 18, nameY, noteY: 0 };
        }
        const noteY = nameY + (nameLines - 1) * nameStep + 24;
        return { row, note, height: noteY + (noteLines - 1) * 18 + 20, nameY, noteY };
      });
      const rowsHeight = layouts.reduce((sum, item) => sum + item.height, 0);

      const sectionY = 272;
      const photoW = 380;
      const photoH = 253;
      const colGap = 36;
      const leftW = width - pad * 2 - photoW - colGap;
      const rightX = pad + leftW + colGap;
      const infoTop = sectionY + photoH + 22;
      const breadY = infoTop + 178;
      const rightBottom = breadY + 36;
      // A coluna da farinha fica centrada na foto + hidratação, como no app.
      const leftShift = Math.max(0, Math.round((rightBottom - sectionY - 262) / 2));
      // Os três cards ocupam o vão à esquerda da foto, acima da farinha.
      const statGap = 10;
      const statW = (leftW - statGap * 2) / 3;
      const statH = Math.max(84, leftShift - 20);
      const statY = sectionY;
      const sliderY = rightBottom + 36;
      const afterSlider = sliderY + 118;
      const levainBlockY = afterSlider + 20;
      const levainBlockHeight = 202;
      const headingY = hasLevain ? levainBlockY + levainBlockHeight + 68 : afterSlider + 44;
      const height = headingY + rowsHeight + 260;
      canvas.width = width;
      canvas.height = height;

      ctx.fillStyle = "#f3efe6";
      ctx.fillRect(0, 0, width, height);
      roundedRect(ctx, 36, 36, width - 72, height - 72, 34, "#fffdfb");

      const iconSize = 80;
      const iconX = pad;
      const iconY = 56;
      let titleX = pad;
      try {
        const icon = new Image();
        icon.src = "icons/icon-192.png";
        await icon.decode();
        ctx.save();
        cardRoundPath(ctx, iconX, iconY, iconSize, iconSize, 20);
        ctx.clip();
        ctx.drawImage(icon, iconX, iconY, iconSize, iconSize);
        ctx.restore();
        titleX = iconX + iconSize + 20;
      } catch (error) {}

      const titleSize = 42;
      ctx.fillStyle = "#7d6244";
      ctx.font = "700 " + titleSize + "px Outfit, sans-serif";
      ctx.fillText("PERCENTUAL DO PADEIRO", titleX, iconY + iconSize / 2 + titleSize * 0.32);
      ctx.fillStyle = "#2c241c";
      ctx.font = "700 48px Outfit, sans-serif";
      cardText(ctx, state.recipeName.trim() || "Minha Receita", pad, iconY + iconSize + 52, width - pad * 2, 54, 1);
      ctx.fillStyle = "#8d7f70";
      ctx.font = "500 22px Outfit, sans-serif";
      ctx.fillText(new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(new Date()), pad, iconY + iconSize + 86);

      const stats = [
        ["FARINHA", formatG(result.value.flour) + " g"],
        ["HIDRATAÇÃO TOTAL", formatPct(result.value.hydration) + "%"],
        ["PESO DA MASSA", formatG(result.value.totalWeight) + " g"],
      ];
      stats.forEach(([label, value], index) => {
        const x = pad + index * (statW + statGap);
        roundedRect(ctx, x, statY, statW, statH, 16, "#f7f2ea");
        ctx.fillStyle = "#8d7f70";
        let labelSize = 14;
        ctx.font = "650 " + labelSize + "px Outfit, sans-serif";
        while (labelSize > 11 && ctx.measureText(label).width > statW - 24) {
          labelSize -= 1;
          ctx.font = "650 " + labelSize + "px Outfit, sans-serif";
        }
        ctx.textAlign = "center";
        ctx.fillText(label, x + statW / 2, statY + 26);
        ctx.fillStyle = "#2c241c";
        let valueSize = 28;
        ctx.font = "700 " + valueSize + "px Outfit, sans-serif";
        while (valueSize > 18 && ctx.measureText(value).width > statW - 24) {
          valueSize -= 1;
          ctx.font = "700 " + valueSize + "px Outfit, sans-serif";
        }
        ctx.fillText(value, x + statW / 2, statY + statH - 20);
      });
      ctx.textAlign = "left";

      ctx.letterSpacing = "0.12em";
      ctx.fillStyle = "#8d7f70";
      ctx.font = "650 18px Outfit, sans-serif";
      ctx.fillText("FARINHA", pad, sectionY + leftShift + 22);
      const kickerW = ctx.measureText("FARINHA").width;
      ctx.letterSpacing = "0px";
      ctx.font = "650 18px Outfit, sans-serif";
      const pill = "100%";
      const pillW = ctx.measureText(pill).width + 22;
      const pillH = 30;
      const pillX = pad + kickerW + 14;
      const pillY = sectionY + leftShift;
      cardRoundPath(ctx, pillX, pillY, pillW, pillH, 15);
      ctx.strokeStyle = "#e4d8c8";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = "#8d7f70";
      ctx.textAlign = "center";
      ctx.fillText(pill, pillX + pillW / 2, pillY + 21);
      ctx.textAlign = "left";

      const flourText = formatG(result.value.flour);
      ctx.fillStyle = "#2c241c";
      ctx.font = "640 78px Outfit, sans-serif";
      ctx.fillText(flourText, pad, sectionY + leftShift + 112);
      const flourW = ctx.measureText(flourText).width;
      ctx.fillStyle = "#8d7f70";
      ctx.font = "600 28px Outfit, sans-serif";
      ctx.fillText("g", pad + flourW + 8, sectionY + leftShift + 108);

      const parts = compParts.value;
      const barY = sectionY + leftShift + 136;
      const barH = 16;
      if (parts.length) {
        const gap = 3;
        const inner = leftW - gap * (parts.length - 1);
        const totalShare = parts.reduce((sum, part) => sum + part.share, 0) || 1;
        const widths = parts.map((part) => Math.max(6, Math.round(inner * part.share / totalShare)));
        const used = widths.reduce((sum, item) => sum + item, 0);
        widths[widths.length - 1] += inner - used;
        const colors = { flour: "#b8792e", water: "#2f80c0", other: "#6e9a35" };
        let x = pad;
        widths.forEach((w, index) => {
          const radius = parts.length === 1 ? 6 : 3;
          roundedRect(ctx, x, barY, Math.max(4, w), barH, radius, colors[parts[index].key] || "#b8792e");
          x += w + gap;
        });
      }

      const legend = [
        ["flour", "Farinha", result.value.flourShare, "#9e6828"],
        ["water", "Água", result.value.waterShare, "#2c78b4"],
        ["other", "Outros", result.value.otherShare, "#5a7e2b"],
      ];
      legend.forEach(([key, label, share, color], index) => {
        const x = pad + (leftW - 8) * (index / 2);
        ctx.textAlign = index === 2 ? "right" : "left";
        ctx.fillStyle = color;
        ctx.font = "650 16px Outfit, sans-serif";
        ctx.fillText(label, index === 2 ? pad + leftW : x, sectionY + leftShift + 176);
        ctx.fillStyle = "#2c241c";
        ctx.font = "680 22px Outfit, sans-serif";
        ctx.fillText(formatPct(share) + "%", index === 2 ? pad + leftW : x, sectionY + leftShift + 202);
      });
      ctx.textAlign = "left";

      const massText = formatG(result.value.totalWeight) + " g";
      ctx.fillStyle = "#2c241c";
      ctx.font = "700 32px Outfit, sans-serif";
      ctx.fillText(massText, pad, sectionY + leftShift + 252);
      const massW = ctx.measureText(massText).width;
      ctx.fillStyle = "#8d7f70";
      ctx.font = "600 20px Outfit, sans-serif";
      ctx.fillText("de massa", pad + massW + 8, sectionY + leftShift + 250);

      roundedRect(ctx, rightX, sectionY, photoW, photoH, 16, "#efe6da");
      try {
        const image = new Image();
        image.src = result.value.img;
        await image.decode();
        const scale = Math.max(photoW / image.naturalWidth, photoH / image.naturalHeight);
        const cropW = photoW / scale;
        const cropH = photoH / scale;
        ctx.save();
        cardRoundPath(ctx, rightX, sectionY, photoW, photoH, 16);
        ctx.clip();
        ctx.drawImage(image, (image.naturalWidth - cropW) / 2, (image.naturalHeight - cropH) / 2, cropW, cropH, rightX, sectionY, photoW, photoH);
        ctx.restore();
      } catch (error) {
        ctx.fillStyle = "#7d6244";
        ctx.font = "600 22px Outfit, sans-serif";
        ctx.fillText("Miolo do pão", rightX + 24, sectionY + photoH / 2);
      }

      ctx.letterSpacing = "0.08em";
      ctx.fillStyle = "#8d7f70";
      ctx.font = "650 16px Outfit, sans-serif";
      ctx.fillText("HIDRATAÇÃO TOTAL", rightX, infoTop + 18);
      ctx.letterSpacing = "0px";
      const hydText = formatPct(result.value.hydration);
      ctx.fillStyle = "#2c241c";
      ctx.font = "700 52px Outfit, sans-serif";
      ctx.fillText(hydText, rightX, infoTop + 74);
      const hydW = ctx.measureText(hydText).width;
      ctx.fillStyle = "#8d7f70";
      ctx.font = "650 24px Outfit, sans-serif";
      ctx.fillText("%", rightX + hydW + 4, infoTop + 72);
      const feelColor = { firme: "#7a6244", macia: "#2f7a45", pegajosa: "#8a5a20", umida: "#8a3e28" }[result.value.band.feel] || "#8d7f70";
      ctx.fillStyle = feelColor;
      ctx.font = "600 22px Outfit, sans-serif";
      cardText(ctx, result.value.band.sensacao, rightX, infoTop + 114, photoW, 28, 2);
      ctx.font = "650 22px Outfit, sans-serif";
      const breadLines = cardLines(ctx, "Típico de " + result.value.bread, photoW, 2);
      breadLines.forEach((line, index) => {
        const y = infoTop + 178 + index * 28;
        const prefix = "Típico de ";
        if (line.startsWith(prefix)) {
          ctx.fillStyle = "#8d7f70";
          ctx.font = "500 22px Outfit, sans-serif";
          ctx.fillText(prefix, rightX, y);
          const prefixW = ctx.measureText(prefix).width;
          ctx.fillStyle = "#2c241c";
          ctx.font = "650 22px Outfit, sans-serif";
          ctx.fillText(line.slice(prefix.length), rightX + prefixW, y);
        } else {
          ctx.fillStyle = "#2c241c";
          ctx.font = "650 22px Outfit, sans-serif";
          ctx.fillText(line, rightX, y);
        }
      });

      ctx.letterSpacing = "0.12em";
      ctx.fillStyle = "#8d7f70";
      ctx.font = "650 18px Outfit, sans-serif";
      ctx.fillText("ÁGUA", pad, sliderY + 28);
      ctx.letterSpacing = "0px";
      const waterText = formatPct(waterPct.value);
      ctx.font = "600 20px Outfit, sans-serif";
      const waterPctW = ctx.measureText("%").width;
      ctx.font = "650 40px Outfit, sans-serif";
      const waterW = ctx.measureText(waterText).width;
      const waterRight = width - pad - waterPctW - 6;
      ctx.fillStyle = "#2c241c";
      ctx.fillText(waterText, waterRight - waterW, sliderY + 32);
      ctx.fillStyle = "#8d7f70";
      ctx.font = "600 20px Outfit, sans-serif";
      ctx.fillText("%", waterRight + 4, sliderY + 30);

      const trackX = pad;
      const trackW = width - pad * 2;
      const trackY = sliderY + 58;
      const trackH = 10;
      const thumb = 36;
      const trackGrad = ctx.createLinearGradient(trackX, 0, trackX + trackW, 0);
      trackGrad.addColorStop(0, "#c8b59a");
      trackGrad.addColorStop(0.4, "#8ea36a");
      trackGrad.addColorStop(0.7, "#d0a15c");
      trackGrad.addColorStop(1, "#b65c3c");
      roundedRect(ctx, trackX, trackY, trackW, trackH, 8, trackGrad);
      const waterT = Math.min(1, Math.max(0, (waterPct.value - 30) / 80));
      const thumbCx = trackX + thumb / 2 + (trackW - thumb) * waterT;
      const thumbCy = trackY + trackH / 2;
      ctx.save();
      ctx.shadowColor = "rgba(60, 40, 20, 0.18)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 2;
      ctx.beginPath();
      ctx.arc(thumbCx, thumbCy, thumb / 2 - 2, 0, Math.PI * 2);
      ctx.fillStyle = "#fffdfb";
      ctx.fill();
      ctx.restore();
      ctx.beginPath();
      ctx.arc(thumbCx, thumbCy, thumb / 2 - 2, 0, Math.PI * 2);
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#7d6244";
      ctx.stroke();

      ctx.font = "600 18px Outfit, sans-serif";
      waterMarks.forEach((mark) => {
        const t = (mark - 30) / 80;
        const x = trackX + thumb / 2 + (trackW - thumb) * t;
        const on = Math.round(waterPct.value) === mark;
        ctx.fillStyle = on ? "#2c241c" : "#8d7f70";
        ctx.font = (on ? "700 " : "600 ") + "18px Outfit, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(mark + "%", x, trackY + 40);
      });
      ctx.textAlign = "left";

      if (hasLevain) {
        const lv = result.value.levain;
        const profile = levainProfile.value;
        roundedRect(ctx, pad, levainBlockY, width - pad * 2, levainBlockHeight, 18, "#f7f2ea");
        ctx.fillStyle = "#7d6244";
        ctx.font = "700 22px Outfit, sans-serif";
        ctx.fillText("LEVAIN USADO", pad + 22, levainBlockY + 38);
        ctx.fillStyle = "#2c241c";
        ctx.font = "600 17px Outfit, sans-serif";
        ctx.fillText("Na massa: " + formatG(result.value.levainGrams) + " g (" + formatPctFine(levainItem.value?.pct || 0) + "%) · proporção L:A:F " + state.levain.L + ":" + state.levain.A + ":" + state.levain.F, pad + 22, levainBlockY + 76);
        ctx.font = "500 16px Outfit, sans-serif";
        const feedParts = lv?.valid
          ? formatG(lv.seed) + " g isca + " + formatG(lv.water) + " g água + " + formatG(lv.flour) + " g farinha · hidratação " + formatPct(lv.hydration) + "%"
          : "Alimentação ainda não configurada";
        cardText(ctx, "Alimentação: " + feedParts, pad + 22, levainBlockY + 109, width - pad * 2 - 44, 22, 2);
        const texture = profile ? profile.texture : "—";
        const peak = peakCaption(profile);
        ctx.fillText("Textura: " + texture + " · Pico: " + peak, pad + 22, levainBlockY + 151);
        const acidity = profile ? profile.flavor + " · nível " + (profile.score + 1) + "/5" : "—";
        ctx.fillText("Perfil de acidez: " + acidity, pad + 22, levainBlockY + 184);
      }

      ctx.fillStyle = "#2c241c";
      ctx.font = "700 30px Outfit, sans-serif";
      ctx.fillText("Ingredientes", pad, headingY);
      ctx.fillStyle = "#8d7f70";
      ctx.font = "650 17px Outfit, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText("PERCENTUAL", 790, headingY);
      ctx.fillText("GRAMAS", width - pad, headingY);
      ctx.textAlign = "left";

      let rowY = headingY + 28;
      layouts.forEach((item) => {
        const row = item.row;
        const y = rowY;
        ctx.strokeStyle = "#efe6da";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pad, y);
        ctx.lineTo(width - pad, y);
        ctx.stroke();
        ctx.fillStyle = "#2c241c";
        ctx.font = "600 23px Outfit, sans-serif";
        cardText(ctx, row.name || "Ingrediente", pad, y + item.nameY, 480, 27, 2);
        ctx.fillStyle = "#7d6244";
        ctx.font = "600 22px Outfit, sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(formatPctFine(row.pct) + "%", 790, y + item.nameY);
        ctx.fillStyle = "#2c241c";
        ctx.font = "700 24px Outfit, sans-serif";
        ctx.fillText(formatG(row.shown) + " g", width - pad, y + item.nameY);
        ctx.textAlign = "left";
        if (item.note) {
          ctx.fillStyle = "#8d7f70";
          ctx.font = "500 15px Outfit, sans-serif";
          cardText(ctx, item.note, pad, y + item.noteY, width - pad * 2, 18, 2);
        }
        rowY += item.height;
      });

      const footerY = rowY + 28;
      roundedRect(ctx, pad, footerY, width - pad * 2, 82, 16, "#f7f2ea");
      ctx.fillStyle = "#7d6244";
      ctx.font = "650 18px Outfit, sans-serif";
      ctx.fillText("COMPOSIÇÃO DA MASSA", pad + 20, footerY + 30);
      ctx.fillStyle = "#2c241c";
      ctx.font = "600 19px Outfit, sans-serif";
      ctx.fillText("Farinha " + formatPct(result.value.flourShare) + "%   ·   Água " + formatPct(result.value.waterShare) + "%   ·   Outros " + formatPct(result.value.otherShare) + "%", pad + 20, footerY + 61);
      ctx.fillStyle = "#8d7f70";
      ctx.font = "500 16px Outfit, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Feito com Percentual do padeiro", width / 2, height - 62);
      ctx.textAlign = "left";
      ctx.letterSpacing = "0px";

      return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Não foi possível gerar a imagem")), "image/png"));
    }

    // Card 3: farinha e peso à esquerda, hidratação e barras no meio, foto com textura à direita.
    async function makeRecipeCard3() {
      if (document.fonts?.ready) await document.fonts.ready;
      const width = 1080;
      const pad = 64;
      const rows = result.value.rows;
      const hasLevain = result.value.levainOn;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas indisponível");

      function ingredientNote(row) {
        if (row.ferment === "levain" && result.value.levain?.valid) {
          const lv = result.value.levain;
          return "Levain " + state.levain.L + ":" + state.levain.A + ":" + state.levain.F
            + " · hidratação " + formatPct(levainProfile.value?.hydration || 0) + "%"
            + " · " + formatG(lv.seed) + " g isca, " + formatG(lv.water) + " g água, " + formatG(lv.flour) + " g farinha";
        }
        if (row.custom) return "Teor de água " + formatPct(row.waterPct) + "%";
        if (row.waterPct > 0 && row.waterPct < 100) return formatPct(row.waterPct) + "% de água";
        if (row.ferment === "seco" || row.ferment === "fresco") {
          const to = row.ferment === "seco" ? "fresco" : "seco";
          return "Equivale a " + formatPct(Padeiro.convertYeast(row.pct, row.ferment, to)) + "% de " + to;
        }
        return "";
      }

      const layouts = rows.map((row) => {
        const note = ingredientNote(row);
        ctx.font = "600 23px Outfit, sans-serif";
        const nameLines = Math.max(1, cardLines(ctx, row.name || "Ingrediente", 480, 2).length);
        let noteLines = 0;
        if (note) {
          ctx.font = "500 15px Outfit, sans-serif";
          noteLines = Math.max(1, cardLines(ctx, note, width - pad * 2, 2).length);
        }
        const nameY = 34;
        const nameStep = 27;
        if (!noteLines) return { row, note, height: nameY + (nameLines - 1) * nameStep + 18, nameY, noteY: 0 };
        const noteY = nameY + (nameLines - 1) * nameStep + 24;
        return { row, note, height: noteY + (noteLines - 1) * 18 + 20, nameY, noteY };
      });
      const rowsHeight = layouts.reduce((sum, item) => sum + item.height, 0);

      const heroY = 258;
      const colGap = 22;
      const leftW = 292;
      const photoW = 380;
      const photoH = 253;
      const photoX = width - pad - photoW;
      const centerX = pad + leftW + colGap;
      const centerW = photoX - colGap - centerX;
      const stackGap = 14;
      const stackH = (photoH - stackGap) / 2;
      const infoTop = heroY + photoH + 22;
      const heroBottom = infoTop + 188;
      const levainBlockY = heroBottom + 24;
      const levainBlockHeight = 202;
      const headingY = hasLevain ? levainBlockY + levainBlockHeight + 68 : heroBottom + 44;
      const height = headingY + rowsHeight + 260;
      canvas.width = width;
      canvas.height = height;

      ctx.fillStyle = "#f3efe6";
      ctx.fillRect(0, 0, width, height);
      roundedRect(ctx, 36, 36, width - 72, height - 72, 34, "#fffdfb");

      const iconSize = 80;
      const iconX = pad;
      const iconY = 56;
      let titleX = pad;
      try {
        const icon = new Image();
        icon.src = "icons/icon-192.png";
        await icon.decode();
        ctx.save();
        cardRoundPath(ctx, iconX, iconY, iconSize, iconSize, 20);
        ctx.clip();
        ctx.drawImage(icon, iconX, iconY, iconSize, iconSize);
        ctx.restore();
        titleX = iconX + iconSize + 20;
      } catch (error) {}
      const titleSize = 42;
      ctx.fillStyle = "#7d6244";
      ctx.font = "700 " + titleSize + "px Outfit, sans-serif";
      ctx.fillText("PERCENTUAL DO PADEIRO", titleX, iconY + iconSize / 2 + titleSize * 0.32);
      ctx.fillStyle = "#2c241c";
      ctx.font = "700 48px Outfit, sans-serif";
      cardText(ctx, state.recipeName.trim() || "Minha Receita", pad, iconY + iconSize + 52, width - pad * 2, 54, 1);
      ctx.fillStyle = "#8d7f70";
      ctx.font = "500 22px Outfit, sans-serif";
      ctx.fillText(new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(new Date()), pad, iconY + iconSize + 86);

      [
        [heroY, "FARINHA", formatG(result.value.flour) + " g"],
        [heroY + stackH + stackGap, "PESO DA MASSA", formatG(result.value.totalWeight) + " g"],
      ].forEach(([y, label, value]) => {
        roundedRect(ctx, pad, y, leftW, stackH, 16, "#f7f2ea");
        ctx.textAlign = "center";
        ctx.fillStyle = "#8d7f70";
        ctx.font = "650 15px Outfit, sans-serif";
        ctx.fillText(label, pad + leftW / 2, y + 34);
        ctx.fillStyle = "#2c241c";
        ctx.font = "700 36px Outfit, sans-serif";
        ctx.fillText(value, pad + leftW / 2, y + stackH - 24);
      });
      ctx.textAlign = "left";

      ctx.letterSpacing = "0.08em";
      ctx.fillStyle = "#8d7f70";
      ctx.font = "650 14px Outfit, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("HIDRATAÇÃO TOTAL", centerX + centerW / 2, heroY + 22);
      ctx.letterSpacing = "0px";
      const hydText = formatPct(result.value.hydration);
      ctx.font = "700 52px Outfit, sans-serif";
      const hydW = ctx.measureText(hydText).width;
      ctx.font = "650 22px Outfit, sans-serif";
      const hydPctW = ctx.measureText("%").width;
      const hydTotal = hydW + 3 + hydPctW;
      const hydLeft = centerX + (centerW - hydTotal) / 2;
      ctx.textAlign = "left";
      ctx.fillStyle = "#2c241c";
      ctx.font = "700 52px Outfit, sans-serif";
      ctx.fillText(hydText, hydLeft, heroY + 82);
      ctx.fillStyle = "#8d7f70";
      ctx.font = "650 22px Outfit, sans-serif";
      ctx.fillText("%", hydLeft + hydW + 3, heroY + 80);

      const shares = [
        ["Farinha", result.value.flourShare, "#b8792e", "#9e6828"],
        ["Água", result.value.waterShare, "#2f80c0", "#2c78b4"],
        ["Outros", result.value.otherShare, "#6e9a35", "#5a7e2b"],
      ];
      shares.forEach(([label, share, bar, text], index) => {
        const y = heroY + 118 + index * 44;
        ctx.fillStyle = text;
        ctx.font = "650 16px Outfit, sans-serif";
        ctx.fillText(label, centerX, y);
        ctx.fillStyle = "#2c241c";
        ctx.font = "680 16px Outfit, sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(formatPct(share) + "%", centerX + centerW, y);
        ctx.textAlign = "left";
        const barW = share > 0.4 ? Math.max(8, centerW * share / 100) : 0;
        if (barW) roundedRect(ctx, centerX, y + 10, barW, 8, 4, bar);
      });

      roundedRect(ctx, photoX, heroY, photoW, photoH, 16, "#efe6da");
      try {
        const image = new Image();
        image.src = result.value.img;
        await image.decode();
        const scale = Math.max(photoW / image.naturalWidth, photoH / image.naturalHeight);
        const cropW = photoW / scale;
        const cropH = photoH / scale;
        ctx.save();
        cardRoundPath(ctx, photoX, heroY, photoW, photoH, 16);
        ctx.clip();
        ctx.drawImage(image, (image.naturalWidth - cropW) / 2, (image.naturalHeight - cropH) / 2, cropW, cropH, photoX, heroY, photoW, photoH);
        ctx.restore();
      } catch (error) {
        ctx.fillStyle = "#7d6244";
        ctx.font = "600 22px Outfit, sans-serif";
        ctx.fillText("Miolo do pão", photoX + 24, heroY + photoH / 2);
      }

      ctx.letterSpacing = "0.1em";
      ctx.fillStyle = "#8d7f70";
      ctx.font = "650 15px Outfit, sans-serif";
      ctx.fillText("TEXTURA", photoX, infoTop + 18);
      ctx.letterSpacing = "0px";
      const feelColor = { firme: "#7a6244", macia: "#2f7a45", pegajosa: "#8a5a20", umida: "#8a3e28" }[result.value.band.feel] || "#8d7f70";
      ctx.fillStyle = feelColor;
      ctx.font = "650 24px Outfit, sans-serif";
      cardText(ctx, result.value.band.sensacao, photoX, infoTop + 52, photoW, 28, 2);
      ctx.letterSpacing = "0.1em";
      ctx.fillStyle = "#8d7f70";
      ctx.font = "650 15px Outfit, sans-serif";
      ctx.fillText(result.value.enriched ? "PÃO ENRIQUECIDO" : "PÃO TÍPICO", photoX, infoTop + 118);
      ctx.letterSpacing = "0px";
      ctx.fillStyle = "#2c241c";
      ctx.font = "650 24px Outfit, sans-serif";
      cardText(ctx, result.value.bread, photoX, infoTop + 152, photoW, 28, 2);

      if (hasLevain) {
        const lv = result.value.levain;
        const profile = levainProfile.value;
        roundedRect(ctx, pad, levainBlockY, width - pad * 2, levainBlockHeight, 18, "#f7f2ea");
        ctx.fillStyle = "#7d6244";
        ctx.font = "700 22px Outfit, sans-serif";
        ctx.fillText("LEVAIN USADO", pad + 22, levainBlockY + 38);
        ctx.fillStyle = "#2c241c";
        ctx.font = "600 17px Outfit, sans-serif";
        ctx.fillText("Na massa: " + formatG(result.value.levainGrams) + " g (" + formatPctFine(levainItem.value?.pct || 0) + "%) · proporção L:A:F " + state.levain.L + ":" + state.levain.A + ":" + state.levain.F, pad + 22, levainBlockY + 76);
        ctx.font = "500 16px Outfit, sans-serif";
        const feedParts = lv?.valid
          ? formatG(lv.seed) + " g isca + " + formatG(lv.water) + " g água + " + formatG(lv.flour) + " g farinha · hidratação " + formatPct(lv.hydration) + "%"
          : "Alimentação ainda não configurada";
        cardText(ctx, "Alimentação: " + feedParts, pad + 22, levainBlockY + 109, width - pad * 2 - 44, 22, 2);
        const texture = profile ? profile.texture : "—";
        const peak = peakCaption(profile);
        ctx.fillText("Textura: " + texture + " · Pico: " + peak, pad + 22, levainBlockY + 151);
        const acidity = profile ? profile.flavor + " · nível " + (profile.score + 1) + "/5" : "—";
        ctx.fillText("Perfil de acidez: " + acidity, pad + 22, levainBlockY + 184);
      }

      ctx.fillStyle = "#2c241c";
      ctx.font = "700 30px Outfit, sans-serif";
      ctx.fillText("Ingredientes", pad, headingY);
      ctx.fillStyle = "#8d7f70";
      ctx.font = "650 17px Outfit, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText("PERCENTUAL", 790, headingY);
      ctx.fillText("GRAMAS", width - pad, headingY);
      ctx.textAlign = "left";

      let rowY = headingY + 28;
      layouts.forEach((item) => {
        const row = item.row;
        const y = rowY;
        ctx.strokeStyle = "#efe6da";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pad, y);
        ctx.lineTo(width - pad, y);
        ctx.stroke();
        ctx.fillStyle = "#2c241c";
        ctx.font = "600 23px Outfit, sans-serif";
        cardText(ctx, row.name || "Ingrediente", pad, y + item.nameY, 480, 27, 2);
        ctx.fillStyle = "#7d6244";
        ctx.font = "600 22px Outfit, sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(formatPctFine(row.pct) + "%", 790, y + item.nameY);
        ctx.fillStyle = "#2c241c";
        ctx.font = "700 24px Outfit, sans-serif";
        ctx.fillText(formatG(row.shown) + " g", width - pad, y + item.nameY);
        ctx.textAlign = "left";
        if (item.note) {
          ctx.fillStyle = "#8d7f70";
          ctx.font = "500 15px Outfit, sans-serif";
          cardText(ctx, item.note, pad, y + item.noteY, width - pad * 2, 18, 2);
        }
        rowY += item.height;
      });

      const footerY = rowY + 28;
      roundedRect(ctx, pad, footerY, width - pad * 2, 82, 16, "#f7f2ea");
      ctx.fillStyle = "#7d6244";
      ctx.font = "650 18px Outfit, sans-serif";
      ctx.fillText("COMPOSIÇÃO DA MASSA", pad + 20, footerY + 30);
      ctx.fillStyle = "#2c241c";
      ctx.font = "600 19px Outfit, sans-serif";
      ctx.fillText("Farinha " + formatPct(result.value.flourShare) + "%   ·   Água " + formatPct(result.value.waterShare) + "%   ·   Outros " + formatPct(result.value.otherShare) + "%", pad + 20, footerY + 61);
      ctx.fillStyle = "#8d7f70";
      ctx.font = "500 16px Outfit, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Feito com Percentual do padeiro", width / 2, height - 62);
      ctx.textAlign = "left";
      ctx.letterSpacing = "0px";

      return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Não foi possível gerar a imagem")), "image/png"));
    }

    function downloadRecipeCard(blob, fileName) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    function whenControlled() {
      if (!("serviceWorker" in navigator)) return Promise.resolve(false);
      if (navigator.serviceWorker.controller) return Promise.resolve(true);
      return new Promise((resolve) => {
        const done = () => resolve(!!navigator.serviceWorker.controller);
        navigator.serviceWorker.addEventListener("controllerchange", done, { once: true });
        setTimeout(() => resolve(!!navigator.serviceWorker.controller), 4000);
      });
    }

    function storeCard(blob, type) {
      const worker = navigator.serviceWorker && navigator.serviceWorker.controller;
      if (!worker) return Promise.resolve(false);
      return new Promise((resolve) => {
        const channel = new MessageChannel();
        channel.port1.onmessage = (event) => resolve(!!event.data?.ok);
        worker.postMessage({ type, blob }, [channel.port2]);
      });
    }

    async function refreshCardPreview() {
      const generation = ++cardGeneration;
      try {
        const blobs = {
          card: await makeRecipeCard(),
          card2: await makeRecipeCard2(),
          card3: await makeRecipeCard3(),
          card4: await makeRecipeCard4(),
        };
        if (generation !== cardGeneration) return;
        const controlled = await whenControlled();
        if (generation !== cardGeneration) return;
        const stored = {};
        for (const name of Object.keys(blobs)) stored[name] = controlled && (await storeCard(blobs[name], name));
        if (generation !== cardGeneration) return;
        if (!cardPreview) return;
        const shown = blobs[previewName];
        const ok = stored[previewName];
        const file = previewName + ".png?t=";
        if (ok) {
          if (cardPreviewObjectUrl) {
            URL.revokeObjectURL(cardPreviewObjectUrl);
            cardPreviewObjectUrl = "";
          }
          cardPreviewUrl.value = file + Date.now();
          return;
        }
        const url = URL.createObjectURL(shown);
        if (cardPreviewObjectUrl) URL.revokeObjectURL(cardPreviewObjectUrl);
        cardPreviewObjectUrl = url;
        cardPreviewUrl.value = url;
      } catch (error) {
        if (cardPreview) cardPreviewUrl.value = "";
      }
    }

    async function shareRecipeCard() {
      if (sharingCard.value) return;
      sharingCard.value = true;
      shareStatus.value = "Preparando imagem…";
      try {
        // O botão usa o card 4. Os outros makeRecipeCard* continuam nas prévias.
        const blob = await makeRecipeCard4();
        const fileName = recipeFileName(state.recipeName);
        const file = typeof File !== "undefined" ? new File([blob], fileName, { type: "image/png" }) : null;
        if (file && navigator.share && navigator.canShare?.({ files: [file] })) {
          try {
            await navigator.share({ files: [file], title: "Minha receita de pão", text: "Receita feita no Percentual do padeiro" });
            shareStatus.value = "Receita compartilhada.";
          } catch (error) {
            if (error?.name === "AbortError") {
              shareStatus.value = "Compartilhamento cancelado.";
              return;
            }
            downloadRecipeCard(blob, fileName);
            shareStatus.value = "Imagem baixada. Você já pode compartilhar a receita.";
          }
        } else {
          downloadRecipeCard(blob, fileName);
          shareStatus.value = "Imagem baixada. Você já pode compartilhar a receita.";
        }
      } catch (error) {
        shareStatus.value = "Não foi possível preparar a imagem.";
      } finally {
        sharingCard.value = false;
      }
    }

    function onRatio(id) {
      const preset = Padeiro.RATIOS.find((item) => item.id === id);
      if (!preset) return;
      if (levainSim.value) {
        sim.L = preset.L;
        sim.A = preset.A;
        sim.F = preset.F;
        fillSimGrams();
        return;
      }
      state.levain.L = preset.L;
      state.levain.A = preset.A;
      state.levain.F = preset.F;
    }

    function setSimPart(key, value) {
      sim[key] = value === "" ? "" : String(value).replace(",", ".");
      if (value !== "") fillSimGrams();
    }

    function settleSimPart(key) {
      sim[key] = Math.max(0, Padeiro.num(sim[key]));
      fillSimGrams();
    }

    function setSimTotal(value) {
      sim.total = value === "" ? "" : String(value).replace(",", ".");
      if (value !== "") fillSimGrams();
    }

    function settleSimTotal() {
      sim.total = Math.max(0, Padeiro.num(sim.total));
      fillSimGrams();
    }

    // Os pesos mandam: o total é a soma e a proporção vira personalizada.
    function setSimGram(key, value) {
      sim[key] = value === "" ? "" : String(value).replace(",", ".");
      const seed = Padeiro.num(sim.seed);
      const water = Padeiro.num(sim.water);
      const flour = Padeiro.num(sim.flour);
      sim.total = simGrams(seed + water + flour);
      const ratio = Padeiro.ratioFromGrams(seed, water, flour);
      sim.L = ratio.L;
      sim.A = ratio.A;
      sim.F = ratio.F;
    }

    // Sair sem mudar o número não reinterpreta o grama já arredondado.
    // 2,36 vindo de 1:5:5 continuaria 1:5,01 se a conta rodasse de novo.
    function settleSimGram(key) {
      const text = String(sim[key] ?? "").trim().replace(",", ".");
      const raw = Math.max(0, Padeiro.num(text));
      const rounded = simGrams(raw);
      const untouched = text !== "" && Math.abs(raw - rounded) < 1e-9;
      sim[key] = rounded;
      if (untouched) return;
      setSimGram(key, rounded);
    }

    const simProfile = computed(() => {
      const l = Padeiro.num(sim.L);
      const a = Padeiro.num(sim.A);
      const f = Padeiro.num(sim.F);
      if (l + a + f <= 0 || f <= 0) return null;
      return Padeiro.levainProfile(l, a, f);
    });

    const simRatioId = computed(() => Padeiro.matchRatio(sim.L, sim.A, sim.F));
    const shownProfile = computed(() => (levainSim.value ? simProfile.value : levainProfile.value));
    const activeCalibration = computed(() => calStore.items.find((item) => item.id === calStore.activeId) || null);

    function peakCaption(profile) {
      if (!profile) return "—";
      const view = Padeiro.peakEstimate(profile, activeCalibration.value, sessionTemp.lo, sessionTemp.hi);
      if (!view || (view.general && sessionTemp.lo === 24 && sessionTemp.hi === 26)) return profile.time + " a 24–26 °C";
      return view.time + " · " + view.label + " · " + formatTempRange(sessionTemp.lo, sessionTemp.hi);
    }

    const peakView = computed(() => {
      const profile = shownProfile.value;
      if (!profile) return null;
      const view = Padeiro.peakEstimate(profile, activeCalibration.value, sessionTemp.lo, sessionTemp.hi);
      if (!view) return null;
      return { ...view, caption: view.label + " · " + formatTempRange(sessionTemp.lo, sessionTemp.hi) };
    });

    const tempLabel = computed(() => formatTempNumber(sessionTemp.lo) + "–" + formatTempNumber(sessionTemp.hi));

    const tempOrigin = computed(() => (activeCalibration.value ? activeCalibration.value.name : "Faixa geral"));

    const tempNote = computed(() => {
      if (!calStore.items.length) {
        return "A estimativa usa os dados gerais do app, escritos para 24–26 °C. Informar outra faixa só desloca essa tabela: não aprende a farinha, a água nem a isca. Para maior precisão, registre no Sobre o teste dos dois potes, 1:1:1 e 1:5:5, começados juntos, da mesma isca, farinha, água e lugar.";
      }
      if (!activeCalibration.value) {
        return "Faixa geral. A hora é a tabela do app deslocada por esta temperatura. O teste dos dois potes dá maior precisão.";
      }
      return "A hora usa «" + activeCalibration.value.name + "». O teto encurta o tempo e o piso alonga. Trocar de calibração fica no Sobre.";
    });

    function sessionMatch(band) {
      return sessionTemp.lo === band.lo && sessionTemp.hi === band.hi;
    }

    function setSessionBand(lo, hi) {
      sessionTemp.lo = lo;
      sessionTemp.hi = hi;
      tempFields.lo = String(lo);
      tempFields.hi = String(hi);
    }

    function applyTempFields() {
      if (!isTempText(tempFields.lo) || !isTempText(tempFields.hi)) return;
      const lo = Padeiro.num(tempFields.lo);
      const hi = Padeiro.num(tempFields.hi);
      if (lo < -10 || hi < -10 || lo > 60 || hi > 60) return;
      sessionTemp.lo = Math.min(lo, hi);
      sessionTemp.hi = Math.max(lo, hi);
    }

    function settleTempFields() {
      applyTempFields();
      tempFields.lo = formatTempField(sessionTemp.lo);
      tempFields.hi = formatTempField(sessionTemp.hi);
    }

    function openTemp() {
      tempFields.lo = formatTempField(sessionTemp.lo);
      tempFields.hi = formatTempField(sessionTemp.hi);
      const dialog = tempDialog.value;
      if (dialog && !dialog.open) dialog.showModal();
    }

    function closeTemp() {
      settleTempFields();
      const dialog = tempDialog.value;
      if (dialog && dialog.open) dialog.close();
    }

    function onTempClick(event) {
      if (event.target === tempDialog.value) closeTemp();
    }

    function persistCalibrations() {
      try {
        localStorage.setItem(CAL_KEY, JSON.stringify({ activeId: calStore.activeId, items: calStore.items }));
      } catch (error) {}
    }

    function resetCalForm() {
      Object.assign(calForm, emptyCalForm());
    }

    function openCalibration() {
      resetCalForm();
      const dialog = calDialog.value;
      if (dialog && !dialog.open) dialog.showModal();
    }

    function closeCalibration() {
      const dialog = calDialog.value;
      if (dialog && dialog.open) dialog.close();
    }

    function onCalClick(event) {
      if (event.target === calDialog.value) closeCalibration();
    }

    function openCalGuide() {
      calGuideOverForm.value = !!(calDialog.value && calDialog.value.open);
      const dialog = calGuideDialog.value;
      if (!dialog || dialog.open) return;
      const article = dialog.querySelector("article");
      if (article) article.scrollTop = 0;
      dialog.showModal();
      if (article) article.scrollTop = 0;
    }

    function closeCalGuide() {
      const dialog = calGuideDialog.value;
      if (dialog && dialog.open) dialog.close();
    }

    function onCalGuideClick(event) {
      if (event.target === calGuideDialog.value) closeCalGuide();
    }

    function registerFromGuide() {
      closeCalGuide();
      if (!calDialog.value || !calDialog.value.open) openCalibration();
    }

    function setCalTemp(lo, hi) {
      calForm.tempLo = String(lo);
      calForm.tempHi = String(hi);
    }

    function calShortcutOn(band) {
      return String(calForm.tempLo) === String(band.lo) && String(calForm.tempHi) === String(band.hi);
    }

    const calDraft = computed(() => {
      const name = String(calForm.name || "").trim().slice(0, 40);
      const ok111 = Padeiro.acceptJar("111", calForm.seed111, calForm.water111, calForm.flour111);
      const ok155 = Padeiro.acceptJar("155", calForm.seed155, calForm.water155, calForm.flour155);
      const t1 = hoursBetween(calForm.mixAt, calForm.peak111);
      const t5 = hoursBetween(calForm.mixAt, calForm.peak155);
      const tempEmpty = String(calForm.tempLo).trim() === "" && String(calForm.tempHi).trim() === "";
      let tempLo = 24;
      let tempHi = 26;
      let tempError = "";
      if (!tempEmpty) {
        const loText = String(calForm.tempLo).trim();
        const hiText = String(calForm.tempHi).trim();
        if (!isTempText(loText) || !isTempText(hiText)) tempError = "Informe o piso e o teto, ou deixe os dois vazios.";
        else {
          const lo = Padeiro.num(loText);
          const hi = Padeiro.num(hiText);
          if (lo < -10 || hi < -10 || lo > 60 || hi > 60) tempError = "Use uma temperatura entre -10 e 60 °C.";
          else {
            tempLo = Math.min(lo, hi);
            tempHi = Math.max(lo, hi);
          }
        }
      }
      const errors = [];
      if (!name) errors.push("Dê um nome, em geral o da farinha.");
      if (!ok111) errors.push("O pote 1:1:1 está fora da proporção aceita.");
      if (!ok155) errors.push("O pote 1:5:5 está fora da proporção aceita.");
      if (!calForm.mixAt || !calForm.peak111 || !calForm.peak155) errors.push("Faltam a hora da mistura e os dois picos.");
      else if (!(t1 > 0) || !(t5 > 0)) errors.push("Os dois picos precisam ser depois da mistura.");
      else if (!(t5 > t1)) errors.push("O 1:5:5 precisa ter levado mais tempo que o 1:1:1.");
      if (tempError) errors.push(tempError);
      const hoursText = t1 > 0 && t5 > 0 ? "1:1:1 levou " + formatHoursLoose(t1) + " · 1:5:5 levou " + formatHoursLoose(t5) + "." : "";
      return { name, ok111, ok155, t1, t5, tempLo, tempHi, tempEmpty, errors, hoursText, valid: errors.length === 0 };
    });

    function saveCalibration() {
      const draft = calDraft.value;
      if (!draft.valid) return;
      const item = {
        id: "c-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        name: draft.name,
        savedAt: new Date().toISOString(),
        t1Hours: draft.t1,
        t5Hours: draft.t5,
        tempLo: draft.tempLo,
        tempHi: draft.tempHi,
        mixAt: calForm.mixAt,
        peak111At: calForm.peak111,
        peak155At: calForm.peak155,
        seed111: Padeiro.num(calForm.seed111),
        water111: Padeiro.num(calForm.water111),
        flour111: Padeiro.num(calForm.flour111),
        seed155: Padeiro.num(calForm.seed155),
        water155: Padeiro.num(calForm.water155),
        flour155: Padeiro.num(calForm.flour155),
      };
      calStore.items.unshift(item);
      calStore.activeId = item.id;
      closeCalibration();
    }

    async function deleteCalibration(item) {
      const ok = await askConfirm({
        title: "Apagar esta calibração?",
        message: "«" + item.name + "» sai da lista. Se ela estava em uso, a hora volta à faixa geral na temperatura já informada.",
        confirmLabel: "Apagar",
        danger: true,
      });
      if (!ok) return;
      const index = calStore.items.findIndex((entry) => entry.id === item.id);
      if (index >= 0) calStore.items.splice(index, 1);
      if (calStore.activeId === item.id) calStore.activeId = "";
    }

    function setPart(key, value) {
      state.levain[key] = value === "" ? "" : Math.max(0, Padeiro.num(value));
    }

    function settlePart(key) {
      state.levain[key] = Math.max(0, Padeiro.num(state.levain[key]));
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

    function addFerment(kind) {
      const row = {
        id: "fermento2",
        role: "ferment2",
        ferment: kind,
        name: kind === "levain" ? "Levain" : yeastName(kind),
        // reforço típico: um pouco de fermento junto do levain, ou 20% de levain junto do fermento
        pct: kind === "levain" ? 20 : kind === "fresco" ? 0.9 : 0.3,
        water: 0,
      };
      const main = state.ingredients.findIndex((item) => item.role === "ferment");
      state.ingredients.splice(main + 1, 0, row);
      menuOpen.value = false;
      if (kind === "levain") nextTick(openLevain);
    }

    // Segundo fermento biológico: troca seco ↔ fresco convertendo o percentual.
    function setSecondYeast(kind) {
      const row = secondFerment.value;
      if (!row || row.ferment === kind || row.ferment === "levain") return;
      row.pct = Padeiro.convertYeast(row.pct, row.ferment, kind);
      row.ferment = kind;
      row.name = yeastName(kind);
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
      const index = state.ingredients.findIndex((item) => item.id === id && (item.role === "extra" || item.role === "ferment2"));
      if (index >= 0) state.ingredients.splice(index, 1);
    }

    function barWidth(pct) {
      return Math.max(0, Math.min(100, Padeiro.num(pct))) + "%";
    }

    function rowOf(id) {
      return result.value.rows.find((row) => row.id === id) || { grams: 0, water: 0, shown: 0 };
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
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (error) {}
      },
      { deep: true }
    );

    watch(state, () => {
      clearTimeout(cardPreviewTimer);
      cardPreviewTimer = setTimeout(refreshCardPreview, 180);
    }, { deep: true });

    watch(
      () => [sessionTemp.lo, sessionTemp.hi, calStore.activeId, calStore.items.length],
      () => {
        clearTimeout(cardPreviewTimer);
        cardPreviewTimer = setTimeout(refreshCardPreview, 180);
      }
    );

    watch(
      () => calStore.activeId,
      (id) => {
        const item = calStore.items.find((entry) => entry.id === id);
        if (!item) return;
        sessionTemp.lo = item.tempLo;
        sessionTemp.hi = item.tempHi;
        tempFields.lo = formatTempField(item.tempLo);
        tempFields.hi = formatTempField(item.tempHi);
      }
    );

    watch(calStore, persistCalibrations, { deep: true });

    onMounted(() => {
      settleSlider();
      refreshCardPreview();
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
      waterMarks,
      sliderMin,
      sliderMax,
      onWaterSlide,
      waterDiffers,
      ratioId,
      levainProfile,
      levainItem,
      compParts,
      ratioGroups: Padeiro.RATIO_GROUPS,
      menuGroups,
      menuOpen,
      levainDialog,
      recipesDialog,
      aboutDialog,
      tempDialog,
      calDialog,
      calGuideDialog,
      calGuideOverForm,
      breadDialog,
      breadShown,
      breadRows,
      breadDetail,
      openBread,
      closeBread,
      onBreadClick,
      about,
      openAbout,
      closeAbout,
      onAboutClick,
      checkUpdate,
      reloadApp,
      recipes,
      recipeName,
      recipeNameEditing,
      editRecipeName,
      finishRecipeNameEdit,
      confirmDialog,
      duplicateDialog,
      duplicateName,
      confirmState,
      answerConfirm,
      onConfirmClick,
      answerDuplicate,
      onDuplicateClick,
      quickSave,
      savedFlash,
      sharingCard,
      shareStatus,
      shareRecipeCard,
      cardPreview,
      card2Preview,
      card3Preview,
      card4Preview,
      previewName,
      cardPreviewUrl,
      openRecipes,
      closeRecipes,
      onRecipesClick,
      saveRecipe,
      openRecipe,
      clearRecipe,
      deleteRecipe,
      formatDate,
      summaryOf,
      openLevain,
      openLevainSim,
      levainSim,
      sim,
      simProfile,
      simRatioId,
      shownProfile,
      peakView,
      tempLabel,
      tempOrigin,
      tempNote,
      tempFields,
      tempShortcuts: TEMP_BANDS,
      sessionMatch,
      setSessionBand,
      applyTempFields,
      settleTempFields,
      openTemp,
      closeTemp,
      onTempClick,
      calStore,
      activeCalibration,
      calForm,
      calDraft,
      openCalibration,
      closeCalibration,
      onCalClick,
      openCalGuide,
      closeCalGuide,
      onCalGuideClick,
      registerFromGuide,
      setCalTemp,
      calShortcutOn,
      saveCalibration,
      deleteCalibration,
      setSimPart,
      settleSimPart,
      setSimTotal,
      settleSimTotal,
      setSimGram,
      settleSimGram,
      closeLevain,
      onDialogClick,
      canInstall,
      formatG,
      formatPct,
      formatPctFine,
      editing,
      isEditing,
      startEdit,
      onEdit,
      endEdit,
      cancelEdit,
      flourDigits,
      clampFlour,
      settleFlour,
      settleWater,
      settlePart,
      bumpFlour,
      setFerment,
      yeastEquivalent,
      onRatio,
      setPart,
      addIngredient,
      addCustom,
      addFerment,
      isFerment: Padeiro.isFerment,
      setSecondYeast,
      secondFerment,
      fermentChoices,
      removeIngredient,
      barWidth,
      rowOf,
      iconFor,
      install,
    };
  },
})
  .directive("focus", {
    mounted(el) {
      el.focus();
      try {
        el.select();
      } catch (error) {}
    },
  })
  .mount("#app");
