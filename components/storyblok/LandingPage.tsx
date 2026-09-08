import type { ReactNode } from "react";
import { storyblokEditable } from "@storyblok/react/rsc";
import type { SbBlokData } from "@storyblok/react/rsc";
import Entdecken from "@/components/Entdecken";
import Faq from "@/components/Faq";
import Hero from "@/components/Hero";
import Kacheln from "@/components/Kacheln";
import LeadCta from "@/components/LeadCta";
import Process from "@/components/Process";
import {
  mapStoryblokLanding,
  sectionBlok,
} from "@/lib/storyblok-home";

function Editable({
  blok,
  children,
}: {
  blok?: SbBlokData;
  children: ReactNode;
}) {
  if (!blok) return children;
  return <div {...storyblokEditable(blok)}>{children}</div>;
}

export default function LandingPage({ blok }: { blok: SbBlokData }) {
  const cms = mapStoryblokLanding(blok);

  return (
    <main {...storyblokEditable(blok)} className="bg-paper">
      <Editable blok={sectionBlok(blok.hero)}>
        <Hero slides={cms.heroSlides} />
      </Editable>
      <Editable blok={sectionBlok(blok.kacheln)}>
        <Kacheln content={cms.kacheln} />
      </Editable>
      <Editable blok={sectionBlok(blok.ablauf)}>
        <Process content={cms.ablauf} />
      </Editable>
      <Editable blok={sectionBlok(blok.entdecken)}>
        <Entdecken content={cms.entdecken} />
      </Editable>
      <Editable blok={sectionBlok(blok.faq)}>
        <Faq content={cms.faq} />
      </Editable>
      <Editable blok={sectionBlok(blok.beratung)}>
        <LeadCta content={cms.beratung} />
      </Editable>
    </main>
  );
}

/** Nested bloks are mapped by the parent; keep them registered for the Visual Editor. */
export function NestedBlok({ blok }: { blok: SbBlokData }) {
  return <span {...storyblokEditable(blok)} hidden />;
}
