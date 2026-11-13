"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import LocaleLink from "@/components/LocaleLink";
import { conversionContext } from "@/lib/conversion";
import { MAIN_ACTIONS } from "@/lib/cta";
import { trackLead } from "@/lib/form-tracking";
import type { Locale } from "@/lib/i18n";
import { validateLeadFields } from "@/lib/lead-fields";

/**
 * The short way to BEER: name, phone, mail and a wish for the day. It sends to the same
 * endpoint as the kitchen planner, marked as an appointment request, so it reaches the team
 * the same way but without planner answers.
 */

type Status = "idle" | "sending" | "done" | "error";

const UI: Record<Locale, Record<string, string>> = {
  de: {
    eyebrow: "Termin",
    title: "Termin vereinbaren",
    text: "Schreiben Sie uns, wann es Ihnen passt. Wir melden uns bei Ihnen und stimmen den Termin ab.",
    call: "Oder rufen Sie an:",
    phoneLabel: "08168 909910",
    planner: "Erst Ideen sammeln? Zum Küchenplaner",
    name: "Name",
    phone: "Telefon",
    email: "E-Mail",
    wish: "Wann passt es Ihnen?",
    wishPlaceholder: "z. B. Samstagvormittag",
    message: "Worum geht es? (freiwillig)",
    required: "Pflichtfeld",
    privacy: "Ihre Angaben verwenden wir, um Ihre Anfrage zu beantworten.",
    privacyLink: "Datenschutz",
    submit: "Termin anfragen",
    sending: "Wird gesendet …",
    doneTitle: "Danke, {name}.",
    doneText: "Ihre Anfrage ist bei uns. Wir melden uns bei Ihnen.",
    errName: "Bitte Ihren Namen angeben.",
    errEmail: "Bitte eine gültige E-Mail-Adresse angeben.",
    errPhone: "Bitte eine Telefonnummer angeben.",
    errMessage: "Bitte die Nachricht kürzen (höchstens zwei Links).",
    errSend: "Das hat leider nicht geklappt. Bitte versuchen Sie es noch einmal oder rufen Sie uns an: 08168 909910.",
  },
  en: {
    eyebrow: "Appointment",
    title: "Book an appointment",
    text: "Tell us when it suits you. We will get back to you and agree on the time.",
    call: "Or call us:",
    phoneLabel: "+49 8168 909910",
    planner: "Collect ideas first? To the kitchen planner",
    name: "Name",
    phone: "Phone",
    email: "Email",
    wish: "When does it suit you?",
    wishPlaceholder: "e.g. Saturday morning",
    message: "What is it about? (optional)",
    required: "required",
    privacy: "We use your details to answer your request.",
    privacyLink: "Privacy",
    submit: "Request an appointment",
    sending: "Sending …",
    doneTitle: "Thank you, {name}.",
    doneText: "We have your request and will get back to you.",
    errName: "Please enter your name.",
    errEmail: "Please enter a valid email address.",
    errPhone: "Please enter a phone number.",
    errMessage: "Please shorten your message (two links at most).",
    errSend: "That did not work, sorry. Please try again or call us: +49 8168 909910.",
  },
};

async function fetchChallenge() {
  const response = await fetch("/api/lead/challenge", { method: "GET", credentials: "same-origin", cache: "no-store" });
  if (!response.ok) return "";
  const data: unknown = await response.json().catch(() => null);
  return data && typeof data === "object" && "challenge" in data && typeof data.challenge === "string" ? data.challenge : "";
}

