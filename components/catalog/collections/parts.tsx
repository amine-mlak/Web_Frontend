import type { CSSProperties, ReactNode } from "react";
import CmsImage from "@/components/CmsImage";
import { photoStandIn } from "@/lib/photo-reveal";
import AtelierVisit from "@/components/catalog/hub/AtelierVisit";
import type { PresentedHub } from "@/lib/collection-present";
import { cn } from "@/lib/utils";

export type CollectionExtra = {
  href: string;
  title: string;
  meta?: string;
  image?: string;
};

export function Frame({
  src,
  alt,
  srcSet,
  className,
  imgClassName,
  priority,
  sizes,
  reveal = !priority,
  drift = false,
}: {
  src: string;
  alt: string;
  srcSet?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  sizes: string;
  /** Uncover the photo with its own blurred colours when it scrolls into view (off for heroes). */
  reveal?: boolean;
  /** Let the photo drift slowly inside the frame while the page scrolls. */
  drift?: boolean;
}) {
  const standIn = photoStandIn(src);
  return (
    <figure
      className={cn("relative overflow-hidden bg-nacht", drift && "photo-drift", className)}
      data-reveal={standIn && reveal ? "" : undefined}
      style={standIn ? ({ "--stand-in": `url("${standIn}")` } as CSSProperties) : undefined}
    >
      {standIn ? <span className="photo-stand-in" aria-hidden /> : null}
      <CmsImage
        src={src}
        alt={alt}
        srcSet={srcSet}
        fill
        priority={priority}
        sizes={sizes}
        className={cn("object-cover", imgClassName)}
      />
      {standIn && reveal ? <span className="photo-cover" aria-hidden /> : null}
    </figure>
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
