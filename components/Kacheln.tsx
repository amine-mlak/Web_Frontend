import Link from "next/link";
import CmsImage from "@/components/CmsImage";
import type { KachelTile, KachelnContent } from "@/lib/strapi";

const fallback: KachelnContent = {
  eyebrow: "Die Kacheln · Geteilte Bildtafeln",
  intro:
    "Keine Liste – Tafeln. Zur Hälfte das Projekt, zur Hälfte Material und Farbe. So wird die Wahl der Küchenfarbe zum Erlebnis.",
  colors: [
    {
      title: "Weiße Küchen",
      href: "/kuechen/farben/weiss",
      image: "/kitchens/stile-holz.jpg",
      alt: "Weiße grifflose Küche mit Holz und Naturstein",
      color: "#f7f5f1",
    },
    {
      title: "Salbeigrüne Küchen",
      href: "/kuechen/farben/salbei",
      image: "/kitchens/stile-landhaus.jpg",
      alt: "Salbeigrüne Landhausküche mit Marmor und schwarzen Beschlägen",
      color: "#9eae92",
    },
    {
      title: "Schwarze Küchen",
      href: "/kuechen/farben/schwarz",
      image: "/kitchens/stile-design.jpg",
      alt: "Schwarze Küche mit Eiche und Fischgrätparkett",
      color: "#131311",
    },
  ],
};

function expandHex(hex: string) {
  const value = hex.replace("#", "");
  if (value.length === 3) {
    return value
      .split("")
      .map((char) => `${char}${char}`)
      .join("");
  }
  return value;
}

function isLightColor(hex: string) {
  const raw = expandHex(hex);
  const red = parseInt(raw.slice(0, 2), 16) / 255;
  const green = parseInt(raw.slice(2, 4), 16) / 255;
  const blue = parseInt(raw.slice(4, 6), 16) / 255;
  const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  return luminance > 0.55;
}

function TileCard({ tile, index }: { tile: KachelTile; index: number }) {
  const imageRight = index % 2 === 1;
  const light = isLightColor(tile.color);

  return (
    <li>
      <article className="group relative grid min-h-[32rem] grid-rows-2 overflow-hidden md:min-h-0 md:aspect-[19/6] md:grid-cols-2 md:grid-rows-1">
        <div
          className={`relative overflow-hidden ${imageRight ? "md:order-2" : ""}`}
        >
          <CmsImage
            src={tile.image}
            srcSet={tile.srcSet}
            alt={tile.alt}
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        </div>
        <div
          className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
          style={{ backgroundColor: tile.color }}
        >
          <h3 className={`type-h1 ${light ? "text-ink" : "text-paper"}`}>
            {tile.title}
          </h3>
          <Link
            href={tile.href}
            className={
              light
                ? "pill pill-secondary mt-6 group-hover:bg-ink group-hover:text-paper"
                : "pill pill-ghost-dark mt-6 group-hover:bg-paper group-hover:text-ink"
            }
          >
            Entdecken
          </Link>
        </div>
      </article>
    </li>
  );
}

export default function Kacheln({
  content,
}: {
  content: KachelnContent | null;
}) {
  const data = content ?? fallback;

  return (
    <section id="kacheln" className="bg-paper" aria-labelledby="kacheln-heading">
      <div className="mx-auto max-w-6xl px-6 pt-20 pb-12 md:pt-28 md:pb-16">
        <p className="type-eyebrow text-ink">{data.eyebrow}</p>
        <div className="mt-6 max-w-2xl border-t border-ink pt-8">
          <h2 id="kacheln-heading" className="sr-only">
            Küchenfarben
          </h2>
          <p className="type-intro">{data.intro}</p>
        </div>
      </div>

      <ul>
        {data.colors.map((tile, index) => (
          <TileCard key={`${tile.title}-${index}`} tile={tile} index={index} />
        ))}
      </ul>
    </section>
  );
}
