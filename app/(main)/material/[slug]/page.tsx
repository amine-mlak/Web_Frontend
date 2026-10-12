import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MagazinePage from "@/components/catalog/hub/MagazinePage";
import { findBySlug, projectsForMaterial } from "@/lib/catalog";
import { fetchMaterials, fetchProjects } from "@/lib/catalog-api";
import {
  entryMetadata,
  isMaterialKindRoute,
  MATERIAL_KIND_ROUTES,
  materialKindMetadata,
  presentMaterialItem,
  presentMaterialKind,
} from "@/lib/collection-entries";
import { getRequestLocale } from "@/lib/locale";

export const revalidate = 120;
export const dynamicParams = true;

export async function generateStaticParams() {
  const items = await fetchMaterials();
  return [
    ...MATERIAL_KIND_ROUTES.map((item) => ({ slug: item.slug })),
    ...items.map((item) => ({ slug: item.slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getRequestLocale();
  if (isMaterialKindRoute(slug)) {
    return materialKindMetadata(slug, locale);
  }
  const item = findBySlug(await fetchMaterials(), slug);
  if (!item) {
    return { title: "Material | BEER Küchenmanufaktur" };
  }
  return entryMetadata(item.name, item.intro, `/material/${item.slug}`, item.image);
}

export default async function MaterialDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [locale, items, projects] = await Promise.all([
    getRequestLocale(),
    fetchMaterials(),
    fetchProjects(),
  ]);

  if (isMaterialKindRoute(slug)) {
    return (
      <MagazinePage
        hub={presentMaterialKind(slug, locale, items, projects)}
      />
    );
  }

  const item = findBySlug(items, slug);
  if (!item) {
    notFound();
  }
  const related = projectsForMaterial(projects, item.slug);
  const houses = related.length > 0 ? related : projects.slice(0, 4);

  return (
    <MagazinePage
      hub={presentMaterialItem(item, locale, items, houses)}
    />
  );
}
