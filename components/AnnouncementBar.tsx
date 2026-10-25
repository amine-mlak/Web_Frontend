"use client";

import { useState } from "react";
import LocaleLink from "@/components/LocaleLink";
import { useLocale } from "@/components/LocaleProvider";
import type { Announcement } from "@/lib/announcement";
import { cn } from "@/lib/utils";

const TONE = {
  dunkel: "bg-nacht text-paper",
  hell: "bg-karte text-ink",
  bronze: "bg-gold-soft text-ink",
} as const;

const COPY = {
  de: { label: "Ankündigung", pause: "Laufschrift anhalten", play: "Laufschrift fortsetzen" },
  en: { label: "Announcement", pause: "Pause the moving text", play: "Resume the moving text" },
} as const;

function Message({ item, inert }: { item: Announcement["items"][number]; inert?: boolean }) {
  const text = <span className="whitespace-nowrap">{item.text}</span>;
  if (!item.href) return text;
  return (
    <LocaleLink
      href={item.href}
      tabIndex={inert ? -1 : undefined}
      className="inline-flex min-h-6 items-center underline-offset-4 hover:underline"
    >
      {text}
    </LocaleLink>
  );
}

/**
 * Slim bar above the navigation. Rolling text loops seamlessly (two copies
 * of the track, the second hidden from screen readers), pauses on hover and
 * focus, has a pause button (WCAG 2.2.2) and stands still for visitors who
 * ask for reduced motion.
 */
export default function AnnouncementBar({ announcement }: { announcement: Announcement }) {
  const locale = useLocale();
  const copy = COPY[locale];
  const [paused, setPaused] = useState(false);
  const { items, scrolling, tone } = announcement;

  // Enough repeats that one copy of the track is wider than a wide screen.
  const characters = items.reduce((sum, item) => sum + item.text.length, 0);
  const repeat = Math.max(1, Math.ceil(160 / Math.max(characters, 1)));
  const track = Array.from({ length: repeat }, () => items).flat();
  // About 70 px per second, whatever the text length.
  const seconds = Math.max(14, Math.round((track.reduce((sum, item) => sum + item.text.length, 0) * 9 + track.length * 64) / 70));

  return (
    <section aria-label={copy.label} className={cn("relative h-9 overflow-hidden font-sans text-[13px] tracking-[0.02em]", TONE[tone])}>
      {scrolling ? (
        <>
          <div className="announce-marquee flex h-full">
            <div
              className={cn("announce-track flex h-full w-max items-center", paused && "announce-paused")}
              style={{ animationDuration: `${seconds}s` }}
            >
              <ul className="flex shrink-0 items-center gap-16 pr-16">
                {track.map((item, index) => (
                  // Repeats only fill the loop; they disappear when the text stands still.
                  <li key={`a-${index}`} className={index >= items.length ? "announce-repeat" : undefined} aria-hidden={index >= items.length || undefined}>
                    <Message item={item} inert={index >= items.length} />
                  </li>
                ))}
              </ul>
              <ul aria-hidden="true" className="announce-copy flex shrink-0 items-center gap-16 pr-16">
                {track.map((item, index) => (
                  <li key={`b-${index}`}>
                    <Message item={item} inert />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            aria-pressed={paused}
            aria-label={paused ? copy.play : copy.pause}
            className={cn(
              "announce-toggle absolute inset-y-0 right-0 flex w-9 items-center justify-center",
              tone === "dunkel" ? "bg-nacht/90 hover:bg-nacht" : tone === "hell" ? "bg-karte/90 hover:bg-karte" : "bg-gold-soft/90 hover:bg-gold-soft",
            )}
          >
            {paused ? (
              <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden="true" fill="currentColor"><path d="M4 2.5v11l9-5.5z" /></svg>
            ) : (
              <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden="true" fill="currentColor"><path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" /></svg>
            )}
          </button>
        </>
      ) : (
        <ul className="flex h-full items-center justify-center gap-x-6 overflow-hidden px-5 text-center">
          {items.map((item, index) => (
            <li key={index} className={cn(index > 0 && "hidden sm:block")}>
              <Message item={item} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
