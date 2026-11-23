"use client";

import { useEffect, useState, type ReactNode } from "react";
import CmsImage from "@/components/CmsImage";

export type SwitcherArea = {
  /** Address of the area inside the page, e.g. "ankommen". */
  id: string;
  title: string;
  image: { src: string; srcSet?: string; alt: string };
  /** The area's heading, text, link and detail photo, rendered on the server. */
  panel: ReactNode;
};

/**
 * Several areas of one place in a single section: the names in a list, and beside it the photo
 * and the text of the chosen one. Every area's text is in the page; only the chosen one shows.
 * An address ending in #<area> opens that area. On phones the names are a row above the photo.
 */
export default function AreaSwitcher({ areas, label }: { areas: SwitcherArea[]; label: string }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const open = () => {
      const at = areas.findIndex((area) => `#${area.id}` === window.location.hash);
      if (at >= 0) {
        setActive(at);
        document.getElementById("bereiche")?.scrollIntoView({ block: "start" });
      }
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, [areas]);

  return (
    <section id="bereiche" className="scroll-mt-24 border-t border-line px-5 py-16 sm:px-8 lg:px-gutter lg:py-24" aria-label={label}>
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
        <div className="min-w-0 lg:col-span-4">
          <p className="font-sans text-[14px] text-muted">{label}</p>
          <ul className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0 lg:mt-6 lg:block lg:overflow-visible lg:border-t lg:border-line">
            {areas.map((area, index) => (
              <li key={area.id} className="shrink-0 lg:border-b lg:border-line">
                <button
                  type="button"
                  aria-pressed={index === active}
                  onClick={() => setActive(index)}
                  className={`cursor-pointer rounded-full border px-4 py-2 text-left font-sans text-[15px] whitespace-nowrap transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink lg:w-full lg:rounded-none lg:border-0 lg:px-0 lg:py-4 lg:font-serif lg:text-[24px] lg:leading-tight lg:font-medium lg:whitespace-normal ${
                    index === active
                      ? "border-ink bg-ink text-paper lg:bg-transparent lg:pl-4 lg:text-ink"
                      : "border-line text-ink lg:text-ink/40 lg:hover:text-ink"
                  } lg:transition-[color,padding]`}
                >
                  {area.title}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0 lg:col-span-8">
          <div className="photo-mood relative aspect-[4/3] overflow-hidden bg-nacht sm:aspect-[3/2]">
            {areas.map((area, index) => (
              <CmsImage
                key={area.id}
                src={area.image.src}
                srcSet={area.image.srcSet}
                alt={index === active ? area.image.alt : ""}
                aria-hidden={index === active ? undefined : true}
                fill
                loading={index === 0 ? undefined : "lazy"}
                sizes="(max-width: 1024px) 100vw, 60vw"
                className={`object-cover transition-opacity duration-700 ease-out motion-reduce:transition-none ${
                  index === active ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
          <div className="mt-8 grid lg:mt-10">
            {areas.map((area, index) => (
              <div
                key={area.id}
                inert={index !== active}
                className={`[grid-area:1/1] transition-opacity duration-500 motion-reduce:transition-none ${
                  index === active ? "opacity-100 delay-150" : "invisible opacity-0"
                }`}
              >
                {area.panel}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
