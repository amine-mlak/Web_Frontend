import { CMS_NAMED, CMS_PHOTOS } from "@/lib/cms-photos";

const OPT_WIDTHS = [1280, 1600, 1920, 2560, 3840];
const SAFE_PATH = /^(?:[A-Za-z0-9._-]+\/)*[A-Za-z0-9._-]+$/;

function cmsFile(src: string) {
  if (src.startsWith("/cms-uploads/")) {
    return src.slice("/cms-uploads/".length);
  }
  if (src.startsWith("/uploads/")) {
    return src.slice("/uploads/".length);
  }
  return src.replace(/^\//, "");
}

export function cmsSrc(src: string, width = 1800) {
  const file = cmsFile(src);
  if (!SAFE_PATH.test(file)) {
    return src.startsWith("/") ? src : `/cms-uploads/${file}`;
  }
  const sized = OPT_WIDTHS.find((item) => item >= width) ?? 3840;
  return `/cms-opt/${sized}/${file}`;
}

export const BEER_NAMED: Record<string, string> = {
  "stile-modern.jpg":
    CMS_NAMED["stile-modern.jpg"] ?? CMS_PHOTOS[0] ?? "",
  "stile-landhaus.jpg":
    CMS_NAMED["stile-landhaus.jpg"] ?? CMS_PHOTOS[1] ?? "",
  "stile-design.jpg":
    CMS_NAMED["stile-design.jpg"] ?? CMS_PHOTOS[2] ?? "",
  "stile-holz.jpg": CMS_NAMED["stile-holz.jpg"] ?? CMS_PHOTOS[3] ?? "",
  "stile-insel.jpg": CMS_NAMED["stile-insel.jpg"] ?? CMS_PHOTOS[4] ?? "",
  "stile-purist.jpg":
    CMS_NAMED["stile-purist.jpg"] ?? CMS_PHOTOS[5] ?? "",
};

export const BEER_PHOTOS = CMS_PHOTOS;

export function beerPhoto(index: number, width = 1800) {
  const src =
    BEER_PHOTOS[
      ((index % BEER_PHOTOS.length) + BEER_PHOTOS.length) % BEER_PHOTOS.length
    ];
  return cmsSrc(src, width);
}

export function beerNamed(file: string, width = 1800) {
  const src = BEER_NAMED[file] ?? BEER_PHOTOS[0];
  return cmsSrc(src, width);
}

export function cmsLarge(src: string | undefined, width = 3840) {
  if (!src) {
    return "";
  }
  const optimized = src.match(/^\/cms-opt\/\d+\/(.+)$/);
  if (optimized) {
    return cmsSrc(`/cms-uploads/${optimized[1]}`, width);
  }
  if (src.startsWith("/cms-uploads/") || src.startsWith("/uploads/")) {
    return cmsSrc(src, width);
  }
  if (src.startsWith("/kitchens/")) {
    return beerNamed(src.slice("/kitchens/".length), width);
  }
  return src;
}
