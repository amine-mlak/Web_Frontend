import {
  FALLBACK_APPLIANCES,
  FALLBACK_ARTICLES,
  FALLBACK_BRANDS,
  FALLBACK_FURNITURE,
  FALLBACK_MATERIALS,
  FALLBACK_PAGES,
  FALLBACK_PROJECTS,
  FALLBACK_REGIONS,
  FALLBACK_TOPICS,
  type Appliance,
  type ApplianceKind,
  type Article,
  type ArticleCategory,
  type Brand,
  type CatalogSpec,
  type Furniture,
  type KitchenClusterSlug,
  type KitchenTopic,
  type Material,
  type MaterialKind,
  type Project,
  type Region,
  type SitePage,
} from "@/lib/catalog";
import {
  flattenCollection,
  flattenEntity,
  strapiGet,
  strapiResponsiveImage,
  type StrapiMedia,
} from "@/lib/strapi";

const LIST_QUERY = {
  "pagination[pageSize]": "100",
  sort: "order:asc",
};

function text(row: Record<string, unknown> | null, key: string, fallback = "") {
  return String(row?.[key] ?? fallback).trim() || fallback;
}

function mediaImage(
  row: Record<string, unknown> | null,
  key: string,
  fallback: string,
) {
  const mapped = strapiResponsiveImage(row?.[key] as StrapiMedia | undefined, {
    srcWidth: 1400,
  });
  return {
    src: mapped.src || fallback,
    srcSet: mapped.srcSet,
  };
}

function related(row: Record<string, unknown> | null, key: string) {
  return flattenCollection(row?.[key]);
}

function mapTopic(entry: unknown): KitchenTopic | null {
  const row = flattenEntity(entry);
  const slug = text(row, "slug");
  const name = text(row, "name");
  const cluster = text(row, "cluster") as KitchenClusterSlug;
  if (!slug || !name || !cluster) {
    return null;
  }
  const image = mediaImage(row, "image", "/kitchens/stile-modern.jpg");
  return {
    slug,
    name,
    cluster,
    hex: text(row, "hex"),
    image: image.src,
    intro: text(row, "intro"),
    order: Number(row?.order ?? 0) || 0,
  };
}

function mapBrand(entry: unknown): Brand | null {
  const row = flattenEntity(entry);
  const slug = text(row, "slug");
  const name = text(row, "name");
  if (!slug || !name) {
    return null;
  }
  const image = mediaImage(row, "image", "/kitchens/stile-insel.jpg");
  return {
    slug,
    name,
    intro: text(row, "intro"),
    body: text(row, "body"),
    order: Number(row?.order ?? 0) || 0,
    image: image.src,
    srcSet: image.srcSet,
  };
}

function mapAppliance(entry: unknown): Appliance | null {
  const row = flattenEntity(entry);
  const slug = text(row, "slug");
  const name = text(row, "name");
  if (!slug || !name) {
    return null;
  }
  const image = mediaImage(row, "image", "/kitchens/stile-modern.jpg");
  return {
    slug,
    name,
    kind: (text(row, "kind", "extra") as ApplianceKind) || "extra",
    intro: text(row, "intro"),
    order: Number(row?.order ?? 0) || 0,
    image: image.src,
    srcSet: image.srcSet,
  };
}

function mapFurniture(entry: unknown): Furniture | null {
  const row = flattenEntity(entry);
  const slug = text(row, "slug");
  const name = text(row, "name");
  if (!slug || !name) {
    return null;
  }
  const image = mediaImage(row, "image", "/kitchens/stile-holz.jpg");
  return {
    slug,
    name,
    kind: text(row, "kind", "wohnen"),
    intro: text(row, "intro"),
    order: Number(row?.order ?? 0) || 0,
    image: image.src,
    srcSet: image.srcSet,
  };
}

function mapRegion(entry: unknown): Region | null {
  const row = flattenEntity(entry);
  const slug = text(row, "slug");
  const name = text(row, "name");
  if (!slug || !name) {
    return null;
  }
  const image = mediaImage(row, "image", "/kitchens/stile-modern.jpg");
  return {
    slug,
    name,
    intro: text(row, "intro"),
    order: Number(row?.order ?? 0) || 0,
    image: image.src,
  };
}

function mapMaterial(entry: unknown): Material | null {
  const row = flattenEntity(entry);
  const slug = text(row, "slug");
  const name = text(row, "name");
  if (!slug || !name) {
    return null;
  }
  const image = mediaImage(row, "image", "/kitchens/stile-holz.jpg");
  return {
    slug,
    name,
    kind: (text(row, "kind", "front") as MaterialKind) || "front",
    intro: text(row, "intro"),
    order: Number(row?.order ?? 0) || 0,
    image: image.src,
    srcSet: image.srcSet,
  };
}

function mapSpecs(row: Record<string, unknown> | null): CatalogSpec[] {
  return flattenCollection(row?.specs)
    .map((item) => ({
      label: text(item, "label"),
      value: text(item, "value"),
    }))
    .filter((item) => item.label && item.value);
}

function mapProject(entry: unknown): Project | null {
  const row = flattenEntity(entry);
  const slug = text(row, "slug");
  const title = text(row, "title");
  if (!slug || !title) {
    return null;
  }
  const image = mediaImage(row, "image", "/kitchens/stile-holz.jpg");
  return {
    slug,
    title,
    place: text(row, "place"),
    year: text(row, "year"),
    intro: text(row, "intro"),
    body: text(row, "body"),
    image: image.src,
    srcSet: image.srcSet,
    topics: related(row, "topics")
      .map(mapTopic)
      .filter((item): item is KitchenTopic => Boolean(item)),
    brands: related(row, "brands")
      .map(mapBrand)
      .filter((item): item is Brand => Boolean(item)),
    materials: related(row, "materials")
      .map(mapMaterial)
      .filter((item): item is Material => Boolean(item)),
    appliances: related(row, "appliances")
      .map(mapAppliance)
      .filter((item): item is Appliance => Boolean(item)),
    regions: related(row, "regions")
      .map(mapRegion)
      .filter((item): item is Region => Boolean(item)),
    specs: mapSpecs(row),
  };
}

