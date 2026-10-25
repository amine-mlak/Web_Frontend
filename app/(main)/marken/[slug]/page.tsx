import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SpecPage from "@/components/catalog/entries/SpecPage";
import { cmsValue, findBySlug, projectsForBrand } from "@/lib/catalog";
import { fetchBrands, fetchProjects } from "@/lib/catalog-api";
import { entryMetadata, presentBrandItem } from "@/lib/collection-entries";
import { entryReading } from "@/lib/entry-reading";
import { getRequestLocale } from "@/lib/locale";

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
  const locale = await getRequestLocale();
  const brand = findBySlug(await fetchBrands(), (await params).slug);
  if (!brand) {
    return { title: "Marke | BEER Küchenmanufaktur" };
  }
  const reading = entryReading(brand.name, brand.intro, locale);
  return entryMetadata(
    cmsValue(locale, brand, brand.seoTitle) || reading.title,
    cmsValue(locale, brand, brand.seoDescription) || reading.description,
    `/marken/${brand.slug}`,
    brand.image,
  );
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [locale, brands, projects] = await Promise.all([
    getRequestLocale(),
    fetchBrands(),
    fetchProjects(),
  ]);
  const brand = findBySlug(brands, slug);
  if (!brand) {
    notFound();
  }
  const related = projectsForBrand(projects, brand.slug);
  const houses = related.length > 0 ? related : projects.slice(0, 4);

  return (
    <SpecPage hub={presentBrandItem(brand, locale, brands, houses)} />
  );
}
