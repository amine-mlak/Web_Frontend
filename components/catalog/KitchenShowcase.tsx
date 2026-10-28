import ProjectFeature from "@/components/catalog/ProjectFeature";
import { HouseLine } from "@/components/catalog/clusters/parts";
import type { PresentedTopic } from "@/lib/collection-topics";

/**
 * The real kitchens of a page: up to four shown one by one (photo, detail, text, links), then a
 * line with further ones. Without featured kitchens only the line, with the page's own houses.
 */
export default function KitchenShowcase({ hub, title }: { hub: PresentedTopic; title: string }) {
  const features = hub.features ?? [];
  const featured = new Set(features.map((feature) => feature.href));
  // With few kitchens of its own the line fills up with the page's other houses.
  const further = hub.taggedHouses?.length ? hub.taggedHouses : hub.houses.filter((house) => !featured.has(house.href));

  return (
    <>
      {features.map((feature, index) => (
        <ProjectFeature key={feature.href} feature={feature} variant={index % 4} locale={hub.locale} />
      ))}
      <HouseLine houses={further} title={title} />
    </>
  );
}
