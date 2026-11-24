"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import LocaleLink from "@/components/LocaleLink";
import NextSteps from "@/components/catalog/NextSteps";
import { Frame } from "@/components/catalog/Frame";
import type { ColourEntry } from "@/lib/colour-page";
import type { Locale } from "@/lib/i18n";

const COPY = {
  de: {
    pick: "Farbe wählen",
    view: (name: string) => `${name} ansehen`,
    built: (name: string) => `${name} aus unseren Projekten`,
    projects: (count: number) => `${count} ${count === 1 ? "Projekt" : "Projekte"}`,
  },
  en: {
    pick: "Choose a colour",
    view: (name: string) => `See ${name.charAt(0).toLowerCase()}${name.slice(1)}`,
    built: (name: string) => `${name} from our projects`,
    projects: (count: number) => `${count} ${count === 1 ? "project" : "projects"}`,
  },
} as const;

const LINK = "inline-block font-sans text-[16px] underline decoration-current/40 underline-offset-[5px] hover:decoration-current";
const RULE = "border-current/20";

/**
 * The Küchenfarben overview as one page that takes the chosen colour: its ground, the kitchen
 * photo, the texts, three kitchens built in it and the closing all change together. The colour
 * spreads from the clicked dot. Once the dots at the top are out of sight, a small palette stays
 * at the lower edge. Every colour's texts are in the page; only the chosen ones are visible, and
 * the reading list near the end shows all colours at once.
 */
