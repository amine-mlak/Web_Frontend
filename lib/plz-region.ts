import { PRINT_REGION_RANGES } from "@/lib/plz-print-regions";

/**
 * Whether a German postcode lies in Bavaria or Baden-Württemberg, the only states the printed
 * booklet is posted to. The table is generated (scripts/build-plz-regions.mjs); this file only
 * reads it. The browser loads it lazily (only when print is picked); the server checks again.
 */
let ranges: Array<[number, number]> | null = null;

function table() {
  if (!ranges) {
    ranges = PRINT_REGION_RANGES.split(" ").map((part) => {
      const [from, to] = part.split(",").map(Number);
      return [from, to ?? from] as [number, number];
    });
  }
  return ranges;
}

export function inPrintRegion(plz: string) {
  if (!/^\d{5}$/.test(plz)) return false;
  const code = Number(plz);
  const list = table();
  let low = 0;
  let high = list.length - 1;
  while (low <= high) {
    const mid = (low + high) >> 1;
    const [from, to] = list[mid];
    if (code < from) high = mid - 1;
    else if (code > to) low = mid + 1;
    else return true;
  }
  return false;
}
