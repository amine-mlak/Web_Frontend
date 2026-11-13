import BookletForm from "@/components/booklet/BookletForm";
import CmsImage from "@/components/CmsImage";
import type { Booklet } from "@/lib/booklet";

/**
 * A booklet request page: a light hero with the cover and what is inside, then the form.
 * Styleguide: Cormorant headings with one italic accent, Figtree text, no slider.
 */
export default function BookletPage({ booklet }: { booklet: Booklet }) {
  const paragraphs = booklet.intro.split(/\n{2,}|\n/).map((line) => line.trim()).filter(Boolean);
  return (
    <main className="bg-paper">
      <section aria-labelledby="booklet-title" className="px-5 pt-10 pb-14 sm:px-8 lg:px-gutter lg:pt-16 lg:pb-20">
        <div className="mx-auto grid max-w-[90rem] items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <div>
            {booklet.eyebrow ? <p className="type-eyebrow text-gold">{booklet.eyebrow}</p> : null}
            <h1 id="booklet-title" className="type-h1 mt-3 text-ink">
              {booklet.title}
              {booklet.titleEmphasis ? (
                <>
                  {" "}
                  <em className="italic">{booklet.titleEmphasis}</em>
                </>
              ) : null}
            </h1>
            <div className="type-intro mt-6 max-w-[42rem] space-y-4">
              {paragraphs.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            {booklet.benefits.length ? (
              <ul className="mt-8 max-w-[42rem] divide-y divide-line border-y border-line">
                {booklet.benefits.map((benefit, index) => (
                  <li key={benefit} className="flex items-baseline gap-4 py-3">
                    <span className="font-sans text-[12px] tracking-[0.2em] text-gold">{String(index + 1).padStart(2, "0")}</span>
                    <span className="font-serif text-[21px] leading-snug text-ink">{benefit}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          {booklet.cover ? (
            // The booklet mock-up sits on white; multiply lets the page colour show through it.
            <div className="order-first lg:order-none">
              <div className="relative mx-auto aspect-[2/3] w-full max-w-[15rem] sm:max-w-[20rem] lg:max-w-[28rem]">
                <CmsImage
                  src={booklet.cover.src}
                  srcSet={booklet.cover.srcSet}
                  alt={booklet.cover.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 28rem, (min-width: 640px) 20rem, 15rem"
                  className="object-contain mix-blend-multiply"
                />
              </div>
            </div>
          ) : booklet.hero ? (
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-karte">
              <CmsImage
                src={booklet.hero.src}
                srcSet={booklet.hero.srcSet}
                alt={booklet.hero.alt}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          ) : null}
        </div>
      </section>

      <section aria-label="Booklet anfordern" className="bg-karte px-5 py-14 sm:px-8 lg:px-gutter lg:py-20">
        <div className="mx-auto max-w-3xl">
          <BookletForm slug={booklet.slug} title={booklet.formTitle} printNote={booklet.printNote} />
        </div>
      </section>
    </main>
  );
}
