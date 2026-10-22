import { Fragment, type ReactNode } from "react";
import Faq from "@/components/Faq";
import LeadCta from "@/components/LeadCta";
import AtelierFacts from "@/components/catalog/hub/AtelierFacts";
import AtelierVisit from "@/components/catalog/hub/AtelierVisit";
import ChapterRun from "@/components/catalog/hub/ChapterRun";
import CloseAtelier from "@/components/catalog/hub/CloseAtelier";
import CollectionHero from "@/components/catalog/hub/CollectionHero";
import CollectionSiblings from "@/components/catalog/hub/CollectionSiblings";
import PriceStance from "@/components/catalog/hub/PriceStance";
import HouseBanner from "@/components/catalog/house/HouseBanner";
import HouseBody from "@/components/catalog/house/HouseBody";
import HouseGallery from "@/components/catalog/house/HouseGallery";
import HousePeople from "@/components/catalog/house/HousePeople";
import { houseParagraphs, type PresentedHouse } from "@/lib/house-pages";
import type { HouseLayout } from "@/lib/house-photos";
import type { BeratungContent } from "@/lib/strapi";

type HouseBlock =
  | "night"
  | "title"
  | "film"
  | "plate"
  | "ledger"
  | "price"
  | "body"
  | "gallery"
  | "people"
  | "chapters"
  | "visit"
  | "siblings"
  | "form"
  | "close";

const COMPOSITION: Record<HouseLayout, HouseBlock[]> = {
  legal: [],
  manufactory: ["night", "body", "chapters", "siblings", "close"],
  showroom: ["plate", "gallery", "visit"],
  people: ["film", "people", "body", "close"],
  lasting: ["title", "ledger", "body"],
  place: ["night", "ledger", "body", "visit", "form"],
  papers: ["film", "body", "form"],
  path: ["title", "price", "chapters", "visit"],
  letter: ["title", "body", "form"],
};

const COPY = {
  de: {
    siblingEyebrow: "Die Manufaktur",
    siblingTitle: "Andere Räume des Hauses.",
    peopleEyebrow: "Die Werkstatt",
    peopleTitle: "Wer aufmisst, fertigt, montiert.",
    galleryEyebrow: "Das Studio",
    galleryTitle: "Muster, Kanten, Licht.",
  },
  en: {
    siblingEyebrow: "The manufactory",
    siblingTitle: "Other rooms of the house.",
    peopleEyebrow: "The workshop",
    peopleTitle: "Who surveys, makes, fits.",
    galleryEyebrow: "The studio",
    galleryTitle: "Samples, edges, daylight.",
  },
} as const;

export default function HousePage({
  house,
  lead,
}: {
  house: PresentedHouse;
  lead?: BeratungContent | null;
}) {
  const copy = COPY[house.locale === "en" ? "en" : "de"];
  const paragraphs = houseParagraphs(house.body);

  if (house.kind === "legal" || house.layout === "legal") {
    return (
      <main className="bg-paper">
        <header className="mx-auto max-w-3xl px-6 pt-28 pb-4 md:pt-32">
          <p className="type-eyebrow">{house.eyebrow || "BEER"}</p>
          <h1 className="type-h1 mt-3 text-ink">{house.title}</h1>
          {house.lede ? <p className="type-intro mt-8">{house.lede}</p> : null}
        </header>
        <HouseBody paragraphs={paragraphs} />
      </main>
    );
  }

  const block: Record<HouseBlock, ReactNode> = {
    night: <CollectionHero hub={house} />,
    title: <HouseBanner house={house} bare />,
    film: <HouseBanner house={house} film />,
    plate: <HouseBanner house={house} />,
    ledger: (
      <AtelierFacts
        facts={house.facts}
        kicker={house.eyebrow}
        image={house.ledgerImage}
        sentence={house.ledgerLine}
      />
    ),
    price: <PriceStance line={house.priceLine} />,
    body: (
      <HouseBody
        eyebrow={house.eyebrow}
        title={house.bodyTitle}
        paragraphs={paragraphs}
      />
    ),
    gallery: (
      <HouseGallery
        eyebrow={copy.galleryEyebrow}
        title={copy.galleryTitle}
        shots={house.gallery}
      />
    ),
    people: (
      <HousePeople
        eyebrow={copy.peopleEyebrow}
        title={copy.peopleTitle}
        people={house.people}
      />
    ),
    chapters: <ChapterRun hub={house} />,
    visit: <AtelierVisit hub={house} />,
    siblings: (
      <CollectionSiblings
        siblings={house.siblings}
        eyebrow={copy.siblingEyebrow}
        title={copy.siblingTitle}
      />
    ),
    form: (
      <>
        {house.faq ? <Faq content={house.faq} /> : null}
        <LeadCta content={lead ?? null} />
      </>
    ),
    close: <CloseAtelier hub={house} />,
  };

  return (
    <main className="bg-paper">
      {COMPOSITION[house.layout].map((name) => (
        <Fragment key={name}>{block[name]}</Fragment>
      ))}
    </main>
  );
}
