import Image, { type ImageProps } from "next/image";
import { siteImage } from "@/lib/dev-images";
import { cn } from "@/lib/utils";

type CmsImageProps = ImageProps & {
  srcSet?: string;
};

// Widths the /cms-opt route renders (app/cms-opt/[width]/[...path]/route.ts).
const OPT_WIDTHS = [1280, 1600, 1920, 2560, 3840];

/**
 * A photo resized by /cms-opt/<width>/<file> also exists in every smaller width, so the
 * browser can pick the one that fits the screen instead of always loading the largest.
 */
function optSrcSet(src: string) {
  const match = src.match(/^\/cms-opt\/(\d+)\/(.+)$/);
  if (!match) return undefined;
  const largest = Number(match[1]);
  const widths = OPT_WIDTHS.filter((width) => width <= largest);
  return widths.length > 1 ? widths.map((width) => `/cms-opt/${width}/${match[2]} ${width}w`).join(", ") : undefined;
}

export default function CmsImage({
  src,
  alt,
  srcSet,
  className,
  fill,
  priority,
  loading,
  sizes,
  // Taken out so it is not passed to the plain <img>; next/image picks its own.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  quality: _quality,
  width,
  height,
  ...props
}: CmsImageProps) {
  const raw = typeof src === "string" ? src : "";
  const srcString = siteImage(raw);
  const remapped = srcString !== raw;
  const proxied =
    srcString.startsWith("/cms-uploads/") || srcString.startsWith("/cms-opt/");
  const localOriginal =
    srcString.startsWith("/instagram/") || srcString.startsWith("/brands/");
  const remote = /^https?:\/\//.test(srcString);
  const native =
    remapped || Boolean(srcSet) || proxied || remote || localOriginal;

  if (native) {
    return (
      // Native img keeps srcset working for Strapi derivatives without the optimizer timeout.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={srcString}
        srcSet={remapped ? undefined : srcSet ?? optSrcSet(srcString)}
        sizes={typeof sizes === "string" ? sizes : undefined}
        alt={alt}
        // Without fill, the size reserves space so the layout does not jump.
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        loading={priority ? "eager" : loading ?? "lazy"}
        className={cn(fill && "absolute inset-0 h-full w-full", className)}
        style={props.style}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      priority={priority}
      loading={loading}
      sizes={sizes}
      className={className}
      {...props}
    />
  );
}
