import type { Locale } from "@/lib/i18n";
import { sendNewsletterToMautic } from "@/lib/mautic";

/**
 * Newsletter sign-up: the consent wording, and the hand-over to Mautic's form
 * "Newsletter anmelden", which sends the confirmation mail (double opt-in). The
 * address only receives newsletters after the click in that mail.
 */

/** What the person agrees to on the website. */
export const NEWSLETTER_CONSENT: Record<Locale, string> = {
  de: "Ja, ich möchte den Newsletter der BEER Küchenmanufaktur mit Küchen, Projekten und Terminen per E-Mail erhalten. Die Einwilligung kann ich jederzeit über den Link in jedem Newsletter widerrufen.",
  en: "Yes, I would like to receive the BEER Küchenmanufaktur newsletter with kitchens, projects and dates by e-mail. I can withdraw my consent at any time with the link in every newsletter.",
};

const EMAIL = /^[^\s@<>"]+@[^\s@<>"]+\.[a-z]{2,}$/i;

export function newsletterEmail(value: unknown) {
  const email = typeof value === "string" ? value.trim().toLowerCase().slice(0, 160) : "";
  return EMAIL.test(email) ? email : "";
}

export type NewsletterSignup = {
  email: string;
  vorname?: string;
  locale: Locale;
  /** Where the person signed up, e.g. "/kuechen (Fußzeile)". */
  source: string;
};

/** Sends one sign-up to Mautic. Returns why it failed (also when MAUTIC_URL is not set), or null when Mautic accepted it. */
export function sendNewsletterSignup(signup: NewsletterSignup): Promise<string | null> {
  return sendNewsletterToMautic(signup);
}

/** "/kuechen/farben?x=1" → "/kuechen/farben"; anything that is not a path on this site → "". */
export function signupPath(value: unknown) {
  if (typeof value !== "string") return "";
  try {
    const url = new URL(value, "https://www.beer.de");
    return url.pathname.slice(0, 160);
  } catch {
    return "";
  }
}
