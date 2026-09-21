import type { Metadata } from "next";
import HubPage from "@/components/catalog/HubPage";
import { furnitureCards } from "@/lib/catalog-cards";
import { fetchFurniture } from "@/lib/catalog-api";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Möbel nach Maß | BEER Küchenmanufaktur",
  description: "Einbauschränke, Ankleiden, Tische und Wohnmöbel aus derselben Manufaktur.",
};

export default async function MoebelPage() {
  const items = await fetchFurniture();
  return (
    <HubPage
      eyebrow="Einbauten"
      title="Möbel nach Maß"
      intro="Nicht jedes Möbel. Die, die zur Küche und zum Haus gehören."
      image="/kitchens/stile-holz.jpg"
      items={furnitureCards(items)}
    />
  );
}
