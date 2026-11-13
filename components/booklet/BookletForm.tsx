"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useId, useRef, useState } from "react";
import LocaleLink from "@/components/LocaleLink";
import { useLocale } from "@/components/LocaleProvider";
import { pushDataLayer, track } from "@/lib/analytics";
import { validateBooklet, wantsPrint, type BookletDelivery, type BookletField } from "@/lib/booklet-fields";
import { hasConsent } from "@/lib/consent-state";
import { conversionContext } from "@/lib/conversion";
import { hashedUserData } from "@/lib/hash";
import { withLocale } from "@/lib/i18n";
import { NEWSLETTER_CONSENT } from "@/lib/newsletter";
import { cn } from "@/lib/utils";

const UI = {
  step1: "Schritt 1",
  step2: "Schritt 2",
  step2Title: "Ihre Angaben",
  options: {
    digital: { title: "Digital", note: "Sofort als PDF, dazu per E-Mail" },
    print: { title: "Gedruckt", note: "Per Post in 4–5 Tagen" },
    both: { title: "Digital & gedruckt", note: "Sofort als PDF und per Post" },
  } satisfies Record<BookletDelivery, { title: string; note: string }>,
  salutation: "Anrede",
  salutations: { "": "Bitte wählen (freiwillig)", frau: "Frau", herr: "Herr", divers: "Divers / keine" },
  firstName: "Vorname",
  lastName: "Nachname",
  email: "E-Mail",
  phone: "Telefon (freiwillig)",
  plz: "Postleitzahl",
  street: "Straße und Hausnummer",
  city: "Ort",
  required: "Pflichtfeld",
  addressTitle: "Wohin dürfen wir das Booklet schicken?",
  outside: "Gedruckt schicken wir nur nach Bayern und Baden-Württemberg. Digital bekommen Sie das Booklet sofort.",
  switchDigital: "Digital anfordern",
  newsletterOptional: "(freiwillig)",
  privacy: "Ihre Angaben nutzen wir nur, um Ihnen das Booklet zu schicken. Mehr in der",
  privacyLink: "Datenschutzerklärung",
  submit: "Booklet anfordern",
  sending: "Wird gesendet …",
  errors: {
    invalid_delivery: "Bitte wählen Sie, wie Sie das Booklet erhalten möchten.",
    invalid_name: "Bitte geben Sie Ihren Vor- und Nachnamen an.",
    invalid_email: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
    invalid_phone: "Bitte prüfen Sie die Telefonnummer.",
    invalid_plz: "Bitte geben Sie eine fünfstellige Postleitzahl ein.",
    outside_print_region: "Gedruckt schicken wir nur nach Bayern und Baden-Württemberg.",
    invalid_street: "Bitte geben Sie Straße und Hausnummer an.",
    invalid_city: "Bitte geben Sie den Ort an.",
    rate_limited: "Zu viele Versuche. Bitte versuchen Sie es in ein paar Minuten noch einmal.",
    send: "Das hat leider nicht geklappt. Bitte versuchen Sie es später noch einmal oder rufen Sie uns an.",
  },
} as const;

type Fields = {
  salutation: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  plz: string;
  street: string;
  city: string;
};

const EMPTY: Fields = { salutation: "", firstName: "", lastName: "", email: "", phone: "", plz: "", street: "", city: "" };

const FIELD_INPUT =
  "mt-0.5 w-full border-0 border-b border-line bg-transparent py-2 font-sans text-[16px] text-ink outline-none focus:border-ink aria-[invalid=true]:border-destructive";

async function fetchChallenge() {
  const response = await fetch("/api/lead/challenge", { method: "GET", credentials: "same-origin", cache: "no-store" });
  if (!response.ok) return "";
  const data: unknown = await response.json().catch(() => null);
  return data && typeof data === "object" && "challenge" in data && typeof data.challenge === "string" ? data.challenge : "";
}

