import { beerNamed, beerPhoto } from "@/lib/beer-photos";

export function isStockPhoto(src?: string) {
  return !src || src.startsWith("/kitchens/");
}

export function isDevPlaceholder(src?: string) {
  return isStockPhoto(src);
}

export function devPhoto(index: number, width = 1800) {
  return beerPhoto(index, width);
}

export function resolveDevImage(src: string | undefined, fallback: string): string {
  if (!src || isStockPhoto(src)) {
    return fallback;
  }
  return src;
}

export function siteImage(src: string | undefined, width = 1800): string {
  if (!src) {
    return "";
  }
  if (src.startsWith("/kitchens/")) {
    return beerNamed(src.slice("/kitchens/".length), width);
  }
  return src;
}
