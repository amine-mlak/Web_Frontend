import Accordion from "@/components/Accordion";
import FaqJsonLd from "@/components/FaqJsonLd";
import LocaleLink from "@/components/LocaleLink";
import AtelierFacts from "@/components/catalog/hub/AtelierFacts";
import { Frame } from "@/components/catalog/collections/parts";
import { Crumbs, HouseLine, SiblingCards } from "@/components/catalog/clusters/parts";
import { filterFaqItems } from "@/lib/faq";
import type { PresentedTopic } from "@/lib/collection-topics";
import { fetchFaqHub } from "@/lib/strapi";
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
    choice: "Die Auswahl",
    choiceTitle: "Was zur Wahl steht.",
    more: "Mehr erfahren",
    faqEyebrow: "Häufige Fragen",
    faqAll: "Alle Fragen zum Thema",
    houses: "In diesen Küchen verbaut",
    bandTitle: "Im Original vergleichen.",
    bandText: "Muster, Kanten und Oberflächen liegen in der Ausstellung in Wolfersdorf. Wir legen Ihre Favoriten bereit, wenn Sie einen Termin vereinbaren.",
    book: "Termin vereinbaren",
  },
  en: {
    visit: "See samples in the showroom",
    plan: "Plan your kitchen",
    choice: "The choice",
    choiceTitle: "What there is to choose from.",
    more: "Find out more",
    faqEyebrow: "Frequent questions",
    faqAll: "All questions on this topic",
    houses: "Kitchens that use it",
    bandTitle: "Compare the real thing.",
    bandText: "Samples, edges and surfaces are waiting in the showroom in Wolfersdorf. We lay out your favourites when you book an appointment.",
    book: "Book an appointment",
  },
} as const;

export default async function CategoryPage({
  hub,
  faqTheme,
}: {
  hub: PresentedTopic;
  /** FAQ theme slug in the CMS whose questions belong here. */
  faqTheme?: string;
}) {
  const copy = COPY[hub.locale === "en" ? "en" : "de"];
  const faq = faqTheme ? await fetchFaqHub() : null;
  const questions = faq ? filterFaqItems(faq.items, faqTheme).slice(0, 5) : [];
  const theme = faq?.themes.find((item) => item.slug === faqTheme);
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
      <header className="px-5 pt-10 sm:px-8 lg:px-14 lg:pt-16">
        <Crumbs hub={hub} />
        <div className="mt-6 grid items-end gap-8 lg:grid-cols-12">
          <h1 className="font-serif text-[48px] leading-[0.92] font-medium tracking-[-0.04em] text-ink sm:text-[72px] lg:col-span-7">
            {hub.title} <em className="italic">{hub.emphasis}</em>
          </h1>
          <div className="lg:col-span-5">
            <p className="max-w-md font-sans text-[17px] leading-relaxed font-light text-muted">{hub.lede}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <LocaleLink href="/ausstellung" className="pill pill-primary">
                {copy.visit}
              </LocaleLink>
              <LocaleLink href="/beratung" className="pill pill-secondary">
                {copy.plan}
              </LocaleLink>
            </div>
          </div>
        </div>
      </header>

      <figure className="mt-10">
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
          <p className="type-eyebrow text-gold">{copy.choice}</p>
          <h2 id="category-choice" className="mt-3 font-serif text-[34px] leading-tight font-medium tracking-[-0.03em] text-ink md:text-[44px]">
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
                    imgClassName="transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <h3 className="mt-5 font-serif text-[26px] leading-snug font-medium text-ink">{option.title}</h3>
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

      {hub.statement ? (
        <section className="border-t border-line px-5 py-16 sm:px-8 lg:px-14 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-12">
            <h2 className="font-serif text-[28px] leading-snug font-medium tracking-[-0.03em] text-ink italic md:text-[34px] lg:col-span-6">
              {hub.statement}
            </h2>
            {hub.statementNote ? (
              <p className="max-w-md font-sans text-[16px] leading-relaxed text-muted lg:col-span-5 lg:col-start-8">{hub.statementNote}</p>
            ) : null}
          </div>
        </section>
      ) : null}

      {hub.facts.length > 0 ? (
        <AtelierFacts facts={hub.facts} kicker={hub.indexEyebrow} image={hub.ledgerImage} sentence={hub.ledgerLine} />
      ) : null}

      {questions.length > 0 ? (
        <section className="border-t border-line px-5 py-16 sm:px-8 lg:px-14 lg:py-20" aria-labelledby="category-faq">
          <FaqJsonLd items={questions} />
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="type-eyebrow text-gold">{copy.faqEyebrow}</p>
              <h2 id="category-faq" className="mt-3 font-serif text-[32px] leading-tight font-medium text-ink md:text-[38px]">
                {theme?.name ?? hub.title}
              </h2>
              <LocaleLink href={`/faq/${faqTheme}`} className="mt-6 inline-flex min-h-6 items-center gap-2 font-sans text-[14px] text-ink underline underline-offset-4">
                {copy.faqAll} <span aria-hidden="true">→</span>
              </LocaleLink>
            </div>
            <div className="lg:col-span-8">
              <Accordion items={questions.map((item) => ({ slug: item.slug, question: item.question, answer: item.answer }))} />
            </div>
          </div>
        </section>
      ) : null}

      <HouseLine houses={hub.houses} title={copy.houses} />

      <section className="bg-nacht px-5 py-16 text-paper sm:px-8 lg:px-14 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-[34px] leading-tight font-medium md:text-[46px]">{copy.bandTitle}</h2>
          <p className="mx-auto mt-5 max-w-xl font-sans text-[16px] leading-relaxed font-light text-paper/80">{copy.bandText}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <LocaleLink href="/beratung" className="pill pill-light">
              {copy.book}
            </LocaleLink>
            <LocaleLink href="/beratung" className="pill pill-ghost-dark">
              {copy.plan}
            </LocaleLink>
          </div>
        </div>
      </section>

      <SiblingCards siblings={siblings} eyebrow={hub.siblingEyebrow} title={hub.siblingTitle} />
    </main>
  );
}
