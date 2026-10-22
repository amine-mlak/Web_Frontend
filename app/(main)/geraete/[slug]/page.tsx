import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SpecPage from "@/components/catalog/entries/SpecPage";
import { findBySlug, projectsForAppliance } from "@/lib/catalog";
import { fetchAppliances, fetchProjects } from "@/lib/catalog-api";
import {
  applianceKindMetadata,
  entryMetadata,
  GERAETE_KIND_ROUTES,
  isGeraeteKindRoute,
  presentApplianceItem,
  presentApplianceKind,
} from "@/lib/collection-entries";
import { getRequestLocale } from "@/lib/locale";

export const revalidate = 120;
export const dynamicParams = true;

export async function generateStaticParams() {
  const items = await fetchAppliances();
  return [
    ...GERAETE_KIND_ROUTES.map((item) => ({ slug: item.slug })),
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
  if (isGeraeteKindRoute(slug)) {
    return applianceKindMetadata(slug, locale);
  }
  const item = findBySlug(await fetchAppliances(), slug);
  if (!item) {
    return { title: "Gerät | BEER Küchenmanufaktur" };
  }
  return entryMetadata(item.name, item.intro, `/geraete/${item.slug}`, item.image);
}

export default async function AppliancePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [locale, items, projects] = await Promise.all([
    getRequestLocale(),
    fetchAppliances(),
    fetchProjects(),
  ]);

  if (isGeraeteKindRoute(slug)) {
    return (
      <SpecPage hub={presentApplianceKind(slug, locale, items, projects)} />
    );
  }

  const item = findBySlug(items, slug);
  if (!item) {
    notFound();
  }
  const related = projectsForAppliance(projects, item.slug);
  const houses = related.length > 0 ? related : projects.slice(0, 4);

  return (
    <SpecPage hub={presentApplianceItem(item, locale, items, houses)} />
  );
}
