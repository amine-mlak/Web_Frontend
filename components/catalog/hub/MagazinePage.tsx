import CollectionSiblings from "@/components/catalog/hub/CollectionSiblings";
import ChapterRun from "@/components/catalog/hub/ChapterRun";
import ColorField from "@/components/catalog/hub/ColorField";
import HousesSpread from "@/components/catalog/hub/HousesSpread";
import LookRail from "@/components/catalog/hub/LookRail";
import MagazineOpen from "@/components/catalog/hub/MagazineOpen";
import TopicTone from "@/components/catalog/hub/TopicTone";
import { HubEnd } from "@/components/catalog/collections/parts";
import type { PresentedTopic } from "@/lib/collection-topics";

export default function MagazinePage({ hub }: { hub: PresentedTopic }) {
  const locale = hub.locale;
  const housesTitle = locale === "en" ? "Houses, not halls" : "Häuser, nicht Hallen";
  const lookEyebrow = locale === "en" ? "To the hand" : "An die Hand";

  return (
    <main className="bg-paper">
      <MagazineOpen hub={hub} />
      {hub.hex && hub.toneLine ? (
        <TopicTone hex={hub.hex} title={hub.title} line={hub.toneLine} />
      ) : null}
      <ColorField swatches={hub.swatches} eyebrow={hub.indexEyebrow} />
      <ChapterRun hub={hub} />
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
      <HubEnd hub={hub} />
    </main>
  );
}
