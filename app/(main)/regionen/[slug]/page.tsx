import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PlacePage from "@/components/catalog/entries/PlacePage";
import { findBySlug, projectsForRegion } from "@/lib/catalog";
import { fetchProjects, fetchRegions } from "@/lib/catalog-api";
import { entryMetadata, presentRegionItem } from "@/lib/collection-entries";
import { getRequestLocale } from "@/lib/locale";

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
  return entryMetadata(
    `Küchen in ${item.name}`,
    item.intro,
    `/regionen/${item.slug}`,
    item.image,
  );
}

export default async function RegionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [locale, regions, projects] = await Promise.all([
    getRequestLocale(),
    fetchRegions(),
    fetchProjects(),
  ]);
  const item = findBySlug(regions, slug);
  if (!item) {
    notFound();
  }
  const related = projectsForRegion(projects, item.slug);
  const houses = related.length > 0 ? related : projects.slice(0, 4);

  return (
    <PlacePage hub={presentRegionItem(item, locale, regions, houses)} />
  );
}
