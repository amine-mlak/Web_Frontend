export const APPLIANCE_PHOTOS = {
  hero: "/kitchens/stile-insel.jpg",
  kochen: "/kitchens/stile-modern.jpg",
  backen: "/kitchens/stile-holz.jpg",
  kaelte: "/kitchens/stile-design.jpg",
  spuelen: "/kitchens/stile-purist.jpg",
  extra: "/kitchens/stile-landhaus.jpg",
} as const;

export type ApplianceBrandLogo = {
  slug: string;
  name: string;
  logo: string;
  /** Show a dark logo white on the dark band. */
  invert: boolean;
};
