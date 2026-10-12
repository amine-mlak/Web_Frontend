import GutZuWissen from "@/components/GutZuWissen";
import AtelierFacts from "@/components/catalog/hub/AtelierFacts";
import AtelierVisit from "@/components/catalog/hub/AtelierVisit";
import ChapterIndex from "@/components/catalog/hub/ChapterIndex";
import ChapterSpread from "@/components/catalog/hub/ChapterSpread";
import CloseAtelier from "@/components/catalog/hub/CloseAtelier";
import CollectionHero from "@/components/catalog/hub/CollectionHero";
import CollectionSiblings from "@/components/catalog/hub/CollectionSiblings";
import ColorField from "@/components/catalog/hub/ColorField";
import HousesSpread from "@/components/catalog/hub/HousesSpread";
import Interlude from "@/components/catalog/hub/Interlude";
import LookRail from "@/components/catalog/hub/LookRail";
import PriceStance from "@/components/catalog/hub/PriceStance";
import StatementSpread from "@/components/catalog/hub/StatementSpread";
import TopicTone from "@/components/catalog/hub/TopicTone";
import type { PresentedTopic } from "@/lib/collection-topics";

export default function MagazinePage({ hub }: { hub: PresentedTopic }) {
  const locale = hub.locale;
  const continueLabel = locale === "en" ? "Open this" : "Öffnen";
  const asideEyebrow = locale === "en" ? "Worth knowing" : "Gut zu wissen";
  const indexHint =
    locale === "en" ? "To the overview" : "Zur Übersicht";
  const housesTitle = locale === "en" ? "Houses, not halls" : "Häuser, nicht Hallen";
  const lookEyebrow = locale === "en" ? "To the hand" : "An die Hand";

  return (
    <main className="bg-paper">
      <CollectionHero hub={hub} />
      <AtelierFacts
        facts={hub.facts}
        kicker={hub.eyebrow}
        image={hub.ledgerImage}
        sentence={hub.ledgerLine}
      />
      <StatementSpread hub={hub} />
      <PriceStance line={hub.priceLine} />
      {hub.hex && hub.toneLine ? (
        <TopicTone hex={hub.hex} title={hub.title} line={hub.toneLine} />
      ) : null}
      <ColorField swatches={hub.swatches} eyebrow={hub.indexEyebrow} />

      {hub.branches.length > 0 ? (
        <>
          <ChapterIndex
            branches={hub.branches}
            eyebrow={hub.indexEyebrow}
            hint={indexHint}
            image={hub.filmstrip[0]?.src ?? hub.heroImage}
          />
          {hub.branches.map((branch, index) => (
            <div key={`${branch.title}-${branch.href ?? index}`}>
              <ChapterSpread
                branch={branch}
                index={index}
                locale={locale}
                continueLabel={continueLabel}
              />
              {index === 1 ? (
                <Interlude quote={hub.quote} source={hub.quoteSource} />
              ) : null}
            </div>
          ))}
        </>
      ) : null}

      <LookRail
        looks={hub.looks}
        eyebrow={lookEyebrow}
        title={hub.lookTitle}
      />

      <HousesSpread houses={hub.houses} title={housesTitle} />
      <CollectionSiblings
        siblings={hub.siblings}
        eyebrow={hub.siblingEyebrow}
        title={hub.siblingTitle}
      />
      <AtelierVisit hub={hub} />
      <GutZuWissen
        content={{
          eyebrow: asideEyebrow,
          quote: hub.quote,
          source: hub.quoteSource,
        }}
      />
      <CloseAtelier hub={hub} />
    </main>
  );
}
