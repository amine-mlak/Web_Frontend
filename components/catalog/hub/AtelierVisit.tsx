import LocaleLink from "@/components/LocaleLink";
import CmsImage from "@/components/CmsImage";
import type { PresentedHub } from "@/lib/collection-present";

export default function AtelierVisit({ hub }: { hub: PresentedHub }) {
  const cta =
    hub.locale === "en" ? "Book a visit" : "Termin in der Ausstellung";

  return (
    <section className="bg-karte" aria-labelledby="atelier-visit-heading">
      <div className="mx-auto grid max-w-[90rem] lg:grid-cols-12">
        <figure className="relative min-h-[22rem] overflow-hidden bg-nacht lg:col-span-7 lg:min-h-[40rem]">
          <CmsImage
            src={hub.visitImage}
            alt={hub.visitPlace}
            fill
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover"
          />
        </figure>
        <div className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:col-span-5 lg:px-14 lg:py-24">
          <p className="type-eyebrow text-gold">
            {hub.locale === "en" ? "By appointment" : "Mit Termin"}
          </p>
          <h2
            id="atelier-visit-heading"
            className="mt-4 font-serif text-[32px] leading-[1.08] font-medium tracking-[-0.03em] text-ink md:text-[42px]"
          >
            {hub.visitPlace}
          </h2>
          <p className="mt-5 font-sans text-[15px] tracking-[0.08em] text-muted uppercase">
            {hub.visitLine}
          </p>
          <p className="type-intro mt-8">{hub.visitNote}</p>
          <LocaleLink href={hub.ctaHref} className="pill pill-primary mt-10 w-fit">
            {cta}
          </LocaleLink>
        </div>
      </div>
    </section>
  );
}
