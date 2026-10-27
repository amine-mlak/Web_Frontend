"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import LocaleLink from "@/components/LocaleLink";
import { useLocale } from "@/components/LocaleProvider";
import { validateLeadFields } from "@/lib/lead-fields";

export const INITIATIVE = "initiativ";

const UI = {
  de: {
    job: "Stelle",
    initiative: "Initiativbewerbung",
    name: "Name",
    email: "E-Mail",
    phone: "Telefon",
    start: "Frühester Start (optional)",
    startHint: "z. B. September 2027 oder ab sofort",
    message: "Erzähl kurz von Dir (optional)",
    messageHint: "Was Du bisher gemacht hast und was Dich an der Werkstatt reizt.",
    papers: "Lebenslauf und Zeugnisse kannst Du danach an bewerbung@beer.de schicken – oder Du bringst sie zum Gespräch mit.",
    privacy: "Wir nutzen Deine Angaben nur für Deine Bewerbung. Mehr dazu in der",
    privacyLink: "Datenschutzerklärung",
    submit: "Bewerbung senden",
    sending: "Wird gesendet …",
    done: "Danke! Deine Bewerbung ist bei uns. Wir melden uns bei Dir.",
    errName: "Bitte gib Deinen Namen an.",
    errEmail: "Bitte prüfe Deine E-Mail-Adresse.",
    errPhone: "Bitte gib eine Telefonnummer an, unter der wir Dich erreichen.",
    errMessage: "Bitte schreib Deine Nachricht ohne so viele Links.",
    errSend: "Das Senden hat nicht geklappt. Schreib uns bitte an bewerbung@beer.de oder ruf an: +49 8168 99 69 61.",
  },
  en: {
    job: "Position",
    initiative: "Speculative application",
    name: "Name",
    email: "Email",
    phone: "Phone",
    start: "Earliest start (optional)",
    startHint: "e.g. September 2027 or right away",
    message: "Tell us a little about yourself (optional)",
    messageHint: "What you have done so far and what draws you to the workshop.",
    papers: "You can send your CV and references to bewerbung@beer.de afterwards – or bring them to the interview.",
    privacy: "We only use your details for your application. More in our",
    privacyLink: "privacy policy",
    submit: "Send application",
    sending: "Sending …",
    done: "Thank you! Your application has reached us. We will get in touch.",
    errName: "Please enter your name.",
    errEmail: "Please check your email address.",
    errPhone: "Please enter a phone number we can reach you on.",
    errMessage: "Please send your message with fewer links.",
    errSend: "Sending did not work. Please write to bewerbung@beer.de or call +49 8168 99 69 61.",
  },
} as const;

const FIELD = "w-full border-0 border-b border-line bg-transparent py-3 font-sans text-[16px] text-ink outline-none placeholder:text-muted focus:border-ink";
const LABEL = "font-sans text-[13px] text-muted";

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

