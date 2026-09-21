import type { Metadata } from "next";
import HubPage from "@/components/catalog/HubPage";
import { APPLIANCE_KINDS } from "@/lib/catalog";
import { applianceCards } from "@/lib/catalog-cards";
import { fetchAppliances } from "@/lib/catalog-api";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Geräte | BEER Küchenmanufaktur",
  description:
    "Kochfeld, Abzug, Backofen, Kälte, Spüler – Technik, die zur Architektur passt.",
};

export default async function GeraetePage() {
  const appliances = await fetchAppliances();
  const cards = applianceCards(appliances);
  return (
    <HubPage
      eyebrow="Technik"
      title="Geräte"
      intro="Nicht die ganze Wand voller Geräte. Die, die der Alltag braucht – sauber eingebaut."
      image="/kitchens/stile-purist.jpg"
      chips={APPLIANCE_KINDS.map((kind) => ({
        href: `/geraete#${kind.slug}`,
        label: kind.name,
      }))}
      sections={APPLIANCE_KINDS.map((kind) => ({
        id: kind.slug,
        title: kind.name,
        items: cards.filter((card) =>
          appliances.some(
            (item) =>
              item.kind === kind.slug && card.href === `/geraete/${item.slug}`,
          ),
        ),
      })).filter((section) => section.items.length > 0)}
    />
  );
}
