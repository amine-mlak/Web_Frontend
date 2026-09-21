import { draftMode } from "next/headers";
import {
  FALLBACK_FAQ_ITEMS,
  FALLBACK_FAQ_THEMES,
  homeFaqItems,
  type FaqEntry,
  type FaqTheme,
} from "@/lib/faq";
import { menuPanels, type MenuPanel } from "@/lib/navigation";

const FALLBACK_STRAPI_URL =
  "http://strapi-2p2cktq4f2aqoklpusgyfdqt.217.160.8.26.sslip.io";

export const STRAPI_URL = (
  process.env.STRAPI_URL ??
  process.env.NEXT_PUBLIC_STRAPI_URL ??
  FALLBACK_STRAPI_URL
).replace(/\/$/, "");

const STRAPI_HOST = new URL(STRAPI_URL).hostname;
const CMS_UPLOAD_PREFIX = "/cms-uploads";
const CMS_OPT_PREFIX = "/cms-opt";
const OPT_WIDTHS = [1280, 1600, 1920, 2560, 3840];

const FETCH_TIMEOUT_MS = 4000;
const REVALIDATE_SECONDS = 120;

export type HeroSlide = {
  src: string;
  srcSet?: string;
  alt: string;
};

export type KachelTile = {
  title: string;
  href: string;
  image: string;
  srcSet?: string;
  alt: string;
  color: string;
};

export type KachelnContent = {
  eyebrow: string;
  intro: string;
  colors: KachelTile[];
};

export type EntdeckenPanel = {
  title: string;
  subtitle: string;
  buttonLabel: string;
  href: string;
  image: string;
  srcSet?: string;
  alt: string;
};

