import { ctaHref } from "@/lib/cta";
import LocaleLink from "@/components/LocaleLink";
import CmsImage from "@/components/CmsImage";
import type { MenuLink, MenuPanel } from "@/lib/navigation";
import { cn } from "@/lib/utils";

function PanelLink({
  link,
  large,
  onNavigate,
}: {
  link: MenuLink;
  large?: boolean;
  onNavigate: () => void;
}) {
  return (
    <LocaleLink
      href={ctaHref(link.href, link.label)}
      onClick={onNavigate}
      className={`group inline-flex w-fit flex-wrap items-baseline text-ink ${
        large ? "type-panel" : "type-body"
      }`}
    >
      <span
        className={
          large
            ? "relative after:absolute after:inset-x-0 after:-bottom-1 after:h-[2px] after:origin-left after:scale-x-0 after:bg-ink after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:after:scale-x-100"
            : "transition-colors hover:text-ink/70"
        }
      >
        {link.label}
      </span>
    </LocaleLink>
  );
}

function TeaserStrip({
  panel,
  onNavigate,
}: {
  panel: MenuPanel;
  onNavigate: () => void;
}) {
  if (!panel.teasers?.length) {
    return null;
  }

  const single = panel.teasers.length === 1;

  return (
    <ul
      className={
        single
          ? "max-w-sm"
          : "grid grid-cols-3 items-start gap-4 lg:gap-6"
      }
    >
      {panel.teasers.map((teaser) => (
        <li key={teaser.caption}>
          <LocaleLink href={teaser.href} onClick={onNavigate} className="group block">
            <div className="relative aspect-[3/4] overflow-hidden bg-stone">
              <CmsImage
                src={teaser.image}
                srcSet={teaser.srcSet}
                alt={teaser.alt}
                fill
                loading="lazy"
                sizes={
                  single
                    ? "(max-width: 1024px) 80vw, 40vw"
                    : "(max-width: 1024px) 60vw, 33vw"
                }
                className="object-cover"
                style={{ objectPosition: teaser.objectPosition ?? "center" }}
              />
              {/* The writing is real text from the CMS: it stays sharp, editable and translated. */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent px-4 pt-20 pb-4 lg:px-5 lg:pb-5">
                <p className={cn("flex items-baseline justify-between gap-3 font-serif leading-[1.1] font-medium text-paper", single ? "text-[24px] md:text-[28px] xl:text-[32px]" : "text-[24px]")}>
                  <span>{teaser.caption}</span>
                  <span aria-hidden="true" className="font-sans text-[18px] font-light">→</span>
                </p>
              </div>
            </div>
          </LocaleLink>
        </li>
      ))}
    </ul>
  );
}

export default function MegaPanel({
  panel,
  onNavigate,
}: {
  panel: MenuPanel;
  onNavigate: () => void;
}) {
  const primary = panel.groups[0];
  const secondary = panel.groups[1];
  const hasTeasers = Boolean(panel.teasers?.length);

  return (
    <div className="bg-transparent">
      <div className="mx-auto w-full max-w-[90rem] px-8 pb-12 pt-5 md:pb-14 md:pt-6 lg:px-10">
        <div
          className={
            hasTeasers
              ? "grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-12"
              : "max-w-xl"
          }
        >
          <div className={hasTeasers ? "lg:col-span-5" : undefined}>
            <p className="type-intro max-w-md text-muted">{panel.intro}</p>

            {primary ? (
              <ul className="mt-10 space-y-4">
                {primary.links.map((link) => (
                  <li key={link.label}>
                    <PanelLink
                      link={link}
                      large={panel.variant !== "about"}
                      onNavigate={onNavigate}
                    />
                  </li>
                ))}
              </ul>
            ) : null}

            {secondary ? (
              <div className="mt-12 border-t border-line pt-8">
                {secondary.title ? (
                  <p className="type-eyebrow mb-4">{secondary.title}</p>
                ) : null}
                <ul className="flex flex-wrap gap-x-8 gap-y-3">
                  {secondary.links.map((link) => (
                    <li key={link.label}>
                      <PanelLink link={link} onNavigate={onNavigate} />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          {hasTeasers ? (
            <div className="lg:col-span-7">
              <TeaserStrip panel={panel} onNavigate={onNavigate} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
