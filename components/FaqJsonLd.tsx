import type { FaqEntry } from "@/lib/faq";

export default function FaqJsonLd({ items }: { items: Pick<FaqEntry, "question" | "answer">[] }) {
  if (items.length === 0) {
    return null;
  }

  const json = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
