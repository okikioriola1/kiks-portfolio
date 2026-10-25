import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

// Exercise the browser module's lifecycle with controlled transition and layout timing.
const source = readFileSync(new URL("../app/animations/selected-work.js", import.meta.url), "utf8")
  .replace(/^import .*;\n/gm, "")
  .replace("export function animateSelectedWork", "function animateSelectedWork");
const flush = () => new Promise(resolve => setImmediate(resolve));

function setup() {
  let outgoingHeight = 6000;
  let cleanup;
  let refreshes = 0;
  const measured = [];
  const listeners = new Map();
  const node = top => ({ getBoundingClientRect: () => ({ top: top + outgoingHeight }) });
  const visual = node(1400);
  const meta = { ...node(2000), children: [node(2000)] };
  const project = { querySelector: selector => ({
    ".work-project__visual": visual,
    ".work-project__image-motion": node(1400),
    ".work-project__meta": meta,
  })[selector] };
  const section = {
    ...node(1200), isConnected: true,
    querySelector: () => node(1200),
    querySelectorAll: selector => selector === ".work-project" ? [project] : [node(1200)],
    addEventListener: (name, listener) => listeners.set(name, listener),
    removeEventListener: name => listeners.delete(name),
  };
  const record = options => {
    if (options?.scrollTrigger) measured.push(options.scrollTrigger.trigger.getBoundingClientRect().top);
  };
  const tween = () => ({ progress() {}, scrollTrigger: { kill() {} } });
  const gsap = {
    registerPlugin() {},
    matchMedia: () => ({
      add: (_query, callback) => {
        const context = { add(name, fn) { this[name] = fn; } };
        cleanup = callback(context);
      },
      revert: () => cleanup?.(),
    }),
    fromTo: (_target, _from, to) => { record(to); return tween(); },
    timeline: options => {
      record(options);
      return { ...tween(), fromTo() { return this; } };
    },
  };
  const sandbox = { gsap, ScrollTrigger: { refresh: () => refreshes++ }, document: { fonts: { ready: Promise.resolve() } } };
  vm.runInNewContext(source, sandbox);
  let finishTransition;
  const ready = new Promise(resolve => { finishTransition = resolve; });
  const stop = sandbox.animateSelectedWork({ querySelector: () => section }, ready);
  return {
    measured, listeners, stop, section,
    finishTransition() { outgoingHeight = 0; finishTransition(); },
    get refreshes() { return refreshes; },
  };
}

test("selected projects are measured after the outgoing page is removed", async () => {
  const page = setup();
  await flush();
  assert.deepEqual(page.measured, [], "pending navigation must not capture the outgoing page's height");
  assert.equal(page.refreshes, 0);

  page.finishTransition();
  await flush();
  assert.deepEqual(page.measured, [1200, 1200, 1400, 2000]);
  assert.ok(page.refreshes > 0, "refresh scroll positions in the final page layout");
  page.stop();
});

test("leaving Home before its transition completes cannot create stale project reveals", async () => {
  const page = setup();
  page.stop();
  page.section.isConnected = false;
  page.finishTransition();
  await flush();
  assert.deepEqual(page.measured, []);
  assert.equal(page.refreshes, 0);
  assert.equal(page.listeners.size, 0);
});
