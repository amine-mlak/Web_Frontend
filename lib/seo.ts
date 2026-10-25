import type { Metadata } from "next";
import { DEFAULT_LOCALE, withLocale, type Locale } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/locale";
import { allowSearchIndexing } from "@/lib/umami";

const FALLBACK_SITE = "https://www.beer.de";
const SITE_NAME = "BEER Küchenmanufaktur";

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
  const image = absoluteAsset(seo.image);
  const indexing = allowSearchIndexing();

  return {
    title: seo.title,
    description: seo.description,
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
      title: seo.title,
      description: seo.description,
      images: image ? [{ url: image, alt: seo.title }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: seo.title,
      description: seo.description,
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
