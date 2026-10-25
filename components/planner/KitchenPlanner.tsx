"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import CmsImage from "@/components/CmsImage";
import LocaleLink from "@/components/LocaleLink";
import { conversionContext } from "@/lib/conversion";
import {
  apiErrorReason,
  trackFormAttempt,
  trackFormError,
  trackFormStart,
  trackFormSubmit,
  trackFormView,
  trackFormWizardStep,
} from "@/lib/form-tracking";
import type { Locale } from "@/lib/i18n";
import {
  PLANNER_GROUPS,
  type PlannerContent,
  type PlannerGroup,
  type PlannerGroupKey,
  type PlannerOption,
} from "@/lib/kitchen-planner-model";
import { validateLeadFields } from "@/lib/lead-fields";
import { cn } from "@/lib/utils";

/**
 * The kitchen planner, one question per screen (after SieMatic's planner):
 * a single-choice answer moves on by itself, multiple choice needs at least
 * one answer before "Weiter", the budget needs a value or "Keine Angabe".
 */

type Status = "idle" | "sending" | "done" | "error";
type Selection = Partial<Record<PlannerGroupKey, string[]>>;
type Screen = { kind: "group"; group: PlannerGroup } | { kind: "budget" } | { kind: "contact" };

const UI: Record<Locale, Record<string, string>> = {
  de: {
    progress: "Frage {n} von {total}",
    back: "Zurück",
    next: "Weiter",
    submit: "Beratung anfragen",
    sending: "Wird gesendet …",
    pickOne: "Bitte wählen Sie mindestens eine Antwort.",
    budgetTitle: "Welchen Rahmen haben Sie sich für Ihre Küche vorgestellt?",
    budgetHint: "Ehrliche Zahlen helfen uns, realistisch zu planen. Alles bleibt unverbindlich.",
    contactTitle: "Wie dürfen wir Sie erreichen?",
    contactHint: "Ihre Antworten bereiten das Gespräch vor. Den Termin vereinbaren wir danach direkt mit Ihnen.",
    summary: "Ihre Auswahl",
    change: "Ändern",
    name: "Name",
    email: "E-Mail",
    phone: "Telefon",
    place: "PLZ / Ort",
    message: "Platz für alles, was Ihnen noch wichtig ist",
    required: "Pflichtfeld",
    noAnswer: "Keine Angabe",
    budgetAbout: "ca.",
    wishes: "Wünsche",
    budget: "Budget",
    errName: "Bitte Ihren Namen angeben.",
    errEmail: "Bitte eine gültige E-Mail-Adresse angeben.",
    errPhone: "Bitte eine Telefonnummer angeben.",
    errMessage: "Bitte die Nachricht kürzen (höchstens zwei Links).",
    errSend: "Das hat leider nicht geklappt. Bitte versuchen Sie es noch einmal oder rufen Sie uns an: 08168 909910.",
  },
  en: {
    progress: "Question {n} of {total}",
    back: "Back",
    next: "Next",
    submit: "Request a consultation",
    sending: "Sending …",
    pickOne: "Please choose at least one answer.",
    budgetTitle: "What budget do you have in mind for your kitchen?",
    budgetHint: "Honest numbers help us plan realistically. Nothing is binding.",
    contactTitle: "How can we reach you?",
    contactHint: "Your answers prepare the conversation. We then arrange the appointment with you directly.",
    summary: "Your choices",
    change: "Change",
    name: "Name",
    email: "Email",
    phone: "Phone",
    place: "Postcode / town",
    message: "Anything else that matters to you",
    required: "required",
    noAnswer: "Not specified",
    budgetAbout: "approx.",
    wishes: "Wishes",
    budget: "Budget",
    errName: "Please enter your name.",
    errEmail: "Please enter a valid email address.",
    errPhone: "Please enter a phone number.",
    errMessage: "Please shorten your message (two links at most).",
    errSend: "That did not work, sorry. Please try again or call us: +49 8168 909910.",
  },
};

