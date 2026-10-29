import CollectionHero from "@/components/catalog/hub/CollectionHero";
import StatementSpread from "@/components/catalog/hub/StatementSpread";
import type { PresentedHub } from "@/lib/collection-present";

export default function MagazineOpen({ hub }: { hub: PresentedHub }) {
  return (
    <>
      <CollectionHero hub={hub} />
      <StatementSpread hub={hub} />
    </>
  );
}
