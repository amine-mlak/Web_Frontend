import type { Metadata } from "next";
import FaqHub from "@/components/FaqHub";
import { pageMetadata } from "@/lib/seo";
import { fetchFaqHub } from "@/lib/strapi";

export const revalidate = 120;

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "FAQ | BEER Küchenmanufaktur",
    description:
      "Fragen zur Küche nach Thema: Farben, Formen, Stile, Kosten, Geräte, Ausstellung und Planung.",
    path: "/faq",
  });
}

export default async function FaqPage() {
  const { themes, items } = await fetchFaqHub();
  return <FaqHub themes={themes} items={items} />;
}
