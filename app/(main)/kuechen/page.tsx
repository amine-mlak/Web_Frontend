import type { Metadata } from "next";
import HubPage from "@/components/catalog/HubPage";
import { KITCHEN_CLUSTERS } from "@/lib/catalog";
import { clusterCards } from "@/lib/catalog-cards";
import { fetchKitchenTopics } from "@/lib/catalog-api";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Küchen | BEER Küchenmanufaktur",
  description:
    "Formen, Stile, Farben, Inseln und besondere Küchen – der Überblick vor dem Detail.",
};

export default async function KuechenPage() {
  await fetchKitchenTopics();
  return (
    <HubPage
      eyebrow="Küchen"
      title="Formen, Stile, Farben"
      intro="Keine Liste aus dem Katalog. Themen, die sich filtern und später als Referenzküche zeigen."
      image="/kitchens/stile-design.jpg"
      items={clusterCards(KITCHEN_CLUSTERS)}
    />
  );
}
