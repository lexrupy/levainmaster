// Levain Master — © 2026 Alexandre da Silva
// SPDX-License-Identifier: LGPL-3.0-or-later
// Abre o Chrome já instalado pelo protocolo de depuração. Sem dependência de fora.
import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { setTimeout as sleep } from "node:timers/promises";

export async function launchChrome({ port, width, height }) {
  const dir = await mkdtemp(`${tmpdir()}/padeiro-chrome-`);
  const chrome = spawn(
    "/usr/bin/google-chrome",
    [
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      "--disable-dev-shm-usage",
      `--user-data-dir=${dir}`,
      `--remote-debugging-port=${port}`,
      `--window-size=${width},${height}`,
      "about:blank",
    ],
    { stdio: "ignore" }
  );
  const started = Date.now();
  let version = null;
  while (Date.now() - started < 10000) {
    try {
      version = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json();
      break;
    } catch (error) {
      await sleep(100);
    }
  }
  if (!version) {
    chrome.kill("SIGKILL");
    await rm(dir, { recursive: true, force: true });
    throw new Error("O Chrome não abriu a porta de depuração");
  }
  return { chrome, dir, version };
}

export async function stopChrome(session) {
  if (!session) return;
  session.chrome.kill("SIGTERM");
  await sleep(200);
  if (session.chrome.exitCode == null) session.chrome.kill("SIGKILL");
  await rm(session.dir, { recursive: true, force: true });
}

export function connectChrome(wsUrl) {
  let seq = 0;
  const ws = new WebSocket(wsUrl);
  const pending = new Map();
  const waits = { load: null };
  const logs = [];
  const ready = new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve);
    ws.addEventListener("error", reject);
  });
  ws.addEventListener("message", (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.method === "Page.loadEventFired" && waits.load) {
      const resolve = waits.load;
      waits.load = null;
      resolve();
    }
    if (msg.method === "Runtime.exceptionThrown") {
      logs.push(msg.params?.exceptionDetails?.exception?.description || msg.params?.exceptionDetails?.text || "exception");
    }
    if (msg.method === "Runtime.consoleAPICalled" && (msg.params?.type === "error" || msg.params?.type === "warning")) {
      const text = (msg.params.args || []).map((arg) => arg.value || arg.description || "").join(" ");
      if (msg.params.type === "error") logs.push(text);
    }
    if (msg.id && pending.has(msg.id)) {
      const box = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) box.reject(new Error(JSON.stringify(msg.error)));
      else box.resolve(msg.result);
    }
  });
  function send(method, params = {}) {
    const id = ++seq;
    ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
  }
  async function evaluate(expression) {
    const result = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    }
    return result.result?.value;
  }
  function waitLoad() {
    return new Promise((resolve) => {
      waits.load = resolve;
    });
  }
  async function open(url, width, height) {
    await send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 500,
    });
    const loaded = waitLoad();
    await send("Page.navigate", { url });
    await loaded;
    await evaluate(`new Promise((resolve) => {
      const timer = setInterval(() => {
        if (document.querySelector(".brand")) {
          clearInterval(timer);
          resolve(true);
        }
      }, 40);
    })`);
  }
  return { ws, send, evaluate, waitLoad, open, logs, ready };
}
