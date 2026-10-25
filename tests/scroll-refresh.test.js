import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../app/animations/scroll-refresh.js", import.meta.url), "utf8")
  .replace(/^import .*;\n/gm, "")
  .replace("export function", "function");

function setup() {
  let scrolling = false;
  let connected = true;
  let position = 1600;
  let refreshes = 0;
  let nextFrame = 0;
  const frames = new Map();
  const listeners = new Set();
  const sandbox = {
    requestAnimationFrame: callback => { frames.set(++nextFrame, callback); return nextFrame; },
    cancelAnimationFrame: id => frames.delete(id),
    ScrollTrigger: {
      isScrolling: () => scrolling,
      addEventListener: (_name, callback) => listeners.add(callback),
      removeEventListener: (_name, callback) => listeners.delete(callback),
      refresh() {
        refreshes++;
        // Model a browser measuring while the user is moving: a refresh here
        // would disrupt the native gesture and put the viewport back at the top.
        if (scrolling) position = 0;
      },
    },
  };
  vm.runInNewContext(source, sandbox);
  const refresh = sandbox.createScrollRefresh(() => connected);
  return {
    refresh, frames, listeners,
    frame() { const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(callback => callback()); },
    swipe() { scrolling = true; position += 200; },
    settle() { scrolling = false; [...listeners].forEach(callback => callback()); },
    leave() { connected = false; },
    get position() { return position; },
    get refreshes() { return refreshes; },
  };
}

test("late image and font requests wait through a swipe and momentum before refreshing once", () => {
  const page = setup();
  page.swipe();
  page.refresh.request();
  page.refresh.request();
  page.frame();
  assert.equal(page.refreshes, 0);
  page.swipe();
  page.refresh.request();
  assert.equal(page.listeners.size, 1);
  assert.equal(page.position, 2000);
  page.settle();
  page.frame();
  assert.equal(page.refreshes, 1);
  assert.equal(page.position, 2000);
  assert.equal(page.listeners.size, 0);
});

test("a swipe that starts before the queued measurement also defers the refresh", () => {
  const page = setup();
  page.refresh.request();
  page.swipe();
  page.frame();
  assert.equal(page.refreshes, 0);
  page.settle();
  page.frame();
  assert.equal(page.refreshes, 1);
});

test("leaving a page cancels its pending scroll listener and animation frame", () => {
  const page = setup();
  page.swipe();
  page.refresh.request();
  page.frame();
  page.refresh.cancel();
  assert.equal(page.listeners.size, 0);
  page.settle();
  page.frame();
  assert.equal(page.refreshes, 0);
  page.refresh.request();
  page.refresh.cancel();
  assert.equal(page.frames.size, 0);
});

test("an asset completing after navigation cannot refresh the departed page", () => {
  const page = setup();
  page.leave();
  page.refresh.request();
  page.frame();
  assert.equal(page.refreshes, 0);
  assert.equal(page.listeners.size, 0);
});
