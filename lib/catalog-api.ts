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
  articleHref,
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
import { jobFromEntry, jobsFrom } from "@/lib/careers";
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
import { mapSeo, SEO_POPULATE } from "@/lib/cms-seo";
import type { PageBlocks } from "@/lib/page-blocks";
import { PROJECT_CLOSE, type ProjectBlocks, type ProjectSection } from "@/lib/project-blocks";
import legacyRedirects from "@/lib/legacy-redirects.json";

/** Addresses that redirect elsewhere (next.config.ts); an article living at one is never listed. */
const REDIRECTED = new Set(legacyRedirects.redirects.map((redirect) => redirect.source));

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

/**
 * CMS point photos that show a person. The point's detail photo takes their place, because pages with
 * BEER's work show no people. Remove a line once the CMS entry has a new photo.
 */
const POINT_PHOTOS_WITH_PEOPLE = ["moebel_arbeitsplatz_c32e9f15cc"];

/** An optional photo inside a page point; undefined when the CMS has none. */
function pointImage(row: Record<string, unknown>, key: string) {
  const media = row[key] as (StrapiMedia & { alternativeText?: string | null }) | undefined;
  const mapped = strapiResponsiveImage(media, { srcWidth: 1600 });
  return mapped.src ? { src: mapped.src, srcSet: mapped.srcSet, alt: media?.alternativeText?.trim() || "" } : undefined;
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
    seo: mapSeo(seo),
    contentLocale: text(row, "locale"),
    /** Last change in the CMS (sitemap lastModified). */
    updatedAt: text(row, "updatedAt") || undefined,
    stichworte: repeaters(row, "stichworte", (item) => ({
      a: text(item, "wert"),
      b: text(item, "zeile"),
    })).map((item) => ({ wert: item.a, zeile: item.b })),
    punkte: flattenCollection(row?.punkte)
      .map((item) => {
        const bild = pointImage(item, "bild");
        const detailbild = pointImage(item, "detailbild");
        const person = Boolean(bild && POINT_PHOTOS_WITH_PEOPLE.some((file) => bild.src.includes(file)));
        return {
          titel: text(item, "titel"),
          text: text(item, "text"),
          bild: person ? detailbild : bild,
          detailbild: person ? undefined : detailbild,
          linkText: text(item, "linkText") || undefined,
          linkZiel: text(item, "linkZiel") || undefined,
        };
      })
      .filter((item) => item.titel && item.text),
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
    imageAlt: text(flattenEntity(row?.image), "alternativeText"),
    imageCredit: text(flattenEntity(row?.image), "caption"),
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

/**
 * CMS photos that show a person, and the BEER project photo shown in their place. Pages with BEER's
 * work show no people. Remove a line once the CMS entry has a new photo.
 */
const WITHOUT_PEOPLE: Record<string, string> = {
  "moebel_wohnzimmer_27552d17cf.jpg": "grifflose_kuechen_moderne_kuechen_28f8a2078d.jpg",
};

function withoutPeople(image: { src: string; srcSet?: string }) {
  const hit = Object.keys(WITHOUT_PEOPLE).find((file) => image.src.endsWith(`/${file}`));
  if (!hit) {
    return image;
  }
  const swap = (value: string) => value.split(hit).join(WITHOUT_PEOPLE[hit]);
  return { src: swap(image.src), srcSet: image.srcSet ? swap(image.srcSet) : image.srcSet };
}

function mapFurniture(entry: unknown): Furniture | null {
  const row = flattenEntity(entry);
  const slug = text(row, "slug");
  const name = text(row, "name");
  if (!slug || !name) {
    return null;
  }
  const image = withoutPeople(mediaImage(row, "image", stile("stile-holz.jpg")));
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
    imageAlt: text(flattenEntity(row?.image), "alternativeText"),
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

/** One project photo with its description from the media library; undefined when empty. */
function mapFrame(item: unknown): ProjectFrame | undefined {
  if (!item || typeof item !== "object") {
    return undefined;
  }
  const media = item as StrapiMedia & Record<string, unknown>;
  const image = strapiResponsiveImage(media, { srcWidth: 1600 });
  if (!image.src) {
    return undefined;
  }
  // Never a file name ("grifflose küchen_küchen kaufen.jpg"): the page then uses the project title.
  const alt = text(media, "alternativeText") || text(media, "caption");
  const portrait = Boolean(media.width && media.height && media.height > media.width);
  return { src: image.src, srcSet: image.srcSet, alt, ...(portrait ? { portrait } : {}) };
}

function mapGallery(row: Record<string, unknown> | null): ProjectFrame[] {
  return flattenCollection(row?.gallery).flatMap((item) => mapFrame(item) ?? []);
}

/** A text block of the project page (Einleitung or Abschnitt) with its one or two photos. */
function mapSection(item: Record<string, unknown>): ProjectSection | null {
  const photo = mapFrame(item.foto);
  const body = text(item, "text");
  if (!photo || !body) {
    return null;
  }
  return { heading: text(item, "zwischenueberschrift") || undefined, text: body, photo, photo2: mapFrame(item.zweitesFoto) };
}

/** The project's page blocks from the CMS; undefined while the project has none (no title photo). */
function mapProjectBlocks(row: Record<string, unknown> | null, locale: "de" | "en"): ProjectBlocks | undefined {
  const kopf = (row?.kopf ?? null) as Record<string, unknown> | null;
  const titelfoto = mapFrame(kopf?.titelfoto);
  if (!titelfoto) {
    return undefined;
  }
  const schluss = (row?.schluss ?? null) as Record<string, unknown> | null;
  const fallback = PROJECT_CLOSE[locale];
  return {
    source: "cms",
    hero: { photo: titelfoto, detailLeft: mapFrame(kopf?.detailfotoLinks), detailRight: mapFrame(kopf?.detailfotoRechts) },
    facts: flattenCollection(row?.eckdaten)
      .map((item) => ({ label: text(item, "bezeichnung"), value: text(item, "wert") }))
      .filter((item) => item.label && item.value),
    intro: flattenCollection(row?.einleitung).map(mapSection).find(Boolean) ?? undefined,
    sections: flattenCollection(row?.abschnitte).flatMap((item) => mapSection(item) ?? []),
    textOnly: [],
    morePhotos: flattenCollection(row?.weitereFotos).flatMap((item) => mapFrame(item) ?? []),
    similar: flattenCollection(row?.aehnlicheHaeuser).flatMap((item) => {
      const slug = text(flattenEntity(item.haus), "slug");
      return slug ? [slug] : [];
    }),
    close: {
      title: text(schluss, "titel") || fallback.title,
      text: text(schluss, "text") || fallback.text,
      photo: mapFrame(schluss?.foto),
      buttonText: text(schluss, "buttonText") || fallback.buttonText,
      buttonHref: text(schluss, "buttonZiel") || fallback.buttonHref,
    },
  };
}

/** A single (non-repeatable) block of an entry, or null. */
function blockOf(row: Record<string, unknown> | null, key: string): Record<string, unknown> | null {
  const value = row?.[key];
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

/** The slug of a relation inside a block ("kueche", "artikel", "item" …). */
function slugOf(item: Record<string, unknown> | null, key: string) {
  return text(flattenEntity(item?.[key]), "slug");
}

/**
 * The shared page blocks (components seite.*) of an entry; `siblings` names the entry's list of the
 * other pages of its group and the relation inside each item. Undefined while the entry has none.
 */
function mapPageBlocks(
  row: Record<string, unknown> | null,
  siblings?: { field: string; target: string },
): PageBlocks | undefined {
  if (!row) {
    return undefined;
  }
  const blocks: PageBlocks = {};
  const kopf = blockOf(row, "kopf");
  if (kopf && text(kopf, "titel")) {
    blocks.head = {
      title: text(kopf, "titel"),
      emphasis: text(kopf, "betonung"),
      lede: text(kopf, "einleitung"),
      photo: mapFrame(kopf.titelfoto),
      hex: text(kopf, "farbton") || undefined,
    };
  }
  const eckdaten = blockOf(row, "eckdaten");
  const rows = flattenCollection(eckdaten?.zeilen)
    .map((item) => ({ value: text(item, "wert"), label: text(item, "zeile") }))
    .filter((item) => item.value && item.label);
  if (rows.length) {
    blocks.facts = { rows, photo: mapFrame(eckdaten?.foto) };
  }
  const kern = blockOf(row, "kernaussage");
  if (kern && text(kern, "satz")) {
    blocks.statement = {
      text: text(kern, "satz"),
      note: text(kern, "hinweis"),
      points: flattenCollection(kern.punkte)
        .map((item) => ({ title: text(item, "titel"), text: text(item, "text") }))
        .filter((item) => item.title && item.text),
    };
  }
  const zwei = blockOf(row, "zweiFotos");
  if (zwei) {
    blocks.twoPhotos = { left: mapFrame(zwei.fotoLinks), right: mapFrame(zwei.fotoRechts) };
  }
  const lese = blockOf(row, "lesetext");
  if (lese && text(lese, "text")) {
    blocks.reading = { heading: text(lese, "ueberschrift"), text: text(lese, "text") };
  }
  const portraet = blockOf(row, "kuechenPortraet");
  if (portraet) {
    blocks.portraits = {
      title: text(portraet, "titel"),
      items: flattenCollection(portraet.kuechen)
        .map((item) => ({ slug: slugOf(item, "kueche"), photo: mapFrame(item.foto), detail: mapFrame(item.detailfoto) }))
        .filter((item) => item.slug),
    };
  }
  const weitere = blockOf(row, "weitereKuechen");
  if (weitere) {
    blocks.houses = {
      title: text(weitere, "titel"),
      slugs: flattenCollection(weitere.kuechen).map((item) => slugOf(item, "kueche")).filter(Boolean),
    };
  }
  if (text(row, "alleKuechenTitel")) {
    blocks.allHousesTitle = text(row, "alleKuechenTitel");
  }
  if (siblings && Array.isArray(row[siblings.field])) {
    blocks.siblings = flattenCollection(row[siblings.field])
      .map((item) => ({ slug: slugOf(item, siblings.target), photo: mapFrame(item.foto) }))
      .filter((item) => item.slug);
  }
  const ratgeber = blockOf(row, "ratgeber");
  if (ratgeber) {
    blocks.guide = {
      main: slugOf(ratgeber, "artikel") || undefined,
      more: flattenCollection(ratgeber.weitere).map((item) => slugOf(item, "artikel")).filter(Boolean),
    };
  }
  const fragen = blockOf(row, "fragen");
  if (fragen) {
    blocks.questions = {
      title: text(fragen, "titel"),
      theme: slugOf(fragen, "thema") || undefined,
      slugs: flattenCollection(fragen.fragen).map((item) => slugOf(item, "item")).filter(Boolean),
    };
  }
  const schluss = blockOf(row, "schluss");
  if (schluss && text(schluss, "titel")) {
    blocks.close = {
      title: text(schluss, "titel"),
      text: text(schluss, "text"),
      photo: mapFrame(schluss.foto),
      buttonText: text(schluss, "buttonText"),
      buttonHref: text(schluss, "buttonZiel"),
    };
  }
  return Object.keys(blocks).length ? blocks : undefined;
}

/** What to populate for each page block (component seite.*). */
const BLOCK_POPULATE: Record<string, Record<string, string>> = {
  kopf: { "populate[kopf][populate]": "*" },
  eckdaten: { "populate[eckdaten][populate]": "*" },
  kernaussage: { "populate[kernaussage][populate]": "*" },
  zweiFotos: { "populate[zweiFotos][populate]": "*" },
  lesetext: { "populate[lesetext]": "true" },
  kuechenPortraet: {
    "populate[kuechenPortraet][populate][kuechen][populate][kueche][fields][0]": "slug",
    "populate[kuechenPortraet][populate][kuechen][populate][foto]": "true",
    "populate[kuechenPortraet][populate][kuechen][populate][detailfoto]": "true",
  },
  weitereKuechen: { "populate[weitereKuechen][populate][kuechen][populate][kueche][fields][0]": "slug" },
  ratgeber: {
    "populate[ratgeber][populate][artikel][fields][0]": "slug",
    "populate[ratgeber][populate][weitere][populate][artikel][fields][0]": "slug",
  },
  fragen: {
    "populate[fragen][populate][thema][fields][0]": "slug",
    "populate[fragen][populate][fragen][populate][item][fields][0]": "slug",
  },
  schluss: { "populate[schluss][populate]": "*" },
};

/** The populate query for a page with these blocks and this list of other pages of its group. */
function blocksQuery(blocks: string[], siblings?: { field: string; target: string; photo: boolean }) {
  const query: Record<string, string> = {};
  for (const name of blocks) {
    Object.assign(query, BLOCK_POPULATE[name]);
  }
  if (siblings) {
    query[`populate[${siblings.field}][populate][${siblings.target}][fields][0]`] = "slug";
    if (siblings.photo) {
      query[`populate[${siblings.field}][populate][foto]`] = "true";
    }
  }
  return query;
}

/** The five Küchen collections (one per group), each with its blocks in page order. */
const KUECHEN: {
  path: string;
  /** The project's picker for this group. */
  projectField: string;
  cluster: KitchenClusterSlug;
  blocks: string[];
  siblings: { field: string; target: string; photo: boolean };
}[] = [
  {
    path: "/api/kuechen-formen",
    projectField: "formen",
    cluster: "formen",
    blocks: ["kopf", "kernaussage", "lesetext", "kuechenPortraet", "weitereKuechen", "ratgeber", "fragen", "schluss"],
    siblings: { field: "weitereFormen", target: "form", photo: false },
  },
  {
    path: "/api/kuechen-stile",
    projectField: "stile",
    cluster: "stile",
    blocks: ["kopf", "eckdaten", "kernaussage", "zweiFotos", "lesetext", "kuechenPortraet", "weitereKuechen", "ratgeber", "fragen", "schluss"],
    siblings: { field: "weitereStile", target: "stil", photo: false },
  },
  {
    path: "/api/kuechen-farben",
    projectField: "farben",
    cluster: "farben",
    blocks: ["kopf", "kuechenPortraet", "kernaussage", "lesetext", "ratgeber", "fragen", "schluss"],
    siblings: { field: "weitereFarben", target: "farbe", photo: true },
  },
  {
    path: "/api/kuechen-inseln",
    projectField: "inseln",
    cluster: "inseln",
    blocks: ["kopf", "kernaussage", "lesetext", "kuechenPortraet", "weitereKuechen", "ratgeber", "fragen", "schluss"],
    siblings: { field: "weitereInseln", target: "insel", photo: true },
  },
  {
    path: "/api/kuechen-loesungen",
    projectField: "loesungen",
    cluster: "besondere",
    blocks: ["kopf", "eckdaten", "kernaussage", "kuechenPortraet", "weitereKuechen", "lesetext", "ratgeber", "fragen", "schluss"],
    siblings: { field: "weitereLoesungen", target: "loesung", photo: true },
  },
];

/**
 * A page of a Küchen collection as a KitchenTopic. The old flat fields are filled from the blocks,
 * so pages that still read them (group overviews, cards) show the same words.
 */
function mapKuechen(entry: unknown, cluster: KitchenClusterSlug, siblings?: { field: string; target: string }): KitchenTopic | null {
  const row = flattenEntity(entry);
  const slug = text(row, "slug");
  const name = text(row, "name");
  if (!slug || !name) {
    return null;
  }
  const blocks = mapPageBlocks(row, siblings);
  const image = mediaImage(row, "kachelfoto", stile("stile-modern.jpg"));
  const seo = blockOf(row, "seo");
  return {
    slug,
    name,
    cluster,
    hex: blocks?.head?.hex ?? "",
    image: image.src,
    intro: blocks?.head?.lede ?? "",
    order: Number(row?.reihenfolge ?? 0) || 0,
    seitentitel: blocks?.head?.title ?? "",
    betonung: blocks?.head?.emphasis ?? "",
    aussage: blocks?.statement?.text ?? "",
    hinweis: blocks?.statement?.note ?? "",
    punkte: (blocks?.statement?.points ?? []).map((point) => ({ titel: point.title, text: point.text })),
    stichworte: (blocks?.facts?.rows ?? []).map((fact) => ({ wert: fact.value, zeile: fact.label })),
    ueberschrift: blocks?.reading?.heading ?? "",
    lesetext: blocks?.reading?.text ?? "",
    schlussTitel: blocks?.close?.title ?? "",
    schlussText: blocks?.close?.text ?? "",
    seoTitle: seo ? text(seo, "metaTitle") : "",
    seoDescription: seo ? text(seo, "metaDescription") : "",
    seo: mapSeo(seo),
    contentLocale: text(row, "locale"),
    updatedAt: text(row, "updatedAt") || undefined,
    blocks,
  };
}

/** A project's topics from its five pickers (Form, Stil, Farbe, Insel, Besonderes); empty if none set. */
function projectKuechen(row: Record<string, unknown> | null): KitchenTopic[] {
  return KUECHEN.flatMap((spec) =>
    related(row, spec.projectField).flatMap((item) => {
      const slug = text(item, "slug");
      const name = text(item, "name");
      if (!slug || !name) {
        return [];
      }
      const image = mediaImage(item, "kachelfoto", stile("stile-modern.jpg"));
      return [{ slug, name, cluster: spec.cluster, hex: "", image: image.src, intro: "", order: Number(item.reihenfolge ?? 0) || 0 }];
    }),
  );
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
    // The five pickers once they are set; the old topic list until then.
    topics: projectKuechen(row).length
      ? projectKuechen(row)
      : related(row, "topics")
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
    blocks: mapProjectBlocks(row, copy.contentLocale === "en" ? "en" : "de"),
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
  const cover = row?.cover as { width?: number; height?: number } | null | undefined;
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
    portrait: Boolean(cover?.width && cover?.height && cover.height > cover.width),
    category: mapCategory(row?.category) ?? undefined,
    blocks,
    seo: mapSeo(row?.seo),
    contentLocale: text(row, "locale"),
    // "Erschienen am" when set (the beer.de posts keep their original date), else the publish time.
    publishedAt: text(row, "erschienenAm") || text(row, "publishedAt") || undefined,
    updatedAt: text(row, "updatedAt") || undefined,
    originalDate: Boolean(text(row, "erschienenAm")),
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
    imageAlt: text(flattenEntity(row.image), "alternativeText"),
    imageCredit: text(flattenEntity(row.image), "caption"),
    ctaLabel: text(row, "ctaLabel"),
    ctaUrl: text(row, "ctaUrl"),
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
  // Then the order the projects were created in: it stays put when a project is published again
  // (publishing gives the entry a new id, so sorting by id moved it to the end).
  "sort[0]": "year:desc",
  "sort[1]": "createdAt:asc",
  "sort[2]": "id:asc",
  "populate[image]": "true",
  "populate[gallery]": "true",
  "populate[specs]": "true",
  "populate[topics][populate]": "image",
  "populate[formen][populate]": "kachelfoto",
  "populate[stile][populate]": "kachelfoto",
  "populate[farben][populate]": "kachelfoto",
  "populate[inseln][populate]": "kachelfoto",
  "populate[loesungen][populate]": "kachelfoto",
  "populate[brands][populate]": "image",
  "populate[materials][populate]": "image",
  "populate[appliances][populate]": "image",
  "populate[regions][populate]": "image",
  ...SEO_POPULATE,
  // The page blocks (lib/project-blocks.ts).
  "populate[kopf][populate]": "*",
  "populate[eckdaten]": "true",
  "populate[einleitung][populate]": "*",
  "populate[abschnitte][populate]": "*",
  "populate[weitereFotos]": "true",
  "populate[aehnlicheHaeuser][populate][haus][fields][0]": "slug",
  "populate[schluss][populate]": "*",
};

const SEO_QUERY = {
  ...SEO_POPULATE,
  "populate[stichworte]": "true",
  "populate[punkte]": "true",
};

const CLUSTER_RANK: KitchenClusterSlug[] = ["formen", "stile", "farben", "inseln", "besondere"];

/**
 * Every Küchen page: from the five Küchen collections once they hold pages, from the old
 * Küchenthemen collection until then.
 */
export async function fetchKitchenTopics() {
  const lists = await Promise.all(
    KUECHEN.map((spec) =>
      loadMapped(
        spec.path,
        {
          "pagination[pageSize]": "100",
          sort: "reihenfolge:asc",
          "populate[kachelfoto]": "true",
          ...SEO_POPULATE,
          ...blocksQuery(spec.blocks, spec.siblings),
        },
        (entry) => mapKuechen(entry, spec.cluster, spec.siblings),
        [] as KitchenTopic[],
      ),
    ),
  );
  const topics = lists.flat();
  if (topics.length) {
    return topics.sort(
      (a, b) => a.order - b.order || CLUSTER_RANK.indexOf(a.cluster) - CLUSTER_RANK.indexOf(b.cluster),
    );
  }
  return loadMapped(
    "/api/kitchen-topics",
    {
      ...LIST_QUERY,
      "populate[image]": "true",
      ...SEO_POPULATE,
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
    // Old fields and blocks together carry every photo twice: smaller pages stay under 2 MB.
    10,
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
  // Points carry a photo, a detail photo and a link: each one is a room on the furniture page.
  const query: Record<string, string> = { ...LIST_QUERY, ...SEO_QUERY, "populate[image]": "true" };
  delete query["populate[punkte]"];
  query["populate[punkte][populate]"] = "*";
  return loadMapped(
    "/api/furniture-items",
    query,
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
      ...SEO_POPULATE,
    },
    mapArticle,
    FALLBACK_ARTICLES,
    20,
  ).then((all) => all.filter((item) => !REDIRECTED.has(articleHref(item))));
  // Newest first by the date the text appeared, not by when it was entered into the CMS.
  items.sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
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
      ...SEO_POPULATE,
      "populate[stichworte]": "true",
      // Points may carry a photo, a detail photo and a link (Innenleben shows each as a section).
      "populate[punkte][populate]": "*",
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

/** Open positions from "Stellen"; the Karriere page's old list only while none is published. */
export async function fetchOpenJobs(page?: SitePage | null) {
  const jobs = await loadMapped(
    "/api/jobs",
    { "sort[0]": "reihenfolge:asc", "sort[1]": "title:asc", "pagination[pageSize]": "100", ...SEO_POPULATE },
    (entry) => jobFromEntry(entry as Parameters<typeof jobFromEntry>[0]),
    [],
  );
  return jobs.length ? jobs : jobsFrom(page?.punkte);
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
