"use client";

import type { FormEvent } from "react";
import Pill from "@/components/Pill";
import TextLink from "@/components/TextLink";
import type { BeratungContent } from "@/lib/strapi";
import { trackEvent } from "@/lib/umami";

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

export default function LeadCta({
  content,
}: {
  content: BeratungContent | null;
}) {
  const data = content ?? fallback;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    trackEvent("form_submit", { location: "beratung" });

    // TODO: replace with real form submission
    console.log({
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
    });
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
          toolname="request_consultation"
          tooldescription="Sendet eine unverbindliche Beratungsanfrage an die BEER Küchenmanufaktur in Wolfersdorf. Verwende dieses Formular, wenn der Nutzer eine Küchen- oder Möbelberatung vereinbaren möchte."
          onSubmit={handleSubmit}
          className="space-y-5 lg:col-span-7"
          noValidate
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field
              label="Name"
              name="name"
              type="text"
              autoComplete="name"
              toolparamdescription="Vollständiger Name der anfragenden Person"
            />
            <Field
              label="E-Mail"
              name="email"
              type="email"
              autoComplete="email"
              toolparamdescription="E-Mail-Adresse für die Rückmeldung zur Beratung"
            />
          </div>
          <Field
            label="Telefon"
            name="phone"
            type="tel"
            autoComplete="tel"
            toolparamdescription="Telefonnummer für die Terminabstimmung"
          />
          <label className="block">
            <span className="type-eyebrow mb-2 block text-white/55">
              Nachricht
            </span>
            <textarea
              name="message"
              rows={5}
              toolparamdescription="Raum, Zeitrahmen, Küchenstil und erste Wünsche"
              className="type-body w-full resize-y border border-white/20 bg-transparent px-4 py-3 text-white outline-none transition-colors placeholder:text-white/30 focus:border-white"
              placeholder="Raum, Zeitrahmen, erste Ideen…"
            />
          </label>
          <Pill type="submit" variant="ghost-dark">
            Beratung anfragen
          </Pill>
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
  toolparamdescription,
}: {
  label: string;
  name: string;
  type: "text" | "email" | "tel";
  autoComplete: string;
  toolparamdescription: string;
}) {
  return (
    <label className="block">
      <span className="type-eyebrow mb-2 block text-white/55">{label}</span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        toolparamdescription={toolparamdescription}
        className="type-body w-full border border-white/20 bg-transparent px-4 py-3 text-white outline-none transition-colors placeholder:text-white/30 focus:border-white"
      />
    </label>
  );
}
