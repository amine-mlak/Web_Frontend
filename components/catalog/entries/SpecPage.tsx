import CmsImage from "@/components/CmsImage";
import TopicReading from "@/components/catalog/clusters/TopicReading";
import { entryReading } from "@/lib/entry-reading";
import { Frame } from "@/components/catalog/collections/parts";
import {
  Crumbs,
  HouseLine,
  QuoteLine,
  RuledPoints,
  SoftClose,
} from "@/components/catalog/clusters/parts";
import { APPLIANCE_BRANDS } from "@/lib/appliance-media";
import type { PresentedTopic } from "@/lib/collection-topics";
import { cn } from "@/lib/utils";

function markFor(hub: PresentedTopic) {
  const name = hub.heroAlt.trim().toLowerCase();
  return APPLIANCE_BRANDS.find((brand) => brand.name.toLowerCase() === name);
}

export default function SpecPage({ hub }: { hub: PresentedTopic }) {
  const mark = markFor(hub);
  const houses = hub.locale === "en" ? "Fitted in these houses" : "In diesen Häusern";

  return (
    <main className="bg-paper">
      <header className="px-5 pt-10 sm:px-8 lg:px-14 lg:pt-16">
        <Crumbs hub={hub} />
        <h1 className="mt-6 max-w-4xl font-serif text-[48px] leading-[0.92] font-medium tracking-[-0.04em] text-ink sm:text-[72px]">
          {hub.title} <em className="italic">{hub.emphasis}</em>
        </h1>
        <p className="mt-5 max-w-xl font-sans text-[17px] leading-relaxed font-light text-muted">
          {hub.lede}
        </p>
      </header>

      <section className="mt-10 bg-nacht px-5 py-14 sm:px-8 lg:px-14 lg:py-20">
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
        <Frame
          src={hub.heroImage}
          alt={hub.heroAlt}
          className="mx-auto aspect-[16/10] max-w-5xl"
          priority
          sizes="(max-width: 1024px) 100vw, 64rem"
        />
        <p className="mx-auto mt-10 max-w-2xl text-center font-serif text-[24px] leading-snug text-paper italic md:text-[30px]">
          {hub.ledgerLine}
        </p>
        <dl className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-px bg-paper/15 sm:grid-cols-4">
          {hub.facts.map((fact) => (
            <div key={`${fact.value}-${fact.label}`} className="bg-nacht px-4 py-5">
              <dt className="font-serif text-[22px] leading-none text-messing">{fact.value}</dt>
              <dd className="type-eyebrow mt-3 text-paper/55">{fact.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto grid max-w-[90rem] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:px-14">
        <h2 className="font-serif text-[26px] leading-snug font-medium text-ink lg:col-span-5">
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

      <TopicReading locale={hub.locale} cms={hub} copy={entryReading(hub.title, hub.lede, hub.locale)} />
      <QuoteLine quote={hub.quote} source={hub.quoteSource} />
      <HouseLine houses={hub.houses} title={houses} />
      <SoftClose hub={hub} />
    </main>
  );
}
