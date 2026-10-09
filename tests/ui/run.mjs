// Levain Master — © 2026 Alexandre da Silva
// SPDX-License-Identifier: LGPL-3.0-or-later
// Cenários de tela. Sobe o Chrome instalado e fala com a página em 127.0.0.1:8769.
import { setTimeout as sleep } from "node:timers/promises";
import { connectChrome, launchChrome, stopChrome } from "./chrome.mjs";

const PORT = 9343;
const BASE = "http://127.0.0.1:8769/";
const fails = [];

function nearPct(row, expected) {
  const shown = String(row.shown || "").replace(/\s+/g, "");
  return Math.abs(Number(row.hyd) - expected) < 0.05 && shown === expected + "%";
}

function check(name, cond, extra = "") {
  if (!cond) {
    fails.push(name + (extra ? " :: " + extra : ""));
    console.log("FAIL", name, extra);
  } else {
    console.log("ok", name);
  }
}

async function pageOf(version) {
  const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
  const page = list.find((tab) => tab.type === "page");
  if (!page) throw new Error("sem aba");
  const client = connectChrome(page.webSocketDebuggerUrl);
  await client.ready;
  await client.send("Page.enable");
  await client.send("Runtime.enable");
  return client;
}

async function fresh(client, width) {
  await client.open(BASE, width, 844);
  await client.evaluate(`localStorage.clear()`);
  const loaded = client.waitLoad();
  await client.send("Page.reload", { ignoreCache: true });
  await loaded;
  await client.send("Emulation.setDeviceMetricsOverride", {
    width,
    height: 844,
    deviceScaleFactor: 1,
    mobile: width < 500,
  });
  await client.evaluate(`new Promise((resolve) => {
    const timer = setInterval(() => {
      if (document.querySelector("#flour") && document.querySelector("[data-total]")) {
        clearInterval(timer);
        resolve(true);
      }
    }, 40);
  })`);
}

function setField(selector, value) {
  return `(() => {
    const input = document.querySelector(${JSON.stringify(selector)});
    input.value = ${JSON.stringify(String(value))};
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  })()`;
}

