"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import LocaleLink from "@/components/LocaleLink";
import { cn } from "@/lib/utils";

/** The hero photo moves a little slower than the page (the design's parallax, factor 0.35). */
export function HeroDrift({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const move = () => {
      frame = 0;
      const y = window.scrollY;
      if (ref.current && y < window.innerHeight * 1.2) {
        ref.current.style.transform = `translate3d(0, ${y * 0.35}px, 0)`;
      }
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(move);
    };
    move();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className="beispiel-hero-photo absolute inset-x-0 -inset-y-[12%] will-change-transform">
      {children}
    </div>
  );
}

/**
 * The round "Beratung anfragen" button of the design: appears after the first scroll, turns
 * light over the dark footer and leaves at the legal line.
 */
export function FloatingCta({ href, label }: { href: string; label: string }) {
  const [visible, setVisible] = useState(false);
  const [atFooter, setAtFooter] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const footer = document.querySelector("[data-beispiel-footer]");
      const legal = document.querySelector("[data-beispiel-legal]");
      const overFooter = footer ? footer.getBoundingClientRect().top < window.innerHeight - 40 : false;
      const overLegal = legal ? legal.getBoundingClientRect().top < window.innerHeight - 20 : false;
      setAtFooter(overFooter);
      setVisible(window.scrollY > 400 && !overLegal);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <LocaleLink
      href={href}
      aria-label={label}
      tabIndex={visible ? undefined : -1}
      className={cn(
        "fixed right-[18px] bottom-[18px] z-40 inline-flex size-[50px] items-center justify-center gap-2.5 rounded-full border font-sans text-[14px] whitespace-nowrap shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-[opacity,transform,background-color,color] duration-300 md:right-6 md:bottom-6 md:size-auto md:py-[13px] md:pr-[22px] md:pl-[15px] lg:right-[30px] lg:bottom-[30px] lg:text-[15px]",
        atFooter
          ? "border-ink/25 bg-karte !text-ink hover:bg-white"
          : "border-paper/20 bg-ink !text-paper hover:bg-black",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="size-5" aria-hidden="true">
        <rect x="3.5" y="5.5" width="17" height="15" rx="3" />
        <path d="M3.5 9.75H20.5" />
        <path d="M8 3.5V6.5M16 3.5V6.5" strokeLinecap="round" />
        <path d="M8.25 13.25L10.6 15.6L15.5 11" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="sr-only md:not-sr-only">{label}</span>
    </LocaleLink>
  );
}
