export function storyblokAsset(
  image: unknown,
  fallbackSrc: string,
  fallbackAlt: string,
): { src: string; alt: string } {
  if (image && typeof image === "object" && "filename" in image) {
    const asset = image as { filename?: string; alt?: string };
    if (asset.filename) {
      return { src: asset.filename, alt: asset.alt || fallbackAlt };
    }
  }
  if (typeof image === "string" && image.length > 0) {
    return { src: image, alt: fallbackAlt };
  }
  return { src: fallbackSrc, alt: fallbackAlt };
}
