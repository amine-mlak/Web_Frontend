import Accordion from "@/components/Accordion";
import FaqJsonLd from "@/components/FaqJsonLd";
import GutZuWissen from "@/components/GutZuWissen";
import { getRequestLocale } from "@/lib/locale";
import type { FaqContent } from "@/lib/strapi";

const editorialItems = [
  {
    question:
      "Ich weiß noch gar nicht, was ich will – ist ein Termin zu früh?",
    answer:
      "Nein. Die meisten Gespräche beginnen genau so: mit Bildern, einem Raum und dem Gefühl, dass etwas besser gehen könnte. Wir sortieren gemeinsam – bevor gezeichnet wird.",
  },
  {
    question: "Kann ich fertige Küchen anschauen und anfassen?",
    answer:
      "Ja. In der Ausstellung in Wolfersdorf stehen Materialien, Muster und ausgeführte Details zum Anfassen – nicht nur Visualisierungen. Dafür lohnt ein Termin, dann ist Zeit dafür.",
  },
  {
    question: "Darf ich mit Pinterest-Bildern kommen?",
    answer:
      "Bitte. Bilder sagen oft mehr als ein Grundriss. Wir schauen, was daran wirklich zu Ihrem Alltag und zum Raum passt – und was nur auf dem Bildschirm funktioniert.",
  },
  {
    question: "Was kostet der erste Schritt?",
    answer:
      "Nichts. Das Erstgespräch in der Ausstellung oder bei Ihnen ist kostenlos. Verbindlich wird es erst mit Planung und Auftrag.",
  },
];

const editorialItemsEn = [
  {
    question: "I don't know what I want yet — is an appointment too early?",
    answer:
      "No. Most conversations start exactly like that: with pictures, a room, and the feeling that something could work better. We sort it together — before anyone draws.",
  },
  {
    question: "Can I look at finished kitchens and touch them?",
    answer:
      "Yes. In the Wolfersdorf showroom there are materials, samples and built details to handle — not only visualisations. An appointment is worth it; then there is time for that.",
  },
  {
    question: "May I bring Pinterest pictures?",
    answer:
      "Please do. Pictures often say more than a floor plan. We look at what really fits your everyday life and the room — and what only works on a screen.",
  },
  {
    question: "What does the first step cost?",
    answer:
      "Nothing. The first conversation in the showroom or at your home is free. It only becomes binding with planning and an order.",
  },
];

const fallback: FaqContent = {
  eyebrow: "Gut zu wissen",
  title: "Was viele zuerst fragen",
  quote:
    "Sie müssen nicht wissen, was Sie wollen. Sie müssen nur wissen, was Ihnen gefällt – den Rest sortieren wir gemeinsam.",
  quoteSource: "Aus dem ersten Gespräch in unserer Ausstellung Freising",
  items: editorialItems,
};

const fallbackEn: FaqContent = {
  eyebrow: "Good to know",
  title: "What people ask first",
  quote:
    "You don't have to know what you want. You only have to know what you like — we'll sort the rest together.",
  quoteSource: "From the first conversation in our Freising showroom",
  items: editorialItemsEn,
};

const legacyTitles = new Set(["Bevor wir uns sehen", "Was viele zuerst fragen"]);
const legacyEyebrows = new Set(["Fragen", "FAQ", "Gut zu wissen"]);

function presentFaq(data: FaqContent, pack: FaqContent): FaqContent {
  return {
    ...data,
    title:
      !data.title || legacyTitles.has(data.title) ? pack.title : data.title,
    quote: data.quote?.trim() || pack.quote,
    quoteSource: data.quoteSource?.trim() || pack.quoteSource,
    quoteEyebrow:
      data.quoteEyebrow?.trim() ||
      (data.eyebrow && !legacyEyebrows.has(data.eyebrow)
        ? data.eyebrow
        : pack.eyebrow),
    items: data.items.length > 0 ? data.items : pack.items,
  };
}

export default async function Faq({ content }: { content: FaqContent | null }) {
  const locale = await getRequestLocale();
  const pack = locale === "en" ? fallbackEn : fallback;
  const data = presentFaq(content ?? pack, pack);
  const items = data.items.length > 0 ? data.items : fallback.items;

  return (
    <section id="faq" className="bg-paper" aria-labelledby="faq-heading">
      <FaqJsonLd
        items={items.map((item, index) => ({
          slug: `home-${index}`,
          question: item.question,
          answer: item.answer,
          showOnHome: true,
          order: index,
          themes: [],
        }))}
      />
      <GutZuWissen
        content={{
          eyebrow: data.quoteEyebrow,
          quote: data.quote,
          source: data.quoteSource,
        }}
      />
      <div className="mx-auto max-w-3xl px-6 py-20 md:px-8 md:py-28">
        <h2
          id="faq-heading"
          className="font-serif text-[34px] leading-[1.15] font-medium tracking-[-0.02em] text-ink md:text-[42px]"
        >
          {data.title}
        </h2>
        <div className="mt-10 md:mt-12">
          <Accordion items={items} />
        </div>
      </div>
    </section>
  );
}
