import CmsImage from "@/components/CmsImage";
import type { CollectionLook } from "@/lib/collection-present";

export default function LookRail({
  looks,
  eyebrow,
  title,
}: {
  looks: CollectionLook[];
  eyebrow: string;
  title: string;
}) {
  const [hero, ...rest] = looks;
  if (!hero) {
    return null;
  }

  return (
    <section className="border-y border-line bg-paper" aria-labelledby="look-rail-heading">
      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
        <p className="type-eyebrow text-muted">{eyebrow}</p>
        <h2
          id="look-rail-heading"
          className="mt-3 max-w-2xl font-serif text-[32px] font-medium tracking-[-0.03em] text-ink md:text-[42px]"
        >
          {title}
        </h2>
        <div className="mt-12 grid gap-4 md:grid-cols-12 md:grid-rows-2 md:gap-5">
          <figure className="relative min-h-[22rem] overflow-hidden bg-karte md:col-span-7 md:row-span-2 md:min-h-[36rem]">
            <CmsImage
              src={hero.src}
              alt={hero.alt}
              fill
              sizes="(max-width: 768px) 100vw, 58vw"
              className="object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-nacht/55 via-transparent to-transparent"
              aria-hidden="true"
            />
            <figcaption className="absolute bottom-5 left-5 z-10 font-sans text-[11px] tracking-[0.18em] text-paper uppercase">
              {hero.caption}
            </figcaption>
          </figure>
          {rest.slice(0, 2).map((look) => (
            <figure
              key={look.src}
              className="relative aspect-[4/5] overflow-hidden bg-karte md:col-span-5 md:aspect-auto md:min-h-[17rem]"
            >
              <CmsImage
                src={look.src}
                alt={look.alt}
                fill
                sizes="(max-width: 768px) 100vw, 42vw"
                className="object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-nacht/50 via-transparent to-transparent"
                aria-hidden="true"
              />
              <figcaption className="absolute right-4 bottom-4 z-10 font-sans text-[11px] tracking-[0.16em] text-paper uppercase">
                {look.caption}
              </figcaption>
            </figure>
          ))}
        </div>
        {rest.length > 2 ? (
          <ul className="mt-4 grid gap-4 sm:grid-cols-3">
            {rest.slice(2, 5).map((look) => (
              <li key={look.src}>
                <figure className="relative aspect-[4/5] overflow-hidden bg-karte">
                  <CmsImage
                    src={look.src}
                    alt={look.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-nacht/50 via-transparent to-transparent"
                    aria-hidden="true"
                  />
                  <figcaption className="absolute bottom-4 left-4 z-10 font-sans text-[11px] tracking-[0.16em] text-paper uppercase">
                    {look.caption}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
