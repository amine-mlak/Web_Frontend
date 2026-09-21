import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DetailPage from "@/components/catalog/DetailPage";
import { findBySlug } from "@/lib/catalog";
import { fetchFurniture } from "@/lib/catalog-api";

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
  return { title: `${item.name} | BEER Küchenmanufaktur`, description: item.intro };
}

export default async function FurniturePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const item = findBySlug(await fetchFurniture(), (await params).slug);
  if (!item) {
    notFound();
  }
  return (
    <DetailPage
      eyebrow="Möbel nach Maß"
      title={item.name}
      intro={item.intro}
      image={item.image}
      srcSet={item.srcSet}
      ctaLabel="Möbel anfragen"
    />
  );
}
