import ApplicationForm from "@/components/careers/ApplicationForm";
import LocaleLink from "@/components/LocaleLink";
import { jobKindLabel, type Job } from "@/lib/careers";
import type { Locale } from "@/lib/i18n";

const COPY = {
  de: {
    eyebrow: "Offene Stellen",
    title: "Aktuelle Stellenangebote",
    more: "Zur Stelle",
    none: "Gerade ist keine Stelle ausgeschrieben. Eine Initiativbewerbung lesen wir trotzdem gern.",
    formEyebrow: "Bewerbung",
    formTitle: "Bewirb Dich direkt hier.",
    formText: "Ein paar Angaben reichen. Deine Bewerbung geht direkt an Christian Beer.",
  },
  en: {
    eyebrow: "Open positions",
    title: "Current openings",
    more: "View position",
    none: "There is no opening right now. We still read speculative applications.",
    formEyebrow: "Application",
    formTitle: "Apply right here.",
    formText: "A few details are enough. Your application goes straight to Christian Beer.",
  },
} as const;

/** Karriere: the job ads from the CMS and the application form. */
export default function CareersSection({ jobs, locale }: { jobs: Job[]; locale: Locale }) {
  const copy = COPY[locale];
  return (
    <>
      <section id="stellen" className="scroll-mt-24 bg-paper px-5 py-20 sm:px-8 md:py-24 lg:px-14" aria-labelledby="stellen-title">
        <p className="type-eyebrow text-gold">{copy.eyebrow}</p>
        <h2 id="stellen-title" className="mt-4 font-serif text-[34px] leading-tight font-medium tracking-[-0.02em] text-ink md:text-[44px]">
          {copy.title}
        </h2>
        {jobs.length ? (
          <ul className="mt-12 border-t border-line">
            {jobs.map((job) => (
              <li key={job.slug} className="border-b border-line">
                <LocaleLink
                  href={`/karriere/${job.slug}`}
                  className="group grid gap-3 py-8 md:grid-cols-12 md:items-baseline md:gap-8"
                >
                  <span className="font-sans text-[13px] text-muted md:col-span-2">{jobKindLabel(job.kind, locale)}</span>
                  <span className="font-serif text-[26px] leading-snug font-medium text-ink md:col-span-5 md:text-[30px]">
                    {job.title}
                  </span>
                  <span className="font-sans text-[15px] leading-relaxed text-muted md:col-span-3">{job.teaser}</span>
                  <span className="btn-quiet justify-self-start text-ink group-hover:opacity-65 md:col-span-2 md:justify-self-end">
                    {copy.more}
                  </span>
                </LocaleLink>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-8 max-w-xl font-sans text-[17px] leading-relaxed text-muted">{copy.none}</p>
        )}
      </section>
      <section id="bewerbung" className="scroll-mt-24 bg-karte px-5 py-20 sm:px-8 md:py-24 lg:px-14" aria-labelledby="bewerbung-title">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="type-eyebrow text-gold">{copy.formEyebrow}</p>
            <h2 id="bewerbung-title" className="mt-4 font-serif text-[34px] leading-tight font-medium tracking-[-0.02em] text-ink md:text-[40px]">
              {copy.formTitle}
            </h2>
            <p className="mt-5 max-w-sm font-sans text-[16px] leading-relaxed text-muted">{copy.formText}</p>
          </div>
          <div className="lg:col-span-8">
            <ApplicationForm jobs={jobs.map(({ slug, title }) => ({ slug, title }))} />
          </div>
        </div>
      </section>
    </>
  );
}
