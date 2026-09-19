import {
  LEAD_FIELD_STEPS,
  LEAD_FORM,
  leadFormSource,
  type LeadFieldName,
} from "@/lib/lead-fields";
import { trackEvent } from "@/lib/umami";

type FormErrorReason =
  | "invalid_name"
  | "invalid_email"
  | "invalid_phone"
  | "invalid_message"
  | "rate_limited"
  | "rejected"
  | "forbidden"
  | "unavailable"
  | "network"
  | "spam";

function meta() {
  return {
    form: LEAD_FORM,
    source:
      typeof window === "undefined"
        ? "home"
        : leadFormSource(window.location.pathname),
  };
}

export function trackFormView() {
  trackEvent("form_view", meta());
}

export function trackFormStart(field: LeadFieldName) {
  trackEvent("form_start", { ...meta(), field });
}

export function trackFormStep(field: LeadFieldName) {
  trackEvent("form_step", {
    ...meta(),
    field,
    step: String(LEAD_FIELD_STEPS.indexOf(field) + 1),
  });
}

export function trackFormAttempt() {
  trackEvent("form_attempt", meta());
}

export function trackFormError(reason: FormErrorReason, field?: LeadFieldName) {
  trackEvent(
    "form_error",
    field ? { ...meta(), reason, field } : { ...meta(), reason },
  );
}

export function trackFormSubmit() {
  trackEvent("form_submit", meta());
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
