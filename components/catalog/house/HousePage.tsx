import LocalBusinessJsonLd from "@/components/LocalBusinessJsonLd";
import { Fragment, type ReactNode } from "react";
import Faq from "@/components/Faq";
import PlannerSection from "@/components/planner/PlannerSection";
import CareersSection from "@/components/careers/CareersSection";
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
import LegalPage from "@/components/catalog/house/LegalPage";
import {
  HOUSE_COMPOSITION,
  houseParagraphs,
  withUniquePhotos,
  type HouseBlock,
  type PresentedHouse,
} from "@/lib/house-pages";

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

export default function HousePage({ house: presented }: { house: PresentedHouse }) {
  const house = withUniquePhotos(presented);
  const copy = COPY[house.locale === "en" ? "en" : "de"];
  const paragraphs = houseParagraphs(house.body);

  if (house.kind === "legal" || house.layout === "legal") {
    return <LegalPage house={house} />;
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
        {/* Karriere gets its job ads and the application form instead of the kitchen planner. */}
        {house.slug === "karriere" ? (
          <CareersSection jobs={house.jobs} locale={house.locale === "en" ? "en" : "de"} />
        ) : (
          <PlannerSection />
        )}
      </>
    ),
    close: <CloseAtelier hub={house} />,
  };

  return (
    <main className="bg-paper">
      {/* The pages people open to find the showroom carry the business data for local search. */}
      {house.slug === "kontakt" || house.slug === "ausstellung" ? <LocalBusinessJsonLd /> : null}
      {HOUSE_COMPOSITION[house.layout].map((name) => (
        <Fragment key={name}>{block[name]}</Fragment>
      ))}
    </main>
  );
}
