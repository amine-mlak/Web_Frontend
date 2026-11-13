import { useId } from "react";
import EndBand, { type EndBandTile } from "@/components/catalog/EndBand";
import LocaleLink from "@/components/LocaleLink";
import { Frame } from "@/components/catalog/collections/parts";
import { chromeCopy } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/seo";
import type { ClusterHouse, ClusterSibling } from "@/lib/collection-clusters";
import type { PresentedBranch, PresentedHub } from "@/lib/collection-present";

export type CrumbTone = "ink" | "paper";

export function Crumbs({ hub, tone }: { hub: PresentedHub; tone?: CrumbTone }) {
  const crumbs = hub.crumbs ?? [];
  if (crumbs.length === 0 && !hub.parentHref) {
    return null;
  }
  const items =
    crumbs.length > 0
      ? crumbs
      : [{ href: hub.parentHref ?? "/kuechen", label: hub.parentLabel ?? "" }];

  return <Breadcrumbs items={items} current={hub.title} locale={hub.locale} tone={tone} />;
}

/**
 * The parent links plus the BreadcrumbList JSON-LD (Home → parents → this page).
 * With a `tone` the parents show as one quiet line above the page name ("Material / Arbeitsplatten"),
 * so a visitor sees where the page sits and gets back in one click. Without a tone the trail is
 * only there for Google and screen readers. This page itself is never in the visible line: its
 * name is the h1 right below.
 */
