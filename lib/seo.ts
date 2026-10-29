import type { Metadata } from "next";
import { DEFAULT_LOCALE, withLocale, type Locale } from "@/lib/i18n";
import { HOUSE_MEDIA, houseSrc } from "@/lib/house-photos";
import { getRequestLocale } from "@/lib/locale";
import { getSiteSettings } from "@/lib/site-settings";
import { allowSearchIndexing } from "@/lib/umami";

const FALLBACK_SITE = "https://www.beer.de";
const SITE_NAME = "BEER Küchenmanufaktur";
/** Google shows about 60 characters of a title. */
const TITLE_MAX = 60;

/** "… | BEER Küchenmanufaktur" becomes "… | BEER" when the full ending would push the title past TITLE_MAX. */
export function fitTitle(title: string) {
  const ending = ` | ${SITE_NAME}`;
  if (title.length <= TITLE_MAX || !title.endsWith(ending)) {
    return title;
  }
  return `${title.slice(0, -ending.length)} | BEER`;
}

/** Google shows about 160 characters of a description. */
const DESCRIPTION_MAX = 160;

/** A longer description keeps its whole sentences up to DESCRIPTION_MAX; a single long sentence is cut at a word. */
export function fitDescription(text?: string) {
  if (!text || text.length <= DESCRIPTION_MAX) {
    return text;
  }
  let kept = "";
  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    const next = kept ? `${kept} ${sentence}` : sentence;
    if (next.length > DESCRIPTION_MAX) break;
    kept = next;
  }
  if (kept) {
    return kept;
  }
  return `${text.slice(0, DESCRIPTION_MAX - 1).replace(/\s+\S*$/, "")}…`;
}

export function siteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (raw) {
    try {
      return new URL(raw).origin;
    } catch {
      /* ignore invalid */
    }
  }
  return FALLBACK_SITE;
}

export function absoluteUrl(path = "/", locale: Locale = DEFAULT_LOCALE) {
  const href = withLocale(path.startsWith("/") ? path : `/${path}`, locale);
  return new URL(href, `${siteUrl()}/`).toString();
}

export function absoluteAsset(src?: string) {
  if (!src) {
    return undefined;
  }
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }
  return new URL(src.startsWith("/") ? src : `/${src}`, `${siteUrl()}/`).toString();
}

export type PageSeo = {
  title: string;
  description?: string;
  path: string;
  image?: string;
  /** Ratgeber and Presse posts: Open Graph "article" with its dates. */
  article?: { publishedTime?: string; modifiedTime?: string; section?: string };
};

export async function pageMetadata(seo: PageSeo): Promise<Metadata> {
  const locale = await getRequestLocale();
  const canonical = absoluteUrl(seo.path, locale);
  const de = absoluteUrl(seo.path, "de");
  const en = absoluteUrl(seo.path, "en");
  // A page without its own photo is shared with the CMS default, else the showroom hall.
  const image = absoluteAsset(
    seo.image || (await getSiteSettings()).shareImage || houseSrc(HOUSE_MEDIA.ausstellung.hero, 1200),
  );
  const indexing = allowSearchIndexing();
  const title = fitTitle(seo.title);
  const description = fitDescription(seo.description);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        de,
        en,
        "x-default": de,
      },
    },
    openGraph: {
      ...(seo.article ? { type: "article", ...seo.article } : { type: "website" }),
      locale: locale === "en" ? "en_GB" : "de_DE",
      url: canonical,
      siteName: SITE_NAME,
      title,
      description,
      images: image ? [{ url: image, alt: title }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
    ...(indexing && locale === "en"
      ? { robots: { index: false, follow: true } }
      : {}),
  };
}

export function brandedTitle(name: string) {
  return name.includes(SITE_NAME) ? name : `${name} | ${SITE_NAME}`;
}
