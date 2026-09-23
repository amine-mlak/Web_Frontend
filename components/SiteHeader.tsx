"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function SiteHeader({ children }: { children: ReactNode }) {
  const barRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY;
      lastY = y;

      const bar = barRef.current;
      const locked = bar?.querySelector("[data-header-lock='true']");
      const hero = document.querySelector("[data-site-hero]");
      const pastHero = hero
        ? hero.getBoundingClientRect().bottom <= 0
        : y > (bar?.offsetHeight ?? 0);

      let next = false;
      if (locked || y <= 8 || !pastHero) {
        next = false;
      } else if (delta > 4) {
        next = true;
      } else if (delta < -4) {
        next = false;
      } else {
        return;
      }

      setHidden((current) => (current === next ? current : next));
    };

    const onScroll = () => {
      if (frame) {
        return;
      }
      frame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  return (
    <>
      <div
        ref={barRef}
        inert={hidden ? true : undefined}
        className={cn(
          "fixed inset-x-0 top-0 z-50 bg-transparent transition-transform duration-500 motion-reduce:transition-none",
          hidden
            ? "-translate-y-full ease-[cubic-bezier(0.64,0,0.78,0)]"
            : "translate-y-0 ease-[cubic-bezier(0.22,1,0.36,1)]",
        )}
      >
        {children}
      </div>
      <div className="h-14" aria-hidden="true" />
    </>
  );
}