async function scenarioTelas(client, width) {
  await fresh(client, width);
  const initial = await client.evaluate(`({
    total: document.querySelector("[data-total]").getAttribute("data-total"),
    hyd: document.querySelector("[data-final-hyd]").getAttribute("data-final-hyd"),
    feel: document.querySelector("[data-feel]").getAttribute("data-feel"),
    bread: document.querySelector(".bread-link").textContent.trim(),
    stickyTop: getComputedStyle(document.querySelector("header.top")).position,
    stickyCard: getComputedStyle(document.querySelector(".deck-row").parentElement).position,
    scroll: document.documentElement.scrollWidth - document.documentElement.clientWidth
  })`);
  check(`tela ${width} inicial`, initial.total === "840" && initial.hyd === "65" && initial.feel === "macia" && initial.bread === "Baguete", JSON.stringify(initial));
  check(`tela ${width} card não é sticky`, initial.stickyCard !== "sticky" && initial.stickyTop === "sticky", JSON.stringify(initial));
  check(`tela ${width} sem rolagem`, initial.scroll === 0, String(initial.scroll));

  await client.evaluate(setField("#flour", 600));
  await sleep(40);
  const flour = await client.evaluate(`({
    flour: document.querySelector("#flour").value,
    water: document.querySelector('[data-grams="water"] .grams-value').textContent.trim(),
    total: document.querySelector("[data-total]").getAttribute("data-total")
  })`);
  check(`tela ${width} farinha recalcula`, flour.flour === "600" && flour.water === "390" && flour.total === "1008", JSON.stringify(flour));
  await client.evaluate(`document.querySelector('[aria-label="Aumentar farinha"]').click()`);
  await sleep(40);
  const up = await client.evaluate(`document.querySelector("#flour").value`);
  check(`tela ${width} sobe 50 g`, up === "650", up);
  await client.evaluate(`document.querySelector('[aria-label="Diminuir farinha"]').click()`);
  await sleep(40);
  const down = await client.evaluate(`document.querySelector("#flour").value`);
  check(`tela ${width} desce 50 g`, down === "600", down);
  await client.evaluate(setField("#flour", 100000));
  await sleep(40);
  const cap = await client.evaluate(`document.querySelector("#flour").value`);
  check(`tela ${width} trava em 99999`, cap === "99999", cap);

  await fresh(client, width);
  await client.evaluate(setField("#agua", 55));
  await sleep(40);
  const low = await client.evaluate(`({
    hyd: document.querySelector("[data-final-hyd]").getAttribute("data-final-hyd"),
    shown: document.querySelector(".side-hyd").textContent,
    feel: document.querySelector("[data-feel]").getAttribute("data-feel"),
    img: document.querySelector(".crumb-thumb").getAttribute("src")
  })`);
  check(`tela ${width} slider 55`, nearPct(low, 55) && low.feel === "firme" && low.img.includes("miolo-1"), JSON.stringify(low));
  await client.evaluate(setField("#agua", 85));
  await sleep(40);
  const high = await client.evaluate(`({
    hyd: document.querySelector("[data-final-hyd]").getAttribute("data-final-hyd"),
    shown: document.querySelector(".side-hyd").textContent,
    feel: document.querySelector("[data-feel]").getAttribute("data-feel"),
    img: document.querySelector(".crumb-thumb").getAttribute("src")
  })`);
  check(`tela ${width} slider 85`, nearPct(high, 85) && high.feel === "pegajosa" && high.img.includes("miolo-5"), JSON.stringify(high));

  await fresh(client, width);
  await client.evaluate(`(() => {
    const select = document.querySelector(".ferment-select");
    select.value = "fresco";
    select.dispatchEvent(new Event("change", { bubbles: true }));
  })()`);
  await sleep(40);
  const fresco = await client.evaluate(`document.querySelector('[data-grams="ferment"]').closest(".ing-block").querySelector(".pct-value").textContent.trim()`);
  check(`tela ${width} fresco triplica`, fresco === "3", fresco);
  await client.evaluate(`(() => {
    const select = document.querySelector(".ferment-select");
    select.value = "seco";
    select.dispatchEvent(new Event("change", { bubbles: true }));
  })()`);
  await sleep(40);
  const seco = await client.evaluate(`document.querySelector('[data-grams="ferment"]').closest(".ing-block").querySelector(".pct-value").textContent.trim()`);
  check(`tela ${width} seco divide`, seco === "1", seco);
  await client.evaluate(`(() => {
    const select = document.querySelector(".ferment-select");
    select.value = "levain";
    select.dispatchEvent(new Event("change", { bubbles: true }));
  })()`);
  await sleep(80);
  await client.evaluate(`document.querySelector("#levain-title").closest("article").querySelector(".levain-done").click()`);
  await sleep(40);
  const levainPct = await client.evaluate(`document.querySelector('[data-grams="ferment"]').closest(".ing-block").querySelector(".pct-value").textContent.trim()`);
  check(`tela ${width} levain abre em 20`, levainPct === "20", levainPct);
  await client.evaluate(`(() => {
    const select = document.querySelector(".ferment-select");
    select.value = "seco";
    select.dispatchEvent(new Event("change", { bubbles: true }));
  })()`);
  await sleep(40);
  const restored = await client.evaluate(`document.querySelector('[data-grams="ferment"]').closest(".ing-block").querySelector(".pct-value").textContent.trim()`);
  check(`tela ${width} seco restaura`, restored === "1", restored);

  await fresh(client, width);
  await client.evaluate(`(() => {
    const select = document.querySelector(".ferment-select");
    select.value = "levain";
    select.dispatchEvent(new Event("change", { bubbles: true }));
  })()`);
  await sleep(80);
  await client.evaluate(`(() => {
    const select = document.querySelector("#ratio");
    select.value = "1:5:5";
    select.dispatchEvent(new Event("change", { bubbles: true }));
  })()`);
  await sleep(40);
  const preset = await client.evaluate(`({
    ratio: document.querySelector("#ratio").value,
    L: document.querySelector("#part-l").value,
    A: document.querySelector("#part-a").value,
    F: document.querySelector("#part-f").value
  })`);
  check(`tela ${width} preset preenche`, preset.ratio === "1:5:5" && preset.L === "1" && preset.A === "5" && preset.F === "5", JSON.stringify(preset));
  await client.evaluate(`(() => {
    const values = { "#part-l": "1", "#part-a": "2", "#part-f": "2" };
    for (const [sel, value] of Object.entries(values)) {
      const input = document.querySelector(sel);
      input.value = value;
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
  })()`);
  await sleep(40);
  const typed = await client.evaluate(`document.querySelector("#ratio").value`);
  check(`tela ${width} digitar 1:2:2 seleciona`, typed === "1:2:2", typed);
  await client.evaluate(setField("#part-f", 9));
  await sleep(40);
  const custom = await client.evaluate(`document.querySelector("#ratio").value`);
  check(`tela ${width} personalizado`, custom === "custom", custom);

  await fresh(client, width);
  await client.evaluate(`document.querySelector(".add-btn").click()`);
  await sleep(40);
  await client.evaluate(`[...document.querySelectorAll(".menu button")].find((button) => button.textContent.trim().startsWith("Ovos")).click()`);
  await sleep(40);
  await client.evaluate(`document.querySelector('[aria-label="Editar percentual de Ovos"]').click()`);
  await sleep(40);
  await client.evaluate(`(() => {
    const input = document.querySelector('[aria-label="Percentual de Ovos"]');
    input.value = "10";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("blur", { bubbles: true }));
  })()`);
  await sleep(40);
  const withEggs = await client.evaluate(`document.querySelector("[data-final-hyd]").getAttribute("data-final-hyd")`);
  check(`tela ${width} ovos somam água`, withEggs === "72.5", withEggs);
  await client.evaluate(`document.querySelector('[aria-label="Remover Ovos"]').click()`);
  await sleep(40);
  const withoutEggs = await client.evaluate(`document.querySelector("[data-final-hyd]").getAttribute("data-final-hyd")`);
  check(`tela ${width} remover ovos tira a água`, withoutEggs === "65", withoutEggs);

  // Troca líquido principal para Leite integral
  await client.evaluate(`(() => {
    const sel = document.querySelector('select[aria-label="Líquido principal"]');
    if (sel) {
      sel.value = "Leite integral";
      sel.dispatchEvent(new Event("change", { bubbles: true }));
    }
  })()`);
  await sleep(40);
  const liquidLabel = await client.evaluate(`document.querySelector(".hyd-head label")?.textContent.trim()`);
  check(`tela ${width} rótulo do líquido muda`, liquidLabel === "Leite integral", liquidLabel);
  const withMilk = await client.evaluate(`document.querySelector("[data-final-hyd]")?.getAttribute("data-final-hyd")`);
  check(`tela ${width} leite calcula hidratação menor`, withMilk && withMilk.startsWith("56.5"), withMilk);

  // Troca de volta para Água
  await client.evaluate(`(() => {
    const sel = document.querySelector('select[aria-label="Líquido principal"]');
    if (sel) {
      sel.value = "Água";
      sel.dispatchEvent(new Event("change", { bubbles: true }));
    }
  })()`);
  await sleep(40);

  // Remove Sal e re-adiciona pelo menu
  await client.evaluate(`document.querySelector('[aria-label="Remover Sal"]')?.click()`);
  await sleep(40);
  const hasSalt = await client.evaluate(`!!document.querySelector('[aria-label="Remover Sal"]')`);
  check(`tela ${width} sal removido`, hasSalt === false, String(hasSalt));

  await client.evaluate(`document.querySelector(".add-btn").click()`);
  await sleep(40);
  await client.evaluate(`[...document.querySelectorAll(".menu button")].find((button) => button.textContent.trim().startsWith("Sal"))?.click()`);
  await sleep(40);
  const restoredSalt = await client.evaluate(`!!document.querySelector('[aria-label="Remover Sal"]')`);
  check(`tela ${width} sal restaurado`, restoredSalt === true, String(restoredSalt));

  await fresh(client, width);
  await client.evaluate(setField("#flour", 700));
  await sleep(80);
  const loaded = client.waitLoad();
  await client.send("Page.reload", { ignoreCache: true });
  await loaded;
  await client.evaluate(`new Promise((resolve) => {
    const timer = setInterval(() => {
      if (document.querySelector("#flour")) { clearInterval(timer); resolve(true); }
    }, 40);
  })`);
  const kept = await client.evaluate(`document.querySelector("#flour").value`);
  check(`tela ${width} recarregar guarda`, kept === "700", kept);
}

