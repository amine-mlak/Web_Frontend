import Link from "next/link";
import CmsImage from "@/components/CmsImage";

export type CatalogCardItem = {
  href: string;
  title: string;
  image?: string;
  srcSet?: string;
  meta?: string;
  excerpt?: string;
};

export default function EntryCard({ item }: { item: CatalogCardItem }) {
  return (
    <li>
      <Link href={item.href} className="group block">
        <article>
          <div className="relative aspect-[4/3] overflow-hidden bg-karte">
            {item.image ? (
              <CmsImage
                src={item.image}
                srcSet={item.srcSet}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1152px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="absolute inset-0 bg-karte" />
            )}
          </div>
          <div className="mt-4">
            {item.meta ? (
              <p className="type-eyebrow text-muted">{item.meta}</p>
            ) : null}
            <h2 className="type-h3 mt-2 text-ink group-hover:underline group-hover:decoration-line group-hover:underline-offset-4">
              {item.title}
            </h2>
            {item.excerpt ? (
              <p className="type-body mt-2 text-muted">{item.excerpt}</p>
            ) : null}
          </div>
        </article>
      </Link>
    </li>
  );
}

export function EntryGrid({ items }: { items: CatalogCardItem[] }) {
  if (items.length === 0) {
    return (
      <p className="type-body text-muted">Hier liegen noch keine Einträge vor.</p>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <EntryCard key={item.href} item={item} />
      ))}
    </ul>
  );
}
