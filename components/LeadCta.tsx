"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { BeratungIcon } from "@/components/BeratungIcon";
import Pill from "@/components/Pill";
import TextLink from "@/components/TextLink";
import {
  BERATUNG_APPLIANCES,
  BERATUNG_BUDGETS,
  BERATUNG_COLOURS,
  BERATUNG_COOKING,
  BERATUNG_FLOORPLANS,
  BERATUNG_HANDLES,
  BERATUNG_OCCASIONS,
  BERATUNG_PLACES,
  BERATUNG_PREPARATIONS,
  BERATUNG_ROOMS,
  BERATUNG_SALUTATIONS,
  BERATUNG_SHAPES,
  BERATUNG_STYLES,
  BERATUNG_TIMINGS,
  BERATUNG_WIZARD_STEPS,
  BERATUNG_WORKTOPS,
  PICTURE_STEPS,
  WIZARD_STEP_COPY,
  toggleExclusiveNone,
  type BeratungBudget,
  type BeratungColour,
  type BeratungCooking,
  type BeratungFloorplan,
  type BeratungHandle,
  type BeratungOccasion,
  type BeratungPlace,
  type BeratungRoom,
  type BeratungSalutation,
  type BeratungShape,
  type BeratungStyle,
  type BeratungTiming,
  type BeratungWizardStep,
  type BeratungWorktop,
} from "@/lib/beratung-wizard";
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
import { isGermanPlz, normalizePlz, validateLeadFields } from "@/lib/lead-fields";
import type { BeratungContent } from "@/lib/strapi";

const fallback: BeratungContent = {
  eyebrow: "Persönliche Beratung",
  title: "Vereinbare deine persönliche Beratung",
  intro:
    "Form, Stil, Alltag — in kurzen Schritten. Danach vereinbaren wir den Termin in der Ausstellung oder bei Ihnen vor Ort.",
  company: "BEER GmbH",
  street: "Badendorf 6",
  city: "85395 Wolfersdorf",
  phoneLabel: "T 08168 909910",
  phoneHref: "tel:+498168909910",
  email: "beratung@beer-kuechenmanufaktur.de",
};

type FormStatus = "idle" | "sending" | "success" | "error";

type Choice = { id: string; label: string; icon: string };

