import type { Locale } from "@/lib/i18n";

/**
 * Newsletter sign-up: the consent wording, and the hand-over to the n8n workflow
 * "BEER Newsletter", which stores the address as "ausstehend" and sends the
 * confirmation mail (double opt-in). The address only receives newsletters after
 * the click in that mail.
 */

/** What the person agrees to. n8n stores this exact wording with the address as proof. */
export const NEWSLETTER_CONSENT: Record<Locale, string> = {
  de: "Ja, ich möchte den Newsletter der BEER Küchenmanufaktur mit Küchen, Projekten und Terminen per E-Mail erhalten. Die Einwilligung kann ich jederzeit über den Link in jedem Newsletter widerrufen.",
  en: "Yes, I would like to receive the BEER Küchenmanufaktur newsletter with kitchens, projects and dates by e-mail. I can withdraw my consent at any time with the link in every newsletter.",
};

const EMAIL = /^[^\s@<>"]+@[^\s@<>"]+\.[a-z]{2,}$/i;

export function newsletterEmail(value: unknown) {
  const email = typeof value === "string" ? value.trim().toLowerCase().slice(0, 160) : "";
  return EMAIL.test(email) ? email : "";
}

/** N8N_NEWSLETTER_WEBHOOK_URL, or /webhook/beer-newsletter/anmelden on the n8n host of the lead webhook. */
function n8nConfig() {
  const secret = process.env.N8N_WEBHOOK_SECRET?.trim();
  const own = process.env.N8N_NEWSLETTER_WEBHOOK_URL?.trim();
  const lead = process.env.N8N_WEBHOOK_URL?.trim();
  if (!secret || (!own && !lead)) {
    return null;
  }
  try {
    const url = own ? new URL(own) : new URL("/webhook/beer-newsletter/anmelden", lead);
    return url.protocol === "https:" ? { url: url.toString(), secret } : null;
  } catch {
    return null;
  }
}

export type NewsletterSignup = {
  email: string;
  vorname?: string;
  locale: Locale;
  /** Where the person signed up, e.g. "/kuechen (Fußzeile)". */
  source: string;
};

/** Sends one sign-up to n8n. Returns why it failed, or null when n8n accepted it. */
export async function sendNewsletterSignup(signup: NewsletterSignup): Promise<string | null> {
  const n8n = n8nConfig();
  if (!n8n) {
    return "n8n_not_configured";
  }
  try {
    const response = await fetch(n8n.url, {
      method: "POST",
      headers: { "content-type": "application/json", "x-n8n-webhook-secret": n8n.secret },
      body: JSON.stringify({
        form: "newsletter",
        consent: true,
        email: signup.email,
        vorname: signup.vorname?.trim().slice(0, 60) ?? "",
        sprache: signup.locale,
        quelle: signup.source.slice(0, 200),
        einwilligung: NEWSLETTER_CONSENT[signup.locale],
      }),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!response.ok) {
      return `n8n_status_${response.status}`;
    }
    const result: unknown = await response.json().catch(() => null);
    return result && typeof result === "object" && "ok" in result && result.ok === true ? null : "n8n_not_ok";
  } catch (error) {
    return `n8n_unreachable_${error instanceof Error ? error.name : "unknown"}`;
  }
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
