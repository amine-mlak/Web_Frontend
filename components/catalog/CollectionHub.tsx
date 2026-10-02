import type { ReactNode } from "react";
import LocaleLink from "@/components/LocaleLink";
import CmsImage from "@/components/CmsImage";
import GutZuWissen from "@/components/GutZuWissen";
import AtelierFacts from "@/components/catalog/hub/AtelierFacts";
import AtelierVisit from "@/components/catalog/hub/AtelierVisit";
import ChapterIndex from "@/components/catalog/hub/ChapterIndex";
import ChapterSpread from "@/components/catalog/hub/ChapterSpread";
import CloseAtelier from "@/components/catalog/hub/CloseAtelier";
import CollectionHero from "@/components/catalog/hub/CollectionHero";
import Interlude from "@/components/catalog/hub/Interlude";
import LookRail from "@/components/catalog/hub/LookRail";
import PriceStance from "@/components/catalog/hub/PriceStance";
import StatementSpread from "@/components/catalog/hub/StatementSpread";
import type { CollectionBranch, CollectionHubId } from "@/lib/collection-hubs";
import { presentHub } from "@/lib/collection-present";
import { resolveDevImage, devPhoto } from "@/lib/dev-images";
import type { Locale } from "@/lib/i18n";

export type CollectionExtra = {
  href: string;
  title: string;
  meta?: string;
  image?: string;
};

export default function CollectionHub({
  id,
  locale,
  branches,
  extras,
  extrasTitle,
  children,
}: {
  id: CollectionHubId;
  locale: Locale;
  branches?: CollectionBranch[];
  extras?: CollectionExtra[];
  extrasTitle?: string;
  children?: ReactNode;
}) {
  const hub = presentHub(id, locale, branches);
  const continueLabel = locale === "en" ? "Open this chapter" : "Kapitel öffnen";
  const asideEyebrow = locale === "en" ? "Worth knowing" : "Gut zu wissen";
  const lookTitle =
    locale === "en"
      ? "Surfaces before the drawing."
      : "Oberflächen vor der Zeichnung.";
  const indexHint =
    locale === "en" ? "Jump to a chapter" : "Zum Kapitel springen";

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
                    <figure
                      className={`relative overflow-hidden bg-nacht ${
                        index === 0 ? "aspect-[16/10]" : "aspect-[4/5]"
                      }`}
                    >
                      <CmsImage
                        src={resolveDevImage(item.image, devPhoto(40 + index, 900))}
                        alt={item.title}
                        fill
                        sizes={index === 0 ? "(max-width: 1024px) 100vw, 66vw" : "33vw"}
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    </figure>
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

      {children}

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
