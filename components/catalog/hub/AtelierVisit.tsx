import CmsImage from "@/components/CmsImage";
import LocaleLink from "@/components/LocaleLink";
import type { PresentedHub } from "@/lib/collection-present";
import { formatOpeningHours } from "@/lib/opening-hours";
import { getSiteSettings } from "@/lib/site-settings";

const COPY = {
  de: { eyebrow: "Mit Termin", hours: "Öffnungszeiten", contact: "Kontakt", route: "Route planen", book: "Termin vereinbaren", call: "Anrufen" },
  en: { eyebrow: "By appointment", hours: "Opening hours", contact: "Contact", route: "Get directions", book: "Book an appointment", call: "Call" },
} as const;

/**
 * The showroom block: photo, place, opening hours, phone, email, directions
 * and booking. Facts come from the CMS site settings ("Einstellungen").
 */
export default async function AtelierVisit({ hub }: { hub: PresentedHub }) {
  const copy = COPY[hub.locale === "en" ? "en" : "de"];
  const settings = await getSiteSettings();
  const hours = formatOpeningHours(settings.openingHours, hub.locale);
  const address = `${settings.street}, ${settings.postalCode} ${settings.city}`;
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${settings.siteName}, ${address}`)}`;
  const phoneHref = `tel:${settings.phone.replace(/[^\d+]/g, "")}`;

  return (
    <section className="bg-karte" aria-labelledby="atelier-visit-heading">
      <div className="mx-auto grid max-w-[90rem] lg:grid-cols-12">
        <figure className="relative min-h-[22rem] overflow-hidden bg-nacht lg:col-span-7 lg:min-h-[40rem]">
          <CmsImage
            src={hub.visitImage}
            alt={hub.visitPlace}
            fill
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover"
          />
        </figure>
        <div className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:col-span-5 lg:px-14 lg:py-20">
          <p className="type-eyebrow text-gold">{copy.eyebrow}</p>
          <h2
            id="atelier-visit-heading"
            className="mt-4 font-serif text-[32px] leading-[1.08] font-medium tracking-[-0.03em] text-ink md:text-[42px]"
          >
            {hub.visitPlace}
          </h2>
          <p className="type-intro mt-5">{hub.visitNote}</p>

          <dl className="mt-8 grid gap-6 border-t border-line pt-6 font-sans text-[15px] leading-relaxed text-ink sm:grid-cols-2">
            <div>
              <dt className="type-eyebrow text-muted">{copy.hours}</dt>
              <dd className="mt-2">
                {hours.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt className="type-eyebrow text-muted">{copy.contact}</dt>
              <dd className="mt-2">
                <address className="not-italic">
                  <span className="block">{settings.street}</span>
                  <span className="block">
                    {settings.postalCode} {settings.city}
                  </span>
                  <a href={phoneHref} className="mt-2 inline-flex min-h-6 items-center underline-offset-4 hover:underline" data-umami-event="tel_click">
                    {settings.phone}
                  </a>
                  <br />
                  <a href={`mailto:${settings.email}`} className="inline-flex min-h-6 items-center underline-offset-4 hover:underline">
                    {settings.email}
                  </a>
                </address>
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <LocaleLink href="/beratung" className="pill pill-primary">
              {copy.book}
            </LocaleLink>
            <a href={maps} target="_blank" rel="noopener noreferrer" className="pill pill-secondary">
              {copy.route}
              <span className="sr-only"> (Google Maps)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
