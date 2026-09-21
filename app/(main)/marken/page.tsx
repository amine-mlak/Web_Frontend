import type { Metadata } from "next";
import HubPage from "@/components/catalog/HubPage";
import { brandCards } from "@/lib/catalog-cards";
import { fetchBrands } from "@/lib/catalog-api";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Marken | BEER Küchenmanufaktur",
  description: "Bora, Miele, Gaggenau, Quooker, Siemens – Geräte nach Aufgabe, nicht nach Zwang.",
};

export default async function MarkenPage() {
  const brands = await fetchBrands();
  return (
    <HubPage
      eyebrow="Partner"
      title="Marken"
      intro="Die Küche fertigen wir selbst. Die Geräte wählen wir mit Ihnen."
      image="/kitchens/stile-insel.jpg"
      items={brandCards(brands)}
    />
  );
}
