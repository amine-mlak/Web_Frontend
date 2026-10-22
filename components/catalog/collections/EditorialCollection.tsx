import type { ReactNode } from "react";
import ChapterRun from "@/components/catalog/hub/ChapterRun";
import HousesSpread from "@/components/catalog/hub/HousesSpread";
import LookRail from "@/components/catalog/hub/LookRail";
import MagazineOpen from "@/components/catalog/hub/MagazineOpen";
import type { PresentedHub } from "@/lib/collection-present";
import { HubEnd, type CollectionExtra } from "@/components/catalog/collections/parts";

export default function EditorialCollection({
  hub,
  extras,
  extrasTitle,
  children,
}: {
  hub: PresentedHub;
  extras?: CollectionExtra[];
  extrasTitle?: string;
  children?: ReactNode;
}) {
  const lookTitle =
    hub.locale === "en"
      ? "Surfaces before the drawing."
      : "Oberflächen vor der Zeichnung.";
  const cards = (extras ?? []).map((item) => ({
    href: item.href,
    title: item.title,
    meta: item.meta,
    image: item.image || hub.heroImage,
  }));

  return (
    <main className="bg-paper">
      <MagazineOpen hub={hub} />
      <ChapterRun hub={hub} />
      <LookRail
        looks={hub.looks}
        eyebrow={hub.locale === "en" ? "To the hand" : "An die Hand"}
        title={lookTitle}
      />
      <HousesSpread houses={cards} title={extrasTitle} />
      <HubEnd hub={hub}>{children}</HubEnd>
    </main>
  );
}
