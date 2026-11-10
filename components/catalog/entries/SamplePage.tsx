import AtelierFacts from "@/components/catalog/hub/AtelierFacts";
import EntryHeader from "@/components/catalog/EntryHeader";
import KitchenShowcase from "@/components/catalog/KitchenShowcase";
import { CloseBand, PhotoOpener, PhotoPair } from "@/components/catalog/PhotoStory";
import TopicReading from "@/components/catalog/clusters/TopicReading";
import { Frame } from "@/components/catalog/collections/parts";
import { PointsSection, QuoteLine, SoftClose } from "@/components/catalog/clusters/parts";
import type { PresentedTopic } from "@/lib/collection-topics";

/** A material: the name, the surface, the kitchens it was built into, its facts, the points. */
export default function SamplePage({ hub }: { hub: PresentedTopic }) {
  const houses = hub.locale === "en" ? "Where it was used" : "Wo es verbaut ist";
  // Photos of the material itself, found in the built kitchens. Without any, the CMS image opens the page.
  const story = hub.story ?? {};

  return (
    <main className="bg-paper">
      <EntryHeader hub={hub} emphasis={hub.emphasis} />

      {story.opener ? (
        <PhotoOpener opener={story.opener} locale={hub.locale} />
      ) : (
        <figure className="mt-10 lg:mt-14">
          <Frame
            src={hub.heroImage}
            alt={hub.heroAlt}
            className="aspect-[2/1] w-full lg:aspect-[21/9]"
            imgClassName="object-[center_30%]"
            priority
            sizes="100vw"
          />
        </figure>
      )}

      <PointsSection hub={hub} />

      {story.band ? <CloseBand photo={story.band} locale={hub.locale} className="pb-16 lg:pb-24" /> : null}

      <AtelierFacts
        facts={hub.facts}
        kicker={hub.locale === "en" ? "The material in figures" : "Das Material in Zahlen"}
        image={story.ledger?.src ?? hub.ledgerImage}
        imageAlt={story.ledger?.alt}
        sentence={hub.ledgerLine}
      />

      {story.pair ? <PhotoPair pair={story.pair} locale={hub.locale} /> : null}

      <KitchenShowcase hub={hub} title={houses} />

      <TopicReading
        locale={hub.locale}
        cms={hub}
        // Only the CMS reading text: the shared fallback put the same Wolfersdorf paragraph on every page.
      />
      <QuoteLine quote={hub.quote} source={hub.quoteSource} />
      <SoftClose hub={hub} tiles={hub.siblings} tilesTitle={hub.siblingEyebrow} />
    </main>
  );
}
