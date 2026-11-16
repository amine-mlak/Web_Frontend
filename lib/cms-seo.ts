import { strapiResponsiveImage, type StrapiMedia } from "@/lib/strapi";

/** The CMS block "SEO · Google und Teilen" (component shared.seo), as the website uses it. */
export type CmsSeo = {
  title: string;
  description: string;
  /** Share photo chosen in the CMS; empty means the page's first hero photo. */
  image?: string;
  noindex: boolean;
  /** Another page's address when this page is a copy of it, e.g. "/kuechen/stile". */
  canonicalPath?: string;
};

/** Populate for the SEO block including its share photo (`populate[seo]=true` leaves the photo out). */
export const SEO_POPULATE = { "populate[seo][populate][shareImage]": "true" } as const;

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * The SEO block of an entry for a page in `locale`: only when the entry is in that language, so an
 * English page never shows the German search text (English pages keep their own fallbacks).
 */
export function seoFor(
  locale: string,
  item?: { seo?: CmsSeo; contentLocale?: string } | null,
): CmsSeo | undefined {
  if (!item?.seo) {
    return undefined;
  }
  const language = item.contentLocale || "de";
  return language === locale ? item.seo : undefined;
}

export function mapSeo(raw: unknown): CmsSeo | undefined {
  if (!raw || typeof raw !== "object") {
    return undefined;
  }
  const seo = raw as Record<string, unknown>;
  const share = strapiResponsiveImage(seo.shareImage as StrapiMedia | undefined, { srcWidth: 1280 });
  const canonicalPath = clean(seo.canonicalPath);
  const mapped: CmsSeo = {
    title: clean(seo.metaTitle),
    description: clean(seo.metaDescription),
    image: share.src || undefined,
    noindex: seo.noindex === true,
    canonicalPath: canonicalPath.startsWith("/") ? canonicalPath : undefined,
  };
  return mapped.title || mapped.description || mapped.image || mapped.noindex || mapped.canonicalPath
    ? mapped
    : undefined;
}
