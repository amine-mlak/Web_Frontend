import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SamplePage from "@/components/catalog/entries/SamplePage";
import { findBySlug } from "@/lib/catalog";
import { fetchFurniture, fetchProjects } from "@/lib/catalog-api";
import { entryMetadata, presentFurnitureItem } from "@/lib/collection-entries";
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
  const item = findBySlug(await fetchFurniture(), (await params).slug);
  if (!item) {
    return { title: "Möbel | BEER Küchenmanufaktur" };
  }
  return entryMetadata(item.name, item.intro, `/moebel/${item.slug}`, item.image);
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
