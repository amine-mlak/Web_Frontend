import AtelierFacts from "@/components/catalog/hub/AtelierFacts";
import EntryHeader from "@/components/catalog/EntryHeader";
import KitchenShowcase from "@/components/catalog/KitchenShowcase";
import { IndexRows, PointsSection, SoftClose } from "@/components/catalog/clusters/parts";
import type { PresentedCluster } from "@/lib/collection-clusters";
import type { PresentedTopic } from "@/lib/collection-topics";
import TopicReading from "@/components/catalog/clusters/TopicReading";
import { PageGuide, PageQuestions } from "@/components/catalog/PageDepth";

function housesTitle(locale: PresentedCluster["locale"]) {
  return locale === "en" ? "Projects with this solution" : "Projekte mit dieser Lösung";
}

export function BesondereTopic({ hub, slug }: { hub: PresentedTopic; slug: string }) {
  return (
    <main className="bg-paper">
      <EntryHeader hub={hub} emphasis={hub.emphasis} />

      <div className="mt-10 border-t border-line lg:mt-14">
        <AtelierFacts facts={hub.facts} kicker={hub.eyebrow} image={hub.heroImage} />
      </div>

      <PointsSection hub={hub} />
      <KitchenShowcase hub={hub} title={housesTitle(hub.locale)} />
      <TopicReading slug={slug} locale={hub.locale} cms={hub} />
      <PageGuide hub={hub} />
      <PageQuestions hub={hub} />
      <IndexRows items={hub.siblings} title={hub.siblingTitle} />
      <SoftClose hub={hub} />
    </main>
  );
}
