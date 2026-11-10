import CmsImage from "@/components/CmsImage";
import EntryHeader from "@/components/catalog/EntryHeader";
import KitchenShowcase from "@/components/catalog/KitchenShowcase";
import TopicReading from "@/components/catalog/clusters/TopicReading";
import { Frame } from "@/components/catalog/collections/parts";
import { PointsSection, QuoteLine, SoftClose } from "@/components/catalog/clusters/parts";
import { APPLIANCE_BRANDS } from "@/lib/appliance-media";
import type { PresentedTopic } from "@/lib/collection-topics";
import { cn } from "@/lib/utils";

function markFor(hub: PresentedTopic) {
  const name = hub.heroAlt.trim().toLowerCase();
  return APPLIANCE_BRANDS.find((brand) => brand.name.toLowerCase() === name);
}

/** An appliance or a brand: the name, the object on dark with its facts, the points, the kitchens. */
export default function SpecPage({ hub }: { hub: PresentedTopic }) {
  const mark = markFor(hub);
  const houses = hub.locale === "en" ? "Fitted in these houses" : "In diesen Häusern";

  return (
    <main className="bg-paper">
      <EntryHeader hub={hub} emphasis={hub.emphasis} />

      <section
        className="mt-10 bg-nacht px-5 py-14 sm:px-8 lg:mt-14 lg:px-14 lg:py-20"
        aria-label={hub.locale === "en" ? "At a glance" : "Auf einen Blick"}
      >
        {mark ? (
          <span className="relative mb-10 block h-8 w-40">
            <CmsImage
              src={mark.logo}
              alt={mark.name}
              fill
              sizes="160px"
              className={cn("object-contain object-left", mark.invert && "brightness-0 invert")}
            />
          </span>
        ) : null}
        <Frame
          src={hub.heroImage}
          alt={hub.heroAlt}
          className="mx-auto aspect-[16/10] max-w-5xl"
          priority
          sizes="(max-width: 1024px) 100vw, 64rem"
        />
        {hub.ledgerLine ? (
          <p className="t-lead mx-auto mt-10 max-w-2xl text-center text-paper">{hub.ledgerLine}</p>
        ) : null}
        {hub.facts.length ? (
          <dl className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-px bg-paper/15 sm:grid-cols-4">
            {hub.facts.map((fact) => (
              <div key={`${fact.value}-${fact.label}`} className="bg-nacht px-4 py-5">
                <dt className="t-item leading-none text-messing">{fact.value}</dt>
                <dd className="type-eyebrow mt-3 text-paper/55">{fact.label}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </section>

      <PointsSection hub={hub} />
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
