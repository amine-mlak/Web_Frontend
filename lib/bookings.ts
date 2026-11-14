/**
 * The team's Microsoft Bookings calendar, read and written from the server.
 *
 * These are the addresses Microsoft's own public booking page uses, and they answer without a
 * sign-in: services, people, questions, free and busy times of every person, and the booking
 * itself. The site shows that in its own design (components/BookingPanel.tsx) and nothing is
 * kept twice: services, people, durations, buffers and working hours are all set in Microsoft
 * Bookings.
 *
 * Microsoft does not document these addresses. The documented way is Microsoft Graph
 * (solutions/bookingBusinesses/{id}/getStaffAvailability and /appointments), which needs an app
 * registration with admin consent; its data has the same shape, so a switch stays inside this file.
 *
 * All times are wall-clock times in the business time zone, as Microsoft sends them. For
 * arithmetic they are read as if they were UTC, which keeps them free of the server's own zone.
 */

const BUSINESS = process.env.BOOKINGS_BUSINESS?.trim() || "BEERGmbH@beer.de";
const BASE = `https://bookings.cloud.microsoft/BookingsService/api/V1/bookingBusinessesc2/${BUSINESS}`;
/** The business time zone, in Microsoft's name and in the IANA one. */
const ZONE_WINDOWS = "W. Europe Standard Time";
const ZONE_IANA = "Europe/Berlin";

const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;
const SETUP_TTL = 10 * MINUTE;
const SLOTS_TTL = 2 * MINUTE;

export type BookingQuestion = { id: string; text: string; required: boolean };

export type BookingService = {
  id: string;
  title: string;
  description: string;
  /** Length of the appointment, in minutes. */
  minutes: number;
  /** Where it takes place; empty for a call. */
  place: string;
  /** How far ahead a time can be booked, in days. */
  advanceDays: number;
  staff: string[];
  questions: BookingQuestion[];
};

type ServiceRules = { pre: number; post: number; step: number; lead: number };

export type BookingSetup = { services: BookingService[]; staff: { id: string; name: string }[] };

/** A free start time ("13:30") and the people who are free then. */
export type BookingSlot = { t: string; s: string[] };
export type BookingDays = Record<string, BookingSlot[]>;

type Raw = Record<string, unknown>;

function obj(value: unknown): Raw {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Raw) : {};
}
function list(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}
function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

/** ISO 8601 duration ("PT2H", "PT30M", "P1D") in minutes. */
function minutesOf(value: unknown) {
  const hit = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:\d+S)?)?$/.exec(text(value));
  if (!hit) return 0;
  return Number(hit[1] ?? 0) * 24 * 60 + Number(hit[2] ?? 0) * 60 + Number(hit[3] ?? 0);
}

