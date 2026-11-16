import BookletForm from "@/components/booklet/BookletForm";
import CmsImage from "@/components/CmsImage";
import { fetchBooklet } from "@/lib/booklet";

/**
 * The order form on /katalog: BEER's printed piece is the booklet "7 Geheimnisse", so the
 * catalogue order is the booklet form (postcode check, print only to Bavaria and
 * Baden-Württemberg, PDF everywhere). It sends `katalog_order` and leads to the booklet's
 * thank-you page. Without the booklet entry the section is left out.
 */
const BOOKLET_SLUG = "7-geheimnisse";

export default async function KatalogOrder() {
  const booklet = await fetchBooklet(BOOKLET_SLUG);
  if (!booklet) return null;

  return (
    <section id="bestellen" aria-labelledby="katalog-order-title" className="scroll-mt-20 bg-karte px-5 py-14 sm:px-8 lg:px-gutter lg:py-20">
      <div className="mx-auto grid max-w-5xl items-start gap-10 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] md:gap-14">
        {booklet.cover ? (
          <div className="relative mx-auto aspect-[2/3] w-2/5 md:w-full">
            <CmsImage
              src={booklet.cover.src}
              srcSet={booklet.cover.srcSet}
              alt={booklet.cover.alt}
              fill
              sizes="(min-width: 768px) 15rem, 40vw"
              className="object-contain mix-blend-multiply"
            />
          </div>
        ) : null}
        <div>
          <h2 id="katalog-order-title" className="sr-only">
            {booklet.title} {booklet.titleEmphasis}
          </h2>
          <BookletForm slug={booklet.slug} title={booklet.formTitle} printNote={booklet.printNote} />
        </div>
      </div>
    </section>
  );
}
