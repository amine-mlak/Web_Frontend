import LocaleLink from "@/components/LocaleLink";
import { Frame } from "@/components/catalog/collections/parts";
import type { PresentedHouse } from "@/lib/house-pages";

export default function HouseBanner({
  house,
  film,
  bare,
}: {
  house: PresentedHouse;
  film?: boolean;
  bare?: boolean;
}) {
  return (
    <section className="bg-paper px-5 pt-10 pb-6 sm:px-8 lg:px-14 lg:pt-16" aria-labelledby="house-banner">
      <p className="type-eyebrow text-gold">{house.eyebrow}</p>
      <div className="mt-6 grid items-end gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <h1
            id="house-banner"
            className="font-serif text-[44px] leading-[0.92] font-medium tracking-[-0.04em] text-ink sm:text-[72px] lg:text-[84px]"
          >
            {house.title}
            {house.emphasis ? <span className="mt-2 block text-espresso">{house.emphasis}</span> : null}
          </h1>
        </div>
        <div className="lg:col-span-5">
          <p className="max-w-md font-sans text-[17px] leading-relaxed font-light text-muted">
            {house.lede}
          </p>
          <LocaleLink href={house.ctaHref} className="pill pill-primary mt-8">
            {house.ctaLabel}
          </LocaleLink>
        </div>
      </div>
      {bare ? null : (
        <Frame
          src={house.heroImage}
          alt={house.heroAlt}
          className={film ? "mt-12 h-[32vh] min-h-[14rem] w-full lg:h-[40vh]" : "mt-12 aspect-[16/9] w-full lg:aspect-[21/9]"}
          imgClassName="object-cover object-center"
          priority
          sizes="100vw"
        />
      )}
    </section>
  );
}
