import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DetailPage from "@/components/catalog/DetailPage";
import { findBySlug, projectsForRegion } from "@/lib/catalog";
import { projectCards } from "@/lib/catalog-cards";
import { fetchProjects, fetchRegions } from "@/lib/catalog-api";

export const revalidate = 120;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await fetchRegions()).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const item = findBySlug(await fetchRegions(), (await params).slug);
  if (!item) {
    return { title: "Region | BEER Küchenmanufaktur" };
  }
  return {
    title: `Küche ${item.name} | BEER Küchenmanufaktur`,
    description: item.intro,
  };
}

export default async function RegionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [regions, projects] = await Promise.all([
    fetchRegions(),
    fetchProjects(),
  ]);
  const item = findBySlug(regions, slug);
  if (!item) {
    notFound();
  }
  return (
    <DetailPage
      eyebrow="Region"
      title={`Küchen in ${item.name}`}
      intro={item.intro}
      image={item.image}
      relatedTitle="Referenzen in der Nähe"
      related={projectCards(projectsForRegion(projects, item.slug))}
      ctaLabel="Beratung in dieser Region"
    />
  );
}
