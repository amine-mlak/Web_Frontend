"use client";

import { useEffect, useRef, useState } from "react";
import CmsImage from "@/components/CmsImage";

export type WorkshopStep = {
  step: string;
  title: string;
  description: string;
};

export type WorkshopShot = {
  src: string;
  alt: string;
};

/**
 * The steps to a kitchen beside photos of the house. From laptop size the photo stays in place
 * while the steps scroll past, and changes to the photo of the step being read. Below that each
 * step carries its own photo.
 */
export default function WorkshopSteps({
  steps,
  shots,
}: {
  steps: WorkshopStep[];
  shots: WorkshopShot[];
}) {
  const [active, setActive] = useState(0);
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const shotFor = (index: number) => shots[Math.min(index, shots.length - 1)];

  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      return;
    }
    // A step counts as "being read" while it crosses the middle of the screen.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(Number((entry.target as HTMLElement).dataset.step));
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    items.current.forEach((item) => item && observer.observe(item));
    return () => observer.disconnect();
  }, [steps.length]);

  return (
    <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-16">
      {shots.length ? (
        <div className="hidden lg:col-span-6 lg:block">
          <div className="sticky top-24 h-[min(calc(100svh-9rem),44rem)] overflow-hidden bg-nacht">
            {steps.map((step, index) => {
              const shot = shotFor(index);
              return (
                <div
                  key={step.step}
                  className="photo-mood absolute inset-0 transition-opacity duration-700 ease-in-out motion-reduce:transition-none"
                  style={{ opacity: index === active ? 1 : 0 }}
                  aria-hidden={index !== active}
                >
                  <CmsImage src={shot.src} alt={shot.alt} fill loading="lazy" sizes="50vw" className="object-cover" />
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      <ol className={shots.length ? "lg:col-span-5 lg:col-start-8" : "lg:col-span-7"}>
        {steps.map((step, index) => {
          const shot = shots.length ? shotFor(index) : null;
          return (
            <li
              key={step.step}
              ref={(element) => {
                items.current[index] = element;
              }}
              data-step={index}
              className={`border-t border-paper/20 py-10 transition-opacity duration-500 motion-reduce:transition-none lg:py-[13vh] ${
                index === active ? "" : "lg:opacity-45"
              }`}
            >
              {shot ? (
                <div className="photo-mood relative mb-8 aspect-[3/2] overflow-hidden bg-nacht lg:hidden">
                  <CmsImage src={shot.src} alt={shot.alt} fill loading="lazy" sizes="100vw" className="object-cover" />
                </div>
              ) : null}
              <p className="font-sans text-[15px] text-messing">{step.step}</p>
              <h3 className="t-feature mt-3 text-paper">{step.title}</h3>
              <p className="mt-4 max-w-md font-sans text-[16px] leading-relaxed text-paper/80 md:text-[17px]">
                {step.description}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
