import type { CSSProperties } from "react";
import CmsImage from "@/components/CmsImage";
import LocaleLink from "@/components/LocaleLink";
import { Frame } from "@/components/catalog/collections/parts";
import { cmsValue } from "@/lib/catalog";
import { fetchBrands } from "@/lib/catalog-api";
import { MAKER_PAGE_PHOTOS, makerImage } from "@/lib/maker-photos";
import { fetchBrandLogos } from "@/lib/strapi";
import { cn } from "@/lib/utils";

/**
 * A maker we fit, on a page under /geraete: one photo from the maker that drifts slowly while the
 * page scrolls, beside it the logo, the brand's sentence from the CMS and the way to its page.
 * Pages without a maker photo show nothing.
 */
export default async function MakerBand({
  slug,
  locale,
}: {
  slug: string;
  locale: string;
}) {
  const photo = MAKER_PAGE_PHOTOS[slug];
  if (!photo) return null;
  const [logos, brands] = await Promise.all([fetchBrandLogos(), fetchBrands()]);
  const logo = logos.find((item) => item.slug === photo.brand);
  const brand = brands.find((item) => item.slug === photo.brand);
  const name = logo?.name ?? brand?.name;
  if (!name) return null;
  const en = locale === "en";
  const image = makerImage(photo, locale);
  const intro = brand ? cmsValue(locale, brand, brand.intro) : "";

  return (
    <section className="bg-nacht text-paper" aria-labelledby="maker-band">
      <div className="grid lg:grid-cols-12">
        <div
          className="maker-photo lg:col-span-7"
          style={
            photo.position
              ? ({ "--maker-position": photo.position } as CSSProperties)
              : undefined
          }
        >
          <Frame
            src={image.src}
            srcSet={image.srcSet}
            alt={image.alt}
            className="aspect-[4/3] w-full lg:aspect-auto lg:h-full lg:min-h-[560px]"
            drift
            sizes="(max-width: 1024px) 100vw, 58vw"
          />
        </div>
        <div className="px-5 py-12 sm:px-8 lg:col-span-5 lg:flex lg:flex-col lg:justify-center lg:px-14 lg:py-16">
          <p className="font-sans text-[14px] text-paper/60">
            {en ? "A brand we fit" : "Eine Marke, die wir einbauen"}
          </p>
          <h2 id="maker-band" className="mt-6">
            {logo ? (
              <span className="relative block h-9 w-44">
                <CmsImage
                  src={logo.logo}
                  alt={name}
                  fill
                  sizes="176px"
                  className={cn(
                    "object-contain object-left",
                    logo.invert && "brightness-0 invert",
                  )}
                />
              </span>
            ) : (
              <span className="t-section">{name}</span>
            )}
          </h2>
          {intro ? (
            <p className="t-lede mt-8 max-w-md text-paper/90">{intro}</p>
          ) : null}
          <p className="mt-5 max-w-md font-sans text-[15px] leading-relaxed text-paper/65">
            {en ? "In the photo" : "Im Bild"}: {image.alt}.{" "}
            {en ? "Photo" : "Foto"}: {name}.
          </p>
          <p className="mt-8">
            <LocaleLink
              href={`/marken/${photo.brand}`}
              className="font-sans text-[15px] text-paper underline decoration-messing underline-offset-4"
            >
              {en ? "About the brand" : "Zur Marke"}: {name}
            </LocaleLink>
          </p>
        </div>
      </div>
    </section>
  );
}
