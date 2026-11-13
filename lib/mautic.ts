import { PLANNER_GROUPS, type PlannerContent, type PlannerGroupKey } from "@/lib/kitchen-planner-model";
import type { PlannerAnswers } from "@/lib/planner-lead";
import { plannerTips } from "@/lib/planner-tips";

/**
 * Hands planner leads and newsletter sign-ups to Mautic, which keeps the contacts and sends
 * the mail sequences. The website posts to two Mautic forms from the server; the forms are
 * not shown anywhere. Off until MAUTIC_URL is set, so nothing changes before Mautic has its
 * own address and can send mail.
 *
 * Form ids and field names are those of the forms in Mautic ("Küchenplaner (Website)" and
 * "Newsletter anmelden"); the field names there match the keys sent here.
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
      // Mautic text fields hold 191 characters. An address is never cut: half a link is worse than none.
      body.set(`mauticform[${key}]`, value.startsWith("https://") ? (value.length > 191 ? "" : value) : value.slice(0, 191));
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
  // The pages the follow-up mail points to, picked from the answers.
  const tips = plannerTips(lead.details, germanContent);
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
    beer_tipp_stil_titel: tips.style.title,
    beer_tipp_stil_link: tips.style.link,
    beer_tipp_stil_bild: tips.style.image,
    beer_tipp_front_titel: tips.front.title,
    beer_tipp_front_link: tips.front.link,
    beer_tipp_front_bild: tips.front.image,
    beer_tipp_platte_titel: tips.top.title,
    beer_tipp_platte_link: tips.top.link,
    beer_tipp_platte_bild: tips.top.image,
    beer_tipp_form_titel: tips.form.title,
    beer_tipp_form_link: tips.form.link,
  });
}

/**
 * Mautic form "Booklet (Website)" (segment "Booklet – 7 Geheimnisse"). Mautic only sends the delivery
 * mail (campaign "Booklet zustellen", only for digital or both and only with a PDF link); the form, the
 * thank-you page and every confirmation live on the website.
 */
const BOOKLET_FORM = { id: 18, name: "bookletwebsite" };

const SALUTATION_LABEL: Record<string, string> = { frau: "Frau", herr: "Herr", divers: "" };
const DELIVERY_LABEL: Record<string, string> = { digital: "digital", print: "gedruckt", both: "beides" };

export function sendBookletToMautic(request: {
  booklet: string;
  pdfUrl: string;
  delivery: string;
  salutation: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  plz: string;
  street: string;
  city: string;
}) {
  return submit(BOOKLET_FORM, {
    email: request.email,
    anrede: SALUTATION_LABEL[request.salutation] ?? "",
    vorname: request.firstName,
    nachname: request.lastName,
    telefon: request.phone,
    plz: request.plz,
    strasse: request.street,
    ort: request.city,
    beer_booklet: request.booklet,
    beer_booklet_versand: DELIVERY_LABEL[request.delivery] ?? request.delivery,
    beer_booklet_pdf: request.pdfUrl,
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
