import type { ReactNode } from "react";
import CmsImage from "@/components/CmsImage";
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
}: {
  src: string;
  alt: string;
  srcSet?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  sizes: string;
}) {
  return (
    <figure className={cn("relative overflow-hidden bg-nacht", className)}>
      <CmsImage
        src={src}
        alt={alt}
        srcSet={srcSet}
        fill
        priority={priority}
        sizes={sizes}
        className={cn("object-cover", imgClassName)}
      />
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
