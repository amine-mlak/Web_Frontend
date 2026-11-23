import LocaleLink from "@/components/LocaleLink";
import CmsImage from "@/components/CmsImage";

export type CatalogCardItem = {
  href: string;
  title: string;
  image?: string;
  srcSet?: string;
  meta?: string;
  excerpt?: string;
  /** Upright photo: the crop keeps its top, where a poster's headline or a face sits. */
  portrait?: boolean;
};

export default function EntryCard({ item, eager = false }: { item: CatalogCardItem; eager?: boolean }) {
  return (
    <li>
      <LocaleLink href={item.href} className="group block">
        <article>
          <div className="relative aspect-[4/3] overflow-hidden bg-karte">
            {item.image ? (
              <CmsImage
                src={item.image}
                srcSet={item.srcSet}
                alt={item.title}
                fill
                loading={eager ? "eager" : undefined}
                sizes="(max-width: 768px) 100vw, (max-width: 1152px) 50vw, 33vw"
                className={item.portrait ? "object-cover object-top" : "object-cover"}
              />
            ) : (
              <div className="absolute inset-0 bg-karte" />
            )}
          </div>
          <div className="mt-4">
            {item.meta ? (
              <p className="type-eyebrow text-muted">{item.meta}</p>
            ) : null}
            {/* A card title, not a section title: long German headlines must fit a third of the page. */}
            <h2 className="t-item mt-2 text-ink hyphens-auto md:text-[28px] group-hover:underline group-hover:decoration-line group-hover:underline-offset-4">
              {item.title}
            </h2>
            {item.excerpt ? (
              <p className="type-body mt-2 text-muted">{item.excerpt}</p>
            ) : null}
          </div>
        </article>
      </LocaleLink>
    </li>
  );
}

/** `eager`: how many cards sit in the first view and load at once (one row on a wide screen). */
export function EntryGrid({ items, eager = 0 }: { items: CatalogCardItem[]; eager?: number }) {
  if (items.length === 0) {
    return (
      <p className="type-body text-muted">Hier liegen noch keine Einträge vor.</p>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <EntryCard key={item.href} item={item} eager={index < eager} />
      ))}
    </ul>
  );
}
