import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import DetailPage from "@/components/catalog/DetailPage";
import { findBySlug, isPressArticle } from "@/lib/catalog";
import { fetchArticles } from "@/lib/catalog-api";

export const revalidate = 120;
export const dynamicParams = true;

export async function generateStaticParams() {
  const articles = await fetchArticles();
  return articles
    .filter(isPressArticle)
    .map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const item = findBySlug(await fetchArticles(), (await params).slug);
  if (!item) {
    return { title: "Aktuelles | BEER Küchenmanufaktur" };
  }
  return { title: `${item.title} | BEER Küchenmanufaktur`, description: item.description };
}

export default async function PresseArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const item = findBySlug(await fetchArticles(), (await params).slug);
  if (!item) {
    notFound();
  }
  if (!isPressArticle(item)) {
    redirect(`/ratgeber/${item.slug}`);
  }
  return (
    <DetailPage
      eyebrow={item.category?.name || "Aktuelles"}
      title={item.title}
      intro={item.description}
      body={item.body}
      image={item.image}
      srcSet={item.srcSet}
      ctaLabel="Gespräch vereinbaren"
      links={[{ href: "/presse", label: "Alle Meldungen" }]}
    />
  );
}
