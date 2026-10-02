import LocaleLink from "@/components/LocaleLink";
import CmsImage from "@/components/CmsImage";
import type { PresentedHub } from "@/lib/collection-present";

export default function CloseAtelier({ hub }: { hub: PresentedHub }) {
  return (
    <section className="grid overflow-hidden bg-nacht md:grid-cols-2">
      <figure className="relative min-h-[22rem] md:min-h-[38rem]">
        <CmsImage
          src={hub.closeImage}
          alt={hub.heroAlt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </figure>
      <div className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-16">
        <span className="mb-8 block h-px w-12 bg-messing" aria-hidden="true" />
        <h2 className="font-serif text-[36px] leading-[1.08] font-medium tracking-[-0.03em] text-paper md:text-[52px]">
          {hub.closeTitle}
        </h2>
        <p className="mt-6 max-w-md font-sans text-[17px] leading-relaxed font-light text-paper/80 md:text-[19px]">
          {hub.closeText}
        </p>
        <LocaleLink href={hub.ctaHref} className="pill pill-light mt-10 w-fit">
          {hub.ctaLabel}
        </LocaleLink>
      </div>
    </section>
  );
}
