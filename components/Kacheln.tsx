import LocaleLink from "@/components/LocaleLink";
import CmsImage from "@/components/CmsImage";
import { chromeCopy } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/locale";
import type { KachelTile, KachelnContent } from "@/lib/strapi";

const fallback: KachelnContent = {
  eyebrow: "Küchenfarben",
  intro: "",
  colors: [
    {
      title: "Wenn Kochen und Wohnen zusammenrücken",
      text: "Eine Insel als Mittelpunkt – zum Kochen, Arbeiten, Reden. Für alle, die selten allein in der Küche stehen.",
      buttonLabel: "Diese Idee merken",
      href: "/kuechen/farben/weiss",
      image: "/kitchens/stile-holz.jpg",
      alt: "Helle Küche mit Insel und Wohnraum",
      color: "#f4f1ea",
    },
    {
      title: "Alles da, nichts zu sehen",
      text: "Hinter einer ruhigen Front verschwindet die ganze Technik – und eine begehrte Speisekammer. Für Ordnungsliebende.",
      buttonLabel: "Diese Idee merken",
      href: "/kuechen/farben/schwarz",
      image: "/kitchens/stile-design.jpg",
      alt: "Dunkle Küche mit verdeckter Technik",
      color: "#141414",
    },
    {
      title: "Charakter statt Katalog",
      text: "Altes Holz, schwarzer Stein, offene Regale: eine Küche, die nach zehn Jahren besser aussieht als am ersten Tag.",
      buttonLabel: "Diese Idee merken",
      href: "/kuechen/farben/salbei",
      image: "/kitchens/stile-landhaus.jpg",
      alt: "Küche mit Holz, Stein und offenen Regalen",
      color: "#8d8274",
    },
  ],
};

const fallbackCopy: Record<
  string,
  { title: string; text: string; buttonLabel: string }
> = {
  weiss: {
    title: "Wenn Kochen und Wohnen zusammenrücken",
    text: "Eine Insel als Mittelpunkt – zum Kochen, Arbeiten, Reden. Für alle, die selten allein in der Küche stehen.",
    buttonLabel: "Diese Idee merken",
  },
  schwarz: {
    title: "Alles da, nichts zu sehen",
    text: "Hinter einer ruhigen Front verschwindet die ganze Technik – und eine begehrte Speisekammer. Für Ordnungsliebende.",
    buttonLabel: "Diese Idee merken",
  },
  salbei: {
    title: "Charakter statt Katalog",
    text: "Altes Holz, schwarzer Stein, offene Regale: eine Küche, die nach zehn Jahren besser aussieht als am ersten Tag.",
    buttonLabel: "Diese Idee merken",
  },
};

function slugFromHref(href: string) {
  return Object.keys(fallbackCopy).find((slug) =>
    href.toLowerCase().includes(slug),
  );
}

const catalogTitles = new Set([
  "Weiße Küchen",
  "Salbeigrüne Küchen",
  "Schwarze Küchen",
  "White kitchens",
  "Sage kitchens",
  "Black kitchens",
]);

function presentTile(
  tile: KachelTile,
  preset?: { title: string; text: string; buttonLabel: string },
  saveIdea?: string,
): KachelTile {
  const usePresetTitle = Boolean(
    preset && (!tile.title || catalogTitles.has(tile.title)),
  );

  return {
    ...tile,
    title: usePresetTitle && preset ? preset.title : tile.title,
    text: tile.text?.trim() || preset?.text || "",
    buttonLabel:
      tile.buttonLabel?.trim() ||
      preset?.buttonLabel ||
      saveIdea ||
      "Diese Idee merken",
  };
}

function orderColorTiles(tiles: KachelTile[]) {
  const rank = ["weiss", "schwarz", "salbei"];
  return [...tiles].sort((a, b) => {
    const aRank = rank.findIndex((slug) => a.href.toLowerCase().includes(slug));
    const bRank = rank.findIndex((slug) => b.href.toLowerCase().includes(slug));
    return (aRank === -1 ? 99 : aRank) - (bRank === -1 ? 99 : bRank);
  });
}

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

function copyFor(tile: KachelTile) {
  return {
    title: tile.title,
    text: tile.text?.trim() || "",
    buttonLabel: tile.buttonLabel?.trim() || "Diese Idee merken",
  };
}

function TileCard({ tile }: { tile: KachelTile }) {
  const light = isLightColor(tile.color);
  const { title, text, buttonLabel } = copyFor(tile);

  return (
    <li>
      <article className="grid overflow-hidden bg-karte md:grid-cols-2 md:min-h-[22rem] lg:min-h-[24rem]">
        <div className="relative min-h-[16rem] overflow-hidden md:min-h-0">
          <CmsImage
            src={tile.image}
            srcSet={tile.srcSet}
            alt={tile.alt}
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div
          className="flex flex-col items-center justify-center px-8 py-12 text-center sm:px-12 lg:px-16"
          style={{ backgroundColor: tile.color }}
        >
          <h3
            className={`max-w-md font-serif text-[28px] leading-[1.18] font-medium tracking-[-0.02em] md:text-[32px] lg:text-[34px] ${
              light ? "text-ink" : "text-paper"
            }`}
          >
            {title}
          </h3>
          {text ? (
            <p
              className={`mt-5 max-w-sm font-sans text-[15px] leading-relaxed font-light md:text-[16px] ${
                light ? "text-ink/75" : "text-paper/80"
              }`}
            >
              {text}
            </p>
          ) : null}
          <LocaleLink
            href={tile.href}
            className={`mt-8 inline-flex items-center rounded-full border px-4 py-2 font-sans text-[13px] tracking-[0.04em] transition-colors ${
              light
                ? "border-ink text-ink hover:bg-ink hover:text-paper"
                : "border-paper text-paper hover:bg-paper hover:text-ink"
            }`}
          >
            {buttonLabel}
          </LocaleLink>
        </div>
      </article>
    </li>
  );
}

export default async function Kacheln({
  content,
}: {
  content: KachelnContent | null;
}) {
  const locale = await getRequestLocale();
  const copy = chromeCopy[locale];
  const data = content ?? fallback;
  const colors = orderColorTiles(
    (data.colors.length > 0 ? data.colors : fallback.colors).map((tile) => {
      const slug = slugFromHref(tile.href);
      return presentTile(
        tile,
        slug ? fallbackCopy[slug] : undefined,
        copy.saveIdea,
      );
    }),
  );

  return (
    <section
      id="kacheln"
      className="bg-paper"
      aria-labelledby="kacheln-heading"
    >
      <h2 id="kacheln-heading" className="sr-only">
        {data.eyebrow?.trim() || copy.kitchenColours}
      </h2>
      <ul className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16 md:gap-7 md:px-10 md:py-24">
        {colors.map((tile, index) => (
          <TileCard key={`${tile.title}-${index}`} tile={tile} />
        ))}
      </ul>
    </section>
  );
}
