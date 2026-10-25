import type { Locale } from "@/lib/i18n";

/**
 * Client-safe part of the kitchen planner: the fixed flow and the content
 * types. The CMS loader and the built-in fallback live in lib/kitchen-planner.ts.
 */

export const PLANNER_STEPS = ["stil", "material", "ausstattung", "raum", "form", "budget", "kontakt"] as const;
export type PlannerStepKey = (typeof PLANNER_STEPS)[number];

export const PLANNER_GROUPS = {
  style: { step: "stil", kind: "images", multi: true },
  front: { step: "material", kind: "images", multi: true },
  top: { step: "material", kind: "images", multi: true },
  griffe: { step: "material", kind: "images", multi: true },
  appliances: { step: "ausstattung", kind: "chips", multi: true },
  wishes: { step: "ausstattung", kind: "note", multi: false },
  project: { step: "raum", kind: "icons", multi: false },
  raum: { step: "raum", kind: "icons", multi: false },
  size: { step: "raum", kind: "icons", multi: false },
  form: { step: "form", kind: "icons", multi: false },
} as const satisfies Record<string, { step: PlannerStepKey; kind: "images" | "chips" | "note" | "icons"; multi: boolean }>;
export type PlannerGroupKey = keyof typeof PLANNER_GROUPS;

export type PlannerImage = { src: string; srcSet?: string; width?: number; height?: number; alt: string };

export type PlannerOption = {
  value: string;
  label: string;
  subtitle?: string;
  image?: PlannerImage;
  iconSize?: number;
  freeText?: boolean;
};

export type PlannerGroup = {
  group: PlannerGroupKey;
  label: string;
  hint?: string;
  placeholder?: string;
  options: PlannerOption[];
};

export type PlannerStep = { step: PlannerStepKey; title: string; subtitle: string; overview?: string };

export type PlannerContent = {
  locale: Locale;
  eyebrow: string;
  title: string;
  titleEmphasis: string;
  intro: string;
  steps: PlannerStep[];
  groups: PlannerGroup[];
  budget: { min: number; mid: number; max: number };
  done: { title: string; text: string; linkLabel: string; linkHref: string };
};

/** Option values the server accepts per question, from the same content the visitor saw. */
export function allowedValues(content: PlannerContent) {
  const map = new Map<PlannerGroupKey, Set<string>>();
  for (const group of content.groups) {
    map.set(group.group, new Set(group.options.map((option) => option.value)));
  }
  return map;
}
