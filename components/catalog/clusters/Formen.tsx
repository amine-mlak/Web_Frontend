import EntryHeader from "@/components/catalog/EntryHeader";
import LocaleLink from "@/components/LocaleLink";
import PlanDrawing, { hasPlanDrawing } from "@/components/catalog/shapes/PlanDrawing";
import { Frame } from "@/components/catalog/collections/parts";
import KitchenShowcase from "@/components/catalog/KitchenShowcase";
import { IndexRows, PointsSection, SoftClose } from "@/components/catalog/clusters/parts";
import type { PresentedCluster } from "@/lib/collection-clusters";
import type { PresentedTopic } from "@/lib/collection-topics";
import TopicReading from "@/components/catalog/clusters/TopicReading";

function housesTitle(locale: PresentedCluster["locale"]) {
  return locale === "en" ? "Projects with this layout" : "Projekte mit diesem Grundriss";
}

const formOf = (href: string) => href.split("/").pop() ?? "";

/** The other layouts, each as its floor plan: the drawing tells them apart faster than a photo. */
function OtherForms({ hub }: { hub: PresentedTopic }) {
  const items = hub.siblings;
  if (items.length === 0) {
    return null;
  }
  if (!items.every((item) => hasPlanDrawing(formOf(item.href)))) {
    return <IndexRows items={items} title={hub.siblingTitle} />;
  }

  return (
    <section className="border-t border-line px-5 py-16 sm:px-8 lg:px-14 lg:py-24" aria-labelledby="other-forms">
      <h2 id="other-forms" className="t-section text-ink">
        {hub.siblingTitle}
      </h2>
      <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-6">
        {items.map((item) => (
          <li key={item.href}>
            <LocaleLink href={item.href} className="group block">
              <span className="flex aspect-[4/3] items-center justify-center bg-karte text-ink transition-colors duration-300 group-hover:bg-ink group-hover:text-paper">
                <PlanDrawing form={formOf(item.href)} className="h-auto w-[62%]" />
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
  return (
    <main className="bg-paper">
      <EntryHeader hub={hub} emphasis={hub.emphasis}>
        {hasPlanDrawing(slug) ? (
          <figure className="mt-7 flex items-end gap-4 text-ink">
            <PlanDrawing form={slug} className="h-20 w-auto" />
            <figcaption className="pb-1 font-sans text-[13px] leading-snug text-muted">
              {hub.locale === "en" ? "Floor plan, simplified" : "Grundriss, vereinfacht"}
            </figcaption>
          </figure>
        ) : null}
      </EntryHeader>

      <Frame
        src={hub.heroImage}
        alt={hub.heroAlt}
        className="mt-10 aspect-[2/1] w-full lg:mt-14 lg:aspect-[21/9]"
        priority
        sizes="100vw"
      />

      <PointsSection hub={hub} />
      <TopicReading slug={slug} locale={hub.locale} cms={hub} />
      <KitchenShowcase hub={hub} title={housesTitle(hub.locale)} />
      <OtherForms hub={hub} />
      <SoftClose hub={hub} />
    </main>
  );
}
