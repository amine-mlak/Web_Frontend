import LocaleLink from "@/components/LocaleLink";
import CollectionJsonLd from "@/components/catalog/CollectionJsonLd";
import PageEnd from "@/components/catalog/PageEnd";
import Questions from "@/components/catalog/Questions";
import { Frame, StatementBand } from "@/components/catalog/collections/parts";
import { Crumbs, HouseLine } from "@/components/catalog/clusters/parts";
import type { KitchenTopic } from "@/lib/catalog";
import type { PresentedCluster } from "@/lib/collection-clusters";
import { pageDepth } from "@/lib/page-depth";
import { photoKey } from "@/lib/utils";

const COPY = {
  de: {
    open: (name: string) => `${name} ansehen`,
    more: (name: string) => `Mehr zur ${name}`,
    reading: "Eine Kücheninsel planen",
    houses: "Küchen aus unseren Projekten",
    allProjects: "Alle Projekte",
    worlds: "Weitere Küchenwelten",
  },
  en: {
    open: (name: string) => `See ${name.charAt(0).toLowerCase()}${name.slice(1)}`,
    more: (name: string) => `More on the ${name.charAt(0).toLowerCase()}${name.slice(1)}`,
    reading: "Planning a kitchen island",
    houses: "Kitchens from our projects",
    allProjects: "All projects",
    worlds: "More kitchen worlds",
  },
} as const;

/** The first sub-sections of an island's own reading text ("## heading", then its first paragraph). */
function excerpts(text: string | undefined, take: number) {
  const paragraphs = (text ?? "").split(/\n{2,}/).map((paragraph) => paragraph.trim());
  const found: { heading: string; text: string }[] = [];
  paragraphs.forEach((paragraph, index) => {
    const next = paragraphs[index + 1];
    if (paragraph.startsWith("## ") && next && !next.startsWith("## ")) {
      found.push({ heading: paragraph.slice(3).trim(), text: next });
    }
  });
  return found.slice(0, take);
}

/**
 * The Kücheninseln overview. A photo that drifts while the page scrolls opens it, then each
 * island has a chapter of its own: its photo, a kitchen built with it, what it is and what we
 * plan for it. Below stand excerpts from the islands' own texts and the questions buyers ask.
 * Everything comes from the islands' entries; nothing is typed here a second time.
 */
