import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DetailPage from "@/components/catalog/DetailPage";
import { findBySlug, projectsForBrand } from "@/lib/catalog";
import { projectCards } from "@/lib/catalog-cards";
import { fetchBrands, fetchProjects } from "@/lib/catalog-api";

export const revalidate = 120;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await fetchBrands()).map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const brand = findBySlug(await fetchBrands(), (await params).slug);
  if (!brand) {
    return { title: "Marke | BEER Küchenmanufaktur" };
  }
  return { title: `${brand.name} | BEER Küchenmanufaktur`, description: brand.intro };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [brands, projects] = await Promise.all([fetchBrands(), fetchProjects()]);
  const brand = findBySlug(brands, slug);
  if (!brand) {
    notFound();
  }
  return (
    <DetailPage
      eyebrow="Marke"
      title={brand.name}
      intro={brand.intro}
      body={brand.body}
      image={brand.image}
      srcSet={brand.srcSet}
      relatedTitle="Küchen mit dieser Marke"
      related={projectCards(projectsForBrand(projects, brand.slug))}
      ctaLabel="Marke in der Planung"
    />
  );
}
