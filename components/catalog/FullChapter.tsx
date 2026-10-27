import LocaleLink from "@/components/LocaleLink";
import { Frame } from "@/components/catalog/collections/parts";

/**
 * A full-screen chapter: one photo across the whole width, a small line above, the name, one
 * sentence and a link. Chapters alternate sides, so a run of them keeps a rhythm.
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
}) {
  const right = index % 2 === 1;
  return (
    <section className="relative isolate min-h-[78svh] overflow-hidden bg-nacht" aria-labelledby={id}>
      <Frame src={image} srcSet={srcSet} alt={alt} className="absolute inset-0" sizes="100vw" />
      <div className="hero-scrim absolute inset-0" aria-hidden />
      <div className={`relative z-10 flex min-h-[78svh] items-end px-5 pb-12 sm:px-8 lg:px-14 lg:pb-16 ${right ? "lg:justify-end" : ""}`}>
        <div className="max-w-2xl">
          {kicker ? <p className="font-sans text-[14px] text-paper/80">{kicker}</p> : null}
          <Heading
            id={id}
            lang={lang}
            className="mt-3 flex items-center gap-4 font-serif text-[40px] leading-[0.98] font-medium tracking-[-0.035em] text-paper hyphens-auto sm:text-[52px] lg:text-[64px]"
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
          {text ? <p className="mt-4 max-w-md font-sans text-[17px] leading-relaxed text-paper/90">{text}</p> : null}
          <LocaleLink href={href} className="btn-quiet mt-7 text-paper">
            {linkLabel}
            <span className="sr-only">: {title}</span>
          </LocaleLink>
        </div>
      </div>
    </section>
  );
}