export default function InselnHub({
  hub,
  topics,
  path,
}: {
  hub: PresentedCluster;
  topics: KitchenTopic[];
  path: string;
}) {
  const copy = COPY[hub.locale === "en" ? "en" : "de"];
  const first = hub.branches[0];
  // The hero photo is not the first chapter's photo again.
  const firstImage = first ? first.cover || first.image : "";
  const hero = firstImage && photoKey(firstImage) === photoKey(hub.heroImage) ? hub.statementImage : hub.heroImage;
  const depth = pageDepth(path);

  const chapters = hub.branches.map((branch) => {
    const topic = topics.find((item) => item.slug === branch.href?.split("/").pop());
    // The entry's own texts, only when they are written in the page's language.
    const own = topic && (!topic.contentLocale || topic.contentLocale === hub.locale) ? topic : undefined;
    // Large: a whole kitchen built with this island. Small: the island's own photo from its entry.
    const large = branch.cover || branch.image || "";
    const small = [branch.image, topic?.blocks?.head?.photo?.src].find(
      (src) => src && photoKey(src) !== photoKey(large) && photoKey(src) !== photoKey(hero),
    );
    return {
      branch,
      large,
      small,
      statement: own?.blocks?.statement,
      reading: excerpts(own?.blocks?.reading?.text, 2),
    };
  });
  const reading = chapters.filter((chapter) => chapter.reading.length > 0);

  return (
    <main className="bg-paper">
      <CollectionJsonLd path={path} name={hub.title} description={hub.lede} items={hub.branches} locale={hub.locale} />
      <section data-site-hero="" className="relative isolate -mt-14 min-h-[88svh] bg-nacht" aria-labelledby="inseln-hero">
        <Frame src={hero} alt={hub.heroAlt} className="absolute inset-0" priority sizes="100vw" drift />
        <div className="hero-scrim absolute inset-0" aria-hidden />
        <div className="relative z-10 flex min-h-[88svh] items-end px-5 pb-12 sm:px-8 lg:px-gutter lg:pb-16">
          <div className="max-w-2xl">
            <Crumbs hub={hub} tone="paper" />
            <h1 id="inseln-hero" className="t-display mt-6 text-paper">
              {hub.title}
              {hub.emphasis ? <span className="block">{hub.emphasis}</span> : null}
            </h1>
            {hub.lede ? <p className="t-lede mt-5 max-w-lg text-paper/90">{hub.lede}</p> : null}
          </div>
        </div>
      </section>

      <StatementBand statement={hub.statement} note={hub.statementNote} rule={false} />

      {chapters.map(({ branch, large, small, statement }, index) => {
        const flip = index % 2 === 1;
        const href = branch.href ?? "/kuechen";
        return (
          <section
            key={href}
            className="grid items-center gap-x-12 gap-y-14 px-5 py-12 sm:px-8 lg:grid-cols-2 lg:gap-x-28 lg:px-gutter lg:py-20"
            aria-labelledby={`insel-${index}`}
          >
            <div className={`relative ${flip ? "lg:order-2" : ""}`}>
              {large ? (
                <Frame src={large} alt={branch.alt} className="aspect-[4/3] lg:aspect-[5/4]" sizes="(max-width: 1024px) 100vw, 50vw" />
              ) : null}
              {small ? (
                <Frame
                  src={small}
                  alt=""
                  className={`absolute -bottom-6 aspect-[4/3] w-[44%] shadow-[0_30px_60px_rgb(0_0_0/0.18)] lg:bottom-[9%] ${
                    flip ? "left-0 lg:-left-[12%]" : "right-0 lg:-right-[12%]"
                  }`}
                  sizes="(max-width: 1024px) 44vw, 22vw"
                />
              ) : null}
            </div>
            <div>
              <h2 id={`insel-${index}`} className="t-section text-ink">
                {branch.title}
              </h2>
              {branch.text ? <p className="t-lede mt-4 max-w-lg text-ink/85">{branch.text}</p> : null}
              {statement?.text ? (
                <p className="mt-4 max-w-lg font-sans text-[16px] leading-[1.7] text-muted">{statement.text}</p>
              ) : null}
              {statement?.points.length ? (
                <dl className="mt-7 border-b border-line">
                  {statement.points.map((point) => (
                    <div
                      key={point.title}
                      className="grid gap-1 border-t border-line py-4 md:grid-cols-[8rem_minmax(0,1fr)] md:gap-6"
                    >
                      <dt className="font-serif text-[18px] leading-[1.25] text-ink">{point.title}</dt>
                      <dd className="font-sans text-[16px] leading-[1.7] text-ink/85">{point.text}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              <LocaleLink href={href} className="btn-quiet mt-7">
                {copy.open(branch.title)} <span aria-hidden="true">→</span>
              </LocaleLink>
            </div>
          </section>
        );
      })}

      <div className="mt-12">
        <HouseLine houses={hub.houses} title={copy.houses} />
      </div>
      <div className="px-5 pb-16 sm:px-8 lg:px-gutter lg:pb-24">
        <LocaleLink href="/projekte" className="btn-quiet">
          {copy.allProjects}
        </LocaleLink>
      </div>

      {reading.length > 0 ? (
        <section className="bg-karte px-5 py-16 sm:px-8 lg:px-gutter lg:py-24" aria-labelledby="inseln-reading">
          <h2 id="inseln-reading" className="t-section text-ink">
            {copy.reading}
          </h2>
          <div className="mt-10 grid gap-x-14 gap-y-12 lg:grid-cols-3">
            {reading.map(({ branch, reading: parts }) => (
              <div key={branch.href ?? branch.title}>
                {parts.map((part) => (
                  <div key={part.heading} className="mb-8">
                    <h3 className="font-serif text-[24px] leading-[1.2] text-ink">{part.heading}</h3>
                    <p className="mt-3 max-w-xl font-sans text-[16px] leading-[1.7] text-ink/85">{part.text}</p>
                  </div>
                ))}
                <LocaleLink href={branch.href ?? "/kuechen"} className="btn-quiet">
                  {copy.more(branch.title)} <span aria-hidden="true">→</span>
                </LocaleLink>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <Questions slugs={depth?.questions} theme={depth?.theme ?? "inseln"} title={hub.title} locale={hub.locale} limit={5} />

      <PageEnd
        title={hub.closeTitle}
        text={hub.closeText}
        primary={{ href: hub.ctaHref, label: hub.ctaLabel }}
        tiles={hub.siblings.map((sibling) => ({ href: sibling.href, title: sibling.title, text: sibling.text, image: sibling.image }))}
        tilesTitle={copy.worlds}
        locale={hub.locale}
      />
    </main>
  );
}
