// Percentual do padeiro — © 2026 Alexandre da Silva
// SPDX-License-Identifier: LGPL-3.0-or-later
const { createApp, reactive, computed, watch, ref, onMounted, nextTick } = Vue;

const STORAGE_KEY = "percentual-padeiro-v1";
const RECIPES_KEY = "percentual-padeiro-receitas-v1";

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

createApp({
  setup() {
    const state = reactive(loadState());
    const menuOpen = ref(false);
    const levainDialog = ref(null);
    const recipesDialog = ref(null);
    const aboutDialog = ref(null);
    const breadDialog = ref(null);
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
    const card3Preview = new URLSearchParams(location.search).has("card3");
    const card2Preview = new URLSearchParams(location.search).has("card2");
    const cardPreview = new URLSearchParams(location.search).has("card") || card2Preview || card3Preview;
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
        ? String(Math.round(rowOf(item.id).grams))
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
    function openLevain() {
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
      const res = Padeiro.compute(saved);
      const lv = saved.levain || {};
      const text = (saved.ingredients || [])
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
        const peak = profile ? profile.time + " a 24–26 °C" : "—";
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
        ctx.fillText(formatG(row.grams) + " g", width - pad, y + item.nameY);
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
        const peak = profile ? profile.time + " a 24–26 °C" : "—";
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
        ctx.fillText(formatG(row.grams) + " g", width - pad, y + item.nameY);
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
        const peak = profile ? profile.time + " a 24–26 °C" : "—";
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
        ctx.fillText(formatG(row.grams) + " g", width - pad, y + item.nameY);
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

    function downloadRecipeCard(blob) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "receita-percentual-do-padeiro.png";
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
        const blob = await makeRecipeCard();
        const blob2 = await makeRecipeCard2();
        const blob3 = await makeRecipeCard3();
        if (generation !== cardGeneration) return;
        const controlled = await whenControlled();
        if (generation !== cardGeneration) return;
        const stored = controlled && (await storeCard(blob, "card"));
        const stored2 = controlled && (await storeCard(blob2, "card2"));
        const stored3 = controlled && (await storeCard(blob3, "card3"));
        if (generation !== cardGeneration) return;
        if (!cardPreview) return;
        const shown = card3Preview ? blob3 : card2Preview ? blob2 : blob;
        const ok = card3Preview ? stored3 : card2Preview ? stored2 : stored;
        const file = card3Preview ? "card3.png?t=" : card2Preview ? "card2.png?t=" : "card.png?t=";
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
        const blob = await makeRecipeCard();
        const file = typeof File !== "undefined" ? new File([blob], "receita-percentual-do-padeiro.png", { type: "image/png" }) : null;
        if (file && navigator.share && navigator.canShare?.({ files: [file] })) {
          try {
            await navigator.share({ files: [file], title: "Minha receita de pão", text: "Receita feita no Percentual do padeiro" });
            shareStatus.value = "Receita compartilhada.";
          } catch (error) {
            if (error?.name === "AbortError") {
              shareStatus.value = "Compartilhamento cancelado.";
              return;
            }
            downloadRecipeCard(blob);
            shareStatus.value = "Imagem baixada. Você já pode compartilhar a receita.";
          }
        } else {
          downloadRecipeCard(blob);
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
      state.levain.L = preset.L;
      state.levain.A = preset.A;
      state.levain.F = preset.F;
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

    onMounted(() => {
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
      cardPreviewUrl,
      openRecipes,
      closeRecipes,
      onRecipesClick,
      saveRecipe,
      openRecipe,
      deleteRecipe,
      formatDate,
      summaryOf,
      openLevain,
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
