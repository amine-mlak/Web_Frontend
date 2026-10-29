import LocaleLink from "@/components/LocaleLink";
import { Frame } from "@/components/catalog/collections/parts";

/**
 * A full-screen chapter: one photo across the whole width, a small line above, the name, one
 * sentence and a link. Chapters alternate sides, so a run of them keeps a rhythm.
 * `size="card"`: the same chapter as a photo card for a grid; the whole card is the link.
 */
export default function FullChapter({
  id,
  index,
  image,
  srcSet,
  alt,
  title,
  text,
  href,
  linkLabel,
  kicker,
  hex,
  lang,
  as: Heading = "h2",
  size = "full",
}: {
  id: string;
  index: number;
  image: string;
  srcSet?: string;
  alt: string;
  title: string;
  text?: string;
  href: string;
  linkLabel: string;
  kicker?: string;
  hex?: string;
  lang?: string;
  as?: "h2" | "h3";
  size?: "full" | "card";
}) {
  const card = size === "card";
  const right = !card && index % 2 === 1;
  const height = card ? "aspect-[4/5] sm:aspect-[4/3]" : "min-h-[78svh]";
  return (
    <section className={`group relative isolate overflow-hidden bg-nacht ${height}`} aria-labelledby={id}>
      <Frame
        src={image}
        srcSet={srcSet}
        alt={alt}
        className="absolute inset-0"
        imgClassName={card ? "transition-transform duration-700 group-hover:scale-[1.03]" : undefined}
        sizes={card ? "(max-width: 768px) 100vw, 50vw" : "100vw"}
      />
      <div className="hero-scrim absolute inset-0" aria-hidden />
      <div
        className={
          card
            ? "relative z-10 flex h-full items-end px-6 pb-8 sm:px-8 lg:px-10 lg:pb-10"
            : `relative z-10 flex min-h-[78svh] items-end px-5 pb-12 sm:px-8 lg:px-14 lg:pb-16 ${right ? "lg:justify-end" : ""}`
        }
      >
        <div className="max-w-2xl">
          {kicker ? <p className="font-sans text-[14px] text-paper/80">{kicker}</p> : null}
          <Heading
            id={id}
            lang={lang}
            className={`mt-3 flex items-center gap-4 font-serif leading-[0.98] font-medium tracking-[-0.035em] text-paper hyphens-auto ${
              card ? "text-[32px] lg:text-[40px]" : "text-[40px] sm:text-[52px] lg:text-[64px]"
            }`}
          >
            {hex ? (
              <span
                className="inline-block h-8 w-8 shrink-0 rounded-full border border-paper/60 md:h-10 md:w-10"
                style={{ backgroundColor: hex }}
                aria-hidden
              />
            ) : null}
            {title}
          </Heading>
          {text ? (
            <p className={`mt-4 max-w-md font-sans leading-relaxed text-paper/90 ${card ? "text-[16px]" : "text-[17px]"}`}>{text}</p>
          ) : null}
          {/* On a card the link covers the whole card. */}
          <LocaleLink
            href={href}
            className={`btn-quiet text-paper ${card ? "mt-5 after:absolute after:inset-0 after:content-['']" : "mt-7"}`}
          >
            {linkLabel}
            <span className="sr-only">: {title}</span>
          </LocaleLink>
        </div>
      </div>
    </section>
  );
}
