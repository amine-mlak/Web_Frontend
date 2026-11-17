import type { Metadata } from "next";
import type { CmsSeo } from "@/lib/cms-seo";
import { siteImage } from "@/lib/dev-images";
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
  // /kitchens/<name> is a named CMS photo (lib/beer-photos.ts), not a file in public/.
  if (src.startsWith("/kitchens/")) {
    src = siteImage(src, 1200);
  }
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }
  return new URL(src.startsWith("/") ? src : `/${src}`, `${siteUrl()}/`).toString();
}

export type PageSeo = {
  /** Fallback title when the CMS SEO block has none (may already carry the brand ending). */
  title: string;
  /** Fallback description, shortened to whole sentences. */
  description?: string;
  path: string;
  /** The page's first hero photo: the share photo unless the SEO block names another. */
  image?: string;
  /** The page's CMS block "SEO · Google und Teilen"; its values win over the fallbacks. */
  cms?: CmsSeo;
  /** Ratgeber and Presse posts: Open Graph "article" with its dates. */
  article?: { publishedTime?: string; modifiedTime?: string; section?: string };
};

/**
 * A CMS meta title as Google sees it: with " | BEER Küchenmanufaktur", or " | BEER", only while the
 * whole title stays within TITLE_MAX; a title that already names BEER is left as written.
 */
export function cmsTitle(title: string) {
  if (/\bBEER\b/.test(title)) {
    return title;
  }
  for (const ending of [` | ${SITE_NAME}`, " | BEER"]) {
    if (title.length + ending.length <= TITLE_MAX) {
      return `${title}${ending}`;
    }
  }
  return title;
}

export async function pageMetadata(seo: PageSeo): Promise<Metadata> {
  const locale = await getRequestLocale();
  const cms = seo.cms;
  const canonical = absoluteUrl(cms?.canonicalPath || seo.path, locale);
  const de = absoluteUrl(seo.path, "de");
  const en = absoluteUrl(seo.path, "en");
  // Share photo: the one chosen in the SEO block, else the page's hero, else the CMS default,
  // else the showroom hall.
  const image = absoluteAsset(
    cms?.image ||
      seo.image ||
      (await getSiteSettings()).shareImage ||
      houseSrc(HOUSE_MEDIA.ausstellung.hero, 1200),
  );
  const indexing = allowSearchIndexing();
  // CMS texts are used as written (the CMS limits their length); fallbacks are fitted.
  const title = cms?.title ? cmsTitle(cms.title) : fitTitle(seo.title);
  const description = cms?.description || fitDescription(seo.description);
  const hidden = cms?.noindex || (indexing && locale === "en");

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
    ...(hidden ? { robots: { index: false, follow: true } } : {}),
  };
}

export function brandedTitle(name: string) {
  return name.includes(SITE_NAME) ? name : `${name} | ${SITE_NAME}`;
}
