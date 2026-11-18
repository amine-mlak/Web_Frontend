"use client";

import { useEffect, useRef, useState } from "react";
import CmsImage from "@/components/CmsImage";
import LocaleLink from "@/components/LocaleLink";

export type ReelItem = {
  href: string;
  title: string;
  meta?: string;
  intro?: string;
  image: string;
  srcSet?: string;
};

/**
 * Kitchens as a row of large photos that moves sideways: swiped on a phone, dragged with the
 * mouse or moved with the two buttons. A line and a count show how far along the row is.
 */
export default function ProjectReel({
  items,
  labels,
}: {
  items: ReelItem[];
  labels: { row: string; previous: string; next: string };
}) {
  const row = useRef<HTMLUListElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [at, setAt] = useState(0);
  // Mouse drag: where it began, and whether it moved far enough to count as a drag (not a click).
  const drag = useRef({ down: false, moved: false, x: 0, left: 0 });

  const step = () => {
    const list = row.current;
    if (!list || list.children.length < 2) return list?.clientWidth ?? 1;
    return (list.children[1] as HTMLElement).offsetLeft - (list.children[0] as HTMLElement).offsetLeft;
  };

  useEffect(() => {
    const list = row.current;
    if (!list) return;
    const sync = () => {
      const max = list.scrollWidth - list.clientWidth;
      const part = max > 0 ? Math.min(1, Math.max(0, list.scrollLeft / max)) : 0;
      bar.current?.style.setProperty("--part", part.toFixed(4));
      setAt(max > 0 && list.scrollLeft >= max - 4 ? items.length - 1 : Math.min(items.length - 1, Math.round(list.scrollLeft / step())));
    };
    sync();
    list.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      list.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [items.length]);

  const move = (by: number) => row.current?.scrollBy({ left: by * step(), behavior: "smooth" });

  return (
    <div>
      <ul
        ref={row}
        aria-label={labels.row}
        className="reel flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 sm:gap-5 sm:px-8 lg:px-gutter"
        onPointerDown={(event) => {
          if (event.pointerType !== "mouse" || event.button !== 0 || !row.current) return;
          drag.current = { down: true, moved: false, x: event.clientX, left: row.current.scrollLeft };
        }}
        onPointerMove={(event) => {
          const state = drag.current;
          const list = row.current;
          if (!state.down || !list) return;
          const by = event.clientX - state.x;
          if (!state.moved && Math.abs(by) > 6) {
            state.moved = true;
            list.dataset.drag = "";
            list.setPointerCapture(event.pointerId);
          }
          if (state.moved) list.scrollLeft = state.left - by;
        }}
        onPointerUp={() => {
          const state = drag.current;
          const list = row.current;
          state.down = false;
          if (!state.moved || !list) return;
          delete list.dataset.drag;
          list.scrollTo({ left: Math.round(list.scrollLeft / step()) * step(), behavior: "smooth" });
        }}
        onPointerCancel={() => {
          drag.current.down = false;
          if (row.current) delete row.current.dataset.drag;
        }}
        // A drag that ends on a photo must not open the project.
        onClickCapture={(event) => {
          if (drag.current.moved) {
            event.preventDefault();
            event.stopPropagation();
            drag.current.moved = false;
          }
        }}
      >
        {items.map((item, index) => (
          <li key={item.href} className="w-[84%] shrink-0 snap-start sm:w-[72%] lg:w-[min(62%,58rem)]">
            <LocaleLink
              href={item.href}
              draggable={false}
              className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
            >
              <span className="relative block aspect-[4/3] overflow-hidden bg-nacht sm:aspect-[16/10]">
                <CmsImage
                  src={item.image}
                  srcSet={item.srcSet}
                  alt=""
                  fill
                  draggable={false}
                  priority={false}
                  loading={index === 0 ? undefined : "lazy"}
                  sizes="(max-width: 640px) 84vw, (max-width: 1024px) 72vw, 62vw"
                  className="object-cover select-none"
                />
              </span>
              <span className="mt-5 grid gap-x-10 gap-y-2 lg:grid-cols-12">
                <span className="lg:col-span-5">
                  {item.meta ? <span className="block font-sans text-[14px] text-muted">{item.meta}</span> : null}
                  <span className="t-feature mt-1 block text-ink underline decoration-transparent underline-offset-[6px] transition-[text-decoration-color] duration-300 group-hover:decoration-line">
                    {item.title}
                  </span>
                </span>
                {item.intro ? (
                  <span className="line-clamp-3 max-w-[52ch] font-sans text-[16px] leading-relaxed text-muted lg:col-span-7 lg:line-clamp-4 lg:pt-6">
                    {item.intro}
                  </span>
                ) : null}
              </span>
            </LocaleLink>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center gap-5 px-5 sm:px-8 lg:mt-10 lg:px-gutter">
        <p className="min-w-[3.2em] font-sans text-[15px] text-ink tabular-nums" aria-live="polite">
          {at + 1} / {items.length}
        </p>
        <span ref={bar} className="reel-bar relative h-px flex-1 bg-line" aria-hidden />
        <button type="button" onClick={() => move(-1)} disabled={at === 0} aria-label={labels.previous} className="reel-button">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M14.5 5.5 8 12l6.5 6.5" />
          </svg>
        </button>
        <button type="button" onClick={() => move(1)} disabled={at === items.length - 1} aria-label={labels.next} className="reel-button">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M9.5 5.5 16 12l-6.5 6.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
