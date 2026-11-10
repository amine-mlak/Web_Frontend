import EntryHeader from "@/components/catalog/EntryHeader";
import KitchenShowcase from "@/components/catalog/KitchenShowcase";
import Questions from "@/components/catalog/Questions";
import { QuoteLine, SoftClose } from "@/components/catalog/clusters/parts";
import { Frame } from "@/components/catalog/collections/parts";
import TopicReading from "@/components/catalog/clusters/TopicReading";
import type { PresentedTopic } from "@/lib/collection-topics";

/**
 * A place: the name, one photo, the text on how BEER works there, kitchens, questions.
 * A place with kitchens of its own shows them before the text.
 */
export default function PlacePage({ hub }: { hub: PresentedTopic }) {
  const en = hub.locale === "en";
  // A place without a kitchen tagged to it shows kitchens from the workshop, and says so.
  const houses = hub.housesElsewhere
    ? en
      ? "Kitchens from our workshop"
      : "Küchen aus unserer Werkstatt"
    : en
      ? "Kitchens built here"
      : "Küchen, die hier stehen";
  const more = hub.housesElsewhere ? { href: "/projekte", label: en ? "All projects" : "Alle Projekte" } : undefined;
  const showcase = <KitchenShowcase hub={hub} title={houses} more={more} />;

  return (
    <main className="bg-paper">
      <EntryHeader hub={hub} emphasis={hub.emphasis}>
        {hub.placeLine ? <p className="type-eyebrow mt-5 text-muted">{hub.placeLine}</p> : null}
      </EntryHeader>

      {hub.facts.length ? (
        <dl className="mx-5 mt-10 grid grid-cols-2 border-t border-line sm:mx-8 sm:grid-cols-4 lg:mx-14 lg:mt-14">
          {hub.facts.map((fact) => (
            <div
              key={`${fact.value}-${fact.label}`}
              className="border-b border-line py-5 sm:border-b-0 sm:border-l sm:px-5 sm:first:border-l-0 sm:first:pl-0"
            >
              <dt className="t-item leading-none text-ink">{fact.value}</dt>
              <dd className="type-eyebrow mt-3 text-muted">{fact.label}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {hub.heroImage ? (
        <figure className="mt-10 lg:mt-14">
          <Frame
            src={hub.heroImage}
            alt={hub.heroAlt}
            className="aspect-[2/1] w-full lg:aspect-[21/9]"
            priority
            sizes="100vw"
          />
        </figure>
      ) : null}

      {hub.housesElsewhere ? null : showcase}
      <TopicReading locale={hub.locale} cms={hub} copy={hub.reading} self={hub.placeHref} />
      {hub.housesElsewhere ? showcase : null}
      <QuoteLine quote={hub.quote} source={hub.quoteSource} />
      <Questions theme="regionen" title={hub.title} locale={hub.locale} limit={4} />

      <SoftClose hub={hub} tiles={hub.siblings} tilesTitle={hub.siblingEyebrow} />
    </main>
  );
}