// Short names for the summary (the screen headings are full questions).
const SHORT: Record<Locale, Record<PlannerGroupKey, string>> = {
  de: { style: "Stil", front: "Fronten", top: "Arbeitsplatte", griffe: "Griffe", appliances: "Geräte", wishes: "Wünsche", project: "Vorhaben", raum: "Raum", size: "Raumgröße", form: "Küchenform" },
  en: { style: "Style", front: "Fronts", top: "Worktop", griffe: "Handles", appliances: "Appliances", wishes: "Wishes", project: "Project", raum: "Room", size: "Room size", form: "Kitchen shape" },
};

async function fetchChallenge() {
  const response = await fetch("/api/lead/challenge", { method: "GET", credentials: "same-origin", cache: "no-store" });
  if (!response.ok) return "";
  const data: unknown = await response.json().catch(() => null);
  return data && typeof data === "object" && "challenge" in data && typeof data.challenge === "string" ? data.challenge : "";
}

// The lead challenge must be at least 1.5 s old; this keeps the timing out of render code.
function msSince(timestamp: number) {
  return Date.now() - timestamp;
}

/** Slider position 0–100 → euros: 0–50 covers min–mid, 50–100 covers mid–max. */
function budgetAt(position: number, budget: PlannerContent["budget"]) {
  const raw =
    position <= 50
      ? budget.min + ((budget.mid - budget.min) * position) / 50
      : budget.mid + ((budget.max - budget.mid) * (position - 50)) / 50;
  return Math.round(raw / 1000) * 1000;
}

function formatEuros(value: number, locale: Locale, max: number) {
  return `${value.toLocaleString(locale === "en" ? "en-GB" : "de-DE")} €${value >= max ? " +" : ""}`;
}

