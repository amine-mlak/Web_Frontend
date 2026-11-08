"use client";

/**
 * Normalising + SHA-256 for the ad platforms' matching (Google enhanced
 * conversions, Meta advanced matching, …). Only these hashes ever reach the
 * dataLayer, never the address or number itself.
 */

async function sha256(value: string) {
  if (!value || typeof crypto === "undefined" || !crypto.subtle) {
    return "";
  }
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, "0")).join("");
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

/** E.164 with Germany as the default country: "0171 23 45" → "+491712345". */
export function normalizePhone(phone: string) {
  const digits = phone.trim().replace(/[^\d+]/g, "");
  if (!digits) return "";
  if (digits.startsWith("+")) return `+${digits.slice(1).replace(/\+/g, "")}`;
  if (digits.startsWith("00")) return `+${digits.slice(2)}`;
  if (digits.startsWith("0")) return `+49${digits.slice(1)}`;
  return `+49${digits}`;
}

/** German postcode from "85395 Wolfersdorf" or "85395"; empty when there is none. */
export function postcodeOf(place: string) {
  return place.match(/\b\d{5}\b/)?.[0] ?? "";
}

export async function hashedUserData(input: { email: string; phone: string; place: string }) {
  const [email, phone] = await Promise.all([
    sha256(normalizeEmail(input.email)),
    sha256(normalizePhone(input.phone)),
  ]);
  const postcode = postcodeOf(input.place);
  return {
    ...(email ? { sha256_email_address: email } : {}),
    ...(phone ? { sha256_phone_number: phone } : {}),
    address: { ...(postcode ? { postal_code: postcode } : {}), country: "DE" },
  };
}
