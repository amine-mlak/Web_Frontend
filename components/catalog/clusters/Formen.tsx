import EntryHeader from "@/components/catalog/EntryHeader";
import { Frame } from "@/components/catalog/collections/parts";
import KitchenShowcase from "@/components/catalog/KitchenShowcase";
import { IndexRows, PointsSection, SoftClose } from "@/components/catalog/clusters/parts";
import type { PresentedCluster } from "@/lib/collection-clusters";
import type { PresentedTopic } from "@/lib/collection-topics";
import TopicReading from "@/components/catalog/clusters/TopicReading";

function housesTitle(locale: PresentedCluster["locale"]) {
  return locale === "en" ? "Built to these plans" : "Nach diesen Grundrissen";
}

export function FormenTopic({ hub, slug }: { hub: PresentedTopic; slug: string }) {
  return (
    <main className="bg-paper">
      <EntryHeader hub={hub} emphasis={hub.emphasis} />

      <Frame
        src={hub.heroImage}
        alt={hub.heroAlt}
        className="mt-10 aspect-[2/1] w-full lg:mt-14 lg:aspect-[21/9]"
        priority
        sizes="100vw"
      />

      <PointsSection hub={hub} />
      <TopicReading slug={slug} locale={hub.locale} cms={hub} />
      <IndexRows items={hub.siblings} eyebrow={hub.siblingEyebrow} title={hub.siblingTitle} />
      <KitchenShowcase hub={hub} title={housesTitle(hub.locale)} />
      <SoftClose hub={hub} />
    </main>
  );
}
