import { Frame } from "@/components/catalog/collections/parts";
import {
  Crumbs,
  HouseLine,
  IndexRows,
  RuledPoints,
  SoftClose,
} from "@/components/catalog/clusters/parts";
import type { PresentedCluster } from "@/lib/collection-clusters";
import type { PresentedTopic } from "@/lib/collection-topics";
import TopicReading from "@/components/catalog/clusters/TopicReading";

function housesTitle(locale: PresentedCluster["locale"]) {
  return locale === "en" ? "Built to these plans" : "Nach diesen Grundrissen";
}

export function FormenTopic({ hub, slug }: { hub: PresentedTopic; slug: string }) {
  return (
    <main className="bg-paper">
      <header className="px-5 pt-10 sm:px-8 lg:px-14 lg:pt-16">
        <Crumbs hub={hub} />
        <h1 className="mt-6 max-w-4xl font-serif text-[48px] leading-[0.92] font-medium tracking-[-0.04em] text-ink sm:text-[72px]">
          {hub.title}{" "}
          <em className="italic">{hub.emphasis}</em>
        </h1>
        <p className="mt-6 max-w-xl font-sans text-[17px] leading-relaxed font-light text-muted">
          {hub.lede}
        </p>
      </header>

      <Frame
        src={hub.heroImage}
        alt={hub.heroAlt}
        className="mt-10 aspect-[21/9] w-full"
        priority
        sizes="100vw"
      />

      <section className="mx-auto grid max-w-[90rem] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:px-14">
        <h2 className="font-serif text-[28px] leading-snug font-medium tracking-[-0.03em] text-ink italic lg:col-span-5 md:text-[34px]">
          {hub.statement}
        </h2>
        <div className="lg:col-span-7">
          <RuledPoints branches={hub.branches} />
          {hub.statementNote ? (
            <p className="mt-8 max-w-xl font-sans text-[15px] leading-relaxed text-muted">
              {hub.statementNote}
            </p>
          ) : null}
        </div>
      </section>

      <TopicReading slug={slug} locale={hub.locale} cms={hub} />
      <IndexRows items={hub.siblings} eyebrow={hub.siblingEyebrow} title={hub.siblingTitle} />
      <HouseLine houses={hub.houses} title={housesTitle(hub.locale)} />
      <SoftClose hub={hub} />
    </main>
  );
}
