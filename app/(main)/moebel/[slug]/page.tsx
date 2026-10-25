import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SamplePage from "@/components/catalog/entries/SamplePage";
import { cmsValue, findBySlug } from "@/lib/catalog";
import { fetchFurniture, fetchProjects } from "@/lib/catalog-api";
import { entryMetadata, presentFurnitureItem } from "@/lib/collection-entries";
import { entryReading } from "@/lib/entry-reading";
import { getRequestLocale } from "@/lib/locale";

export const revalidate = 120;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await fetchFurniture()).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const locale = await getRequestLocale();
  const item = findBySlug(await fetchFurniture(), (await params).slug);
  if (!item) {
    return { title: "Möbel | BEER Küchenmanufaktur" };
  }
  const reading = entryReading(item.name, item.intro, locale);
  return entryMetadata(
    cmsValue(locale, item, item.seoTitle) || reading.title,
    cmsValue(locale, item, item.seoDescription) || reading.description,
    `/moebel/${item.slug}`,
    item.image,
  );
}

export default async function FurniturePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [locale, items, projects] = await Promise.all([
    getRequestLocale(),
    fetchFurniture(),
    fetchProjects(),
  ]);
  const item = findBySlug(items, slug);
  if (!item) {
    notFound();
  }
  return (
    <SamplePage hub={presentFurnitureItem(item, locale, items, projects)} />
  );
}
