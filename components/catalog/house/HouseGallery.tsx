import CmsImage from "@/components/CmsImage";
import type { HouseShot } from "@/lib/house-photos";

export default function HouseGallery({
  eyebrow,
  title,
  shots,
}: {
  eyebrow: string;
  title: string;
  shots: HouseShot[];
}) {
  if (shots.length === 0) {
    return null;
  }

  return (
    <section className="scroll-mt-24 bg-paper" aria-labelledby="house-gallery-heading">
      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
        <p className="type-eyebrow text-gold">{eyebrow}</p>
        <h2
          id="house-gallery-heading"
          className="mt-3 max-w-2xl font-serif text-[32px] leading-[1.08] font-medium tracking-[-0.03em] text-ink md:text-[42px]"
        >
          {title}
        </h2>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
          {shots.map((shot, index) => {
            const wide = index === 0 || index === 5;
            const portrait = index === 1 || index === 6;
            return (
              <li
                key={`${shot.src}-${index}`}
                className={
                  wide
                    ? "lg:col-span-8"
                    : portrait
                      ? "lg:col-span-4"
                      : "lg:col-span-6"
                }
              >
                <figure className="relative overflow-hidden bg-nacht">
                  <div
                    className={
                      portrait ? "aspect-[3/4]" : wide ? "aspect-[16/10]" : "aspect-[4/3]"
                    }
                  >
                    <CmsImage
                      src={shot.src}
                      alt={shot.alt}
                      fill
                      sizes={wide ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 1024px) 100vw, 50vw"}
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 font-sans text-[11px] tracking-[0.18em] text-muted uppercase">
                    {shot.alt}
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
