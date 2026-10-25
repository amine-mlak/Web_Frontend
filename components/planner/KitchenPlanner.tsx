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
  PLANNER_STEPS,
  type PlannerContent,
  type PlannerGroup,
  type PlannerGroupKey,
  type PlannerOption,
} from "@/lib/kitchen-planner-model";
import { validateLeadFields } from "@/lib/lead-fields";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "done" | "error";
type Selection = Partial<Record<PlannerGroupKey, string[]>>;

const UI: Record<Locale, Record<string, string>> = {
  de: {
    step: "Schritt {n} von {total}",
    steps: "Schritte des Küchenplaners",
    back: "Zurück",
    next: "Weiter",
    submit: "Beratung anfragen",
    sending: "Wird gesendet …",
    summary: "Ihre Auswahl",
    contact: "Ihre Kontaktdaten",
    name: "Name",
    email: "E-Mail",
    phone: "Telefon",
    place: "PLZ / Ort",
    message: "Platz für alles, was Ihnen noch wichtig ist",
    required: "Pflichtfeld",
    noAnswer: "Keine Angabe",
    budgetAbout: "ca.",
    errName: "Bitte Ihren Namen angeben.",
    errEmail: "Bitte eine gültige E-Mail-Adresse angeben.",
    errPhone: "Bitte eine Telefonnummer angeben.",
    errMessage: "Bitte die Nachricht kürzen (höchstens zwei Links).",
    errSend: "Das hat leider nicht geklappt. Bitte versuchen Sie es noch einmal oder rufen Sie uns an: 08168 909910.",
    wishes: "Wünsche",
    budget: "Budget",
  },
  en: {
    step: "Step {n} of {total}",
    steps: "Kitchen planner steps",
    back: "Back",
    next: "Next",
    submit: "Request a consultation",
    sending: "Sending …",
    summary: "Your choices",
    contact: "Your contact details",
    name: "Name",
    email: "Email",
    phone: "Phone",
    place: "Postcode / town",
    message: "Anything else that matters to you",
    required: "required",
    noAnswer: "Not specified",
    budgetAbout: "approx.",
    errName: "Please enter your name.",
    errEmail: "Please enter a valid email address.",
    errPhone: "Please enter a phone number.",
    errMessage: "Please shorten your message (two links at most).",
    errSend: "That did not work, sorry. Please try again or call us: +49 8168 909910.",
    wishes: "Wishes",
    budget: "Budget",
  },
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
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const mountedAt = useRef(0);
  const started = useRef(false);
  const seen = useRef(false);
  const tracked = useRef(new Set<string>());
  const moved = useRef(false);

  const [stepIndex, setStepIndex] = useState(0);
  const [selection, setSelection] = useState<Selection>({});
  const [notes, setNotes] = useState<{ style: string; form: string; wishes: string }>({ style: "", form: "", wishes: "" });
  const [budgetPos, setBudgetPos] = useState(50);
  const [budgetState, setBudgetState] = useState<"untouched" | "set" | "none">("untouched");
  const [contact, setContact] = useState({ name: "", email: "", phone: "", place: "", message: "" });
  const [error, setError] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [challenge, setChallenge] = useState("");

  const step = PLANNER_STEPS[stepIndex];
  const stepCopy = content.steps.find((item) => item.step === step)!;
  const groups = content.groups.filter((group) => PLANNER_GROUPS[group.group].step === step);
  const last = stepIndex === PLANNER_STEPS.length - 1;
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

  // After a step change, bring the step into view and move focus to its heading.
  useEffect(() => {
    if (!moved.current) return;
    const heading = stepHeading.current;
    if (!heading) return;
    heading.focus({ preventScroll: true });
    const top = (formRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 96;
    if (Math.abs(window.scrollY - top) > 40) window.scrollTo({ top, behavior: "smooth" });
  }, [stepIndex, status]);

  function markStart() {
    if (started.current) return;
    started.current = true;
    trackFormStart(step);
  }

  function goTo(index: number) {
    if (index === stepIndex) return;
    if (index > stepIndex && !tracked.current.has(step)) {
      tracked.current.add(step);
      trackFormWizardStep(step);
    }
    moved.current = true;
    setError("");
    setStatus((current) => (current === "error" ? "idle" : current));
    setStepIndex(Math.max(0, Math.min(index, PLANNER_STEPS.length - 1)));
  }

  function toggle(group: PlannerGroup, option: PlannerOption) {
    markStart();
    const multi = PLANNER_GROUPS[group.group].multi;
    setSelection((current) => {
      const picked = current[group.group] ?? [];
      const has = picked.includes(option.value);
      const next = multi
        ? has ? picked.filter((value) => value !== option.value) : [...picked, option.value]
        : has ? [] : [option.value];
      return { ...current, [group.group]: next };
    });
  }

  function labelOf(group: PlannerGroupKey, value: string) {
    return content.groups.find((item) => item.group === group)?.options.find((option) => option.value === value)?.label ?? value;
  }

  const summary = [
    ...content.groups
      .filter((group) => group.group !== "wishes")
      .map((group) => {
        const values = (selection[group.group] ?? []).map((value) => labelOf(group.group, value));
        const note = group.group === "style" ? notes.style : group.group === "form" ? notes.form : "";
        return { key: group.group, label: group.label, value: values.length ? values.join(", ") + (note ? ` (${note})` : "") : "—" };
      }),
    { key: "wishes", label: ui.wishes, value: notes.wishes.trim() || "—" },
    {
      key: "budget",
      label: ui.budget,
      value: budgetState === "set" ? `${ui.budgetAbout} ${formatEuros(budgetValue, locale, content.budget.max)}` : ui.noAnswer,
    },
  ];

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!last) {
      goTo(stepIndex + 1);
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
      document.getElementById(`${baseId}-${fields.field === "message" ? "message" : fields.field}`)?.focus();
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

  return (
    <section id="planer" className="scroll-mt-24 bg-karte px-5 py-20 sm:px-8 md:py-28 lg:px-12" aria-labelledby={`${baseId}-title`}>
      <div className="mx-auto max-w-[70rem]">
        <p className="type-eyebrow text-gold">{content.eyebrow}</p>
        <Heading id={`${baseId}-title`} className="mt-4 max-w-2xl font-serif text-[34px] leading-[1.15] font-medium text-ink md:text-[42px]">
          {content.title} {content.titleEmphasis ? <em>{content.titleEmphasis}</em> : null}
        </Heading>
        <p className="mt-4 max-w-[38rem] font-sans text-[16px] leading-[1.75] font-light text-ink/85">{content.intro}</p>

        <div className="mt-12 grid items-start gap-8 md:mt-14 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14">
          {/* Step list: a vertical index on desktop, a scrollable row on phones. */}
          <nav aria-label={ui.steps} className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0 lg:sticky lg:top-28">
            <ol className="flex gap-1 lg:flex-col">
              {PLANNER_STEPS.map((key, index) => {
                const title = content.steps.find((item) => item.step === key)!.title;
                const current = index === stepIndex && status !== "done";
                const doneStep = index < stepIndex || status === "done";
                return (
                  <li key={key} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => status !== "done" && goTo(index)}
                      aria-current={current ? "step" : undefined}
                      disabled={status === "done"}
                      className={cn(
                        "flex min-h-11 items-center gap-3.5 pr-4 font-sans text-[14px] transition-colors lg:pr-0",
                        current ? "text-ink" : "text-muted hover:text-ink",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[12px]",
                          current
                            ? "border-ink bg-ink text-paper"
                            : doneStep
                              ? "border-messing bg-messing text-paper"
                              : "border-line text-muted",
                        )}
                      >
                        {index + 1}
                      </span>
                      <span className="whitespace-nowrap">{title}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>

          <form ref={formRef} onSubmit={submit} noValidate className="relative bg-paper p-6 sm:p-10 lg:p-12">
            {/* Honeypot for bots; hidden from people and screen readers. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label>
                Website
                <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            {status === "done" ? (
              <div className="py-12 text-center">
                <div aria-hidden="true" className="mx-auto mb-7 h-px w-14 bg-messing" />
                <h3 ref={stepHeading} tabIndex={-1} className="font-serif text-[30px] leading-tight font-medium text-ink outline-none md:text-[36px]">
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
                <p className="font-sans text-[12px] tracking-[0.16em] text-muted uppercase">
                  {ui.step.replace("{n}", String(stepIndex + 1)).replace("{total}", String(PLANNER_STEPS.length))}
                </p>
                <div className="mt-2.5 mb-8 h-0.5 bg-line" aria-hidden="true">
                  <div
                    className="h-0.5 bg-messing transition-[width] duration-500"
                    style={{ width: `${((stepIndex + 1) / PLANNER_STEPS.length) * 100}%` }}
                  />
                </div>
                <h3 ref={stepHeading} tabIndex={-1} className="font-serif text-[30px] font-medium text-ink outline-none md:text-[32px]">
                  {stepCopy.title}
                </h3>
                <p className="mt-2 max-w-2xl font-sans text-[15px] leading-[1.7] font-light text-ink/85">{stepCopy.subtitle}</p>

                <div className="mt-12 space-y-14">
                  {groups.map((group) => (
                    <PlannerQuestion
                      key={group.group}
                      group={group}
                      selected={selection[group.group] ?? []}
                      onToggle={(option) => toggle(group, option)}
                      note={group.group === "wishes" ? notes.wishes : group.group === "style" ? notes.style : group.group === "form" ? notes.form : ""}
                      onNote={(value) => {
                        markStart();
                        if (group.group === "wishes" || group.group === "style" || group.group === "form") {
                          setNotes((current) => ({ ...current, [group.group]: value }));
                        }
                      }}
                      idPrefix={`${baseId}-${group.group}`}
                    />
                  ))}

                  {step === "budget" ? (
                    <div className="bg-karte p-6 sm:p-7">
                      <label htmlFor={`${baseId}-budget`} className="type-eyebrow text-gold">
                        {stepCopy.title}
                      </label>
                      <p className="mt-3.5 font-serif text-[30px] text-ink md:text-[34px]" aria-live="polite">
                        {budgetState === "none" ? ui.noAnswer : `${ui.budgetAbout} ${formatEuros(budgetValue, locale, content.budget.max)}`}
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
                          setBudgetPos(Number(event.target.value));
                          setBudgetState("set");
                        }}
                        className="mt-5 w-full cursor-pointer accent-[var(--color-primary)]"
                      />
                      <div className="mt-2 flex justify-between font-sans text-[12px] text-muted" aria-hidden="true">
                        <span>{formatEuros(content.budget.min, locale, content.budget.max)}</span>
                        <span>{formatEuros(content.budget.max, locale, content.budget.max)}</span>
                      </div>
                      <button
                        type="button"
                        aria-pressed={budgetState === "none"}
                        onClick={() => setBudgetState((current) => (current === "none" ? "untouched" : "none"))}
                        className={cn(
                          "mt-5 inline-flex min-h-10 items-center rounded-full border px-5 font-sans text-[14px] text-ink transition-colors",
                          budgetState === "none" ? "border-ink bg-karte ring-1 ring-ink ring-inset" : "border-line bg-paper hover:border-ink",
                        )}
                      >
                        {ui.noAnswer}
                      </button>
                    </div>
                  ) : null}

                  {last ? (
                    <>
                      <div className="bg-karte px-6 py-6">
                        <p className="type-eyebrow text-gold">{ui.summary}</p>
                        <dl className="mt-3.5">
                          {summary.map((row) => (
                            <div key={row.key} className="grid grid-cols-1 gap-1 border-b border-line py-2 font-sans text-[14px] sm:grid-cols-[9.5rem_minmax(0,1fr)] sm:gap-4">
                              <dt className="text-muted">{row.label}</dt>
                              <dd className="text-ink">{row.value}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>

                      <fieldset>
                        <legend className="type-eyebrow text-gold">{ui.contact}</legend>
                        <div className="mt-4 grid gap-x-7 gap-y-5 sm:grid-cols-2">
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
                      </fieldset>
                    </>
                  ) : null}
                </div>

                <p role="alert" className="mt-6 min-h-5 font-sans text-[14px] text-destructive">
                  {error}
                </p>

                <div className="mt-12 flex flex-wrap items-center justify-between gap-4 md:mt-16">
                  <div>
                    {stepIndex > 0 ? (
                      <button type="button" onClick={() => goTo(stepIndex - 1)} className="pill pill-secondary">
                        {ui.back}
                      </button>
                    ) : null}
                  </div>
                  <button type="submit" className="pill pill-primary inline-flex items-center gap-2.5" disabled={status === "sending"}>
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
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

function PlannerQuestion({
  group,
  selected,
  onToggle,
  note,
  onNote,
  idPrefix,
}: {
  group: PlannerGroup;
  selected: string[];
  onToggle: (option: PlannerOption) => void;
  note: string;
  onNote: (value: string) => void;
  idPrefix: string;
}) {
  const { kind } = PLANNER_GROUPS[group.group];
  const labelId = `${idPrefix}-label`;

  if (kind === "note") {
    return (
      <div>
        <label htmlFor={`${idPrefix}-note`} className="font-serif text-[24px] leading-tight text-ink">
          {group.label}
        </label>
        <textarea
          id={`${idPrefix}-note`}
          rows={3}
          placeholder={group.placeholder}
          value={note}
          onChange={(event) => onNote(event.target.value)}
          className="mt-4 w-full resize-y border-0 border-b border-line bg-transparent py-3 font-sans text-[15px] text-ink outline-none placeholder:text-muted focus:border-ink"
        />
      </div>
    );
  }

  const freeTextOpen = group.options.some((option) => option.freeText && selected.includes(option.value));

  return (
    <div role="group" aria-labelledby={labelId}>
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
        <p id={labelId} className="font-serif text-[24px] leading-tight text-ink">
          {group.label}
        </p>
        {group.hint ? <p className="font-sans text-[12px] text-muted">{group.hint}</p> : null}
      </div>

      <ul
        className={cn(
          "grid gap-3 sm:gap-4",
          kind === "images" && "grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3",
          kind === "icons" && "auto-rows-fr grid-cols-2 sm:grid-cols-3",
          kind === "chips" && "auto-rows-fr grid-cols-1 min-[480px]:grid-cols-2 sm:grid-cols-3",
        )}
      >
        {group.options.map((option) => {
          const on = selected.includes(option.value);
          const tile = cn(
            "flex h-full w-full border text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
            on ? "border-ink bg-karte ring-1 ring-ink ring-inset" : "border-line bg-paper hover:border-ink/40",
          );
          return (
            <li key={option.value}>
              <button type="button" aria-pressed={on} onClick={() => onToggle(option)} className={cn(tile, kind === "images" ? "flex-col" : kind === "icons" ? "flex-col items-center px-3 py-6 text-center" : "min-h-[4.5rem] items-center justify-center px-5 py-3.5 text-center")}>
                {kind === "images" ? (
                  <>
                    <span className="relative block aspect-[4/3] w-full overflow-hidden bg-karte">
                      {option.image ? (
                        <CmsImage
                          src={option.image.src}
                          srcSet={option.image.srcSet}
                          alt=""
                          fill
                          sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 300px"
                          className="object-cover"
                        />
                      ) : null}
                    </span>
                    <span className="flex flex-col gap-1.5 px-4.5 pt-4 pb-5">
                      <span className="font-serif text-[21px] leading-snug font-medium text-ink">{option.label}</span>
                      {option.subtitle ? (
                        <span className="font-sans text-[13px] leading-[1.55] font-light text-muted">{option.subtitle}</span>
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
                        loading="lazy"
                        decoding="async"
                        className="max-w-full object-contain"
                        style={{ width: option.iconSize ?? 120, height: option.iconSize ?? 120 }}
                      />
                    ) : null}
                    <span className="mt-3.5 font-sans text-[15px] text-ink">{option.label}</span>
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

      {freeTextOpen ? (
        <div className="mt-10">
          <label htmlFor={`${idPrefix}-other`} className="sr-only">
            {group.placeholder ?? group.label}
          </label>
          <input
            id={`${idPrefix}-other`}
            type="text"
            placeholder={group.placeholder}
            value={note}
            onChange={(event) => onNote(event.target.value)}
            className="w-full border-0 border-b border-line bg-transparent py-3 font-sans text-[15px] text-ink outline-none placeholder:text-muted focus:border-ink"
          />
        </div>
      ) : null}
    </div>
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
