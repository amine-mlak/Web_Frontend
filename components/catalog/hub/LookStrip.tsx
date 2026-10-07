import CmsImage from "@/components/CmsImage";
import type { CollectionLook } from "@/lib/collection-present";

export default function LookStrip({
  looks,
  label,
}: {
  looks: CollectionLook[];
  label: string;
}) {
  if (looks.length === 0) {
    return null;
  }

  return (
    <section aria-label={label} className="bg-nacht">
      <ul className="grid grid-cols-2 lg:grid-cols-4">
        {looks.map((look, index) => (
          <li key={look.src} className="relative min-w-0">
            <figure className="relative aspect-[4/5] overflow-hidden bg-nacht sm:aspect-[3/4]">
              <CmsImage
                src={look.src}
                alt={look.alt}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 hover:scale-[1.03]"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-nacht/70 via-transparent to-transparent"
                aria-hidden="true"
              />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 px-4 py-4 sm:px-5">
                <span className="font-sans text-[10px] tracking-[0.18em] text-paper/80 uppercase">
                  {look.caption}
                </span>
                <span className="font-serif text-[18px] leading-none text-messing">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
