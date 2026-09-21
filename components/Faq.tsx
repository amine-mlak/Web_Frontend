import Accordion from "@/components/Accordion";
import FaqJsonLd from "@/components/FaqJsonLd";
import type { FaqContent } from "@/lib/strapi";
import Link from "next/link";

const fallback: FaqContent = {
  eyebrow: "Fragen",
  title: "Bevor wir uns sehen",
  items: [
    {
      question: "Was kostet eine Küche nach Maß?",
      answer:
        "Jede Küche wird einzeln geplant. Der Preis hängt von Größe, Material und Ausstattung ab. Im Beratungsgespräch nennen wir Ihnen einen ehrlichen Rahmen – bevor die Planung vertieft wird.",
    },
    {
      question: "Wie lange dauert Planung und Fertigung?",
      answer:
        "Von der ersten Beratung bis zur Montage rechnen wir in der Regel mit einigen Monaten. Den konkreten Zeitplan stimmen wir nach der Aufmaßnahme mit Ihnen ab.",
    },
    {
      question: "Kann ich die Ausstellung ohne Termin besuchen?",
      answer:
        "Ja. Für ein ruhiges Gespräch empfehlen wir dennoch einen Termin – so ist Ihr Berater vorbereitet und die Zeit gehört Ihnen.",
    },
    {
      question: "Fertigen Sie auch Möbel außerhalb der Küche?",
      answer:
        "Ja, in kleinerem Umfang: Einbauschränke, Ankleiden, Tische und Wohnmöbel – immer dann, wenn sie zur Küche und zum Haus gehören.",
    },
  ],
};

export default function Faq({ content }: { content: FaqContent | null }) {
  const data = content ?? fallback;
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
      <div className="mx-auto max-w-3xl px-6 py-24 md:py-32">
        <p className="type-eyebrow mb-3">{data.eyebrow}</p>
        <h2 id="faq-heading" className="type-h2 text-ink">
          {data.title}
        </h2>
        <div className="mt-12">
          <Accordion items={items} />
        </div>
        <p className="mt-10">
          <Link
            href="/faq"
            className="type-nav text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-ink"
          >
            Alle Fragen nach Thema
          </Link>
        </p>
      </div>
    </section>
  );
}
