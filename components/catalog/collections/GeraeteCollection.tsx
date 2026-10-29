import type { ReactNode } from "react";
import LocaleLink from "@/components/LocaleLink";
import CmsImage from "@/components/CmsImage";
import type { PresentedHub } from "@/lib/collection-present";
import {
  APPLIANCE_BRANDS,
  applianceBrand,
} from "@/lib/appliance-media";
import { Frame, HubEnd } from "@/components/catalog/collections/parts";
import { cn } from "@/lib/utils";

function BrandMark({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const brand = applianceBrand(slug);
  if (!brand) {
    return null;
  }

  return (
    <span className={cn("relative block h-6 w-[7.5rem]", className)}>
      <CmsImage
        src={brand.logo}
        alt={brand.name}
        fill
        sizes="120px"
        className={cn(
          "object-contain object-left",
          brand.invert && "brightness-0 invert",
        )}
      />
    </span>
  );
}

export default function GeraeteCollection({
  hub,
  children,
}: {
  hub: PresentedHub;
  children?: ReactNode;
}) {
  const partners = hub.locale === "en" ? "Partners we fit" : "Marken, die wir einbauen";

  return (
    <main className="bg-nacht text-paper">
      <section className="px-5 pt-12 pb-10 sm:px-8 lg:px-14 lg:pt-20" aria-labelledby="geraete-hero">
        <div className="grid gap-10 lg:grid-cols-12">
          <h1
            id="geraete-hero"
            className="font-serif text-[48px] leading-[0.9] font-medium tracking-[-0.045em] text-paper sm:text-[80px] lg:col-span-7 lg:text-[92px]"
          >
            {hub.title}
          </h1>
          <div className="lg:col-span-5 lg:pt-4">
            <p className="font-sans text-[17px] leading-relaxed font-light text-paper/75">
              {hub.lede}
            </p>
            <p className="mt-6 font-sans text-[14px] leading-relaxed text-paper/55">
              {hub.statementNote}
            </p>
            <LocaleLink href={hub.ctaHref} className="btn-quiet mt-8 text-paper">
              {hub.ctaLabel}
            </LocaleLink>
          </div>
        </div>
        <Frame
          src={hub.heroImage}
          alt={hub.heroAlt}
          className="mt-14 aspect-[21/9] w-full"
          imgClassName="object-cover object-center"
          priority
          sizes="100vw"
        />
      </section>

      <section
        className="border-t border-paper/12 px-5 py-10 sm:px-8 lg:px-14"
        aria-labelledby="geraete-partners"
      >
        <h2 id="geraete-partners" className="font-serif text-[22px] font-medium text-paper">
          {partners}
        </h2>
        <ul className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-6">
          {APPLIANCE_BRANDS.map((brand) => (
            <li key={brand.slug}>
              <LocaleLink
                href={`/marken/${brand.slug}`}
                className="block opacity-90 transition-opacity hover:opacity-100"
              >
                <BrandMark slug={brand.slug} className="h-7 w-[8.5rem]" />
              </LocaleLink>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="geraete-index">
        <h2 id="geraete-index" className="sr-only">
          {hub.indexEyebrow}
        </h2>
        <ul>
          {hub.branches.map((branch) => {
            const sink = branch.href?.includes("spuelen");
            return (
              <li key={branch.title} className="border-t border-paper/12">
                <LocaleLink
                  href={branch.href ?? "/beratung"}
                  className="group grid items-center gap-6 px-5 py-8 sm:px-8 lg:grid-cols-12 lg:px-14 lg:py-10"
                >
                  <p className="font-serif text-[28px] text-messing lg:col-span-1">
                    {branch.kicker}
                  </p>
                  <div className="lg:col-span-4">
                    <h3 className="font-serif text-[28px] leading-tight font-medium tracking-[-0.03em] text-paper md:text-[34px]">
                      {branch.title}
                    </h3>
                  </div>
                  <p className="font-sans text-[15px] leading-relaxed font-light text-paper/65 lg:col-span-3">
                    {branch.text}
                  </p>
                  <Frame
                    src={branch.image}
                    alt={branch.alt}
                    srcSet={branch.srcSet}
                    className="aspect-[16/7] lg:col-span-4"
                    imgClassName={cn(sink && "object-top")}
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </LocaleLink>
              </li>
            );
          })}
        </ul>
      </section>

      {hub.quote ? (
        <section className="border-t border-paper/12 px-5 py-16 text-center sm:px-8 lg:py-20">
          <p className="mx-auto max-w-3xl font-serif text-[24px] leading-snug font-medium text-paper md:text-[30px]">
            {hub.quote}
          </p>
          <p className="mt-5 font-sans text-[14px] text-paper/70">{hub.quoteSource}</p>
        </section>
      ) : null}

      <div className="bg-paper text-ink">
        <HubEnd hub={hub}>{children}</HubEnd>
      </div>
    </main>
  );
}
