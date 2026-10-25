import {
  Crumbs,
  HouseLine,
  IndexRows,
  QuoteLine,
  RuledPoints,
  SoftClose,
} from "@/components/catalog/clusters/parts";
import TopicReading from "@/components/catalog/clusters/TopicReading";
import { entryReading } from "@/lib/entry-reading";
import type { PresentedTopic } from "@/lib/collection-topics";

export default function PlacePage({ hub }: { hub: PresentedTopic }) {
  const houses = hub.locale === "en" ? "Houses here" : "Häuser hier";

  return (
    <main className="bg-paper">
      <header className="px-5 pt-10 sm:px-8 lg:px-14 lg:pt-16">
        <Crumbs hub={hub} />
        <h1 className="mt-6 max-w-4xl font-serif text-[56px] leading-[0.9] font-medium tracking-[-0.045em] text-ink sm:text-[84px]">
          {hub.title}
          <span className="mt-2 block italic">{hub.emphasis}</span>
        </h1>
        <p className="mt-4 font-sans text-[12px] tracking-[0.18em] text-muted uppercase">
          {hub.placeLine}
        </p>
        <p className="mt-6 max-w-xl font-sans text-[17px] leading-relaxed font-light text-muted">
          {hub.lede}
        </p>
        <dl className="mt-12 grid grid-cols-2 border-t border-line sm:grid-cols-4">
          {hub.facts.map((fact) => (
            <div
              key={`${fact.value}-${fact.label}`}
              className="border-b border-line py-5 sm:border-b-0 sm:border-l sm:px-5 sm:first:border-l-0"
            >
              <dt className="font-serif text-[26px] leading-none text-ink">{fact.value}</dt>
              <dd className="type-eyebrow mt-3 text-muted">{fact.label}</dd>
            </div>
          ))}
        </dl>
      </header>

      <HouseLine houses={hub.houses} title={houses} />

      <section className="mx-auto grid max-w-[90rem] gap-12 border-t border-line px-5 py-16 sm:px-8 lg:grid-cols-12 lg:px-14">
        <p className="font-serif text-[28px] leading-snug font-medium tracking-[-0.03em] text-ink italic lg:col-span-5 md:text-[34px]">
          {hub.statement}
        </p>
        <div className="lg:col-span-7">
          <RuledPoints branches={hub.branches} />
        </div>
      </section>

      <TopicReading locale={hub.locale} cms={hub} copy={entryReading(hub.title, hub.lede, hub.locale)} />
      <QuoteLine quote={hub.quote} source={hub.quoteSource} />
      <SoftClose hub={hub} />
    </main>
  );
}
