import Accordion from "@/components/Accordion";
import FaqJsonLd from "@/components/FaqJsonLd";
import FaqThemeFilters from "@/components/FaqThemeFilters";
import LocaleLink from "@/components/LocaleLink";
import NextSteps from "@/components/catalog/NextSteps";
import { Breadcrumbs } from "@/components/catalog/clusters/parts";
import type { FaqEntry, FaqTheme } from "@/lib/faq";
import type { Locale } from "@/lib/i18n";

const COPY = {
  de: {
    hubTitle: "Fragen vor dem Gespräch",
    hubIntro: "Nach Thema filtern – Farben, Formen, Kosten, Geräte und was sonst zur Küche gehört.",
    themeTitle: (name: string) => `Fragen zu ${name}`,
    count: (n: number) => (n === 1 ? "1 Frage" : `${n} Fragen`),
    empty: "Zu diesem Thema liegen noch keine Fragen vor.",
    topic: "Mehr zum Thema",
    open: "Ansehen",
    askTitle: "Ihre Frage ist nicht dabei?",
    askText: "Fragen Sie uns direkt – im Gespräch in der Ausstellung, am Telefon oder per E-Mail an",
  },
  en: {
    hubTitle: "Questions before the conversation",
    hubIntro: "Filter by topic – colours, shapes, cost, appliances and everything else that belongs to a kitchen.",
    themeTitle: (name: string) => `Questions on ${name}`,
    count: (n: number) => (n === 1 ? "1 question" : `${n} questions`),
    empty: "There are no questions on this topic yet.",
    topic: "More on this topic",
    open: "Have a look",
    askTitle: "Your question is not here?",
    askText: "Ask us directly – in the showroom, on the phone or by email to",
  },
} as const;

/** FAQ theme → the site's own page on the subject. */
const THEME_PAGE: Record<string, { href: string; de: string; en: string }> = {
  farben: { href: "/kuechen/farben", de: "Küchenfarben", en: "Kitchen colours" },
  formen: { href: "/kuechen/formen", de: "Küchenformen", en: "Kitchen shapes" },
  stile: { href: "/kuechen/stile", de: "Küchenstile", en: "Kitchen styles" },
  inseln: { href: "/kuechen/inseln", de: "Kücheninseln", en: "Kitchen islands" },
  besondere: { href: "/kuechen/besondere", de: "Besondere Küchen", en: "Special kitchens" },
  material: { href: "/material", de: "Material", en: "Materials" },
  arbeitsplatten: { href: "/material/arbeitsplatten", de: "Arbeitsplatten", en: "Worktops" },
  innenleben: { href: "/material/innenleben", de: "Innenleben", en: "Interior fittings" },
  geraete: { href: "/geraete", de: "Geräte", en: "Appliances" },
  marken: { href: "/marken", de: "Marken", en: "Brands" },
  moebel: { href: "/moebel", de: "Möbel nach Maß", en: "Bespoke furniture" },
  planung: { href: "/kueche-planen", de: "Küche planen", en: "Plan your kitchen" },
  kosten: { href: "/ratgeber/was-kostet-eine-kueche", de: "Was kostet eine Küche?", en: "What does a kitchen cost?" },
  ausstellung: { href: "/ausstellung", de: "Ausstellung", en: "Showroom" },
  montage: { href: "/kueche-planen", de: "Vom Aufmaß zur Montage", en: "From survey to fitting" },
  regionen: { href: "/regionen", de: "Regionen", en: "Regions" },
  nachhaltigkeit: { href: "/nachhaltigkeit", de: "Nachhaltigkeit", en: "Sustainability" },
  allgemein: { href: "/ueber", de: "Über BEER", en: "About BEER" },
};

export default function FaqHub({
  themes,
  items,
  activeTheme,
  locale = "de",
}: {
  themes: FaqTheme[];
  items: FaqEntry[];
  activeTheme?: FaqTheme;
  locale?: Locale;
}) {
  const copy = COPY[locale === "en" ? "en" : "de"];
  const title = activeTheme?.name ? copy.themeTitle(activeTheme.name) : copy.hubTitle;
  const intro = activeTheme?.description || copy.hubIntro;
  const page = activeTheme ? THEME_PAGE[activeTheme.slug] : undefined;

  return (
    <main className="bg-paper">
      <FaqJsonLd items={items} />
      <section className="mx-auto max-w-3xl px-6 pt-16 pb-16 md:pt-24" aria-labelledby="faq-hub-heading">
        {activeTheme ? (
          <Breadcrumbs items={[{ href: "/faq", label: "FAQ" }]} current={title} locale={locale} />
        ) : null}
        <p className="type-eyebrow mt-8 mb-3 text-gold">FAQ</p>
        <h1 id="faq-hub-heading" className="type-h2 text-ink">
          {title}
        </h1>
        <p className="type-body mt-5 max-w-2xl text-muted">{intro}</p>
        {items.length > 0 ? <p className="mt-3 font-sans text-[13px] text-muted">{copy.count(items.length)}</p> : null}
        <FaqThemeFilters themes={themes} activeSlug={activeTheme?.slug} locale={locale} />
        <div className="mt-12">
          {items.length > 0 ? (
            <Accordion
              headingLevel="h2"
              items={items.map((item) => ({
                slug: item.slug,
                question: item.question,
                answer: item.answer,
              }))}
            />
          ) : (
            <p className="type-body text-muted">{copy.empty}</p>
          )}
        </div>

        {page ? (
          <LocaleLink
            href={page.href}
            className="group mt-12 flex items-center justify-between gap-6 border border-line bg-white px-6 py-5 transition-colors hover:border-ink"
          >
            <span>
              <span className="type-eyebrow block text-muted">{copy.topic}</span>
              <span className="mt-1 block font-serif text-[24px] leading-snug font-medium text-ink">{page[locale === "en" ? "en" : "de"]}</span>
            </span>
            <span className="font-sans text-[14px] text-ink">
              {copy.open} <span aria-hidden="true">→</span>
            </span>
          </LocaleLink>
        ) : null}
      </section>

      <section className="bg-nacht px-6 py-16 text-paper lg:py-20" aria-labelledby="faq-ask">
        <div className="mx-auto max-w-3xl">
          <h2 id="faq-ask" className="font-serif text-[32px] leading-tight font-medium md:text-[42px]">
            {copy.askTitle}
          </h2>
          <p className="mt-4 max-w-xl font-sans text-[16px] leading-relaxed font-light text-paper/80">
            {copy.askText}{" "}
            <a href="mailto:info@beer.de" className="text-paper underline underline-offset-4">
              info@beer.de
            </a>
            .
          </p>
          <NextSteps locale={locale} tone="dark" className="mt-8" />
        </div>
      </section>
    </main>
  );
}