async function scenario0082(client, width) {
  client.logs.length = 0;
  await client.open(BASE + "?suite=0082", width, 844);
  await client.evaluate(`(() => {
    const current = Padeiro.defaultState();
    const goodState = JSON.parse(JSON.stringify(current));
    goodState.recipeName = "Receita boa";
    const badState = JSON.parse(JSON.stringify(current));
    badState.recipeName = "Receita ruim";
    badState.ingredients.splice(1, 0, null);
    const emptyState = JSON.parse(JSON.stringify(current));
    emptyState.recipeName = "Receita vazia";
    emptyState.ingredients = [null];
    const list = [
      { id: "boa", name: "Receita boa", savedAt: "2026-10-04T12:00:00.000Z", state: goodState },
      { id: "ruim", name: "Receita ruim", savedAt: "2026-10-04T12:01:00.000Z", state: badState },
      { id: "vazia", name: "Receita vazia", savedAt: "2026-10-04T12:02:00.000Z", state: emptyState },
    ];
    localStorage.setItem("percentual-padeiro-receitas-v1", JSON.stringify(list));
  })()`);
  const loaded = client.waitLoad();
  await client.send("Page.reload", { ignoreCache: true });
  await loaded;
  await client.evaluate(`new Promise((resolve) => {
    const timer = setInterval(() => {
      if (document.querySelector(".brand") && document.querySelectorAll(".recipe-name").length >= 3) {
        clearInterval(timer);
        resolve(true);
      }
    }, 40);
  })`);
  await sleep(80);
  const mounted = await client.evaluate(`({
    brand: document.querySelector(".brand span")?.textContent || "",
    names: [...document.querySelectorAll(".recipe-name")].map((node) => node.textContent),
    errors: 0
  })`);
  check(`0082 ${width} monta`, mounted.brand === "Levain Master", mounted.brand);
  check(
    `0082 ${width} lista as três`,
    mounted.names.includes("Receita boa") && mounted.names.includes("Receita ruim") && mounted.names.includes("Receita vazia"),
    JSON.stringify(mounted.names)
  );
  await client.evaluate(`[...document.querySelectorAll("button.install")].find((button) => button.textContent.trim() === "Receitas").click()`);
  await sleep(80);
  await client.evaluate(`(() => {
    const item = [...document.querySelectorAll(".recipe-item")].find((li) => li.querySelector(".recipe-name").textContent === "Receita boa");
    item.querySelector("button").click();
  })()`);
  await sleep(80);
  const opened = await client.evaluate(`({
    name: document.querySelector(".screen-name-display span")?.textContent || "",
    flour: document.querySelector("#flour").value,
    hyd: document.querySelector("[data-final-hyd]").getAttribute("data-final-hyd")
  })`);
  check(`0082 ${width} abre a válida`, opened.name === "Receita boa" && opened.flour === "500" && opened.hyd === "65", JSON.stringify(opened));
  await client.evaluate(`[...document.querySelectorAll("button.install")].find((button) => button.textContent.trim() === "Receitas").click()`);
  await sleep(80);
  await client.evaluate(`(() => {
    const item = [...document.querySelectorAll(".recipe-item")].find((li) => li.querySelector(".recipe-name").textContent === "Receita ruim");
    item.querySelector("button").click();
  })()`);
  await sleep(80);
  const corrupt = await client.evaluate(`({
    brand: !!document.querySelector(".brand"),
    name: document.querySelector(".screen-name-display span")?.textContent || "",
    water: !!document.querySelector('[data-grams="water"]'),
    salt: !!document.querySelector('[data-grams="salt"]'),
    flour: document.querySelector("#flour").value
  })`);
  check(`0082 ${width} abre a corrompida`, corrupt.brand && corrupt.name === "Receita ruim" && corrupt.water && corrupt.salt && corrupt.flour === "500", JSON.stringify(corrupt));
  await client.evaluate(`[...document.querySelectorAll("button.install")].find((button) => button.textContent.trim() === "Receitas").click()`);
  await sleep(80);
  await client.evaluate(`(() => {
    const item = [...document.querySelectorAll(".recipe-item")].find((li) => li.querySelector(".recipe-name").textContent === "Receita vazia");
    item.querySelector("button").click();
  })()`);
  await sleep(80);
  const stayed = await client.evaluate(`document.querySelector(".screen-name-display span")?.textContent || ""`);
  check(`0082 ${width} vazia não troca a tela`, stayed === "Receita ruim", stayed);
  await client.evaluate(`document.querySelector(".save-quick").click()`);
  await sleep(80);
  await client.evaluate(`(() => {
    const input = document.querySelector("#recipe-name");
    input.value = "Pão gravado pela tela";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    document.querySelector(".recipe-save").requestSubmit();
  })()`);
  await sleep(80);
  const stored = await client.evaluate(`(() => {
    const list = JSON.parse(localStorage.getItem("percentual-padeiro-receitas-v1") || "[]");
    const saved = list.find((item) => item.name === "Pão gravado pela tela");
    const items = saved && Array.isArray(saved.state.ingredients) ? saved.state.ingredients : null;
    return {
      found: !!saved,
      clean: !!items && items.every((item) => item && typeof item === "object" && item.role),
      roles: items ? items.map((item) => item && item.role) : []
    };
  })()`);
  check(`0082 ${width} gravada sem nulo`, stored.found && stored.clean && stored.roles.includes("water"), JSON.stringify(stored));
  const errors = client.logs.filter((line) => !/Download the Vue Devtools/.test(line));
  check(`0082 ${width} sem erro`, errors.length === 0, errors.join(" | "));
}

