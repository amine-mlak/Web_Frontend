"use client";

import { useSyncExternalStore } from "react";
import LocaleLink from "@/components/LocaleLink";
import { Frame } from "@/components/catalog/Frame";
import type { Locale } from "@/lib/i18n";
import type { ArchiveGroup, ArchiveHouse } from "@/lib/project-archive";
import { cn } from "@/lib/utils";

const COPY = {
  de: {
    title: "Weitere Häuser",
    filter: "Häuser eingrenzen",
    show: "Zeige",
    all: "Alle Häuser",
    one: "Haus",
    many: "Häuser",
    more: "Mehr Häuser zeigen",
    of: "von",
  },
  en: {
    title: "Further houses",
    filter: "Narrow down the houses",
    show: "Show",
    all: "All houses",
    one: "house",
    many: "houses",
    more: "Show more houses",
    of: "of",
  },
} as const;

/** Houses shown at first and added with each "show more". Two full turns of the rhythm below. */
const STEP = 20;

/**
 * The rhythm of the archive on wide screens, ten houses per turn: a wide photo beside a tall
 * one, three in a row, then tall beside wide, three in a row. The wide photo shows the room
 * as it was taken; the others stand upright.
 */
const WIDE = { cell: "lg:col-span-7", ratio: "lg:aspect-[7/5]", sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 58vw" };
const TALL = { cell: "lg:col-span-5", ratio: "", sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 42vw" };
const THIRD = { cell: "lg:col-span-4", ratio: "", sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" };
const RHYTHM = [WIDE, TALL, THIRD, THIRD, THIRD, TALL, WIDE, THIRD, THIRD, THIRD];

// The chosen filter and how far the list is open, kept for the tab: coming back from a house
// lands on the same list at the same place.
const KEY = "beer-projekte-archiv";
const listeners = new Set<() => void>();
let saved: string | null = null;

function read() {
  if (saved === null) {
    try {
      saved = window.sessionStorage.getItem(KEY) ?? "";
    } catch {
      saved = "";
    }
  }
  return saved;
}

function write(value: string) {
  saved = value;
  try {
    window.sessionStorage.setItem(KEY, value);
  } catch {
    // Storage is blocked: the choice still holds until the tab reloads.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export default function ProjectArchive({
  houses,
  groups,
  locale,
}: {
  houses: ArchiveHouse[];
  groups: ArchiveGroup[];
  locale: Locale;
}) {
  const copy = COPY[locale === "en" ? "en" : "de"];
  const state = useSyncExternalStore(subscribe, read, () => "");
  const [slug = "", open = ""] = state.split("|");
  const active = groups.flatMap((group) => group.filters).find((filter) => filter.slug === slug);
  const limit = Math.max(STEP, Number(open) || STEP);

  // Without a filter the houses shown large above are left out; a filter looks through all of them.
  const matches = houses.filter((house) => (active ? house.tags.includes(active.slug) : !house.lead));
  const place = new Map(matches.map((house, index) => [house.href, index]));
  const shown = Math.min(limit, matches.length);

  const choose = (next: string) => write(`${next}|${STEP}`);
  const chip = (pressed: boolean) =>
    cn(
      "py-1.5 font-sans text-[16px] underline decoration-1 underline-offset-8 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink",
      pressed ? "text-ink decoration-gold" : "text-muted decoration-transparent hover:text-ink hover:decoration-line",
    );

  return (
    <section
      className="border-b border-line bg-paper px-5 py-16 sm:px-8 lg:px-gutter lg:py-24"
      aria-labelledby="projekte-archiv"
    >
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <h2 id="projekte-archiv" className="t-section text-ink">
          {active ? active.label : copy.title}
        </h2>
        <p className="font-sans text-[14px] text-muted tabular-nums" aria-live="polite">
          {matches.length} {matches.length === 1 ? copy.one : copy.many}
        </p>
      </div>

      <div className="mt-10 border-b border-line" role="group" aria-label={copy.filter}>
        {[{ label: copy.show, filters: [] }, ...groups].map((group, row) => (
          <div key={group.label} className="grid gap-x-8 gap-y-1 border-t border-line py-3 lg:grid-cols-12 lg:py-4">
            <p className="type-eyebrow pt-2 text-muted lg:col-span-2">{group.label}</p>
            <ul className="flex flex-wrap gap-x-7 gap-y-1 lg:col-span-10">
              {row === 0 ? (
                <li>
                  <button type="button" aria-pressed={!active} onClick={() => choose("")} className={chip(!active)}>
                    {copy.all}
                  </button>
                </li>
              ) : null}
              {group.filters.map((filter) => (
                <li key={filter.slug}>
                  <button
                    type="button"
                    aria-pressed={active?.slug === filter.slug}
                    onClick={() => choose(active?.slug === filter.slug ? "" : filter.slug)}
                    className={chip(active?.slug === filter.slug)}
                  >
                    {filter.label}
                    <span className="ml-1.5 inline-block text-[12px] text-muted tabular-nums">{filter.count}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Every house stays in the page as a link; the ones not shown yet are only hidden. */}
      <ul className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-12 lg:gap-y-20">
        {houses.map((house) => {
          const at = place.get(house.href);
          const visible = at !== undefined && at < limit;
          const slot = RHYTHM[(at ?? 0) % RHYTHM.length];
          return (
            <li key={house.href} hidden={!visible} className={visible ? slot.cell : undefined}>
              <LocaleLink href={house.href} className="group block">
                <Frame
                  src={house.image}
                  srcSet={house.srcSet}
                  alt={house.title}
                  className={cn("aspect-[4/3] sm:aspect-[4/5]", slot.ratio)}
                  sizes={slot.sizes}
                />
                <h3 className="t-item mt-5 text-ink underline decoration-transparent decoration-1 underline-offset-[6px] transition-colors group-hover:decoration-ink/40">
                  {house.title}
                </h3>
                {house.meta ? <p className="mt-2 font-sans text-[14px] text-muted">{house.meta}</p> : null}
              </LocaleLink>
            </li>
          );
        })}
      </ul>

      {shown < matches.length ? (
        <div className="mt-16 flex flex-col items-center gap-4 lg:mt-20">
          <p className="font-sans text-[13px] text-muted tabular-nums">
            {shown} {copy.of} {matches.length}
          </p>
          <button type="button" onClick={() => write(`${active?.slug ?? ""}|${limit + STEP}`)} className="btn-quiet text-ink">
            {copy.more}
          </button>
        </div>
      ) : null}
    </section>
  );
}
