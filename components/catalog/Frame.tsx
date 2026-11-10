import type { CSSProperties } from "react";
import CmsImage from "@/components/CmsImage";
import { photoStandIn } from "@/lib/photo-reveal";
import { cn } from "@/lib/utils";

/** Opens the photo in the full-screen viewer: its place in the viewer and the button label. */
export type FrameZoom = { index: number; label: string };

export function Frame({
  src,
  alt,
  srcSet,
  className,
  imgClassName,
  priority,
  sizes,
  drift = false,
  zoom,
}: {
  src: string;
  alt: string;
  srcSet?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  sizes: string;
  /** Let the photo drift slowly inside the frame while the page scrolls. */
  drift?: boolean;
  /** Inside a PhotoViewer: a click on the photo opens it large. */
  zoom?: FrameZoom;
}) {
  // The photo's own colours, blurred, sit under it while it loads (no grey box, no movement).
  const standIn = photoStandIn(src);
  return (
    <figure
      className={cn("relative overflow-hidden bg-nacht", drift && "photo-drift", className)}
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
      {zoom ? (
        <button
          type="button"
          data-photo={zoom.index}
          aria-label={zoom.label}
          className="absolute inset-0 z-[1] cursor-zoom-in focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-paper"
        />
      ) : null}
    </figure>
  );
}
