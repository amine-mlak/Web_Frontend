import type { ReactNode } from "react";
import CmsImage from "@/components/CmsImage";
import LocaleLink from "@/components/LocaleLink";
import type { PresentedBranch, PresentedHub } from "@/lib/collection-present";
import { Frame, HubEnd } from "@/components/catalog/collections/parts";
import { SHOWROOM_SAMPLES } from "@/lib/house-photos";

function areaId(branch: PresentedBranch, index: number) {
  return branch.href?.split("/").pop() || `bereich-${index + 1}`;
}

/** One area (Fronten, Arbeitsplatten, ...): a large photo, its text and the materials in it. */
function Area({ branch, index, en }: { branch: PresentedBranch; index: number; en: boolean }) {
  const id = areaId(branch, index);
  const flip = index % 2 === 1;
  const items = branch.items ?? [];

  return (
    <section id={id} className="scroll-mt-24 border-t border-line" aria-labelledby={`${id}-title`}>
      <div className="grid lg:grid-cols-12">
        <Frame
          src={branch.image}
          srcSet={branch.srcSet}
          alt={branch.alt}
          className={`aspect-[4/3] lg:col-span-7 lg:aspect-auto lg:min-h-[80svh] ${flip ? "lg:order-2" : ""}`}
          sizes="(max-width: 1024px) 100vw, 58vw"
        />
        <div className={`flex flex-col justify-center px-5 py-14 sm:px-8 lg:col-span-5 lg:px-14 lg:py-20 ${flip ? "lg:order-1" : ""}`}>
          <h2
            id={`${id}-title`}
            className="font-serif text-[40px] leading-[1] font-medium tracking-[-0.035em] text-ink md:text-[52px]"
          >
            {branch.title}
          </h2>
          <p className="mt-5 max-w-md font-sans text-[17px] leading-relaxed text-muted">{branch.text}</p>
          {items.length > 0 ? (
            <ul className="mt-10 border-t border-line">
              {items.map((item) => (
                <li key={item.href} className="border-b border-line">
                  <LocaleLink href={item.href} className="group flex items-center gap-4 py-4">
                    {item.image ? (
                      <span className="relative size-16 shrink-0 overflow-hidden bg-karte">
                        <CmsImage src={item.image} alt="" fill sizes="64px" className="object-cover" />
                      </span>
                    ) : null}
                    <span className="min-w-0 flex-1">
                      <span className="block font-serif text-[21px] leading-tight text-ink">{item.title}</span>
                      {item.text ? (
                        <span className="mt-1 block font-sans text-[14px] leading-snug text-muted">{item.text}</span>
                      ) : null}
                    </span>
                    <span aria-hidden="true" className="shrink-0 text-muted transition-colors group-hover:text-ink">
                      →
                    </span>
                  </LocaleLink>
                </li>
              ))}
            </ul>
          ) : null}
          {branch.href ? (
            <LocaleLink href={branch.href} className="btn-quiet mt-8 w-fit text-ink">
              {en ? `${branch.title}: the overview` : `${branch.title} im Überblick`}
            </LocaleLink>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/**
 * /material: the name and one sentence over the sample wall, a row to jump to the four areas,
 * one statement, then each area with its photo and its materials. One ending (the showroom).
 */
export default function MaterialCollection({
  hub,
  children,
}: {
  hub: PresentedHub;
  children?: ReactNode;
}) {
  const en = hub.locale === "en";
  const count = (n: number) => (en ? `${n} ${n === 1 ? "material" : "materials"}` : `${n} ${n === 1 ? "Material" : "Materialien"}`);

  return (
    <main className="bg-paper">
      <section className="px-5 pt-12 sm:px-8 lg:px-14 lg:pt-20" aria-labelledby="material-hero">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <h1
            id="material-hero"
            className="font-serif text-[64px] leading-[0.88] font-medium tracking-[-0.05em] text-ink sm:text-[104px] lg:col-span-7 lg:text-[136px]"
          >
            {hub.title}
          </h1>
          <div className="lg:col-span-5 lg:pb-5">
            <p className="max-w-md font-sans text-[18px] leading-relaxed text-muted">{hub.lede}</p>
            <LocaleLink href={hub.ctaHref} className="btn-quiet mt-6 text-ink">
              {hub.ctaLabel}
            </LocaleLink>
          </div>
        </div>
      </section>

      <Frame
        src={SHOWROOM_SAMPLES.wall}
        alt={en ? "Sample wall with fronts and worktops in the Wolfersdorf showroom" : "Musterwand mit Fronten und Arbeitsplatten in der Ausstellung Wolfersdorf"}
        className="mt-10 aspect-[4/3] w-full sm:aspect-[16/9] lg:mt-14 lg:aspect-[21/9]"
        priority
        sizes="100vw"
      />

      <nav aria-label={hub.indexEyebrow} className="border-b border-line">
        <ul className="grid grid-cols-2 lg:grid-cols-4">
          {hub.branches.map((branch, index) => (
            <li
              key={branch.title}
              className={`border-line ${index % 2 === 1 ? "border-l" : ""} ${index >= 2 ? "border-t lg:border-t-0" : ""} ${index === 2 ? "lg:border-l" : ""}`}
            >
              <a href={`#${areaId(branch, index)}`} className="group flex h-full flex-col justify-between gap-6 px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
                <span className="font-serif text-[24px] leading-tight text-ink md:text-[28px]">{branch.title}</span>
                <span className="flex items-center justify-between font-sans text-[14px] text-muted">
                  {branch.items?.length ? count(branch.items.length) : en ? "Overview" : "Überblick"}
                  <span aria-hidden="true" className="transition-colors group-hover:text-ink">↓</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section className="px-5 py-20 sm:px-8 lg:px-14 lg:py-28">
        <p className="mx-auto max-w-4xl text-center font-serif text-[28px] leading-snug font-medium tracking-[-0.025em] text-ink md:text-[40px]">
          {hub.statement}
        </p>
        {hub.statementNote ? (
          <p className="mx-auto mt-6 max-w-xl text-center font-sans text-[16px] leading-relaxed text-muted">
            {hub.statementNote}
          </p>
        ) : null}
      </section>

      {hub.branches.map((branch, index) => (
        <Area key={branch.title} branch={branch} index={index} en={en} />
      ))}

      <HubEnd hub={{ ...hub, visitImage: SHOWROOM_SAMPLES.detail }}>{children}</HubEnd>
    </main>
  );
}
