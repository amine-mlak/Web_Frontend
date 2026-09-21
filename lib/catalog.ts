import catalog from "@/lib/catalog-data.json";

export type KitchenClusterSlug =
  | "formen"
  | "stile"
  | "farben"
  | "inseln"
  | "besondere";

export type KitchenCluster = {
  slug: KitchenClusterSlug;
  name: string;
  intro: string;
  seoTitle: string;
  seoDescription: string;
};

export type KitchenTopic = {
  slug: string;
  cluster: KitchenClusterSlug;
  name: string;
  hex: string;
  image: string;
  intro: string;
  order: number;
};

export type CatalogSpec = { label: string; value: string };

export type Project = {
  slug: string;
  title: string;
  place: string;
  year: string;
  intro: string;
  body: string;
  image: string;
  srcSet?: string;
  topics: KitchenTopic[];
  brands: Brand[];
  materials: Material[];
  appliances: Appliance[];
  regions: Region[];
  specs: CatalogSpec[];
};

export type Brand = {
  slug: string;
  name: string;
  image: string;
  srcSet?: string;
  intro: string;
  body: string;
  order: number;
};

export type ApplianceKind = "kochen" | "backen" | "kaelte" | "spuelen" | "extra";

export type Appliance = {
  slug: string;
  kind: ApplianceKind;
  name: string;
  image: string;
  srcSet?: string;
  intro: string;
  order: number;
};

export type Furniture = {
  slug: string;
  kind: string;
  name: string;
  image: string;
  srcSet?: string;
  intro: string;
  order: number;
};

export type Region = {
  slug: string;
  name: string;
  intro: string;
  image?: string;
  order: number;
};

export type MaterialKind = "front" | "worktop" | "interior";

export type Material = {
  slug: string;
  kind: MaterialKind;
  name: string;
  image: string;
  srcSet?: string;
  intro: string;
  order: number;
};

export type ArticleCategory = { slug: string; name: string };

export type Article = {
  slug: string;
  title: string;
  description: string;
  body: string;
  image: string;
  srcSet?: string;
  category?: ArticleCategory;
};

export type SitePage = {
  slug: string;
  eyebrow: string;
  title: string;
  intro: string;
  body: string;
  image: string;
  srcSet?: string;
  ctaLabel: string;
  ctaUrl: string;
};

export const KITCHEN_CLUSTERS: KitchenCluster[] = catalog.clusters.map(
  (cluster) => ({
    ...cluster,
    slug: cluster.slug as KitchenClusterSlug,
  }),
);

export const APPLIANCE_KINDS: { slug: ApplianceKind; name: string }[] = [
  { slug: "kochen", name: "Kochen" },
  { slug: "backen", name: "Backen & Dämpfen" },
  { slug: "kaelte", name: "Kälte" },
  { slug: "spuelen", name: "Spülen" },
  { slug: "extra", name: "Extra" },
];

export const MATERIAL_KINDS: { slug: MaterialKind; name: string }[] = [
  { slug: "front", name: "Fronten" },
  { slug: "worktop", name: "Arbeitsplatten" },
  { slug: "interior", name: "Innenleben" },
];

const topicRecords: KitchenTopic[] = catalog.topics.map((topic) => ({
  ...topic,
  cluster: topic.cluster as KitchenClusterSlug,
}));

const topicBySlug = new Map(topicRecords.map((topic) => [topic.slug, topic]));

export const FALLBACK_BRANDS: Brand[] = catalog.brands.map((item) => ({
  ...item,
  body: item.body,
}));

export const FALLBACK_APPLIANCES: Appliance[] = catalog.appliances.map(
  (item) => ({
    ...item,
    kind: item.kind as ApplianceKind,
  }),
);

export const FALLBACK_FURNITURE: Furniture[] = catalog.furniture;

export const FALLBACK_REGIONS: Region[] = catalog.regions.map((item) => ({
  ...item,
  image: "/kitchens/stile-modern.jpg",
}));

export const FALLBACK_MATERIALS: Material[] = catalog.materials.map((item) => ({
  ...item,
  kind: item.kind as MaterialKind,
}));

export const FALLBACK_CATEGORIES: ArticleCategory[] = catalog.categories;

export const FALLBACK_ARTICLES: Article[] = catalog.articles.map((item) => ({
  ...item,
  category: FALLBACK_CATEGORIES.find((category) => category.slug === item.category),
}));

export const FALLBACK_PAGES: SitePage[] = catalog.pages;

const brandBySlug = new Map(FALLBACK_BRANDS.map((item) => [item.slug, item]));
const applianceBySlug = new Map(
  FALLBACK_APPLIANCES.map((item) => [item.slug, item]),
);
const materialBySlug = new Map(
  FALLBACK_MATERIALS.map((item) => [item.slug, item]),
);
const regionBySlug = new Map(FALLBACK_REGIONS.map((item) => [item.slug, item]));

export const FALLBACK_TOPICS: KitchenTopic[] = topicRecords;

export const FALLBACK_PROJECTS: Project[] = catalog.projects.map((item) => ({
  slug: item.slug,
  title: item.title,
  place: item.place,
  year: item.year,
  intro: item.intro,
  body: item.body,
  image: item.image,
  topics: item.topics
    .map((slug) => topicBySlug.get(slug))
    .filter((topic): topic is KitchenTopic => Boolean(topic)),
  brands: item.brands
    .map((slug) => brandBySlug.get(slug))
    .filter((brand): brand is Brand => Boolean(brand)),
  materials: item.materials
    .map((slug) => materialBySlug.get(slug))
    .filter((material): material is Material => Boolean(material)),
  appliances: item.appliances
    .map((slug) => applianceBySlug.get(slug))
    .filter((appliance): appliance is Appliance => Boolean(appliance)),
  regions: item.regions
    .map((slug) => regionBySlug.get(slug))
    .filter((region): region is Region => Boolean(region)),
  specs: item.specs,
}));

export function isKitchenCluster(value: string): value is KitchenClusterSlug {
  return KITCHEN_CLUSTERS.some((cluster) => cluster.slug === value);
}

export function topicsInCluster(
  topics: KitchenTopic[],
  cluster: KitchenClusterSlug,
) {
  return topics
    .filter((topic) => topic.cluster === cluster)
    .sort((left, right) => left.order - right.order);
}

export function projectsForTopic(projects: Project[], topicSlug: string) {
  return projects.filter((project) =>
    project.topics.some((topic) => topic.slug === topicSlug),
  );
}

export function projectsForBrand(projects: Project[], brandSlug: string) {
  return projects.filter((project) =>
    project.brands.some((brand) => brand.slug === brandSlug),
  );
}

export function projectsForRegion(projects: Project[], regionSlug: string) {
  return projects.filter((project) =>
    project.regions.some((region) => region.slug === regionSlug),
  );
}

export function projectsForMaterial(projects: Project[], materialSlug: string) {
  return projects.filter((project) =>
    project.materials.some((material) => material.slug === materialSlug),
  );
}

export function projectsForAppliance(
  projects: Project[],
  applianceSlug: string,
) {
  return projects.filter((project) =>
    project.appliances.some((appliance) => appliance.slug === applianceSlug),
  );
}

export function findBySlug<T extends { slug: string }>(
  items: T[],
  slug: string,
) {
  return items.find((item) => item.slug === slug);
}

export function projectHref(slug: string) {
  return `/projekte/${slug}`;
}
