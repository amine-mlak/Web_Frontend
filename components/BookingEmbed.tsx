"use client";

import { useState } from "react";
import LocaleLink from "@/components/LocaleLink";
import { BOOKING_URL, MAIN_ACTIONS } from "@/lib/cta";
import type { Locale } from "@/lib/i18n";

/**
 * Booking an appointment: the team's own Microsoft Bookings page, shown inside the contact
 * page. Free times come straight from the team's Outlook calendars, and what the page
 * offers (services, people, questions) is set in Microsoft Bookings, so nothing is kept twice.
 *
 * The calendar is loaded from Microsoft only after a click, with a note saying so; until then
 * no request leaves the site. The same page can always be opened in a tab of its own.
 */
const UI: Record<Locale, Record<string, string>> = {
  de: {
    eyebrow: "Erstgespräch",
    title: "Termin vereinbaren",
    text: "Reservieren Sie hier Ihren persönlichen Rückruftermin für eine telefonische Erstberatung. Tag und Uhrzeit wählen Sie direkt im Kalender unseres Teams.",
    call: "Oder rufen Sie an:",
    phoneLabel: "08168 909910",
    planner: "Erst Ideen sammeln? Zum Küchenplaner",
    open: "Termin wählen",
    panelTitle: "Freie Termine ansehen",
    panelText: "Im Kalender sehen Sie die freien Zeiten und buchen direkt.",
    notice: "Der Kalender kommt von Microsoft Bookings. Mit dem Klick wird er von Microsoft geladen; dabei werden Daten wie Ihre IP-Adresse an Microsoft übertragen.",
    privacy: "Datenschutz",
    newTab: "Kalender in neuem Fenster öffnen",
    frameTitle: "Terminkalender der BEER Küchenmanufaktur",
  },
  en: {
    eyebrow: "First conversation",
    title: "Book an appointment",
    text: "Reserve your personal call-back time for a first consultation by phone. You pick the day and time directly in our team's calendar.",
    call: "Or call us:",
    phoneLabel: "+49 8168 909910",
    planner: "Collect ideas first? To the kitchen planner",
    open: "Choose a time",
    panelTitle: "See free times",
    panelText: "The calendar shows the free times, and you book right there.",
    notice: "The calendar comes from Microsoft Bookings. With the click it is loaded from Microsoft; data such as your IP address is sent to Microsoft.",
    privacy: "Privacy",
    newTab: "Open the calendar in a new window",
    frameTitle: "Appointment calendar of BEER Küchenmanufaktur",
  },
};

export default function BookingEmbed({ locale }: { locale: Locale }) {
  const ui = UI[locale];
  const [open, setOpen] = useState(false);

  return (
    <section id="termin" className="scroll-mt-20 bg-karte px-5 py-16 sm:px-8 md:py-24 lg:px-gutter" aria-labelledby="termin-title">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
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

        <div className="lg:col-span-7">
          {open ? (
            <iframe
              src={BOOKING_URL}
              title={ui.frameTitle}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              className="h-[min(52rem,calc(100svh-6rem))] min-h-[36rem] w-full border-0 bg-paper"
            />
          ) : (
            <div className="flex min-h-[20rem] flex-col items-start justify-center bg-paper px-6 py-10 sm:px-10">
              <h3 className="t-item text-ink">{ui.panelTitle}</h3>
              <p className="mt-3 max-w-md font-sans text-[16px] leading-[1.7] font-light text-ink/85">{ui.panelText}</p>
              <button type="button" onClick={() => setOpen(true)} className="pill pill-primary mt-7" data-umami-event="booking_open">
                {ui.open}
              </button>
              <p className="mt-6 max-w-md font-sans text-[13px] leading-5 text-muted">
                {ui.notice}{" "}
                <LocaleLink href="/datenschutz" className="underline underline-offset-4 hover:text-ink">
                  {ui.privacy}
                </LocaleLink>
              </p>
            </div>
          )}
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-quiet mt-5" data-umami-event="booking_new_tab">
            {ui.newTab}
          </a>
        </div>
      </div>
    </section>
  );
}
