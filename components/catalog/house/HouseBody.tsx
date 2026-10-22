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
        <div className="space-y-6 lg:col-span-7 lg:col-start-6">
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 48)} className="type-intro max-w-xl">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
