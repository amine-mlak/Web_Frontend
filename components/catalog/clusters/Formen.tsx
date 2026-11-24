import EntryHeader from "@/components/catalog/EntryHeader";
import LocaleLink from "@/components/LocaleLink";
import { Frame } from "@/components/catalog/collections/parts";
import KitchenShowcase from "@/components/catalog/KitchenShowcase";
import { IndexRows, PointsSection, SoftClose } from "@/components/catalog/clusters/parts";
import type { PresentedCluster } from "@/lib/collection-clusters";
import type { PresentedTopic } from "@/lib/collection-topics";
import TopicReading from "@/components/catalog/clusters/TopicReading";
import { PageGuide, PageQuestions } from "@/components/catalog/PageDepth";
import { formSketch, type FormSketch } from "@/lib/form-sketches";

function housesTitle(locale: PresentedCluster["locale"]) {
  return locale === "en" ? "Projects with this layout" : "Projekte mit diesem Grundriss";
}

const formOf = (href: string) => href.split("/").pop() ?? "";

/** BEER's hand sketch of a shape (the drawings of the online planner). */
function Sketch({ sketch, className }: { sketch: FormSketch; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={sketch.src} alt="" width={sketch.width} height={sketch.height} loading="lazy" decoding="async" className={className} />
  );
}

/** The other layouts, each as its sketch: the drawing tells them apart faster than a photo. */
function OtherForms({ hub }: { hub: PresentedTopic }) {
  const items = hub.siblings;
  if (items.length === 0) {
    return null;
  }
  const sketches = items.map((item) => formSketch(formOf(item.href)));
  if (sketches.some((sketch) => !sketch)) {
    return <IndexRows items={items} title={hub.siblingTitle} />;
  }

  return (
    <section className="border-t border-line px-5 py-16 sm:px-8 lg:px-gutter lg:py-24" aria-labelledby="other-forms">
      <h2 id="other-forms" className="t-section text-ink">
        {hub.siblingTitle}
      </h2>
      <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-6">
        {items.map((item, index) => (
          <li key={item.href}>
            <LocaleLink href={item.href} className="group block">
              <span className="flex aspect-[4/3] items-center justify-center bg-karte transition-colors duration-300 group-hover:bg-ink">
                {/* The sketch is black on clear: turned white on the dark tile. */}
                <Sketch sketch={sketches[index]!} className="h-[78%] w-auto transition-[filter] duration-300 group-hover:invert" />
              </span>
              <span className="t-item mt-4 block text-ink">{item.title}</span>
              <span className="mt-1 block font-sans text-[14px] leading-relaxed text-muted line-clamp-3">{item.text}</span>
            </LocaleLink>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function FormenTopic({ hub, slug }: { hub: PresentedTopic; slug: string }) {
  const sketch = formSketch(slug);
  return (
    <main className="bg-paper">
      <EntryHeader hub={hub} emphasis={hub.emphasis}>
        {sketch ? <Sketch sketch={sketch} className="-ml-3 mt-4 h-auto w-32 lg:w-36" /> : null}
      </EntryHeader>

      <Frame
        src={hub.heroImage}
        alt={hub.heroAlt}
        className="mt-10 aspect-[2/1] w-full lg:mt-14 lg:aspect-[21/9]"
        priority
        sizes="100vw"
        drift
      />

      <PointsSection hub={hub} />
      <TopicReading slug={slug} locale={hub.locale} cms={hub} />
      <KitchenShowcase hub={hub} title={hub.showcaseTitle || housesTitle(hub.locale)} />
      <PageGuide hub={hub} />
      <PageQuestions hub={hub} />
      <OtherForms hub={hub} />
      <SoftClose hub={hub} />
    </main>
  );
}
