import type { ReactNode } from "react";
import LocaleLink from "@/components/LocaleLink";
import CmsImage from "@/components/CmsImage";
import type { PresentedHub } from "@/lib/collection-present";
import {
  APPLIANCE_BRANDS,
  applianceBrand,
} from "@/lib/appliance-media";
import { Frame, HubEnd } from "@/components/catalog/collections/parts";
import { QuoteLine } from "@/components/catalog/clusters/parts";
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
      <section className="px-5 pt-12 pb-10 sm:px-8 lg:px-gutter lg:pt-20" aria-labelledby="geraete-hero">
        <div className="grid gap-10 lg:grid-cols-12">
          <h1
            id="geraete-hero"
            className="t-display text-paper lg:col-span-7"
          >
            {hub.title}
          </h1>
          <div className="lg:col-span-5 lg:pt-4">
            <p className="t-lede text-paper/75">
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
        className="border-t border-paper/12 px-5 py-10 sm:px-8 lg:px-gutter"
        aria-labelledby="geraete-partners"
      >
        <h2 id="geraete-partners" className="t-item text-paper">
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

      <section aria-label={hub.indexEyebrow}>
        <ul>
          {hub.branches.map((branch) => {
            const sink = branch.href?.includes("spuelen");
            return (
              <li key={branch.title} className="border-t border-paper/12">
                <LocaleLink
                  href={branch.href ?? "/beratung"}
                  className="group grid items-center gap-6 px-5 py-8 sm:px-8 lg:grid-cols-12 lg:px-gutter lg:py-10"
                >
                  <p className="t-feature text-messing lg:col-span-1">
                    {branch.kicker}
                  </p>
                  <div className="lg:col-span-4">
                    <h2 className="t-feature text-paper">
                      {branch.title}
                    </h2>
                  </div>
                  <p className="font-sans text-[16px] leading-relaxed font-light text-paper/65 lg:col-span-3">
                    {branch.text}
                  </p>
                  <Frame
                    src={branch.image}
                    alt={branch.alt}
                    srcSet={branch.srcSet}
                    className="aspect-[16/7] lg:col-span-4"
                    imgClassName={cn(sink && !branch.source && "object-top")}
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </LocaleLink>
              </li>
            );
          })}
        </ul>
      </section>

      <QuoteLine quote={hub.quote} source={hub.quoteSource} tone="nacht" />

      <div className="bg-paper text-ink">
        <HubEnd hub={hub}>{children}</HubEnd>
      </div>
    </main>
  );
}
