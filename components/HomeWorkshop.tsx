import FillSentence from "@/components/FillSentence";
import LocaleLink from "@/components/LocaleLink";
import { fallbackGutZuWissen } from "@/components/GutZuWissen";
import { fallback as processFallback } from "@/components/Process";
import WorkshopSteps from "@/components/WorkshopSteps";
import { PROCESS_SHOTS } from "@/lib/house-photos";
import { getRequestLocale } from "@/lib/locale";
import type { ProcessContent } from "@/lib/strapi";

const COPY = {
  de: {
    text: "Beraten, geplant, gefertigt und montiert wird von einem Haus: von uns, in Wolfersdorf bei Freising.",
    about: "Über BEER",
  },
  en: {
    text: "Advice, planning, production and fitting come from one house: ours, in Wolfersdorf near Freising.",
    about: "About BEER",
  },
} as const;

/**
 * Start page: the way to a kitchen, on dark ground with photos of the showroom and the workshop.
 * Closes with the quote that used to stand in a band of its own above the questions.
 */
export default async function HomeWorkshop({
  content,
  quote,
}: {
  content: ProcessContent | null;
  quote?: { text?: string; source?: string };
}) {
  const locale = await getRequestLocale();
  const copy = COPY[locale];
  const data = content ?? processFallback;
  const steps = data.steps.length > 0 ? data.steps : processFallback.steps;
  // The quote sits in this block in the CMS; an older entry still has it with the questions.
  const words = data.quote || quote?.text?.trim() || fallbackGutZuWissen.quote;
  const source = data.quoteSource || quote?.source?.trim() || fallbackGutZuWissen.source;
  // Each step's own photo from the CMS; the house photos stand in where a step has none.
  const shots = steps.map((step, index) => {
    const standIn = PROCESS_SHOTS[Math.min(index, PROCESS_SHOTS.length - 1)];
    return step.image ? { src: step.image, alt: step.alt || step.title } : standIn;
  });

  return (
    <section id="ablauf" aria-labelledby="ablauf-heading" className="bg-espresso px-5 py-20 text-paper sm:px-8 lg:px-gutter lg:py-32">
      <WorkshopSteps
        head={
          <>
            <h2 data-rise="" id="ablauf-heading" className="t-section text-paper">
              {data.title}
            </h2>
            <p className="mt-5 max-w-md font-sans text-[16px] leading-relaxed text-paper/80 md:text-[17px]">{data.text || copy.text}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-4">
              <LocaleLink href={data.buttonHref} className="pill pill-light">
                {data.buttonLabel}
              </LocaleLink>
              <LocaleLink href="/ueber" className="btn-quiet text-paper">
                {copy.about}
              </LocaleLink>
            </div>
          </>
        }
        steps={steps.map(({ step, title, description }) => ({ step, title, description }))}
        shots={shots}
      />

      <blockquote className="mt-16 border-t border-paper/20 pt-14 lg:mt-24 lg:pt-20">
        <FillSentence
          text={`„${words}“`}
          className="max-w-[22ch] font-serif text-[30px] leading-[1.14] font-medium tracking-[-0.02em] text-paper md:text-[46px] xl:text-[64px]"
        />
        <footer className="mt-8 font-sans text-[15px] text-messing">{source}</footer>
      </blockquote>
    </section>
  );
}
