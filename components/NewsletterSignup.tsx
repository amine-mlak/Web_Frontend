"use client";

import { type FormEvent, useId, useRef, useState } from "react";
import LocaleLink from "@/components/LocaleLink";
import { useLocale } from "@/components/LocaleProvider";
import type { Locale } from "@/lib/i18n";

const UI: Record<Locale, Record<string, string>> = {
  de: {
    title: "Newsletter",
    text: "Neue Küchen aus unseren Projekten, Termine in der Ausstellung und was sich in Wolfersdorf tut. Etwa einmal im Monat.",
    email: "E-Mail-Adresse",
    name: "Vorname (freiwillig)",
    privacy: "Mehr dazu in der",
    privacyLink: "Datenschutzerklärung",
    submit: "Anmelden",
    sending: "Wird gesendet …",
    doneTitle: "Fast geschafft.",
    done: "Wir haben Ihnen eine E-Mail geschickt. Bitte bestätigen Sie die Anmeldung mit dem Link darin; erst dann erhalten Sie den Newsletter.",
    errEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
    errConsent: "Bitte bestätigen Sie, dass Sie den Newsletter erhalten möchten.",
    errSend: "Das hat leider nicht geklappt. Bitte versuchen Sie es später noch einmal.",
  },
  en: {
    title: "Newsletter",
    text: "New kitchens from our projects, dates in the showroom and news from Wolfersdorf. About once a month.",
    email: "E-mail address",
    name: "First name (optional)",
    privacy: "More in the",
    privacyLink: "privacy policy",
    submit: "Sign up",
    sending: "Sending …",
    doneTitle: "Almost done.",
    done: "We have sent you an e-mail. Please confirm your subscription with the link in it; only then will you receive the newsletter.",
    errEmail: "Please enter a valid e-mail address.",
    errConsent: "Please confirm that you would like to receive the newsletter.",
    errSend: "That did not work, sorry. Please try again later.",
  },
};

async function fetchChallenge() {
  const response = await fetch("/api/lead/challenge", { method: "GET", credentials: "same-origin", cache: "no-store" });
  if (!response.ok) return "";
  const data: unknown = await response.json().catch(() => null);
  return data && typeof data === "object" && "challenge" in data && typeof data.challenge === "string" ? data.challenge : "";
}

// The challenge must be at least 1.5 s old; this keeps the timing out of render code.
function msSince(timestamp: number) {
  return Date.now() - timestamp;
}

const FIELD =
  "w-full border-0 border-b border-white/30 bg-transparent py-3 font-sans text-[15px] text-white outline-none placeholder:text-[#9c9892] focus:border-white";

/**
 * Newsletter sign-up in the footer. Sends to /api/newsletter, which passes it to n8n;
 * n8n sends the confirmation mail (double opt-in). `consent` is the wording stored as proof.
 */
export default function NewsletterSignup({ consent, headingClass }: { consent: string; headingClass: string }) {
  const locale = useLocale();
  const ui = UI[locale];
  const baseId = useId();
  const challenge = useRef<Promise<{ token: string; at: number }> | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  function started() {
    if (!challenge.current) {
      challenge.current = fetchChallenge().then((token) => ({ token, at: Date.now() }));
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    if (!/^[^\s@<>"]+@[^\s@<>"]+\.[a-z]{2,}$/i.test(email)) {
      setError(ui.errEmail);
      document.getElementById(`${baseId}-email`)?.focus();
      return;
    }
    if (form.get("consent") !== "on") {
      setError(ui.errConsent);
      document.getElementById(`${baseId}-consent`)?.focus();
      return;
    }

    setStatus("sending");
    setError("");
    try {
      started();
      // One token per send: a retry gets a fresh one.
      const pending = challenge.current!;
      challenge.current = null;
      const { token, at } = await pending;
      const wait = 1600 - msSince(at);
      if (wait > 0) await new Promise((resolve) => window.setTimeout(resolve, wait));
      const response = await fetch("/api/newsletter", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          challenge: token,
          company_website: String(form.get("company_website") ?? ""),
          email,
          vorname: String(form.get("vorname") ?? ""),
          consent: true,
          locale,
          page: window.location.pathname,
        }),
      });
      const payload: unknown = await response.json().catch(() => null);
      const ok = response.ok && payload && typeof payload === "object" && "ok" in payload && payload.ok === true;
      if (!ok) {
        setStatus("error");
        setError(response.status === 400 && payload && typeof payload === "object" && "error" in payload && payload.error === "invalid_email" ? ui.errEmail : ui.errSend);
        return;
      }
      setStatus("done");
    } catch {
      setStatus("error");
      setError(ui.errSend);
    }
  }

  return (
    <section aria-labelledby={`${baseId}-title`} className="grid gap-8 md:grid-cols-12 md:gap-10">
      <div className="md:col-span-5">
        <h2 id={`${baseId}-title`} className={`${headingClass} uppercase`}>
          {ui.title}
        </h2>
        <p className="mt-4 max-w-sm text-[15px] leading-7 text-[#e4e0d8]">{ui.text}</p>
      </div>
      {status === "done" ? (
        <div role="status" className="md:col-span-7">
          <p className="font-serif text-[26px] leading-snug text-white">{ui.doneTitle}</p>
          <p className="mt-3 max-w-lg text-[15px] leading-7 text-[#e4e0d8]">{ui.done}</p>
        </div>
      ) : (
        <form onSubmit={submit} onFocus={started} noValidate className="relative md:col-span-7">
          {/* Honeypot for bots; hidden from people and screen readers. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label>
              Website
              <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`${baseId}-email`} className="text-[13px] text-[#9c9892]">
                {ui.email}
              </label>
              <input id={`${baseId}-email`} name="email" type="email" required autoComplete="email" className={FIELD} />
            </div>
            <div>
              <label htmlFor={`${baseId}-name`} className="text-[13px] text-[#9c9892]">
                {ui.name}
              </label>
              <input id={`${baseId}-name`} name="vorname" type="text" autoComplete="given-name" maxLength={60} className={FIELD} />
            </div>
          </div>
          <label htmlFor={`${baseId}-consent`} className="mt-5 flex gap-3 text-[13px] leading-6 text-[#c9c4bb]">
            <input id={`${baseId}-consent`} name="consent" type="checkbox" required className="mt-1 h-4 w-4 shrink-0 accent-[#c2a483]" />
            <span>
              {consent}{" "}
              {ui.privacy}{" "}
              <LocaleLink href="/datenschutz" className="underline underline-offset-4 hover:text-white">
                {ui.privacyLink}
              </LocaleLink>
              .
            </span>
          </label>
          <p role="alert" className="mt-3 min-h-5 text-[13px] text-[#f0a8a0]">
            {error}
          </p>
          <button
            type="submit"
            disabled={status === "sending"}
            className="mt-2 inline-flex min-h-11 items-center border border-white/70 px-6 font-sans text-[14px] text-white transition-colors hover:bg-white hover:text-nacht disabled:opacity-60"
          >
            {status === "sending" ? ui.sending : ui.submit}
          </button>
        </form>
      )}
    </section>
  );
}
