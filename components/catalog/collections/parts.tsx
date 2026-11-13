import type { ReactNode } from "react";
import { Frame } from "@/components/catalog/Frame";
import AtelierVisit from "@/components/catalog/hub/AtelierVisit";
import type { PresentedHub } from "@/lib/collection-present";
import { cn } from "@/lib/utils";

export type CollectionExtra = {
  href: string;
  title: string;
  meta?: string;
  image?: string;
};

export { Frame };

/**
 * The one sentence a page stands for, with a short note beside it. Every hub, kitchen world
 * and category page carries it in this form. It is a paragraph, never a heading.
 */
export function StatementBand({
  statement,
  note,
  tone = "paper",
  rule = true,
}: {
  statement?: string;
  note?: string;
  tone?: "paper" | "karte" | "nacht";
  /** A hairline above it. Off when the block before it already ends on a line or a photo. */
  rule?: boolean;
}) {
  if (!statement) {
    return null;
  }
  const dark = tone === "nacht";

  return (
    <div
      className={cn(
        "px-5 py-16 sm:px-8 lg:px-gutter lg:py-24",
        tone === "karte" && "bg-karte",
        dark && "bg-nacht",
        rule && (dark ? "border-t border-paper/12" : "border-t border-line"),
      )}
    >
      <div className="grid gap-x-12 gap-y-6 lg:grid-cols-12">
        <p className={cn("t-lead lg:col-span-7", dark ? "text-paper" : "text-ink")}>{statement}</p>
        {note ? (
          <p
            className={cn(
              "max-w-md font-sans text-[16px] leading-relaxed lg:col-span-4 lg:col-start-9",
              dark ? "text-paper/70" : "text-muted",
            )}
          >
            {note}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/**
 * One ending for every collection: the showroom with the page's closing words, opening hours,
 * contact and the way there. No second quote, no second closing block.
 */
export function HubEnd({
  hub,
  children,
}: {
  hub: PresentedHub;
  children?: ReactNode;
}) {
  return (
    <>
      {children}
      <AtelierVisit hub={hub} title={hub.closeTitle} text={hub.closeText} />
    </>
  );
}
