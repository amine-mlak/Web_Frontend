import AtelierFacts from "@/components/catalog/hub/AtelierFacts";
import CollectionHero from "@/components/catalog/hub/CollectionHero";
import PriceStance from "@/components/catalog/hub/PriceStance";
import StatementSpread from "@/components/catalog/hub/StatementSpread";
import type { PresentedHub } from "@/lib/collection-present";

export default function MagazineOpen({ hub }: { hub: PresentedHub }) {
  return (
    <>
      <CollectionHero hub={hub} />
      <AtelierFacts
        facts={hub.facts}
        kicker={hub.eyebrow}
        image={hub.ledgerImage}
        sentence={hub.ledgerLine}
      />
      <StatementSpread hub={hub} />
      <PriceStance line={hub.priceLine} />
    </>
  );
}
