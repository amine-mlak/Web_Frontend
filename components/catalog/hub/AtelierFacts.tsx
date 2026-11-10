import CmsImage from "@/components/CmsImage";
import { cn } from "@/lib/utils";
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
  /** A plain sentence under the tiles. Without it the tiles fill the height of the photo. */
  sentence?: string;
}) {
  return (
    <section className="border-b border-line bg-paper" aria-label={kicker}>
      <div className="mx-auto grid max-w-[90rem] lg:grid-cols-12">
        <figure
          className={cn(
            "relative min-h-[22rem] overflow-hidden bg-nacht lg:col-span-5",
            sentence ? "lg:min-h-[36rem]" : "lg:min-h-[30rem]",
          )}
        >
          <CmsImage
            src={image}
            alt={imageAlt ?? ""}
            fill
            sizes="(max-width: 1024px) 100vw, 42vw"
            className="object-cover"
          />
        </figure>
        <div className="flex flex-col overflow-hidden lg:col-span-7">
          <div
            className={cn(
              "grid sm:grid-cols-2",
              !sentence && "-mb-px flex-1 auto-rows-fr",
            )}
          >
            {facts.map((fact) => (
              <article
                key={`${fact.value}-${fact.label}`}
                className="flex flex-col justify-center border-b border-line px-6 py-10 sm:odd:border-r md:px-10 md:py-14"
              >
                <p className="t-section leading-none text-ink">{fact.value}</p>
                <p className="type-eyebrow mt-4 text-muted">{fact.label}</p>
              </article>
            ))}
          </div>
          {sentence ? (
            <p className="t-feature px-6 py-10 text-ink sm:px-10">{sentence}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
