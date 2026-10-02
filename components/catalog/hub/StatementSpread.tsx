import CmsImage from "@/components/CmsImage";
import type { PresentedHub } from "@/lib/collection-present";

export default function StatementSpread({ hub }: { hub: PresentedHub }) {
  const caption =
    hub.locale === "en" ? "Showroom, Wolfersdorf" : "Ausstellung, Wolfersdorf";

  return (
    <section
      className="overflow-hidden bg-karte"
      aria-labelledby="collection-statement-heading"
    >
      <div className="mx-auto grid max-w-[90rem] items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:gap-6 lg:px-14 lg:py-28">
        <div className="relative lg:col-span-6 lg:min-h-[40rem]">
          <figure className="relative aspect-[4/5] overflow-hidden bg-nacht lg:absolute lg:inset-y-0 lg:left-0 lg:w-[72%]">
            <CmsImage
              src={hub.statementImage}
              alt={hub.heroAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </figure>
          <figure className="relative z-10 mt-[-28%] ml-auto aspect-[5/4] w-[62%] overflow-hidden border-[10px] border-karte bg-nacht shadow-[0_24px_60px_rgba(20,20,20,0.18)] lg:absolute lg:right-0 lg:bottom-[8%] lg:mt-0 lg:w-[48%] lg:border-[12px]">
            <CmsImage
              src={hub.statementImageB}
              alt=""
              fill
              sizes="(max-width: 1024px) 60vw, 28vw"
              className="object-cover"
            />
            <figcaption className="absolute bottom-4 left-4 font-sans text-[10px] tracking-[0.2em] text-paper uppercase">
              {caption}
            </figcaption>
          </figure>
        </div>

        <div className="flex flex-col justify-center lg:col-span-6 lg:pl-10 xl:pl-16">
          <span className="mb-8 block h-px w-14 bg-gold" aria-hidden="true" />
          <h2
            id="collection-statement-heading"
            className="max-w-2xl font-serif text-[28px] leading-[1.12] font-medium tracking-[-0.03em] text-ink sm:text-[36px] lg:text-[44px] xl:text-[48px]"
          >
            {hub.statement}
          </h2>
          <p className="type-intro mt-8 max-w-lg">{hub.statementNote}</p>
        </div>
      </div>
    </section>
  );
}
