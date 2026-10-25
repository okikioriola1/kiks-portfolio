import test from "node:test";
import assert from "node:assert/strict";
import { setImmediate } from "node:timers/promises";
import { waitForIntroAssets } from "../app/animations/intro-assets.js";

class ImageStub extends EventTarget {
  complete = false;
  decode = () => Promise.resolve();
  listeners = new Set();

  addEventListener(type, listener, options) {
    this.listeners.add(listener);
    super.addEventListener(type, listener, options);
  }

  removeEventListener(type, listener) {
    this.listeners.delete(listener);
    super.removeEventListener(type, listener);
  }
}

test("a cached image must finish decoding before the hero is ready", async () => {
  const image = new ImageStub();
  image.complete = true;
  let decode;
  image.decode = () => new Promise(resolve => { decode = resolve; });
  let settled = false;
  const ready = waitForIntroAssets([image]);
  ready.then(() => { settled = true; });
  await setImmediate();
  assert.equal(settled, false);
  decode();
  assert.equal(await ready, "ready");
  assert.equal(image.listeners.size, 0);
});

test("the hero waits for every image and both required font weights", async () => {
  const images = [new ImageStub(), new ImageStub()];
  const pendingFonts = [];
  const fonts = { load: font => new Promise(resolve => { pendingFonts.push({ font, resolve }); }) };
  let settled = false;
  const ready = waitForIntroAssets(images, fonts);
  ready.then(() => { settled = true; });
  await setImmediate();
  assert.equal(pendingFonts.length, 2);
  assert.ok(pendingFonts.every(({ font }) => font.includes('"Hanken Grotesk"')));

  images[0].dispatchEvent(new Event("load"));
  pendingFonts[0].resolve([{ family: "Hanken Grotesk" }]);
  await setImmediate();
  assert.equal(settled, false);

  images[1].dispatchEvent(new Event("load"));
  await setImmediate();
  assert.equal(settled, false);
  pendingFonts[1].resolve([{ family: "Hanken Grotesk" }]);
  assert.equal(await ready, "ready");
  assert.ok(images.every(image => image.listeners.size === 0));
});

test("broken images and failed fonts release the intro", async () => {
  const image = new ImageStub();
  const fonts = { load: () => Promise.reject(new Error("Network failure")) };
  const ready = waitForIntroAssets([image], fonts);
  image.dispatchEvent(new Event("error"));
  assert.equal(await ready, "ready");
  assert.equal(image.listeners.size, 0);
});

test("a decoding failure releases the intro", async () => {
  const image = new ImageStub();
  image.complete = true;
  image.decode = () => Promise.reject(new Error("Invalid image"));
  assert.equal(await waitForIntroAssets([image]), "ready");
});

test("fonts wait for a slow stylesheet to register their faces", async () => {
  let registered = false;
  let settled = false;
  const fonts = { load: () => Promise.resolve(registered ? [{ family: "Hanken Grotesk" }] : []) };
  const ready = waitForIntroAssets([], fonts, { timeoutMs: 1000 });
  ready.then(() => { settled = true; });
  await setImmediate();
  assert.equal(settled, false);
  registered = true;
  assert.equal(await ready, "ready");
});

test("a font stylesheet that never arrives cannot lock the intro", async () => {
  const fonts = { load: () => Promise.resolve([]) };
  assert.equal(await waitForIntroAssets([], fonts, { timeoutMs: 20 }), "timeout");
});

test("stalled requests respect the shared deadline and remove listeners", async () => {
  const image = new ImageStub();
  const fonts = { load: () => new Promise(() => {}) };
  assert.equal(await waitForIntroAssets([image], fonts, { timeoutMs: 20 }), "timeout");
  assert.equal(image.listeners.size, 0);
});

test("cancelling an intro releases its pending image listeners", async () => {
  const image = new ImageStub();
  const controller = new AbortController();
  const ready = waitForIntroAssets([image], undefined, { signal: controller.signal });
  controller.abort();
  assert.equal(await ready, "aborted");
  assert.equal(image.listeners.size, 0);
});

test("an already cancelled intro does not begin loading assets", async () => {
  const controller = new AbortController();
  controller.abort();
  const fonts = { load: () => { throw new Error("Should not be requested"); } };
  assert.equal(await waitForIntroAssets([], fonts, { signal: controller.signal }), "aborted");
});
