import type { Locale } from "@/lib/i18n";
import type { TopicReadingCopy } from "@/lib/topic-reading";

// Sentences from the generated fallback below. They were copied into the CMS reading text of
// 32 materials, appliances, brands and regions, so the same paragraph stood on every page.
const SEEDED = [
  "am Muster und nicht am Bildschirm",
  "etwa zweihundert Kilometer um München",
  "on a sample rather than on a screen",
  "about two hundred kilometres around Munich",
];

/** True for a reading text that is still the generated template, not text written for the page. */
export function isSeededReading(text: string | undefined) {
  return SEEDED.some((sentence) => text?.includes(sentence));
}

export function entryReading(
  title: string,
  intro: string,
  locale: Locale,
): TopicReadingCopy {
  if (locale === "en") {
    return {
      title: `${title} · Wolfersdorf`,
      description: `${intro} Made in Wolfersdorf near Freising, surveyed in Munich and nearby.`,
      heading: `${title}, planned in Wolfersdorf.`,
      paragraphs: [
        intro,
        `We look at ${title} in the showroom at Wolfersdorf near Freising, in daylight, on a sample rather than on a screen. The survey happens in the house, before a front or a slab is ordered.`,
        "Making stays in the same workshop. Munich, Freising, Erding, Dachau, Pfaffenhofen and Augsburg are within our area, about two hundred kilometres around Munich, fitted by us.",
      ],
    };
  }

  return {
    title: `${title} · Wolfersdorf`,
    description: `${intro} Manufaktur in Wolfersdorf bei Freising, Aufmaß in München und im Umland.`,
    heading: `${title}, geplant in Wolfersdorf.`,
    paragraphs: [
      intro,
      `${title} besprechen wir in der Ausstellung in Wolfersdorf bei Freising, unter Tageslicht, am Muster und nicht am Bildschirm. Das Aufmaß machen wir im Haus, bevor Front oder Platte bestellt werden.`,
      "Gefertigt wird in derselben Werkstatt. München, Freising, Erding, Dachau, Pfaffenhofen und Augsburg liegen in unserem Gebiet, etwa zweihundert Kilometer um München, Montage durch uns.",
    ],
  };
}
