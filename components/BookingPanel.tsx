"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import LocaleLink from "@/components/LocaleLink";
import { fieldHint } from "@/lib/field-hints";
import type { BookingDays, BookingService, BookingSetup } from "@/lib/bookings";
import { conversionContext } from "@/lib/conversion";
import { BOOKING_URL, MAIN_ACTIONS } from "@/lib/cta";
import { trackCompletion, trackLead } from "@/lib/form-tracking";
import { useRouter } from "next/navigation";
import { withLocale, type Locale } from "@/lib/i18n";
import { saveThanks } from "@/lib/thanks";
import { validateLeadFields } from "@/lib/lead-fields";
import { cn } from "@/lib/utils";

/**
 * Booking an appointment on /kontakt: the team's Microsoft Bookings calendar in the site's own
 * design. Services, people and free times are read live through /api/booking (lib/bookings.ts),
 * and the booking lands in the same calendar as one made on Microsoft's page.
 *
 * Built like the kitchen planner: one step per screen (what, with whom, when, details), a thin
 * progress bar, and each step slides in from the right (the `planner-screen` styles in globals.css).
 * The screen is as high as the window under the header, so nothing below jumps while it changes.
 */

type Status = "idle" | "sending" | "done" | "error";
type Booked = { service: string; when: string; staff: string; name: string };
type Step = "service" | "staff" | "when" | "details";

const UI: Record<Locale, Record<string, string>> = {
  de: {
    title: "Termin vereinbaren",
    progress: "Schritt {n} von {total}",
    back: "Zurück",
    stepService: "Was möchten Sie vereinbaren?",
    hintService: "Kostenlos und unverbindlich, direkt im Kalender unseres Teams.",
    stepStaff: "Mit wem möchten Sie sprechen?",
    anyone: "Wer gerade frei ist",
    stepWhen: "Wann passt es Ihnen?",
    stepDetails: "Ihre Angaben",
    call: "Lieber anrufen?",
    phoneLabel: "08168 909910",
    planner: "Erst Ideen sammeln? Zum Küchenplaner",
    phoneCall: "am Telefon",
    hour: "Stunde",
    hours: "Stunden",
    minutes: "Minuten",
    prev: "Vorheriger Monat",
    next: "Nächster Monat",
    loading: "Freie Zeiten werden geladen …",
    noneMonth: "In diesem Monat ist nichts mehr frei.",
    monthError: "Die freien Zeiten konnten nicht geladen werden.",
    retry: "Noch einmal versuchen",
    zone: "Alle Zeiten in deutscher Zeit.",
    clock: "Uhr",
    name: "Vor- und Nachname",
    email: "E-Mail",
    phone: "Telefon",
    required: "Pflichtfeld",
    submit: "Termin buchen",
    sending: "Wird gebucht …",
    privacy: "Der Termin wird in den Kalender unseres Teams bei Microsoft Bookings eingetragen. Ihre Angaben verwenden wir nur für diesen Termin.",
    privacyLink: "Datenschutz",
    doneTitle: "Danke, {name}. Ihr Termin ist gebucht.",
    doneWith: "mit",
    doneText: "Die Bestätigung kommt per E-Mail. Wenn etwas dazwischenkommt, rufen Sie uns bitte an.",
    errName: "Bitte Ihren Namen angeben.",
    errEmail: "Bitte eine gültige E-Mail-Adresse angeben.",
    errPhone: "Bitte eine Telefonnummer angeben.",
    errMessage: "Bitte die Angaben kürzen.",
    errAnswer: "Bitte diese Frage beantworten.",
    errTaken: "Diese Zeit wurde gerade vergeben. Bitte wählen Sie eine andere.",
    errSend: "Das hat leider nicht geklappt. Bitte versuchen Sie es noch einmal oder rufen Sie uns an: 08168 909910.",
    down: "Der Kalender ist gerade nicht erreichbar. Sie können direkt bei Microsoft Bookings buchen oder uns anrufen.",
    external: "Kalender bei Microsoft öffnen",
  },
  en: {
    title: "Book an appointment",
    progress: "Step {n} of {total}",
    back: "Back",
    stepService: "What would you like to book?",
    hintService: "Free and without obligation, directly in our team's calendar.",
    stepStaff: "Who would you like to talk to?",
    anyone: "Whoever is free",
    stepWhen: "When suits you?",
    stepDetails: "Your details",
    call: "Rather call?",
    phoneLabel: "+49 8168 909910",
    planner: "Collect ideas first? To the kitchen planner",
    phoneCall: "by phone",
    hour: "hour",
    hours: "hours",
    minutes: "minutes",
    prev: "Previous month",
    next: "Next month",
    loading: "Loading free times …",
    noneMonth: "Nothing is free in this month any more.",
    monthError: "The free times could not be loaded.",
    retry: "Try again",
    zone: "All times are German time.",
    clock: "",
    name: "First and last name",
    email: "Email",
    phone: "Phone",
    required: "required",
    submit: "Book appointment",
    sending: "Booking …",
    privacy: "The appointment is entered in our team's calendar at Microsoft Bookings. We use your details for this appointment only.",
    privacyLink: "Privacy",
    doneTitle: "Thank you, {name}. Your appointment is booked.",
    doneWith: "with",
    doneText: "The confirmation comes by email. If something comes up, please call us.",
    errName: "Please enter your name.",
    errEmail: "Please enter a valid email address.",
    errPhone: "Please enter a phone number.",
    errMessage: "Please shorten your details.",
    errAnswer: "Please answer this question.",
    errTaken: "This time has just been taken. Please choose another one.",
    errSend: "That did not work, sorry. Please try again or call us: +49 8168 909910.",
    down: "The calendar cannot be reached right now. You can book directly at Microsoft Bookings or call us.",
    external: "Open the calendar at Microsoft",
  },
};

