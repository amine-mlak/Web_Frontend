import EntryCard, {
  EntryGrid,
  type CatalogCardItem,
} from "@/components/catalog/EntryCard";
import FilterChips from "@/components/catalog/FilterChips";
import PageHero from "@/components/catalog/PageHero";
import Pill from "@/components/Pill";

export default function HubPage({
  eyebrow,
  title,
  intro,
  image,
  chips,
  activeHref,
  items = [],
  sections,
  ctaLabel = "Beratung anfragen",
  ctaHref = "/beratung",
}: {
  eyebrow: string;
  title: string;
  intro: string;
  image?: string;
  chips?: { href: string; label: string }[];
  activeHref?: string;
  items?: CatalogCardItem[];
  sections?: { id: string; title: string; items: CatalogCardItem[] }[];
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <main className="bg-paper">
      <PageHero
        eyebrow={eyebrow}
        title={title}
        intro={intro}
        image={image}
        imageAlt={title}
      />
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        {chips && chips.length > 0 ? (
          <div className="mb-12">
            <FilterChips items={chips} activeHref={activeHref} />
          </div>
        ) : null}
        {sections && sections.length > 0 ? (
          <div className="space-y-16">
            {sections.map((section) => (
              <div key={section.id} id={section.id}>
                <h2 className="type-h3 mb-8 text-ink">{section.title}</h2>
                <EntryGrid items={section.items} />
              </div>
            ))}
          </div>
        ) : (
          <EntryGrid items={items} />
        )}
        <div className="mt-16">
          <Pill href={ctaHref} variant="secondary">
            {ctaLabel}
          </Pill>
        </div>
      </section>
    </main>
  );
}

export { EntryCard };
