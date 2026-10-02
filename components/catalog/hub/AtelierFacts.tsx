import CmsImage from "@/components/CmsImage";
import type { CollectionFact } from "@/lib/collection-present";

export default function AtelierFacts({
  facts,
  kicker,
  image,
  sentence,
}: {
  facts: CollectionFact[];
  kicker: string;
  image: string;
  sentence: string;
}) {
  return (
    <section className="border-b border-line bg-paper" aria-label={kicker}>
      <div className="mx-auto grid max-w-[90rem] lg:grid-cols-12">
        <figure className="relative min-h-[22rem] overflow-hidden bg-nacht lg:col-span-5 lg:min-h-[36rem]">
          <CmsImage
            src={image}
            alt={kicker}
            fill
            sizes="(max-width: 1024px) 100vw, 42vw"
            className="object-cover"
          />
        </figure>
        <div className="lg:col-span-7">
          <div className="grid sm:grid-cols-2">
            {facts.map((fact) => (
              <article
                key={`${fact.value}-${fact.label}`}
                className="border-b border-line px-6 py-10 sm:odd:border-r md:px-10 md:py-14"
              >
                <p className="font-serif text-[36px] leading-none font-medium tracking-[-0.03em] text-ink md:text-[44px]">
                  {fact.value}
                </p>
                <p className="type-eyebrow mt-4 text-muted">{fact.label}</p>
              </article>
            ))}
          </div>
          <p className="border-t border-line px-6 py-10 font-serif text-[22px] leading-[1.25] font-medium tracking-[-0.02em] text-ink italic sm:px-10 md:text-[28px]">
            {sentence}
          </p>
        </div>
      </div>
    </section>
  );
}