/** Application form for the Karriere pages; sends to /api/bewerbung, which passes it to n8n. */
export default function ApplicationForm({
  jobs,
  selected = INITIATIVE,
}: {
  jobs: { slug: string; title: string }[];
  selected?: string;
}) {
  const locale = useLocale();
  const ui = UI[locale];
  const baseId = useId();
  // The signed challenge is fetched when someone starts filling in the form; the server only
  // accepts it once it is 1.5 s old, which a person typing always exceeds.
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
    const value = (name: string) => String(form.get(name) ?? "");
    const fields = validateLeadFields({ name: value("name"), email: value("email"), phone: value("phone"), message: value("message") });
    if (!fields.ok) {
      const messages = { invalid_name: ui.errName, invalid_email: ui.errEmail, invalid_phone: ui.errPhone, invalid_message: ui.errMessage };
      setError(messages[fields.reason]);
      document.getElementById(`${baseId}-${fields.field}`)?.focus();
      return;
    }
    const jobSlug = value("job");
    const job = jobs.find((item) => item.slug === jobSlug);

    setStatus("sending");
    setError("");
    try {
      started();
      // One token per send: a retry (also after a failed fetch) gets a fresh one.
      const pending = challenge.current!;
      challenge.current = null;
      const { token, at } = await pending;
      const wait = 1600 - msSince(at);
      if (wait > 0) await new Promise((resolve) => window.setTimeout(resolve, wait));
      const response = await fetch("/api/bewerbung", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          challenge: token,
          company_website: value("company_website"),
          job_slug: job ? job.slug : INITIATIVE,
          job_title: job ? job.title : ui.initiative,
          name: fields.name,
          email: fields.email,
          phone: fields.phone,
          start: value("start"),
          message: fields.message,
          page: window.location.pathname,
        }),
      });
      const payload: unknown = await response.json().catch(() => null);
      const ok = response.ok && payload && typeof payload === "object" && "ok" in payload && payload.ok === true;
      if (!ok) {
        setStatus("error");
        setError(ui.errSend);
        return;
      }
      setStatus("done");
    } catch {
      setStatus("error");
      setError(ui.errSend);
    }
  }

  if (status === "done") {
    return (
      <p role="status" className="max-w-xl font-serif text-[26px] leading-snug text-ink">
        {ui.done}
      </p>
    );
  }

  return (
    <form onSubmit={submit} onFocus={started} noValidate className="grid max-w-2xl gap-7">
      <div>
        <label htmlFor={`${baseId}-job`} className={LABEL}>
          {ui.job}
        </label>
        <select id={`${baseId}-job`} name="job" defaultValue={selected} className={FIELD}>
          {jobs.map((job) => (
            <option key={job.slug} value={job.slug}>
              {job.title}
            </option>
          ))}
          <option value={INITIATIVE}>{ui.initiative}</option>
        </select>
      </div>
      <div className="grid gap-7 sm:grid-cols-2">
        <div>
          <label htmlFor={`${baseId}-name`} className={LABEL}>
            {ui.name}
          </label>
          <input id={`${baseId}-name`} name="name" autoComplete="name" required maxLength={80} className={FIELD} />
        </div>
        <div>
          <label htmlFor={`${baseId}-phone`} className={LABEL}>
            {ui.phone}
          </label>
          <input id={`${baseId}-phone`} name="phone" type="tel" autoComplete="tel" required maxLength={40} className={FIELD} />
        </div>
      </div>
      <div className="grid gap-7 sm:grid-cols-2">
        <div>
          <label htmlFor={`${baseId}-email`} className={LABEL}>
            {ui.email}
          </label>
          <input id={`${baseId}-email`} name="email" type="email" autoComplete="email" required maxLength={120} className={FIELD} />
        </div>
        <div>
          <label htmlFor={`${baseId}-start`} className={LABEL}>
            {ui.start}
          </label>
          <input id={`${baseId}-start`} name="start" maxLength={60} placeholder={ui.startHint} className={FIELD} />
        </div>
      </div>
      <div>
        <label htmlFor={`${baseId}-message`} className={LABEL}>
          {ui.message}
        </label>
        <textarea id={`${baseId}-message`} name="message" rows={4} maxLength={2000} placeholder={ui.messageHint} className={`${FIELD} resize-y`} />
      </div>
      {/* Left empty by people; bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${baseId}-website`}>Website</label>
        <input id={`${baseId}-website`} name="company_website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="space-y-2 font-sans text-[14px] leading-relaxed text-muted">
        <p>{ui.papers}</p>
        <p>
          {ui.privacy}{" "}
          <LocaleLink href="/datenschutz" className="underline underline-offset-4 hover:text-ink">
            {ui.privacyLink}
          </LocaleLink>
          .
        </p>
      </div>
      <p role="alert" className="min-h-5 font-sans text-[14px] text-destructive">
        {error}
      </p>
      <div>
        <button type="submit" disabled={status === "sending"} className="pill pill-primary">
          {status === "sending" ? ui.sending : ui.submit}
        </button>
      </div>
    </form>
  );
}
