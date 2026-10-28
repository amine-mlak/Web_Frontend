import type { Metadata } from "next";
import { notFound } from "next/navigation";
import InteriorPage, { interiorPoints } from "@/components/catalog/entries/InteriorPage";
import SamplePage from "@/components/catalog/entries/SamplePage";
import { cmsValue, findBySlug } from "@/lib/catalog";
import { fetchFurniture, fetchProjects } from "@/lib/catalog-api";
import { entryMetadata, presentFurnitureItem } from "@/lib/collection-entries";
import { entryReading } from "@/lib/entry-reading";
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
  const locale = await getRequestLocale();
  const item = findBySlug(await fetchFurniture(), (await params).slug);
  if (!item) {
    return { title: "Möbel | BEER Küchenmanufaktur" };
  }
  const reading = entryReading(item.name, item.intro, locale);
  return entryMetadata(
    cmsValue(locale, item, item.seoTitle) || reading.title,
    cmsValue(locale, item, item.seoDescription) || reading.description,
    `/moebel/${item.slug}`,
    item.image,
  );
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
  const hub = presentFurnitureItem(item, locale, items, projects);
  // With CMS points that carry photos (in this language), each point is a room with its photos.
  const source = {
    intro: item.intro,
    body: item.lesetext ?? "",
    image: item.image,
    srcSet: item.srcSet,
    ctaLabel: locale === "en" ? "Book an appointment" : "Termin vereinbaren",
    ctaUrl: "/beratung",
    punkte: item.punkte,
  };
  if ((!item.contentLocale || item.contentLocale === locale) && interiorPoints(source).length >= 2) {
    const en = locale === "en";
    return (
      <InteriorPage
        hub={hub}
        page={source}
        faqTheme="moebel"
        labels={{
          houses: en ? "From these houses" : "Aus diesen Häusern",
          more: en ? "More furniture from the workshop" : "Weitere Möbel aus der Werkstatt",
          faqAll: en ? "All questions on furniture" : "Alle Fragen zu Möbeln",
          secondaryHref: "/ausstellung",
          secondaryLabel: en ? "Visit the showroom" : "Ausstellung besuchen",
        }}
      />
    );
  }
  return <SamplePage hub={hub} />;
}
