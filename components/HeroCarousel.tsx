"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  return (
    <div className="absolute inset-0 z-10 flex items-end px-4 pb-16 sm:px-8 sm:pb-20 lg:px-14 lg:pb-28">
      <div className="w-full max-w-xl bg-transparent px-7 py-9 text-paper backdrop-blur-[2px] sm:px-10 sm:py-12 lg:max-w-3xl">
        <p className="font-sans text-[11px] font-medium tracking-[0.22em] text-paper/80 uppercase">
          {panel.eyebrow}
        </p>
        <h1 className="mt-4 font-serif text-[36px] leading-[1.05] font-medium tracking-[-0.02em] text-paper sm:text-[44px] lg:text-[52px] lg:whitespace-nowrap">
          {panel.title} <em className="font-medium italic">{panel.emphasis}</em>
        </h1>
        <p className="mt-5 max-w-lg font-sans text-[16px] leading-relaxed font-light text-paper/90 md:text-[18px]">
          {panel.text}
        </p>
        <Link
          href={panel.buttonHref}
          className="mt-8 inline-flex items-center rounded-full bg-paper px-5 py-2.5 font-sans text-[15px] text-ink transition-colors hover:bg-white"
        >
          {panel.buttonLabel}
        </Link>
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
  const track = slides.length > 0 ? [...slides, slides[0]] : [];

  useEffect(() => {
    if (slides.length < 2) {
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
  }, [index, slides.length]);

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
          ? "relative isolate h-[36rem] w-full overflow-hidden bg-nacht sm:h-[70vh] lg:h-[78dvh]"
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
              className="relative h-full w-full min-w-full shrink-0 bg-nacht"
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