async function setWater(client, value) {
  await client.evaluate(`(() => {
    const row = document.querySelector('[data-grams="water"]').closest(".ing-block");
    const button = row.querySelector(".pct-value");
    if (button) button.click();
  })()`);
  await sleep(60);
  await client.evaluate(`(() => {
    const row = document.querySelector('[data-grams="water"]').closest(".ing-block");
    const input = row.querySelector(".pct input");
    input.value = ${JSON.stringify(String(value))};
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("blur", { bubbles: true }));
  })()`);
  await sleep(60);
}

async function waterState(client) {
  return client.evaluate(`({
    label: document.querySelector(".hyd-num span").textContent,
    value: document.querySelector("#agua").value,
    min: document.querySelector("#agua").min,
    max: document.querySelector("#agua").max,
    hyd: document.querySelector("[data-final-hyd]").getAttribute("data-final-hyd")
  })`);
}

async function pressSlider(client, key, code, keyCode) {
  await client.evaluate(`document.querySelector("#agua").focus()`);
  await client.send("Input.dispatchKeyEvent", {
    type: "keyDown",
    key,
    code,
    windowsVirtualKeyCode: keyCode,
    nativeVirtualKeyCode: keyCode,
  });
  await client.send("Input.dispatchKeyEvent", {
    type: "keyUp",
    key,
    code,
    windowsVirtualKeyCode: keyCode,
    nativeVirtualKeyCode: keyCode,
  });
  await sleep(40);
}

async function scenario0084(client, width) {
  await client.evaluate(`localStorage.clear()`);
  const loaded = client.waitLoad();
  await client.send("Page.reload", { ignoreCache: true });
  await loaded;
  await client.evaluate(`new Promise((resolve) => {
    const timer = setInterval(() => {
      if (document.querySelector("#agua")) { clearInterval(timer); resolve(true); }
    }, 40);
  })`);
  await client.send("Emulation.setDeviceMetricsOverride", {
    width,
    height: 844,
    deviceScaleFactor: 1,
    mobile: width < 500,
  });
  await setWater(client, 20);
  const low = await waterState(client);
  check(`0084 ${width} rótulo 20`, low.label === "20" && low.value === "20" && low.min === "20", JSON.stringify(low));
  const lowScroll = await client.evaluate(`document.documentElement.scrollWidth - document.documentElement.clientWidth`);
  check(`0084 ${width} sem rolagem em 20%`, lowScroll === 0, String(lowScroll));
  await pressSlider(client, "ArrowUp", "ArrowUp", 38);
  const stepped = await waterState(client);
  check(`0084 ${width} seta não cai em 30`, stepped.value !== "30" && stepped.label !== "30", JSON.stringify(stepped));
  check(`0084 ${width} seta sobe um passo`, stepped.value === "21", JSON.stringify(stepped));
  await setWater(client, 120);
  const high = await waterState(client);
  check(`0084 ${width} rótulo 120`, high.label === "120" && high.value === "120" && high.max === "120", JSON.stringify(high));
  const highScroll = await client.evaluate(`document.documentElement.scrollWidth - document.documentElement.clientWidth`);
  check(`0084 ${width} sem rolagem em 120%`, highScroll === 0, String(highScroll));
  await pressSlider(client, "ArrowDown", "ArrowDown", 40);
  const down = await waterState(client);
  check(`0084 ${width} seta não grava 109`, down.value !== "109" && down.label !== "109", JSON.stringify(down));
  check(`0084 ${width} seta desce um passo`, down.value === "119", JSON.stringify(down));
  await client.evaluate(`(() => {
    const slider = document.querySelector("#agua");
    slider.value = "70";
    slider.dispatchEvent(new Event("input", { bubbles: true }));
  })()`);
  await sleep(40);
  const dragged = await waterState(client);
  check(`0084 ${width} arrastar grava`, dragged.label === "70" && dragged.value === "70", JSON.stringify(dragged));
  for (const mark of [55, 65, 72, 85]) {
    await client.evaluate(`document.querySelector('[aria-label="Água em ${mark}%"]').click()`);
    await sleep(40);
    const state = await waterState(client);
    check(`0084 ${width} atalho ${mark}`, state.label === String(mark) && state.value === String(mark), JSON.stringify(state));
  }
  await client.evaluate(`(() => {
    const select = document.querySelector(".ferment-select");
    select.value = "levain";
    select.dispatchEvent(new Event("change", { bubbles: true }));
  })()`);
  await sleep(80);
  await client.evaluate(`document.querySelector("#levain-title")?.closest("article").querySelector(".levain-done")?.click()`);
  await sleep(40);
  const mixed = await waterState(client);
  check(`0084 ${width} hidratação pode diferir`, mixed.label === "85" && mixed.hyd !== "85", JSON.stringify(mixed));
}

