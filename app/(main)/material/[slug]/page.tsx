import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DetailPage from "@/components/catalog/DetailPage";
import { findBySlug, projectsForMaterial } from "@/lib/catalog";
import { projectCards } from "@/lib/catalog-cards";
import { fetchMaterials, fetchProjects } from "@/lib/catalog-api";

export const revalidate = 120;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await fetchMaterials()).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const item = findBySlug(await fetchMaterials(), (await params).slug);
  if (!item) {
    return { title: "Material | BEER Küchenmanufaktur" };
  }
  return { title: `${item.name} | BEER Küchenmanufaktur`, description: item.intro };
}

export default async function MaterialDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [items, projects] = await Promise.all([
    fetchMaterials(),
    fetchProjects(),
  ]);
  const item = findBySlug(items, slug);
  if (!item) {
    notFound();
  }
  return (
    <DetailPage
      eyebrow="Material"
      title={item.name}
      intro={item.intro}
      image={item.image}
      srcSet={item.srcSet}
      relatedTitle="Küchen mit diesem Material"
      related={projectCards(projectsForMaterial(projects, item.slug))}
    />
  );
}
