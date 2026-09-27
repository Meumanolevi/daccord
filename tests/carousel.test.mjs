import assert from "node:assert/strict";
import test from "node:test";
import { getCarouselStops, getClosestStop } from "../src/lib/carousel.ts";

test("mobile: keep a reachable stop for each of the three cards", () => {
  assert.deepEqual(getCarouselStops([0, 320, 640], 592), [0, 320, 592]);
});

test("desktop: deduplicate the end stop when two cards fit", () => {
  assert.deepEqual(getCarouselStops([0, 620, 1240], 620), [0, 620]);
});

test("wide screens: retain navigation for a partially visible last card", () => {
  assert.deepEqual(getCarouselStops([0, 600, 1200], 300), [0, 300]);
});

test("no overflow or empty content: a single position without duplicate dots", () => {
  assert.deepEqual(getCarouselStops([0, 300, 600], 0), [0]);
  assert.deepEqual(getCarouselStops([], -5), [0]);
});

test("fractional layout rounding does not create extra stops", () => {
  assert.deepEqual(getCarouselStops([0, 619.8, 1239.6], 620), [0, 619.8]);
});

test("swipe position and boundaries update the correct indicator", () => {
  const stops = [0, 320, 592];
  for (const [position, expected] of [[-10, 0], [0, 0], [240, 1], [320, 1], [560, 2], [700, 2]]) {
    assert.equal(getClosestStop(stops, position), expected);
  }
});
