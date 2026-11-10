import CmsImage from "@/components/CmsImage";
import type { CollectionFact } from "@/lib/collection-present";

export default function AtelierFacts({
  facts,
  kicker,
  image,
  imageAlt,
  sentence,
}: {
  facts: CollectionFact[];
  kicker: string;
  image: string;
  /** What the photo shows. Without it the photo is decoration beside the facts. */
  imageAlt?: string;
  sentence: string;
}) {
  return (
    <section className="border-b border-line bg-paper" aria-label={kicker}>
      <div className="mx-auto grid max-w-[90rem] lg:grid-cols-12">
        <figure className="relative min-h-[22rem] overflow-hidden bg-nacht lg:col-span-5 lg:min-h-[36rem]">
          <CmsImage
            src={image}
            alt={imageAlt ?? ""}
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
                <p className="t-section leading-none text-ink">
                  {fact.value}
                </p>
                <p className="type-eyebrow mt-4 text-muted">{fact.label}</p>
              </article>
            ))}
          </div>
          <p className="t-feature border-t border-line px-6 py-10 text-ink sm:px-10">
            {sentence}
          </p>
        </div>
      </div>
    </section>
  );
}
