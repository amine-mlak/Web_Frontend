import LocaleLink from "@/components/LocaleLink";
import { fallback as panelFallback } from "@/components/Entdecken";
import { fallback as colourFallback } from "@/components/Kacheln";
import { Frame } from "@/components/catalog/Frame";
import { chromeCopy, type Locale } from "@/lib/i18n";
import { fetchKitchenTopics } from "@/lib/catalog-api";
import { getRequestLocale } from "@/lib/locale";
import type { EntdeckenContent, EntdeckenPanel, KachelTile, KachelnContent } from "@/lib/strapi";

const COPY = {
  de: {
    text: "Vom ganzen Raum bis zur Schublade: Beginnen Sie dort, wo Ihre Gedanken gerade sind.",
    colours: "Nach Farbe",
    allColours: "Alle Küchenfarben",
    view: "Ansehen",
  },
  en: {
    text: "From the whole room down to the drawer: start wherever your thinking is right now.",
    colours: "By colour",
    allColours: "All kitchen colours",
    view: "View",
  },
} as const;

// A colour tile is named after the page it opens.
const COLOUR_ORDER = ["weiss", "schwarz", "salbei"];
const COLOUR_NAME: Record<Locale, Record<string, string>> = {
  de: { weiss: "Weiße Küchen", schwarz: "Schwarze Küchen", salbei: "Salbeigrüne Küchen" },
  en: { weiss: "White kitchens", schwarz: "Black kitchens", salbei: "Sage kitchens" },
};

function colourSlug(href: string) {
  return COLOUR_ORDER.find((slug) => href.toLowerCase().includes(slug));
}

