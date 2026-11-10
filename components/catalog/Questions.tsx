import Accordion from "@/components/Accordion";
import FaqJsonLd from "@/components/FaqJsonLd";
import LocaleLink from "@/components/LocaleLink";
import { filterFaqItems } from "@/lib/faq";
import type { Locale } from "@/lib/i18n";
import { fetchFaqHub } from "@/lib/strapi";

const COPY = {
  de: {
    eyebrow: "Häufige Fragen",
    all: "Alle Fragen zum Thema",
    every: "Alle Fragen und Antworten",
  },
  en: {
    eyebrow: "Frequent questions",
    all: "All questions on this topic",
    every: "All questions and answers",
  },
} as const;

/**
 * The questions buyers ask about a page's subject, with BEER's answers. `slugs` names the
 * questions picked for this page; they come first, and questions from `theme` fill the rest up
 * to `limit`. Without picked questions the block shows the theme's questions as before.
 */
export default async function Questions({
  theme,
  slugs,
  name,
  title,
  locale,
  limit = 5,
  narrow = false,
}: {
  theme?: string;
  /** Questions picked for this page, in the order they are shown. */
  slugs?: string[];
  /** The page's subject as the block's heading; without it the theme's name is used. */
  name?: string;
  title?: string;
  locale: Locale;
  limit?: number;
  narrow?: boolean;
}) {
  if (!theme && !slugs?.length) {
    return null;
  }

  const faq = await fetchFaqHub();
  const bySlug = new Map(faq.items.map((item) => [item.slug, item]));
  const picked = (slugs ?? []).flatMap((slug) => bySlug.get(slug) ?? []);
  const taken = new Set(picked.map((item) => item.slug));
  const fill = theme ? filterFaqItems(faq.items, theme).filter((item) => !taken.has(item.slug)) : [];
  const questions = [...picked, ...fill].slice(0, limit);
  if (questions.length === 0) {
    return null;
  }

  const copy = COPY[locale === "en" ? "en" : "de"];
  const heading = name ?? faq.themes.find((item) => item.slug === theme)?.name ?? title;
  const headingId = `questions-${theme ?? "seite"}`;

  return (
    <section className="border-t border-line bg-paper px-5 py-16 sm:px-8 lg:px-14 lg:py-20" aria-labelledby={headingId}>
      <FaqJsonLd items={questions} />
      <div className={`grid gap-10 lg:grid-cols-12 ${narrow ? "mx-auto max-w-6xl" : ""}`}>
        <div className="lg:col-span-4">
          <p className="type-eyebrow text-gold">{copy.eyebrow}</p>
          <h2 id={headingId} className="t-section mt-3 text-ink">
            {heading}
          </h2>
          <LocaleLink
            href={theme ? `/faq/${theme}` : "/faq"}
            className="mt-6 inline-flex min-h-6 items-center gap-2 font-sans text-[14px] text-ink underline underline-offset-4"
          >
            {theme ? copy.all : copy.every} <span aria-hidden="true">→</span>
          </LocaleLink>
        </div>
        <div className="lg:col-span-8">
          <Accordion
            items={questions.map((item) => ({
              slug: item.slug,
              question: item.question,
              answer: item.answer,
            }))}
          />
        </div>
      </div>
    </section>
  );
}
