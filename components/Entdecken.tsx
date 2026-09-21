import Link from "next/link";
import CmsImage from "@/components/CmsImage";
import type { EntdeckenContent, EntdeckenPanel } from "@/lib/strapi";

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
      href: "/material#worktop",
      image: "/kitchens/stile-holz.jpg",
      alt: "Küche mit Holz und Stein",
    },
    {
      title: "Innenleben",
      subtitle: "Organisation, die Freiheit gibt.",
      buttonLabel: "Innenleben entdecken",
      href: "/material#interior",
      image: "/kitchens/stile-modern.jpg",
      alt: "Moderne Küche mit klaren Fronten",
    },
  ],
};

function PanelCard({ panel }: { panel: EntdeckenPanel }) {
  return (
    <li>
      <article className="group relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-nacht md:aspect-[16/10]">
        {panel.image ? (
          <CmsImage
            src={panel.image}
            srcSet={panel.srcSet}
            alt={panel.alt || panel.title}
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1152px) 50vw, 560px"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : null}
        <div className="absolute inset-0 bg-nacht/45" />
        <div className="relative z-10 flex max-w-md flex-col items-center px-6 py-10 text-center md:px-8">
          <h3 className="font-serif text-[28px] leading-[1.12] font-medium tracking-[-0.02em] text-paper md:text-[32px] lg:text-[36px]">
            {panel.title}
          </h3>
          <p className="type-body mt-3 text-paper/90">{panel.subtitle}</p>
          <Link href={panel.href} className="pill pill-light mt-6 md:mt-8">
            {panel.buttonLabel}
          </Link>
        </div>
      </article>
    </li>
  );
}

export default function Entdecken({
  content,
}: {
  content: EntdeckenContent | null;
}) {
  const data = content ?? fallback;
  const panels = data.panels.length > 0 ? data.panels : fallback.panels;

  return (
    <section
      id="entdecken"
      className="bg-paper"
      aria-label="Küchenwelten entdecken"
    >
      <h2 className="sr-only">Küchenwelten entdecken</h2>
      <ul className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-6 py-16 sm:grid-cols-2 md:gap-6 md:py-24">
        {panels.map((panel, index) => (
          <PanelCard key={`${panel.title}-${index}`} panel={panel} />
        ))}
      </ul>
    </section>
  );
}