/** One way in as a photo that is a link: the name on the photo, under it where the link leads. */
function WayTile({ panel, large, wide }: { panel: EntdeckenPanel; large: boolean; wide: boolean }) {
  return (
    <LocaleLink
      href={panel.href}
      className={`group relative isolate block h-full overflow-hidden bg-nacht focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
        large ? "aspect-[4/5] sm:aspect-[16/10] lg:aspect-auto" : wide ? "aspect-[4/3] sm:aspect-[16/9] lg:aspect-auto" : "aspect-[4/5] sm:aspect-[4/3] lg:aspect-auto"
      }`}
    >
      <Frame
        src={panel.image}
        srcSet={panel.srcSet}
        alt={panel.alt || panel.title}
        className="absolute inset-0"
        sizes={large ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"}
      />
      <div className="chapter-scrim absolute inset-0" aria-hidden />
      <div className={`absolute inset-x-0 bottom-0 z-10 ${large ? "p-6 sm:p-8 lg:p-10" : wide ? "p-5 sm:p-6" : "p-4 sm:p-6"}`}>
        <h3 className={`text-paper hyphens-auto ${large ? "t-feature" : wide ? "t-item" : "t-item max-sm:text-[20px]"}`}>{panel.title}</h3>
        {/* The two half-width tiles on a phone carry the name only; the whole tile is the link. */}
        <p className={`mt-2 font-sans ${large || wide ? "" : "max-sm:hidden"} text-[15px] text-paper/85 underline decoration-paper/40 underline-offset-[5px] group-hover:decoration-paper`}>
          {panel.buttonLabel}
        </p>
      </div>
    </LocaleLink>
  );
}

/** Whether text on this colour should be dark. */
function isLight(hex: string) {
  const raw = hex.replace("#", "");
  const full = raw.length === 3 ? raw.replace(/./g, "$&$&") : raw;
  const [red, green, blue] = [0, 2, 4].map((at) => parseInt(full.slice(at, at + 2), 16) / 255);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55;
}

/**
 * One kitchen colour: a kitchen in that colour, and under it a field of the colour itself with
 * the name of the page it opens. On phones photo and field sit side by side as one compact row.
 */
function ColourTile({ tile, name, view }: { tile: KachelTile; name: string; view: string }) {
  const light = isLight(tile.color);
  return (
    <LocaleLink
      href={tile.href}
      className="group flex h-full overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:flex-col"
    >
      <Frame
        src={tile.image}
        srcSet={tile.srcSet}
        alt={tile.alt}
        className="aspect-square w-2/5 shrink-0 sm:aspect-square sm:w-full lg:aspect-[5/4]"
        sizes="(max-width: 640px) 40vw, 33vw"
      />
      <div
        className={`flex flex-1 flex-col justify-end p-5 sm:min-h-[9.5rem] sm:flex-none sm:p-6 lg:p-8 ${
          light ? "text-ink ring-1 ring-ink/10 ring-inset" : "text-paper"
        }`}
        style={{ backgroundColor: tile.color }}
      >
        <span className="t-item hyphens-auto">{name}</span>
        <span className="mt-2 font-sans text-[15px] underline decoration-current/40 underline-offset-[5px] group-hover:decoration-current">
          {view}
        </span>
      </div>
    </LocaleLink>
  );
}

/**
 * Start page: every way into the kitchens in one section. Four photo tiles for the worlds (one
 * large, three smaller), under them the kitchen colours, each with a field of its colour.
 */
export default async function HomeWays({
  panels: panelContent,
  colours: colourContent,
}: {
  panels: EntdeckenContent | null;
  colours: KachelnContent | null;
}) {
  const locale = await getRequestLocale();
  const copy = COPY[locale];
  const panels = (panelContent?.panels.length ? panelContent.panels : panelFallback.panels).slice(0, 4);
  // The colours are picked from the collection Küchen · Farben: name, colour value, address and
  // photo all come from the colour's own page.
  const picks = panelContent?.colourPicks ?? [];
  const pages = picks.length ? (await fetchKitchenTopics()).filter((topic) => topic.cluster === "farben") : [];
  const picked: KachelTile[] = picks.flatMap((slug) => {
    const page = pages.find((topic) => topic.slug === slug);
    if (!page || !page.hex || !page.image) return [];
    return [
      {
        title: (locale !== "de" && COLOUR_NAME[locale][page.slug]) || page.name,
        href: `/kuechen/farben/${page.slug}`,
        image: page.image,
        alt: page.name,
        color: page.hex,
      },
    ];
  });
  // Before colours were picked they were written by hand in this block, and before that in
  // "Kacheln", where the title was a headline: those are named after the page they open.
  const own = picked.length ? picked : panelContent?.colors?.length ? panelContent.colors : null;
  const colours = (own ?? (colourContent?.colors.length ? colourContent.colors : colourFallback.colors))
    .map((tile) => ({ tile, slug: colourSlug(tile.href) }))
    .sort((a, b) => (a.slug ? COLOUR_ORDER.indexOf(a.slug) : 99) - (b.slug ? COLOUR_ORDER.indexOf(b.slug) : 99))
    .slice(0, 3);

  return (
    <section id="entdecken" aria-labelledby="home-ways" className="bg-paper px-5 py-20 sm:px-8 lg:px-gutter lg:py-28">
      <div className="grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-16">
        <h2 data-rise="" id="home-ways" className="t-section text-ink lg:col-span-7">
          {panelContent?.title || chromeCopy[locale].discover}
        </h2>
        <p className="max-w-md font-sans text-[16px] leading-relaxed text-muted lg:col-span-5">{panelContent?.text || copy.text}</p>
      </div>

      <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-14 lg:h-[46rem] lg:grid-cols-4 lg:grid-rows-2">
        {panels.map((panel, index) => (
          <li
            key={`${panel.title}-${index}`}
            className={index === 0 ? "col-span-2 lg:row-span-2" : index === 1 ? "col-span-2" : ""}
          >
            <WayTile panel={panel} large={index === 0} wide={index === 1} />
          </li>
        ))}
      </ul>

      {colours.length ? (
        <div className="mt-16 lg:mt-24">
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
            <h3 className="t-feature text-ink">{panelContent?.coloursTitle || copy.colours}</h3>
            <LocaleLink href="/kuechen/farben" className="btn-quiet">
              {panelContent?.coloursLinkLabel || copy.allColours}
            </LocaleLink>
          </div>
          <ul className="mt-8 grid gap-3 sm:grid-cols-3 sm:gap-4 lg:mt-10">
            {colours.map(({ tile, slug }, index) => (
              <li key={`${tile.href}-${index}`}>
                <ColourTile tile={tile} name={own ? tile.title : (slug && COLOUR_NAME[locale][slug]) || tile.title} view={copy.view} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
