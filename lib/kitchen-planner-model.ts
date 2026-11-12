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

export type BudgetBand = { id: string; from: number; to?: number };

/** The budget answers: ranges cut from the planner's three budget numbers (lowest, middle, highest). */
export function budgetBands(budget: PlannerContent["budget"]): BudgetBand[] {
  const split = Math.round((budget.mid + budget.max) / 2 / 10000) * 10000;
  const between =
    split > budget.mid && split < budget.max
      ? [
          { id: `${budget.mid}-${split}`, from: budget.mid, to: split },
          { id: `${split}-${budget.max}`, from: split, to: budget.max },
        ]
      : [{ id: `${budget.mid}-${budget.max}`, from: budget.mid, to: budget.max }];
  return [{ id: `0-${budget.mid}`, from: 0, to: budget.mid }, ...between, { id: `${budget.max}-`, from: budget.max }];
}

export function budgetLabel(band: BudgetBand, locale: Locale) {
  const amount = (value: number) => value.toLocaleString(locale === "en" ? "en-GB" : "de-DE");
  if (band.to === undefined) {
    return locale === "en" ? `over €${amount(band.from)}` : `über ${amount(band.from)} €`;
  }
  if (band.from === 0) {
    return locale === "en" ? `up to €${amount(band.to)}` : `bis ${amount(band.to)} €`;
  }
  return locale === "en" ? `€${amount(band.from)} – €${amount(band.to)}` : `${amount(band.from)} – ${amount(band.to)} €`;
}

/** Option values the server accepts per question, from the same content the visitor saw. */
export function allowedValues(content: PlannerContent) {
  const map = new Map<PlannerGroupKey, Set<string>>();
  for (const group of content.groups) {
    map.set(group.group, new Set(group.options.map((option) => option.value)));
  }
  return map;
}
