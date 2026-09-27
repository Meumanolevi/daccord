/** Real scroll stops, deduplicated when several cards share the end boundary. */
export function getCarouselStops(offsets: number[], maxScroll: number): number[] {
  const limit = Math.max(0, maxScroll);
  const stops = [0];
  for (const offset of offsets) {
    const position = Math.min(limit, Math.max(0, offset));
    if (position - stops[stops.length - 1] > 1) stops.push(position);
  }
  return stops;
}

export function getClosestStop(stops: number[], scrollLeft: number): number {
  return stops.reduce((closest, position, index) =>
    Math.abs(position - scrollLeft) < Math.abs(stops[closest] - scrollLeft) ? index : closest, 0);
}
