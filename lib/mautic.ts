import { PLANNER_GROUPS, type PlannerContent, type PlannerGroupKey } from "@/lib/kitchen-planner-model";
import type { PlannerAnswers } from "@/lib/planner-lead";

/**
 * Hands planner leads and newsletter sign-ups to Mautic, which keeps the contacts and sends
 * the mail sequences. The website posts to two Mautic forms from the server; the forms are
 * not shown anywhere. Off until MAUTIC_URL is set, so nothing changes before Mautic has its
 * own address and can send mail.
 *
 * Form ids and field names are those of the forms in Mautic ("Küchenplaner (Website)" and
 * "Newsletter anmelden"); see docs/mautic-plan.md.
 */
const PLANNER_FORM = { id: 17, name: "kuchenplanerwebsite" };
const NEWSLETTER_FORM = { id: 1, name: "newsletteranmelden" };

function baseUrl() {
  const raw = process.env.MAUTIC_URL?.trim();
  if (!raw) {
    return null;
  }
  try {
    const url = new URL(raw);
    return url.protocol === "https:" ? url.origin : null;
  } catch {
    return null;
  }
}

export function mauticEnabled() {
  return baseUrl() !== null;
}

/** Posts one form to Mautic. Returns null when it went through, otherwise the reason. */
async function submit(form: { id: number; name: string }, fields: Record<string, string | string[]>): Promise<string | null> {
  const base = baseUrl();
  if (!base) {
    return "mautic_not_configured";
  }
  const body = new URLSearchParams();
  for (const [key, value] of Object.entries(fields)) {
    if (Array.isArray(value)) {
      // A ticked box: the value has to be the option's exact wording.
      for (const item of value) body.append(`mauticform[${key}][]`, item);
    } else {
      // Mautic text fields hold 191 characters.
      body.set(`mauticform[${key}]`, value.slice(0, 191));
    }
  }
  body.set("mauticform[formId]", String(form.id));
  body.set("mauticform[formName]", form.name);
  body.set("mauticform[return]", "");
  try {
    const response = await fetch(`${base}/form/submit?formId=${form.id}`, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded", "x-requested-with": "XMLHttpRequest" },
      body,
      redirect: "manual",
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    return response.status < 400 ? null : `mautic_status_${response.status}`;
  } catch (error) {
    return `mautic_unreachable_${error instanceof Error ? error.name : "unknown"}`;
  }
}

/** The planner answers as the German labels the visitor saw, joined per question. */
function answerLabels(details: PlannerAnswers, germanContent: PlannerContent) {
  const labels = (key: PlannerGroupKey) =>
    (details.answers[key] ?? [])
      .map((value) => germanContent.groups.find((group) => group.group === key)?.options.find((option) => option.value === value)?.label ?? value)
      .join(", ");
  return Object.fromEntries((Object.keys(PLANNER_GROUPS) as PlannerGroupKey[]).map((key) => [key, labels(key)])) as Record<PlannerGroupKey, string>;
}

export function sendPlannerToMautic(
  lead: { name: string; email: string; phone: string; details: PlannerAnswers; hasPlan: boolean },
  germanContent: PlannerContent,
) {
  const [first, ...rest] = lead.name.trim().split(/\s+/);
  const labels = answerLabels(lead.details, germanContent);
  return submit(PLANNER_FORM, {
    email: lead.email,
    vorname: rest.length ? first : "",
    nachname: rest.length ? rest.join(" ") : first,
    telefon: lead.phone,
    ort: lead.details.place ?? "",
    beer_budget: lead.details.budgetRange ?? "Keine Angabe",
    beer_stil: labels.style,
    beer_fronten: labels.front,
    beer_arbeitsplatte: labels.top,
    beer_geraete: labels.appliances,
    beer_form: labels.form,
    beer_vorhaben: labels.project,
    beer_grundriss: lead.hasPlan ? "ja" : "nein",
  });
}

/**
 * The consent box of Mautic's form "Newsletter anmelden". The form requires it, and Mautic only
 * takes this exact wording; the website calls this after the visitor agreed to its own wording.
 */
const NEWSLETTER_FORM_CONSENT =
  "Ja, ich möchte den Newsletter der BEER Küchenmanufaktur mit Küchen, Projekten und Terminen per E-Mail erhalten. Die Einwilligung kann ich jederzeit über den Link in jedem Newsletter widerrufen.";

/** Starts the double opt-in in Mautic: the address gets the confirmation mail from there. */
export function sendNewsletterToMautic(signup: { email: string; vorname?: string }) {
  return submit(NEWSLETTER_FORM, {
    email: signup.email,
    firstname: signup.vorname?.trim().slice(0, 60) ?? "",
    einwilligung: [NEWSLETTER_FORM_CONSENT],
  });
}
