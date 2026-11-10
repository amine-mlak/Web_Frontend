import LocaleLink from "@/components/LocaleLink";
import EntryHeader from "@/components/catalog/EntryHeader";
import KitchenShowcase from "@/components/catalog/KitchenShowcase";
import { Frame } from "@/components/catalog/collections/parts";
import { PointsSection, SoftClose } from "@/components/catalog/clusters/parts";
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
        sizes="(max-width: 1024px) 100vw, 33vw"
      />
      {kicker ? <p className="type-eyebrow mt-5 text-messing">{kicker}</p> : null}
      <h3 className="t-feature mt-4 text-paper">{title}</h3>
      <p className="mt-3 font-sans text-[15px] leading-relaxed font-light text-paper/70">{text}</p>
    </LocaleLink>
  );
}

export function InselnTopic({ hub, slug }: { hub: PresentedTopic; slug: string }) {
  return (
    <main className="bg-paper">
      <EntryHeader hub={hub} emphasis={hub.emphasis} />

      <section
        className="mt-10 bg-nacht px-5 py-12 sm:px-8 lg:mt-14 lg:px-14 lg:py-20"
        aria-label={hub.heroAlt || hub.title}
      >
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
      </section>

      <PointsSection hub={hub} />

      {hub.siblings.length > 0 ? (
        <section className="bg-nacht px-5 py-16 sm:px-8 lg:px-14 lg:py-24" aria-labelledby="inseln-siblings">
          <h2 id="inseln-siblings" className="t-section text-paper">
            {hub.siblingTitle}
          </h2>
          <ul className="mt-10 grid gap-10 sm:grid-cols-2">
            {hub.siblings.map((item) => (
              <li key={item.href}>
                <Pedestal href={item.href} title={item.title} text={item.text} image={item.image} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <TopicReading slug={slug} locale={hub.locale} cms={hub} />
      <KitchenShowcase hub={hub} title={housesTitle(hub.locale)} />
      <SoftClose hub={hub} />
    </main>
  );
}
