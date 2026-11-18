"use client";

import { useState } from "react";
import CmsImage from "@/components/CmsImage";
import LocaleLink from "@/components/LocaleLink";

export type SwitcherColour = {
  name: string;
  text?: string;
  href: string;
  image: string;
  srcSet?: string;
  alt: string;
  color: string;
};

/** Whether text on this colour should be dark. */
function isLight(hex: string) {
  const raw = hex.replace("#", "");
  const full = raw.length === 3 ? raw.replace(/./g, "$&$&") : raw;
  const [red, green, blue] = [0, 2, 4].map((at) => parseInt(full.slice(at, at + 2), 16) / 255);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55;
}

/**
 * The kitchen colours as one switcher: a dot per colour, and with the chosen dot the kitchen
 * photo, the colour of the panel and its words change together. Every colour's name and link are
 * in the page; only the chosen one is visible. On phones the photo sits above the panel.
 */
export default function ColourSwitcher({
  colours,
  view,
  groupLabel,
}: {
  colours: SwitcherColour[];
  view: string;
  groupLabel: string;
}) {
  const [active, setActive] = useState(0);
  const current = colours[active] ?? colours[0];
  const light = isLight(current.color);

  return (
    <div className="grid lg:min-h-[40rem] lg:grid-cols-12">
      <div className="relative aspect-[4/3] overflow-hidden bg-nacht sm:aspect-[16/10] lg:col-span-8 lg:aspect-auto">
        {colours.map((colour, index) => (
          <CmsImage
            key={colour.href}
            src={colour.image}
            srcSet={colour.srcSet}
            alt={index === active ? colour.alt : ""}
            aria-hidden={index === active ? undefined : true}
            fill
            sizes="(max-width: 1024px) 100vw, 66vw"
            className={`object-cover transition-opacity duration-700 ease-out motion-reduce:transition-none ${
              index === active ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      <div
        className={`flex flex-col justify-center gap-7 px-5 py-9 transition-colors duration-700 motion-reduce:transition-none sm:px-8 sm:py-12 lg:col-span-4 lg:px-12 ${
          light ? "text-ink ring-1 ring-ink/10 ring-inset" : "text-paper"
        }`}
        style={{ backgroundColor: current.color }}
      >
        <div className="grid">
          {colours.map((colour, index) => (
            <div
              key={colour.href}
              inert={index !== active}
              className={`[grid-area:1/1] transition-opacity duration-500 motion-reduce:transition-none ${
                index === active ? "opacity-100 delay-150" : "opacity-0"
              }`}
            >
              <h4 className="t-feature hyphens-auto">
                <LocaleLink href={colour.href} className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current">
                  {colour.name}
                </LocaleLink>
              </h4>
              {colour.text ? <p className="mt-4 max-w-[34ch] font-sans text-[16px] leading-relaxed opacity-85">{colour.text}</p> : null}
              <LocaleLink
                href={colour.href}
                aria-label={`${colour.name}: ${view}`}
                className="mt-5 inline-block font-sans text-[15px] underline decoration-current/40 underline-offset-[5px] hover:decoration-current"
              >
                {view}
              </LocaleLink>
            </div>
          ))}
        </div>

        <div role="group" aria-label={groupLabel} className="flex flex-wrap gap-4">
          {colours.map((colour, index) => (
            <button
              key={colour.href}
              type="button"
              aria-pressed={index === active}
              aria-label={colour.name}
              onClick={() => setActive(index)}
              className={`size-12 cursor-pointer rounded-full border border-current/30 outline-2 outline-offset-4 transition-[outline-color] duration-300 focus-visible:outline-current ${
                index === active ? "outline-current" : "outline-transparent hover:outline-current/40"
              }`}
              style={{ backgroundColor: colour.color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
