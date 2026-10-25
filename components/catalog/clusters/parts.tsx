import { useId } from "react";
import LocaleLink from "@/components/LocaleLink";
import { Frame } from "@/components/catalog/collections/parts";
import { chromeCopy } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/seo";
import type { ClusterHouse, ClusterSibling, PresentedCluster } from "@/lib/collection-clusters";
import type { PresentedBranch, PresentedHub } from "@/lib/collection-present";

export function Crumbs({
  hub,
  tone = "ink",
}: {
  hub: PresentedHub;
  tone?: "ink" | "paper";
}) {
  const crumbs = hub.crumbs ?? [];
  if (crumbs.length === 0 && !hub.parentHref) {
    return null;
  }
  const items =
    crumbs.length > 0
      ? crumbs
      : [{ href: hub.parentHref ?? "/kuechen", label: hub.parentLabel ?? "" }];

  // Home → parents → this page, for Google's breadcrumb trail. The last item has no URL.
  const trail = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { href: "/", label: chromeCopy[hub.locale].home },
      ...items,
      ...(hub.title ? [{ href: "", label: hub.title }] : []),
    ].map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      ...(crumb.href ? { item: absoluteUrl(crumb.href, hub.locale) } : {}),
    })),
  };

  return (
    <nav aria-label={hub.locale === "en" ? "Breadcrumb" : "Brotkrumen"}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(trail) }}
      />
      <ol
        className={`flex flex-wrap items-center font-sans text-[11px] tracking-[0.22em] uppercase ${
          tone === "paper" ? "text-paper/75" : "text-muted"
        }`}
      >
        {items.map((crumb, index) => (
          <li key={`${crumb.href}-${crumb.label}`} className="flex items-center">
            {index > 0 ? (
              <span
                className={`mx-2 ${tone === "paper" ? "text-paper/40" : "text-line"}`}
                aria-hidden="true"
              >
                /
              </span>
            ) : null}
            <LocaleLink
              href={crumb.href}
              className={`inline-flex min-h-6 items-center ${
                tone === "paper"
                  ? "text-paper transition-opacity hover:opacity-70"
                  : "transition-opacity hover:opacity-60"
              }`}
            >
              {crumb.label}
            </LocaleLink>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function QuoteLine({
  quote,
  source,
}: {
  quote: string;
  source: string;
}) {
  if (!quote) {
    return null;
  }

  return (
    <figure className="border-t border-line bg-karte px-5 py-14 sm:px-8 lg:px-14 lg:py-20">
      <blockquote className="max-w-3xl font-serif text-[26px] leading-snug font-medium tracking-[-0.03em] text-ink italic md:text-[34px]">
        {quote}
      </blockquote>
      {source ? (
        <figcaption className="type-eyebrow mt-6 text-muted">{source}</figcaption>
      ) : null}
    </figure>
  );
}

export function HouseLine({
  houses,
  title,
}: {
  houses: ClusterHouse[];
  title: string;
}) {
  const shown = houses.slice(0, 3);
  if (shown.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-line px-5 py-16 sm:px-8 lg:px-14 lg:py-20">
      <h2 className="font-serif text-[32px] font-medium tracking-[-0.03em] text-ink md:text-[40px]">
        {title}
      </h2>
      <ul
        className={`mt-10 grid gap-8 ${
          shown.length > 1 ? "sm:grid-cols-2 lg:grid-cols-3" : "max-w-xl"
        }`}
      >
        {shown.map((house) => (
          <li key={house.href}>
            <LocaleLink href={house.href} className="group block">
              <Frame
                src={house.image}
                alt={house.title}
                className="aspect-[4/5]"
                imgClassName="transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              <p className="mt-4 font-serif text-[22px] leading-snug font-medium text-ink">
                {house.title}
              </p>
              {house.meta ? (
                <p className="mt-2 font-sans text-[11px] tracking-[0.18em] text-muted uppercase">
                  {house.meta}
                </p>
              ) : null}
            </LocaleLink>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function RuledPoints({ branches }: { branches: PresentedBranch[] }) {
  if (branches.length === 0) {
    return null;
  }

  return (
    <ol className="border-t border-line">
      {branches.map((branch) => (
        <li
          key={`${branch.kicker}-${branch.title}`}
          className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-4 border-b border-line py-7"
        >
          <span className="type-eyebrow pt-2 text-gold">{branch.kicker}</span>
          <div>
            <h3 className="font-serif text-[26px] leading-tight font-medium tracking-[-0.02em] text-ink md:text-[30px]">
              {branch.title}
            </h3>
            <p className="mt-3 max-w-xl font-sans text-[16px] leading-relaxed text-muted">
              {branch.text}
            </p>
            {branch.points.length > 0 ? (
              <ul className="mt-4 max-w-xl space-y-2">
                {branch.points.map((point) => (
                  <li
                    key={point}
                    className="font-sans text-[15px] leading-relaxed text-ink/80"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function IndexRows({
  items,
  eyebrow,
  title,
}: {
  items: ClusterSibling[];
  eyebrow: string;
  title: string;
}) {
  const headingId = useId();
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-line px-5 py-16 sm:px-8 lg:px-14" aria-labelledby={headingId}>
      <p className="type-eyebrow text-gold">{eyebrow}</p>
      <h2
        id={headingId}
        className="mt-3 font-serif text-[32px] font-medium tracking-[-0.03em] text-ink md:text-[40px]"
      >
        {title}
      </h2>
      <ul className="mt-8 border-t border-line">
        {items.map((item) => (
          <li key={item.href} className="border-b border-line">
            <LocaleLink
              href={item.href}
              className="grid items-center gap-4 py-5 sm:grid-cols-[5.5rem_minmax(0,1fr)]"
            >
              <Frame
                src={item.image}
                alt=""
                className="aspect-square"
                sizes="88px"
              />
              <span>
                <span className="block font-serif text-[24px] leading-tight font-medium text-ink md:text-[28px]">
                  {item.title}
                </span>
                <span className="mt-1 block max-w-xl font-sans text-[15px] leading-relaxed text-muted">
                  {item.text}
                </span>
              </span>
            </LocaleLink>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ClusterLinks({ hub }: { hub: PresentedCluster }) {
  if (hub.siblings.length === 0) {
    return null;
  }
  const label = hub.locale === "en" ? "Other rooms" : "Andere Bereiche";

  return (
    <nav aria-label={label} className="border-t border-line px-5 py-8 sm:px-8 lg:px-14">
      <p className="type-eyebrow text-muted">{label}</p>
      <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
        {hub.siblings.map((item) => (
          <li key={item.href}>
            <LocaleLink
              href={item.href}
              className="font-serif text-[22px] text-ink transition-opacity hover:opacity-60"
            >
              {item.title}
            </LocaleLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SoftClose({ hub }: { hub: PresentedHub }) {
  return (
    <section className="border-t border-line px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
      <h2 className="max-w-2xl font-serif text-[36px] leading-[1.05] font-medium tracking-[-0.03em] text-ink md:text-[48px]">
        {hub.closeTitle}
      </h2>
      <p className="mt-5 max-w-md font-sans text-[16px] leading-relaxed text-muted">
        {hub.closeText}
      </p>
      <LocaleLink href={hub.ctaHref} className="pill pill-primary mt-8 w-fit">
        {hub.ctaLabel}
      </LocaleLink>
    </section>
  );
}
