import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryPage from "@/components/catalog/entries/CategoryPage";
import SpecPage from "@/components/catalog/entries/SpecPage";
import { cmsValue, findBySlug, projectsForAppliance } from "@/lib/catalog";
import { fetchAppliances, fetchProjects, fetchSitePage } from "@/lib/catalog-api";
import {
  applianceKindMetadata,
  entryMetadata,
  GERAETE_KIND_ROUTES,
  isGeraeteKindRoute,
  presentApplianceItem,
  presentApplianceKind,
} from "@/lib/collection-entries";
import { entryReading } from "@/lib/entry-reading";
import { isSeededDescription, isSeededTitle, pageReading, pageTitle } from "@/lib/page-reading";
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
  const reading = entryReading(item.name, item.intro, locale);
  return entryMetadata(
    isSeededTitle(cmsValue(locale, item, item.seoTitle))
      ? pageTitle("geraete", item.slug, locale, item.name) || reading.title
      : cmsValue(locale, item, item.seoTitle),
    // A description written in the CMS wins; the seeded one gives way to the page's own text.
    isSeededDescription(cmsValue(locale, item, item.seoDescription))
      ? pageReading("geraete", item.slug, locale)?.description || reading.description
      : cmsValue(locale, item, item.seoDescription),
    `/geraete/${item.slug}`,
    item.image,
  );
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
    const page = await fetchSitePage(slug);
    return (
      <CategoryPage
        hub={{ ...presentApplianceKind(slug, locale, items, projects, page), depth: { path: `/geraete/${slug}` } }}
        faqTheme="geraete"
        path={`/geraete/${slug}`}
      />
    );
  }

  const item = findBySlug(items, slug);
  if (!item) {
    notFound();
  }
  const related = projectsForAppliance(projects, item.slug);
  const houses = related.length > 0 ? related : projects.slice(0, 4);

  return (
    <SpecPage
      hub={{
        ...presentApplianceItem(item, locale, items, houses, projects),
        depth: { path: `/geraete/${item.slug}`, name: item.name },
      }}
    />
  );
}
