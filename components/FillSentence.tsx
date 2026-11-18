"use client";

import { useEffect, useRef, useState } from "react";

/**
 * One sentence whose words go from pale to full while it scrolls up the screen. Meant for the
 * one main statement of a page. Without scripts, or where motion is turned off, it is plain text.
 */
export default function FillSentence({ text, className }: { text: string; className?: string }) {
  const words = text.split(/\s+/).filter(Boolean);
  const line = useRef<HTMLParagraphElement>(null);
  // null: not following the scroll (before the page is live, or motion turned off).
  const [filled, setFilled] = useState<number | null>(null);

  useEffect(() => {
    const element = line.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let queued = false;
    const measure = () => {
      queued = false;
      const box = element.getBoundingClientRect();
      const height = window.innerHeight;
      // Starts as the sentence enters the lower part of the screen, done before it reaches the top third.
      const part = (height * 0.88 - box.top) / (box.height + height * 0.38);
      setFilled(Math.round(Math.min(1, Math.max(0, part)) * words.length));
    };
    const onScroll = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(measure);
      }
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [words.length]);

  return (
    <p ref={line} className={className}>
      {words.map((word, index) => (
        <span
          key={index}
          className="transition-opacity duration-300 ease-out"
          style={filled !== null && index >= filled ? { opacity: 0.22 } : undefined}
        >
          {word}{" "}
        </span>
      ))}
    </p>
  );
}
