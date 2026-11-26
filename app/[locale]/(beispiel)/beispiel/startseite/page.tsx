import type { Metadata } from "next";
import Image from "next/image";
import ClickMenu from "@/components/beispiel/ClickMenu";
import SlideRow from "@/components/beispiel/SlideRow";
import { FloatingCta, HeroDrift } from "@/components/beispiel/StartseiteMotion";
import CmsImage from "@/components/CmsImage";
import FooterRegions from "@/components/FooterRegions";
import LocaleLink from "@/components/LocaleLink";
import SiteHeader from "@/components/SiteHeader";
import { fetchKitchenTopics, fetchProjects } from "@/lib/catalog-api";
import { projectHref, type Project } from "@/lib/catalog";
import { PLANNER_HREF, TERMIN_HREF, ctaHref } from "@/lib/cta";
import type { SocialIcon } from "@/lib/footer";
import { menuPanels } from "@/lib/navigation";
import { fetchFooter, fetchHeader, fetchHomeCms } from "@/lib/strapi";

/**
 * Example only, not linked anywhere: the start page in the layout of BEER's own design draft
 * ("Startseite", September 2026), filled from the same CMS data as the real start page. The
 * header is the site's own, with menus that open on a click.
 */
export const revalidate = 120;

export const metadata: Metadata = {
  title: "Beispiel: Startseite nach BEER-Entwurf",
  robots: { index: false, follow: false },
};

// The draft sets part of each heading in italics; the site switches that off for headings.
const kursiv = { fontStyle: "italic" } as const;

const wrap = "mx-auto max-w-[1120px]";
const eyebrow = "font-sans text-[11px] uppercase tracking-[3px] text-bronze";
const h2 = "font-serif font-medium text-ink";
const body = "font-sans text-[16px] font-light leading-[1.7] text-[#4A4A46]";
const blackPill = "inline-block rounded-full bg-ink px-[30px] py-[13px] font-sans text-[14px] !text-[#FBF9F5] transition-colors hover:bg-black";

/**
 * The four Küchenwelten of the draft with their panel colours. The link goes to the CMS topic of
 * that name; the photo is a project picked by hand to sit well beside the panel colour
 * (greige beside the light panel, dark blue beside the blue one, matt black, warm brown wood).
 */
const WELTEN = [
  { name: "Moderne Küchen", match: /modern/i, panel: "#F7F5F1", text: "#141414", foto: "simple-elegance-taupe-rillen-eiche" },
  { name: "Landhausküchen", match: /landhaus/i, panel: "#2E3A45", text: "#F6F3EC", foto: "vintage-love-dunkelblau-regalwand" },
  { name: "Grifflose Küchen", match: /grifflos/i, panel: "#131311", text: "#F6F3EC", foto: "schwarz-matt-graue-platte-insel" },
  { name: "Holzküchen", match: /holz/i, panel: "#3B322A", text: "#C8A87E", foto: "massivholz-schwarzer-stein" },
];

/** Projects picked by hand for the example: hero, the photo beside the bronze panel, the row. */
const HERO_PROJEKT = "eichenlamellen-ziegelgewoelbe";
const TAFEL_PROJEKT = "taubenblau-messinggriffe-insel";
const REFERENZEN = [
  "pure-nature-eichenwand-lange-insel",
  "salbei-schrankwand-lange-insel",
  "schwarz-gas-eichenstufen-insel",
  "runde-insel-eichenstaebe-stein",
  "koenigsblau-landhaus-leder",
  "schwarz-sichtbeton-eichenlamellen",
  "muenchen-loft-grau",
  "kobaltblau-eichennische",
  "landhaus-weiss-gruener-herd",
];

