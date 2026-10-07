import CmsImage from "@/components/CmsImage";
import type { PresentedBranch } from "@/lib/collection-present";

function hashHref(href: string | undefined, index: number) {
  if (href?.includes("#")) {
    return href.slice(href.indexOf("#"));
  }
  return `#thema-${index + 1}`;
}

export default function ChapterIndex({
  branches,
  eyebrow,
  hint,
  image,
}: {
  branches: PresentedBranch[];
  eyebrow: string;
  hint: string;
  image: string;
}) {
  if (branches.length === 0) {
    return null;
  }

  return (
    <section
      id="manufaktur-index"
      className="border-y border-line bg-paper"
      aria-labelledby="collection-index-heading"
    >
      <div className="mx-auto grid max-w-[90rem] lg:grid-cols-12">
        <figure className="relative min-h-[18rem] overflow-hidden bg-nacht lg:col-span-5 lg:min-h-[36rem]">
          <CmsImage
            src={image}
            alt={eyebrow}
            fill
            sizes="(max-width: 1024px) 100vw, 42vw"
            className="object-cover"
          />
          <figcaption className="absolute bottom-6 left-6 font-sans text-[11px] tracking-[0.22em] text-paper uppercase">
            {eyebrow}
          </figcaption>
        </figure>
        <div className="px-5 py-12 sm:px-8 lg:col-span-7 lg:px-14 lg:py-16">
          <p className="type-eyebrow text-gold">{eyebrow}</p>
          <h2
            id="collection-index-heading"
            className="mt-3 font-serif text-[32px] font-medium tracking-[-0.03em] text-ink md:text-[40px]"
          >
            {hint}
          </h2>
          <ol className="mt-10">
            {branches.map((branch, index) => (
              <li key={`${branch.title}-${index}`} className="border-t border-line last:border-b">
                <a
                  href={hashHref(branch.href, index)}
                  className="group flex items-baseline gap-5 py-5 transition-colors hover:bg-karte sm:gap-8 sm:py-6"
                >
                  <span className="w-10 shrink-0 font-serif text-[22px] text-gold">
                    {branch.kicker}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-serif text-[22px] leading-tight font-medium tracking-[-0.02em] text-ink md:text-[26px]">
                      {branch.title}
                    </span>
                    <span className="mt-2 block max-w-xl font-sans text-[15px] leading-relaxed font-light text-muted">
                      {branch.text}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="hidden shrink-0 font-sans text-[18px] text-gold transition-transform group-hover:translate-x-1 sm:block"
                  >
                    →
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
