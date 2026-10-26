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
  isPressArticle,
  type Appliance,
  type ApplianceKind,
  type Article,
  type ArticleBlock,
  type ArticleCategory,
  type Brand,
  type CatalogSpec,
  type Furniture,
  type KitchenClusterSlug,
  type KitchenTopic,
  type Material,
  type MaterialKind,
  type Project,
  type ProjectFrame,
  type Region,
  type SitePage,
} from "@/lib/catalog";
import { CMS_NAMED } from "@/lib/cms-photos";
import {
  enrichProjectBody,
  projectGalleryFor,
} from "@/lib/project-photos";
import {
  flattenCollection,
  flattenEntity,
  resolveFaqBlock,
  strapiGet,
  strapiResponsiveImage,
  type StrapiMedia,
} from "@/lib/strapi";

function stile(file: string) {
  return CMS_NAMED[file] || `/kitchens/${file}`;
}

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

function repeaters(
  row: Record<string, unknown> | null,
  key: string,
  map: (item: Record<string, unknown>) => { a: string; b: string },
) {
  return flattenCollection(row?.[key])
    .map((item) => map(item))
    .filter((item) => item.a && item.b);
}

function pageFields(row: Record<string, unknown> | null) {
  const seo =
    row?.seo && typeof row.seo === "object"
      ? (row.seo as Record<string, unknown>)
      : null;
  return {
    ueberschrift: text(row, "ueberschrift"),
    lesetext: text(row, "lesetext"),
    seitentitel: text(row, "seitentitel"),
    betonung: text(row, "betonung"),
    aussage: text(row, "aussage"),
    hinweis: text(row, "hinweis"),
    zitat: text(row, "zitat"),
    zitatQuelle: text(row, "zitatQuelle"),
    schlussTitel: text(row, "schlussTitel"),
    schlussText: text(row, "schlussText"),
    seoTitle: seo ? text(seo, "metaTitle") : "",
    seoDescription: seo ? text(seo, "metaDescription") : "",
    contentLocale: text(row, "locale"),
    stichworte: repeaters(row, "stichworte", (item) => ({
      a: text(item, "wert"),
      b: text(item, "zeile"),
    })).map((item) => ({ wert: item.a, zeile: item.b })),
    punkte: repeaters(row, "punkte", (item) => ({
      a: text(item, "titel"),
      b: text(item, "text"),
    })).map((item) => ({ titel: item.a, text: item.b })),
  };
}

function mapTopic(entry: unknown): KitchenTopic | null {
  const row = flattenEntity(entry);
  const slug = text(row, "slug");
  const name = text(row, "name");
  const cluster = text(row, "cluster") as KitchenClusterSlug;
  if (!slug || !name || !cluster) {
    return null;
  }
  const image = mediaImage(row, "image", stile("stile-modern.jpg"));
  return {
    slug,
    name,
    cluster,
    hex: text(row, "hex"),
    image: image.src,
    intro: text(row, "intro"),
    order: Number(row?.order ?? 0) || 0,
    ...pageFields(row),
  };
}

function mapBrand(entry: unknown): Brand | null {
  const row = flattenEntity(entry);
  const slug = text(row, "slug");
  const name = text(row, "name");
  if (!slug || !name) {
    return null;
  }
  const image = mediaImage(row, "image", stile("stile-insel.jpg"));
  return {
    slug,
    name,
    intro: text(row, "intro"),
    body: text(row, "body"),
    order: Number(row?.order ?? 0) || 0,
    image: image.src,
    srcSet: image.srcSet,
    ...pageFields(row),
  };
}

function mapAppliance(entry: unknown): Appliance | null {
  const row = flattenEntity(entry);
  const slug = text(row, "slug");
  const name = text(row, "name");
  if (!slug || !name) {
    return null;
  }
  const image = mediaImage(row, "image", stile("stile-modern.jpg"));
  return {
    slug,
    name,
    kind: (text(row, "kind", "extra") as ApplianceKind) || "extra",
    intro: text(row, "intro"),
    order: Number(row?.order ?? 0) || 0,
    image: image.src,
    srcSet: image.srcSet,
    ...pageFields(row),
  };
}

function mapFurniture(entry: unknown): Furniture | null {
  const row = flattenEntity(entry);
  const slug = text(row, "slug");
  const name = text(row, "name");
  if (!slug || !name) {
    return null;
  }
  const image = mediaImage(row, "image", stile("stile-holz.jpg"));
  return {
    slug,
    name,
    kind: text(row, "kind", "wohnen"),
    intro: text(row, "intro"),
    order: Number(row?.order ?? 0) || 0,
    image: image.src,
    srcSet: image.srcSet,
    ...pageFields(row),
  };
}

