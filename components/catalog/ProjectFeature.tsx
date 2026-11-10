import { Fragment } from "react";
import LocaleLink from "@/components/LocaleLink";
import { Frame } from "@/components/catalog/collections/parts";
import type { Locale } from "@/lib/i18n";
import type { ProjectFeatureData } from "@/lib/project-features";

/** The words of one kitchen: place and year, name, its text, and the pages it connects to. */
function FeatureText({
  feature,
  locale,
  wide,
  level,
}: {
  feature: ProjectFeatureData;
  locale: Locale;
  wide?: boolean;
  level: 2 | 3;
}) {
  const en = locale === "en";
  const Heading = level === 3 ? "h3" : "h2";
  return (
    <div className={wide ? "grid gap-6 lg:grid-cols-12 lg:gap-16" : ""}>
      <div className={wide ? "lg:col-span-5" : ""}>
        {feature.meta ? <p className="font-sans text-[14px] text-muted">{feature.meta}</p> : null}
        <Heading className={`${level === 3 ? "t-feature" : "t-section"} mt-3 text-ink`}>
          <LocaleLink href={feature.href} className="transition-opacity hover:opacity-70">
            {feature.title}
          </LocaleLink>
        </Heading>
      </div>
      <div className={wide ? "lg:col-span-6 lg:col-start-7" : ""}>
        {feature.intro ? (
          <p className={`${wide ? "" : "mt-5"} max-w-md font-sans text-[17px] leading-relaxed text-muted`}>{feature.intro}</p>
        ) : null}
        <LocaleLink href={feature.href} className="btn-quiet mt-7 text-ink">
          {en ? "View the project" : "Projekt ansehen"}
        </LocaleLink>
        {feature.links.length ? (
          <p className="mt-8 max-w-md font-sans text-[14px] leading-relaxed text-muted">
            {en ? "In this kitchen: " : "In dieser Küche: "}
            {feature.links.map((link, index) => (
              <Fragment key={link.href}>
                {index ? " · " : ""}
                <LocaleLink href={link.href} className="text-ink underline decoration-line underline-offset-4 hover:decoration-ink">
                  {link.label}
                </LocaleLink>
              </Fragment>
            ))}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/**
 * One kitchen in this colour, like a page of an exposé. Four arrangements take turns, so each
 * kitchen looks different: photo and text side by side, text with a photo and a detail, a wide
 * photo with the text below, two photos with the text under them.
 * `level` is the heading level of the kitchen's name: 3 where a section title stands above.
 */
export default function ProjectFeature({
  feature,
  variant,
  locale,
  level = 2,
}: {
  feature: ProjectFeatureData;
  variant: number;
  locale: Locale;
  level?: 2 | 3;
}) {
  const photo = (className: string, sizes: string) => (
    <LocaleLink href={feature.href} className="group block" tabIndex={-1} aria-hidden="true">
      <Frame src={feature.image} srcSet={feature.srcSet} alt="" className={className} sizes={sizes} drift />
    </LocaleLink>
  );
  const detail = (className: string, sizes: string) =>
    feature.detail ? (
      <Frame src={feature.detail.src} srcSet={feature.detail.srcSet} alt={feature.detail.alt} className={className} sizes={sizes} />
    ) : null;

  if (variant === 1) {
    return (
      <article className="grid gap-10 px-5 py-14 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-16 lg:px-14 lg:py-24">
        <div className="order-2 lg:order-1 lg:col-span-5">
          <FeatureText feature={feature} locale={locale} level={level} />
        </div>
        <div className="relative order-1 lg:order-2 lg:col-span-7 lg:pb-16">
          {photo("aspect-[4/3]", "(max-width: 1024px) 100vw, 58vw")}
          {feature.detail ? (
            <div className="absolute bottom-0 -left-6 hidden w-[36%] border-8 border-paper lg:block">
              {detail("aspect-[4/5]", "20vw")}
            </div>
          ) : null}
        </div>
      </article>
    );
  }
  if (variant === 2) {
    return (
      <article className="py-14 lg:py-24">
        <div className="px-5 sm:px-8 lg:px-14">{photo("aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9]", "100vw")}</div>
        <div className="mt-10 px-5 sm:px-8 lg:px-14">
          <FeatureText feature={feature} locale={locale} level={level} wide />
        </div>
      </article>
    );
  }
  if (variant === 3 && feature.detail) {
    return (
      <article className="px-5 py-14 sm:px-8 lg:px-14 lg:py-24">
        <div className="grid gap-6 sm:grid-cols-2">
          {photo("aspect-[4/5]", "(max-width: 640px) 100vw, 50vw")}
          {detail("aspect-[4/5]", "(max-width: 640px) 100vw, 50vw")}
        </div>
        <div className="mx-auto mt-10 max-w-2xl">
          <FeatureText feature={feature} locale={locale} level={level} />
        </div>
      </article>
    );
  }
  return (
    <article className="grid gap-10 px-5 py-14 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-16 lg:px-14 lg:py-24">
      <div className="lg:col-span-7">{photo("aspect-[4/3]", "(max-width: 1024px) 100vw, 58vw")}</div>
      <div className="lg:col-span-5">
        <FeatureText feature={feature} locale={locale} level={level} />
      </div>
    </article>
  );
}

