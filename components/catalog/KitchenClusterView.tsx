import LocaleLink from "@/components/LocaleLink";
import CmsImage from "@/components/CmsImage";
import GutZuWissen from "@/components/GutZuWissen";
import AtelierFacts from "@/components/catalog/hub/AtelierFacts";
import AtelierVisit from "@/components/catalog/hub/AtelierVisit";
import ChapterIndex from "@/components/catalog/hub/ChapterIndex";
import ChapterSpread from "@/components/catalog/hub/ChapterSpread";
import CloseAtelier from "@/components/catalog/hub/CloseAtelier";
import CollectionHero from "@/components/catalog/hub/CollectionHero";
import CollectionSiblings from "@/components/catalog/hub/CollectionSiblings";
import ColorField from "@/components/catalog/hub/ColorField";
import Interlude from "@/components/catalog/hub/Interlude";
import LookRail from "@/components/catalog/hub/LookRail";
import LookStrip from "@/components/catalog/hub/LookStrip";
import PriceStance from "@/components/catalog/hub/PriceStance";
import StatementSpread from "@/components/catalog/hub/StatementSpread";
import type { KitchenCluster, KitchenTopic, Project } from "@/lib/catalog";
import {
  clusterLookTitle,
  presentCluster,
} from "@/lib/collection-clusters";
import type { Locale } from "@/lib/i18n";

export default function KitchenClusterView({
  cluster,
  topics,
  projects,
  locale,
}: {
  cluster: KitchenCluster;
  topics: KitchenTopic[];
  projects: Project[];
  locale: Locale;
}) {
  const hub = presentCluster(cluster.slug, locale, topics, projects);
  const continueLabel = locale === "en" ? "Open this" : "Öffnen";
  const asideEyebrow = locale === "en" ? "Worth knowing" : "Gut zu wissen";
  const indexHint =
    locale === "en" ? "To the overview" : "Zur Übersicht";
  const housesTitle = locale === "en" ? "Houses, not halls" : "Häuser, nicht Hallen";
  const siblingsEyebrow = locale === "en" ? "Further collections" : "Weitere Sammlungen";
  const siblingsTitle =
    locale === "en" ? "Other ways into the kitchen." : "Andere Zugänge zur Küche.";

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
        label={locale === "en" ? "Looks" : "Ansichten"}
      />
      <PriceStance line={hub.priceLine} />
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
        eyebrow={locale === "en" ? "To the hand" : "An die Hand"}
        title={clusterLookTitle(cluster.slug, locale)}
      />

      {hub.houses.length > 0 ? (
        <section className="border-b border-line bg-karte">
          <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
            <h2 className="font-serif text-[32px] font-medium tracking-[-0.03em] text-ink md:text-[40px]">
              {housesTitle}
            </h2>
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-12">
              {hub.houses.map((item, index) => (
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
                        src={item.image}
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

      <CollectionSiblings
        siblings={hub.siblings}
        eyebrow={siblingsEyebrow}
        title={siblingsTitle}
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
