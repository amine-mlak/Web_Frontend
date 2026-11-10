import Accordion from "@/components/Accordion";
import FaqJsonLd from "@/components/FaqJsonLd";
import LocaleLink from "@/components/LocaleLink";
import { filterFaqItems } from "@/lib/faq";
import type { Locale } from "@/lib/i18n";
import { fetchFaqHub } from "@/lib/strapi";

/**
 * The questions people ask about one subject, from the FAQ in the CMS: the subject as the
 * section heading, the first few questions open on click, a link to all of them, and the
 * FAQPage structured data. One block for hubs, category pages, the interior page and articles.
 * Renders nothing when the theme has no questions.
 */

const COPY = {
  de: { eyebrow: "Häufige Fragen", all: "Alle Fragen zum Thema" },
  en: { eyebrow: "Frequent questions", all: "All questions on this topic" },
} as const;

export default async function Questions({
  theme,
  title,
  locale,
  limit = 5,
  narrow = false,
}: {
  /** FAQ theme slug in the CMS ("material", "geraete" …). */
  theme?: string;
  /** Heading when the CMS theme has no name. */
  title?: string;
  locale: Locale;
  limit?: number;
  /** Keeps the block inside the reading width of an article. */
  narrow?: boolean;
}) {
  if (!theme) {
    return null;
  }
  const faq = await fetchFaqHub();
  const questions = filterFaqItems(faq.items, theme).slice(0, limit);
  if (questions.length === 0) {
    return null;
  }
  const copy = COPY[locale === "en" ? "en" : "de"];
  const name = faq.themes.find((item) => item.slug === theme)?.name ?? title;
  const headingId = `questions-${theme}`;

  return (
    <section className="border-t border-line bg-paper px-5 py-16 sm:px-8 lg:px-14 lg:py-20" aria-labelledby={headingId}>
      <FaqJsonLd items={questions} />
      <div className={`grid gap-10 lg:grid-cols-12 ${narrow ? "mx-auto max-w-6xl" : ""}`}>
        <div className="lg:col-span-4">
          <p className="type-eyebrow text-gold">{copy.eyebrow}</p>
          <h2 id={headingId} className="t-section mt-3 text-ink">
            {name}
          </h2>
          <LocaleLink
            href={`/faq/${theme}`}
            className="mt-6 inline-flex min-h-6 items-center gap-2 font-sans text-[14px] text-ink underline underline-offset-4"
          >
            {copy.all} <span aria-hidden="true">→</span>
          </LocaleLink>
        </div>
        <div className="lg:col-span-8">
          <Accordion items={questions.map((item) => ({ slug: item.slug, question: item.question, answer: item.answer }))} />
        </div>
      </div>
    </section>
  );
}