function msSince(timestamp: number) {
  return Date.now() - timestamp;
}

// The postcode table is only needed once print is picked, so it loads then.
let regionCheck: Promise<(plz: string) => boolean> | null = null;
function loadRegionCheck() {
  regionCheck ??= import("@/lib/plz-region").then((module) => module.inPrintRegion);
  return regionCheck;
}

const meta = (extra?: Record<string, string>) => ({ form: "booklet", ...extra });

/**
 * Booklet request: digital, printed or both (print only to Bavaria and Baden-Württemberg).
 * Sends to /api/booklet; on success the visitor lands on the booklet's own thank-you page.
 */
export default function BookletForm({ slug, title, printNote }: { slug: string; title: string; printNote: string }) {
  const locale = useLocale();
  const router = useRouter();
  const baseId = useId();
  const challenge = useRef<Promise<{ token: string; at: number }> | null>(null);
  const started = useRef(false);
  const [delivery, setDelivery] = useState<BookletDelivery | "">("");
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [newsletter, setNewsletter] = useState(false);
  const [region, setRegion] = useState<{ plz: string; inside: boolean } | null>(null);
  const [status, setStatus] = useState<"idle" | "sending">("idle");
  const [error, setError] = useState<{ field?: BookletField; text: string } | null>(null);

  const print = delivery !== "" && wantsPrint(delivery);

  useEffect(() => {
    track("form_view", meta());
  }, []);

  // Print outside BY/BW: say so as soon as the postcode is complete, not only on send.
  const plzComplete = /^\d{5}$/.test(fields.plz);
  useEffect(() => {
    if (!print || !plzComplete) return;
    let current = true;
    const plz = fields.plz;
    loadRegionCheck().then((check) => {
      if (current) setRegion({ plz, inside: check(plz) });
    });
    return () => {
      current = false;
    };
  }, [print, plzComplete, fields.plz]);
  const outside = print && plzComplete && region?.plz === fields.plz && !region.inside;

  function begin() {
    if (!challenge.current) {
      challenge.current = fetchChallenge().then((token) => ({ token, at: Date.now() }));
    }
    if (!started.current) {
      started.current = true;
      track("form_start", meta());
    }
  }

  function set(field: keyof Fields, value: string) {
    begin();
    setFields((current) => ({ ...current, [field]: value }));
    if (error?.field === field) setError(null);
  }

  function pick(value: BookletDelivery) {
    begin();
    setDelivery(value);
    if (wantsPrint(value)) loadRegionCheck();
    if (error?.field === "delivery") setError(null);
    track("form_step", meta({ step: `versand_${value}` }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const input = {
      delivery,
      salutation: fields.salutation,
      first_name: fields.firstName,
      last_name: fields.lastName,
      email: fields.email,
      phone: fields.phone,
      plz: fields.plz,
      street: fields.street,
      city: fields.city,
    };
    const check = print ? await loadRegionCheck() : () => true;
    const valid = validateBooklet(input, check);
    if (!valid.ok) {
      setError({ field: valid.field, text: UI.errors[valid.reason] });
      track("form_error", meta({ reason: valid.reason }));
      document.getElementById(`${baseId}-${valid.field}`)?.focus();
      return;
    }

    setStatus("sending");
    setError(null);
    track("form_attempt", meta({ delivery: valid.request.delivery }));
    try {
      begin();
      const pending = challenge.current!;
      challenge.current = null;
      const { token, at } = await pending;
      const wait = 1600 - msSince(at);
      if (wait > 0) await new Promise((resolve) => window.setTimeout(resolve, wait));
      const context = conversionContext();
      const response = await fetch("/api/booklet", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...input,
          challenge: token,
          company_website: String(form.get("company_website") ?? ""),
          booklet: slug,
          newsletter: newsletter || undefined,
          locale,
          ...context,
        }),
      });
      const payload: unknown = await response.json().catch(() => null);
      const ok = response.ok && payload && typeof payload === "object" && "ok" in payload && payload.ok === true;
      if (!ok) {
        const reason = payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string" ? payload.error : "";
        const text =
          reason in UI.errors ? UI.errors[reason as keyof typeof UI.errors] : response.status === 429 ? UI.errors.rate_limited : UI.errors.send;
        setError({ text });
        setStatus("idle");
        track("form_error", meta({ reason: reason || `status_${response.status}` }));
        return;
      }
      const eventId = payload && typeof payload === "object" && "event_id" in payload && typeof payload.event_id === "string" ? payload.event_id : context.event_id;
      track("form_submit", meta({ delivery: valid.request.delivery }));
      // The conversion: "katalog_order" (contract name) and the shared lead event.
      const entry: Record<string, unknown> = { event: "katalog_order", event_id: eventId, form: "booklet", booklet: slug, delivery: valid.request.delivery };
      pushDataLayer(entry);
      const lead: Record<string, unknown> = { event: "generate_lead", event_id: eventId, form: "booklet" };
      if (hasConsent("marketing")) {
        lead.user_data = await hashedUserData({ email: valid.request.email, phone: valid.request.phone, place: valid.request.plz });
      }
      pushDataLayer(lead);
      router.push(withLocale(`/${slug}/danke?versand=${valid.request.delivery}`, locale));
    } catch {
      setStatus("idle");
      setError({ text: UI.errors.send });
      track("form_error", meta({ reason: "network" }));
    }
  }

  const invalid = (field: BookletField) => (error?.field === field ? true : undefined);

  return (
    <form onSubmit={submit} onFocus={begin} noValidate className="relative" aria-describedby={`${baseId}-error`}>
      {/* Honeypot for bots; hidden from people and screen readers. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <fieldset>
        <legend className="w-full">
          <span className="type-eyebrow text-gold">{UI.step1}</span>
          <span className="mt-2 block font-serif text-[26px] leading-tight text-ink sm:text-[30px]">{title}</span>
        </legend>
        <div id={`${baseId}-delivery`} tabIndex={-1} className="mt-5 grid gap-2.5 sm:grid-cols-3">
          {(Object.keys(UI.options) as BookletDelivery[]).map((value) => (
            <label
              key={value}
              className={cn(
                "flex min-h-24 cursor-pointer flex-col justify-center border bg-paper px-4 py-3 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink",
                delivery === value ? "border-ink bg-karte" : "border-line hover:border-ink/50",
              )}
            >
              <input type="radio" name="delivery" value={value} checked={delivery === value} onChange={() => pick(value)} className="sr-only" />
              <span className="font-serif text-[20px] leading-tight text-ink">{UI.options[value].title}</span>
              <span className="mt-1 font-sans text-[13px] leading-5 text-muted">{UI.options[value].note}</span>
            </label>
          ))}
        </div>
        {print ? <p className="mt-3 font-sans text-[13px] leading-5 text-muted">{printNote}</p> : null}
      </fieldset>

      <fieldset className="mt-10">
        <legend className="w-full">
          <span className="type-eyebrow text-gold">{UI.step2}</span>
          <span className="mt-2 block font-serif text-[26px] leading-tight text-ink sm:text-[30px]">{UI.step2Title}</span>
        </legend>
        <div className="mt-4 grid gap-x-7 gap-y-4 sm:grid-cols-2">
          <div className="sm:col-span-2 sm:max-w-[calc(50%-0.875rem)]">
            <label htmlFor={`${baseId}-salutation`} className="font-sans text-[13px] text-muted">
              {UI.salutation}
            </label>
            <select
              id={`${baseId}-salutation`}
              value={fields.salutation}
              onChange={(event) => set("salutation", event.target.value)}
              autoComplete="honorific-prefix"
              className={FIELD_INPUT}
            >
              {Object.entries(UI.salutations).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <Field id={`${baseId}-firstName`} label={UI.firstName} required autoComplete="given-name" value={fields.firstName} invalid={invalid("firstName")} onChange={(value) => set("firstName", value)} />
          <Field id={`${baseId}-lastName`} label={UI.lastName} required autoComplete="family-name" value={fields.lastName} invalid={invalid("lastName")} onChange={(value) => set("lastName", value)} />
          <Field id={`${baseId}-email`} label={UI.email} required type="email" autoComplete="email" value={fields.email} invalid={invalid("email")} onChange={(value) => set("email", value)} />
          <Field id={`${baseId}-phone`} label={UI.phone} type="tel" autoComplete="tel" value={fields.phone} invalid={invalid("phone")} onChange={(value) => set("phone", value)} />
          <Field
            id={`${baseId}-plz`}
            label={UI.plz}
            required
            inputMode="numeric"
            maxLength={5}
            autoComplete="postal-code"
            value={fields.plz}
            invalid={invalid("plz") ?? (outside || undefined)}
            onChange={(value) => set("plz", value.replace(/\D/g, "").slice(0, 5))}
          />
        </div>

        {print && outside ? (
          <div role="status" className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 bg-karte px-4 py-3 font-sans text-[14px] leading-6 text-ink">
            <span>{UI.outside}</span>
            <button type="button" onClick={() => pick("digital")} className="underline underline-offset-4 hover:text-gold">
              {UI.switchDigital}
            </button>
          </div>
        ) : null}

        {print && !outside ? (
          <div className="mt-6">
            <p className="font-serif text-[20px] leading-tight text-ink">{UI.addressTitle}</p>
            <div className="mt-3 grid gap-x-7 gap-y-4 sm:grid-cols-2">
              <Field id={`${baseId}-street`} label={UI.street} required autoComplete="street-address" value={fields.street} invalid={invalid("street")} onChange={(value) => set("street", value)} />
              <Field id={`${baseId}-city`} label={UI.city} required autoComplete="address-level2" value={fields.city} invalid={invalid("city")} onChange={(value) => set("city", value)} />
            </div>
          </div>
        ) : null}
      </fieldset>

      <label htmlFor={`${baseId}-newsletter`} className="mt-8 flex gap-3 font-sans text-[13px] leading-5 text-muted">
        <input
          id={`${baseId}-newsletter`}
          type="checkbox"
          checked={newsletter}
          onChange={(event) => setNewsletter(event.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[#1d1d1b]"
        />
        <span>
          {NEWSLETTER_CONSENT[locale]} {UI.newsletterOptional}
        </span>
      </label>
      <p className="mt-3 font-sans text-[13px] leading-5 text-muted">
        {UI.privacy}{" "}
        <LocaleLink href="/datenschutz" className="underline underline-offset-4 hover:text-ink">
          {UI.privacyLink}
        </LocaleLink>
        .
      </p>

      <p id={`${baseId}-error`} role="alert" className="mt-5 font-sans text-[14px] text-destructive empty:hidden">
        {error?.text}
      </p>
      <button type="submit" disabled={status === "sending" || (print && outside)} className="pill pill-primary mt-5 disabled:opacity-50">
        {status === "sending" ? UI.sending : UI.submit}
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  required = false,
  type = "text",
  autoComplete,
  inputMode,
  maxLength,
  value,
  invalid,
  onChange,
}: {
  id: string;
  label: string;
  required?: boolean;
  type?: string;
  autoComplete: string;
  inputMode?: "numeric";
  maxLength?: number;
  value: string;
  invalid?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="font-sans text-[13px] text-muted">
        {label}
        {required ? (
          <>
            <span aria-hidden="true"> *</span>
            <span className="sr-only"> ({UI.required})</span>
          </>
        ) : null}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        required={required}
        aria-required={required}
        aria-invalid={invalid}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={FIELD_INPUT}
      />
    </div>
  );
}
