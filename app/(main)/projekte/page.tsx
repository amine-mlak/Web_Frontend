import type { Metadata } from "next";
import HubPage from "@/components/catalog/HubPage";
import { projectCards } from "@/lib/catalog-cards";
import { fetchProjects } from "@/lib/catalog-api";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Projekte | BEER Küchenmanufaktur",
  description: "Referenzküchen aus der Manufaktur – Ort, Jahr, Material und Geräte.",
};

export default async function ProjektePage() {
  const projects = await fetchProjects();
  return (
    <HubPage
      eyebrow="Referenzen"
      title="Projekte"
      intro="Keine Showrooms aus dem Katalog. Küchen, die in Häusern stehen."
      image={projects[0]?.image}
      items={projectCards(projects)}
    />
  );
}