async function scenarioCard(client, width) {
  await client.open(BASE + "?card", width, 900);
  const ready = await client.evaluate(`new Promise((resolve) => {
    const done = (value) => resolve(value);
    if (navigator.serviceWorker.controller) return done(true);
    navigator.serviceWorker.addEventListener("controllerchange", () => done(true), { once: true });
    setTimeout(() => done(false), 8000);
  })`);
  check(`card ${width} service worker`, ready === true, String(ready));
  const preview = await client.evaluate(`new Promise((resolve) => {
    const start = Date.now();
    const timer = setInterval(() => {
      const img = document.querySelector(".card-preview-img");
      if ((img && img.naturalWidth >= 1000) || Date.now() - start > 9000) {
        clearInterval(timer);
        resolve({
          width: img ? img.naturalWidth : 0,
          links: [...document.querySelectorAll(".card-preview-links a")].map((a) => a.getAttribute("href")),
          scroll: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          title: document.querySelector(".brand span")?.textContent || "",
        });
      }
    }, 100);
  })`);
  check(`card ${width} prévia`, preview.width >= 1000, JSON.stringify(preview));
  check(`card ${width} sem links antigos`, preview.links.join(" ") === "card ./", JSON.stringify(preview.links));
  check(`card ${width} sem rolagem`, preview.scroll === 0, String(preview.scroll));
  check(`card ${width} título`, preview.title === "Levain Master");
  const files = await client.evaluate(`(async () => {
    async function kind(path) {
      const res = await fetch(path, { cache: "no-store" });
      return { status: res.status, type: res.headers.get("content-type") || "" };
    }
    return { card: await kind("card.png"), card2: await kind("card2.png"), card3: await kind("card3.png"), card4: await kind("card4.png") };
  })()`);
  check(`card ${width} png`, files.card.status === 200 && files.card.type.includes("image/png"), JSON.stringify(files.card));
  check(`card ${width} sem card2`, !String(files.card2.type).includes("image/png"), JSON.stringify(files.card2));
  check(`card ${width} sem card3`, !String(files.card3.type).includes("image/png"), JSON.stringify(files.card3));
  check(`card ${width} sem card4`, !String(files.card4.type).includes("image/png"), JSON.stringify(files.card4));
  await client.evaluate(`(() => {
    window.__download = "";
    const orig = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
      if (this.download) window.__download = this.download;
      return orig.apply(this, arguments);
    };
    document.querySelector(".share-card").click();
  })()`);
  const shared = await client.evaluate(`new Promise((resolve) => {
    const start = Date.now();
    const timer = setInterval(() => {
      const status = document.querySelector(".share-status")?.textContent || "";
      if (window.__download || Date.now() - start > 8000) {
        clearInterval(timer);
        resolve({ status, file: window.__download || "" });
      }
    }, 80);
  })`);
  check(`card ${width} compartilhar`, shared.file === "minha-receita.png" && /Imagem baixada|Receita compartilhada/.test(shared.status), JSON.stringify(shared));
}

