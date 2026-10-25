import { trimLead } from "@/lib/lead-fields";
import {
  PLANNER_GROUPS,
  allowedValues,
  type PlannerContent,
  type PlannerGroupKey,
} from "@/lib/kitchen-planner-model";

/** What the planner sends for its answers (the contact fields travel separately). */
export type PlannerAnswersInput = {
  answers?: unknown;
  notes?: unknown;
  budget?: unknown;
  place?: unknown;
};

export type PlannerAnswers = {
  answers: Partial<Record<PlannerGroupKey, string[]>>;
  notes: { style?: string; form?: string; wishes?: string };
  /** Rough budget in euros, or null for "Keine Angabe" / not touched. */
  budget: number | null;
  /** Postcode or town the visitor typed (free text, optional). */
  place?: string;
};

const NOTE_KEYS = ["style", "form", "wishes"] as const;

/**
 * Keeps only answers that exist in the planner the visitor saw. Every
 * answer is optional: the planner is non-binding by design.
 */
export function readPlannerAnswers(input: PlannerAnswersInput, content: PlannerContent): PlannerAnswers {
  const allowed = allowedValues(content);
  const raw = input.answers && typeof input.answers === "object" && !Array.isArray(input.answers)
    ? (input.answers as Record<string, unknown>)
    : {};

  const answers: PlannerAnswers["answers"] = {};
  for (const key of Object.keys(PLANNER_GROUPS) as PlannerGroupKey[]) {
    const values = Array.isArray(raw[key]) ? raw[key] : typeof raw[key] === "string" ? [raw[key]] : [];
    const valid = allowed.get(key) ?? new Set<string>();
    const picked: string[] = [];
    for (const value of values) {
      if (typeof value === "string" && valid.has(value) && !picked.includes(value)) {
        picked.push(value);
      }
    }
    const kept = PLANNER_GROUPS[key].multi ? picked.slice(0, 12) : picked.slice(0, 1);
    if (kept.length) {
      answers[key] = kept;
    }
  }

  const rawNotes = input.notes && typeof input.notes === "object" ? (input.notes as Record<string, unknown>) : {};
  const notes: PlannerAnswers["notes"] = {};
  for (const key of NOTE_KEYS) {
    const value = trimLead(rawNotes[key], 600);
    if (value) {
      notes[key] = value;
    }
  }

  const amount = typeof input.budget === "number" ? Math.round(input.budget) : NaN;
  const budget =
    Number.isFinite(amount) && amount >= content.budget.min && amount <= content.budget.max ? amount : null;
  const place = trimLead(input.place, 80) || undefined;

  return { answers, notes, budget, ...(place ? { place } : {}) };
}

const LINE_LABEL: Record<PlannerGroupKey, string> = {
  style: "Stil",
  front: "Fronten",
  top: "Arbeitsplatte",
  griffe: "Griffe",
  appliances: "Geräte",
  wishes: "Wünsche",
  project: "Vorhaben",
  raum: "Raumsituation",
  size: "Raumgröße",
  form: "Küchenform",
};

function euros(value: number, max: number) {
  return `ca. ${value.toLocaleString("de-DE")} €${value >= max ? " +" : ""}`;
}

/** The lead mail text, in German with German option labels. */
export function composePlannerMessage(
  input: PlannerAnswers & { message?: string },
  germanContent: PlannerContent,
) {
  const labelOf = (key: PlannerGroupKey, value: string) =>
    germanContent.groups.find((group) => group.group === key)?.options.find((option) => option.value === value)?.label ?? value;

  const lines: string[] = [];
  for (const key of Object.keys(LINE_LABEL) as PlannerGroupKey[]) {
    if (key === "wishes") {
      continue;
    }
    const values = input.answers[key] ?? [];
    let text = values.length ? values.map((value) => labelOf(key, value)).join(", ") : "—";
    const note = key === "style" ? input.notes.style : key === "form" ? input.notes.form : undefined;
    if (note) {
      text += ` (${note})`;
    }
    lines.push(`${LINE_LABEL[key]}: ${text}`);
  }
  lines.push(`Wünsche: ${input.notes.wishes || "—"}`);
  lines.push(`Budget: ${input.budget ? euros(input.budget, germanContent.budget.max) : "Keine Angabe"}`);
  if (input.place) {
    lines.push(`PLZ / Ort: ${input.place}`);
  }
  const message = input.message?.trim();
  if (message) {
    lines.push("", message);
  }
  return lines.join("\n");
}