/** A project photo in the width a full-screen hero needs (project photos come at card width). */
function wide(src: string) {
  return src.replace(/^\/cms-opt\/\d+\//, "/cms-opt/2560/");
}

/**
 * BEER's Google profile as read on 26 Nov 2026. The site has no connection to Google yet, so the
 * two figures are typed in, and the reviews are four from the profile, word for word as their
 * authors wrote them.
 */
const GOOGLE = {
  rating: "5,0",
  count: 175,
  href: "https://www.google.com/maps?cid=14286197608992594529",
};

const BEWERTUNGEN = [
  {
    name: "Sabrina Gath",
    text: [
      "Wir haben uns bewusst für Beer-Küchen entschieden. Eine individuell gestaltete Küche, genau nach unserem Geschmack! Ein absolutes Raumwunder, da jeder Zentimeter verplant wurde!",
      "Vielen Dank an das Team und vor allem an Herrn Pecho, der all seine Erfahrung einbrachte und uns somit unsere Traumküche umgesetzt hat! Kann man nur weiter empfehlen! Herzlichsten Dank",
    ],
  },
  {
    name: "Rudolf Huber",
    text: [
      "Wir sind echt begeistert von der gelieferten Küche von Beer. Die ganze Lieferkette, von der Planung, der Fertigung und von der exakten Montage haben wir so noch nirgends bekommen. Die ganze Darbietung ist außergewöhnlich. Wir haben unsere individuell gefertigte Küche in kürzester Lieferzeit erhalten. Die Qualität jedes Details ist hervorragend und wir wissen nach mehreren gekauften Küchen bei sogennannten Küchenspezialisten von was wir sprechen. Wir sind froh bei Ihnen gekauft zu haben, solche Arbeit ist es Wert. Danke.",
    ],
  },
  {
    name: "Michael Neubauer",
    text: [
      "Die Beer Küchenmanufaktur ist eine wunderbare Adresse für individuelle Küchen. Sehr gute Beratung, transparente Angebote mit übersichtlichen und aussagekräftigen Entwurfszeichnungen. Termintreu und absolut zuverlässig mit 1a-Arbeit. Uneingeschränkte Weiterempfehlung!",
    ],
  },
  {
    name: "Ingrid Vocht",
    text: [
      "Sehr gute Beratung, individuelle Küchen, versiertes Einbaupersonal, insgesamt problemlose Kommunikation.Sehr zu empfehlen.Perfektes Ergebnis, ich würde auch 10 Sterne vergeben.",
    ],
  },
];

function plain(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function stilLine(project: Project) {
  const names = project.topics.filter((topic) => topic.cluster === "stile" || topic.cluster === "farben").map((topic) => topic.name);
  return [...new Set(names)].slice(0, 2).join(", ") || project.title;
}

export default async function BeispielStartseite() {
  const [home, topics, projects, footer, header] = await Promise.all([
    fetchHomeCms(),
    fetchKitchenTopics(),
    fetchProjects(),
    fetchFooter(),
    fetchHeader(),
  ]);

  // Header: the site's menus; in "Küchen" the outdoor photo gives way to the planner.
  const panels = header?.panels?.length ? header.panels : menuPanels;
  const planerFoto = panels.find((panel) => /planen/i.test(panel.label))?.teasers?.[0];
  const menu = panels.map((panel) =>
    /^küchen$/i.test(panel.label)
      ? {
          ...panel,
          teasers: (panel.teasers ?? []).flatMap((teaser) => {
            if (!/outdoor/i.test(`${teaser.caption} ${teaser.href}`)) return [teaser];
            return planerFoto ? [{ ...planerFoto, href: PLANNER_HREF, caption: "Küche planen", alt: "Küche planen" }] : [];
          }),
        }
      : panel,
  );

  const withPhoto = projects.filter((project) => project.image);
  const bySlug = (slug: string) => withPhoto.find((project) => project.slug === slug);
  const heroProjekt = bySlug(HERO_PROJEKT);
  const hero = heroProjekt
    ? { src: wide(heroProjekt.image), alt: heroProjekt.title }
    : (home.heroSlides[0] ?? (withPhoto[0] ? { src: withPhoto[0].image, alt: withPhoto[0].title } : null));
  const welten = WELTEN.map((welt, index) => {
    const topic = topics.find((item) => welt.match.test(item.name) || welt.match.test(item.slug));
    return {
      ...welt,
      href: topic ? `/kuechen/${topic.cluster}/${topic.slug}` : "/kuechen",
      image: bySlug(welt.foto)?.image || topic?.image || withPhoto[index]?.image || "",
    };
  });
  const picked = REFERENZEN.map(bySlug).filter((project): project is Project => Boolean(project));
  const referenzen = [...picked, ...withPhoto.filter((project) => !picked.includes(project))].slice(0, 9);
  const tafelFoto = bySlug(TAFEL_PROJEKT) ?? withPhoto[3] ?? withPhoto[0];
  const steps = (home.ablauf?.steps ?? []).slice(0, 4);
  const zitate = [
    home.faq?.quote ? { text: home.faq.quote, source: home.faq.quoteSource } : null,
    ...topics.filter((topic) => topic.zitat).map((topic) => ({ text: topic.zitat as string, source: topic.zitatQuelle })),
  ]
    .filter((quote): quote is { text: string; source: string | undefined } => Boolean(quote))
    .slice(0, 2);
  const fragen = (home.faq?.items ?? []).slice(0, 5);
  const copyright = footer.copyright.replace("{year}", String(new Date().getFullYear()));

  return (
    <div className="bg-paper">
      {/* The draft's hero entrance: the photo fades in, the card rises. */}
      <style>{`
        @keyframes beispielFade{from{opacity:0}to{opacity:1}}
        @keyframes beispielRise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        .beispiel-hero-photo{animation:beispielFade 1.1s ease .05s both}
        .beispiel-hero-card{animation:beispielRise .9s cubic-bezier(.22,.7,.3,1) .35s both}
        @media(prefers-reduced-motion:reduce){.beispiel-hero-photo,.beispiel-hero-card{animation:none}}
      `}</style>
      {/* Header: ours, menus open on a click */}
      <SiteHeader>
        <header>
          <ClickMenu
            panels={menu}
            dropdown={menu.find((panel) => /^küchen$/i.test(panel.label))?.id ?? menu[0]?.id ?? ""}
            logoSrc={header?.logo || "/logo.png"}
            wordmarkSrc={header?.wordmark}
            logoAlt={header?.logoAlt ?? "BEER Küchenmanufaktur"}
          />
        </header>
      </SiteHeader>

      <main>
        {/* Hero */}
        <section data-hero-overlay data-site-hero className="relative -mt-14 h-[70vh] min-h-[560px] overflow-hidden md:h-[90vh]">
          <HeroDrift>
            {hero ? <CmsImage src={hero.src} alt={hero.alt} fill priority sizes="100vw" className="object-cover" /> : null}
          </HeroDrift>
          <div className="relative flex h-full flex-col justify-end px-5 pb-7 md:px-12 md:pb-[84px]">
            <div className="beispiel-hero-card max-w-[520px] self-start bg-[rgba(18,17,15,0.08)] px-[18px] py-4 backdrop-blur-[8px] backdrop-saturate-[1.05] md:px-7 md:py-6">
              <p className="mb-2.5 font-sans text-[10px] uppercase tracking-[3px] text-[#F6F3EC] md:mb-[18px] md:text-[11px]">
                Küchenmanufaktur Wolfersdorf bei Freising
              </p>
              <h1 className="mb-2.5 font-serif text-[26px] font-medium leading-[1.15] text-paper md:mb-3 md:text-[38px]">
                Wir bauen, <em style={kursiv}>was bleibt.</em>
              </h1>
              <p className="mb-[18px] max-w-[440px] font-sans text-[14px] font-light leading-[1.7] text-[#F1EEE7] md:mb-6 md:text-[16px]">
                Küchen aus eigener Werkstatt – geplant, gefertigt und montiert von einem Team, für München und Umgebung.
              </p>
              <LocaleLink
                href={TERMIN_HREF}
                className="inline-block rounded-full bg-paper px-[22px] py-[11px] font-sans text-[13px] !text-ink md:px-[30px] md:py-[14px] md:text-[14px]"
              >
                Beratung anfragen
              </LocaleLink>
            </div>
          </div>
        </section>

        {/* Manufaktur-Intro */}
        <section className="px-5 pt-[110px] md:px-12">
          <div className="mx-auto max-w-[680px] text-center">
            <p className={`${eyebrow} mb-4`}>Küchenmanufaktur bei München</p>
            <h2 className={`${h2} mb-[18px] text-[34px] leading-[1.25]`}>
              Küchen nach Maß – <em style={kursiv}>seit 1981 aus Wolfersdorf.</em>
            </h2>
            <p className={body}>
              Als Küchenmanufaktur bei Freising planen, fertigen und montieren wir Einbauküchen für München und das Umland – vom
              ersten Entwurf bis zur letzten Fuge aus einer Hand. Jede Küche entsteht in unserer eigenen Werkstatt: massiv,
              millimetergenau, gebaut für Jahrzehnte.
            </p>
          </div>
        </section>

        {/* Küchenwelten */}
        <section className="px-5 py-[120px] md:px-12">
          <div className={wrap}>
            <p className={`${eyebrow} mb-4`}>Küchenwelten</p>
            <h2 className={`${h2} mb-14 max-w-[560px] text-[42px] leading-[1.15]`}>
              Räume, die Ihre <em style={kursiv}>Handschrift tragen.</em>
            </h2>
            <div className="grid gap-7 min-[861px]:grid-cols-2">
              {welten.map((welt) => (
                <LocaleLink key={welt.name} href={welt.href} className="grid min-h-[300px] grid-cols-2">
                  <div className="relative">
                    {welt.image ? (
                      <CmsImage src={welt.image} alt={welt.name} fill sizes="(min-width:861px) 280px, 50vw" className="object-cover" />
                    ) : null}
                  </div>
                  <div className="flex flex-col items-center justify-center gap-[22px] px-3 py-8 md:p-8" style={{ background: welt.panel }}>
                    <span className="max-w-full text-center font-serif text-[20px] font-medium leading-[1.25] hyphens-auto md:text-[27px]" style={{ color: welt.text }}>
                      {welt.name}
                    </span>
                    <span className="rounded-full bg-[rgba(253,252,250,0.82)] px-[22px] py-[9px] font-sans text-[13px] text-ink">
                      Entdecken
                    </span>
                  </div>
                </LocaleLink>
              ))}
            </div>
          </div>
        </section>

        {/* Kundenstimmen */}
        {zitate.length ? (
          <section className="bg-karte px-5 py-[120px] md:px-12">
            <div className={`${wrap} grid gap-[72px] ${zitate.length > 1 ? "min-[861px]:grid-cols-2" : "max-w-[760px] text-center"}`}>
              {zitate.map((quote) => (
                <figure key={quote.text}>
                  <blockquote className="font-serif text-[29px] font-medium italic leading-[1.4] text-ink">
                    „{plain(quote.text).replace(/^[„"»]|[“"«]$/g, "")}“
                  </blockquote>
                  {quote.source ? <figcaption className="mt-[22px] font-sans text-[13px] text-[#8A867E]">{quote.source}</figcaption> : null}
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        {/* Farbtafel-Triptychon */}
        <section className="grid min-h-[520px] min-[861px]:grid-cols-[2fr_1fr_1fr]">
          <div className="relative min-h-[320px]">
            {tafelFoto ? (
              <CmsImage src={tafelFoto.image} alt={tafelFoto.title} fill sizes="(min-width:861px) 50vw, 100vw" className="object-cover" />
            ) : null}
          </div>
          <div className="flex flex-col items-center justify-center gap-[18px] bg-bronze-tafel px-10 py-16 text-center text-[#FBF9F5]">
            <p className="font-sans text-[11px] uppercase tracking-[3px] opacity-85">Vintage Love</p>
            <p className="font-serif text-[32px] font-medium italic leading-[1.3]">Warm, echt, gemütlich.</p>
            <p className="max-w-[280px] font-sans text-[15px] font-light leading-[1.7] opacity-90">
              Eine Küche, die nach Zuhause aussieht – gebaut aus Eiche, Messing und Zeit.
            </p>
          </div>
          <div className="relative min-h-[320px] bg-espresso">
            <Image src="/beispiel-assets/kueche-skizze-espresso.webp" alt="" fill sizes="(min-width:861px) 25vw, 100vw" className="object-cover" />
          </div>
        </section>

        {/* Küchenplaner-Teaser */}
        <section className="bg-cream">
          <div className={`${wrap} flex flex-wrap items-center justify-between gap-7 px-5 py-24 md:px-12`}>
            <div>
              <h2 className={`${h2} mb-3 text-[36px]`}>
                Welche Küche <em style={kursiv}>passt zu Ihnen?</em>
              </h2>
              <p className={`${body} max-w-[440px]`}>
                Beantworten Sie fünf Fragen – unser Küchenplaner zeigt Ihnen Stile, Materialien und eine erste Preisspanne.
              </p>
            </div>
            <LocaleLink href={PLANNER_HREF} className="border-b border-gold pb-[3px] font-sans text-[15px] text-gold hover:text-bronze">
              Küchenplaner starten&nbsp;→
            </LocaleLink>
          </div>
        </section>

        {/* Referenzen */}
        <section className="px-5 pt-[120px] pb-[72px] md:px-12">
          <div className={wrap}>
            <p className={`${eyebrow} mb-4`}>Referenzen</p>
            <h2 className={`${h2} mb-14 text-[42px]`}>
              Zuletzt <em style={kursiv}>gebaut</em>
            </h2>
            <SlideRow label="Zuletzt gebaute Küchen" arrowClass="top-[180px]">
              {referenzen.map((project) => (
                <LocaleLink key={project.slug} href={projectHref(project.slug)} className="block">
                  <div className="relative h-[360px]">
                    <CmsImage src={project.image} alt={project.title} fill sizes="(min-width:861px) 360px, 82vw" className="object-cover" />
                  </div>
                  <p className="mt-4 font-sans text-[15px] text-ink">{project.title}</p>
                  <p className="mt-[3px] font-sans text-[13px] text-[#8A867E]">
                    {[project.place, stilLine(project)].filter((part) => part && part !== project.title).join(" · ")}
                  </p>
                </LocaleLink>
              ))}
            </SlideRow>
            <div className="mt-14 text-center">
              <LocaleLink href="/projekte" className={blackPill}>Alle Referenzen</LocaleLink>
            </div>
          </div>
        </section>

        {/* So entsteht Ihre Küche */}
        <section className="bg-paper px-5 pt-[72px] pb-[110px] md:px-12">
          <div className={wrap}>
            <p className={`${eyebrow} mb-4`}>Der Weg</p>
            <h2 className={`${h2} mb-16 text-[42px]`}>
              So entsteht <em style={kursiv}>Ihre Küche</em>
            </h2>
            <ol className="grid grid-cols-2 gap-11 min-[861px]:grid-cols-4">
              {steps.map((step, index) => (
                <li key={step.title}>
                  <p className="mb-3.5 font-serif text-[30px] text-messing">{String(index + 1).padStart(2, "0")}</p>
                  <p className="mb-2 font-sans text-[16px] text-ink">{step.title}</p>
                  <p className="font-sans text-[15px] font-light leading-[1.7] text-[#8A867E]">{plain(step.description)}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Region & Ausstellung */}
        <section className="bg-cream px-5 py-24 md:px-12">
          <div className="mx-auto max-w-[680px] text-center">
            <p className={`${eyebrow} mb-4`}>Ausstellung Freising</p>
            <h2 className={`${h2} mb-[18px] text-[34px] leading-[1.25]`}>
              Küchenstudio für München, Freising <em style={kursiv}>und das Umland.</em>
            </h2>
            <p className={body}>
              In unserer Ausstellung in Freising erleben Sie moderne Küchen, Landhausküchen und grifflose Designküchen in
              Originalgröße – mit Geräten von Bora, Miele, Gaggenau und Quooker. Wir beraten Sie persönlich, messen bei Ihnen auf
              und begleiten Ihr Projekt von Erding bis Dachau, von Pfaffenhofen bis München.
            </p>
          </div>
        </section>

        {/* Google-Bewertungen: Karten, die von selbst weiterziehen */}
        <section className="px-5 pt-[120px] md:px-12">
          <div className={wrap}>
            <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className={`${eyebrow} mb-4`}>Google-Bewertungen</p>
                <h2 className={`${h2} text-[42px] leading-[1.15]`}>
                  Was unsere Kunden <em style={kursiv}>sagen</em>
                </h2>
              </div>
              <a href={GOOGLE.href} target="_blank" rel="noreferrer" className="font-sans text-[15px] text-[#4A4A46]">
                <span className="font-serif text-[30px] text-ink">{GOOGLE.rating}</span>
                <span className="mx-2.5 tracking-[2px] text-messing">★★★★★</span>
                {GOOGLE.count} Rezensionen bei Google&nbsp;→
              </a>
            </div>
            <SlideRow label="Google-Bewertungen" auto={5000}>
              {BEWERTUNGEN.map((review) => (
                <figure key={review.name} className="flex h-full min-h-[260px] flex-col bg-karte p-8">
                  <div className="flex items-center justify-between">
                    <span className="tracking-[2px] text-messing" aria-label="5 von 5 Sternen">★★★★★</span>
                    <span className="font-sans text-[12px] text-[#8A867E]">Google</span>
                  </div>
                  <blockquote className="mt-5 space-y-3 font-sans text-[15px] font-light leading-[1.7] text-[#4A4A46]">
                    {review.text.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </blockquote>
                  <figcaption className="mt-auto pt-6 font-sans text-[14px] text-ink">{review.name}</figcaption>
                </figure>
              ))}
            </SlideRow>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-5 py-[120px] md:px-12">
          <div className="mx-auto max-w-[760px]">
            <h2 className={`${h2} mb-12 text-[42px]`}>
              Häufige <em style={kursiv}>Fragen</em>
            </h2>
            {fragen.map((item) => (
              <details key={item.question} className="group border-t border-[#E5E1DA]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-[22px] font-sans text-[16px] text-ink [&::-webkit-details-marker]:hidden">
                  <span>{item.question}</span>
                  <span aria-hidden className="font-sans text-[18px] font-light text-bronze">
                    <span className="group-open:hidden">+</span>
                    <span className="hidden group-open:inline">–</span>
                  </span>
                </summary>
                <p className="pr-10 pb-6 font-sans text-[15px] font-light leading-[1.7] text-[#4A4A46]">{plain(item.answer)}</p>
              </details>
            ))}
            <div className="border-t border-[#E5E1DA]" />
          </div>
        </section>

        {/* Abschluss */}
        <section className="bg-cream px-5 py-24 text-center md:px-12">
          <span className="mx-auto mb-7 block h-px w-14 bg-messing" aria-hidden />
          <h2 className={`${h2} mb-[18px] text-[38px] md:text-[46px]`}>
            Sprechen wir über <em style={kursiv}>Ihre Küche.</em>
          </h2>
          <p className="mb-[34px] font-sans text-[16px] font-light text-[#8A867E]">
            Persönlich in der Ausstellung Freising oder bei Ihnen zu Hause.
          </p>
          <LocaleLink href={TERMIN_HREF} className={`${blackPill} !px-8 !py-3.5`}>Beratung anfragen</LocaleLink>
        </section>
      </main>

      {/* Footer */}
      <footer data-beispiel-footer className="border-t border-[#2A2822] bg-nacht px-5 pt-24 pb-10 text-[#8A867E] md:px-12">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-[72px] flex justify-center">
            <LocaleLink href="/" aria-label="Zur Startseite">
              <CmsImage
                src={header?.logo || "/logo.png"}
                alt=""
                width={98}
                height={104}
                className="h-[104px] w-auto opacity-90 brightness-0 invert"
              />
            </LocaleLink>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(168px,1fr))] gap-x-9 gap-y-10 font-sans text-[13px] font-light leading-[2.1] [&_a]:!text-[13px] [&_a]:!leading-[2.1] [&_button]:!min-h-0 [&_button]:!text-[13px] [&_button]:!leading-[2.1] [&_button]:!text-[#B9B4AA]">
            {footer.columns.map((column) => (
              <div key={column.title}>
                <p className="mb-3.5 text-[11px] uppercase tracking-[3px] text-messing">{column.title}</p>
                <div className="flex flex-col">
                  {column.links.map((link) => (
                    <LocaleLink key={`${link.href}-${link.label}`} href={ctaHref(link.href, link.label)} className="!text-[#B9B4AA] hover:!text-white">
                      {link.label}
                    </LocaleLink>
                  ))}
                  {column.more ? <FooterRegions label={column.more.label} links={column.more.links} /> : null}
                </div>
              </div>
            ))}
            <div>
              <p className="mb-3.5 text-[11px] uppercase tracking-[3px] text-messing">{footer.contactTitle}</p>
              <div className="flex flex-col text-[#B9B4AA]">
                {footer.contactLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
                <div className="mt-3 flex gap-6">
                  {footer.shortcuts.map((link) => (
                    <LocaleLink key={link.label} href={ctaHref(link.href, link.label)} className="uppercase tracking-[1.5px] !text-messing">
                      {link.label}
                    </LocaleLink>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div
            data-beispiel-legal
            className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-[18px] border-t border-[#2A2822] pt-7 font-sans text-[12px] min-[1025px]:justify-between"
          >
            <div className="order-2 flex flex-wrap justify-center gap-6 min-[1025px]:order-1">
              {footer.legal.map((link) => (
                <LocaleLink key={link.label} href={link.href} className="!text-[#8A867E] hover:!text-white">
                  {link.label}
                </LocaleLink>
              ))}
            </div>
            <span className="order-3 w-full text-center font-light text-[#5C584F] md:w-auto min-[1025px]:order-2">{copyright}</span>
            <div className="order-1 flex w-full flex-wrap items-center justify-center gap-4 min-[1025px]:order-3 min-[1025px]:w-auto md:gap-6">
              {footer.social.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.label}
                  title={link.label}
                  className="flex size-12 items-center justify-center rounded-full border border-[#2A2822] !text-[#8A867E] transition-colors hover:border-messing hover:!text-messing"
                >
                  <SocialOutline icon={link.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <FloatingCta href={TERMIN_HREF} label="Beratung anfragen" />
    </div>
  );
}

/** The outline icons of the draft's footer. */
function SocialOutline({ icon }: { icon: SocialIcon }) {
  if (icon === "houzz") {
    return <span className="font-sans text-[17px] font-medium tracking-[0.5px]">hz</span>;
  }
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
      {icon === "instagram" ? (
        <>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="4.2" />
          <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
        </>
      ) : null}
      {icon === "youtube" ? (
        <>
          <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
          <path d="M10.4 9.6L15 12l-4.6 2.4V9.6z" />
        </>
      ) : null}
      {icon === "facebook" ? (
        <path d="M14.8 7.4h2V4.6h-2.3c-2.1 0-3.4 1.3-3.4 3.4v2h-2.2v2.8h2.2v6.6h2.9v-6.6h2.3l.4-2.8h-2.7V8.4c0-.6.3-1 .8-1z" />
      ) : null}
      {icon === "pinterest" ? (
        <path d="M9.6 20.4c-.5-1.7-.1-3.5.2-4.7l1-4.1a3.4 3.4 0 01-.3-1.4c0-1.4.8-2.4 1.8-2.4.8 0 1.2.6 1.2 1.4 0 .9-.6 2.2-.9 3.4-.2 1 .5 1.9 1.6 1.9 1.9 0 3.2-2.4 3.2-5.2 0-2.2-1.5-3.8-4.1-3.8-3 0-4.9 2.2-4.9 4.6 0 .9.3 1.5.7 2 .2.2.2.3.2.6l-.2.8c-.1.3-.3.4-.6.2-1.2-.5-1.8-1.9-1.8-3.6 0-2.7 2.3-5.9 6.8-5.9 3.6 0 6 2.6 6 5.4 0 3.7-2 6.4-5 6.4-1 0-2-.6-2.3-1.2l-.6 2.4c-.2.8-.6 1.7-1 2.3z" />
      ) : null}
    </svg>
  );
}