export function Breadcrumbs({
  items,
  current,
  locale,
  tone,
}: {
  items: { href: string; label: string }[];
  current?: string;
  locale: PresentedHub["locale"];
  tone?: CrumbTone;
}) {
  // The last item (this page) has no URL.
  const trail = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { href: "/", label: chromeCopy[locale].home },
      ...items,
      ...(current ? [{ href: "", label: current }] : []),
    ].map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      ...(crumb.href ? { item: absoluteUrl(crumb.href, locale) } : {}),
    })),
  };

  return (
    <nav
      aria-label={locale === "en" ? "Breadcrumb" : "Brotkrumen"}
      className={tone ? `type-eyebrow ${tone === "paper" ? "text-paper/85" : "text-muted"}` : "sr-only"}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(trail) }}
      />
      <ol className={tone ? "flex flex-wrap items-center gap-x-2.5 gap-y-1" : undefined}>
        {items.map((crumb, index) => (
          <li key={`${crumb.href}-${crumb.label}`} className={tone ? "flex items-center gap-x-2.5" : undefined}>
            {tone && index > 0 ? <span aria-hidden="true">/</span> : null}
            <LocaleLink
              href={crumb.href}
              className={
                tone
                  ? `inline-flex min-h-6 items-center underline-offset-4 transition-colors hover:underline ${
                      tone === "paper" ? "hover:text-paper" : "hover:text-ink"
                    }`
                  : undefined
              }
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
  tone = "karte",
}: {
  quote: string;
  source: string;
  tone?: "karte" | "nacht";
}) {
  if (!quote) {
    return null;
  }
  const dark = tone === "nacht";

  return (
    <figure
      className={`border-t px-5 py-14 sm:px-8 lg:px-gutter lg:py-20 ${dark ? "border-paper/12 bg-nacht" : "border-line bg-karte"}`}
    >
      <blockquote className={`t-lead max-w-3xl ${dark ? "text-paper" : "text-ink"}`}>
        {quote}
      </blockquote>
      {source ? (
        <figcaption className={`type-eyebrow mt-6 ${dark ? "text-paper/70" : "text-muted"}`}>{source}</figcaption>
      ) : null}
    </figure>
  );
}

/**
 * Up to four kitchens as cards. `sub` sets it under a section that already has its h2;
 * `more` adds one link beside the heading (all projects).
 */
export function HouseLine({
  houses,
  title,
  sub,
  more,
}: {
  houses: ClusterHouse[];
  title: string;
  sub?: boolean;
  more?: { href: string; label: string };
}) {
  const headingId = useId();
  const shown = houses.slice(0, 4);
  if (shown.length === 0) {
    return null;
  }
  const Heading = sub ? "h3" : "h2";

  return (
    <section
      className={
        sub
          ? "px-5 pt-4 pb-16 sm:px-8 lg:px-gutter lg:pb-24"
          : "border-t border-line px-5 py-16 sm:px-8 lg:px-gutter lg:py-24"
      }
      aria-labelledby={headingId}
    >
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <Heading id={headingId} className={`${sub ? "t-feature" : "t-section"} text-ink`}>
          {title}
        </Heading>
        {more ? (
          <LocaleLink
            href={more.href}
            className="inline-flex min-h-6 items-center gap-2 font-sans text-[14px] text-ink underline underline-offset-4"
          >
            {more.label} <span aria-hidden="true">→</span>
          </LocaleLink>
        ) : null}
      </div>
      <ul
        className={`mt-10 grid gap-8 ${
          shown.length === 4
            ? "sm:grid-cols-2 lg:grid-cols-4"
            : shown.length === 3
              ? "sm:grid-cols-2 lg:grid-cols-3"
              : shown.length === 2
                ? "sm:grid-cols-2"
                : "max-w-xl"
        }`}
      >
        {shown.map((house) => (
          <li key={house.href}>
            <LocaleLink href={house.href} className="group block">
              <Frame
                src={house.image}
                alt={house.title}
                className={shown.length === 2 ? "aspect-[4/5] sm:aspect-[4/3] lg:aspect-[3/2]" : "aspect-[4/5]"}
                sizes={shown.length === 2 ? "(max-width: 640px) 100vw, 50vw" : "(max-width: 1024px) 100vw, 33vw"}
              />
              <p className="t-item mt-4 text-ink">{house.title}</p>
              {house.meta ? <p className="type-eyebrow mt-2 text-muted">{house.meta}</p> : null}
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
            <h3 className="t-item text-ink">{branch.title}</h3>
            <p className="mt-3 max-w-xl font-sans text-[16px] leading-relaxed text-muted">
              {branch.text}
            </p>
            {branch.points.length > 0 ? (
              <ul className="mt-4 max-w-xl space-y-2">
                {branch.points.map((point) => (
                  <li
                    key={point}
                    className="font-sans text-[16px] leading-relaxed text-ink/80"
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

/**
 * What the page claims, then the points that back it. The sentence is the section's heading
 * only when points follow; a sentence standing alone is a statement in the reading flow.
 */
export function PointsSection({ hub, className = "" }: { hub: PresentedHub; className?: string }) {
  const headingId = useId();
  if (!hub.statement && hub.branches.length === 0) {
    return null;
  }
  if (hub.branches.length === 0) {
    return (
      <section className={`px-5 py-16 sm:px-8 lg:px-gutter lg:py-24 ${className}`}>
        <p className="t-lead max-w-3xl text-ink">{hub.statement}</p>
        {hub.statementNote ? (
          <p className="mt-6 max-w-xl font-sans text-[16px] leading-relaxed text-muted">{hub.statementNote}</p>
        ) : null}
      </section>
    );
  }

  return (
    <section
      className={`mx-auto grid max-w-[90rem] gap-x-12 gap-y-10 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:px-gutter lg:py-24 ${className}`}
      aria-labelledby={hub.statement ? headingId : undefined}
    >
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-28">
          {hub.statement ? (
            <h2 id={headingId} className="t-feature text-ink">
              {hub.statement}
            </h2>
          ) : null}
          {hub.statementNote ? (
            <p className="mt-6 max-w-md font-sans text-[16px] leading-relaxed text-muted">{hub.statementNote}</p>
          ) : null}
        </div>
      </div>
      <div className="lg:col-span-7">
        <RuledPoints branches={hub.branches} />
      </div>
    </section>
  );
}

export function IndexRows({
  items,
  eyebrow,
  title,
}: {
  items: ClusterSibling[];
  eyebrow?: string;
  title: string;
}) {
  const headingId = useId();
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-line px-5 py-16 sm:px-8 lg:px-gutter" aria-labelledby={headingId}>
      {eyebrow ? <p className="type-eyebrow mb-3 text-gold">{eyebrow}</p> : null}
      <h2
        id={headingId}
        className="t-section text-ink"
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
                <span className="t-item block text-ink">{item.title}</span>
                <span className="mt-1 block max-w-xl font-sans text-[16px] leading-relaxed text-muted">
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
/**
 * The end of a detail page: the dark band with a photo and the next step, plus photo tiles to
 * neighbouring pages when the page passes them.
 */
export function SoftClose({
  hub,
  tiles,
  tilesTitle,
}: {
  hub: PresentedHub;
  tiles?: EndBandTile[];
  tilesTitle?: string;
}) {
  return (
    <EndBand
      title={hub.closeTitle}
      text={hub.closeText}
      image={hub.closeImage || undefined}
      primary={{ href: hub.ctaHref, label: hub.ctaLabel }}
      tiles={tiles}
      tilesTitle={tilesTitle}
      locale={hub.locale}
    />
  );
}

/** Neighbouring pages as photo cards (other places, other categories). */
export function SiblingCards({
  siblings,
  eyebrow,
  title,
}: {
  siblings: ClusterSibling[];
  eyebrow?: string;
  title?: string;
}) {
  const id = useId();
  if (siblings.length === 0) {
    return null;
  }
  return (
    <section className="px-5 py-16 sm:px-8 lg:px-gutter lg:py-20" aria-labelledby={title ? id : undefined}>
      {eyebrow ? <p className="type-eyebrow text-gold">{eyebrow}</p> : null}
      {title ? (
        <h2 id={id} className="t-section mt-3 text-ink">
          {title}
        </h2>
      ) : null}
      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {siblings.map((sibling) => (
          <li key={sibling.href}>
            <LocaleLink href={sibling.href} className="group block">
              <Frame
                src={sibling.image}
                alt=""
                className="aspect-[4/5]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <span className="t-item mt-4 block text-ink">{sibling.title}</span>
              {sibling.text ? <span className="mt-1 block font-sans text-[14px] leading-relaxed text-muted">{sibling.text}</span> : null}
            </LocaleLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
