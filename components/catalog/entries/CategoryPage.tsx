import LocaleLink from "@/components/LocaleLink";
import CollectionJsonLd from "@/components/catalog/CollectionJsonLd";
import EndBand from "@/components/catalog/EndBand";
import EntryHeader from "@/components/catalog/EntryHeader";
import Questions from "@/components/catalog/Questions";
import AtelierFacts from "@/components/catalog/hub/AtelierFacts";
import { Frame, StatementBand } from "@/components/catalog/collections/parts";
import { HouseLine } from "@/components/catalog/clusters/parts";
import type { PresentedTopic } from "@/lib/collection-topics";
import { photoKey } from "@/lib/utils";

/**
 * A category page such as /material/arbeitsplatten or /geraete/backen:
 * what the category is, every option in it as a card with its own page,
 * the questions people ask about it, kitchens that use it, and clear next
 * steps (see samples in the showroom, plan the kitchen).
 */

const COPY = {
  de: {
    visit: "Muster in der Ausstellung ansehen",
    plan: "Küche planen",
    choiceTitle: "Was zur Wahl steht",
    more: "Mehr erfahren",
    figures: "In Zahlen",
    houses: "In diesen Küchen verbaut",
    bandTitle: "Im Original vergleichen",
    bandText: "Muster, Kanten und Oberflächen liegen in der Ausstellung in Wolfersdorf. Wir legen Ihre Favoriten bereit, wenn Sie einen Termin vereinbaren.",
  },
  en: {
    visit: "See samples in the showroom",
    plan: "Plan your kitchen",
    choiceTitle: "What there is to choose from",
    more: "Find out more",
    figures: "In figures",
    houses: "Kitchens that use it",
    bandTitle: "Compare the real thing",
    bandText: "Samples, edges and surfaces are waiting in the showroom in Wolfersdorf. We lay out your favourites when you book an appointment.",
  },
} as const;

export default function CategoryPage({
  hub,
  faqTheme,
  path,
}: {
  hub: PresentedTopic;
  /** FAQ theme slug in the CMS whose questions belong here. */
  faqTheme?: string;
  /** The page's own path ("/material/arbeitsplatten"), for the structured data. */
  path?: string;
}) {
  const copy = COPY[hub.locale === "en" ? "en" : "de"];
  const options = hub.branches.filter(
    (branch): branch is typeof branch & { href: string } => Boolean(branch.title && branch.href),
  );

  // Every option card shows its own photo, so the hero and the sibling cards take photos nobody else shows.
  const shown = new Set(
    [...options.map((option) => option.image), ...hub.houses.map((house) => house.image), hub.facts.length > 0 ? hub.ledgerImage : ""]
      .filter(Boolean)
      .map((src) => photoKey(src)),
  );
  const spare = [hub.heroImage, hub.closeImage, hub.statementImage, hub.statementImageB, hub.visitImage].filter(Boolean);
  const take = (fallback: string) => {
    const found = [fallback, ...spare].find((src) => !shown.has(photoKey(src))) ?? fallback;
    shown.add(photoKey(found));
    return found;
  };
  const heroImage = take(hub.heroImage);
  const siblings = hub.siblings.map((sibling) => ({ ...sibling, image: take(sibling.image) }));

  return (
    <main className="bg-paper">
      {path ? (
        <CollectionJsonLd
          path={path}
          name={[hub.title, hub.emphasis].filter(Boolean).join(" ")}
          description={hub.lede}
          items={options}
          locale={hub.locale}
        />
      ) : null}

      <EntryHeader hub={hub} emphasis={hub.emphasis}>
        <div className="mt-6 flex flex-wrap gap-3">
          <LocaleLink href="/ausstellung" className="pill pill-primary">
            {copy.visit}
          </LocaleLink>
          <LocaleLink href="/beratung" className="pill pill-secondary">
            {copy.plan}
          </LocaleLink>
        </div>
      </EntryHeader>

      <figure className="mt-10 lg:mt-14">
        <Frame
          src={heroImage}
          alt={hub.heroAlt}
          className="aspect-[2/1] w-full lg:aspect-[21/9]"
          imgClassName="object-[center_35%]"
          priority
          sizes="100vw"
        />
      </figure>

      {options.length > 0 ? (
        <section className="px-5 py-16 sm:px-8 lg:px-14 lg:py-24" aria-labelledby="category-choice">
          <h2 id="category-choice" className="t-section text-ink">
            {copy.choiceTitle}
          </h2>
          <ul className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {options.map((option) => (
              <li key={option.href + option.title}>
                <LocaleLink href={option.href} className="group block">
                  <Frame
                    src={option.image}
                    alt={option.alt || option.title}
                    className="aspect-[4/3]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <h3 className="t-item mt-5 text-ink">{option.title}</h3>
                  {option.text ? (
                    <p className="mt-2 max-w-md font-sans text-[15px] leading-relaxed text-muted">{option.text}</p>
                  ) : null}
                  <span className="mt-4 inline-flex min-h-6 items-center gap-2 font-sans text-[14px] text-ink underline decoration-line underline-offset-4 group-hover:decoration-ink">
                    {copy.more}
                    <span aria-hidden="true">→</span>
                    <span className="sr-only">: {option.title}</span>
                  </span>
                </LocaleLink>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <StatementBand statement={hub.statement} note={hub.statementNote} />

      {hub.facts.length > 0 ? (
        <AtelierFacts facts={hub.facts} kicker={copy.figures} image={hub.ledgerImage} sentence={hub.ledgerLine} />
      ) : null}

      <Questions theme={faqTheme} title={hub.title} locale={hub.locale} />

      <HouseLine houses={hub.houses} title={copy.houses} />

      <EndBand
        title={copy.bandTitle}
        text={copy.bandText}
        image={hub.closeImage || undefined}
        primary={{ href: "/ausstellung", label: copy.visit }}
        tiles={siblings}
        tilesTitle={hub.siblingTitle || hub.siblingEyebrow}
        locale={hub.locale}
      />
    </main>
  );
}
