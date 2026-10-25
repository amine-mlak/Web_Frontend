import type { Metadata } from "next";
import PlannerSection from "@/components/planner/PlannerSection";
import { getRequestLocale } from "@/lib/locale";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  const en = (await getRequestLocale()) === "en";
  return pageMetadata({
    title: en ? "Kitchen planner & consultation | BEER Küchenmanufaktur" : "Küchenplaner & Beratung | BEER Küchenmanufaktur",
    description: en
      ? "Plan your kitchen in seven short steps – style, materials, appliances, room, shape and budget. The first consultation in Wolfersdorf near Freising is free."
      : "Planen Sie Ihre Küche in sieben kurzen Schritten – Stil, Material, Geräte, Raum, Form und Budget. Das Erstgespräch in Wolfersdorf bei Freising ist kostenlos.",
    path: "/beratung",
  });
}

export default function BeratungPage() {
  return (
    <main className="bg-paper">
      <PlannerSection headingLevel="h1" />
    </main>
  );
}