/** English wording for what the calendar holds in German; anything not listed shows as it is. */
const EN_TEXT: Record<string, string> = {
  "Küchenplanung im Showroom": "Kitchen planning in the showroom",
  "Sie möchten direkt mit der Küchenplanung starten? Vereinbaren Sie hier Ihren kostenlosen und unverbindlichen Planungstermin in unserem Showroom.":
    "Ready to start planning your kitchen? Book your free planning appointment in our showroom, without obligation.",
  "Telefonische Erstberatung für Ihre Traumküche": "First consultation by phone",
  "Sie haben Interesse an einer individuellen Küche aus der Beer Küchenmanufaktur, haben jedoch vorab noch einige Fragen? Gerne rufen wir Sie zu Ihrem Wunschtermin an.":
    "You are interested in a kitchen made by BEER but have a few questions first? We will call you at the time you choose.",
  "Informationen zur Küche": "About your kitchen",
  "Haben Sie einen Empfehlungscode?": "Do you have a referral code?",
};

const WEEKDAYS: Record<Locale, string[]> = {
  de: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
  en: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
};

/** Pause after a tap before the next step slides in, as in the planner. */
const ADVANCE_MS = 180;
/** Length of the leaving animation (`planner-out`). */
const LEAVE_MS = 220;

function pad(value: number) {
  return String(value).padStart(2, "0");
}
function monthOf(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}
function shiftMonth(month: string, by: number) {
  const [year, index] = month.split("-").map(Number);
  const moved = new Date(Date.UTC(year, index - 1 + by, 1));
  return `${moved.getUTCFullYear()}-${pad(moved.getUTCMonth() + 1)}`;
}

function clock() {
  return Date.now();
}

async function fetchJson(url: string): Promise<Record<string, unknown> | null> {
  const response = await fetch(url, { credentials: "same-origin", cache: "no-store" });
  const data: unknown = await response.json().catch(() => null);
  return response.ok && data && typeof data === "object" && "ok" in data && data.ok === true ? (data as Record<string, unknown>) : null;
}

async function fetchChallenge() {
  const data = await fetchJson("/api/lead/challenge").catch(() => null);
  return typeof data?.challenge === "string" ? data.challenge : "";
}

