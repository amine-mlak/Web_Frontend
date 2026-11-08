import { LEAD_FORM, leadFormSource } from "@/lib/lead-fields";
import { pushDataLayer, track } from "@/lib/analytics";
import { hasConsent } from "@/lib/consent-state";
import { hashedUserData } from "@/lib/hash";
import { trackEvent } from "@/lib/umami";
// Planner step keys (lib/kitchen-planner.ts) or "complete".
type BeratungWizardStep = string;

type FormErrorReason =
  | "invalid_name"
  | "invalid_email"
  | "invalid_phone"
  | "invalid_message"
  | "invalid_intent"
  | "invalid_choice"
  | "invalid_place"
  | "invalid_plz"
  | "rate_limited"
  | "rejected"
  | "forbidden"
  | "unavailable"
  | "network"
  | "spam";

function meta(extra?: Record<string, string | number | boolean>) {
  return {
    form: LEAD_FORM,
    source:
      typeof window === "undefined"
        ? "home"
        : leadFormSource(window.location.pathname),
    ...extra,
  };
}

export function trackFormView() {
  track("form_view", meta());
}

export function trackFormStart(step: BeratungWizardStep) {
  track("form_start", meta({ step }));
}

export function trackFormWizardStep(step: BeratungWizardStep) {
  track("form_step", meta({ step }));
  trackEvent(`form_step_${step}`, meta());
}

export function trackFormAttempt(step: BeratungWizardStep = "kontakt") {
  track("form_attempt", meta({ step }));
}

export function trackFormError(reason: FormErrorReason, step?: string) {
  const data = step ? meta({ reason, step }) : meta({ reason });
  track("form_error", data);
  trackEvent(`form_error_${reason}`, data);
}

export function trackFormSubmit() {
  track("form_submit", meta({ step: "complete" }));
}

/**
 * The conversion for GA4 and the ad platforms. `event_id` is the id n8n got with
 * the lead, so a later server-side send (phase 2) is counted once. Contact data
 * goes along only with Marketing consent, and only hashed (lib/hash.ts).
 * NEXT_PUBLIC_LEAD_VALUE: optional value in EUR per lead, for value-based bidding.
 */
export async function trackLead(eventId: string, contact: { email: string; phone: string; place: string }) {
  const value = Number(process.env.NEXT_PUBLIC_LEAD_VALUE);
  const entry: Record<string, unknown> = {
    event: "generate_lead",
    event_id: eventId,
    form: LEAD_FORM,
    ...(value > 0 ? { value, currency: "EUR" } : {}),
  };
  if (hasConsent("marketing")) {
    entry.user_data = await hashedUserData(contact);
  }
  pushDataLayer(entry);
}

export function apiErrorReason(status: number): FormErrorReason {
  if (status === 429) {
    return "rate_limited";
  }
  if (status === 403) {
    return "forbidden";
  }
  if (status === 400) {
    return "rejected";
  }
  return "unavailable";
}
