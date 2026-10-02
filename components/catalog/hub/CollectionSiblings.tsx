import LocaleLink from "@/components/LocaleLink";
import CmsImage from "@/components/CmsImage";
import type { ClusterSibling } from "@/lib/collection-clusters";

export default function CollectionSiblings({
  siblings,
  eyebrow,
  title,
}: {
  siblings: ClusterSibling[];
  eyebrow: string;
  title: string;
}) {
  if (siblings.length === 0) {
    return null;
  }

  return (
    <section className="border-y border-line bg-paper" aria-labelledby="collection-siblings-heading">
      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
        <p className="type-eyebrow text-muted">{eyebrow}</p>
        <h2
          id="collection-siblings-heading"
          className="mt-3 font-serif text-[32px] font-medium tracking-[-0.03em] text-ink md:text-[42px]"
        >
          {title}
        </h2>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {siblings.map((item, index) => (
            <li key={item.href}>
              <LocaleLink href={item.href} className="group block">
                <figure className="relative aspect-[4/5] overflow-hidden bg-nacht">
                  <CmsImage
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-nacht/70 via-transparent to-transparent"
                    aria-hidden="true"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 px-5 py-5">
                    <span>
                      <span className="block font-sans text-[10px] tracking-[0.18em] text-messing uppercase">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="mt-2 block font-serif text-[24px] leading-tight font-medium text-paper">
                        {item.title}
                      </span>
                      <span className="mt-1 block font-sans text-[13px] font-light text-paper/75">
                        {item.text}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </LocaleLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
