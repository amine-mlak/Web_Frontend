"use client";

import { useState } from "react";
import { EntryGrid, type CatalogCardItem } from "@/components/catalog/EntryCard";

/**
 * A long list of cards, a few rows at a time: the first rows are on the page, a button under
 * them brings the next ones. The count beside it says how far down the list the visitor is.
 */
export default function MoreGrid({
  items,
  step = 12,
  moreLabel,
  countLabel,
  eager = 0,
}: {
  items: CatalogCardItem[];
  step?: number;
  /** Cards in the first view, loaded at once. */
  eager?: number;
  moreLabel: string;
  /** Receives how many are shown and how many there are, e.g. "12 von 86". */
  countLabel: string;
}) {
  const [shown, setShown] = useState(step);
  const rest = items.length - shown;

  return (
    <>
      <EntryGrid items={items.slice(0, shown)} eager={eager} />
      {rest > 0 ? (
        <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-4">
          <button type="button" className="pill pill-secondary" onClick={() => setShown((current) => current + step)}>
            {moreLabel}
          </button>
          <p className="font-sans text-[15px] text-muted" aria-live="polite">
            {countLabel.replace("{shown}", String(shown)).replace("{total}", String(items.length))}
          </p>
        </div>
      ) : null}
    </>
  );
}
