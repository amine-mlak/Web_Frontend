import Link from "next/link";
import CmsImage from "@/components/CmsImage";
import { EntryGrid, type CatalogCardItem } from "@/components/catalog/EntryCard";
import SpecList from "@/components/catalog/SpecList";
import Pill from "@/components/Pill";

export default function DetailPage({
  eyebrow,
  title,
  meta,
  intro,
  body,
  image,
  srcSet,
  specs,
  links,
  relatedTitle,
  related,
  ctaLabel = "Diese Küche besprechen",
  ctaHref = "/beratung",
}: {
  eyebrow: string;
  title: string;
  meta?: string;
  intro?: string;
  body?: string;
  image?: string;
  srcSet?: string;
  specs?: { label: string; value: string }[];
  links?: { href: string; label: string }[];
  relatedTitle?: string;
  related?: CatalogCardItem[];
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <main className="bg-paper">
      <article>
        {image ? (
          <div className="relative h-[46vh] min-h-[18rem] overflow-hidden bg-karte md:h-[62vh]">
            <CmsImage
              src={image}
              srcSet={srcSet}
              alt={title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ) : null}
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
          <p className="type-eyebrow mb-3">{eyebrow}</p>
          <h1 className="type-h1 text-ink">{title}</h1>
          {meta ? <p className="type-body mt-3 text-muted">{meta}</p> : null}
          {intro ? <p className="type-intro mt-8">{intro}</p> : null}
          {body ? (
            <div className="mt-8 space-y-5">
              {body.split("\n\n").map((paragraph) => (
                <p key={paragraph.slice(0, 48)} className="type-body">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : null}
          {specs && specs.length > 0 ? (
            <div className="mt-12">
              <SpecList items={specs} />
            </div>
          ) : null}
          {links && links.length > 0 ? (
            <nav aria-label="Verwandte Seiten" className="mt-10 flex flex-wrap gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="type-nav border border-line bg-white px-3 py-2 text-ink transition-colors hover:border-ink"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          ) : null}
          <div className="mt-12">
            <Pill href={ctaHref} variant="primary">
              {ctaLabel}
            </Pill>
          </div>
        </div>
      </article>
      {related && related.length > 0 ? (
        <section className="border-t border-line">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
            <h2 className="type-h2 mb-10 text-ink">
              {relatedTitle || "Passend dazu"}
            </h2>
            <EntryGrid items={related} />
          </div>
        </section>
      ) : null}
    </main>
  );
}