async function scenarioCal(client, width) {
  await fresh(client, width);
  await client.evaluate(`document.querySelector('[aria-label="Sobre o Levain Master"]').click()`);
  await sleep(80);
  const about = await client.evaluate(`({
    guideInAbout: !!document.querySelector(".about .cal-guide-open"),
    configBtn: !!document.querySelector("[data-config-open]"),
    scroll: document.documentElement.scrollWidth - document.documentElement.clientWidth
  })`);
  check(`cal ${width} sobre limpo com botao config`, about.guideInAbout === false && about.configBtn === true, JSON.stringify(about));
  check(`cal ${width} sobre sem rolagem`, about.scroll === 0, String(about.scroll));
  await client.evaluate(`document.querySelector("[data-config-open]").click()`);
  await sleep(80);
  const inConfig = await client.evaluate(`({
    guideInConfig: !!document.querySelector(".config .cal-guide-open"),
    calOpen: !!document.querySelector("[data-cal-open]")
  })`);
  check(`cal ${width} config com link do teste e botao cal`, inConfig.guideInConfig === true && inConfig.calOpen === true, JSON.stringify(inConfig));
  await client.evaluate(`document.querySelector("[data-cal-open]").click()`);
  await sleep(80);
  await client.evaluate(setField("#cal-name", "Farinha Branca Tipo 1"));
  await client.evaluate(setField("#cal-mix", "2026-10-01T10:00"));
  await client.evaluate(setField("#cal-peak-111", "2026-10-01T14:00"));
  await client.evaluate(setField("#cal-peak-155", "2026-10-01T20:00"));
  await sleep(80);
  const form = await client.evaluate(`({
    guide: document.querySelector("[data-cal-guide-form]")?.textContent.trim() || "",
    locked: document.querySelector("[data-cal-locked]")?.textContent || "",
    saveDisabled: document.querySelector("[data-cal-save]").disabled
  })`);
  check(`cal ${width} o teste fica no registro`, form.guide === "Como fazer o teste" && form.locked.includes("não poderão ser editados") && form.saveDisabled === false, JSON.stringify(form));
  await client.evaluate(`document.querySelector("[data-cal-save]").click()`);
  await sleep(80);
  const saved = await client.evaluate(`(() => {
    const raw = JSON.parse(localStorage.getItem("percentual-padeiro-calibracoes-v1") || "null");
    const item = raw && raw.items && raw.items[0];
    return item ? { name: item.name, t1: item.t1Hours, t5: item.t5Hours, seed: item.seed111, flour: item.flour155, tempLo: item.tempLo, tempHi: item.tempHi } : null;
  })()`);
  check(`cal ${width} gravou o par`, saved && saved.name === "Farinha Branca Tipo 1" && saved.t1 === 4 && saved.t5 === 10 && saved.seed === 20 && saved.flour === 100 && saved.tempLo === 24 && saved.tempHi === 26, JSON.stringify(saved));
  await client.evaluate(`document.querySelector("[data-cal-view]").click()`);
  await sleep(80);
  const viewed = await client.evaluate(`({
    name: document.querySelector("#cal-view-name").value,
    facts: document.querySelector("[data-cal-view-facts]").innerText,
    inputs: document.querySelectorAll(".cal-view input").length,
    scroll: document.documentElement.scrollWidth - document.documentElement.clientWidth
  })`);
  check(
    `cal ${width} ver mostra o par`,
    viewed.name === "Farinha Branca Tipo 1" && viewed.inputs === 1 && viewed.facts.includes("20 g de isca") && viewed.facts.includes("100 g de farinha") && viewed.facts.includes("4 h") && viewed.facts.includes("10 h") && viewed.facts.includes("24") && viewed.facts.includes("26") && viewed.scroll === 0,
    JSON.stringify(viewed)
  );
  await client.evaluate(setField("#cal-view-name", "   "));
  await sleep(40);
  const blank = await client.evaluate(`document.querySelector("[data-cal-rename]").disabled`);
  check(`cal ${width} nome vazio não salva`, blank === true, String(blank));
  await client.evaluate(setField("#cal-view-name", "nao grava"));
  await client.evaluate(`document.querySelector(".cal-view [aria-label=Fechar]").click()`);
  await sleep(40);
  const kept = await client.evaluate(`document.querySelector("[data-cal-active]").textContent`);
  check(`cal ${width} fechar não troca o nome`, kept === "Farinha Branca Tipo 1", kept);
  await client.evaluate(`document.querySelector("[data-cal-view]").click()`);
  await sleep(40);
  await client.evaluate(setField("#cal-view-name", "Tipo 1 da padaria"));
  await client.evaluate(`document.querySelector("[data-cal-rename]").click()`);
  await sleep(40);
  const renamed = await client.evaluate(`(() => {
    const raw = JSON.parse(localStorage.getItem("percentual-padeiro-calibracoes-v1"));
    const item = raw.items[0];
    return {
      active: document.querySelector("[data-cal-active]").textContent,
      name: item.name,
      t1: item.t1Hours,
      t5: item.t5Hours,
      seed: item.seed111,
      flour: item.flour155,
      tempLo: item.tempLo
    };
  })()`);
  check(`cal ${width} só o nome muda`, renamed.active === "Tipo 1 da padaria" && renamed.name === "Tipo 1 da padaria" && renamed.t1 === 4 && renamed.t5 === 10 && renamed.seed === 20 && renamed.flour === 100 && renamed.tempLo === 24, JSON.stringify(renamed));
}

async function scenarioSeedConfig(client, width) {
  await fresh(client, width);
  await client.evaluate(`(() => {
    const sel = document.querySelector('select[aria-label="Tipo de fermento"]');
    if (sel) {
      sel.value = "levain";
      sel.dispatchEvent(new Event("change", { bubbles: true }));
    }
  })()`);
  await sleep(100);
  await client.evaluate(`document.querySelector('.levain-dialog button.del')?.click()`);
  await sleep(80);

  const initialHydration = await client.evaluate(`document.querySelector('.side-hyd')?.textContent.trim()`);

  await client.evaluate(`document.querySelector('[aria-label="Sobre o Levain Master"]').click()`);
  await sleep(100);
  await client.evaluate(`document.querySelector('[data-config-open]').click()`);
  await sleep(100);

  const seedChecked = await client.evaluate(`(() => {
    const cb = document.querySelector('[data-config-seed]');
    if (!cb) return null;
    cb.click();
    return cb.checked;
  })()`);
  check(`seed ${width} checkbox isca marcado`, seedChecked === true, String(seedChecked));
  await sleep(100);

  await client.evaluate(`document.querySelector('.config .del').click()`);
  await sleep(100);
  await client.evaluate(`document.querySelector('.about .del').click()`);
  await sleep(100);

  const withSeedHydration = await client.evaluate(`document.querySelector('.side-hyd')?.textContent.trim()`);
  check(`seed ${width} hidratação com isca recalculada`, initialHydration !== withSeedHydration, `${initialHydration} -> ${withSeedHydration}`);

  // Agora desmarca a inclusão do levain na hidratação
  await client.evaluate(`document.querySelector('[aria-label="Sobre o Levain Master"]').click()`);
  await sleep(100);
  await client.evaluate(`document.querySelector('[data-config-open]').click()`);
  await sleep(100);

  const levainChecked = await client.evaluate(`(() => {
    const cb = document.querySelector('[data-config-levain]');
    if (!cb) return null;
    cb.click();
    return cb.checked;
  })()`);
  check(`seed ${width} levain na hidratação desmarcado`, levainChecked === false, String(levainChecked));
  await sleep(100);

  await client.evaluate(`document.querySelector('.config .del').click()`);
  await sleep(100);
  await client.evaluate(`document.querySelector('.about .del').click()`);
  await sleep(100);

  const noLevainHydration = await client.evaluate(`document.querySelector('.side-hyd')?.textContent.trim()`);
  check(`seed ${width} hidratação sem levain volta para água direta`, noLevainHydration.startsWith("65"), noLevainHydration);

  const loaded = client.waitLoad();
  await client.send("Page.reload", { ignoreCache: true });
  await loaded;
  await sleep(150);

  const persisted = await client.evaluate(`(() => {
    const cfg = JSON.parse(localStorage.getItem("percentual-padeiro-config-v1") || "{}");
    return { includeLevain: cfg.includeLevain, includeSeed: cfg.includeSeed };
  })()`);
  check(`seed ${width} configuração persistida`, persisted.includeLevain === false && persisted.includeSeed === true, JSON.stringify(persisted));
}

