import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** A photo's file name, so the same photo matches at any size or host. */
export function photoKey(src: string) {
  return src.split("?")[0].split("/").pop() ?? src;
}
