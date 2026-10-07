import type { ReactNode } from "react";
import CmsImage from "@/components/CmsImage";
import GutZuWissen from "@/components/GutZuWissen";
import AtelierVisit from "@/components/catalog/hub/AtelierVisit";
import CloseAtelier from "@/components/catalog/hub/CloseAtelier";
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

export function HubEnd({
  hub,
  children,
}: {
  hub: PresentedHub;
  children?: ReactNode;
}) {
  const asideEyebrow = hub.locale === "en" ? "Worth knowing" : "Gut zu wissen";

  return (
    <>
      {children}
      <AtelierVisit hub={hub} />
      <GutZuWissen
        content={{
          eyebrow: asideEyebrow,
          quote: hub.quote,
          source: hub.quoteSource,
        }}
      />
      <CloseAtelier hub={hub} />
    </>
  );
}
