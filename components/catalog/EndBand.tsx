import LocaleLink from "@/components/LocaleLink";
import NextSteps from "@/components/catalog/NextSteps";
import { Frame } from "@/components/catalog/collections/parts";
import type { Locale } from "@/lib/i18n";

export type EndBandTile = { href: string; title: string; text?: string; image?: string };

/**
 * The dark end of a detail page: one next step beside a photo, then photo tiles to the pages
 * that belong next to this one (other materials, other appliances, nearby regions). Each page
 * type passes its own tiles, so pages no longer all end on the same three buttons.
 */
export default function EndBand({
  title,
  text,
  image,
  primary,
  tiles = [],
  tilesTitle,
  locale,
}: {
  title: string;
  text?: string;
  image?: string;
  primary?: { href?: string; label?: string };
  tiles?: EndBandTile[];
  tilesTitle?: string;
  locale: Locale;
}) {
  const shown = tiles.filter((tile) => tile.image).slice(0, 4);
  // One tile lies wide, two share the row, three and four stand side by side.
  const layout = [
    { grid: "", ratio: "aspect-[4/3] sm:aspect-[21/9]", sizes: "100vw" },
    { grid: "sm:grid-cols-2", ratio: "aspect-[4/3] lg:aspect-[16/9]", sizes: "(max-width: 640px) 100vw, 50vw" },
    { grid: "sm:grid-cols-2 lg:grid-cols-3", ratio: "aspect-[4/3]", sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" },
    { grid: "sm:grid-cols-2 lg:grid-cols-4", ratio: "aspect-[4/3]", sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" },
  ][Math.max(shown.length, 1) - 1];

  return (
    <div className="border-b border-paper/10 bg-nacht">
      <section className="grid lg:grid-cols-12" aria-labelledby="end-band">
        {image ? (
          <div className="relative min-h-[18rem] overflow-hidden lg:order-2 lg:col-span-5 lg:min-h-[30rem]">
            <Frame src={image} alt="" className="absolute inset-0" sizes="(max-width: 1024px) 100vw, 42vw" />
          </div>
        ) : null}
        <div data-rise="" className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:col-span-7 lg:py-24 lg:pr-16 lg:pl-edge">
          <h2
            id="end-band"
            className="t-section max-w-2xl text-paper"
          >
            {title}
          </h2>
          {text ? (
            <p className="t-lede mt-6 max-w-md text-paper/80">{text}</p>
          ) : null}
          <NextSteps primary={primary} locale={locale} tone="dark" className="mt-10" />
        </div>
      </section>

      {shown.length ? (
        <nav
          className="px-3 pt-12 pb-3 sm:px-4 sm:pb-4 lg:pt-16"
          aria-labelledby={tilesTitle ? "end-band-more" : undefined}
          aria-label={tilesTitle ? undefined : locale === "en" ? "More pages" : "Weitere Seiten"}
        >
          {tilesTitle ? (
            <h2 id="end-band-more" className="t-feature px-2 text-paper sm:px-4 lg:px-10">
              {tilesTitle}
            </h2>
          ) : null}
          <ul className={`mt-8 grid gap-3 ${layout.grid}`}>
            {shown.map((tile) => (
              <li key={tile.href}>
                <LocaleLink href={tile.href} className="group relative block overflow-hidden">
                  <Frame
                    src={tile.image!}
                    alt=""
                    className={`${layout.ratio} transition-transform duration-700 ease-out group-hover:scale-[1.02]`}
                    sizes={layout.sizes}
                  />
                  <span className="hero-scrim absolute inset-0" aria-hidden />
                  <span className="absolute inset-x-0 bottom-0 p-6">
                    <span className="t-feature block text-paper">{tile.title}</span>
                    {tile.text ? (
                      <span className="mt-2 block max-w-xs font-sans text-[14px] leading-relaxed text-paper/85 line-clamp-2">
                        {tile.text}
                      </span>
                    ) : null}
                  </span>
                </LocaleLink>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
