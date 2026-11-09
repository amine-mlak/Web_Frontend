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
  const shown = tiles.filter((tile) => tile.image).slice(0, 3);

  return (
    <section className="border-b border-paper/10 bg-nacht" aria-labelledby="end-band">
      <div className="grid lg:grid-cols-12">
        {image ? (
          <div className="relative min-h-[18rem] overflow-hidden lg:order-2 lg:col-span-5 lg:min-h-[30rem]">
            <Frame src={image} alt="" className="absolute inset-0" sizes="(max-width: 1024px) 100vw, 42vw" />
          </div>
        ) : null}
        <div className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:col-span-7 lg:px-16 lg:py-24">
          <h2
            id="end-band"
            className="max-w-2xl font-serif text-[36px] leading-[1.08] font-medium tracking-[-0.03em] text-paper md:text-[48px]"
          >
            {title}
          </h2>
          {text ? (
            <p className="mt-6 max-w-md font-sans text-[17px] leading-relaxed font-light text-paper/80">{text}</p>
          ) : null}
          <NextSteps primary={primary} locale={locale} tone="dark" className="mt-10" />
        </div>
      </div>

      {shown.length ? (
        <div className="px-3 pt-12 pb-3 sm:px-4 sm:pb-4 lg:pt-16">
          {tilesTitle ? (
            <h3 className="px-3 font-serif text-[26px] leading-tight font-medium text-paper sm:px-6 md:text-[32px] lg:px-12">
              {tilesTitle}
            </h3>
          ) : null}
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((tile) => (
              <li key={tile.href}>
                <LocaleLink href={tile.href} className="group relative block overflow-hidden">
                  <Frame
                    src={tile.image!}
                    alt=""
                    className="aspect-[4/3] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <span className="hero-scrim absolute inset-0" aria-hidden />
                  <span className="absolute inset-x-0 bottom-0 p-6">
                    <span className="block font-serif text-[28px] leading-tight font-medium text-paper">{tile.title}</span>
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
        </div>
      ) : null}
    </section>
  );
}
