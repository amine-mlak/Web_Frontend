import type { Metadata } from "next";
import CmsImage from "@/components/CmsImage";
import LocaleLink from "@/components/LocaleLink";
import { fetchKitchenTopics, fetchProjects } from "@/lib/catalog-api";
import { projectHref } from "@/lib/catalog";
import { PLANNER_HREF, TERMIN_HREF } from "@/lib/cta";
import { getSiteSettings } from "@/lib/site-settings";
import { fetchBrandLogos, fetchFooter, fetchHeader, fetchHomeCms } from "@/lib/strapi";

/**
 * Example only, not linked anywhere: the start page in the 13 sections of the original design
 * brief, filled from the same CMS data as the real start page. It has its own header and
 * footer so the two can be compared side by side.
 */
export const revalidate = 120;

export const metadata: Metadata = {
  title: "Beispiel: Startseite nach BEER-Vorlage",
  robots: { index: false, follow: false },
};

// Their brief sets single words of a heading in italics; the site switches that off for headings.
const kursiv = { fontStyle: "italic" } as const;

const eyebrow = "font-sans text-[11px] font-medium uppercase tracking-[0.27em]";
const serif = "font-serif font-medium text-ink";

/** The six Küchenwelten of the brief, each matched to a topic in the CMS by its name. */
const WELTEN: { label: string; match: RegExp; tone: string; dark?: boolean }[] = [
  { label: "Moderne Küchen", match: /modern/i, tone: "#F0E8DC" },
  { label: "Landhausküchen", match: /landhaus/i, tone: "#C2A483", dark: true },
  { label: "Grifflose Küchen", match: /grifflos/i, tone: "#3B322A", dark: true },
  { label: "Küchen mit Kochinsel", match: /insel/i, tone: "#F7F5F1" },
  { label: "Raumhohe Küchen", match: /raumhoch|raumhohe/i, tone: "#131311", dark: true },
  { label: "Holzküchen", match: /holz/i, tone: "#C8A87E" },
];