export default function KitchenPlanner({ content, headingLevel = "h2" }: { content: PlannerContent; headingLevel?: "h1" | "h2" }) {
  const locale = content.locale;
  const ui = UI[locale];
  const Heading = headingLevel;
  const baseId = useId();
  const screenHeading = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const mountedAt = useRef(0);
  const started = useRef(false);
  const seen = useRef(false);
  const tracked = useRef(new Set<string>());
  const moved = useRef(false);
  const advanceTimer = useRef(0);

  // Wishes are an optional note on the appliance screen, not a screen of their own.
  const screens: Screen[] = [
    ...content.groups.filter((group) => group.group !== "wishes" && group.options.length > 0).map((group) => ({ kind: "group" as const, group })),
    { kind: "budget" },
    { kind: "contact" },
  ];
  const wishes = content.groups.find((group) => group.group === "wishes");

  const [index, setIndex] = useState(0);
  const [selection, setSelection] = useState<Selection>({});
  const [notes, setNotes] = useState<{ style: string; form: string; wishes: string }>({ style: "", form: "", wishes: "" });
  const [budgetPos, setBudgetPos] = useState(50);
  const [budgetState, setBudgetState] = useState<"untouched" | "set" | "none">("untouched");
  const [contact, setContact] = useState({ name: "", email: "", phone: "", place: "", message: "" });
  const [error, setError] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [challenge, setChallenge] = useState("");

  const screen = screens[Math.min(index, screens.length - 1)];
  const last = index === screens.length - 1;
  const budgetValue = budgetAt(budgetPos, content.budget);

  useEffect(() => {
    mountedAt.current = Date.now();
    let cancelled = false;
    const load = async () => {
      const token = await fetchChallenge().catch(() => "");
      if (!cancelled) setChallenge(token);
    };
    void load();
    const timer = window.setInterval(() => void load(), 8 * 60 * 1000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
      window.clearTimeout(advanceTimer.current);
    };
  }, []);

  useEffect(() => {
    const node = formRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (seen.current || !entries.some((entry) => entry.isIntersecting)) return;
        seen.current = true;
        trackFormView();
        observer.disconnect();
      },
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // After moving on, bring the question into view and move focus to it.
  useEffect(() => {
    if (!moved.current) return;
    screenHeading.current?.focus({ preventScroll: true });
    const top = (formRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 96;
    if (Math.abs(window.scrollY - top) > 40) window.scrollTo({ top, behavior: "smooth" });
  }, [index, status]);

  function screenKey(item: Screen) {
    return item.kind === "group" ? item.group.group : item.kind;
  }

  function markStart() {
    if (started.current) return;
    started.current = true;
    trackFormStart(screenKey(screen));
  }

  function answered(item: Screen) {
    if (item.kind === "group") return (selection[item.group.group] ?? []).length > 0;
    if (item.kind === "budget") return budgetState !== "untouched";
    return true;
  }

  function goTo(next: number) {
    window.clearTimeout(advanceTimer.current);
    if (next > index) {
      if (!answered(screen)) {
        setError(ui.pickOne);
        trackFormError("invalid_choice", screenKey(screen));
        return;
      }
      if (!tracked.current.has(screenKey(screen))) {
        tracked.current.add(screenKey(screen));
        trackFormWizardStep(screenKey(screen));
      }
    }
    moved.current = true;
    setError("");
    setStatus((current) => (current === "error" ? "idle" : current));
    setIndex(Math.max(0, Math.min(next, screens.length - 1)));
  }

  function choose(group: PlannerGroup, option: PlannerOption) {
    markStart();
    setError("");
    const multi = PLANNER_GROUPS[group.group].multi;
    const picked = selection[group.group] ?? [];
    const has = picked.includes(option.value);
    const next = multi
      ? has ? picked.filter((value) => value !== option.value) : [...picked, option.value]
      : [option.value];
    setSelection((current) => ({ ...current, [group.group]: next }));
    // Single choice moves on by itself, unless the answer opens a text field.
    if (!multi && !option.freeText) {
      window.clearTimeout(advanceTimer.current);
      advanceTimer.current = window.setTimeout(() => {
        moved.current = true;
        if (!tracked.current.has(group.group)) {
          tracked.current.add(group.group);
          trackFormWizardStep(group.group);
        }
        setIndex((current) => Math.min(current + 1, screens.length - 1));
      }, 320);
    }
  }

  function labelOf(group: PlannerGroupKey, value: string) {
    return content.groups.find((item) => item.group === group)?.options.find((option) => option.value === value)?.label ?? value;
  }

  const summary = [
    ...screens.flatMap((item, at) => {
      if (item.kind !== "group") return [];
      const key = item.group.group;
      const values = (selection[key] ?? []).map((value) => labelOf(key, value));
      const note = key === "style" ? notes.style : key === "form" ? notes.form : "";
      return [{ key, at, label: SHORT[locale][key], value: values.length ? values.join(", ") + (note ? ` (${note})` : "") : "—" }];
    }),
    ...(notes.wishes.trim()
      ? [{ key: "wishes", at: screens.findIndex((item) => item.kind === "group" && item.group.group === "appliances"), label: ui.wishes, value: notes.wishes.trim() }]
      : []),
    {
      key: "budget",
      at: screens.findIndex((item) => item.kind === "budget"),
      label: ui.budget,
      value: budgetState === "set" ? `${ui.budgetAbout} ${formatEuros(budgetValue, locale, content.budget.max)}` : ui.noAnswer,
    },
  ];

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!last) {
      goTo(index + 1);
      return;
    }
    if (status === "sending") return;
    markStart();
    trackFormAttempt("kontakt");

    const honeypot = String(new FormData(event.currentTarget).get("company_website") ?? "");
    const fields = honeypot
      ? ({ ok: true, name: "", email: "", phone: "", message: "" } as const)
      : validateLeadFields(contact);
    if (!fields.ok) {
      const messages = { invalid_name: ui.errName, invalid_email: ui.errEmail, invalid_phone: ui.errPhone, invalid_message: ui.errMessage };
      setError(messages[fields.reason]);
      trackFormError(fields.reason, "kontakt");
      document.getElementById(`${baseId}-${fields.field}`)?.focus();
      return;
    }

    setStatus("sending");
    setError("");
    try {
      let token = challenge;
      if (!token) {
        token = await fetchChallenge();
        setChallenge(token);
        await new Promise((resolve) => window.setTimeout(resolve, 1600));
      } else {
        const wait = 1600 - msSince(mountedAt.current);
        if (wait > 0) await new Promise((resolve) => window.setTimeout(resolve, wait));
      }

      const response = await fetch("/api/lead", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          challenge: token,
          company_website: honeypot,
          name: fields.name,
          email: fields.email,
          phone: fields.phone,
          message: fields.message,
          place: contact.place,
          answers: selection,
          notes,
          budget: budgetState === "set" ? budgetValue : null,
          ...conversionContext(),
        }),
      });
      const payload: unknown = await response.json().catch(() => null);
      const ok = response.ok && payload && typeof payload === "object" && "ok" in payload && payload.ok === true;
      if (!ok && !honeypot) {
        trackFormError(apiErrorReason(response.status), "kontakt");
        setStatus("error");
        setError(ui.errSend);
        return;
      }
      if (!honeypot) {
        trackFormWizardStep("kontakt");
        trackFormSubmit();
      }
      moved.current = true;
      setStatus("done");
      setChallenge(await fetchChallenge().catch(() => ""));
    } catch {
      trackFormError("network", "kontakt");
      setStatus("error");
      setError(ui.errSend);
    }
  }

  const stepTitle = (key: string) => content.steps.find((item) => item.step === key)?.title ?? "";
  const eyebrow =
    screen.kind === "group" ? stepTitle(PLANNER_GROUPS[screen.group.group].step) : screen.kind === "budget" ? stepTitle("budget") : stepTitle("kontakt");
  const heading = screen.kind === "group" ? screen.group.label : screen.kind === "budget" ? ui.budgetTitle : ui.contactTitle;
  const hint =
    screen.kind === "group" ? (PLANNER_GROUPS[screen.group.group].multi ? screen.group.hint : undefined) : screen.kind === "budget" ? ui.budgetHint : ui.contactHint;
  const needsNext =
    screen.kind !== "group" || PLANNER_GROUPS[screen.group.group].multi || screen.group.options.some((option) => option.freeText && (selection[screen.group.group] ?? []).includes(option.value));

  return (
    <section id="planer" className="scroll-mt-24 bg-karte px-5 py-20 sm:px-8 md:py-28 lg:px-12" aria-labelledby={`${baseId}-title`}>
      <div className="mx-auto max-w-[70rem]">
        <div className="mx-auto max-w-2xl text-center">
          <p className="type-eyebrow text-gold">{content.eyebrow}</p>
          <Heading id={`${baseId}-title`} className="mt-4 font-serif text-[34px] leading-[1.15] font-medium text-ink md:text-[42px]">
            {content.title} {content.titleEmphasis ? <em>{content.titleEmphasis}</em> : null}
          </Heading>
          <p className="mt-4 font-sans text-[16px] leading-[1.75] font-light text-ink/85">{content.intro}</p>
        </div>

        <form ref={formRef} onSubmit={submit} noValidate className="relative mt-12 bg-paper md:mt-14">
          {/* Honeypot for bots; hidden from people and screen readers. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label>
              Website
              <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          {status === "done" ? (
            <div className="px-6 py-20 text-center sm:px-10">
              <div aria-hidden="true" className="mx-auto mb-7 h-px w-14 bg-messing" />
              <h3 ref={screenHeading} tabIndex={-1} className="font-serif text-[30px] leading-tight font-medium text-ink outline-none md:text-[38px]">
                {content.done.title.replace("{name}", contact.name.trim().split(/\s+/)[0] ?? "")}
              </h3>
              <p className="mx-auto mt-4 max-w-md font-sans text-[16px] leading-[1.7] font-light text-ink/85">{content.done.text}</p>
              {content.done.linkHref ? (
                <LocaleLink href={content.done.linkHref} className="pill pill-secondary mt-8">
                  {content.done.linkLabel}
                </LocaleLink>
              ) : null}
            </div>
          ) : (
            <>
              {/* Back + thin progress bar across the full width, as at SieMatic. */}
              <div className="flex min-h-14 items-center justify-between px-6 pt-4 sm:px-10">
                {index > 0 ? (
                  <button type="button" onClick={() => goTo(index - 1)} className="inline-flex min-h-10 items-center gap-2 font-sans text-[14px] text-ink hover:opacity-70">
                    <span aria-hidden="true">←</span> {ui.back}
                  </button>
                ) : (
                  <span />
                )}
                <p className="font-sans text-[12px] tracking-[0.16em] text-muted uppercase">
                  {ui.progress.replace("{n}", String(index + 1)).replace("{total}", String(screens.length))}
                </p>
              </div>
              <div
                className="mt-3 h-1 bg-line"
                role="progressbar"
                aria-valuemin={1}
                aria-valuemax={screens.length}
                aria-valuenow={index + 1}
                aria-label={ui.progress.replace("{n}", String(index + 1)).replace("{total}", String(screens.length))}
              >
                <div className="h-1 bg-messing transition-[width] duration-500" style={{ width: `${((index + 1) / screens.length) * 100}%` }} />
              </div>

              <div className="px-6 pt-12 pb-10 sm:px-10 md:pt-16 md:pb-14">
                <div className="mx-auto max-w-3xl text-center">
                  <p className="type-eyebrow text-gold">{eyebrow}</p>
                  <h3 ref={screenHeading} tabIndex={-1} className="mt-3 font-serif text-[30px] leading-[1.15] font-medium text-ink outline-none md:text-[40px]">
                    {heading}
                  </h3>
                  {hint ? <p className="mt-3 font-sans text-[14px] leading-relaxed text-muted">{hint}</p> : null}
                </div>

                <div className="mx-auto mt-10 max-w-[58rem] md:mt-12">
                  {screen.kind === "group" ? (
                    <>
                      <PlannerChoices
                        group={screen.group}
                        selected={selection[screen.group.group] ?? []}
                        onChoose={(option) => choose(screen.group, option)}
                        labelledBy={`${baseId}-screen`}
                      />
                      {screen.group.options.some((option) => option.freeText && (selection[screen.group.group] ?? []).includes(option.value)) ? (
                        <div className="mx-auto mt-10 max-w-xl">
                          <label htmlFor={`${baseId}-other`} className="sr-only">
                            {screen.group.placeholder ?? screen.group.label}
                          </label>
                          <input
                            id={`${baseId}-other`}
                            type="text"
                            placeholder={screen.group.placeholder}
                            value={screen.group.group === "form" ? notes.form : notes.style}
                            onChange={(event) => {
                              const value = event.target.value;
                              setNotes((current) => ({ ...current, [screen.group.group === "form" ? "form" : "style"]: value }));
                            }}
                            className="w-full border-0 border-b border-line bg-transparent py-3 text-center font-sans text-[15px] text-ink outline-none placeholder:text-muted focus:border-ink"
                          />
                        </div>
                      ) : null}
                      {screen.group.group === "appliances" && wishes ? (
                        <div className="mx-auto mt-12 max-w-xl">
                          <label htmlFor={`${baseId}-wishes`} className="block text-center font-serif text-[22px] text-ink">
                            {wishes.label}
                          </label>
                          <textarea
                            id={`${baseId}-wishes`}
                            rows={3}
                            placeholder={wishes.placeholder}
                            value={notes.wishes}
                            onChange={(event) => {
                              const value = event.target.value;
                              setNotes((current) => ({ ...current, wishes: value }));
                            }}
                            className="mt-3 w-full resize-y border-0 border-b border-line bg-transparent py-3 font-sans text-[15px] text-ink outline-none placeholder:text-muted focus:border-ink"
                          />
                        </div>
                      ) : null}
                    </>
                  ) : null}

                  {screen.kind === "budget" ? (
                    <div className="mx-auto max-w-xl bg-karte p-6 text-center sm:p-8">
                      <label htmlFor={`${baseId}-budget`} className="sr-only">
                        {ui.budgetTitle}
                      </label>
                      <p className="font-serif text-[34px] text-ink md:text-[40px]" aria-live="polite">
                        {budgetState === "none"
                          ? ui.noAnswer
                          : budgetState === "set"
                            ? `${ui.budgetAbout} ${formatEuros(budgetValue, locale, content.budget.max)}`
                            : "—"}
                      </p>
                      <input
                        id={`${baseId}-budget`}
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={budgetPos}
                        aria-valuetext={formatEuros(budgetValue, locale, content.budget.max)}
                        onChange={(event) => {
                          markStart();
                          setError("");
                          setBudgetPos(Number(event.target.value));
                          setBudgetState("set");
                        }}
                        className="mt-6 w-full cursor-pointer accent-[var(--color-primary)]"
                      />
                      <div className="mt-2 flex justify-between font-sans text-[12px] text-muted" aria-hidden="true">
                        <span>{formatEuros(content.budget.min, locale, content.budget.max)}</span>
                        <span>{formatEuros(content.budget.max, locale, content.budget.max)}</span>
                      </div>
                      <button
                        type="button"
                        aria-pressed={budgetState === "none"}
                        onClick={() => {
                          setError("");
                          setBudgetState((current) => (current === "none" ? "untouched" : "none"));
                        }}
                        className={cn(
                          "mt-6 inline-flex min-h-10 items-center rounded-full border px-5 font-sans text-[14px] text-ink transition-colors",
                          budgetState === "none" ? "border-ink bg-paper ring-1 ring-ink ring-inset" : "border-line bg-paper hover:border-ink",
                        )}
                      >
                        {ui.noAnswer}
                      </button>
                    </div>
                  ) : null}

                  {screen.kind === "contact" ? (
                    <div className="mx-auto max-w-2xl">
                      <div className="bg-karte px-6 py-6">
                        <p className="type-eyebrow text-gold">{ui.summary}</p>
                        <dl className="mt-3.5">
                          {summary.map((row) => (
                            <div key={row.key} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 border-b border-line py-2.5 font-sans text-[14px] sm:grid-cols-[8.5rem_minmax(0,1fr)_auto]">
                              <dt className="text-muted">{row.label}</dt>
                              <dd className="col-start-1 text-ink sm:col-start-2">{row.value}</dd>
                              <dd className="col-start-2 row-span-2 row-start-1 self-center sm:col-start-3 sm:row-span-1">
                                <button type="button" onClick={() => goTo(row.at)} className="min-h-6 text-[13px] text-muted underline underline-offset-4 hover:text-ink">
                                  {ui.change}
                                  <span className="sr-only">: {row.label}</span>
                                </button>
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>

                      <div className="mt-10 grid gap-x-7 gap-y-5 sm:grid-cols-2">
                        {(["name", "email", "phone", "place"] as const).map((field) => (
                          <PlannerField
                            key={field}
                            id={`${baseId}-${field}`}
                            label={ui[field]}
                            required={field !== "place"}
                            requiredLabel={ui.required}
                            type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                            autoComplete={field === "name" ? "name" : field === "email" ? "email" : field === "phone" ? "tel" : "postal-code"}
                            value={contact[field]}
                            onChange={(value) => {
                              markStart();
                              setContact((current) => ({ ...current, [field]: value }));
                            }}
                          />
                        ))}
                      </div>
                      <div className="mt-5">
                        <label htmlFor={`${baseId}-message`} className="font-sans text-[13px] text-muted">
                          {ui.message}
                        </label>
                        <textarea
                          id={`${baseId}-message`}
                          rows={3}
                          value={contact.message}
                          onChange={(event) => setContact((current) => ({ ...current, message: event.target.value }))}
                          className="mt-1 w-full resize-y border-0 border-b border-line bg-transparent py-3 font-sans text-[15px] text-ink outline-none focus:border-ink"
                        />
                      </div>
                    </div>
                  ) : null}
                </div>

                <p role="alert" className="mt-8 min-h-5 text-center font-sans text-[14px] text-destructive">
                  {error}
                </p>

                {needsNext ? (
                  <div className="mt-6 flex justify-center">
                    <button
                      type="submit"
                      aria-disabled={!answered(screen)}
                      disabled={status === "sending"}
                      className={cn("pill pill-primary inline-flex items-center gap-2.5", !answered(screen) && "opacity-40")}
                    >
                      {last ? (
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-[18px] w-[18px] shrink-0">
                          <rect x="3.5" y="5.5" width="17" height="15" rx="3" stroke="currentColor" strokeWidth="1.4" />
                          <path d="M3.5 9.75H20.5M8 3.5V6.5M16 3.5V6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                          <path d="M8.25 13.25L10.6 15.6L15.5 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : null}
                      <span>{last ? (status === "sending" ? ui.sending : ui.submit) : ui.next}</span>
                    </button>
                  </div>
                ) : null}
              </div>
            </>
          )}
          <span id={`${baseId}-screen`} className="sr-only">
            {heading}
          </span>
        </form>
      </div>
    </section>
  );
}

function PlannerChoices({
  group,
  selected,
  onChoose,
  labelledBy,
}: {
  group: PlannerGroup;
  selected: string[];
  onChoose: (option: PlannerOption) => void;
  labelledBy: string;
}) {
  const { kind, multi } = PLANNER_GROUPS[group.group];
  // Few answers sit centred in a narrower row, like SieMatic's three-up grid.
  const columns = group.options.length <= 2 ? "sm:grid-cols-2 max-w-xl" : group.options.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3";

  return (
    <ul
      role={multi ? "group" : "radiogroup"}
      aria-labelledby={labelledBy}
      className={cn(
        "mx-auto grid gap-3 sm:gap-5",
        kind === "images" && cn("grid-cols-2", columns),
        kind === "icons" && cn("auto-rows-fr grid-cols-2", columns),
        kind === "chips" && "auto-rows-fr grid-cols-1 min-[480px]:grid-cols-2 sm:grid-cols-3",
      )}
    >
      {group.options.map((option) => {
        const on = selected.includes(option.value);
        const tile = cn(
          "flex h-full w-full border text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
          on ? "border-ink bg-karte ring-1 ring-ink ring-inset" : "border-line bg-paper hover:border-ink/40",
        );
        const state = multi ? { "aria-pressed": on } : { role: "radio", "aria-checked": on };
        return (
          <li key={option.value} role={multi ? undefined : "none"}>
            <button
              type="button"
              {...state}
              onClick={() => onChoose(option)}
              className={cn(tile, kind === "images" ? "flex-col" : kind === "icons" ? "flex-col items-center px-3 py-7" : "min-h-[4.5rem] items-center justify-center px-5 py-3.5")}
            >
              {kind === "images" ? (
                <>
                  <span className="relative block aspect-[4/3] w-full overflow-hidden bg-karte">
                    {option.image ? (
                      <CmsImage
                        src={option.image.src}
                        srcSet={option.image.srcSet}
                        alt=""
                        fill
                        // Only the current question is rendered, so load its images straight away.
                        loading="eager"
                        sizes="(max-width: 640px) 50vw, 300px"
                        className="object-cover"
                      />
                    ) : null}
                  </span>
                  <span className="flex flex-col gap-1.5 px-3 pt-3 pb-4 sm:px-4 sm:pt-4 sm:pb-5">
                    <span className="font-serif text-[18px] leading-snug font-medium text-ink sm:text-[21px]">{option.label}</span>
                    {option.subtitle ? (
                      <span className="font-sans text-[12px] leading-[1.5] font-light text-muted sm:text-[13px]">{option.subtitle}</span>
                    ) : null}
                  </span>
                </>
              ) : kind === "icons" ? (
                <>
                  {option.image ? (
                    // Icons ship at 2× with deliberate whitespace: show them whole, never cropped.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={option.image.src}
                      alt=""
                      width={option.iconSize ?? 120}
                      height={option.iconSize ?? 120}
                      loading="eager"
                      decoding="async"
                      className="max-w-full object-contain"
                      style={{ width: option.iconSize ?? 120, height: option.iconSize ?? 120 }}
                    />
                  ) : null}
                  <span className="mt-4 font-sans text-[15px] text-ink">{option.label}</span>
                  {option.subtitle ? (
                    <span className="mt-1 font-sans text-[12px] leading-snug font-light text-muted">{option.subtitle}</span>
                  ) : null}
                </>
              ) : (
                <span className="font-sans text-[15px] leading-snug text-ink">{option.label}</span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function PlannerField({
  id,
  label,
  required,
  requiredLabel,
  type,
  autoComplete,
  value,
  onChange,
}: {
  id: string;
  label: string;
  required: boolean;
  requiredLabel: string;
  type: string;
  autoComplete: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="font-sans text-[13px] text-muted">
        {label}
        {required ? (
          <>
            <span aria-hidden="true"> *</span>
            <span className="sr-only"> ({requiredLabel})</span>
          </>
        ) : null}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        aria-required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full border-0 border-b border-line bg-transparent py-3 font-sans text-[15px] text-ink outline-none focus:border-ink"
      />
    </div>
  );
}
