import CmsImage from "@/components/CmsImage";
import { chromeCopy } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/locale";
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_HREF,
  INSTAGRAM_LABEL,
  INSTAGRAM_POSTS,
} from "@/lib/instagram";

function InstagramMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle
        cx="12"
        cy="12"
        r="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
    </svg>
  );
}

export default async function InstagramFeed() {
  const copy = chromeCopy[await getRequestLocale()];

  return (
    <section className="bg-paper" aria-labelledby="instagram-heading">
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <p className="font-sans text-[11px] font-medium tracking-[0.22em] text-bronze-tafel">
              INSTAGRAM
            </p>
            <h2
              id="instagram-heading"
              className="mt-3 font-serif text-[32px] leading-[1.12] font-medium tracking-[-0.02em] text-ink md:text-[40px]"
            >
              {copy.instagramTitle} {INSTAGRAM_LABEL}
            </h2>
          </div>
          <a
            href={INSTAGRAM_HREF}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-ink px-4 text-[14px] tracking-[0.04em] text-paper transition-opacity hover:opacity-80"
            data-umami-event="instagram_follow"
            data-umami-event-handle={INSTAGRAM_HANDLE}
          >
            <InstagramMark className="h-4 w-4" />
            {copy.instagramFollow}
          </a>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 md:grid-cols-4 md:gap-4">
          {INSTAGRAM_POSTS.map((post) => (
            <li key={post.href}>
              <a
                href={post.href}
                target="_blank"
                rel="noreferrer"
                className="group relative block aspect-[4/3] overflow-hidden bg-karte"
                data-umami-event="instagram_post"
                aria-label={`${post.alt} ${copy.instagramOpen}`}
              >
                <CmsImage
                  src={post.src}
                  alt={post.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </a>
            </li>
          ))}
          <li>
            <a
              href={INSTAGRAM_HREF}
              target="_blank"
              rel="noreferrer"
              className="flex aspect-[4/3] flex-col items-center justify-center gap-3 bg-karte text-muted transition-colors hover:text-ink"
              data-umami-event="instagram_more"
            >
              <InstagramMark className="h-7 w-7" />
              <span className="whitespace-pre-line text-center font-sans text-[14px] leading-5">
                {copy.instagramMore}
              </span>
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