export default async function BeispielStartseite() {
  const [home, topics, projects, logos, footer, header, settings] = await Promise.all([
    fetchHomeCms(),
    fetchKitchenTopics(),
    fetchProjects(),
    fetchBrandLogos(),
    fetchFooter(),
    fetchHeader(),
    getSiteSettings(),
  ]);

  const withPhoto = projects.filter((project) => project.image);
  const hero = home.heroSlides[0] ?? (withPhoto[0] ? { src: withPhoto[0].image, alt: withPhoto[0].title } : null);
  const phoneHref = `tel:${settings.phone.replace(/[^+\d]/g, "")}`;

  const welten = WELTEN.map((welt, index) => {
    const topic = topics.find((item) => welt.match.test(item.name) || welt.match.test(item.slug));
    return {
      ...welt,
      href: topic ? `/kuechen/${topic.cluster}/${topic.slug}` : "/kuechen",
      image: topic?.image || withPhoto[index % Math.max(withPhoto.length, 1)]?.image || "",
      found: Boolean(topic),
    };
  });

  const referenzen = withPhoto.slice(0, 3);
  const tafelFoto = withPhoto[3] ?? withPhoto[0];
  const steps = home.ablauf?.steps ?? [];
  const werkstatt = steps.find((step) => step.icon === "factory" && step.image) ?? steps.find((step) => step.image);
  const zitate = [
    home.faq?.quote ? { text: home.faq.quote, source: home.faq.quoteSource } : null,
    ...topics.filter((topic) => topic.zitat).map((topic) => ({ text: topic.zitat as string, source: topic.zitatQuelle })),
  ]
    .filter((quote): quote is { text: string; source: string | undefined } => Boolean(quote))
    .slice(0, 2);
  const fragen = (home.faq?.items ?? []).slice(0, 5);
  const marken = logos.filter((logo) => /bora|miele|gaggenau|quooker/i.test(logo.name));

  return (
    <div className="bg-paper pb-16 text-muted lg:pb-0">
      {/* Hinweis: nur im Beispiel */}
      <p className="bg-[#8A6437] px-4 py-2 text-center font-sans text-[13px] text-paper">
        Beispiel nach BEER-Vorlage (Styleguide vom 15.08.) · Inhalte aus dem CMS · nicht verlinkt, nicht indexiert
      </p>

      {/* 1 · Topbar + Header */}
      <div className="hidden border-b border-line px-gutter py-2 font-sans text-[13px] lg:flex lg:justify-between">
        <span>Küchenmanufaktur aus Bayern – wir bauen was bleibt</span>
        <span className="flex gap-6">
          <LocaleLink href="/katalog" className="text-ink">Katalog bestellen</LocaleLink>
          <a href={phoneHref} className="text-ink">T {settings.phone}</a>
        </span>
      </div>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-paper/95 px-5 py-4 backdrop-blur lg:px-gutter">
        <LocaleLink href="/" className="flex items-center gap-3" aria-label="BEER">
          {header?.logo ? <CmsImage src={header.logo} alt={header.logoAlt || "BEER"} width={36} height={36} className="h-9 w-auto" /> : null}
          <span className="font-sans text-[15px] font-semibold tracking-[0.3em] text-ink">BEER</span>
        </LocaleLink>
        <nav className="hidden gap-9 font-sans text-[15px] text-ink lg:flex" aria-label="Hauptmenü (Beispiel)">
          {[
            ["Küchen", "/kuechen"],
            ["Möbel nach Maß", "/moebel"],
            ["Küche planen", PLANNER_HREF],
            ["Über BEER", "/ueber"],
          ].map(([label, href]) => (
            <LocaleLink key={label} href={href}>{label} <span aria-hidden className="text-[10px]">▾</span></LocaleLink>
          ))}
        </nav>
        <LocaleLink href={TERMIN_HREF} className="pill pill-primary !px-6 !py-3 !text-[14px]">Beratung anfragen</LocaleLink>
      </header>

      <main>
        {/* 2 · Hero (hell): ein Foto, kein Slider */}
        <section className="px-5 pt-14 lg:px-gutter lg:pt-24">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <h1 className={`${serif} text-[44px] leading-[1.05] lg:col-span-7 lg:text-[58px]`}>
              Wir bauen, <em style={kursiv}>was bleibt.</em>
            </h1>
            <div className="lg:col-span-5">
              <p className="max-w-md text-[17px] leading-[1.7]">{home.heroPanel?.text ?? settings.description}</p>
              <LocaleLink href={TERMIN_HREF} className="pill pill-primary mt-7">Beratung anfragen</LocaleLink>
            </div>
          </div>
          {hero ? (
            <div className="relative mt-12 aspect-[16/10] overflow-hidden lg:mt-16 lg:aspect-[21/9]">
              <CmsImage src={hero.src} alt={hero.alt} fill priority sizes="100vw" className="object-cover" />
            </div>
          ) : null}
        </section>

        {/* 3 · Vertrauensleiste */}
        <section className="mt-10 border-y border-line px-5 py-7 lg:px-gutter" aria-label="Vertrauen">
          <ul className="flex flex-wrap items-center justify-between gap-x-10 gap-y-5 font-sans text-[14px] text-ink">
            <li>seit 1968</li>
            <li>Manufaktur in Bayern</li>
            {marken.map((logo) => (
              <li key={logo.slug}>
                <CmsImage src={logo.logo} alt={logo.name} width={96} height={28} className="h-6 w-auto opacity-80" />
              </li>
            ))}
            <li className="text-[#8A867E]">Google ★★★★★ <span className="text-[12px]">(Zahl fehlt: keine Datenquelle)</span></li>
          </ul>
        </section>

        {/* 4 · Küchenwelten: sechs geteilte Bildtafeln */}
        <section className="px-5 py-24 lg:px-gutter lg:py-[140px]" aria-labelledby="welten">
          <p className={`${eyebrow} text-bronze`}>Küchenwelten</p>
          <h2 id="welten" className={`${serif} mt-4 text-[34px] leading-tight lg:text-[44px]`}>
            Sechs Wege zu <em style={kursiv}>Ihrer</em> Küche.
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {welten.map((welt) => (
              <LocaleLink key={welt.label} href={welt.href} className="grid min-h-[300px] grid-cols-2 overflow-hidden">
                <div className="relative">
                  {welt.image ? <CmsImage src={welt.image} alt={welt.label} fill sizes="(min-width:768px) 25vw, 50vw" className="object-cover" /> : null}
                </div>
                <div className="flex flex-col items-center justify-center gap-6 px-4 text-center" style={{ background: welt.tone }}>
                  <span className={`font-serif text-[26px] font-medium leading-tight lg:text-[28px] ${welt.dark ? "text-[#FBF9F5]" : "text-ink"}`}>
                    {welt.label}
                  </span>
                  <span className="pill pill-light !bg-paper/85 !px-5 !py-2.5 !text-[14px]">Entdecken</span>
                  {welt.found ? null : <span className="font-sans text-[11px] text-[#8A867E]">kein CMS-Eintrag gefunden</span>}
                </div>
              </LocaleLink>
            ))}
          </div>
        </section>

        {/* 5 · Farbtafel-Triptychon */}
        <section className="grid md:grid-cols-3" aria-label="Die Manufaktur">
          <div className="flex min-h-[380px] flex-col items-center justify-center gap-6 bg-espresso px-8 text-center">
            <svg width="120" height="60" viewBox="0 0 120 60" fill="none" stroke="#C8A87E" strokeWidth="1" aria-hidden>
              <path d="M5 55h110M20 55V25l40-18 40 18v30M45 55V38h30v17" />
            </svg>
            <p className={`${eyebrow} text-messing`}>Die Manufaktur · Wolfersdorf</p>
          </div>
          <div className="flex min-h-[380px] items-center justify-center bg-bronze-tafel px-8 text-center">
            <p className="font-serif text-[30px] font-medium leading-snug text-[#FBF9F5]">
              <em style={kursiv}>Vintage Love.</em>
              <br />
              Warm, echt, gemütlich.
            </p>
          </div>
          <div className="relative min-h-[380px]">
            {tafelFoto ? <CmsImage src={tafelFoto.image} alt={tafelFoto.title} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover" /> : null}
          </div>
        </section>

        {/* 6 · Küchenplaner-Teaser */}
        <section className="bg-cream px-5 py-24 text-center lg:px-gutter lg:py-28">
          <p className={`${eyebrow} text-bronze`}>Küchenplaner</p>
          <h2 className={`${serif} mt-4 text-[34px] leading-tight lg:text-[44px]`}>
            Welche Küche passt <em style={kursiv}>zu Ihnen?</em>
          </h2>
          <LocaleLink href={PLANNER_HREF} className="btn-quiet mt-8">In sieben Schritten zur ersten Idee</LocaleLink>
        </section>

        {/* 7 · Referenzen */}
        <section className="px-5 py-24 lg:px-gutter lg:py-[140px]" aria-labelledby="referenzen">
          <div className="flex items-end justify-between gap-6">
            <h2 id="referenzen" className={`${serif} text-[34px] leading-tight lg:text-[44px]`}>Referenzen</h2>
            <LocaleLink href="/projekte" className="btn-quiet">Alle Projekte</LocaleLink>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {referenzen.map((project) => (
              <LocaleLink key={project.slug} href={projectHref(project.slug)} className="block">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <CmsImage src={project.image} alt={project.title} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover" />
                </div>
                <p className={`${eyebrow} mt-5 text-bronze`}>
                  {[project.place, project.topics.find((topic) => topic.cluster === "stile")?.name].filter(Boolean).join(" · ")}
                </p>
                <p className="mt-2 font-serif text-[24px] font-medium leading-snug text-ink">{project.title}</p>
              </LocaleLink>
            ))}
          </div>
        </section>

        {/* 8 · Dunkle Bühne: Manufaktur */}
        <section className="grid bg-nacht lg:grid-cols-2">
          <div className="flex flex-col justify-center px-5 py-24 lg:pl-edge lg:pr-16">
            <p className={`${eyebrow} text-messing`}>Die Manufaktur</p>
            <span className="mt-5 block h-px w-24 bg-messing" aria-hidden />
            <h2 className="mt-8 font-serif text-[36px] font-medium leading-tight text-[#F6F3EC] lg:text-[48px]">
              Gebaut von Menschen, die <em style={kursiv}>bleiben wollen.</em>
            </h2>
            <LocaleLink href="/ueber" className="pill mt-10 self-start border border-messing text-[#F6F3EC]">Die Werkstatt erleben</LocaleLink>
          </div>
          <div className="relative min-h-[420px]">
            {werkstatt?.image ? (
              <CmsImage src={werkstatt.image} alt={werkstatt.alt || "Werkstatt"} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
            ) : null}
          </div>
        </section>

        {/* 9 · So entsteht Ihre Küche */}
        <section className="px-5 py-24 lg:px-gutter lg:py-[140px]" aria-labelledby="ablauf">
          <h2 id="ablauf" className={`${serif} text-[34px] leading-tight lg:text-[44px]`}>So entsteht Ihre Küche</h2>
          <ol className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {steps.slice(0, 4).map((step, index) => (
              <li key={step.title} className="border-t border-line pt-6">
                <p className={`${eyebrow} text-bronze`}>Schritt {index + 1}</p>
                <p className="mt-4 font-serif text-[26px] font-medium leading-snug text-ink">{step.title}</p>
                <p className="mt-3 text-[16px] leading-[1.7]">{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* 10 · Kundenstimmen */}
        {zitate.length ? (
          <section className="bg-karte px-5 py-24 lg:px-gutter lg:py-28" aria-label="Kundenstimmen">
            <div className="grid gap-14 md:grid-cols-2">
              {zitate.map((quote) => (
                <figure key={quote.text}>
                  <blockquote className="font-serif text-[28px] font-medium italic leading-snug text-ink lg:text-[32px]">
                    „{quote.text.replace(/^[„"»]|[“"«]$/g, "")}“
                  </blockquote>
                  {quote.source ? <figcaption className={`${eyebrow} mt-6 text-[#8A867E]`}>{quote.source}</figcaption> : null}
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        {/* 11 · FAQ: fünf Aufklappzeilen */}
        <section className="mx-auto max-w-3xl px-5 py-24 lg:py-[140px]" aria-labelledby="fragen">
          <h2 id="fragen" className={`${serif} text-center text-[34px] leading-tight lg:text-[44px]`}>Häufige Fragen</h2>
          <div className="mt-12 border-t border-line">
            {fragen.map((item) => (
              <details key={item.question} className="group border-b border-line">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-serif text-[22px] font-medium text-ink">
                  {item.question}
                  <span aria-hidden className="font-sans text-[22px] font-light text-bronze transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="pb-7 text-[16px] leading-[1.7]">{item.answer.replace(/<[^>]+>/g, " ")}</p>
              </details>
            ))}
          </div>
        </section>

        {/* 12 · Dunkle Bühne: Abschluss */}
        <section className="bg-nacht px-5 py-28 text-center lg:py-36">
          <span className="mx-auto block h-px w-24 bg-messing" aria-hidden />
          <h2 className="mt-10 font-serif text-[38px] font-medium leading-tight text-[#F6F3EC] lg:text-[52px]">
            Sprechen wir über <em style={kursiv}>Ihre Küche.</em>
          </h2>
          <LocaleLink href={TERMIN_HREF} className="pill mt-10 border border-messing text-[#F6F3EC]">Beratung anfragen</LocaleLink>
        </section>
      </main>

      {/* 13 · Footer: vollständiges Verzeichnis */}
      <footer className="border-t border-[#2a2a26] bg-nacht px-5 py-20 text-[#e4e0d8] lg:px-gutter">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {footer.columns.map((column) => (
            <div key={column.title}>
              <p className={`${eyebrow} text-messing`}>{column.title}</p>
              <ul className="mt-5 space-y-2 text-[15px]">
                {[...column.links, ...(column.more?.links ?? [])].map((link) => (
                  <li key={link.href + link.label}>
                    <LocaleLink href={link.href} className="hover:text-white">{link.label}</LocaleLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className={`${eyebrow} text-messing`}>{footer.contactTitle}</p>
            <ul className="mt-5 space-y-2 text-[15px]">
              {footer.contactLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-wrap justify-between gap-4 border-t border-[#2a2a26] pt-6 text-[13px] text-[#8A867E]">
          <span className="flex flex-wrap gap-5">
            {footer.legal.map((link) => (
              <LocaleLink key={link.label} href={link.href}>{link.label}</LocaleLink>
            ))}
          </span>
          <span className="flex flex-wrap gap-5">
            {footer.social.map((link) => (
              <a key={link.label} href={link.href}>{link.label}</a>
            ))}
          </span>
        </div>
      </footer>

      {/* Mobil: feste Leiste unten */}
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-line bg-paper font-sans text-[15px] lg:hidden">
        <a href={phoneHref} className="py-4 text-center text-ink">Anrufen</a>
        <LocaleLink href={TERMIN_HREF} className="bg-ink py-4 text-center text-paper">Beratung anfragen</LocaleLink>
      </div>
    </div>
  );
}
