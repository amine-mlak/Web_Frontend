import type { Metadata } from "next";
import HubPage from "@/components/catalog/HubPage";
import { MATERIAL_KINDS } from "@/lib/catalog";
import { materialCards } from "@/lib/catalog-cards";
import { fetchMaterials } from "@/lib/catalog-api";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Material & Ausstattung | BEER Küchenmanufaktur",
  description: "Fronten, Arbeitsplatten und Innenleben – Oberflächen, die man täglich berührt.",
};

export default async function MaterialPage() {
  const items = await fetchMaterials();
  const cards = materialCards(items);
  return (
    <HubPage
      eyebrow="Haptik"
      title="Material & Ausstattung"
      intro="Lack, Holz, Stein, Keramik, Auszüge. Mustern unter Tageslicht, nicht am Bildschirm."
      image="/kitchens/stile-holz.jpg"
      chips={MATERIAL_KINDS.map((kind) => ({
        href: `/material#${kind.slug}`,
        label: kind.name,
      }))}
      sections={MATERIAL_KINDS.map((kind) => ({
        id: kind.slug,
        title: kind.name,
        items: cards.filter((card) =>
          items.some(
            (item) =>
              item.kind === kind.slug && card.href === `/material/${item.slug}`,
          ),
        ),
      })).filter((section) => section.items.length > 0)}
    />
  );
}
