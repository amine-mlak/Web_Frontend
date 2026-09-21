import type { Metadata } from "next";
import FaqHub from "@/components/FaqHub";
import { fetchFaqHub } from "@/lib/strapi";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "FAQ | BEER Küchenmanufaktur",
  description:
    "Fragen zur Küche nach Thema: Farben, Formen, Stile, Kosten, Geräte, Ausstellung und Planung.",
};

export default async function FaqPage() {
  const { themes, items } = await fetchFaqHub();
  return <FaqHub themes={themes} items={items} />;
}
