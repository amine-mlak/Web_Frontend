import CmsImage from "@/components/CmsImage";
import EntryHeader from "@/components/catalog/EntryHeader";
import { PageGuide, PageQuestions } from "@/components/catalog/PageDepth";
import KitchenShowcase from "@/components/catalog/KitchenShowcase";
import {
  CloseBand,
  PhotoOpener,
  PhotoPair,
} from "@/components/catalog/PhotoStory";
import TopicReading from "@/components/catalog/clusters/TopicReading";
import { Frame } from "@/components/catalog/collections/parts";
import {
  PointsSection,
  QuoteLine,
  SoftClose,
} from "@/components/catalog/clusters/parts";
import { APPLIANCE_BRANDS } from "@/lib/appliance-media";
import type { PresentedTopic } from "@/lib/collection-topics";
import { cn } from "@/lib/utils";

function markFor(hub: PresentedTopic) {
  const name = hub.heroAlt.trim().toLowerCase();
  return APPLIANCE_BRANDS.find((brand) => brand.name.toLowerCase() === name);
}

/**
 * An appliance or a brand: the name, three photos of it in one kitchen, its facts on dark, the
 * points, two more photos, the kitchens, one close-up from edge to edge. Where no gallery photo
 * shows it, the CMS image stands framed on the dark band as before.
 */
export default function SpecPage({ hub }: { hub: PresentedTopic }) {
  const mark = markFor(hub);
  const houses =
    hub.locale === "en" ? "Kitchens that use it" : "In diesen Küchen verbaut";
  // Photos that show the appliance or the brand in the built kitchens. Without any, the CMS image stands on the dark band.
  const story = hub.story ?? {};

  return (
    <main className="bg-paper">
      <EntryHeader hub={hub} emphasis={hub.emphasis} />

      {story.opener ? (
        <PhotoOpener opener={story.opener} locale={hub.locale} />
      ) : null}

      {mark || !story.opener || hub.facts.length ? (
        <section
          className="mt-10 bg-nacht px-5 py-14 sm:px-8 lg:mt-14 lg:px-gutter lg:py-20"
          aria-label={hub.locale === "en" ? "At a glance" : "Auf einen Blick"}
        >
          {mark ? (
            <span className="relative mb-10 block h-8 w-40">
              <CmsImage
                src={mark.logo}
                alt={mark.name}
                fill
                sizes="160px"
                className={cn(
                  "object-contain object-left",
                  mark.invert && "brightness-0 invert",
                )}
              />
            </span>
          ) : null}
          {story.opener ? null : (
            <Frame
              src={hub.heroImage}
              alt={hub.heroAlt}
              className="mx-auto mb-10 aspect-[16/10] max-w-5xl"
              priority
              sizes="(max-width: 1024px) 100vw, 64rem"
            />
          )}
          {hub.facts.length ? (
            <dl className="mx-auto grid max-w-5xl grid-cols-2 gap-px bg-paper/15 sm:grid-cols-4">
              {hub.facts.map((fact) => (
                <div
                  key={`${fact.value}-${fact.label}`}
                  className="bg-nacht px-4 py-5"
                >
                  <dt className="t-item leading-none text-messing">
                    {fact.value}
                  </dt>
                  <dd className="type-eyebrow mt-3 text-paper/55">
                    {fact.label}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </section>
      ) : null}

      <PointsSection hub={hub} />
      {story.pair ? (
        <PhotoPair pair={story.pair} locale={hub.locale} flip />
      ) : null}
      <TopicReading locale={hub.locale} cms={hub} copy={hub.reading} />
      <KitchenShowcase hub={hub} title={houses} />
      {story.band ? <CloseBand photo={story.band} locale={hub.locale} /> : null}
      <PageGuide hub={hub} />
      <PageQuestions hub={hub} />
      <QuoteLine quote={hub.quote} source={hub.quoteSource} />
      <SoftClose
        hub={hub}
        tiles={hub.siblings}
        tilesTitle={hub.siblingEyebrow}
      />
    </main>
  );
}
