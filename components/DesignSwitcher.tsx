"use client";

import { useSyncExternalStore } from "react";
import { DESIGN_EVENT as EVENT, DESIGN_KEY as KEY } from "@/lib/design-preview";

/**
 * Preview only: switches between the current design and the two directions to choose
 * from (A Werkstatt, B Editorial). The choice is kept per browser; `?design=a|b|aktuell`
 * sets it from a link. Goes away once a direction is chosen.
 */
type Design = "aktuell" | "a" | "b";

const OPTIONS: { id: Design; label: string; name?: string }[] = [
  { id: "aktuell", label: "Aktuell" },
  { id: "a", label: "A", name: "Werkstatt" },
  { id: "b", label: "B", name: "Editorial" },
];

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

function current(): Design {
  const design = document.documentElement.dataset.design;
  return design === "a" || design === "b" ? design : "aktuell";
}

function choose(design: Design) {
  const root = document.documentElement;
  if (design === "aktuell") {
    delete root.dataset.design;
  } else {
    root.dataset.design = design;
  }
  try {
    if (design === "aktuell") {
      localStorage.removeItem(KEY);
    } else {
      localStorage.setItem(KEY, design);
    }
  } catch {
    // Private windows may refuse storage; the switch still works for this page.
  }
  window.dispatchEvent(new Event(EVENT));
}

export default function DesignSwitcher() {
  const design = useSyncExternalStore(subscribe, current, () => "aktuell" as Design);
  return (
    <div
      role="group"
      aria-label="Designrichtung (Vorschau)"
      className="fixed right-3 bottom-3 z-[60] flex border border-white/15 bg-[#111] p-1 font-sans text-[12px] text-white shadow-lg print:hidden"
    >
      {OPTIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={design === option.id}
          onClick={() => choose(option.id)}
          className={
            design === option.id
              ? "bg-white px-3 py-1.5 text-[#111]"
              : "px-3 py-1.5 text-white/75 hover:text-white"
          }
        >
          {option.label}
          {/* On a phone only the letter, so the switch covers less of the page. */}
          {option.name ? <span className="hidden sm:inline"> {option.name}</span> : null}
        </button>
      ))}
    </div>
  );
}