export default function BookingPanel({ locale }: { locale: Locale }) {
  const ui = UI[locale];
  const tr = (value: string) => (locale === "en" ? (EN_TEXT[value] ?? value) : value);
  const baseId = useId();
  const router = useRouter();
  const screenHeading = useRef<HTMLHeadingElement>(null);
  const loadedAt = useRef(0);
  const browsed = useRef(false);
  const moved = useRef(false);
  const advanceTimer = useRef(0);
  const leaveTimer = useRef(0);

  /** undefined: loading, null: not reachable. */
  const [setup, setSetup] = useState<BookingSetup | null | undefined>(undefined);
  const [serviceId, setServiceId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [month, setMonth] = useState("");
  const [months, setMonths] = useState<Record<string, BookingDays | "error">>({});
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [fields, setFields] = useState({ name: "", email: "", phone: "" });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [challenge, setChallenge] = useState("");
  const [booked, setBooked] = useState<Booked | null>(null);
  const [today] = useState(() => new Date());
  const [step, setStep] = useState<Step>("service");
  const [direction, setDirection] = useState<"forward" | "back" | undefined>(undefined);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const data = await fetchJson("/api/booking").catch(() => null);
      if (cancelled) return;
      const services = data && Array.isArray(data.services) ? (data.services as BookingService[]) : [];
      setSetup(services.length > 0 ? { services, staff: Array.isArray(data?.staff) ? (data.staff as BookingSetup["staff"]) : [] } : null);
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const service = setup?.services.find((item) => item.id === serviceId);
  const firstMonth = monthOf(today);
  const lastMonth = service ? monthOf(new Date(today.getTime() + service.advanceDays * 24 * 60 * 60 * 1000)) : firstMonth;
  const key = `${serviceId}|${month}`;
  const loaded = months[key];

  // Free times of the month on show. A first month with nothing free moves on to the next one.
  useEffect(() => {
    if (!serviceId || !month || months[key] !== undefined) return;
    let cancelled = false;
    const load = async () => {
      const data = await fetchJson(`/api/booking?service=${encodeURIComponent(serviceId)}&month=${month}`).catch(() => null);
      if (cancelled) return;
      const days = data && data.days && typeof data.days === "object" ? (data.days as BookingDays) : null;
      setMonths((current) => ({ ...current, [key]: days ?? "error" }));
      if (days && Object.keys(days).length === 0 && !browsed.current && month < lastMonth) setMonth(shiftMonth(month, 1));
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [serviceId, month, key, months, lastMonth]);

  // The booking endpoint wants a challenge that is at least 1.5 s old; fetch it once a service is chosen.
  useEffect(() => {
    if (!serviceId) return;
    let cancelled = false;
    const load = async () => {
      const token = await fetchChallenge();
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
  }, [serviceId]);

  // After a step change (not on the first view) the new heading takes the focus, for keyboards and screen readers.
  useEffect(() => {
    if (moved.current && !leaving) screenHeading.current?.focus({ preventScroll: true });
  }, [step, status, leaving]);

  useEffect(
    () => () => {
      window.clearTimeout(advanceTimer.current);
      window.clearTimeout(leaveTimer.current);
    },
    [],
  );

  const days = loaded && loaded !== "error" ? loaded : {};
  const slotsOf = (day: string) => (days[day] ?? []).filter((slot) => !staffId || slot.s.includes(staffId));
  const freeDays = Object.keys(days)
    .filter((day) => slotsOf(day).length > 0)
    .sort();
  const activeDate = freeDays.includes(date) ? date : (freeDays[0] ?? "");
  const slots = activeDate ? slotsOf(activeDate) : [];
  const activeTime = slots.some((slot) => slot.t === time) ? time : "";
  const peopleOf = (item: BookingService | undefined) => (item ? (setup?.staff ?? []).filter((person) => item.staff.includes(person.id)) : []);
  const people = peopleOf(service);

  // The "with whom" step only exists when the chosen service (or, before a choice, any service) has more than one person.
  const hasStaffStep = service ? people.length > 1 : (setup?.services ?? []).some((item) => peopleOf(item).length > 1);
  const steps: Step[] = ["service", ...(hasStaffStep ? (["staff"] as const) : []), "when", "details"];
  const index = Math.max(0, steps.indexOf(step));

  const intl = locale === "de" ? "de-DE" : "en-GB";
  const monthLabel = (value: string) => {
    const [year, at] = value.split("-").map(Number);
    return new Intl.DateTimeFormat(intl, { month: "long", year: "numeric", timeZone: "UTC" }).format(Date.UTC(year, at - 1, 1));
  };
  const dayLabel = (value: string) => new Intl.DateTimeFormat(intl, { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(Date.parse(`${value}T00:00:00Z`));
  const whenLabel = (day: string, at: string) => `${dayLabel(day)}, ${at}${ui.clock ? ` ${ui.clock}` : ""}`;
  const length = (minutes: number) => (minutes % 60 === 0 ? `${minutes / 60} ${minutes === 60 ? ui.hour : ui.hours}` : `${minutes} ${ui.minutes}`);

  /** Moves to another step: the current one slides out, the next slides in from the side it comes from. */
  function goTo(next: Step, towards: "forward" | "back") {
    window.clearTimeout(advanceTimer.current);
    window.clearTimeout(leaveTimer.current);
    const apply = () => {
      moved.current = true;
      setLeaving(false);
      setDirection(towards);
      setStep(next);
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply();
      return;
    }
    setDirection(towards);
    setLeaving(true);
    leaveTimer.current = window.setTimeout(apply, LEAVE_MS);
  }
  /** A tap that answers the step moves on after a short pause, so the choice is seen first. */
  function advance(next: Step) {
    window.clearTimeout(advanceTimer.current);
    advanceTimer.current = window.setTimeout(() => goTo(next, "forward"), ADVANCE_MS);
  }
  function back() {
    if (index > 0) goTo(steps[index - 1], "back");
  }

  function chooseService(id: string) {
    const chosen = setup?.services.find((item) => item.id === id);
    if (id !== serviceId) {
      browsed.current = false;
      setServiceId(id);
      setStaffId("");
      setMonth(firstMonth);
      setDate("");
      setTime("");
    }
    setError("");
    advance(peopleOf(chosen).length > 1 ? "staff" : "when");
  }
  function chooseStaff(id: string) {
    setStaffId(id);
    setTime("");
    advance("when");
  }
  function chooseTime(value: string) {
    setDate(activeDate);
    setTime(value);
    setError("");
    advance("details");
  }
  function turnMonth(by: number) {
    browsed.current = true;
    setMonth(shiftMonth(month, by));
    setDate("");
    setTime("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending" || !service || !activeDate || !activeTime) return;
    const honeypot = String(new FormData(event.currentTarget).get("company_website") ?? "");
    const checked = honeypot ? ({ ok: true, name: "", email: "", phone: "", message: "" } as const) : validateLeadFields(fields);
    if (!checked.ok) {
      const messages = { invalid_name: ui.errName, invalid_email: ui.errEmail, invalid_phone: ui.errPhone, invalid_message: ui.errMessage };
      setError(messages[checked.reason]);
      document.getElementById(`${baseId}-${checked.field}`)?.focus();
      return;
    }
    const missing = service.questions.find((question) => question.required && !answers[question.id]?.trim());
    if (missing && !honeypot) {
      setError(ui.errAnswer);
      document.getElementById(`${baseId}-q-${missing.id}`)?.focus();
      return;
    }

    setStatus("sending");
    setError("");
    try {
      let token = challenge;
      if (!token) {
        token = await fetchChallenge();
        loadedAt.current = clock();
        setChallenge(token);
      }
      const wait = 1600 - (clock() - loadedAt.current);
      if (wait > 0) await new Promise((resolve) => window.setTimeout(resolve, wait));

      const response = await fetch("/api/booking", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          challenge: token,
          company_website: honeypot,
          service: service.id,
          date: activeDate,
          time: activeTime,
          staff: staffId,
          name: checked.name,
          email: checked.email,
          phone: checked.phone,
          answers,
          locale,
          ...conversionContext(),
        }),
      });
      const payload: unknown = await response.json().catch(() => null);
      const result = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
      if (!(response.ok && result.ok === true) && !honeypot) {
        setStatus("error");
        setChallenge("");
        if (result.error === "slot_taken") {
          // Someone was quicker: load the month afresh and send the visitor back to pick again.
          setError(ui.errTaken);
          setTime("");
          setMonths((current) => Object.fromEntries(Object.entries(current).filter(([entry]) => entry !== key)));
          goTo("when", "back");
        } else {
          setError(ui.errSend);
        }
        return;
      }
      if (!honeypot) {
        const eventId = typeof result.event_id === "string" ? result.event_id : "";
        trackCompletion("booking_complete", eventId, { form: "termin", service: tr(service.title) });
        await trackLead(eventId, { email: checked.email, phone: checked.phone, place: "" }, "termin");
      }
      const staffName = typeof result.staff === "string" ? result.staff : "";
      const summary = {
        service: tr(service.title),
        when: whenLabel(activeDate, activeTime),
        staff: staffName,
        name: fields.name.trim().split(/\s+/)[0] ?? "",
      };
      setBooked(summary);
      moved.current = true;
      setStatus("done");
      setChallenge("");
      if (!honeypot) {
        // The thank-you page (/kontakt/danke) shows what was booked, as the contract asks.
        saveThanks("booking", { name: summary.name, lines: [summary.service, `${summary.when}${staffName ? `, ${ui.doneWith} ${staffName}` : ""}`] });
        router.push(withLocale("/kontakt/danke", locale));
      }
    } catch {
      setStatus("error");
      setError(ui.errSend);
    }
  }

  const input = "form-field";
  const label = "form-label";
  const chip = (on: boolean) =>
    cn(
      "min-h-12 border px-4 py-2 font-sans text-[15px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
      on ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink hover:border-ink",
    );

  const field = (name: "name" | "email" | "phone", type: string, autoComplete: string) => (
    <div>
      <label htmlFor={`${baseId}-${name}`} className={label}>
        {ui[name]}
        <span aria-hidden="true"> *</span>
        <span className="sr-only"> ({ui.required})</span>
      </label>
      <input
        id={`${baseId}-${name}`}
        type={type}
        autoComplete={autoComplete}
        required
        aria-required
        placeholder={fieldHint(autoComplete, locale)}
        value={fields[name]}
        onChange={(event) => setFields((current) => ({ ...current, [name]: event.target.value }))}
        className={input}
      />
    </div>
  );

  function calendar() {
    const [year, at] = month.split("-").map(Number);
    const lead = (new Date(Date.UTC(year, at - 1, 1)).getUTCDay() + 6) % 7;
    const count = new Date(Date.UTC(year, at, 0)).getUTCDate();
    // Always six weeks, so the calendar keeps its height from month to month.
    const cells: (string | null)[] = [...Array<null>(lead).fill(null), ...Array.from({ length: count }, (_, day) => `${month}-${pad(day + 1)}`)];
    while (cells.length < 42) cells.push(null);
    const arrow = "flex h-11 w-11 items-center justify-center text-ink transition-opacity hover:opacity-60 disabled:opacity-25";
    return (
      <div>
        <div className="flex items-center justify-between">
          <button type="button" className={arrow} onClick={() => turnMonth(-1)} disabled={month <= firstMonth} aria-label={ui.prev}>
            <span aria-hidden="true">←</span>
          </button>
          <p className="font-sans text-[16px] text-ink" aria-live="polite">
            {monthLabel(month)}
          </p>
          <button type="button" className={arrow} onClick={() => turnMonth(1)} disabled={month >= lastMonth} aria-label={ui.next}>
            <span aria-hidden="true">→</span>
          </button>
        </div>
        <div className="mt-2 grid grid-cols-7 text-center font-sans text-[12px] text-muted" aria-hidden="true">
          {WEEKDAYS[locale].map((day) => (
            <span key={day} className="py-1">
              {day}
            </span>
          ))}
        </div>
        <div className={cn("grid grid-cols-7 justify-items-center gap-y-1 transition-opacity", loaded === undefined && "opacity-40")}>
          {cells.map((day, position) => {
            if (!day) return <span key={`blank-${position}`} className="h-10 w-10" />;
            const free = freeDays.includes(day);
            const on = day === activeDate;
            return (
              <button
                key={day}
                type="button"
                disabled={!free}
                aria-pressed={on}
                aria-label={dayLabel(day)}
                onClick={() => {
                  setDate(day);
                  setTime("");
                }}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full font-sans text-[15px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
                  on ? "bg-ink text-paper" : free ? "text-ink hover:bg-karte" : "text-muted/40",
                )}
              >
                {Number(day.slice(8))}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const headings: Record<Step, string> = { service: ui.stepService, staff: ui.stepStaff, when: ui.stepWhen, details: ui.stepDetails };
  const progress = ui.progress.replace("{n}", String(index + 1)).replace("{total}", String(steps.length));
  const centered = "my-auto px-6 py-16 text-center sm:px-10";

  function screenBody() {
    if (step === "service") {
      return (
        <>
          <div role="radiogroup" aria-labelledby={`${baseId}-screen`} className="mx-auto grid w-full max-w-5xl gap-5 sm:grid-cols-2 sm:gap-8 lg:gap-12">
            {setup === undefined
              ? [0, 1].map((item) => <div key={item} className="h-32 animate-pulse border border-line bg-karte motion-reduce:animate-none sm:h-72" />)
              : (setup?.services ?? []).map((item) => {
                  const on = item.id === serviceId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => chooseService(item.id)}
                      data-umami-event="booking_service"
                      className={cn(
                        "flex flex-col items-start border p-5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:min-h-72 sm:p-10",
                        on ? "border-ink bg-karte" : "border-line hover:border-ink hover:bg-karte/50",
                      )}
                    >
                      <span className="font-serif text-[22px] leading-snug text-ink sm:text-[26px]">{tr(item.title)}</span>
                      <span className="mt-3 hidden font-sans text-[15px] leading-[1.65] font-light text-ink/85 sm:block">{tr(item.description)}</span>
                      <span className="mt-auto pt-3 font-sans sm:pt-6 text-[13px] tracking-[0.08em] text-gold uppercase">
                        {length(item.minutes)} · {item.place || ui.phoneCall}
                      </span>
                    </button>
                  );
                })}
          </div>
          <p className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center font-sans text-[14px] text-muted">
            <span>
              {ui.call}{" "}
              <a href="tel:+498168909910" className="whitespace-nowrap text-ink underline underline-offset-4" data-umami-event="tel_click">
                {ui.phoneLabel}
              </a>
            </span>
            <LocaleLink href={MAIN_ACTIONS.planner.href} className="underline underline-offset-4 hover:text-ink" data-umami-event="cta_planner" data-umami-event-placement="booking">
              {ui.planner}
            </LocaleLink>
          </p>
        </>
      );
    }

    if (step === "staff") {
      return (
        <div role="radiogroup" aria-labelledby={`${baseId}-screen`} className="mx-auto grid w-full max-w-3xl gap-3 sm:grid-cols-2 sm:gap-4">
          {[{ id: "", name: ui.anyone }, ...people].map((person) => (
            <button key={person.id || "any"} type="button" role="radio" aria-checked={staffId === person.id} onClick={() => chooseStaff(person.id)} className={cn(chip(staffId === person.id), "min-h-14 text-[16px]")}>
              {person.name}
            </button>
          ))}
        </div>
      );
    }

    if (step === "when") {
      return (
        <div className="mx-auto grid w-full max-w-4xl gap-10 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:gap-14">
          <div>{calendar()}</div>
          {/* A fixed height for the times, so a day with many or few slots does not move the page. */}
          <div className="md:min-h-[22rem]" aria-live="polite">
            {loaded === undefined ? (
              <p className="font-sans text-[15px] text-muted">{ui.loading}</p>
            ) : loaded === "error" ? (
              <div>
                <p className="font-sans text-[15px] text-ink">{ui.monthError}</p>
                <button type="button" className="btn-quiet mt-4" onClick={() => setMonths((current) => Object.fromEntries(Object.entries(current).filter(([entry]) => entry !== key)))}>
                  {ui.retry}
                </button>
              </div>
            ) : freeDays.length === 0 ? (
              <p className="font-sans text-[15px] text-muted">{ui.noneMonth}</p>
            ) : (
              <>
                <p className="font-sans text-[16px] text-ink">{dayLabel(activeDate)}</p>
                <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4" role="radiogroup" aria-label={ui.stepWhen}>
                  {slots.map((slot) => (
                    <button key={slot.t} type="button" role="radio" aria-checked={slot.t === activeTime} onClick={() => chooseTime(slot.t)} className={chip(slot.t === activeTime)}>
                      {slot.t}
                    </button>
                  ))}
                </div>
                <p className="mt-4 form-label">{ui.zone}</p>
              </>
            )}
            <p role="alert" className="mt-4 font-sans text-[14px] text-destructive empty:hidden">
              {error}
            </p>
          </div>
        </div>
      );
    }

    // Details.
    return service && activeTime ? (
      <div className="mx-auto w-full max-w-3xl">
        <p className="text-center font-sans text-[16px] text-ink">
          {tr(service.title)}
          <br />
          <span className="text-muted">{whenLabel(activeDate, activeTime)}</span>
        </p>
        <div className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {field("name", "text", "name")}
          {field("email", "email", "email")}
          {field("phone", "tel", "tel")}
        </div>
        {service.questions.map((question) => (
          <div key={question.id} className="mt-5">
            <label htmlFor={`${baseId}-q-${question.id}`} className={label}>
              {tr(question.text)}
              {question.required ? <span aria-hidden="true"> *</span> : null}
            </label>
            <textarea
              id={`${baseId}-q-${question.id}`}
              rows={1}
              maxLength={1000}
              value={answers[question.id] ?? ""}
              onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))}
              className={`${input} max-h-32 resize-none [field-sizing:content]`}
            />
          </div>
        ))}
        <p role="alert" className="mt-4 font-sans text-[14px] text-destructive empty:hidden">
          {error}
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 text-center">
          <button type="submit" disabled={status === "sending"} className="pill pill-primary" data-umami-event="booking_submit">
            {status === "sending" ? ui.sending : ui.submit}
          </button>
          <p className="max-w-md font-sans text-[13px] leading-5 text-muted">
            {ui.privacy}{" "}
            <LocaleLink href="/datenschutz" className="underline underline-offset-4 hover:text-ink">
              {ui.privacyLink}
            </LocaleLink>
          </p>
        </div>
      </div>
    ) : null;
  }

  return (
    <section id="termin" className="scroll-mt-14 bg-paper" aria-labelledby={`${baseId}-title`}>
      <h1 id={`${baseId}-title`} className="sr-only">
        {ui.title}
      </h1>
      {/* One step fills one screen: as high as the window under the header. */}
      <form onSubmit={submit} noValidate className="relative flex min-h-[calc(100svh-var(--header-space))] flex-col bg-paper">
        {/* Honeypot for bots; hidden from people and screen readers. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Website
            <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        {status === "done" && booked ? (
          <div className={centered}>
            <div aria-hidden="true" className="mx-auto mb-7 h-px w-14 bg-messing" />
            <h2 ref={screenHeading} tabIndex={-1} className="font-serif text-[24px] leading-tight font-medium text-ink outline-none md:text-[32px] xl:text-[42px]">
              {ui.doneTitle.replace("{name}", booked.name)}
            </h2>
            <p className="mx-auto mt-5 max-w-md font-sans text-[17px] leading-[1.6] text-ink">
              {booked.service}
              <br />
              {booked.when}
              {booked.staff ? `, ${ui.doneWith} ${booked.staff}` : ""}
            </p>
            <p className="mx-auto mt-4 max-w-md font-sans text-[16px] leading-[1.7] font-light text-ink/85">{ui.doneText}</p>
          </div>
        ) : setup === null ? (
          <div className={centered}>
            <h2 className="font-serif text-[24px] leading-tight font-medium text-ink md:text-[32px]">{ui.title}</h2>
            <p className="mx-auto mt-5 max-w-md font-sans text-[16px] leading-[1.7] text-ink">{ui.down}</p>
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="pill pill-primary mt-7" data-umami-event="booking_new_tab">
              {ui.external}
            </a>
          </div>
        ) : (
          <>
            {/* Back + thin progress bar, as wide as the choices below, as in the planner. */}
            <div className="mx-auto w-full max-w-5xl shrink-0 px-5 pt-1 sm:px-10 sm:pt-3">
              <div className="flex min-h-11 items-center justify-between">
                {index > 0 ? (
                  <button type="button" onClick={back} className="inline-flex min-h-10 items-center gap-2 font-sans text-[14px] text-ink hover:opacity-70">
                    <span aria-hidden="true">←</span> {ui.back}
                  </button>
                ) : (
                  <span />
                )}
                <p className="font-sans text-[12px] tracking-[0.16em] text-muted uppercase">{progress}</p>
              </div>
              <div className="mt-1 h-0.5 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuemin={1} aria-valuemax={steps.length} aria-valuenow={index + 1} aria-label={progress}>
                <div className="h-full bg-messing transition-[width] duration-500" style={{ width: `${((index + 1) / steps.length) * 100}%` }} />
              </div>
            </div>

            <div
              key={step}
              data-direction={direction}
              data-leaving={leaving ? "" : undefined}
              className="planner-screen flex flex-1 flex-col px-5 pt-6 pb-10 sm:px-10 sm:pt-12 lg:pt-16"
            >
              <div className="mx-auto max-w-3xl shrink-0 text-center">
                <h2 id={`${baseId}-screen`} ref={screenHeading} tabIndex={-1} className="font-serif text-[26px] leading-[1.15] font-medium text-ink outline-none md:text-[36px]">
                  {headings[step]}
                </h2>
                {step === "service" ? <p className="mt-2 font-sans text-[15px] leading-snug text-muted">{ui.hintService}</p> : null}
              </div>
              <div className="mt-6 flex w-full flex-col sm:mt-12">{screenBody()}</div>
            </div>
          </>
        )}
      </form>
    </section>
  );
}
