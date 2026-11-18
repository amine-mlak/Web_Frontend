import ColourSwitcher from "@/components/ColourSwitcher";
import LocaleLink from "@/components/LocaleLink";
import { fallback as panelFallback } from "@/components/Entdecken";
import { fallback as colourFallback } from "@/components/Kacheln";
import { Frame } from "@/components/catalog/Frame";
import { chromeCopy, type Locale } from "@/lib/i18n";
import { cmsValue } from "@/lib/catalog";
import { fetchKitchenTopics } from "@/lib/catalog-api";
import { getRequestLocale } from "@/lib/locale";
import type { EntdeckenContent, EntdeckenPanel, KachelTile, KachelnContent } from "@/lib/strapi";

const COPY = {
  de: {
    text: "Vom ganzen Raum bis zur Schublade: Beginnen Sie dort, wo Ihre Gedanken gerade sind.",
    colours: "Nach Farbe",
    allColours: "Alle Küchenfarben",
    view: "Ansehen",
    group: "Küchenfarbe wählen",
  },
  en: {
    text: "From the whole room down to the drawer: start wherever your thinking is right now.",
    colours: "By colour",
    allColours: "All kitchen colours",
    view: "View",
    group: "Choose a kitchen colour",
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

/** The first sentence of a colour page's opening text, for the panel beside its photo. */
function firstSentence(text: string) {
  const plain = text.replace(/[#*_>`]/g, "").replace(/\s+/g, " ").trim();
  const end = plain.search(/[.!?](\s|$)/);
  const sentence = end > 20 ? plain.slice(0, end + 1) : plain;
  return sentence.length <= 170 ? sentence : "";
}

/**
 * Start page: every way into the kitchens in one section. Four photo tiles for the worlds (one
 * large, three smaller), under them the kitchen colours as one switcher.
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
        text: firstSentence(cmsValue(locale, page, page.intro) ?? ""),
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
          {/* On phones the switcher runs to the screen edges. */}
          <div className="-mx-5 mt-8 sm:mx-0 lg:mt-10">
            <ColourSwitcher
              view={copy.view}
              groupLabel={copy.group}
              colours={colours.map(({ tile, slug }) => ({
                name: own ? tile.title : (slug && COLOUR_NAME[locale][slug]) || tile.title,
                text: picked.length ? tile.text : undefined,
                href: tile.href,
                image: tile.image,
                srcSet: tile.srcSet,
                alt: tile.alt,
                color: tile.color,
              }))}
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
