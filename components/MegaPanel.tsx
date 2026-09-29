import LocaleLink from "@/components/LocaleLink";
import CmsImage from "@/components/CmsImage";
import type { MenuLink, MenuPanel } from "@/lib/navigation";

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
      href={link.href}
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
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                style={{ objectPosition: teaser.objectPosition ?? "center" }}
              />
            </div>
            <p className="type-eyebrow mt-3">{teaser.caption}</p>
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
