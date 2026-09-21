import Accordion from "@/components/Accordion";
import FaqJsonLd from "@/components/FaqJsonLd";
import FaqThemeFilters from "@/components/FaqThemeFilters";
import type { FaqEntry, FaqTheme } from "@/lib/faq";

export default function FaqHub({
  themes,
  items,
  activeTheme,
}: {
  themes: FaqTheme[];
  items: FaqEntry[];
  activeTheme?: FaqTheme;
}) {
  const title = activeTheme?.name
    ? `Fragen zu ${activeTheme.name}`
    : "Fragen vor dem Gespräch";
  const intro =
    activeTheme?.description ||
    "Nach Thema filtern – Farben, Formen, Kosten, Geräte und was sonst zur Küche gehört.";

  return (
    <main className="bg-paper">
      <FaqJsonLd items={items} />
      <section className="mx-auto max-w-3xl px-6 py-24 md:py-32" aria-labelledby="faq-hub-heading">
        <p className="type-eyebrow mb-3">FAQ</p>
        <h1 id="faq-hub-heading" className="type-h2 text-ink">
          {title}
        </h1>
        <p className="type-body mt-5 max-w-2xl text-muted">{intro}</p>
        <FaqThemeFilters themes={themes} activeSlug={activeTheme?.slug} />
        <div className="mt-12">
          {items.length > 0 ? (
            <Accordion
              items={items.map((item) => ({
                slug: item.slug,
                question: item.question,
                answer: item.answer,
              }))}
            />
          ) : (
            <p className="type-body text-muted">
              Zu diesem Thema liegen noch keine Fragen vor.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
