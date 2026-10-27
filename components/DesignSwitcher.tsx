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

const isDesign = (value: string | null | undefined): value is Design =>
  value === "aktuell" || value === "a" || value === "b";

// The choice lives here and in storage, not only on <html>: when React mounts the page
// fresh it clears every attribute on <html>, which wiped the one set by the head script.
let chosen: Design | null = null;

function current(): Design {
  if (chosen === null) {
    const fromLink = new URLSearchParams(location.search).get("design");
    let fromStorage: string | null = null;
    try {
      fromStorage = localStorage.getItem(KEY);
    } catch {
      // Private windows may refuse storage.
    }
    chosen = isDesign(fromLink) ? fromLink : isDesign(fromStorage) ? fromStorage : "aktuell";
  }
  return chosen;
}

/** Puts the choice on <html>, and back again whenever something removes it. */
function apply() {
  const root = document.documentElement;
  const design = current();
  if (design === "aktuell") {
    if (root.dataset.design) delete root.dataset.design;
  } else if (root.dataset.design !== design) {
    root.dataset.design = design;
  }
}

function subscribe(onChange: () => void) {
  apply();
  const observer = new MutationObserver(apply);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-design"] });
  window.addEventListener(EVENT, onChange);
  return () => {
    observer.disconnect();
    window.removeEventListener(EVENT, onChange);
  };
}

function choose(design: Design) {
  chosen = design;
  apply();
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

