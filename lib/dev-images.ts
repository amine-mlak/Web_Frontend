/** Temporary development photography. Replace with BEER workshop images later. */

function pexels(id: number, width = 1800) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;
}

function unsplash(id: string, width = 1800) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;
}

/** Dark stone, oak, and built-in kitchens first. Verified HTTP 200. */
const PEXELS_IDS = [
  6585764, 6585759, 6585756, 6585751, 6585763, 6585757, 6585745, 6585743,
  6782567, 6585750, 6585617, 6585619, 6585614, 6585742, 6585749, 6585620,
  6585758, 6585761, 6585762, 6758771, 6585744, 6585746, 6585616, 6585618,
  6585615, 3990592, 2062426, 2089698, 1080721, 1358900, 3935350, 6480707,
  6969870, 210547, 2029667, 2343467, 6207815, 2251247, 1571460, 1918291,
  1457842, 1643383, 1571453, 1648776, 1457847, 1571468, 2082087, 2121121,
  1457841, 1571457, 1571463, 1643384, 276724, 271743, 2724749, 2724748,
  1080696, 1599791, 2635038, 279719, 373548, 280232, 534151, 259962,
] as const;

const UNSPLASH_IDS = [
  "1556912173-46c336c7fd55",
  "1556911220-e15b29be8c8f",
  "1484154218962-a197022b5858",
  "1556910103-1c02745aae4d",
  "1556909114-f6e7ad7d3136",
  "1600566753190-17f0baa2a6c3",
  "1600566753086-00f18fb6b3ea",
  "1600566752355-35792bedcfea",
  "1600607687939-ce8a6c25118c",
  "1600607687644-c7171b42498f",
  "1600607688969-a5bfcd646154",
  "1556911073-38141963c9e0",
] as const;

type Slot = { kind: "pexels"; id: number } | { kind: "unsplash"; id: string };

const POOL: Slot[] = [
  ...UNSPLASH_IDS.map((id) => ({ kind: "unsplash" as const, id })),
  ...PEXELS_IDS.map((id) => ({ kind: "pexels" as const, id })),
];

export function devPhoto(index: number, width = 1800) {
  const slot = POOL[((index % POOL.length) + POOL.length) % POOL.length];
  return slot.kind === "pexels" ? pexels(slot.id, width) : unsplash(slot.id, width);
}

export function isDevPlaceholder(src?: string) {
  return !src || src.startsWith("/kitchens/");
}

export function resolveDevImage(src: string | undefined, fallback: string): string {
  if (!src || src.startsWith("/kitchens/")) {
    return fallback;
  }
  return src;
}
