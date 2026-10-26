import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PlacePage from "@/components/catalog/entries/PlacePage";
import { cmsValue, findBySlug, projectsForRegion } from "@/lib/catalog";
import { fetchProjects, fetchRegions } from "@/lib/catalog-api";
import { entryMetadata, presentRegionItem } from "@/lib/collection-entries";
import { entryReading } from "@/lib/entry-reading";
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
  const locale = await getRequestLocale();
  const item = findBySlug(await fetchRegions(), (await params).slug);
  if (!item) {
    return { title: "Region | BEER Küchenmanufaktur" };
  }
  const reading = entryReading(
    locale === "en" ? `Kitchens in ${item.name}` : `Küchen in ${item.name}`,
    item.intro,
    locale,
  );
  return entryMetadata(
    cmsValue(locale, item, item.seoTitle) || reading.title,
    cmsValue(locale, item, item.seoDescription) || reading.description,
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
    <PlacePage hub={presentRegionItem(item, locale, regions, houses, projects)} />
  );
}
