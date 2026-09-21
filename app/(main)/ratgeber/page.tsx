import type { Metadata } from "next";
import HubPage from "@/components/catalog/HubPage";
import { articleCards } from "@/lib/catalog-cards";
import { fetchArticles } from "@/lib/catalog-api";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Ratgeber | BEER Küchenmanufaktur",
  description: "Kosten, Planung, Geräte – kurze Texte vor dem Gespräch, keine Ratgeber-Maschine.",
};

export default async function RatgeberPage() {
  const articles = await fetchArticles();
  return (
    <HubPage
      eyebrow="Wissen"
      title="Ratgeber"
      intro="Wenig Artikel, klare Fragen. Der Rest gehört ins Gespräch."
      image="/kitchens/stile-insel.jpg"
      items={articleCards(articles)}
    />
  );
}
