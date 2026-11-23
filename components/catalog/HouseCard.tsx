import LocaleLink from "@/components/LocaleLink";
import { Frame } from "@/components/catalog/Frame";
import type { ClusterHouse } from "@/lib/collection-clusters";
import { cn } from "@/lib/utils";

/** The line under the name, in the forms the pages use. */
const META = {
  plain: "mt-2 font-sans text-[14px] text-muted",
  tight: "mt-1 font-sans text-[14px] text-muted",
  eyebrow: "type-eyebrow mt-2 text-muted",
  caps: "mt-2 font-sans text-[11px] tracking-[0.18em] text-muted uppercase",
} as const;

/**
 * One kitchen as a card: its photo in the shared frame, the name, and place and year (or what
 * the page says about it) below. Every list of kitchens on the site uses it; the caller sets the
 * photo's shape and the list item around it.
 */
export default function HouseCard({
  house,
  frameClassName,
  sizes,
  meta = "plain",
  heading = false,
  titleClassName = "mt-4",
}: {
  house: ClusterHouse;
  /** The photo's shape, e.g. "aspect-[4/5]". */
  frameClassName: string;
  sizes: string;
  meta?: keyof typeof META;
  /** The name is a heading (h3) where the list has its own h2. */
  heading?: boolean;
  titleClassName?: string;
}) {
  const Title = heading ? "h3" : "p";
  return (
    <LocaleLink href={house.href} className="group block">
      <Frame src={house.image} srcSet={house.srcSet} alt={house.title} className={frameClassName} sizes={sizes} />
      <Title className={cn("t-item text-ink", titleClassName)}>{house.title}</Title>
      {house.meta ? <p className={META[meta]}>{house.meta}</p> : null}
    </LocaleLink>
  );
}