async function fetchChallenge() {
  const response = await fetch("/api/lead/challenge", {
    method: "GET",
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!response.ok) {
    return "";
  }
  const data: unknown = await response.json();
  if (
    data &&
    typeof data === "object" &&
    "challenge" in data &&
    typeof data.challenge === "string"
  ) {
    return data.challenge;
  }
  return "";
}

export default function LeadCta({
  content,
}: {
  content: BeratungContent | null;
}) {
  const data = content ?? fallback;
  const [challenge, setChallenge] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [shape, setShape] = useState<BeratungShape | "">("");
  const [room, setRoom] = useState<BeratungRoom | "">("");
  const [style, setStyle] = useState<BeratungStyle | "">("");
  const [handle, setHandle] = useState<BeratungHandle | "">("");
  const [colour, setColour] = useState<BeratungColour | "">("");
  const [worktop, setWorktop] = useState<BeratungWorktop | "">("");
  const [appliances, setAppliances] = useState<string[]>([]);
  const [cooking, setCooking] = useState<BeratungCooking | "">("");
  const [occasion, setOccasion] = useState<BeratungOccasion | "">("");
  const [preparations, setPreparations] = useState<string[]>([]);
  const [timing, setTiming] = useState<BeratungTiming | "">("");
  const [budget, setBudget] = useState<BeratungBudget | "">("");
  const [floorplan, setFloorplan] = useState<BeratungFloorplan | "">("");
  const [place, setPlace] = useState<BeratungPlace | "">("");
  const [plz, setPlz] = useState("");
  const [salutation, setSalutation] = useState<BeratungSalutation | "">("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [stepError, setStepError] = useState("");
  const mountedAt = useRef(Date.now());
  const formRef = useRef<HTMLFormElement>(null);
  const seen = useRef(false);
  const started = useRef(false);
  const trackedSteps = useRef(new Set<BeratungWizardStep>());

  const step = BERATUNG_WIZARD_STEPS[stepIndex] ?? "shape";
  const copy = WIZARD_STEP_COPY[step];
  const autoAdvance = PICTURE_STEPS.has(step) && step !== "ort";

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const token = await fetchChallenge().catch(() => "");
      if (!cancelled) {
        setChallenge(token);
      }
    };
    void load();
    const timer = window.setInterval(() => {
      void load();
    }, 8 * 60 * 1000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const node = formRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (seen.current || !entries.some((entry) => entry.isIntersecting)) {
          return;
        }
        seen.current = true;
        trackFormView();
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  function markStart() {
    if (started.current) {
      return;
    }
    started.current = true;
    trackFormStart(step);
  }

  function completeStep(current: BeratungWizardStep) {
    if (trackedSteps.current.has(current)) {
      return;
    }
    trackedSteps.current.add(current);
    trackFormWizardStep(current);
  }

  function currentValue() {
    switch (step) {
      case "shape":
        return shape;
      case "room":
        return room;
      case "style":
        return style;
      case "handle":
        return handle;
      case "colour":
        return colour;
      case "worktop":
        return worktop;
      case "cooking":
        return cooking;
      case "occasion":
        return occasion;
      case "timing":
        return timing;
      case "budget":
        return budget;
      case "floorplan":
        return floorplan;
      case "ort":
        return place;
      default:
        return "";
    }
  }

  function stepIsValid(nextPlace = place): boolean {
    if (PICTURE_STEPS.has(step) && step !== "ort" && !currentValue()) {
      setStepError("Bitte eine Auswahl treffen.");
      trackFormError("invalid_choice", step);
      return false;
    }
    if (step === "appliances" && appliances.length === 0) {
      setStepError("Bitte mindestens eine Auswahl treffen.");
      trackFormError("invalid_choice", step);
      return false;
    }
    if (step === "preparations" && preparations.length === 0) {
      setStepError("Bitte mindestens eine Auswahl treffen.");
      trackFormError("invalid_choice", step);
      return false;
    }
    if (step === "ort") {
      if (!nextPlace) {
        setStepError("Bitte wählen Sie, wo wir uns treffen.");
        trackFormError("invalid_place", step);
        return false;
      }
      if (nextPlace === "vor_ort" && !isGermanPlz(normalizePlz(plz))) {
        setStepError("Bitte eine fünfstellige Postleitzahl angeben.");
        trackFormError("invalid_plz", step);
        return false;
      }
    }
    if (step === "kontakt") {
      const fields = validateLeadFields({ name, email, phone, message: "" });
      if (!fields.ok) {
        const copyMap = {
          invalid_name: "Bitte einen Namen angeben.",
          invalid_email: "Bitte eine gültige E-Mail angeben.",
          invalid_phone: "Bitte eine Telefonnummer angeben.",
          invalid_message: "Bitte die Nachricht kürzen.",
        };
        setStepError(copyMap[fields.reason]);
        trackFormError(fields.reason, step);
        return false;
      }
    }
    if (step === "nachricht") {
      const fields = validateLeadFields({ name, email, phone, message });
      if (!fields.ok && fields.reason === "invalid_message") {
        setStepError("Bitte die Nachricht kürzen.");
        trackFormError(fields.reason, step);
        return false;
      }
    }
    setStepError("");
    return true;
  }

  function advanceFrom(current: BeratungWizardStep) {
    completeStep(current);
    setStepIndex((index) => Math.min(index + 1, BERATUNG_WIZARD_STEPS.length - 1));
  }

  function goNext() {
    markStart();
    if (!stepIsValid()) {
      return;
    }
    advanceFrom(step);
  }

  function goBack() {
    setStepError("");
    setStatus("idle");
    setStepIndex((index) => Math.max(index - 1, 0));
  }

  function pickSingle(id: string) {
    markStart();
    setStepError("");
    switch (step) {
      case "shape":
        setShape(id as BeratungShape);
        break;
      case "room":
        setRoom(id as BeratungRoom);
        break;
      case "style":
        setStyle(id as BeratungStyle);
        break;
      case "handle":
        setHandle(id as BeratungHandle);
        break;
      case "colour":
        setColour(id as BeratungColour);
        break;
      case "worktop":
        setWorktop(id as BeratungWorktop);
        break;
      case "cooking":
        setCooking(id as BeratungCooking);
        break;
      case "occasion":
        setOccasion(id as BeratungOccasion);
        break;
      case "timing":
        setTiming(id as BeratungTiming);
        break;
      case "budget":
        setBudget(id as BeratungBudget);
        break;
      case "floorplan":
        setFloorplan(id as BeratungFloorplan);
        break;
      case "ort":
        setPlace(id as BeratungPlace);
        break;
      default:
        break;
    }
    if (autoAdvance) {
      advanceFrom(step);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") {
      return;
    }
    if (step !== "nachricht") {
      goNext();
      return;
    }

    markStart();
    if (!stepIsValid()) {
      return;
    }

    const form = event.currentTarget;
    const honeypot = String(new FormData(form).get("company_website") ?? "");
    trackFormAttempt("nachricht");

    if (honeypot) {
      trackFormError("spam", step);
    }

    const fields = honeypot
      ? { ok: true as const, name: "", email: "", phone: "", message: "" }
      : validateLeadFields({ name, email, phone, message });
    if (!fields.ok) {
      trackFormError(fields.reason, step);
      setStepError("Bitte Name, E-Mail und Telefon prüfen.");
      setStatus("error");
      return;
    }

    setStatus("sending");

    try {
      let token = challenge;
      if (!token) {
        token = await fetchChallenge();
        setChallenge(token);
        await new Promise((resolve) => window.setTimeout(resolve, 1600));
      } else {
        const waitMs = 1600 - (Date.now() - mountedAt.current);
        if (waitMs > 0) {
          await new Promise((resolve) => window.setTimeout(resolve, waitMs));
        }
      }

      const context = conversionContext();
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
          shape,
          room,
          style,
          handle,
          colour,
          worktop,
          appliances,
          cooking,
          intent: occasion,
          preparations,
          timing,
          budget,
          floorplan,
          place,
          salutation,
          plz: place === "vor_ort" ? normalizePlz(plz) : "",
          ...context,
        }),
      });

      const payload: unknown = await response.json().catch(() => null);
      const ok =
        response.ok &&
        payload &&
        typeof payload === "object" &&
        "ok" in payload &&
        payload.ok === true;

      if (honeypot) {
        setStatus("success");
        return;
      }

      if (!ok) {
        trackFormError(apiErrorReason(response.status), step);
        setStatus("error");
        return;
      }

      completeStep("nachricht");
      trackFormSubmit();
      setChallenge(await fetchChallenge().catch(() => ""));
      setStatus("success");
    } catch {
      trackFormError("network", step);
      setStatus("error");
    }
  }

  const pictureOptions = optionsForStep(step);
  const multiOptions = multiOptionsForStep(step);

  return (
    <section
      id="beratung"
      className="border-t border-line bg-nacht text-white"
      aria-labelledby="beratung-heading"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 px-6 py-24 md:py-32 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <p className="type-eyebrow mb-3 text-paper">{data.eyebrow}</p>
          <h2 id="beratung-heading" className="type-h2 text-paper">
            {data.title}
          </h2>
          <p className="type-intro mt-6 max-w-md text-white/70">{data.intro}</p>

          <address className="type-body mt-12 text-white/70 not-italic">
            <p className="type-eyebrow text-white">{data.company}</p>
            <p className="mt-3">{data.street}</p>
            <p>{data.city}</p>
            <p className="mt-4">
              <TextLink
                href={data.phoneHref}
                tone="dark"
                data-umami-event="tel_click"
                data-umami-event-location="beratung"
              >
                {data.phoneLabel}
              </TextLink>
            </p>
            <p className="mt-2">
              <TextLink
                href={`mailto:${data.email}`}
                tone="dark"
                data-umami-event="mailto_click"
                data-umami-event-location="beratung"
              >
                {data.email}
              </TextLink>
            </p>
          </address>
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          method="post"
          action="#beratung"
          className="relative space-y-6 lg:col-span-7"
          noValidate
        >
          <div
            className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
            aria-hidden="true"
          >
            <label>
              Website
              <input
                type="text"
                name="company_website"
                tabIndex={-1}
                autoComplete="off"
              />
            </label>
          </div>

          {status === "success" ? (
            <div role="status">
              <p className="type-eyebrow mb-3 text-white/55">Anfrage angekommen</p>
              <p className="type-h2 text-paper">
                Danke, wir haben die Anfrage aufgenommen.
              </p>
              <p className="type-body mt-6 max-w-md text-white/70">
                Wir melden uns persönlich, um den Termin in der Ausstellung oder
                bei Ihnen vor Ort abzustimmen.
              </p>
            </div>
          ) : (
            <>
              <div>
                <p className="type-eyebrow text-white/55">
                  Schritt {stepIndex + 1} von {BERATUNG_WIZARD_STEPS.length}
                </p>
                <div className="mt-3 h-px bg-white/15" aria-hidden="true">
                  <div
                    className="h-px bg-white transition-[width] duration-300"
                    style={{
                      width: `${((stepIndex + 1) / BERATUNG_WIZARD_STEPS.length) * 100}%`,
                    }}
                  />
                </div>
                <p className="type-h3 mt-6 text-paper">{copy.title}</p>
                <p className="type-body mt-3 text-white/65">{copy.hint}</p>
              </div>

              {pictureOptions ? (
                <PictureChoice
                  legend={copy.title}
                  value={currentValue()}
                  options={pictureOptions}
                  columns={step === "shape" || step === "style" || step === "occasion" ? 3 : 2}
                  onChange={pickSingle}
                />
              ) : null}

              {multiOptions ? (
                <ListChoice
                  legend={copy.title}
                  values={step === "appliances" ? appliances : preparations}
                  options={multiOptions}
                  onToggle={(id) => {
                    markStart();
                    setStepError("");
                    if (step === "appliances") {
                      setAppliances((current) => toggleExclusiveNone(current, id));
                    } else {
                      setPreparations((current) => toggleExclusiveNone(current, id));
                    }
                  }}
                />
              ) : null}

              {step === "ort" && place === "vor_ort" ? (
                <label className="block">
                  <span className="type-eyebrow mb-2 block text-white/55">
                    Postleitzahl
                  </span>
                  <input
                    name="plz"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    value={plz}
                    onChange={(event) => setPlz(event.currentTarget.value)}
                    className="type-body w-full border border-white/20 bg-transparent px-4 py-3 text-white outline-none transition-colors placeholder:text-white/30 focus:border-white"
                    placeholder="85395"
                  />
                </label>
              ) : null}

              {step === "kontakt" ? (
                <div className="space-y-5">
                  <fieldset className="space-y-3" role="radiogroup" aria-label="Anrede">
                    <legend className="sr-only">Anrede</legend>
                    <div className="flex flex-wrap gap-3">
                      {BERATUNG_SALUTATIONS.map((option) => {
                        const selected = salutation === option.id;
                        return (
                          <button
                            key={option.id}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => {
                              markStart();
                              setSalutation(option.id);
                            }}
                            className={`type-body border px-4 py-3 outline-none transition-colors ${
                              selected
                                ? "border-white bg-white text-nacht"
                                : "border-white/20 text-white hover:border-white"
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                  <label className="block">
                    <span className="type-eyebrow mb-2 block text-white/55">Name</span>
                    <input
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(event) => setName(event.currentTarget.value)}
                      className="type-body w-full border border-white/20 bg-transparent px-4 py-3 text-white outline-none transition-colors focus:border-white"
                    />
                  </label>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <label className="block">
                      <span className="type-eyebrow mb-2 block text-white/55">
                        E-Mail
                      </span>
                      <input
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(event) => setEmail(event.currentTarget.value)}
                        className="type-body w-full border border-white/20 bg-transparent px-4 py-3 text-white outline-none transition-colors focus:border-white"
                      />
                    </label>
                    <label className="block">
                      <span className="type-eyebrow mb-2 block text-white/55">
                        Telefon
                      </span>
                      <input
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        value={phone}
                        onChange={(event) => setPhone(event.currentTarget.value)}
                        className="type-body w-full border border-white/20 bg-transparent px-4 py-3 text-white outline-none transition-colors focus:border-white"
                      />
                    </label>
                  </div>
                </div>
              ) : null}

              {step === "nachricht" ? (
                <label className="block">
                  <span className="type-eyebrow mb-2 block text-white/55">
                    Nachricht
                  </span>
                  <textarea
                    name="message"
                    rows={5}
                    value={message}
                    onChange={(event) => setMessage(event.currentTarget.value)}
                    className="type-body w-full resize-y border border-white/20 bg-transparent px-4 py-3 text-white outline-none transition-colors placeholder:text-white/30 focus:border-white"
                    placeholder="Raum, Zeitrahmen, erste Ideen…"
                  />
                </label>
              ) : null}

              {stepError ? (
                <p className="type-body text-white/70" role="alert">
                  {stepError}
                </p>
              ) : null}
              {status === "error" && !stepError ? (
                <p className="type-body text-white/70" role="alert">
                  Das hat gerade nicht geklappt. Bitte in ein paar Minuten erneut
                  versuchen oder anrufen.
                </p>
              ) : null}

              <div className="flex flex-wrap items-center gap-4">
                {stepIndex > 0 ? (
                  <button
                    type="button"
                    onClick={goBack}
                    className="type-eyebrow text-white/55 underline-offset-4 hover:text-white hover:underline"
                  >
                    Zurück
                  </button>
                ) : null}
                {step === "nachricht" ? (
                  <Pill
                    type="submit"
                    variant="ghost-dark"
                    disabled={status === "sending"}
                  >
                    {status === "sending" ? "Wird gesendet…" : "Beratung anfragen"}
                  </Pill>
                ) : autoAdvance && !currentValue() ? (
                  <p className="type-eyebrow text-white/40">Auswahl führt weiter</p>
                ) : (
                  <Pill type="button" variant="ghost-dark" onClick={goNext}>
                    Weiter
                  </Pill>
                )}
              </div>
            </>
          )}
        </form>
      </div>
    </section>
  );
}

function optionsForStep(step: BeratungWizardStep): readonly Choice[] | null {
  switch (step) {
    case "shape":
      return BERATUNG_SHAPES;
    case "room":
      return BERATUNG_ROOMS;
    case "style":
      return BERATUNG_STYLES;
    case "handle":
      return BERATUNG_HANDLES;
    case "colour":
      return BERATUNG_COLOURS;
    case "worktop":
      return BERATUNG_WORKTOPS;
    case "cooking":
      return BERATUNG_COOKING;
    case "occasion":
      return BERATUNG_OCCASIONS;
    case "timing":
      return BERATUNG_TIMINGS;
    case "budget":
      return BERATUNG_BUDGETS;
    case "floorplan":
      return BERATUNG_FLOORPLANS;
    case "ort":
      return BERATUNG_PLACES;
    default:
      return null;
  }
}

function multiOptionsForStep(step: BeratungWizardStep): readonly Choice[] | null {
  if (step === "appliances") {
    return BERATUNG_APPLIANCES;
  }
  if (step === "preparations") {
    return BERATUNG_PREPARATIONS;
  }
  return null;
}

function PictureChoice({
  legend,
  value,
  options,
  columns,
  onChange,
}: {
  legend: string;
  value: string;
  options: readonly Choice[];
  columns: 2 | 3;
  onChange: (id: string) => void;
}) {
  return (
    <fieldset>
      <legend className="sr-only">{legend}</legend>
      <div
        className={`grid gap-4 ${columns === 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2"}`}
        role="radiogroup"
        aria-label={legend}
      >
        {options.map((option) => {
          const selected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.id)}
              className="group text-center outline-none"
            >
              <span
                className={`mx-auto flex aspect-square w-full max-w-[11rem] items-center justify-center border p-4 transition-colors ${
                  selected
                    ? "border-white bg-white text-nacht"
                    : "border-white/20 text-white group-hover:border-white"
                }`}
              >
                <BeratungIcon name={option.icon} />
              </span>
              <span
                className={`type-body mt-3 block ${selected ? "text-paper" : "text-white/75"}`}
              >
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function ListChoice({
  legend,
  values,
  options,
  onToggle,
}: {
  legend: string;
  values: string[];
  options: readonly Choice[];
  onToggle: (id: string) => void;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="sr-only">{legend}</legend>
      {options.map((option) => {
        const selected = values.includes(option.id);
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onToggle(option.id)}
            className={`flex w-full items-center gap-4 border px-4 py-3 text-left outline-none transition-colors ${
              selected
                ? "border-white bg-white text-nacht"
                : "border-white/20 text-white hover:border-white"
            }`}
          >
            <span className="h-10 w-10 shrink-0">
              <BeratungIcon name={option.icon} />
            </span>
            <span className="type-body">{option.label}</span>
          </button>
        );
      })}
    </fieldset>
  );
}
