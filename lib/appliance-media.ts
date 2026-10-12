export const APPLIANCE_PHOTOS = {
  hero: "/kitchens/stile-insel.jpg",
  kochen: "/kitchens/stile-modern.jpg",
  backen: "/kitchens/stile-holz.jpg",
  kaelte: "/kitchens/stile-design.jpg",
  spuelen: "/kitchens/stile-purist.jpg",
  extra: "/kitchens/stile-landhaus.jpg",
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
