"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import HouseCard from "@/components/catalog/HouseCard";
import type { Locale } from "@/lib/i18n";
import type { ArchiveGroup, ArchiveHouse } from "@/lib/project-archive";
import { cn } from "@/lib/utils";

const COPY = {
  de: {
    title: "Weitere Häuser",
    openAll: "Alle Projekte ansehen",
    projects: "Projekte",
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
    openAll: "See all projects",
    projects: "projects",
    filter: "Narrow down the houses",
    show: "Show",
    all: "All houses",
    one: "house",
    many: "houses",
    more: "Show more houses",
    of: "of",
  },
} as const;

/** Houses shown at first and added with each "show more": full rows of three and of two. */
const STEP = 18;

/** One even grid: every house has the same upright photo, three in a row on wide screens. */
const SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

// Whether the archive is open, the chosen filter and how far the list is open, kept for the tab:
// coming back from a house lands on the same list at the same place.
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
  const [slug = "", open = "", archive = ""] = state.split("|");
  // The page shows a few houses; the filters and every other house appear on request.
  const opened = archive === "1";
  const active = groups.flatMap((group) => group.filters).find((filter) => filter.slug === slug);
  const limit = Math.max(STEP, Number(open) || STEP);

  // Without a filter the houses shown large above are left out; a filter looks through all of them.
  const matches = houses.filter((house) => (active ? house.tags.includes(active.slug) : !house.lead));
  const place = new Map(matches.map((house, index) => [house.href, index]));
  const shown = Math.min(limit, matches.length);

  const choose = (next: string) => write(`${next}|${STEP}|1`);
  // "Show more" can disappear once everything is open, so keyboard focus moves on to the first
  // house it added instead of falling back to the top of the page.
  const list = useRef<HTMLUListElement>(null);
  const focusAt = useRef<number | null>(null);
  const showMore = () => {
    focusAt.current = limit;
    write(`${active?.slug ?? ""}|${limit + STEP}|1`);
  };
  // Opening the archive removes its button, so focus moves to the heading of what appeared.
  const heading = useRef<HTMLHeadingElement>(null);
  const justOpened = useRef(false);
  const openArchive = () => {
    justOpened.current = true;
    write(`|${STEP}|1`);
  };
  useEffect(() => {
    if (!opened || !justOpened.current) return;
    justOpened.current = false;
    heading.current?.focus({ preventScroll: true });
  }, [opened]);
  useEffect(() => {
    if (focusAt.current === null) return;
    const links = list.current?.querySelectorAll<HTMLAnchorElement>("li:not([hidden]) > a");
    links?.[focusAt.current]?.focus({ preventScroll: true });
    focusAt.current = null;
  }, [limit]);
  const chip = (pressed: boolean) =>
    cn(
      "py-1.5 font-sans text-[16px] underline decoration-1 underline-offset-8 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink",
      pressed ? "text-ink decoration-gold" : "text-muted decoration-transparent hover:text-ink hover:decoration-line",
    );

  return (
    <section
      className={cn("bg-paper px-5 sm:px-8 lg:px-gutter", opened ? "border-b border-line py-16 lg:py-24" : "py-12 lg:py-16")}
      aria-labelledby={opened ? "projekte-archiv" : undefined}
    >
      {opened ? null : (
        <div className="flex flex-col items-center gap-4">
          <button type="button" onClick={openArchive} className="pill pill-primary">
            {copy.openAll}
          </button>
          <p className="font-sans text-[13px] text-muted tabular-nums">
            {houses.length} {copy.projects}
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4" hidden={!opened}>
        <h2 id="projekte-archiv" ref={heading} tabIndex={-1} className="t-section text-ink focus:outline-none">
          {active ? active.label : copy.title}
        </h2>
        <p className="font-sans text-[14px] text-muted tabular-nums" aria-live="polite">
          {matches.length} {matches.length === 1 ? copy.one : copy.many}
        </p>
      </div>

      <div className="mt-10 border-b border-line" role="group" aria-label={copy.filter} hidden={!opened}>
        {[{ label: copy.show, filters: [] }, ...groups].map((group, row) => (
          <div key={group.label} className="grid gap-x-8 gap-y-1 border-t border-line py-3 lg:grid-cols-12 lg:py-4">
            <p className="pt-1.5 font-serif text-[18px] leading-[1.4] text-ink lg:col-span-2">{group.label}</p>
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
      <ul ref={list} className={cn("grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-16", opened && "mt-12 lg:mt-16")}>
        {houses.map((house) => {
          const at = place.get(house.href);
          const visible = opened && at !== undefined && at < limit;
          return (
            <li key={house.href} hidden={!visible}>
              <HouseCard
                house={house}
                frameClassName="aspect-[4/3] sm:aspect-[4/5]"
                sizes={SIZES}
                heading
                titleClassName="mt-5 underline decoration-transparent decoration-1 underline-offset-[6px] transition-colors group-hover:decoration-ink/40"
              />
            </li>
          );
        })}
      </ul>

      {opened && shown < matches.length ? (
        <div className="mt-16 flex flex-col items-center gap-4 lg:mt-20">
          <p className="font-sans text-[13px] text-muted tabular-nums">
            {shown} {copy.of} {matches.length}
          </p>
          <button type="button" onClick={showMore} className="btn-quiet">
            {copy.more}
          </button>
        </div>
      ) : null}
    </section>
  );
}
