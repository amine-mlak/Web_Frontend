import type { Metadata } from "next";
import CollectionHub from "@/components/catalog/CollectionHub";
import ProjectFeature from "@/components/catalog/ProjectFeature";
import { fetchFurniture, fetchProjects } from "@/lib/catalog-api";
import {
  collectionHub,
  collectionHubMetadata,
  overlayBranchImages,
} from "@/lib/collection-hubs";
import { getRequestLocale } from "@/lib/locale";
import { projectFeature } from "@/lib/project-features";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  return collectionHubMetadata("moebel");
}

export default async function MoebelPage() {
  const locale = await getRequestLocale();
  const [items, projects] = await Promise.all([fetchFurniture(), fetchProjects()]);
  const images: Record<string, string> = {};
  for (const item of items) {
    images[`/moebel/${item.slug}`] = item.image;
  }
  // Only lines whose page is published; a new one (Badmöbel) appears once it is.
  const branches = collectionHub("moebel", locale).branches.filter(
    (branch) => !branch.href || Boolean(images[branch.href]),
  );

  // Houses the furniture pages point to, the one with the most rooms first.
  const counts = new Map<string, number>();
  for (const item of items) {
    for (const point of item.punkte ?? []) {
      const slug = point.linkZiel?.match(/^\/projekte\/([^/?#]+)/)?.[1];
      if (slug) counts.set(slug, (counts.get(slug) ?? 0) + 1);
    }
  }
  const houses = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([slug]) => projects.find((project) => project.slug === slug))
    .filter((project) => project?.image)
    .slice(0, 4)
    .map((project) => projectFeature(project!));
  const en = locale === "en";

  return (
    <CollectionHub
      id="moebel"
      locale={locale}
      branches={overlayBranchImages(branches, images)}
    >
      {houses.length > 0 ? (
        <section aria-labelledby="moebel-houses">
          <div className="border-b border-line bg-paper px-5 pt-16 pb-4 sm:px-8 lg:px-14 lg:pt-24">
            <p className="type-eyebrow text-gold">{en ? "Whole houses" : "Ganze Häuser"}</p>
            <h2
              id="moebel-houses"
              className="mt-4 max-w-3xl font-serif text-[32px] leading-tight font-medium tracking-[-0.03em] text-ink md:text-[44px]"
            >
              {en ? "The kitchen and the rest of the house from one workshop" : "Küche und Haus aus einer Werkstatt"}
            </h2>
            <p className="mt-5 max-w-2xl font-sans text-[16px] leading-relaxed text-muted">
              {en
                ? "In these houses we built more than the kitchen: wardrobes, vanities, benches and built-in cupboards in the same wood and lacquer."
                : "In diesen Häusern haben wir mehr als die Küche gebaut: Garderoben, Waschtische, Bänke und Einbauschränke in demselben Holz und Lack."}
            </p>
          </div>
          <div className="bg-paper">
            {houses.map((feature, index) => (
              <ProjectFeature key={feature.href} feature={feature} variant={index % 4} locale={locale} />
            ))}
          </div>
        </section>
      ) : null}
    </CollectionHub>
  );
}
