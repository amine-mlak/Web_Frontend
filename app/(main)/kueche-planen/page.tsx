import type { Metadata } from "next";
import CollectionHub from "@/components/catalog/CollectionHub";
import Process from "@/components/Process";
import { collectionHubMetadata } from "@/lib/collection-hubs";
import { getRequestLocale } from "@/lib/locale";
import type { ProcessContent } from "@/lib/strapi";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  return collectionHubMetadata("planen");
}

const planProcess: Record<"de" | "en", ProcessContent> = {
  de: {
    eyebrow: "Der Weg zur Küche",
    title: "Von der ersten Idee bis zur Übergabe",
    buttonLabel: "Beratung beginnen",
    buttonHref: "/beratung",
    steps: [],
  },
  en: {
    eyebrow: "The path to the kitchen",
    title: "From the first idea to handover",
    buttonLabel: "Start a consultation",
    buttonHref: "/beratung",
    steps: [
      {
        step: "01",
        title: "Consultation",
        description:
          "We listen, understand everyday life and set the frame for the kitchen.",
        icon: "consult",
      },
      {
        step: "02",
        title: "Planning & design",
        description:
          "Room, material and function become a precise drawing.",
        icon: "plan",
      },
      {
        step: "03",
        title: "Workshop making",
        description:
          "Each element is made as a one-off — to measure, to last.",
        icon: "factory",
      },
      {
        step: "04",
        title: "Fitting & handover",
        description:
          "Fitted on site, adjusted and handed over until it sits as drawn.",
        icon: "handover",
      },
    ],
  },
};

export default async function KuechePlanenPage() {
  const locale = await getRequestLocale();
  return (
    <CollectionHub id="planen" locale={locale}>
      <Process content={planProcess[locale]} />
    </CollectionHub>
  );
}
