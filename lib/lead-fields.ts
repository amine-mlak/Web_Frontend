export const LEAD_FORM = "beratung";

export const LEAD_FIELD_STEPS = ["name", "email", "phone", "message"] as const;

export type LeadFieldName = (typeof LEAD_FIELD_STEPS)[number];

export type LeadFieldError =
  | "invalid_name"
  | "invalid_email"
  | "invalid_phone"
  | "invalid_message";

export function leadFormSource(pathname: string) {
  return pathname === "/beratung" ? "beratung" : "home";
}

export function trimLead(value: unknown, max: number) {
  if (typeof value !== "string") {
    return "";
  }
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

export function fieldHasValue(field: LeadFieldName, value: unknown) {
  if (field === "phone") {
    return trimLead(value, 40).replace(/\D/g, "").length >= 6;
  }
  if (field === "email") {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimLead(value, 120).toLowerCase());
  }
  if (field === "name") {
    return trimLead(value, 80).length >= 2;
  }
  return trimLead(value, 2000).length > 0;
}

export function validateLeadFields(input: {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  message?: unknown;
}):
  | { ok: true; name: string; email: string; phone: string; message: string }
  | { ok: false; field: LeadFieldName; reason: LeadFieldError } {
  const name = trimLead(input.name, 80);
  const email = trimLead(input.email, 120).toLowerCase();
  const phone = trimLead(input.phone, 40);
  const message = trimLead(input.message, 2000);

  if (name.length < 2 || !/^[^\r\n]{2,80}$/.test(name)) {
    return { ok: false, field: "name", reason: "invalid_name" };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, field: "email", reason: "invalid_email" };
  }
  const phoneDigits = phone.replace(/\D/g, "");
  if (phoneDigits.length < 6 || phoneDigits.length > 16) {
    return { ok: false, field: "phone", reason: "invalid_phone" };
  }
  if ((message.match(/https?:\/\//gi) ?? []).length > 2) {
    return { ok: false, field: "message", reason: "invalid_message" };
  }

  return { ok: true, name, email, phone, message };
}

export function normalizePlz(value: unknown) {
  return trimLead(value, 8).replace(/\D/g, "").slice(0, 5);
}

export function isGermanPlz(value: string) {
  return /^\d{5}$/.test(value);
}
