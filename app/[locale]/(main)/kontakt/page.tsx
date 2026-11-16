import type { Metadata } from "next";
import BookingPanel from "@/components/BookingPanel";
import LocalBusinessJsonLd from "@/components/LocalBusinessJsonLd";
import { houseMetadata } from "@/lib/house-pages";
import { getRequestLocale } from "@/lib/locale";

export const revalidate = 120;

export function generateMetadata(): Promise<Metadata> {
  return houseMetadata("kontakt");
}

/** Kontakt is the booking itself: one step per screen, like the kitchen planner on /beratung. */
export default async function KontaktPage() {
  const locale = await getRequestLocale();
  return (
    <main className="bg-paper">
      <LocalBusinessJsonLd />
      <BookingPanel locale={locale} />
    </main>
  );
}