function mapRegion(entry: unknown): Region | null {
  const row = flattenEntity(entry);
  const slug = text(row, "slug");
  const name = text(row, "name");
  if (!slug || !name) {
    return null;
  }
  const image = mediaImage(row, "image", stile("stile-modern.jpg"));
  return {
    slug,
    name,
    intro: text(row, "intro"),
    order: Number(row?.order ?? 0) || 0,
    image: image.src,
    ...pageFields(row),
  };
}

function mapMaterial(entry: unknown): Material | null {
  const row = flattenEntity(entry);
  const slug = text(row, "slug");
  const name = text(row, "name");
  if (!slug || !name) {
    return null;
  }
  const image = mediaImage(row, "image", stile("stile-holz.jpg"));
  return {
    slug,
    name,
    kind: (text(row, "kind", "front") as MaterialKind) || "front",
    intro: text(row, "intro"),
    order: Number(row?.order ?? 0) || 0,
    image: image.src,
    srcSet: image.srcSet,
    ...pageFields(row),
  };
}

function mapGallery(row: Record<string, unknown> | null): ProjectFrame[] {
  return flattenCollection(row?.gallery).flatMap((item): ProjectFrame[] => {
    const image = strapiResponsiveImage(item as StrapiMedia, { srcWidth: 1600 });
    if (!image.src) {
      return [];
    }
    // Never a file name ("grifflose küchen_küchen kaufen.jpg"): the page then uses the project title.
    const alt = text(item, "alternativeText") || text(item, "caption");
    return [{ src: image.src, srcSet: image.srcSet, alt }];
  });
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
  const image = mediaImage(row, "image", stile("stile-holz.jpg"));
  const copy = pageFields(row);
  const body = enrichProjectBody(slug, copy.lesetext || text(row, "body"));
  return {
    slug,
    title,
    place: text(row, "place"),
    year: text(row, "year"),
    intro: text(row, "intro"),
    body,
    ...copy,
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
    gallery: projectGalleryFor(slug, mapGallery(row)),
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

function articleImage(media: unknown, title: string): ArticleBlock | null {
  const file = media as StrapiMedia | undefined;
  const mapped = strapiResponsiveImage(file, { srcWidth: 1400 });
  if (!mapped.src) {
    return null;
  }
  return { kind: "image", src: mapped.src, srcSet: mapped.srcSet, alt: file?.alternativeText || title };
}

/** The dynamic zone "blocks" in editor order: text, quote, single image, slider. */
function mapArticleBlocks(row: Record<string, unknown> | null, title: string): ArticleBlock[] {
  const blocks: ArticleBlock[] = [];
  for (const block of flattenCollection(row?.blocks)) {
    const component = text(block, "__component");
    if (component === "shared.rich-text" && text(block, "body")) {
      blocks.push({ kind: "text", body: text(block, "body") });
    } else if (component === "shared.quote" && text(block, "body")) {
      blocks.push({ kind: "quote", body: text(block, "body"), by: text(block, "title") || undefined });
    } else if (component === "shared.media") {
      const image = articleImage(block.file, title);
      if (image) blocks.push(image);
    } else if (component === "shared.slider") {
      for (const file of Array.isArray(block.files) ? block.files : []) {
        const image = articleImage(file, title);
        if (image) blocks.push(image);
      }
    }
  }
  return blocks;
}

function mapArticle(entry: unknown): Article | null {
  const row = flattenEntity(entry);
  const title = text(row, "title");
  if (!title) {
    return null;
  }
  const image = mediaImage(row, "cover", stile("stile-holz.jpg"));
  const blocks = mapArticleBlocks(row, title);
  const bodyFromBlocks = blocks
    .flatMap((block) => (block.kind === "text" ? [block.body] : []))
    .join("\n\n");
  return {
    slug: text(row, "slug") || title,
    title,
    description: text(row, "description"),
    body: bodyFromBlocks || text(row, "description"),
    image: image.src,
    srcSet: image.srcSet,
    category: mapCategory(row?.category) ?? undefined,
    blocks,
    publishedAt: text(row, "publishedAt") || undefined,
    updatedAt: text(row, "updatedAt") || undefined,
  };
}

async function mapPage(entry: unknown): Promise<SitePage | null> {
  const row = flattenEntity(entry);
  if (!row) {
    return null;
  }
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
    updatedAt: text(row, "updatedAt") || undefined,
    ...pageFields(row),
    faq: await resolveFaqBlock(row.faq),
  };
}

// Next.js only caches fetch responses up to 2 MB; a bigger response is fetched again on
// every request and the cache keeps serving an old copy. Collections with heavy media
// (projects with galleries) are therefore loaded page by page.
async function loadPages(
  path: string,
  query: Record<string, string>,
  pageSize: number,
): Promise<unknown[]> {
  const page = (n: number) =>
    strapiGet<{ data?: unknown; meta?: { pagination?: { pageCount?: number } } }>(path, {
      ...query,
      "pagination[page]": String(n),
      "pagination[pageSize]": String(pageSize),
    });
  const first = await page(1);
  const pageCount = first?.meta?.pagination?.pageCount ?? 1;
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, pageCount - 1) }, (_, i) => page(i + 2)),
  );
  return [first, ...rest].flatMap((payload) => flattenCollection(payload?.data));
}

