import { useId } from "react";
import ProjectFeature from "@/components/catalog/ProjectFeature";
import { HouseLine } from "@/components/catalog/clusters/parts";
import type { PresentedTopic } from "@/lib/collection-topics";

/**
 * The real kitchens of a page, as one section under one title: up to four shown one by one
 * (photo, detail, text, links), then a line with further ones. Without featured kitchens only
 * the line, with the page's own houses.
 */
export default function KitchenShowcase({
  hub,
  title,
  more,
}: {
  hub: PresentedTopic;
  title: string;
  /** One link beside the title when the page only has the line of cards. */
  more?: { href: string; label: string };
}) {
  const headingId = useId();
  const features = hub.features ?? [];
  const featured = new Set(features.map((feature) => feature.href));
  // With few kitchens of its own the line fills up with the page's other houses.
  const further = hub.taggedHouses?.length ? hub.taggedHouses : hub.houses.filter((house) => !featured.has(house.href));

  if (features.length === 0) {
    return <HouseLine houses={further} title={title} more={more} />;
  }

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="t-section px-5 pt-16 text-ink sm:px-8 lg:px-14 lg:pt-24">
        {title}
      </h2>
      {/* The section title already gives the first kitchen its air. */}
      <div className="[&>article:first-child]:pt-10 lg:[&>article:first-child]:pt-14">
        {features.map((feature, index) => (
          <ProjectFeature key={feature.href} feature={feature} variant={index % 4} locale={hub.locale} level={3} />
        ))}
      </div>
      <HouseLine houses={further} title={hub.locale === "en" ? "More kitchens" : "Weitere Küchen"} sub />
    </section>
  );
}
