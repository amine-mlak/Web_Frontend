import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DetailPage from "@/components/catalog/DetailPage";
import { findBySlug, projectsForAppliance } from "@/lib/catalog";
import { projectCards } from "@/lib/catalog-cards";
import { fetchAppliances, fetchProjects } from "@/lib/catalog-api";

export const revalidate = 120;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await fetchAppliances()).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const item = findBySlug(await fetchAppliances(), (await params).slug);
  if (!item) {
    return { title: "Gerät | BEER Küchenmanufaktur" };
  }
  return { title: `${item.name} | BEER Küchenmanufaktur`, description: item.intro };
}

export default async function AppliancePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [items, projects] = await Promise.all([
    fetchAppliances(),
    fetchProjects(),
  ]);
  const item = findBySlug(items, slug);
  if (!item) {
    notFound();
  }
  return (
    <DetailPage
      eyebrow="Gerät"
      title={item.name}
      intro={item.intro}
      image={item.image}
      srcSet={item.srcSet}
      relatedTitle="Referenzen"
      related={projectCards(projectsForAppliance(projects, item.slug))}
    />
  );
}
