import AtelierFacts from "@/components/catalog/hub/AtelierFacts";
import TopicReading from "@/components/catalog/clusters/TopicReading";
import { entryReading } from "@/lib/entry-reading";
import { Frame } from "@/components/catalog/collections/parts";
import {
  Crumbs,
  HouseLine,
  IndexRows,
  QuoteLine,
  RuledPoints,
  SoftClose,
} from "@/components/catalog/clusters/parts";
import type { PresentedTopic } from "@/lib/collection-topics";

export default function SamplePage({ hub }: { hub: PresentedTopic }) {
  const daylight = hub.locale === "en" ? "In daylight" : "Unter Tageslicht";
  const houses =
    hub.locale === "en" ? "Where it was used" : "Wo es verbaut ist";

  return (
    <main className="bg-paper">
      <header className="px-5 pt-10 sm:px-8 lg:px-14 lg:pt-16">
        <Crumbs hub={hub} />
        <div className="mt-6 grid items-end gap-8 lg:grid-cols-12">
          <h1 className="font-serif text-[48px] leading-[0.92] font-medium tracking-[-0.04em] text-ink sm:text-[72px] lg:col-span-7">
            {hub.title} <em className="italic">{hub.emphasis}</em>
          </h1>
          <p className="max-w-md font-sans text-[17px] leading-relaxed font-light text-muted lg:col-span-5">
            {hub.lede}
          </p>
        </div>
      </header>

      <figure className="mt-10">
        <Frame
          src={hub.heroImage}
          alt={hub.heroAlt}
          className="aspect-[2/1] w-full lg:aspect-[21/9]"
          imgClassName="object-[center_30%]"
          priority
          sizes="100vw"
        />
        <figcaption className="px-5 pt-3 font-sans text-[11px] tracking-[0.22em] text-muted uppercase sm:px-8 lg:px-14">
          {daylight}
        </figcaption>
      </figure>

      <div className="mt-8">
        <AtelierFacts
          facts={hub.facts}
          kicker={hub.indexEyebrow}
          image={hub.ledgerImage}
          sentence={hub.ledgerLine}
        />
      </div>

      <section className="mx-auto grid max-w-[90rem] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:px-14">
        <div className="lg:col-span-5">
          <p className="font-serif text-[28px] leading-snug font-medium tracking-[-0.03em] text-ink italic md:text-[34px]">
            {hub.statement}
          </p>
          {hub.statementNote ? (
            <p className="mt-6 max-w-md font-sans text-[15px] leading-relaxed text-muted">
              {hub.statementNote}
            </p>
          ) : null}
        </div>
        <div className="lg:col-span-7">
          <RuledPoints branches={hub.branches} />
        </div>
      </section>

      <TopicReading locale={hub.locale} cms={hub} copy={entryReading(hub.title, hub.lede, hub.locale)} />
      <QuoteLine quote={hub.quote} source={hub.quoteSource} />
      <HouseLine houses={hub.houses} title={houses} />
      <SoftClose hub={hub} />
    </main>
  );
}
