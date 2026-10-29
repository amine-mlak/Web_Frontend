import { fetchSitePage } from "@/lib/catalog-api";
import type { Locale } from "@/lib/i18n";

/**
 * What a CMS site page says about itself to search engines: the SEO text when an editor wrote
 * one, otherwise the intro that visitors read on the page. Empty when the page is missing or only
 * exists in another language, so callers fall back to their own copy.
 */
export async function cmsPageText(slug: string, locale: Locale) {
  const page = await fetchSitePage(slug);
  if (!page || (page.contentLocale && page.contentLocale !== locale)) {
    return { title: "", heading: "", fullHeading: "", description: "", image: undefined };
  }
  return {
    title: page.seoTitle || "",
    heading: page.seitentitel || "",
    // Heading and emphasis together, as pages that show both print them.
    fullHeading: [page.seitentitel, page.betonung].filter(Boolean).join(" "),
    description: page.seoDescription || page.intro?.trim() || "",
    image: page.image || undefined,
  };
}