export default function ColourPage({
  title,
  lede,
  statement,
  note,
  crumbs,
  colours,
  locale,
}: {
  title: string;
  lede?: string;
  /** What the page says about choosing a colour, above the reading list. */
  statement?: string;
  note?: string;
  crumbs?: ReactNode;
  colours: ColourEntry[];
  locale: Locale;
}) {
  const copy = COPY[locale === "en" ? "en" : "de"];
  const [active, setActive] = useState(0);
  const [docked, setDocked] = useState(false);
  const dots = useRef<HTMLDivElement>(null);
  const current = colours[active] ?? colours[0];

  useEffect(() => {
    const element = dots.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => setDocked(!entry.isIntersecting && entry.boundingClientRect.top < 0));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  /** The new colour grows as a circle from the clicked dot; without view transitions it fades. */
  const pick = (index: number, from: HTMLElement) => {
    if (index === active) return;
    if (!("startViewTransition" in document) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActive(index);
      return;
    }
    const box = from.getBoundingClientRect();
    const x = box.left + box.width / 2;
    const y = box.top + box.height / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const html = document.documentElement;
    html.classList.add("colour-spread");
    const move = document.startViewTransition(() => flushSync(() => setActive(index)));
    move.ready
      .then(() =>
        html.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 850, easing: "cubic-bezier(0.6, 0, 0.3, 1)", pseudoElement: "::view-transition-new(root)" },
        ),
      )
      .catch(() => {});
    move.finished.finally(() => html.classList.remove("colour-spread"));
  };

  /** A panel per colour in the same place; only the chosen one is visible and reachable. */
  const panel = (index: number) =>
    `[grid-area:1/1] transition-opacity duration-500 motion-reduce:transition-none ${
      index === active ? "opacity-100" : "pointer-events-none opacity-0"
    }`;

  return (
    <div
      data-colour-page=""
      className={`relative transition-colors duration-700 motion-reduce:transition-none ${current.light ? "text-ink" : "text-paper"}`}
      style={{ backgroundColor: current.hex }}
    >
      <section className="px-5 pt-10 pb-14 sm:px-8 lg:px-gutter lg:pt-14 lg:pb-20" aria-labelledby="farben-hero">
        {crumbs ? <div className="opacity-80 [&_a:hover]:!text-current [&_nav]:!text-current">{crumbs}</div> : null}
        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-16">
          <h1 id="farben-hero" className="t-display hyphens-none lg:col-span-6">
            {title}
          </h1>
          <div className="lg:col-span-6">
            {lede ? <p className="t-lede max-w-lg opacity-90">{lede}</p> : null}
            <div ref={dots} role="group" aria-label={copy.pick} className="mt-7 flex flex-wrap gap-x-5 gap-y-4">
              {colours.map((colour, index) => (
                <button
                  key={colour.slug}
                  type="button"
                  aria-pressed={index === active}
                  onClick={(event) => pick(index, event.currentTarget.firstElementChild as HTMLElement)}
                  className="group grid w-[5.25rem] cursor-pointer justify-items-center gap-2.5 text-center font-sans text-[13.5px] leading-tight hyphens-none"
                >
                  <span
                    aria-hidden
                    className={`block size-14 rounded-full border border-current/30 outline-2 outline-offset-[5px] transition-[outline-color] duration-300 group-focus-visible:outline-current ${
                      index === active ? "outline-current" : "outline-transparent group-hover:outline-current/40"
                    }`}
                    style={{ backgroundColor: colour.hex }}
                  />
                  {colour.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative mt-10 aspect-[4/3] shadow-[0_30px_80px_rgba(0,0,0,0.2)] sm:aspect-[16/9] lg:mt-14 lg:aspect-[21/9]">
          {colours.map((colour, index) => (
            <Frame
              key={colour.slug}
              src={colour.image}
              alt={index === active ? colour.name : ""}
              className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${
                index === active ? "opacity-100" : "opacity-0"
              }`}
              priority={index === 0}
              drift
              sizes="(max-width: 1024px) 100vw, 92vw"
            />
          ))}
        </div>

        <div className="mt-8 grid lg:mt-12">
          {colours.map((colour, index) => (
            <div key={colour.slug} inert={index !== active} className={`${panel(index)} grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-16`}>
              <h2 className="t-display hyphens-none lg:col-span-7">
                <LocaleLink href={colour.href}>{colour.name}</LocaleLink>
              </h2>
              <div className="lg:col-span-5">
                {colour.intro ? <p className="t-lede max-w-md opacity-90">{colour.intro}</p> : null}
                <LocaleLink href={colour.href} aria-label={copy.view(colour.name)} className={`${LINK} mt-5`}>
                  {copy.view(colour.name)}
                </LocaleLink>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What BEER says about this colour. */}
      <section className={`grid border-t px-5 py-14 sm:px-8 lg:px-gutter lg:py-24 ${RULE}`}>
        {colours.map((colour, index) =>
          colour.statement ? (
            <div key={colour.slug} inert={index !== active} className={`${panel(index)} grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-16`}>
              <p className="t-section max-w-3xl lg:col-span-8">{colour.statement}</p>
              {colour.note ? (
                <p className={`max-w-sm border-t pt-4 font-sans text-[16px] leading-relaxed opacity-85 lg:col-span-4 ${RULE}`}>{colour.note}</p>
              ) : null}
            </div>
          ) : null,
        )}
      </section>

      {/* Three kitchens built in this colour. */}
      <section className="grid px-5 pb-14 sm:px-8 lg:px-gutter lg:pb-24">
        {colours.map((colour, index) => (
          <div key={colour.slug} inert={index !== active} className={panel(index)}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
              <h2 className="t-section hyphens-none">{copy.built(colour.name)}</h2>
              <p className="font-sans text-[15px] opacity-75">{copy.projects(colour.count)}</p>
            </div>
            <ul className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {colour.houses.map((house) => (
                <li key={house.href}>
                  <LocaleLink href={house.href} className="block">
                    <Frame
                      src={house.image}
                      srcSet={house.srcSet}
                      alt={house.title}
                      className="aspect-[4/3]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <h3 className="t-item mt-4">{house.title}</h3>
                    {house.meta ? <p className="mt-1 font-sans text-[14px] opacity-70">{house.meta}</p> : null}
                  </LocaleLink>
                </li>
              ))}
            </ul>
            <LocaleLink href={colour.href} className={`mt-10 ${colour.light ? "pill pill-primary" : "pill pill-light"}`}>
              {copy.view(colour.name)}
            </LocaleLink>
          </div>
        ))}
      </section>

      {/* All colours with their reading text, visible at once. */}
      <section className={`border-t px-5 py-14 sm:px-8 lg:px-gutter lg:py-24 ${RULE}`} aria-labelledby={statement ? "farben-lesen" : undefined}>
        {statement ? (
          <div className="mb-12 grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-16">
            <h2 id="farben-lesen" className="t-section max-w-3xl lg:col-span-8">
              {statement}
            </h2>
            {note ? <p className="max-w-sm font-sans text-[16px] leading-relaxed opacity-85 lg:col-span-4">{note}</p> : null}
          </div>
        ) : null}
        <ul className={`border-t ${RULE}`}>
          {colours.map((colour) => (
            <li key={colour.slug} className={`grid gap-4 border-b py-8 lg:grid-cols-12 lg:gap-16 ${RULE}`}>
              <h3 className="t-feature flex items-center gap-4 self-start hyphens-none lg:col-span-4">
                <span aria-hidden className="size-6 shrink-0 rounded-full border border-current/30" style={{ backgroundColor: colour.hex }} />
                {colour.name}
              </h3>
              <div className="lg:col-span-8">
                <p className="max-w-2xl font-sans text-[17px] leading-[1.7] opacity-90">{colour.reading || colour.intro}</p>
                <LocaleLink href={colour.href} className={`${LINK} mt-4 text-[15px]`}>
                  {copy.view(colour.name)}
                </LocaleLink>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* The colour's own closing with the next steps. */}
      <section className="grid px-5 pb-20 sm:px-8 lg:px-gutter lg:pb-28">
        {colours.map((colour, index) => (
          <div key={colour.slug} inert={index !== active} className={`${panel(index)} grid gap-8 lg:grid-cols-12 lg:items-end`}>
            <div className="lg:col-span-7">
              <h2 className="t-section">{colour.closeTitle}</h2>
              {colour.closeText ? <p className="t-lede mt-5 max-w-lg opacity-90">{colour.closeText}</p> : null}
            </div>
            <NextSteps locale={locale} tone={colour.light ? "light" : "dark"} className="lg:col-span-5 lg:justify-end" />
          </div>
        ))}
      </section>

      {/* The palette that stays with the visitor below the dots at the top. */}
      <div className="pointer-events-none sticky bottom-5 z-20 flex h-0 justify-center">
        <div
          role="group"
          aria-label={copy.pick}
          inert={!docked}
          className={`absolute bottom-0 flex max-w-[calc(100vw-2rem)] items-center gap-4 rounded-full bg-paper py-2 pr-3 pl-5 text-ink shadow-[0_14px_40px_rgba(0,0,0,0.28)] ring-1 ring-ink/10 transition-[opacity,translate] duration-500 motion-reduce:transition-none ${
            docked ? "pointer-events-auto opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <span className="font-sans text-[15px] whitespace-nowrap">{current.name}</span>
          <span className="flex gap-2">
            {colours.map((colour, index) => (
              <button
                key={colour.slug}
                type="button"
                aria-pressed={index === active}
                aria-label={colour.name}
                onClick={(event) => pick(index, event.currentTarget)}
                className={`size-9 cursor-pointer rounded-full border border-ink/25 outline-2 outline-offset-[3px] transition-[outline-color] duration-300 focus-visible:outline-ink ${
                  index === active ? "outline-ink" : "outline-transparent hover:outline-ink/40"
                }`}
                style={{ backgroundColor: colour.hex }}
              />
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}
