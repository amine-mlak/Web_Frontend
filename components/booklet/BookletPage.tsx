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
        <div className="mx-auto grid max-w-[90rem] items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
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
          {booklet.cover || booklet.hero ? (
            <div className="lg:col-span-5">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden bg-karte">
                <CmsImage
                  src={(booklet.cover ?? booklet.hero)!.src}
                  srcSet={(booklet.cover ?? booklet.hero)!.srcSet}
                  alt={(booklet.cover ?? booklet.hero)!.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 28rem, 100vw"
                  className="object-cover"
                />
              </div>
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
