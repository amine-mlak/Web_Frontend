import LocaleLink from "@/components/LocaleLink";
import CmsImage from "@/components/CmsImage";
import type { ClusterHouse } from "@/lib/collection-clusters";

export default function HousesSpread({
  houses,
  title,
}: {
  houses: ClusterHouse[];
  title?: string;
}) {
  if (houses.length === 0) {
    return null;
  }

  return (
    <section className="border-b border-line bg-karte">
      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
        {title ? (
          <h2 className="font-serif text-[32px] font-medium tracking-[-0.03em] text-ink md:text-[40px]">
            {title}
          </h2>
        ) : null}
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-12">
          {houses.map((item, index) => (
            <li
              key={item.href}
              className={index === 0 ? "lg:col-span-8" : "lg:col-span-4"}
            >
              <LocaleLink href={item.href} className="group block">
                <figure
                  className={`relative overflow-hidden bg-nacht ${
                    index === 0 ? "aspect-[16/10]" : "aspect-[4/5]"
                  }`}
                >
                  <CmsImage
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes={index === 0 ? "(max-width: 1024px) 100vw, 66vw" : "33vw"}
                    className="object-cover"
                  />
                </figure>
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <span className="font-serif text-[22px] leading-snug font-medium text-ink">
                    {item.title}
                  </span>
                  {item.meta ? (
                    <span className="shrink-0 font-sans text-[14px] text-muted">{item.meta}</span>
                  ) : null}
                </div>
              </LocaleLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
