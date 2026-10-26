import RichText from "@/components/RichText";

export default function HouseBody({
  eyebrow,
  title,
  paragraphs,
}: {
  eyebrow?: string;
  title?: string;
  paragraphs: string[];
}) {
  if (paragraphs.length === 0) {
    return null;
  }

  return (
    <section className="bg-paper" aria-labelledby={title ? "house-body-heading" : undefined}>
      <div className="mx-auto grid max-w-[90rem] gap-10 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-14 lg:py-28">
        <div className="lg:col-span-4">
          <span className="mb-8 block h-px w-14 bg-gold" aria-hidden="true" />
          {eyebrow ? <p className="type-eyebrow text-muted">{eyebrow}</p> : null}
          {title ? (
            <h2
              id="house-body-heading"
              className="mt-3 max-w-sm font-serif text-[28px] leading-[1.12] font-medium tracking-[-0.03em] text-ink sm:text-[34px]"
            >
              {title}
            </h2>
          ) : null}
        </div>
        {/* The CMS text is Markdown: headings, lists and bold, as on the article pages. */}
        <RichText source={paragraphs.join("\n\n")} className="max-w-xl lg:col-span-7 lg:col-start-6" />

      </div>
    </section>
  );
}
