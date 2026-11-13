"use client";

import { useLocale } from "@/components/LocaleProvider";
import CtaPair from "@/components/CtaPair";
import { useEffect, useState } from "react";
import CmsImage from "@/components/CmsImage";
import type { HeroSlide } from "@/lib/strapi";

export type HeroPanel = {
  eyebrow: string;
  title: string;
  emphasis: string;
  text: string;
  buttonLabel: string;
  buttonHref: string;
};

const DWELL_MS = 3500;
const ROLL_MS = 1200;

function HeroIntro({ panel }: { panel: HeroPanel }) {
  const locale = useLocale();
  return (
    <div className="absolute inset-0 z-10 flex items-end px-5 pb-10 sm:px-8 sm:pb-20 lg:px-gutter lg:pb-24">
      <div className="hero-scrim pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
      {/* Below laptop size the text fills most of the shorter picture, so more of it needs the shade. */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-black/40 via-black/25 to-black/5 lg:hidden" aria-hidden="true" />
      <div className="max-w-3xl text-paper">
        <p className="font-sans text-[11px] font-medium tracking-[0.22em] text-paper uppercase">
          {panel.eyebrow}
        </p>
        <h1 className="mt-2 font-serif text-[32px] md:text-[42px] xl:text-[60px] leading-[1.05] font-medium tracking-[-0.02em] text-paper sm:mt-2.5 min-[1400px]:whitespace-nowrap">
          {panel.title}{panel.emphasis ? ` ${panel.emphasis}` : ""}
        </h1>
        <p className="mt-3 max-w-lg font-sans text-[16px] leading-relaxed font-light text-paper md:text-[18px]">
          {panel.text}
        </p>
        {/* The way into the kitchens as the button, the appointment beside it. */}
        <CtaPair href={panel.buttonHref} label={panel.buttonLabel} locale={locale} tone="image" second="termin" className="mt-7" />
      </div>
    </div>
  );
}

function shouldLoadImage(slideIndex: number, index: number, count: number) {
  if (slideIndex === 0) {
    return true;
  }

  if (Math.abs(slideIndex - index) <= 1) {
    return true;
  }

  return index === count && slideIndex <= 1;
}

export default function HeroCarousel({
  slides,
  panel,
}: {
  slides: HeroSlide[];
  panel?: HeroPanel;
}) {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  // With "reduce motion" switched on, the first photo stays put.
  const [still, setStill] = useState(false);
  const track = slides.length > 0 ? [...slides, slides[0]] : [];

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

    if (index === slides.length) {
      const snap = window.setTimeout(() => {
        setAnimate(false);
        setIndex(0);
      }, ROLL_MS);
      return () => window.clearTimeout(snap);
    }

    const next = window.setTimeout(() => {
      setIndex((current) => current + 1);
    }, DWELL_MS);

    return () => window.clearTimeout(next);
  }, [index, slides.length, still]);

  useEffect(() => {
    if (animate || index !== 0) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setAnimate(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [animate, index]);

  if (slides.length === 0) {
    return null;
  }

  return (
    <section
      data-site-hero=""
      className={
        panel
          ? // A wide picture rather than a full screen, so the next section already shows (16:9 on a laptop).
            // Phones and tablets stay taller than that, because the text sits on the photo.
            "relative isolate -mt-14 h-[max(115vw,30rem)] w-full overflow-hidden bg-nacht sm:h-[max(min(72vw,calc(100svh-3.5rem)),26rem)] lg:h-[max(min(56.25vw,calc(100svh-6rem)),32rem)]"
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

      <div
        className="flex h-full w-full"
        style={{
          transform: `translateX(-${index * 100}%)`,
          transition: animate
            ? `transform ${ROLL_MS}ms cubic-bezier(0.45, 0.02, 0.2, 1)`
            : "none",
        }}
      >
        {track.map((slide, slideIndex) => {
          const load = shouldLoadImage(slideIndex, index, slides.length);

          return (
            <div
              key={`${slide.src}-${slideIndex}`}
              className="relative h-full w-full min-w-full shrink-0 bg-espresso"
              aria-hidden={slideIndex !== index}
            >
              {load ? (
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
      </div>
      {panel ? <HeroIntro panel={panel} /> : null}
    </section>
  );
}
