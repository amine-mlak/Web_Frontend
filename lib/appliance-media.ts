function pexels(id: number, width = 1800) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;
}

function commons(file: string, width = 1800) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;
}

export const APPLIANCE_PHOTOS = {
  hero: pexels(2343467),
  kochen: commons("Induktionshäll.JPG"),
  backen: pexels(38310809),
  kaelte: commons("SubZeroExt.jpg"),
  spuelen: commons("Kitchen cupboards with integrated dishwasher.jpg"),
  extra: pexels(324028),
} as const;

export const APPLIANCE_BRANDS = [
  { slug: "bora", name: "Bora", logo: "/brands/bora.svg", invert: true },
  { slug: "miele", name: "Miele", logo: "/brands/miele.svg", invert: false },
  { slug: "gaggenau", name: "Gaggenau", logo: "/brands/gaggenau.svg", invert: true },
  { slug: "quooker", name: "Quooker", logo: "/brands/quooker.svg", invert: false },
  { slug: "siemens", name: "Siemens", logo: "/brands/siemens.svg", invert: false },
] as const;

export function applianceBrand(slug: string) {
  return APPLIANCE_BRANDS.find((brand) => brand.slug === slug);
}
