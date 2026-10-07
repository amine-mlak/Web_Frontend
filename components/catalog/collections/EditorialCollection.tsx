import type { ReactNode } from "react";
import LocaleLink from "@/components/LocaleLink";
import AtelierFacts from "@/components/catalog/hub/AtelierFacts";
import ChapterIndex from "@/components/catalog/hub/ChapterIndex";
import ChapterSpread from "@/components/catalog/hub/ChapterSpread";
import CollectionHero from "@/components/catalog/hub/CollectionHero";
import Interlude from "@/components/catalog/hub/Interlude";
import LookStrip from "@/components/catalog/hub/LookStrip";
import LookRail from "@/components/catalog/hub/LookRail";
import PriceStance from "@/components/catalog/hub/PriceStance";
import StatementSpread from "@/components/catalog/hub/StatementSpread";
import type { PresentedHub } from "@/lib/collection-present";
import { Frame, HubEnd, type CollectionExtra } from "@/components/catalog/collections/parts";

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
  const continueLabel = hub.locale === "en" ? "Open this" : "Öffnen";
  const lookTitle =
    hub.locale === "en"
      ? "Surfaces before the drawing."
      : "Oberflächen vor der Zeichnung.";
  const indexHint =
    hub.locale === "en" ? "To the overview" : "Zur Übersicht";

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
      <LookStrip
        looks={hub.filmstrip}
        label={hub.locale === "en" ? "Looks" : "Ansichten"}
      />
      <PriceStance line={hub.priceLine} />

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
                locale={hub.locale}
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
        eyebrow={hub.locale === "en" ? "To the hand" : "An die Hand"}
        title={lookTitle}
      />

      {extras && extras.length > 0 ? (
        <section className="border-b border-line bg-karte">
          <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
            {extrasTitle ? (
              <h2 className="font-serif text-[32px] font-medium tracking-[-0.03em] text-ink md:text-[40px]">
                {extrasTitle}
              </h2>
            ) : null}
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-12">
              {extras.map((item, index) => (
                <li
                  key={item.href}
                  className={index === 0 ? "lg:col-span-8" : "lg:col-span-4"}
                >
                  <LocaleLink href={item.href} className="group block">
                    <Frame
                      src={item.image ?? hub.heroImage}
                      alt={item.title}
                      className={index === 0 ? "aspect-[16/10]" : "aspect-[4/5]"}
                      imgClassName="transition-transform duration-700 group-hover:scale-[1.04]"
                      sizes={index === 0 ? "(max-width: 1024px) 100vw, 66vw" : "33vw"}
                    />
                    <div className="mt-4 flex items-baseline justify-between gap-4">
                      <span className="font-serif text-[22px] leading-snug font-medium text-ink">
                        {item.title}
                      </span>
                      {item.meta ? (
                        <span className="type-eyebrow shrink-0 text-muted">
                          {item.meta}
                        </span>
                      ) : null}
                    </div>
                  </LocaleLink>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <HubEnd hub={hub}>{children}</HubEnd>
    </main>
  );
}
