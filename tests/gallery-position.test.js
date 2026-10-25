import test from "node:test";
import assert from "node:assert/strict";
import { clampProgress, nearestProject, projectScrollPosition } from "../app/animations/gallery-position.js";

test("the final project aligns at the pin end even when its leading edge exceeds the available travel", () => {
  const offsets = [0, 1000, 2000, 3000, 4000];
  const distance = 3900;
  assert.equal(projectScrollPosition(offsets[4], distance, 600, 4500), 4500);
  assert.equal(nearestProject(offsets, distance, distance), 4);
});

test("scrolling backwards selects the preceding visible project", () => {
  const offsets = [0, 1000, 2000, 3000, 4000];
  assert.equal(nearestProject(offsets, 3100, 3900), 3);
  assert.equal(nearestProject(offsets, 2050, 3900), 2);
  assert.equal(nearestProject(offsets, 0, 3900), 0);
});

test("navigation recalculates its vertical destination after a viewport resize", () => {
  assert.equal(projectScrollPosition(2000, 3900, 600, 4500), 2600);
  assert.equal(projectScrollPosition(1500, 2900, 500, 3400), 2000);
});

test("zero travel and touch overscroll stay within the valid progress range", () => {
  assert.equal(projectScrollPosition(0, 0, 600, 600), 600);
  assert.equal(clampProgress(-.1), 0);
  assert.equal(clampProgress(1.1), 1);
  assert.equal(projectScrollPosition(-100, 3900, 600, 4500), 600);
});
