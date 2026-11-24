"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Chapters that stack. Each child marked `data-stack-panel` (class `stack-panel`, globals.css)
 * stays in place while the next one slides over it. This component only measures: how tall a
 * chapter is (`--panel-h`, so one taller than the screen stops at its end, not its start) and how
 * far the next chapter covers it (`--cover`, 0 to 1: it steps back a little and darkens).
 */
export default function ChapterStack({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) {
      return;
    }
    const panels = [...root.querySelectorAll<HTMLElement>("[data-stack-panel]")];
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const sizes = new ResizeObserver(() => {
      for (const panel of panels) {
        panel.style.setProperty("--panel-h", `${panel.offsetHeight}px`);
      }
    });
    panels.forEach((panel) => sizes.observe(panel));

    let queued = false;
    const frame = () => {
      queued = false;
      const tops = panels.map((panel) => panel.getBoundingClientRect().top);
      panels.forEach((panel, index) => {
        const next = tops[index + 1];
        const height = panel.offsetHeight;
        const cover = next === undefined || !height ? 0 : Math.max(0, Math.min(1, (tops[index] + height - next) / height));
        panel.style.setProperty("--cover", cover.toFixed(3));
      });
    };
    const onScroll = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(frame);
      }
    };
    if (!still) {
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      frame();
    }
    return () => {
      sizes.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
