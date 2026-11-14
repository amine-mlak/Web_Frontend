"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import LocaleLink from "@/components/LocaleLink";
import type { BookingDays, BookingService, BookingSetup } from "@/lib/bookings";
import { conversionContext } from "@/lib/conversion";
import { BOOKING_URL, MAIN_ACTIONS } from "@/lib/cta";
import { trackLead } from "@/lib/form-tracking";
import type { Locale } from "@/lib/i18n";
import { validateLeadFields } from "@/lib/lead-fields";
import { cn } from "@/lib/utils";

/**
 * Booking an appointment on /kontakt: the team's Microsoft Bookings calendar in the site's own
 * design. Services, people and free times are read live through /api/booking (lib/bookings.ts),
 * and the booking lands in the same calendar as one made on Microsoft's page. The steps follow
 * that page: what, with whom, day, time, contact details.
 */

type Status = "idle" | "sending" | "done" | "error";
type Booked = { service: string; when: string; staff: string; name: string };

const UI: Record<Locale, Record<string, string>> = {
  de: {
    eyebrow: "Erstgespräch",
    title: "Termin vereinbaren",
    text: "Planung im Showroom oder ein kurzer Anruf vorab: Wählen Sie, was passt, und buchen Sie Tag und Uhrzeit direkt im Kalender unseres Teams.",
    call: "Oder rufen Sie an:",
    phoneLabel: "08168 909910",
    planner: "Erst Ideen sammeln? Zum Küchenplaner",
    stepService: "Was möchten Sie vereinbaren?",
    stepStaff: "Mit wem?",
    anyone: "Wer gerade frei ist",
    stepDate: "Tag",
    stepTime: "Uhrzeit",
    stepDetails: "Ihre Angaben",
    phoneCall: "am Telefon",
    hour: "Stunde",
    hours: "Stunden",
    minutes: "Minuten",
    prev: "Vorheriger Monat",
    next: "Nächster Monat",
    loading: "Freie Zeiten werden geladen …",
    noneMonth: "In diesem Monat ist nichts mehr frei.",
    noneDay: "Bitte zuerst einen Tag wählen.",
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
    eyebrow: "First conversation",
    title: "Book an appointment",
    text: "Planning in the showroom or a short call first: choose what suits you and book the day and time directly in our team's calendar.",
    call: "Or call us:",
    phoneLabel: "+49 8168 909910",
    planner: "Collect ideas first? To the kitchen planner",
    stepService: "What would you like to book?",
    stepStaff: "With whom?",
    anyone: "Whoever is free",
    stepDate: "Day",
    stepTime: "Time",
    stepDetails: "Your details",
    phoneCall: "by phone",
    hour: "hour",
    hours: "hours",
    minutes: "minutes",
    prev: "Previous month",
    next: "Next month",
    loading: "Loading free times …",
    noneMonth: "Nothing is free in this month any more.",
    noneDay: "Please choose a day first.",
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
  const doneHeading = useRef<HTMLHeadingElement>(null);
  const loadedAt = useRef(0);
  const browsed = useRef(false);

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

  useEffect(() => {
    if (status === "done") doneHeading.current?.focus();
  }, [status]);

  const days = loaded && loaded !== "error" ? loaded : {};
  const slotsOf = (day: string) => (days[day] ?? []).filter((slot) => !staffId || slot.s.includes(staffId));
  const freeDays = Object.keys(days)
    .filter((day) => slotsOf(day).length > 0)
    .sort();
  const activeDate = freeDays.includes(date) ? date : (freeDays[0] ?? "");
  const slots = activeDate ? slotsOf(activeDate) : [];
  const activeTime = slots.some((slot) => slot.t === time) ? time : "";
  const people = service ? (setup?.staff ?? []).filter((person) => service.staff.includes(person.id)) : [];

  const intl = locale === "de" ? "de-DE" : "en-GB";
  const monthLabel = (value: string) => {
    const [year, index] = value.split("-").map(Number);
    return new Intl.DateTimeFormat(intl, { month: "long", year: "numeric", timeZone: "UTC" }).format(Date.UTC(year, index - 1, 1));
  };
  const dayLabel = (value: string) => new Intl.DateTimeFormat(intl, { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(Date.parse(`${value}T00:00:00Z`));
  const whenLabel = (day: string, clock: string) => `${dayLabel(day)}, ${clock}${ui.clock ? ` ${ui.clock}` : ""}`;
  const length = (minutes: number) => (minutes % 60 === 0 ? `${minutes / 60} ${minutes === 60 ? ui.hour : ui.hours}` : `${minutes} ${ui.minutes}`);

  function chooseService(id: string) {
    browsed.current = false;
    setServiceId(id);
    setStaffId("");
    setMonth(firstMonth);
    setDate("");
    setTime("");
    setError("");
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
          // Someone was quicker: load the month afresh and let the visitor pick again.
          setError(ui.errTaken);
          setTime("");
          setMonths((current) => Object.fromEntries(Object.entries(current).filter(([entry]) => entry !== key)));
        } else {
          setError(ui.errSend);
        }
        return;
      }
      if (!honeypot) {
        void trackLead(typeof result.event_id === "string" ? result.event_id : "", { email: checked.email, phone: checked.phone, place: "" }, "termin");
      }
      setBooked({
        service: tr(service.title),
        when: whenLabel(activeDate, activeTime),
        staff: typeof result.staff === "string" ? result.staff : "",
        name: fields.name.trim().split(/\s+/)[0] ?? "",
      });
      setStatus("done");
      setChallenge("");
    } catch {
      setStatus("error");
      setError(ui.errSend);
    }
  }

  const stepTitle = "font-sans text-[13px] tracking-[0.08em] text-muted uppercase";
  const input = "mt-0.5 w-full border-0 border-b border-line bg-transparent py-2 font-sans text-[16px] text-ink outline-none placeholder:text-muted focus:border-ink";
  const label = "font-sans text-[13px] text-muted";
  const chip = (on: boolean) =>
    cn(
      "min-h-11 border px-3 py-2 font-sans text-[15px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
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
        value={fields[name]}
        onChange={(event) => setFields((current) => ({ ...current, [name]: event.target.value }))}
        className={input}
      />
    </div>
  );

  function calendar() {
    const [year, index] = month.split("-").map(Number);
    const lead = (new Date(Date.UTC(year, index - 1, 1)).getUTCDay() + 6) % 7;
    const count = new Date(Date.UTC(year, index, 0)).getUTCDate();
    const cells: (string | null)[] = [...Array<null>(lead).fill(null), ...Array.from({ length: count }, (_, day) => `${month}-${pad(day + 1)}`)];
    const arrow = "flex h-10 w-10 items-center justify-center text-ink transition-opacity hover:opacity-60 disabled:opacity-25";
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
        <div className={cn("grid grid-cols-7 justify-items-center gap-y-1", loaded === undefined && "opacity-40")}>
          {cells.map((day, position) => {
            if (!day) return <span key={`blank-${position}`} />;
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

  return (
    <section id="termin" className="scroll-mt-20 bg-karte px-5 py-16 sm:px-8 md:py-24 lg:px-gutter" aria-labelledby="termin-title">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <p className="type-eyebrow text-gold">{ui.eyebrow}</p>
          <h2 id="termin-title" className="t-section mt-4 text-ink">
            {ui.title}
          </h2>
          <p className="mt-5 max-w-md font-sans text-[16px] leading-[1.7] font-light text-ink/85">{ui.text}</p>
          <p className="mt-6 font-sans text-[16px] text-ink">
            {ui.call}{" "}
            <a href="tel:+498168909910" className="whitespace-nowrap underline underline-offset-4" data-umami-event="tel_click">
              {ui.phoneLabel}
            </a>
          </p>
          <LocaleLink href={MAIN_ACTIONS.planner.href} className="btn-quiet mt-6" data-umami-event="cta_planner" data-umami-event-placement="booking">
            {ui.planner}
          </LocaleLink>
        </div>

        <div className="bg-paper px-5 py-8 sm:px-10 sm:py-10 lg:col-span-8">
          {status === "done" && booked ? (
            <div className="py-10 text-center">
              <div aria-hidden="true" className="mx-auto mb-7 h-px w-14 bg-messing" />
              <h3 ref={doneHeading} tabIndex={-1} className="t-feature text-ink outline-none">
                {ui.doneTitle.replace("{name}", booked.name)}
              </h3>
              <p className="mx-auto mt-5 max-w-md font-sans text-[17px] leading-[1.6] text-ink">
                {booked.service}
                <br />
                {booked.when}
                {booked.staff ? `, ${ui.doneWith} ${booked.staff}` : ""}
              </p>
              <p className="mx-auto mt-4 max-w-md font-sans text-[16px] leading-[1.7] font-light text-ink/85">{ui.doneText}</p>
            </div>
          ) : setup === null ? (
            <div className="py-6">
              <p className="max-w-md font-sans text-[16px] leading-[1.7] text-ink">{ui.down}</p>
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="pill pill-primary mt-7" data-umami-event="booking_new_tab">
                {ui.external}
              </a>
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              <div role="radiogroup" aria-labelledby={`${baseId}-service`}>
                <h3 id={`${baseId}-service`} className={stepTitle}>
                  {ui.stepService}
                </h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {setup === undefined
                    ? [0, 1].map((item) => <div key={item} className="h-40 animate-pulse border border-line bg-karte motion-reduce:animate-none" />)
                    : setup.services.map((item) => {
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
                              "flex flex-col items-start border p-5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
                              on ? "border-ink bg-karte" : "border-line hover:border-ink",
                            )}
                          >
                            <span className="font-sans text-[18px] leading-snug text-ink">{tr(item.title)}</span>
                            <span className="mt-2 font-sans text-[14px] leading-[1.6] font-light text-ink/85">{tr(item.description)}</span>
                            <span className="mt-auto pt-4 font-sans text-[13px] text-gold">
                              {length(item.minutes)} · {item.place || ui.phoneCall}
                            </span>
                          </button>
                        );
                      })}
                </div>
              </div>

              {service ? (
                <>
                  {people.length > 1 ? (
                    <div role="radiogroup" aria-labelledby={`${baseId}-staff`}>
                      <h3 id={`${baseId}-staff`} className={stepTitle}>
                        {ui.stepStaff}
                      </h3>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {[{ id: "", name: ui.anyone }, ...people].map((person) => (
                          <button key={person.id || "any"} type="button" role="radio" aria-checked={staffId === person.id} onClick={() => setStaffId(person.id)} className={chip(staffId === person.id)}>
                            {person.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="grid gap-10 md:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] md:gap-12">
                    <div>
                      <h3 className={stepTitle}>{ui.stepDate}</h3>
                      <div className="mt-3">{calendar()}</div>
                    </div>
                    <div>
                      <h3 className={stepTitle}>{ui.stepTime}</h3>
                      <div className="mt-4" aria-live="polite">
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
                            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-3 xl:grid-cols-4" role="radiogroup" aria-label={ui.stepTime}>
                              {slots.map((slot) => (
                                <button key={slot.t} type="button" role="radio" aria-checked={slot.t === activeTime} onClick={() => setTime(slot.t)} className={chip(slot.t === activeTime)}>
                                  {slot.t}
                                </button>
                              ))}
                            </div>
                            <p className="mt-4 font-sans text-[13px] text-muted">{ui.zone}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {activeTime ? (
                    <form onSubmit={submit} noValidate className="relative">
                      <h3 className={stepTitle}>{ui.stepDetails}</h3>
                      <p className="mt-3 font-sans text-[16px] text-ink">
                        {tr(service.title)} · {whenLabel(activeDate, activeTime)}
                      </p>
                      {/* Honeypot for bots; hidden from people and screen readers. */}
                      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                        <label>
                          Website
                          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
                        </label>
                      </div>
                      <div className="mt-6 grid gap-x-7 gap-y-5 sm:grid-cols-2">
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
                            className={`${input} max-h-40 resize-none [field-sizing:content]`}
                          />
                        </div>
                      ))}
                      <p role="alert" className="mt-4 font-sans text-[14px] text-destructive empty:hidden">
                        {error}
                      </p>
                      <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-4">
                        <button type="submit" disabled={status === "sending"} className="pill pill-primary" data-umami-event="booking_submit">
                          {status === "sending" ? ui.sending : ui.submit}
                        </button>
                        <p className="max-w-sm font-sans text-[13px] leading-5 text-muted">
                          {ui.privacy}{" "}
                          <LocaleLink href="/datenschutz" className="underline underline-offset-4 hover:text-ink">
                            {ui.privacyLink}
                          </LocaleLink>
                        </p>
                      </div>
                    </form>
                  ) : (
                    <p role="alert" className="font-sans text-[14px] text-destructive empty:hidden">
                      {error}
                    </p>
                  )}
                </>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
