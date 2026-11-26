"use client";

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A row of cards that slides sideways: arrows left and right, swipe on a phone, and on request
 * a slow automatic advance that rests while the visitor points at the row.
 */
export default function SlideRow({
  children,
  label,
  auto,
  arrowClass = "top-1/2",
}: {
  children: ReactNode;
  /** Name of the row for screen readers. */
  label: string;
  /** Milliseconds between automatic steps; left out, the row only moves on a click or swipe. */
  auto?: number;
  /** Vertical place of the arrows, e.g. the middle of the photos rather than of the whole card. */
  arrowClass?: string;
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  const paused = useRef(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const step = useCallback((direction: 1 | -1, wrap = false) => {
    const track = trackRef.current;
    const first = track?.firstElementChild as HTMLElement | null;
    if (!track || !first) return;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    const end = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    if (wrap && direction === 1 && end) {
      track.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    track.scrollBy({ left: direction * (first.offsetWidth + gap), behavior: "smooth" });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      setAtStart(track.scrollLeft <= 4);
      setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 4);
    };
    update();
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    if (!auto || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      if (!paused.current && !document.hidden) step(1, true);
    }, auto);
    return () => window.clearInterval(timer);
  }, [auto, step]);

  const arrow =
    "absolute z-10 hidden size-[42px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-ink text-[#FBF9F5] shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-opacity hover:bg-black disabled:pointer-events-none disabled:opacity-0 md:flex";

  return (
    <div
      className="relative"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onFocus={() => (paused.current = true)}
      onBlur={() => (paused.current = false)}
    >
      <ul
        ref={trackRef}
        aria-label={label}
        className="flex snap-x snap-mandatory gap-7 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {Children.map(children, (child) => (
          <li className="w-[82%] shrink-0 snap-start min-[861px]:w-[calc((100%-56px)/3)]">{child}</li>
        ))}
      </ul>
      <button type="button" aria-label="Zurück" disabled={atStart} onClick={() => step(-1)} className={cn(arrow, arrowClass, "-left-[21px]")}>
        <Chevron left />
      </button>
      <button type="button" aria-label="Weiter" disabled={atEnd} onClick={() => step(1)} className={cn(arrow, arrowClass, "-right-[21px]")}>
        <Chevron />
      </button>
    </div>
  );
}

function Chevron({ left }: { left?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={left ? "M14.5 5.5L8 12l6.5 6.5" : "M9.5 5.5L16 12l-6.5 6.5"} />
    </svg>
  );
}
