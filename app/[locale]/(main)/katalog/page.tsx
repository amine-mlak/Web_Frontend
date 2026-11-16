import { permanentRedirect } from "next/navigation";
import { withLocale } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/locale";

/**
 * BEER's printed piece is the booklet, so "Katalog bestellen" is the booklet page. Old links,
 * the menu and the footer keep pointing here; this sends them on for good.
 */
export default async function KatalogPage() {
  permanentRedirect(withLocale("/7-geheimnisse", await getRequestLocale()));
}
