import Image, { type ImageProps } from "next/image";
import { siteImage } from "@/lib/dev-images";
import { cn } from "@/lib/utils";

type CmsImageProps = ImageProps & {
  srcSet?: string;
};

export default function CmsImage({
  src,
  alt,
  srcSet,
  className,
  fill,
  priority,
  loading,
  sizes,
  quality: _quality,
  ...props
}: CmsImageProps) {
  const raw = typeof src === "string" ? src : "";
  const srcString = siteImage(raw);
  const remapped = srcString !== raw;
  const proxied = srcString.startsWith("/cms-uploads/");
  const instagramOriginal = srcString.startsWith("/instagram/");
  const remote = /^https?:\/\//.test(srcString);
  const native =
    remapped || Boolean(srcSet) || proxied || remote || instagramOriginal;

  if (native) {
    return (
      // Native img keeps srcset working for Strapi derivatives without the optimizer timeout.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={srcString}
        srcSet={remapped ? undefined : srcSet}
        sizes={typeof sizes === "string" ? sizes : undefined}
        alt={alt}
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
      priority={priority}
      loading={loading}
      sizes={sizes}
      className={className}
      {...props}
    />
  );
}
