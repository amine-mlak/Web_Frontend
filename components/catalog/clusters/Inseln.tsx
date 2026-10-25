import LocaleLink from "@/components/LocaleLink";
import { Frame } from "@/components/catalog/collections/parts";
import {
  ClusterLinks,
  Crumbs,
  HouseLine,
  RuledPoints,
  SoftClose,
} from "@/components/catalog/clusters/parts";
import type { PresentedCluster } from "@/lib/collection-clusters";
import type { PresentedBranch } from "@/lib/collection-present";
import type { PresentedTopic } from "@/lib/collection-topics";
import TopicReading from "@/components/catalog/clusters/TopicReading";

function housesTitle(locale: PresentedCluster["locale"]) {
  return locale === "en" ? "Islands that stand" : "Inseln, die stehen";
}

function Pedestal({
  branch,
  href,
  title,
  text,
  image,
  kicker,
}: {
  branch?: PresentedBranch;
  href: string;
  title: string;
  text: string;
  image: string;
  kicker?: string;
}) {
  return (
    <LocaleLink href={href} className="group block">
      <Frame
        src={image}
        alt={branch?.alt || title}
        srcSet={branch?.srcSet}
        className="aspect-[3/4]"
        imgClassName="transition-transform duration-700 group-hover:scale-[1.03]"
        sizes="(max-width: 1024px) 100vw, 33vw"
      />
      {kicker ? (
        <p className="mt-5 font-sans text-[11px] tracking-[0.22em] text-messing uppercase">
          {kicker}
        </p>
      ) : null}
      <h3 className="mt-2 font-serif text-[28px] leading-tight font-medium text-paper">
        {title}
      </h3>
      <p className="mt-3 font-sans text-[15px] leading-relaxed font-light text-paper/70">
        {text}
      </p>
    </LocaleLink>
  );
}

export function InselnCluster({ hub }: { hub: PresentedCluster }) {
  return (
    <main className="bg-paper">
      <header className="px-5 pt-10 pb-10 sm:px-8 lg:px-14 lg:pt-16">
        <p className="type-eyebrow text-gold">{hub.eyebrow}</p>
        <div className="mt-6 grid items-end gap-8 lg:grid-cols-12">
          <h1 className="font-serif text-[52px] leading-[0.9] font-medium tracking-[-0.045em] text-ink sm:text-[80px] lg:col-span-7">
            {hub.title}
            <span className="mt-2 block italic">{hub.emphasis}</span>
          </h1>
          <p className="max-w-md font-sans text-[17px] leading-relaxed font-light text-muted lg:col-span-5">
            {hub.lede}
          </p>
        </div>
        <dl className="mt-12 grid grid-cols-2 border-t border-line sm:grid-cols-4">
          {hub.facts.map((fact) => (
            <div key={`${fact.value}-${fact.label}`} className="border-b border-line py-5 sm:border-b-0 sm:border-l sm:px-5 sm:first:border-l-0">
              <dt className="font-serif text-[26px] leading-none text-ink">{fact.value}</dt>
              <dd className="type-eyebrow mt-3 text-muted">{fact.label}</dd>
            </div>
          ))}
        </dl>
      </header>

      <section className="bg-nacht px-5 py-16 sm:px-8 lg:px-14 lg:py-24" aria-labelledby="inseln-roles">
        <h2 id="inseln-roles" className="max-w-3xl font-serif text-[28px] leading-snug font-medium text-paper italic md:text-[36px]">
          {hub.statement}
        </h2>
        <ul className="mt-14 grid gap-12 lg:grid-cols-3">
          {hub.branches.map((branch) => (
            <li key={branch.href ?? branch.title}>
              <Pedestal
                branch={branch}
                href={branch.href ?? "/kuechen/inseln"}
                title={branch.title}
                text={branch.text}
                image={branch.image}
                kicker={branch.kicker}
              />
            </li>
          ))}
        </ul>
        {hub.quote ? (
          <figure className="mt-16 border-t border-paper/15 pt-10">
            <blockquote className="max-w-2xl font-serif text-[22px] leading-snug text-paper/90 italic">
              {hub.quote}
            </blockquote>
            <figcaption className="mt-4 font-sans text-[11px] tracking-[0.18em] text-messing uppercase">
              {hub.quoteSource}
            </figcaption>
          </figure>
        ) : null}
      </section>

      <HouseLine houses={hub.houses} title={housesTitle(hub.locale)} />
      <ClusterLinks hub={hub} />
      <SoftClose hub={hub} />
    </main>
  );
}

export function InselnTopic({ hub, slug }: { hub: PresentedTopic; slug: string }) {
  return (
    <main className="bg-paper">
      <header className="px-5 pt-10 sm:px-8 lg:px-14 lg:pt-16">
        <Crumbs hub={hub} />
        <h1 className="mt-6 max-w-3xl font-serif text-[48px] leading-[0.92] font-medium tracking-[-0.04em] text-ink sm:text-[68px]">
          {hub.title} <em className="italic">{hub.emphasis}</em>
        </h1>
        <p className="mt-5 max-w-xl font-sans text-[17px] leading-relaxed font-light text-muted">
          {hub.lede}
        </p>
      </header>

      <section className="mt-10 bg-nacht px-5 py-12 sm:px-8 lg:px-14 lg:py-20">
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
      </section>

      <section className="mx-auto grid max-w-[90rem] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:px-14">
        <p className="font-serif text-[26px] leading-snug font-medium text-ink lg:col-span-5">
          {hub.statement}
        </p>
        <div className="lg:col-span-7">
          <RuledPoints branches={hub.branches} />
        </div>
      </section>

      {hub.siblings.length > 0 ? (
        <section className="bg-nacht px-5 py-16 sm:px-8 lg:px-14" aria-labelledby="inseln-siblings">
          <h2 id="inseln-siblings" className="font-serif text-[32px] font-medium text-paper">
            {hub.siblingTitle}
          </h2>
          <ul className="mt-10 grid gap-10 sm:grid-cols-2">
            {hub.siblings.map((item) => (
              <li key={item.href}>
                <Pedestal
                  href={item.href}
                  title={item.title}
                  text={item.text}
                  image={item.image}
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <TopicReading slug={slug} locale={hub.locale} cms={hub} />
      <HouseLine houses={hub.houses} title={housesTitle(hub.locale)} />
      <SoftClose hub={hub} />
    </main>
  );
}
