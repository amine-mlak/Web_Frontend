import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DetailPage from "@/components/catalog/DetailPage";
import { findBySlug } from "@/lib/catalog";
import { fetchArticles } from "@/lib/catalog-api";

export const revalidate = 120;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await fetchArticles()).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const item = findBySlug(await fetchArticles(), (await params).slug);
  if (!item) {
    return { title: "Ratgeber | BEER Küchenmanufaktur" };
  }
  return { title: `${item.title} | BEER Küchenmanufaktur`, description: item.description };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const item = findBySlug(await fetchArticles(), (await params).slug);
  if (!item) {
    notFound();
  }
  return (
    <DetailPage
      eyebrow={item.category?.name || "Ratgeber"}
      title={item.title}
      intro={item.description}
      body={item.body}
      image={item.image}
      srcSet={item.srcSet}
      ctaLabel="Gespräch vereinbaren"
    />
  );
}
