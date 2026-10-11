// Levain Master — © 2026 Alexandre da Silva
// SPDX-License-Identifier: LGPL-3.0-or-later
const assert = require("node:assert/strict");
const { readFile } = require("node:fs/promises");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

test("ativação remove versões antigas do app e preserva caches alheios", async () => {
  const source = await readFile(path.join(__dirname, "..", "ServiceWorker.js"), "utf8");
  const listeners = new Map();
  const keys = ["padeiro-v105", "padeiro-v106", "padeiro-v107", "padeiro-v108", "padeiro-v109", "padeiro-v110", "padeiro-v111", "padeiro-v112", "padeiro-v113", "padeiro-v114", "outro-app", "padeiro-aux-v1"];
  const deleted = [];
  const self = {
    addEventListener: (name, handler) => listeners.set(name, handler),
    skipWaiting: () => Promise.resolve(),
    clients: { claim: () => Promise.resolve() },
  };
  const caches = {
    keys: () => Promise.resolve(keys),
    delete: (key) => {
      deleted.push(key);
      return Promise.resolve(true);
    },
  };
  vm.runInNewContext(source, { self, caches, URL, Request, Response, Blob, setTimeout });

  const pending = [];
  listeners.get("activate")({ waitUntil: (promise) => pending.push(promise) });
  await Promise.all(pending);

  assert.deepEqual(deleted.sort(), ["padeiro-v105", "padeiro-v106", "padeiro-v107", "padeiro-v108", "padeiro-v109", "padeiro-v110", "padeiro-v111", "padeiro-v112", "padeiro-v113"]);
  assert.ok(keys.includes("outro-app"));
  assert.ok(keys.includes("padeiro-aux-v1"));
  assert.ok(keys.includes("padeiro-v114"));
});
