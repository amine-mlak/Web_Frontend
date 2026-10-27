import LocaleLink from "@/components/LocaleLink";
import NextSteps from "@/components/catalog/NextSteps";
import { Frame } from "@/components/catalog/collections/parts";
import type { Locale } from "@/lib/i18n";

export type PageEndTile = { href: string; title: string; text?: string; image?: string };

/**
 * The same end on every overview page: a closing sentence with the next steps (appointment,
 * planner, phone), then large photo tiles to the neighbouring sections.
 */
export default function PageEnd({
  title,
  text,
  primary,
  tiles = [],
  tilesTitle,
  locale,
}: {
  title: string;
  text?: string;
  primary?: { href?: string; label?: string };
  tiles?: PageEndTile[];
  tilesTitle?: string;
  locale: Locale;
}) {
  const shown = tiles.filter((tile) => tile.image).slice(0, 4);
  return (
    <>
      <section className="border-t border-line px-5 py-16 sm:px-8 lg:px-14 lg:py-24" aria-labelledby="page-end">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <h2 id="page-end" className="font-serif text-[36px] leading-[1.05] font-medium tracking-[-0.03em] text-ink md:text-[52px]">
              {title}
            </h2>
            {text ? <p className="mt-5 max-w-lg font-sans text-[17px] leading-relaxed text-muted">{text}</p> : null}
          </div>
          <NextSteps primary={primary} locale={locale} className="lg:col-span-5 lg:justify-end" />
        </div>
      </section>
      {shown.length ? (
        <section className="px-3 pb-3 sm:px-4 sm:pb-4" aria-label={tilesTitle}>
          <ul className={`grid gap-3 sm:grid-cols-2 ${shown.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
            {shown.map((tile) => (
              <li key={tile.href}>
                <LocaleLink href={tile.href} className="group relative block">
                  <Frame
                    src={tile.image!}
                    alt=""
                    className="aspect-[4/5]"
                    imgClassName="transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <span className="hero-scrim absolute inset-0" aria-hidden />
                  <span className="absolute inset-x-0 bottom-0 p-6">
                    <span className="block font-serif text-[30px] leading-tight font-medium text-paper">{tile.title}</span>
                    {tile.text ? (
                      <span className="mt-2 block max-w-xs font-sans text-[14px] leading-relaxed text-paper/85">{tile.text}</span>
                    ) : null}
                  </span>
                </LocaleLink>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