async function loadMapped<T>(
  path: string,
  query: Record<string, string>,
  map: (entry: unknown) => T | null | Promise<T | null>,
  fallback: T[],
  pageSize?: number,
): Promise<T[]> {
  const entries = pageSize
    ? await loadPages(path, query, pageSize)
    : flattenCollection((await strapiGet<{ data?: unknown }>(path, query))?.data);
  const mapped = await Promise.all(entries.map((entry) => map(entry)));
  const items: T[] = [];
  for (const item of mapped) {
    if (item) {
      items.push(item);
    }
  }
  return items.length > 0 ? items : fallback;
}

const PROJECT_POPULATE = {
  // Second key keeps the order stable across pages when years are equal or empty.
  "sort[0]": "year:desc",
  "sort[1]": "id:asc",
  "populate[image]": "true",
  "populate[gallery]": "true",
  "populate[specs]": "true",
  "populate[topics][populate]": "image",
  "populate[brands][populate]": "image",
  "populate[materials][populate]": "image",
  "populate[appliances][populate]": "image",
  "populate[regions]": "true",
  "populate[seo]": "true",
};

const SEO_QUERY = {
  "populate[seo]": "true",
  "populate[stichworte]": "true",
  "populate[punkte]": "true",
};

export async function fetchKitchenTopics() {
  return loadMapped(
    "/api/kitchen-topics",
    {
      ...LIST_QUERY,
      "populate[image]": "true",
      "populate[seo]": "true",
      "populate[stichworte]": "true",
      "populate[punkte]": "true",
    },
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
    20,
  );
}

export async function fetchBrands() {
  return loadMapped(
    "/api/brands",
    { ...LIST_QUERY, ...SEO_QUERY, "populate[image]": "true" },
    mapBrand,
    FALLBACK_BRANDS,
  );
}

export async function fetchAppliances() {
  return loadMapped(
    "/api/appliances",
    { ...LIST_QUERY, ...SEO_QUERY, "populate[image]": "true" },
    mapAppliance,
    FALLBACK_APPLIANCES,
  );
}

export async function fetchFurniture() {
  return loadMapped(
    "/api/furniture-items",
    { ...LIST_QUERY, ...SEO_QUERY, "populate[image]": "true" },
    mapFurniture,
    FALLBACK_FURNITURE,
  );
}

export async function fetchRegions() {
  return loadMapped(
    "/api/regions",
    { ...LIST_QUERY, ...SEO_QUERY, "populate[image]": "true" },
    mapRegion,
    FALLBACK_REGIONS,
  );
}

export async function fetchMaterials() {
  return loadMapped(
    "/api/materials",
    { ...LIST_QUERY, ...SEO_QUERY, "populate[image]": "true" },
    mapMaterial,
    FALLBACK_MATERIALS,
  );
}

export async function fetchArticles() {
  const items = await loadMapped(
    "/api/articles",
    {
      // Second key keeps the order stable across pages.
      "sort[0]": "createdAt:desc",
      "sort[1]": "id:asc",
      "populate[cover]": "true",
      "populate[category]": "true",
      "populate[blocks][populate]": "*",
    },
    mapArticle,
    FALLBACK_ARTICLES,
    20,
  );
  if (items.some(isPressArticle)) {
    return items;
  }
  const seen = new Set(items.map((item) => item.slug));
  return [
    ...items,
    ...FALLBACK_ARTICLES.filter(
      (item) => isPressArticle(item) && !seen.has(item.slug),
    ),
  ];
}

export async function fetchSitePages() {
  return loadMapped(
    "/api/site-pages",
    {
      sort: "title:asc",
      "pagination[pageSize]": "50",
      "populate[image]": "true",
      "populate[stichworte]": "true",
      "populate[punkte]": "true",
      "populate[faq][populate][theme]": "true",
      "populate[faq][populate][questions][populate]": "item",
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
