import type { ReactNode } from "react";
import { Crumbs } from "@/components/catalog/clusters/parts";
import type { PresentedHub } from "@/lib/collection-present";

/**
 * The top of every single page (a material, an appliance, a brand, a place, a kitchen topic):
 * where the page sits, its name, and one sentence beside it. One header for all of them, so a
 * visitor who has seen one single page knows how to read the next.
 */
export default function EntryHeader({
  hub,
  emphasis,
  children,
}: {
  hub: PresentedHub;
  /** The second part of the name ("für Arbeitsplatte und Spüle"). */
  emphasis?: string;
  /** Small things under the sentence: a place line, filter pills. */
  children?: ReactNode;
}) {
  return (
    <header className="px-5 pt-8 sm:px-8 lg:px-gutter lg:pt-12">
      <Crumbs hub={hub} tone="ink" />
      <div className="mt-6 grid items-end gap-x-12 gap-y-6 lg:mt-8 lg:grid-cols-12">
        <h1 className="t-title text-ink lg:col-span-7">
          {hub.title}
          {emphasis ? <> {emphasis}</> : null}
        </h1>
        <div className="lg:col-span-5 lg:pb-1.5">
          <p className="t-lede max-w-md text-muted">{hub.lede}</p>
          {children}
        </div>
      </div>
    </header>
  );
}
