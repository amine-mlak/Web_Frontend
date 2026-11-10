import LocaleLink from "@/components/LocaleLink";
import { Frame } from "@/components/catalog/collections/parts";
import type { Locale } from "@/lib/i18n";
import type { PhotoStory, StoryPhoto } from "@/lib/photo-match";

/**
 * Photo sections of an entry page (a material, an appliance, a brand). Every photo shows the
 * thing the page is about, in a kitchen we built; the caption is the photo's own description
 * and links to the project.
 */

function caption(photo: StoryPhoto) {
  return photo.alt.replace(/[.\s]+$/, "");
}

const NOTE = "font-sans text-[14px] leading-relaxed text-muted";

function ProjectLink({ photo, locale, className = "" }: { photo: StoryPhoto; locale: Locale; className?: string }) {
  const label = locale === "en" ? "The kitchen" : "Zur Küche";
  return (
    <LocaleLink
      href={photo.href}
      className={`whitespace-nowrap text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-ink ${className}`}
    >
      {label}
      <span aria-hidden="true"> →</span>
      <span className="sr-only">: {photo.project}</span>
    </LocaleLink>
  );
}

/** Opens the page: one large photo and two beside it, all from the same kitchen. */
export function PhotoOpener({ opener, locale }: { opener: NonNullable<PhotoStory["opener"]>; locale: Locale }) {
  const { big, side } = opener;
  return (
    <section className="mt-10 lg:mt-14" aria-label={locale === "en" ? "Photos from one kitchen" : "Fotos aus einer Küche"}>
      <div className="grid grid-cols-2 gap-1.5 lg:h-[min(80svh,46vw)] lg:grid-cols-12">
        <Frame
          src={big.src}
          srcSet={big.srcSet}
          alt={big.alt}
          className="col-span-2 aspect-[4/3] lg:col-span-8 lg:aspect-auto lg:h-full"
          priority
          sizes="(max-width: 1024px) 100vw, 67vw"
        />
        <div className="col-span-2 grid grid-cols-2 gap-1.5 lg:col-span-4 lg:grid-cols-1 lg:grid-rows-2">
          {side.map((photo) => (
            <Frame
              key={photo.src}
              src={photo.src}
              srcSet={photo.srcSet}
              alt={photo.alt}
              className="aspect-square lg:aspect-auto lg:h-full"
              sizes="(max-width: 1024px) 50vw, 33vw"
            />
          ))}
        </div>
      </div>
      <p className={`flex flex-wrap items-baseline justify-between gap-x-10 gap-y-1 px-5 pt-4 sm:px-8 lg:px-14 ${NOTE}`}>
        <span>
          {caption(big)}
          {big.place ? ` · ${big.place}` : ""}
        </span>
        <ProjectLink photo={big} locale={locale} />
      </p>
    </section>
  );
}

/** One close-up from edge to edge, between two texts. */
export function CloseBand({
  photo,
  locale,
  className,
  priority = false,
}: {
  photo: StoryPhoto;
  locale: Locale;
  className?: string;
  /** The photo opens the page: it loads first and stands still. */
  priority?: boolean;
}) {
  return (
    <div className={className}>
      <Frame
        src={photo.src}
        srcSet={photo.srcSet}
        alt={photo.alt}
        className="aspect-[4/3] w-full sm:aspect-[2/1] lg:aspect-[5/2]"
        drift={!priority}
        priority={priority}
        sizes="100vw"
      />
      <p className={`flex flex-wrap items-baseline justify-between gap-x-10 gap-y-1 px-5 pt-4 sm:px-8 lg:px-14 ${NOTE}`}>
        <span>
          {caption(photo)}
          {photo.place ? ` · ${photo.place}` : ""}
        </span>
        <ProjectLink photo={photo} locale={locale} />
      </p>
    </div>
  );
}

/** Two photos of one kitchen at different sizes, the second set lower. */
export function PhotoPair({
  pair,
  locale,
  flip = false,
}: {
  pair: [StoryPhoto, StoryPhoto];
  locale: Locale;
  /** The small photo on the left. */
  flip?: boolean;
}) {
  const [wide, small] = pair;
  return (
    <section className="mx-auto max-w-[90rem] px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
      <div className="grid gap-x-10 gap-y-10 lg:grid-cols-12 lg:items-start">
        <div className={flip ? "lg:order-2 lg:col-span-7 lg:col-start-6" : "lg:col-span-7"}>
          <Frame
            src={wide.src}
            srcSet={wide.srcSet}
            alt={wide.alt}
            className={wide.portrait ? "aspect-[4/5]" : "aspect-[4/3]"}
            sizes="(max-width: 1024px) 100vw, 56vw"
          />
          <p className={`mt-4 max-w-xl ${NOTE}`}>{caption(wide)}</p>
        </div>
        <div
          className={`w-3/4 sm:w-1/2 lg:w-auto lg:pt-40 ${
            flip ? "lg:order-1 lg:col-span-4 lg:col-start-1" : "lg:col-span-4 lg:col-start-9"
          }`}
        >
          <Frame
            src={small.src}
            srcSet={small.srcSet}
            alt={small.alt}
            className={small.portrait ? "aspect-[3/4]" : "aspect-[5/4]"}
            sizes="(max-width: 1024px) 75vw, 30vw"
          />
          <p className={`mt-4 ${NOTE}`}>
            {caption(small)}
            {small.place ? ` · ${small.place}` : ""}
          </p>
          <p className={`mt-2 ${NOTE}`}>
            <ProjectLink photo={small} locale={locale} />
          </p>
        </div>
      </div>
    </section>
  );
}
