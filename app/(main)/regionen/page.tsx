import type { Metadata } from "next";
import CollectionHub from "@/components/catalog/CollectionHub";
import { collectionHubMetadata } from "@/lib/collection-hubs";
import { fetchRegions } from "@/lib/catalog-api";
import { getRequestLocale } from "@/lib/locale";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  return collectionHubMetadata("regionen");
}

const featuredSlugs = new Set([
  "muenchen",
  "freising",
  "erding",
  "pfaffenhofen",
]);

export default async function RegionenPage() {
  const locale = await getRequestLocale();
  const regions = await fetchRegions();
  const extras = regions
    .filter((region) => !featuredSlugs.has(region.slug))
    .map((region) => ({
      href: `/regionen/${region.slug}`,
      title: region.name,
      image: region.image,
    }));

  return (
    <CollectionHub
      id="regionen"
      locale={locale}
      extras={extras}
      extrasTitle={locale === "en" ? "Further places" : "Weitere Orte"}
    />
  );
}
