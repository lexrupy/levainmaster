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
    const about = reactive({ version: "", offline: false, persisted: false, checking: false, status: "", reload: false });
    const recipes = ref(loadRecipes());
    const recipeName = ref("");
    // Modal de confirmação genérico: askConfirm({ title, message, confirmLabel, cancelLabel, danger })
    // devolve uma Promise com true (confirmou) ou false (cancelou, Esc ou clique no fundo).
    const confirmDialog = ref(null);
    const confirmState = reactive({ title: "", message: "", confirmLabel: "Confirmar", cancelLabel: "Cancelar", danger: false });
    let confirmResolve = null;
    const quickSave = ref(false);
    const savedFlash = ref(false);
    let flashTimer = null;
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

    // quick: aberto pelo botão Salvar do card, só com o campo de descrição.
    function openRecipes(quick = false) {
      quickSave.value = quick === true;
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

    function saveRecipe() {
      const name = recipeName.value.trim();
      if (!name) return;
      recipes.value.unshift({
        id: "r-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        name,
        savedAt: new Date().toISOString(),
        state: JSON.parse(JSON.stringify(state)),
      });
      persistRecipes();
      recipeName.value = "";
      if (quickSave.value) {
        closeRecipes();
        savedFlash.value = true;
        clearTimeout(flashTimer);
        flashTimer = setTimeout(() => (savedFlash.value = false), 2000);
      }
    }

    function openRecipe(recipe) {
      const saved = normalizeState(JSON.parse(JSON.stringify(recipe.state)));
      if (!saved) return;
      endEdit();
      state.flour = saved.flour;
      state.ingredients = saved.ingredients;
      state.levain = saved.levain;
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
      about,
      openAbout,
      closeAbout,
      onAboutClick,
      checkUpdate,
      reloadApp,
      recipes,
      recipeName,
      confirmDialog,
      confirmState,
      answerConfirm,
      onConfirmClick,
      quickSave,
      savedFlash,
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
