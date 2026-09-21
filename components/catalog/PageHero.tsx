import CmsImage from "@/components/CmsImage";
import Pill from "@/components/Pill";

export default function PageHero({
  eyebrow,
  title,
  intro,
  image,
  srcSet,
  imageAlt,
  ctaLabel,
  ctaHref,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  image?: string;
  srcSet?: string;
  imageAlt?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <header className="border-b border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-end md:py-28">
        <div>
          <p className="type-eyebrow mb-3">{eyebrow}</p>
          <h1 className="type-h1 text-ink">{title}</h1>
          {intro ? (
            <p className="type-intro mt-6 max-w-xl">{intro}</p>
          ) : null}
          {ctaLabel && ctaHref ? (
            <div className="mt-8">
              <Pill href={ctaHref} variant="primary">
                {ctaLabel}
              </Pill>
            </div>
          ) : null}
        </div>
        {image ? (
          <div className="relative aspect-[4/3] overflow-hidden bg-karte">
            <CmsImage
              src={image}
              srcSet={srcSet}
              alt={imageAlt || title}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
        ) : null}
      </div>
    </header>
  );
}
