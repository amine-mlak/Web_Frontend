import type { Metadata } from "next";
import HubPage from "@/components/catalog/HubPage";
import { regionCards } from "@/lib/catalog-cards";
import { fetchRegions } from "@/lib/catalog-api";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Regionen | BEER Küchenmanufaktur",
  description:
    "Küchen in München, Freising, Erding, Dachau, Pfaffenhofen, Landshut und im Umland.",
};

export default async function RegionenPage() {
  const items = await fetchRegions();
  return (
    <HubPage
      eyebrow="Einzugsgebiet"
      title="Regionen"
      intro="Ausstellung in Wolfersdorf. Aufmaß und Montage bei Ihnen – im Radius um München."
      image="/kitchens/stile-modern.jpg"
      items={regionCards(items)}
    />
  );
}
