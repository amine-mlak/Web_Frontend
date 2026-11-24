"use client";

import { useLocale } from "@/components/LocaleProvider";
import CtaPair from "@/components/CtaPair";
import { useEffect, useState } from "react";
import CmsImage from "@/components/CmsImage";
import { MAIN_ACTIONS } from "@/lib/cta";
import type { HeroSlide } from "@/lib/strapi";

export type HeroPanel = {
  eyebrow: string;
  title: string;
  emphasis: string;
  text: string;
  buttonLabel: string;
  buttonHref: string;
};

// One kitchen stays long enough to be looked at, then the next fades in over it.
const DWELL_MS = 6500;
const FADE_MS = 1800;

function HeroIntro({ panel }: { panel: HeroPanel }) {
  const locale = useLocale();
  return (
    <div className="absolute inset-0 z-10 flex items-end px-5 pb-10 sm:px-8 sm:pb-16 lg:px-gutter lg:pb-20">
      {/* Shade only where words sit: under the menu at the top, and the lower left corner. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-black/45 to-transparent" aria-hidden="true" />
      <div className="hero-scrim pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_top_right,rgb(0_0_0/0.55)_0%,rgb(0_0_0/0.2)_38%,rgb(0_0_0/0)_62%)]"
        aria-hidden="true"
      />
      {/* On a page that carries the planner itself (the start page), the planner button does not
          leave the page: it glides down to the planner. Elsewhere it opens the planner page. */}
      <div
        className="max-w-[44rem] text-paper"
        onClickCapture={(event) => {
          const link = (event.target as HTMLElement).closest("a");
          const planner = document.getElementById("planer");
          // The planner button is marked by its tracking name; its address differs by language.
          if (!link || !planner || link.dataset.umamiEvent !== MAIN_ACTIONS.planner.event) return;
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          planner.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" });
        }}
      >
        <h1 className="font-serif text-[36px] leading-[1.04] font-medium tracking-[-0.025em] text-balance text-paper [font-size-adjust:cap-height_0.72] md:text-[52px] xl:text-[68px]">
          {panel.title}{panel.emphasis ? ` ${panel.emphasis}` : ""}
        </h1>
        <p className="mt-5 max-w-md font-sans text-[16px] leading-relaxed text-paper/95 md:text-[18px]">
          {panel.text}
        </p>
        {/* The way into the kitchens as the button, the appointment beside it. */}
        <CtaPair href={panel.buttonHref} label={panel.buttonLabel} locale={locale} tone="image" second="termin" className="mt-8" />
      </div>
    </div>
  );
}

export default function HeroCarousel({
  slides,
  panel,
}: {
  slides: HeroSlide[];
  panel?: HeroPanel;
}) {
  const [index, setIndex] = useState(0);
  // Photos load one ahead of the one on screen and stay once loaded.
  const [reach, setReach] = useState(1);
  // With "reduce motion" switched on, the first photo stays put.
  const [still, setStill] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setStill(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (slides.length < 2 || still) {
      return;
    }

    const next = window.setTimeout(() => {
      const following = (index + 1) % slides.length;
      setIndex(following);
      setReach((current) => Math.max(current, following + 1));
    }, DWELL_MS);

    return () => window.clearTimeout(next);
  }, [index, slides.length, still]);

  if (slides.length === 0) {
    return null;
  }

  return (
    <section
      data-site-hero=""
      data-hero-overlay={panel ? "" : undefined}
      className={
        panel
          ? // Nearly the full screen with the menu on the photo; a strip of the next section still shows.
            // Phones and tablets keep a shape of their own, because the text sits on the photo.
            "relative isolate -mt-14 h-[max(125vw,34rem)] w-full overflow-hidden bg-nacht sm:h-[max(min(78vw,100svh),28rem)] lg:h-[max(calc(100svh-3rem),34rem)]"
          : "relative isolate h-[320px] w-full overflow-hidden bg-nacht sm:h-[48vh] lg:h-dvh"
      }
      aria-roledescription="carousel"
      aria-label="Küchenprojekte"
    >
      {panel ? null : (
        <h1 className="sr-only">
          BEER Küchenmanufaktur – individuelle Manufakturküchen
        </h1>
      )}

      {slides.map((slide, slideIndex) => {
        const shown = slideIndex === index;
        return (
          <div
            key={`${slide.src}-${slideIndex}`}
            className="photo-grade absolute inset-0 bg-espresso transition-opacity ease-in-out motion-reduce:transition-none"
            style={{ opacity: shown ? 1 : 0, transitionDuration: `${FADE_MS}ms` }}
            aria-hidden={!shown}
          >
            {slideIndex <= reach ? (
              <CmsImage
                src={slide.src}
                srcSet={slide.srcSet}
                alt={slide.alt}
                fill
                priority={slideIndex === 0}
                loading={slideIndex === 0 ? "eager" : "lazy"}
                sizes="100vw"
                className="object-cover object-center"
              />
            ) : null}
          </div>
        );
      })}
      {panel ? <HeroIntro panel={panel} /> : null}
    </section>
  );
}
