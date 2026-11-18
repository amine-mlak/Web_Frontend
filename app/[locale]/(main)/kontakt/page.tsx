import type { Metadata } from "next";
import BookingPanel from "@/components/BookingPanel";
import AtelierVisit from "@/components/catalog/hub/AtelierVisit";
import LocalBusinessJsonLd from "@/components/LocalBusinessJsonLd";
import { houseMetadata } from "@/lib/house-pages";
import { HOUSE_MEDIA, houseSrc } from "@/lib/house-photos";
import { getRequestLocale } from "@/lib/locale";

export const revalidate = 120;

export function generateMetadata(): Promise<Metadata> {
  return houseMetadata("kontakt");
}

const VISIT = {
  de: { visitPlace: "Ausstellung Wolfersdorf", visitNote: "Muster, Kanten, Licht. Mit Termin." },
  en: { visitPlace: "Wolfersdorf showroom", visitNote: "Samples, edges, light. By appointment." },
} as const;

/**
 * Kontakt is the booking itself: one step per screen, like the kitchen planner on /beratung.
 * Below it, where to find the house: the building, opening hours, address and directions.
 */
export default async function KontaktPage() {
  const locale = await getRequestLocale();
  return (
    <main className="bg-paper">
      <LocalBusinessJsonLd />
      <BookingPanel locale={locale} />
      <AtelierVisit
        hub={{
          locale,
          visitImage: houseSrc(HOUSE_MEDIA.kontakt.hero, 1920),
          ...VISIT[locale === "en" ? "en" : "de"],
        }}
      />
    </main>
  );
}