export default function AppointmentForm({ locale }: { locale: Locale }) {
  const ui = UI[locale];
  const baseId = useId();
  const doneHeading = useRef<HTMLHeadingElement>(null);
  const loadedAt = useRef(0);
  const [fields, setFields] = useState({ name: "", phone: "", email: "", wish: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [challenge, setChallenge] = useState("");

  // The lead endpoint wants a challenge that is at least 1.5 s old; fetch it once the form is on the page.
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const token = await fetchChallenge().catch(() => "");
      if (cancelled) return;
      loadedAt.current = Date.now();
      setChallenge(token);
    };
    void load();
    const timer = window.setInterval(() => void load(), 8 * 60 * 1000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (status === "done") doneHeading.current?.focus();
  }, [status]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const honeypot = String(new FormData(event.currentTarget).get("company_website") ?? "");
    const checked = honeypot ? ({ ok: true, name: "", email: "", phone: "", message: "" } as const) : validateLeadFields(fields);
    if (!checked.ok) {
      const messages = { invalid_name: ui.errName, invalid_email: ui.errEmail, invalid_phone: ui.errPhone, invalid_message: ui.errMessage };
      setError(messages[checked.reason]);
      document.getElementById(`${baseId}-${checked.field}`)?.focus();
      return;
    }

    setStatus("sending");
    setError("");
    try {
      let token = challenge;
      if (!token) {
        token = await fetchChallenge();
        loadedAt.current = Date.now();
        setChallenge(token);
      }
      const wait = 1600 - (Date.now() - loadedAt.current);
      if (wait > 0) await new Promise((resolve) => window.setTimeout(resolve, wait));

      const response = await fetch("/api/lead", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          form: "termin",
          challenge: token,
          company_website: honeypot,
          name: checked.name,
          email: checked.email,
          phone: checked.phone,
          message: checked.message,
          wish: fields.wish,
          locale,
          ...conversionContext(),
        }),
      });
      const payload: unknown = await response.json().catch(() => null);
      const ok = response.ok && payload && typeof payload === "object" && "ok" in payload && payload.ok === true;
      if (!ok && !honeypot) {
        setStatus("error");
        setError(ui.errSend);
        return;
      }
      if (!honeypot) {
        const eventId = payload && typeof payload === "object" && "event_id" in payload && typeof payload.event_id === "string" ? payload.event_id : "";
        void trackLead(eventId, { email: checked.email, phone: checked.phone, place: "" }, "termin");
      }
      setStatus("done");
      setChallenge("");
    } catch {
      setStatus("error");
      setError(ui.errSend);
    }
  }

  const input = "mt-0.5 w-full border-0 border-b border-line bg-transparent py-2 font-sans text-[16px] text-ink outline-none placeholder:text-muted focus:border-ink";
  const label = "font-sans text-[13px] text-muted";
  const field = (key: "name" | "phone" | "email", type: string, autoComplete: string) => (
    <div>
      <label htmlFor={`${baseId}-${key}`} className={label}>
        {ui[key]}
        <span aria-hidden="true"> *</span>
        <span className="sr-only"> ({ui.required})</span>
      </label>
      <input
        id={`${baseId}-${key}`}
        type={type}
        autoComplete={autoComplete}
        required
        aria-required
        value={fields[key]}
        onChange={(event) => setFields((current) => ({ ...current, [key]: event.target.value }))}
        className={input}
      />
    </div>
  );

  return (
    <section id="termin" className="scroll-mt-20 bg-karte px-5 py-16 sm:px-8 md:py-24 lg:px-gutter" aria-labelledby={`${baseId}-title`}>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="type-eyebrow text-gold">{ui.eyebrow}</p>
          <h2 id={`${baseId}-title`} className="t-section mt-4 text-ink">
            {ui.title}
          </h2>
          <p className="mt-5 max-w-md font-sans text-[16px] leading-[1.7] font-light text-ink/85">{ui.text}</p>
          <p className="mt-6 font-sans text-[16px] text-ink">
            {ui.call}{" "}
            <a href="tel:+498168909910" className="whitespace-nowrap underline underline-offset-4" data-umami-event="tel_click">
              {ui.phoneLabel}
            </a>
          </p>
          <LocaleLink href={MAIN_ACTIONS.planner.href} className="btn-quiet mt-6" data-umami-event="cta_planner" data-umami-event-placement="termin_form">
            {ui.planner}
          </LocaleLink>
        </div>

        <div className="bg-paper px-6 py-8 sm:px-10 sm:py-10 lg:col-span-7">
          {status === "done" ? (
            <div className="py-10 text-center">
              <div aria-hidden="true" className="mx-auto mb-7 h-px w-14 bg-messing" />
              <h3 ref={doneHeading} tabIndex={-1} className="t-feature text-ink outline-none">
                {ui.doneTitle.replace("{name}", fields.name.trim().split(/\s+/)[0] ?? "")}
              </h3>
              <p className="mx-auto mt-4 max-w-md font-sans text-[16px] leading-[1.7] font-light text-ink/85">{ui.doneText}</p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="relative">
              {/* Honeypot for bots; hidden from people and screen readers. */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label>
                  Website
                  <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>
              <div className="grid gap-x-7 gap-y-5 sm:grid-cols-2">
                {field("name", "text", "name")}
                {field("phone", "tel", "tel")}
                {field("email", "email", "email")}
                <div>
                  <label htmlFor={`${baseId}-wish`} className={label}>
                    {ui.wish}
                  </label>
                  <input
                    id={`${baseId}-wish`}
                    type="text"
                    maxLength={160}
                    placeholder={ui.wishPlaceholder}
                    value={fields.wish}
                    onChange={(event) => setFields((current) => ({ ...current, wish: event.target.value }))}
                    className={input}
                  />
                </div>
              </div>
              <div className="mt-5">
                <label htmlFor={`${baseId}-message`} className={label}>
                  {ui.message}
                </label>
                <textarea
                  id={`${baseId}-message`}
                  rows={2}
                  value={fields.message}
                  onChange={(event) => setFields((current) => ({ ...current, message: event.target.value }))}
                  className={`${input} max-h-40 resize-y [field-sizing:content]`}
                />
              </div>
              <p role="alert" className="mt-4 font-sans text-[14px] text-destructive empty:hidden">
                {error}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-4">
                <button type="submit" disabled={status === "sending"} className="pill pill-primary" data-umami-event="termin_submit">
                  {status === "sending" ? ui.sending : ui.submit}
                </button>
                <p className="max-w-xs font-sans text-[13px] leading-5 text-muted">
                  {ui.privacy}{" "}
                  <LocaleLink href="/datenschutz" className="underline underline-offset-4 hover:text-ink">
                    {ui.privacyLink}
                  </LocaleLink>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