export type EntdeckenContent = {
  panels: EntdeckenPanel[];
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqContent = {
  eyebrow: string;
  title: string;
  items: FaqItem[];
};

export type { FaqEntry, FaqTheme };

export type ProcessIcon = "consult" | "plan" | "factory" | "handover";

export type ProcessContent = {
  eyebrow: string;
  title: string;
  buttonLabel: string;
  buttonHref: string;
  steps: {
    step: string;
    title: string;
    description: string;
    icon: ProcessIcon;
  }[];
};

export type BeratungContent = {
  eyebrow: string;
  title: string;
  intro: string;
  company: string;
  street: string;
  city: string;
  phoneLabel: string;
  phoneHref: string;
  email: string;
};

export type HomeCms = {
  title?: string;
  slug?: string;
  heroSlides: HeroSlide[];
  kacheln: KachelnContent | null;
  entdecken: EntdeckenContent | null;
  faq: FaqContent | null;
  ablauf: ProcessContent | null;
  beratung: BeratungContent | null;
};

type StrapiFormat = {
  url?: string;
  width?: number;
};

export type StrapiMedia = {
  url?: string;
  width?: number;
  formats?: {
    large?: StrapiFormat;
    medium?: StrapiFormat;
    small?: StrapiFormat;
  };
};

type StrapiHeroSlide = {
  alt?: string;
  image?: StrapiMedia;
};

type StrapiColorTile = {
  title?: string;
  href?: string;
  alt?: string;
  color?: string;
  image?: StrapiMedia;
};

type StrapiDiscoverPanel = {
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
  href?: string;
  alt?: string;
  image?: StrapiMedia;
};

type StrapiFaqItem = {
  question?: string;
  answer?: string;
};

type StrapiLandingEntry = {
  title?: string;
  slug?: string;
  hero?: { slides?: StrapiHeroSlide[] };
  kacheln?: {
    eyebrow?: string;
    intro?: string;
    colors?: StrapiColorTile[];
  };
  ablauf?: {
    eyebrow?: string;
    title?: string;
    buttonLabel?: string;
    buttonHref?: string;
    steps?: {
      step?: string;
      title?: string;
      description?: string;
      icon?: string;
    }[];
  };
  entdecken?: { panels?: StrapiDiscoverPanel[] };
  faq?: {
    eyebrow?: string;
    title?: string;
    items?: StrapiFaqItem[];
  };
  beratung?: {
    eyebrow?: string;
    title?: string;
    intro?: string;
    company?: string;
    street?: string;
    city?: string;
    phoneLabel?: string;
    phoneHref?: string;
    email?: string;
  };
};

type StrapiLandingResponse = {
  data?: StrapiLandingEntry | StrapiLandingEntry[] | null;
};

type ImageSize = "large" | "medium" | "small" | "original";

export function strapiMediaUrl(url?: string | null) {
  if (!url) {
    return "";
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    try {
      const parsed = new URL(url);
      if (
        parsed.hostname === STRAPI_HOST &&
        parsed.pathname.startsWith("/uploads/")
      ) {
        return `${CMS_UPLOAD_PREFIX}${parsed.pathname.slice("/uploads".length)}`;
      }
    } catch {
      return url;
    }

    return url;
  }

  if (url.startsWith("/uploads/")) {
    return `${CMS_UPLOAD_PREFIX}${url.slice("/uploads".length)}`;
  }

  return `${STRAPI_URL}${url}`;
}

export function strapiImageUrl(
  image?: StrapiMedia | null,
  size: ImageSize = "large",
) {
  if (size === "original") {
    return strapiMediaUrl(image?.url);
  }

  const url =
    image?.formats?.[size]?.url ??
    image?.formats?.large?.url ??
    image?.formats?.medium?.url ??
    image?.formats?.small?.url ??
    image?.url;

  return strapiMediaUrl(url);
}

function cmsOptUrl(originalUrl: string, width: number) {
  if (!originalUrl.startsWith(`${CMS_UPLOAD_PREFIX}/`)) {
    return "";
  }

  return `${CMS_OPT_PREFIX}/${width}/${originalUrl.slice(CMS_UPLOAD_PREFIX.length + 1)}`;
}

export function strapiResponsiveImage(
  image?: StrapiMedia | null,
  options?: { srcWidth?: number },
) {
  const srcWidth = options?.srcWidth ?? 1920;
  const originalUrl = strapiMediaUrl(image?.url);
  const originalWidth = image?.width;
  const candidates: { url: string; width: number }[] = [];
  const add = (url?: string, width?: number, fallbackWidth?: number) => {
    const mapped = url?.startsWith("/") || url?.startsWith("http")
      ? url
      : strapiMediaUrl(url);
    const resolvedWidth = width || fallbackWidth;
    if (!mapped || !resolvedWidth) {
      return;
    }
    if (candidates.some((item) => item.url === mapped)) {
      return;
    }
    candidates.push({ url: mapped, width: resolvedWidth });
  };

  add(strapiMediaUrl(image?.formats?.small?.url), image?.formats?.small?.width, 500);
  add(strapiMediaUrl(image?.formats?.medium?.url), image?.formats?.medium?.width, 750);
  add(strapiMediaUrl(image?.formats?.large?.url), image?.formats?.large?.width, 1000);

  if (originalUrl && originalWidth) {
    if (originalWidth <= 1920) {
      add(originalUrl, originalWidth);
    } else {
      for (const width of OPT_WIDTHS) {
        if (width <= originalWidth) {
          add(cmsOptUrl(originalUrl, width), width);
        }
      }
    }
  }

  candidates.sort((left, right) => left.width - right.width);

  const preferred =
    candidates.find((item) => item.width >= srcWidth) ?? candidates.at(-1);
  const src = preferred?.url || "";

  if (!src) {
    return { src: "", srcSet: undefined as string | undefined };
  }

  return {
    src,
    srcSet:
      candidates.length > 1
        ? candidates.map((item) => `${item.url} ${item.width}w`).join(", ")
        : undefined,
  };
}

async function previewDraftEnabled() {
  try {
    const { isEnabled } = await draftMode();
    return isEnabled;
  } catch {
    return false;
  }
}

async function fetchStrapi(path: string, query: Record<string, string>, preview: boolean) {
  const url = new URL(path, `${STRAPI_URL}/`);
  for (const [key, value] of Object.entries(query)) {
    url.searchParams.set(key, value);
  }
  if (preview) {
    url.searchParams.set("status", "draft");
  }

  const headers: Record<string, string> = {};
  if (preview && process.env.STRAPI_API_TOKEN) {
    headers.Authorization = `Bearer ${process.env.STRAPI_API_TOKEN}`;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    return await fetch(url, {
      headers,
      signal: controller.signal,
      ...(preview
        ? { cache: "no-store" as const }
        : { next: { revalidate: REVALIDATE_SECONDS, tags: ["strapi"] } }),
    });
  } finally {
    clearTimeout(timer);
  }
}

export async function strapiGet<T>(path: string, query: Record<string, string> = {}) {
  const preview = await previewDraftEnabled();

  try {
    let response = await fetchStrapi(path, query, preview);
    if (preview && !response.ok) {
      response = await fetchStrapi(path, query, false);
    }

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function isHexColor(value: string) {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value);
}

function mapHeroSlides(slides?: StrapiHeroSlide[]): HeroSlide[] {
  return (slides ?? [])
    .map((slide) => {
      const image = strapiResponsiveImage(slide.image, { srcWidth: 2560 });
      return {
        src: image.src,
        srcSet: image.srcSet,
        alt: slide.alt?.trim() || "",
      };
    })
    .filter((slide) => slide.src);
}

function mapKachelnContent(data?: {
  eyebrow?: string;
  intro?: string;
  colors?: StrapiColorTile[];
} | null): KachelnContent | null {
  if (!data) {
    return null;
  }

  const colors = (data.colors ?? [])
    .map((tile) => {
      const image = strapiResponsiveImage(tile.image, { srcWidth: 1600 });
      return {
        title: tile.title?.trim() || "",
        href: tile.href?.trim() || "#kacheln",
        image: image.src,
        srcSet: image.srcSet,
        alt: tile.alt?.trim() || tile.title?.trim() || "",
        color: tile.color?.trim() || "",
      };
    })
    .filter((tile) => tile.title && tile.image && isHexColor(tile.color));

  if (colors.length === 0) {
    return null;
  }

  return {
    eyebrow: data.eyebrow?.trim() || "Die Kacheln · Geteilte Bildtafeln",
    intro:
      data.intro?.trim() ||
      "Keine Liste – Tafeln. Zur Hälfte das Projekt, zur Hälfte Material und Farbe. So wird die Wahl der Küchenfarbe zum Erlebnis.",
    colors,
  };
}

function mapEntdeckenContent(
  panels?: StrapiDiscoverPanel[],
): EntdeckenContent | null {
  const mapped = (panels ?? [])
    .map((panel) => {
      const image = strapiResponsiveImage(panel.image, { srcWidth: 1600 });
      return {
        title: panel.title?.trim() || "",
        subtitle: panel.subtitle?.trim() || "",
        buttonLabel: panel.buttonLabel?.trim() || "Entdecken",
        href: panel.href?.trim() || "#entdecken",
        image: image.src,
        srcSet: image.srcSet,
        alt: panel.alt?.trim() || panel.title?.trim() || "",
      };
    })
    .filter((panel) => panel.title && panel.subtitle);

  return mapped.length > 0 ? { panels: mapped } : null;
}

function mapFaqContent(data?: {
  eyebrow?: string;
  title?: string;
  items?: StrapiFaqItem[];
} | null): FaqContent | null {
  if (!data) {
    return null;
  }

  const items = (data.items ?? [])
    .map((item) => ({
      question: item.question?.trim() || "",
      answer: item.answer?.trim() || "",
    }))
    .filter((item) => item.question && item.answer);

  if (items.length === 0) {
    return null;
  }

  return {
    eyebrow: data.eyebrow?.trim() || "Fragen",
    title: data.title?.trim() || "Bevor wir uns sehen",
    items,
  };
}

const PROCESS_ICONS: ProcessIcon[] = ["consult", "plan", "factory", "handover"];

function mapProcessContent(data?: {
  eyebrow?: string;
  title?: string;
  buttonLabel?: string;
  buttonHref?: string;
  steps?: {
    step?: string;
    title?: string;
    description?: string;
    icon?: string;
  }[];
} | null): ProcessContent | null {
  if (!data) {
    return null;
  }

  const steps = (data.steps ?? [])
    .map((item) => ({
      step: item.step?.trim() || "",
      title: item.title?.trim() || "",
      description: item.description?.trim() || "",
      icon: PROCESS_ICONS.includes(item.icon as ProcessIcon)
        ? (item.icon as ProcessIcon)
        : "consult",
    }))
    .filter((item) => item.step && item.title && item.description);

  if (steps.length === 0) {
    return null;
  }

  return {
    eyebrow: data.eyebrow?.trim() || "Der Weg zur Küche",
    title: data.title?.trim() || "Von der ersten Idee bis zur Übergabe",
    buttonLabel: data.buttonLabel?.trim() || "Entdecken",
    buttonHref: data.buttonHref?.trim() || "#ablauf",
    steps,
  };
}

function mapBeratungContent(data?: {
  eyebrow?: string;
  title?: string;
  intro?: string;
  company?: string;
  street?: string;
  city?: string;
  phoneLabel?: string;
  phoneHref?: string;
  email?: string;
} | null): BeratungContent | null {
  if (!data?.title?.trim() || !data.intro?.trim()) {
    return null;
  }

  return {
    eyebrow: data.eyebrow?.trim() || "Persönliche Beratung",
    title: data.title.trim(),
    intro: data.intro.trim(),
    company: data.company?.trim() || "BEER GmbH",
    street: data.street?.trim() || "Badendorf 6",
    city: data.city?.trim() || "85395 Wolfersdorf",
    phoneLabel: data.phoneLabel?.trim() || "T 08168 909910",
    phoneHref: data.phoneHref?.trim() || "tel:+498168909910",
    email: data.email?.trim() || "beratung@beer-kuechenmanufaktur.de",
  };
}

async function fetchLandingPage(slug = "home"): Promise<HomeCms | null> {
  const payload = await strapiGet<StrapiLandingResponse>("/api/landings", {
    "filters[slug][$eq]": slug,
    "populate[hero][populate][slides][populate]": "image",
    "populate[kacheln][populate][colors][populate]": "image",
    "populate[entdecken][populate][panels][populate]": "image",
    "populate[ablauf][populate]": "steps",
    "populate[faq][populate]": "items",
    "populate[beratung]": "true",
  });
  const entry = Array.isArray(payload?.data) ? payload.data[0] : payload?.data;

  if (!entry) {
    return null;
  }

  const heroSlides = mapHeroSlides(entry.hero?.slides);
  const kacheln = mapKachelnContent(entry.kacheln);
  const entdecken = mapEntdeckenContent(entry.entdecken?.panels);
  const faq = mapFaqContent(entry.faq);
  const ablauf = mapProcessContent(entry.ablauf);
  const beratung = mapBeratungContent(entry.beratung);

  if (
    !heroSlides.length &&
    !kacheln &&
    !entdecken &&
    !faq &&
    !ablauf &&
    !beratung
  ) {
    return {
      title: entry.title?.trim(),
      slug: entry.slug?.trim(),
      heroSlides: [],
      kacheln: null,
      entdecken: null,
      faq: null,
      ablauf: null,
      beratung: null,
    };
  }

  return {
    title: entry.title?.trim(),
    slug: entry.slug?.trim(),
    heroSlides,
    kacheln,
    entdecken,
    faq,
    ablauf,
    beratung,
  };
}

export async function fetchLandingBySlug(slug: string) {
  return fetchLandingPage(slug);
}

export async function fetchHomeCms(): Promise<HomeCms> {
  const [landing, collectionFaq] = await Promise.all([
    fetchLandingPage(),
    fetchHomeFaqContent(),
  ]);

  if (landing) {
    return {
      ...landing,
      faq: landing.faq ?? collectionFaq,
    };
  }

  return {
    heroSlides: [],
    kacheln: null,
    entdecken: null,
    faq: collectionFaq,
    ablauf: null,
    beratung: null,
  };
}

export function flattenEntity(entry: unknown): Record<string, unknown> | null {
  if (!entry || typeof entry !== "object") {
    return null;
  }

  const row = entry as Record<string, unknown> & {
    attributes?: Record<string, unknown>;
  };

  if (row.attributes && typeof row.attributes === "object") {
    return { ...row, ...row.attributes };
  }

  return row;
}

export function flattenCollection(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) {
    return value
      .map(flattenEntity)
      .filter((item): item is Record<string, unknown> => Boolean(item));
  }

  if (value && typeof value === "object" && "data" in value) {
    return flattenCollection((value as { data: unknown }).data);
  }

  return [];
}

function mapFaqTheme(entry: unknown): FaqTheme | null {
  const row = flattenEntity(entry);
  if (!row) {
    return null;
  }
  const slug = String(row.slug ?? "").trim();
  const name = String(row.name ?? "").trim();

  if (!slug || !name) {
    return null;
  }

  return {
    name,
    slug,
    description: String(row.description ?? "").trim(),
    seoTitle: String(row.seoTitle ?? "").trim() || name,
    seoDescription: String(row.seoDescription ?? "").trim(),
    order: Number(row.order ?? 0) || 0,
  };
}

function mapFaqEntry(entry: unknown): FaqEntry | null {
  const row = flattenEntity(entry);
  if (!row) {
    return null;
  }
  const question = String(row.question ?? "").trim();
  const answer = String(row.answer ?? "").trim();

  if (!question || !answer) {
    return null;
  }

  return {
    slug: String(row.slug ?? "").trim() || question,
    question,
    answer,
    showOnHome: Boolean(row.showOnHome),
    order: Number(row.order ?? 0) || 0,
    themes: flattenCollection(row.themes)
      .map(mapFaqTheme)
      .filter((theme): theme is FaqTheme => Boolean(theme)),
  };
}

function toFaqContent(items: FaqEntry[]): FaqContent | null {
  if (items.length === 0) {
    return null;
  }

  return {
    eyebrow: "Fragen",
    title: "Bevor wir uns sehen",
    items: items.map((item) => ({
      question: item.question,
      answer: item.answer,
    })),
  };
}

export async function fetchFaqHub(): Promise<{
  themes: FaqTheme[];
  items: FaqEntry[];
}> {
  const [themePayload, itemPayload] = await Promise.all([
    strapiGet<{ data?: unknown }>("/api/faq-themes", {
      sort: "order:asc",
      "pagination[pageSize]": "100",
    }),
    strapiGet<{ data?: unknown }>("/api/faq-items", {
      sort: "order:asc",
      populate: "themes",
      "pagination[pageSize]": "100",
    }),
  ]);

  const themes = flattenCollection(themePayload?.data)
    .map(mapFaqTheme)
    .filter((theme): theme is FaqTheme => Boolean(theme))
    .sort((left, right) => left.order - right.order);

  const items = flattenCollection(itemPayload?.data)
    .map(mapFaqEntry)
    .filter((item): item is FaqEntry => Boolean(item))
    .sort((left, right) => left.order - right.order);

  return {
    themes: themes.length > 0 ? themes : FALLBACK_FAQ_THEMES,
    items: items.length > 0 ? items : FALLBACK_FAQ_ITEMS,
  };
}

export async function fetchHomeFaqContent(): Promise<FaqContent | null> {
  const payload = await strapiGet<{ data?: unknown }>("/api/faq-items", {
    "filters[showOnHome][$eq]": "true",
    sort: "order:asc",
    populate: "themes",
    "pagination[pageSize]": "20",
  });

  const items = flattenCollection(payload?.data)
    .map(mapFaqEntry)
    .filter((item): item is FaqEntry => Boolean(item));

  return toFaqContent(
    items.length > 0 ? items : homeFaqItems(FALLBACK_FAQ_ITEMS),
  );
}

export type HeaderCms = {
  logo: string;
  logoAlt: string;
  ctaLabel: string;
  ctaUrl: string;
  panels: MenuPanel[];
};

type StrapiMenuLink = {
  label?: string;
  url?: string;
  highlight?: boolean;
};

type StrapiMenuGroup = {
  title?: string | null;
  links?: StrapiMenuLink[];
};

type StrapiMenuTeaser = {
  caption?: string;
  alt?: string;
  url?: string;
  image?: StrapiMedia;
};

type StrapiHeaderMenu = {
  documentId?: string;
  label?: string;
  title?: string;
  url?: string;
  variant?: MenuPanel["variant"];
  intro?: string;
  order?: number;
  groups?: StrapiMenuGroup[];
  teasers?: StrapiMenuTeaser[];
};

type StrapiHeaderEntry = {
  logo?: StrapiMedia;
  logoAlt?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  menus?: StrapiHeaderMenu[];
};

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "menu"
  );
}

