import { PLANNER_MEDIA, type PlannerMediaName } from "@/lib/kitchen-planner-media";
import { strapiMediaUrl } from "@/lib/strapi";

/**
 * BEER's own hand sketches of the kitchen shapes. They are the drawings of the online planner
 * (CMS media "planer-…"), so a shape looks the same on its page and in the planner.
 */
const SKETCHES: Record<string, PlannerMediaName> = {
  zeile: "planer-form-zeile.png",
  "l-form": "planer-form-l-form.png",
  "u-form": "planer-form-u-form.png",
  insel: "planer-form-insel.png",
  // No sketch of their own yet: the planner's "offener Raum" and "bis 10 m²" stand in.
  offen: "planer-raum-offen.png",
  klein: "planer-groesse-bis-10.png",
};

export type FormSketch = { src: string; width: number; height: number };

export function formSketch(form?: string): FormSketch | null {
  const name = form ? SKETCHES[form] : undefined;
  if (!name) {
    return null;
  }
  const file = PLANNER_MEDIA[name];
  return { src: strapiMediaUrl(file.url), width: file.width, height: file.height };
}
