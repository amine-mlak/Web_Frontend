import type { Metadata } from "next";
import LeadCta from "@/components/LeadCta";
import { pageMetadata } from "@/lib/seo";
import { fetchHomeCms } from "@/lib/strapi";

export const revalidate = 120;

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "Beratung | BEER Küchenmanufaktur",
    description:
      "Erstgespräch kostenlos. Küchenplanung in Wolfersdorf bei Freising — Aufmaß, Zeichnung, Fertigung.",
    path: "/beratung",
  });
}

export default async function BeratungPage() {
  const { beratung } = await fetchHomeCms();

  return (
    <main className="bg-paper">
      <LeadCta content={beratung} />
    </main>
  );
}