async function scenarioPersistencia(client) {
  await fresh(client, 390);
  await client.evaluate(`(() => {
    const nativeSetItem = Storage.prototype.setItem;
    window.__nativeSetItem = nativeSetItem;
    window.__blockedStorageKeys = new Set();
    Storage.prototype.setItem = function (key, value) {
      if (window.__blockedStorageKeys.has(key)) throw new DOMException("armazenamento cheio", "QuotaExceededError");
      return nativeSetItem.call(this, key, value);
    };
  })()`);

  await client.evaluate(`window.__blockedStorageKeys.add("percentual-padeiro-v1")`);
  await client.evaluate(setField("#flour", 600));
  await sleep(80);
  let state = await client.evaluate(`document.querySelector(".storage-warning")?.textContent || ""`);
  check("persist estado avisa falha", state.includes("receita atual") && state.includes("podem se perder"), state);
  await client.evaluate(`window.__blockedStorageKeys.delete("percentual-padeiro-v1")`);
  await client.evaluate(setField("#flour", 601));
  await sleep(80);
  state = await client.evaluate(`!!document.querySelector(".storage-warning")`);
  check("persist estado limpa aviso após gravar", state === false, String(state));

  await client.evaluate(`document.querySelector(".save-quick").click()`);
  await sleep(60);
  await client.evaluate(`(() => {
    const input = document.querySelector("#recipe-name");
    input.value = "Receita com armazenamento cheio";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    window.__blockedStorageKeys.add("percentual-padeiro-receitas-v1");
    document.querySelector(".recipe-save").requestSubmit();
  })()`);
  await sleep(100);
  let saveFailure = await client.evaluate(`({
    open: document.querySelector("dialog[aria-labelledby=recipes-title]").open,
    alert: document.querySelector(".recipe-save .storage-inline")?.textContent || "",
    flash: document.querySelector(".save-quick").classList.contains("done"),
    list: localStorage.getItem("percentual-padeiro-receitas-v1")
  })`);
  check("persist salvar falha sem confirmar nem fechar", saveFailure.open && saveFailure.alert.includes("Falha") && !saveFailure.flash && saveFailure.list === null, JSON.stringify(saveFailure));

  await client.evaluate(`window.__blockedStorageKeys.delete("percentual-padeiro-receitas-v1")`);
  await client.evaluate(`document.querySelector(".recipe-save").requestSubmit()`);
  await sleep(100);
  let saved = await client.evaluate(`({
    open: document.querySelector("dialog[aria-labelledby=recipes-title]").open,
    flash: document.querySelector(".save-quick").classList.contains("done"),
    warning: !!document.querySelector(".recipe-save .storage-inline"),
    count: JSON.parse(localStorage.getItem("percentual-padeiro-receitas-v1") || "[]").length
  })`);
  check("persist salvar limpa erro e confirma depois de gravar", !saved.open && saved.flash && !saved.warning && saved.count === 1, JSON.stringify(saved));

  await client.evaluate(`document.querySelector(".top-actions button:last-child").click()`);
  await sleep(80);
  await client.evaluate(`window.__blockedStorageKeys.add("percentual-padeiro-receitas-v1")`);
  await client.evaluate(`document.querySelector(".recipe-item .recipe-del").click()`);
  await sleep(40);
  await client.evaluate(`document.querySelector(".confirm-dialog .confirm-actions .levain-done").click()`);
  await sleep(100);
  const deleteFailure = await client.evaluate(`({
    count: document.querySelectorAll(".recipe-item").length,
    stored: JSON.parse(localStorage.getItem("percentual-padeiro-receitas-v1") || "[]").length,
    alert: document.querySelector(".recipe-save .storage-inline")?.textContent || ""
  })`);
  check("persist apagar falha preserva lista", deleteFailure.count === 1 && deleteFailure.stored === 1 && deleteFailure.alert.includes("Falha"), JSON.stringify(deleteFailure));
  await client.evaluate(`window.__blockedStorageKeys.delete("percentual-padeiro-receitas-v1")`);
  await client.evaluate(`document.querySelector(".recipe-item .recipe-del").click()`);
  await sleep(40);
  await client.evaluate(`document.querySelector(".confirm-dialog .confirm-actions .levain-done").click()`);
  await sleep(100);
  const deleted = await client.evaluate(`({ count: document.querySelectorAll(".recipe-item").length, warning: !!document.querySelector(".recipe-save .storage-inline") })`);
  check("persist apagar conclui após gravar", deleted.count === 0 && !deleted.warning, JSON.stringify(deleted));

  await client.evaluate(`localStorage.setItem("percentual-padeiro-calibracoes-v1", JSON.stringify({ activeId: "", items: [{
    id: "fixture", name: "Calibração de teste", t1Hours: 4, t5Hours: 10, tempLo: 24, tempHi: 26,
    mixAt: "2026-10-01T10:00", peak111At: "2026-10-01T14:00", peak155At: "2026-10-01T20:00",
    seed111: 20, water111: 20, flour111: 20, seed155: 20, water155: 100, flour155: 100
  }] }))`);
  const loaded = client.waitLoad();
  await client.send("Page.reload", { ignoreCache: true });
  await loaded;
  await client.evaluate(`new Promise((resolve) => {
    const timer = setInterval(() => {
      if (document.querySelector(".brand")) { clearInterval(timer); resolve(true); }
    }, 40);
  })`);
  await client.evaluate(`(() => {
    const nativeSetItem = Storage.prototype.setItem;
    window.__nativeSetItem = nativeSetItem;
    window.__blockedStorageKeys = new Set();
    Storage.prototype.setItem = function (key, value) {
      if (window.__blockedStorageKeys.has(key)) throw new DOMException("armazenamento cheio", "QuotaExceededError");
      return nativeSetItem.call(this, key, value);
    };
  })()`);
  await client.evaluate(`document.querySelector('[aria-label="Sobre o Levain Master"]').click()`);
  await sleep(60);
  await client.evaluate(`document.querySelector('[data-config-open]').click()`);
  await sleep(60);
  await client.evaluate(`window.__blockedStorageKeys.add("percentual-padeiro-calibracoes-v1")`);
  await client.evaluate(`document.querySelector('input[name="cal-active"][value="fixture"]').click()`);
  await sleep(100);
  let calAlert = await client.evaluate(`document.querySelector(".about-cal .storage-inline")?.textContent || ""`);
  check("persist calibração avisa falha", calAlert.includes("Falha") && calAlert.includes("podem se perder"), calAlert);
  await client.evaluate(`window.__blockedStorageKeys.delete("percentual-padeiro-calibracoes-v1")`);
  await client.evaluate(`document.querySelector('input[name="cal-active"][value=""]').click()`);
  await sleep(100);
  calAlert = await client.evaluate(`!!document.querySelector(".about-cal .storage-inline")`);
  check("persist calibração limpa aviso após gravar", calAlert === false, String(calAlert));

  await client.evaluate(`Storage.prototype.setItem = window.__nativeSetItem`);
  await client.evaluate(`localStorage.removeItem("percentual-padeiro-v1")`);
}

