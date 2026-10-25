export const clampProgress = value => Math.max(0, Math.min(1, value));

export function nearestProject(offsets, travelled, distance) {
  return offsets.reduce((best, offset, i) =>
    Math.abs(Math.min(distance, offset) - travelled) < Math.abs(Math.min(distance, offsets[best]) - travelled) ? i : best, 0);
}

export function projectScrollPosition(offset, distance, start, end) {
  return start + (distance > 0 ? clampProgress(offset / distance) : 0) * (end - start);
}
