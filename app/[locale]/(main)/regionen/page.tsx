import type { Metadata } from "next";
import CollectionHub from "@/components/catalog/CollectionHub";
import { fetchProjects, fetchRegions } from "@/lib/catalog-api";
import { placeCover } from "@/lib/kitchen-photos";
import {
  collectionHub,
  collectionHubMetadata,
  overlayBranchImages,
} from "@/lib/collection-hubs";
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
  const [regions, projects] = await Promise.all([fetchRegions(), fetchProjects()]);
  // Each place is shown by a kitchen: one built there, else its own kitchen photo, else one from the workshop.
  const covers = new Map(regions.map((region) => [region.slug, placeCover(region, projects)]));
  const images: Record<string, string> = {};
  for (const region of regions) {
    const cover = covers.get(region.slug);
    if (cover) {
      images[`/regionen/${region.slug}`] = cover;
    }
  }
  const extras = regions
    .filter((region) => !featuredSlugs.has(region.slug))
    .map((region) => ({
      href: `/regionen/${region.slug}`,
      title: region.name,
      image: covers.get(region.slug) ?? region.image,
    }));

  return (
    <CollectionHub
      id="regionen"
      locale={locale}
      branches={overlayBranchImages(collectionHub("regionen", locale).branches, images)}
      extras={extras}
      extrasTitle={locale === "en" ? "Further places" : "Weitere Orte"}
    />
  );
}
