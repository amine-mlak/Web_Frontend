import { LEAD_FORM, leadFormSource } from "@/lib/lead-fields";
import { trackEvent } from "@/lib/umami";
import type { BeratungWizardStep } from "@/lib/beratung-wizard";

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
  trackEvent("form_view", meta());
}

export function trackFormStart(step: BeratungWizardStep) {
  trackEvent("form_start", meta({ step }));
}

export function trackFormWizardStep(step: BeratungWizardStep) {
  trackEvent("form_step", meta({ step }));
  trackEvent(`form_step_${step}`, meta());
}

export function trackFormAttempt(step: BeratungWizardStep = "nachricht") {
  trackEvent("form_attempt", meta({ step }));
}

export function trackFormError(reason: FormErrorReason, step?: string) {
  const data = step ? meta({ reason, step }) : meta({ reason });
  trackEvent("form_error", data);
  trackEvent(`form_error_${reason}`, data);
}

export function trackFormSubmit() {
  trackEvent("form_submit", meta({ step: "complete" }));
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
