import { siteImage } from "@/lib/dev-images";

/**
 * The 24 px version of a CMS photo, shown blurred in its frame until the photo itself is
 * uncovered. Only photos served by /cms-opt or /cms-uploads (or straight from the CMS uploads)
 * have one; other images get no stand-in.
 */
export function photoStandIn(src: string | undefined) {
  if (!src) return undefined;
  const path = siteImage(src);
  const file =
    path.match(/^\/cms-opt\/\d+\/(.+)$/)?.[1] ??
    path.match(/^\/cms-uploads\/(.+)$/)?.[1] ??
    path.match(/^https?:\/\/cms\.beer\.de\/uploads\/(.+)$/)?.[1];
  return file ? `/cms-opt/24/${file}` : undefined;
}
