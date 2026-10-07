import HeroCarousel, { type HeroPanel } from "@/components/HeroCarousel";
import { beerNamed } from "@/lib/beer-photos";
import { type HeroSlide } from "@/lib/strapi";

const fallbackSlides: HeroSlide[] = [
  {
    src: beerNamed("stile-modern.jpg"),
    alt: "Moderne Wohnküche von BEER",
  },
  {
    src: beerNamed("stile-landhaus.jpg"),
    alt: "Elegante Landhausküche von BEER",
  },
  {
    src: beerNamed("stile-design.jpg"),
    alt: "Designküche in Glas und Stein von BEER",
  },
  {
    src: beerNamed("stile-holz.jpg"),
    alt: "Holzküche von BEER",
  },
  {
    src: beerNamed("stile-insel.jpg"),
    alt: "Küche mit Insel von BEER",
  },
  {
    src: beerNamed("stile-purist.jpg"),
    alt: "Puristische Küche von BEER",
  },
];

export default function Hero({
  slides,
  panel,
}: {
  slides: HeroSlide[];
  panel?: HeroPanel;
}) {
  const items = slides.length > 0 ? slides : fallbackSlides;
  const first = items[0];

  return (
    <>
      {first ? (
        <link
          rel="preload"
          as="image"
          href={first.src}
          {...(first.srcSet
            ? { imageSrcSet: first.srcSet, imageSizes: "100vw" }
            : {})}
          fetchPriority="high"
        />
      ) : null}
      <HeroCarousel slides={items} panel={panel} />
    </>
  );
}