function mapHeaderMenus(menus: StrapiHeaderMenu[]): MenuPanel[] {
  const fallbackByLabel = new Map(
    menuPanels.map((panel) => [panel.label, panel]),
  );

  return menus
    .map((menu) => {
      const label = menu.label?.trim() || "";
      const fallback = fallbackByLabel.get(label);
      const teasers = (menu.teasers ?? [])
        .map((teaser) => {
          const image = strapiResponsiveImage(teaser.image, { srcWidth: 1200 });
          return {
            href: teaser.url?.trim() || "#",
            image: image.src,
            srcSet: image.srcSet,
            caption: teaser.caption?.trim() || "",
            alt: teaser.alt?.trim() || teaser.caption?.trim() || "",
          };
        })
        .filter((teaser) => teaser.caption && teaser.image);

      return {
        id: slugify(label) || menu.documentId || "menu",
        label,
        title: menu.title?.trim() || label,
        href: menu.url?.trim() || fallback?.href || "#",
        variant: menu.variant ?? fallback?.variant ?? "slim",
        intro: menu.intro?.trim() || fallback?.intro || "",
        groups: (menu.groups ?? [])
          .map((group) => ({
            title: group.title?.trim() || undefined,
            links: (group.links ?? [])
              .map((link) => ({
                label: link.label?.trim() || "",
                href: link.url?.trim() || "#",
                highlight: Boolean(link.highlight),
              }))
              .filter((link) => link.label),
          }))
          .filter((group) => group.links.length > 0),
        teasers: teasers.length > 0 ? teasers : fallback?.teasers,
      } satisfies MenuPanel;
    })
    .filter((panel) => panel.label && panel.groups.length > 0);
}

export async function fetchHeader(): Promise<HeaderCms | null> {
  const headerPayload = await strapiGet<{ data?: StrapiHeaderEntry }>(
    "/api/header",
    {
      "populate[logo]": "true",
      "populate[menus][populate][groups][populate]": "links",
      "populate[menus][populate][teasers][populate]": "image",
    },
  );

  const header = headerPayload?.data;
  const panels = mapHeaderMenus(header?.menus ?? []);

  if (!header && panels.length === 0) {
    return null;
  }

  const logo = strapiMediaUrl(header?.logo?.url);

  return {
    logo,
    logoAlt: header?.logoAlt?.trim() || "BEER Küchenmanufaktur",
    ctaLabel: header?.ctaLabel?.trim() || "Beratung anfragen",
    ctaUrl: header?.ctaUrl?.trim() || "#beratung",
    panels: panels.length > 0 ? panels : menuPanels,
  };
}
