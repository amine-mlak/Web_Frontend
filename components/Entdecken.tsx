import FullChapter from "@/components/catalog/FullChapter";
import { chromeCopy } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/locale";
import type { EntdeckenContent } from "@/lib/strapi";

const fallback: EntdeckenContent = {
  panels: [
    {
      title: "BEER Küchen-Designs",
      subtitle: "Design, das Persönlichkeit zum Leben bringt.",
      buttonLabel: "Küchen entdecken",
      href: "/kuechen",
      image: "/kitchens/stile-design.jpg",
      alt: "Schwarze Designküche",
    },
    {
      title: "Materialien & Farben",
      subtitle: "Die Kunst des Kombinierens.",
      buttonLabel: "Farben entdecken",
      href: "/kuechen/farben",
      image: "/kitchens/stile-landhaus.jpg",
      alt: "Salbeigrüne Küche",
    },
    {
      title: "Arbeitsplatten",
      subtitle: "Präzision, die man sieht und fühlt.",
      buttonLabel: "Arbeitsplatten entdecken",
      href: "/material/arbeitsplatten",
      image: "/kitchens/stile-holz.jpg",
      alt: "Küche mit Holz und Stein",
    },
    {
      title: "Innenleben",
      subtitle: "Organisation, die Freiheit gibt.",
      buttonLabel: "Innenleben entdecken",
      href: "/material/innenleben",
      image: "/kitchens/stile-modern.jpg",
      alt: "Moderne Küche mit klaren Fronten",
    },
  ],
};

export default async function Entdecken({
  content,
}: {
  content: EntdeckenContent | null;
}) {
  const locale = await getRequestLocale();
  const copy = chromeCopy[locale];
  const data = content ?? fallback;
  const panels = data.panels.length > 0 ? data.panels : fallback.panels;

  return (
    <section
      id="entdecken"
      className="bg-paper"
      aria-label={copy.discover}
    >
      <h2 className="sr-only">{copy.discover}</h2>
      {/* The kitchen worlds as photo cards, two by two; each card opens its page. */}
      <div className="grid gap-3 px-3 py-3 sm:gap-4 sm:px-4 sm:py-4 md:grid-cols-2">
        {panels.map((panel, index) => (
          <FullChapter
            key={`${panel.title}-${index}`}
            id={`entdecken-${index}`}
            index={index}
            image={panel.image}
            srcSet={panel.srcSet}
            alt={panel.alt || panel.title}
            title={panel.title}
            text={panel.subtitle}
            href={panel.href}
            linkLabel={panel.buttonLabel}
            lang={locale}
            as="h3"
            size="card"
          />
        ))}
      </div>
    </section>
  );
}