async function call(path: string, body?: unknown, timeout = 20000): Promise<unknown> {
  const response = await fetch(`${BASE}/${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: { "content-type": "application/json; charset=utf-8", "x-anchormailbox": BUSINESS },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(timeout),
  });
  if (!response.ok) throw new Error(`bookings_${path.split("/")[0]}_${response.status}`);
  return response.json();
}

let setupCache: { at: number; setup: BookingSetup; rules: Map<string, ServiceRules> } | null = null;

async function loadSetup() {
  if (setupCache && Date.now() - setupCache.at < SETUP_TTL) return setupCache;
  try {
    const [servicesRaw, staffRaw, questionsRaw] = await Promise.all([call("services", {}), call("staffmembers"), call("customQuestions")]);

    const questionText = new Map<string, string>();
    for (const item of list(obj(questionsRaw).questions)) {
      const question = obj(item);
      // Only free-text questions are shown; the calendar has no others today.
      if (text(question.id) && list(question.answerOptions).length === 0) questionText.set(text(question.id), text(question.questionText));
    }

    const staffName = new Map<string, string>();
    for (const item of list(obj(staffRaw).staffMembers)) {
      const person = obj(item);
      // "Christian Fellner - BEER Küchen": the name is enough on BEER's own site.
      const name = text(person.displayName).replace(/\s+[-–]\s+BEER.*$/i, "");
      if (text(person.id) && name) staffName.set(text(person.id), name);
    }

    const rules = new Map<string, ServiceRules>();
    const services: BookingService[] = [];
    for (const item of list(obj(servicesRaw).service)) {
      const service = obj(item);
      const id = text(service.serviceId);
      const minutes = minutesOf(service.defaultDuration);
      if (!id || !minutes || service.isHiddenFromCustomers === true || service.isPrivate === true) continue;
      const policy = obj(service.bookingsSchedulingPolicy);
      const address = obj(obj(service.defaultLocation).address);
      const staff = list(service.staffMemberIds).map(text).filter((person) => staffName.has(person));
      if (staff.length === 0) continue;
      services.push({
        id,
        title: text(service.title),
        description: text(service.description),
        minutes,
        place: [text(address.name), text(address.city)].filter(Boolean).join(", "),
        advanceDays: Math.max(1, Math.round(minutesOf(policy.maximumAdvance) / (24 * 60)) || 60),
        staff,
        questions: list(service.customQuestions)
          .map((entry) => ({ id: text(obj(entry).questionGuid), required: obj(entry).required === true }))
          .filter((entry) => questionText.has(entry.id))
          .map((entry) => ({ ...entry, text: questionText.get(entry.id) ?? "" })),
      });
      rules.set(id, {
        pre: minutesOf(service.preBuffer),
        post: minutesOf(service.postBuffer),
        step: minutesOf(policy.timeSlotInterval) || 30,
        lead: minutesOf(policy.minimumLeadTime),
      });
    }

    const used = new Set(services.flatMap((service) => service.staff));
    const staff = [...staffName].filter(([id]) => used.has(id)).map(([id, name]) => ({ id, name }));
    setupCache = { at: Date.now(), setup: { services, staff }, rules };
    return setupCache;
  } catch (error) {
    // Microsoft not answering: carry on with the last good copy, if there is one.
    if (setupCache) return setupCache;
    throw error;
  }
}

export async function getBookingSetup(): Promise<BookingSetup> {
  return (await loadSetup()).setup;
}

/** Wall-clock time in the business zone, as milliseconds of the same reading in UTC. */
function businessNow() {
  const stamp = new Intl.DateTimeFormat("sv-SE", { timeZone: ZONE_IANA, dateStyle: "short", timeStyle: "medium" }).format(new Date());
  return Date.parse(`${stamp.replace(" ", "T")}Z`);
}

function stamp(ms: number) {
  return new Date(ms).toISOString().slice(0, 19);
}

const slotCache = new Map<string, { at: number; days: BookingDays }>();

/**
 * Free start times between two days (both "YYYY-MM-DD", the second exclusive). A time is free
 * for a person when the appointment and the buffers before and after it lie inside one stretch
 * of that person's free time, on the grid Microsoft Bookings uses for the service.
 */
async function readSlots(serviceId: string, from: string, to: string): Promise<BookingDays> {
  const { setup, rules } = await loadSetup();
  const service = setup.services.find((item) => item.id === serviceId);
  const rule = rules.get(serviceId);
  if (!service || !rule) throw new Error("bookings_unknown_service");

  const raw = await call("GetStaffAvailability", {
    serviceId,
    staffIds: service.staff,
    startDateTime: { dateTime: `${from}T00:00:00`, timeZone: ZONE_WINDOWS },
    endDateTime: { dateTime: `${to}T00:00:00`, timeZone: ZONE_WINDOWS },
  });

  const now = businessNow();
  const earliest = now + rule.lead * MINUTE;
  const latest = now + service.advanceDays * DAY;
  const start = Date.parse(`${from}T00:00:00Z`);
  const end = Date.parse(`${to}T00:00:00Z`);
  const step = rule.step * MINUTE;
  const free = new Map<number, string[]>();

  for (const entry of list(obj(raw).staffAvailabilityResponse)) {
    const person = text(obj(entry).staffId);
    if (!service.staff.includes(person)) continue;
    const spans = list(obj(entry).availabilityItems)
      .map(obj)
      .filter((item) => item.status === "BOOKINGSAVAILABILITYSTATUS_AVAILABLE")
      .map((item) => [Date.parse(`${text(obj(item.startDateTime).dateTime).slice(0, 19)}Z`), Date.parse(`${text(obj(item.endDateTime).dateTime).slice(0, 19)}Z`)] as [number, number])
      .filter(([a, b]) => Number.isFinite(a) && Number.isFinite(b) && b > a)
      .sort((a, b) => a[0] - b[0]);
    // Free time comes in pieces (split at midnight, for one); join pieces that touch.
    const joined: [number, number][] = [];
    for (const span of spans) {
      const last = joined[joined.length - 1];
      if (last && span[0] <= last[1]) last[1] = Math.max(last[1], span[1]);
      else joined.push([span[0], span[1]]);
    }
    for (const [a, b] of joined) {
      let t = Math.ceil((a + rule.pre * MINUTE) / step) * step;
      for (; t + (service.minutes + rule.post) * MINUTE <= b; t += step) {
        if (t < earliest || t > latest || t < start || t >= end) continue;
        const people = free.get(t);
        if (people) people.push(person);
        else free.set(t, [person]);
      }
    }
  }

  const days: BookingDays = {};
  for (const t of [...free.keys()].sort((a, b) => a - b)) {
    const at = stamp(t);
    (days[at.slice(0, 10)] ??= []).push({ t: at.slice(11, 16), s: free.get(t) ?? [] });
  }
  return days;
}

function nextMonth(month: string) {
  const [year, index] = month.split("-").map(Number);
  return index === 12 ? `${year + 1}-01` : `${year}-${String(index + 1).padStart(2, "0")}`;
}

/** Free times of one month ("YYYY-MM"), kept for two minutes. */
export async function getBookingMonth(serviceId: string, month: string): Promise<BookingDays> {
  const key = `${serviceId}|${month}`;
  const hit = slotCache.get(key);
  if (hit && Date.now() - hit.at < SLOTS_TTL) return hit.days;
  const days = await readSlots(serviceId, `${month}-01`, `${nextMonth(month)}-01`);
  slotCache.set(key, { at: Date.now(), days });
  return days;
}

export type BookingRequest = {
  serviceId: string;
  /** "YYYY-MM-DD" and "HH:mm" in the business time zone. */
  date: string;
  time: string;
  /** A wished person, or empty for anyone who is free. */
  staffId: string;
  name: string;
  email: string;
  phone: string;
  answers: Record<string, string>;
};

export type BookingResult =
  | { ok: true; service: BookingService; staffName: string }
  | { ok: false; reason: "unknown_service" | "slot_taken" | "missing_answer" | "refused" | "unreachable" };

/** Books the time in Microsoft Bookings, after checking once more that it is still free. */
export async function createBooking(request: BookingRequest): Promise<BookingResult> {
  let setup: BookingSetup;
  let slot: BookingSlot | undefined;
  try {
    setup = await getBookingSetup();
    if (!setup.services.some((item) => item.id === request.serviceId)) return { ok: false, reason: "unknown_service" };
    const next = stamp(Date.parse(`${request.date}T00:00:00Z`) + DAY).slice(0, 10);
    slot = (await readSlots(request.serviceId, request.date, next))[request.date]?.find((item) => item.t === request.time);
  } catch (error) {
    console.warn(`[booking] check failed: ${error instanceof Error ? error.message : "unknown"}`);
    return { ok: false, reason: "unreachable" };
  }
  const service = setup.services.find((item) => item.id === request.serviceId);
  if (!service) return { ok: false, reason: "unknown_service" };
  const candidates = slot ? (request.staffId ? slot.s.filter((person) => person === request.staffId) : slot.s) : [];
  if (candidates.length === 0) return { ok: false, reason: "slot_taken" };
  if (service.questions.some((question) => question.required && !request.answers[question.id])) return { ok: false, reason: "missing_answer" };

  // The same body Microsoft's booking page sends: one person picked among those who are free,
  // the others named as candidates.
  const staffId = candidates[Math.floor(Math.random() * candidates.length)];
  const startTime = `${request.date}T${request.time}:00`;
  const endTime = stamp(Date.parse(`${startTime}Z`) + service.minutes * MINUTE);
  const body = {
    appointment: {
      startTime: { dateTime: startTime, timeZone: ZONE_WINDOWS },
      endTime: { dateTime: endTime, timeZone: ZONE_WINDOWS },
      serviceId: service.id,
      staffMemberIds: [staffId],
      customers: [
        {
          name: request.name,
          emailAddress: request.email,
          phone: request.phone,
          notes: "",
          timeZone: ZONE_WINDOWS,
          answeredCustomQuestions: service.questions.map((question) => ({
            customQuestion: { id: question.id, questionText: question.text, answerOptions: [], answerInputType: "ANSWER_INPUT_TYPE_TEXT" },
            answer: request.answers[question.id] ?? "",
            isRequired: question.required,
            selectedOptions: [],
          })),
          location: { displayName: "", address: { street: "", type: "Other" } },
          smsNotificationsEnabled: false,
          instanceId: "",
          price: 0,
          priceType: "SERVICEDEFAULTPRICETYPES_NOT_SET",
        },
      ],
      isLocationOnline: false,
      smsNotificationsEnabled: false,
      verificationCode: "",
      customerTimeZone: ZONE_WINDOWS,
      trackingDataId: "",
      bookingFormInfoList: [],
      price: 0,
      priceType: "SERVICEDEFAULTPRICETYPES_NOT_SET",
      isAllDay: false,
      additionalRecipients: [],
    },
    ...(candidates.length > 1 ? { preferences: { staffCandidates: candidates } } : {}),
  };

  try {
    const result = obj(await call("appointments", body, 30000));
    if (!result.appointment) {
      console.warn("[booking] Microsoft answered without an appointment");
      return { ok: false, reason: "refused" };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    console.warn(`[booking] not booked: ${message}`);
    return { ok: false, reason: message.startsWith("bookings_appointments_4") ? "refused" : "unreachable" };
  }

  for (const key of slotCache.keys()) if (key.startsWith(`${service.id}|`)) slotCache.delete(key);
  return { ok: true, service, staffName: setup.staff.find((person) => person.id === staffId)?.name ?? "" };
}