async function scenario0085(client) {
  await client.open(BASE + "?card", 390, 844);
  const ready = await client.evaluate(`new Promise((resolve) => {
    if (navigator.serviceWorker.controller) return resolve(true);
    navigator.serviceWorker.addEventListener("controllerchange", () => resolve(true), { once: true });
    setTimeout(() => resolve(false), 8000);
  })`);
  check("0085 worker", ready === true, String(ready));
  const hadCard = await client.evaluate(`new Promise((resolve) => {
    const start = Date.now();
    const timer = setInterval(async () => {
      const res = await fetch("card.png", { cache: "no-store" });
      if (res.ok || Date.now() - start > 8000) {
        clearInterval(timer);
        resolve(res.ok);
      }
    }, 120);
  })`);
  check("0085 card inicial", hadCard === true, String(hadCard));
  const race = await client.evaluate(`(async () => {
    const worker = navigator.serviceWorker.controller;
    function post(text, generation) {
      return new Promise((resolve) => {
        const channel = new MessageChannel();
        channel.port1.onmessage = (event) => resolve(!!(event.data && event.data.ok));
        worker.postMessage({ type: "card", blob: new Blob([text], { type: "image/png" }), generation }, [channel.port2]);
      });
    }
    const newerOk = await post("newer-card-bytes", 1000000);
    const olderOk = await post("older-card-bytes", 999999);
    const body = await (await fetch("card.png", { cache: "no-store" })).text();
    return { newerOk, olderOk, body };
  })()`);
  check("0085 geração nova grava", race.newerOk === true && race.body === "newer-card-bytes", JSON.stringify(race));
  check("0085 geração antiga recusada", race.olderOk === false && !String(race.body).includes("older-card"), JSON.stringify(race));
  const share = await client.evaluate(`(async () => {
    const worker = navigator.serviceWorker.controller;
    const real = worker.postMessage.bind(worker);
    let cards = 0;
    worker.postMessage = function (data, transfer) {
      if (data && data.blob) cards += 1;
      return real(data, transfer);
    };
    window.__download = "";
    const orig = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
      if (this.download) window.__download = this.download;
      return orig.apply(this, arguments);
    };
    document.querySelector(".share-card").click();
    const start = Date.now();
    while (!window.__download && Date.now() - start < 8000) await new Promise((r) => setTimeout(r, 50));
    return { cards, file: window.__download || "" };
  })()`);
  check("0085 compartilhar fora da fila", share.cards === 0 && share.file === "minha-receita.png", JSON.stringify(share));
}

const session = await launchChrome({ port: PORT, width: 390, height: 844 });
try {
  const client = await pageOf(session.version);
  await scenarioTelas(client, 390);
  await scenarioTelas(client, 560);
  await scenario0082(client, 390);
  await scenario0082(client, 560);
  await scenario0084(client, 390);
  await scenario0084(client, 560);
  await scenarioCard(client, 390);
  await scenarioCard(client, 560);
  await scenarioCal(client, 390);
  await scenarioCal(client, 560);
  await scenarioSeedConfig(client, 390);
  await scenarioSeedConfig(client, 560);
  await scenarioPersistencia(client);
  await scenario0085(client);
  client.ws.close();
} finally {
  await stopChrome(session);
}

if (fails.length) {
  console.log("FALHOU", fails.length);
  process.exit(1);
}
console.log("UI OK");