function mapCategory(entry: unknown): ArticleCategory | null {
  const row = flattenEntity(entry);
  const name = text(row, "name");
  if (!name) {
    return null;
  }
  return { slug: text(row, "slug") || name.toLowerCase(), name };
}

function mapArticle(entry: unknown): Article | null {
  const row = flattenEntity(entry);
  const title = text(row, "title");
  if (!title) {
    return null;
  }
  const image = mediaImage(row, "cover", "/kitchens/stile-holz.jpg");
  const bodyFromBlocks = flattenCollection(row?.blocks)
    .map((block) => text(block, "body"))
    .filter(Boolean)
    .join("\n\n");
  return {
    slug: text(row, "slug") || title,
    title,
    description: text(row, "description"),
    body: bodyFromBlocks || text(row, "description"),
    image: image.src,
    srcSet: image.srcSet,
    category: mapCategory(row?.category) ?? undefined,
  };
}

function mapPage(entry: unknown): SitePage | null {
  const row = flattenEntity(entry);
  const slug = text(row, "slug");
  const title = text(row, "title");
  if (!slug || !title) {
    return null;
  }
  const image = mediaImage(row, "image", "");
  return {
    slug,
    title,
    eyebrow: text(row, "eyebrow"),
    intro: text(row, "intro"),
    body: text(row, "body"),
    image: image.src,
    srcSet: image.srcSet,
    ctaLabel: text(row, "ctaLabel"),
    ctaUrl: text(row, "ctaUrl"),
  };
}

async function loadMapped<T>(
  path: string,
  query: Record<string, string>,
  map: (entry: unknown) => T | null,
  fallback: T[],
) {
  const payload = await strapiGet<{ data?: unknown }>(path, query);
  const items = flattenCollection(payload?.data)
    .map(map)
    .filter((item): item is T => Boolean(item));
  return items.length > 0 ? items : fallback;
}

const PROJECT_POPULATE = {
  sort: "year:desc",
  "pagination[pageSize]": "100",
  "populate[image]": "true",
  "populate[specs]": "true",
  "populate[topics][populate]": "image",
  "populate[brands][populate]": "image",
  "populate[materials][populate]": "image",
  "populate[appliances][populate]": "image",
  "populate[regions]": "true",
};

export async function fetchKitchenTopics() {
  return loadMapped(
    "/api/kitchen-topics",
    { ...LIST_QUERY, "populate[image]": "true" },
    mapTopic,
    FALLBACK_TOPICS,
  );
}

export async function fetchProjects() {
  return loadMapped(
    "/api/projects",
    PROJECT_POPULATE,
    mapProject,
    FALLBACK_PROJECTS,
  );
}

export async function fetchBrands() {
  return loadMapped(
    "/api/brands",
    { ...LIST_QUERY, "populate[image]": "true" },
    mapBrand,
    FALLBACK_BRANDS,
  );
}

export async function fetchAppliances() {
  return loadMapped(
    "/api/appliances",
    { ...LIST_QUERY, "populate[image]": "true" },
    mapAppliance,
    FALLBACK_APPLIANCES,
  );
}

export async function fetchFurniture() {
  return loadMapped(
    "/api/furniture-items",
    { ...LIST_QUERY, "populate[image]": "true" },
    mapFurniture,
    FALLBACK_FURNITURE,
  );
}

export async function fetchRegions() {
  return loadMapped(
    "/api/regions",
    { ...LIST_QUERY, "populate[image]": "true" },
    mapRegion,
    FALLBACK_REGIONS,
  );
}

export async function fetchMaterials() {
  return loadMapped(
    "/api/materials",
    { ...LIST_QUERY, "populate[image]": "true" },
    mapMaterial,
    FALLBACK_MATERIALS,
  );
}

export async function fetchArticles() {
  return loadMapped(
    "/api/articles",
    {
      sort: "createdAt:desc",
      "pagination[pageSize]": "50",
      "populate[cover]": "true",
      "populate[category]": "true",
      populate: "blocks",
    },
    mapArticle,
    FALLBACK_ARTICLES,
  );
}

export async function fetchSitePages() {
  return loadMapped(
    "/api/site-pages",
    {
      sort: "title:asc",
      "pagination[pageSize]": "50",
      "populate[image]": "true",
    },
    mapPage,
    FALLBACK_PAGES,
  );
}

export async function fetchSitePage(slug: string) {
  const pages = await fetchSitePages();
  return pages.find((page) => page.slug === slug) ?? null;
}

export async function fetchCatalog() {
  const [
    topics,
    projects,
    brands,
    appliances,
    furniture,
    regions,
    materials,
    articles,
    pages,
  ] = await Promise.all([
    fetchKitchenTopics(),
    fetchProjects(),
    fetchBrands(),
    fetchAppliances(),
    fetchFurniture(),
    fetchRegions(),
    fetchMaterials(),
    fetchArticles(),
    fetchSitePages(),
  ]);

  return {
    topics,
    projects,
    brands,
    appliances,
    furniture,
    regions,
    materials,
    articles,
    pages,
  };
}
