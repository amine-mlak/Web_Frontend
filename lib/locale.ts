import { locale as rootLocale } from "next/root-params";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n";

/**
 * The locale of the page being rendered, from the `app/[locale]` segment.
 * Route handlers (sitemap, API) have no root params and get German.
 */
export async function getRequestLocale(): Promise<Locale> {
  try {
    const value = await rootLocale();
    return isLocale(value) ? value : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}
