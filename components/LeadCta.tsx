"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Pill from "@/components/Pill";
import TextLink from "@/components/TextLink";
import { conversionContext } from "@/lib/conversion";
import {
  apiErrorReason,
  trackFormAttempt,
  trackFormError,
  trackFormStart,
  trackFormStep,
  trackFormSubmit,
  trackFormView,
} from "@/lib/form-tracking";
import {
  fieldHasValue,
  validateLeadFields,
  type LeadFieldName,
} from "@/lib/lead-fields";
import type { BeratungContent } from "@/lib/strapi";

const fallback: BeratungContent = {
  eyebrow: "Persönliche Beratung",
  title: "Vereinbare deine persönliche Beratung",
  intro:
    "Erzählen Sie uns von Ihrem Raum, Ihrem Alltag und Ihren Wünschen. Wir vereinbaren einen Termin in der Ausstellung oder bei Ihnen vor Ort.",
  company: "BEER GmbH",
  street: "Badendorf 6",
  city: "85395 Wolfersdorf",
  phoneLabel: "T 08168 909910",
  phoneHref: "tel:+498168909910",
  email: "beratung@beer-kuechenmanufaktur.de",
};

type FormStatus = "idle" | "sending" | "success" | "error";

const fieldErrorCopy: Record<LeadFieldName, string> = {
  name: "Bitte einen Namen angeben.",
  email: "Bitte eine gültige E-Mail angeben.",
  phone: "Bitte eine Telefonnummer angeben.",
  message: "Bitte die Nachricht kürzen.",
};

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
  const [fieldError, setFieldError] = useState<LeadFieldName | null>(null);
  const mountedAt = useRef(Date.now());
  const formRef = useRef<HTMLFormElement>(null);
  const seen = useRef(false);
  const started = useRef(false);
  const completedFields = useRef(new Set<LeadFieldName>());

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
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  function markField(field: LeadFieldName, value: string) {
    if (!started.current) {
      started.current = true;
      trackFormStart(field);
    }
    if (fieldHasValue(field, value) && !completedFields.current.has(field)) {
      completedFields.current.add(field);
      trackFormStep(field);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const honeypot = String(formData.get("company_website") ?? "");
    setFieldError(null);
    trackFormAttempt();

    if (honeypot) {
      trackFormError("spam");
    }

    const fields = honeypot
      ? { ok: true as const, name: "", email: "", phone: "", message: "" }
      : validateLeadFields({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          message: formData.get("message"),
        });
    if (!fields.ok) {
      trackFormError(fields.reason, fields.field);
      setFieldError(fields.field);
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
        form.reset();
        setStatus("success");
        return;
      }

      if (!ok) {
        trackFormError(apiErrorReason(response.status));
        setStatus("error");
        return;
      }

      trackFormSubmit();
      form.reset();
      completedFields.current.clear();
      setChallenge(await fetchChallenge().catch(() => ""));
      setStatus("success");
    } catch {
      trackFormError("network");
      setStatus("error");
    }
  }

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
          toolname="request_consultation"
          tooldescription="Sendet eine unverbindliche Beratungsanfrage an die BEER Küchenmanufaktur in Wolfersdorf. Verwende dieses Formular, wenn der Nutzer eine Küchen- oder Möbelberatung vereinbaren möchte."
          onSubmit={handleSubmit}
          method="post"
          action="#beratung"
          className="relative space-y-5 lg:col-span-7"
          noValidate
        >
          <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0" aria-hidden="true">
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
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field
              label="Name"
              name="name"
              type="text"
              autoComplete="name"
              invalid={fieldError === "name"}
              toolparamdescription="Vollständiger Name der anfragenden Person"
              onInteract={markField}
            />
            <Field
              label="E-Mail"
              name="email"
              type="email"
              autoComplete="email"
              invalid={fieldError === "email"}
              toolparamdescription="E-Mail-Adresse für die Rückmeldung zur Beratung"
              onInteract={markField}
            />
          </div>
          <Field
            label="Telefon"
            name="phone"
            type="tel"
            autoComplete="tel"
            invalid={fieldError === "phone"}
            toolparamdescription="Telefonnummer für die Terminabstimmung"
            onInteract={markField}
          />
          <label className="block">
            <span className="type-eyebrow mb-2 block text-white/55">
              Nachricht
            </span>
            <textarea
              name="message"
              rows={5}
              aria-invalid={fieldError === "message"}
              toolparamdescription="Raum, Zeitrahmen, Küchenstil und erste Wünsche"
              onFocus={(event) => markField("message", event.currentTarget.value)}
              onChange={(event) => markField("message", event.currentTarget.value)}
              onBlur={(event) => markField("message", event.currentTarget.value)}
              className="type-body w-full resize-y border border-white/20 bg-transparent px-4 py-3 text-white outline-none transition-colors placeholder:text-white/30 focus:border-white"
              placeholder="Raum, Zeitrahmen, erste Ideen…"
            />
          </label>
          <Pill type="submit" variant="ghost-dark" disabled={status === "sending"}>
            {status === "sending" ? "Wird gesendet…" : "Beratung anfragen"}
          </Pill>
          {fieldError ? (
            <p className="type-body text-white/70" role="alert">
              {fieldErrorCopy[fieldError]}
            </p>
          ) : null}
          {status === "success" ? (
            <p className="type-body text-white/70" role="status">
              Danke, wir haben die Anfrage aufgenommen.
            </p>
          ) : null}
          {status === "error" && !fieldError ? (
            <p className="type-body text-white/70" role="alert">
              Das hat gerade nicht geklappt. Bitte in ein paar Minuten erneut versuchen oder anrufen.
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type,
  autoComplete,
  invalid = false,
  toolparamdescription,
  onInteract,
}: {
  label: string;
  name: LeadFieldName;
  type: "text" | "email" | "tel";
  autoComplete: string;
  invalid?: boolean;
  toolparamdescription: string;
  onInteract: (field: LeadFieldName, value: string) => void;
}) {
  return (
    <label className="block">
      <span className="type-eyebrow mb-2 block text-white/55">{label}</span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={invalid}
        toolparamdescription={toolparamdescription}
        onFocus={(event) => onInteract(name, event.currentTarget.value)}
        onChange={(event) => onInteract(name, event.currentTarget.value)}
        onBlur={(event) => onInteract(name, event.currentTarget.value)}
        className="type-body w-full border border-white/20 bg-transparent px-4 py-3 text-white outline-none transition-colors placeholder:text-white/30 focus:border-white"
      />
    </label>
  );
}
