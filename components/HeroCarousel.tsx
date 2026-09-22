"use client";

import { useEffect, useState } from "react";
import CmsImage from "@/components/CmsImage";
import type { HeroSlide } from "@/lib/strapi";

const DWELL_MS = 3500;
const ROLL_MS = 1200;

function shouldLoadImage(slideIndex: number, index: number, count: number) {
  if (slideIndex === 0) {
    return true;
  }

  if (Math.abs(slideIndex - index) <= 1) {
    return true;
  }

  return index === count && slideIndex <= 1;
}

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
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
      className="relative isolate -mt-16 h-[320px] w-full overflow-hidden bg-nacht sm:h-[48vh] lg:-mt-24 lg:h-dvh"
      aria-roledescription="carousel"
      aria-label="Küchenprojekte"
    >
      <h1 className="sr-only">
        BEER Küchenmanufaktur – individuelle Manufakturküchen
      </h1>

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
    </section>
  );
}
