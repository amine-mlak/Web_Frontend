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

  // At most three images. Whatever the count, they fill the same box, so every menu has the same
  // weight on the right: one wide image, or tall cards side by side.
  const teasers = panel.teasers.slice(0, 3);
  const single = teasers.length === 1;

  return (
    <ul
      className={cn(
        "grid aspect-[16/9] w-full gap-3 lg:gap-4",
        teasers.length === 3 ? "grid-cols-3" : teasers.length === 2 ? "grid-cols-2" : "grid-cols-1",
      )}
    >
      {teasers.map((teaser) => (
        <li key={teaser.href + teaser.caption} className="h-full min-h-0">
          {/* The whole image leads to its collection. The menu already names it, so the image only
              carries a small button; the name stays in the link for screen readers. */}
          <LocaleLink
            href={teaser.href}
            onClick={onNavigate}
            aria-label={teaser.caption}
            className="group relative block h-full overflow-hidden bg-stone"
          >
            <CmsImage
              src={teaser.image}
              srcSet={teaser.srcSet}
              alt=""
              fill
              loading="lazy"
              // Tall tiles crop landscape photos to their height, so the photo shown is wider than the
              // tile: ask for that width, or the browser loads a small version and it looks soft.
              sizes={single ? "(max-width: 1024px) 80vw, 55vw" : teasers.length === 2 ? "(max-width: 1024px) 50vw, 38vw" : "(max-width: 1024px) 40vw, 26vw"}
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
              style={{ objectPosition: teaser.objectPosition ?? "center" }}
            />
            {single && teaser.caption !== panel.label ? (
              // A single photo whose caption is more than the menu's name (e.g. "Welche Küche passt
              // zu Ihnen?") carries it as a large white line, magazine style. The caption stays in
              // the CMS, so it is editable and translated; tiles named like their menu stay clean.
              <>
                <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />
                <span
                  aria-hidden="true"
                  className="absolute bottom-5 left-5 max-w-[70%] font-serif text-[30px] leading-[1.05] font-medium tracking-[-0.01em] text-white lg:bottom-7 lg:left-7 lg:text-[40px] xl:text-[48px]"
                >
                  {teaser.caption}
                </span>
              </>
            ) : (
              <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 to-transparent" />
            )}
            <span
              aria-hidden="true"
              className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full border border-white/50 bg-black/25 px-3.5 py-1.5 font-sans text-[13px] tracking-[0.02em] text-white backdrop-blur-sm transition-colors group-hover:bg-white group-hover:text-ink lg:right-4 lg:bottom-4"
            >
              {single ? "Entdecken" : shortLabel(teaser.caption)}
              <span className="text-[12px]">→</span>
            </span>
          </LocaleLink>
        </li>
      ))}
    </ul>
  );
}

/** "Küchenformen" → "Formen": on the image the menu context is clear, so the button stays short. */
function shortLabel(caption: string) {
  const rest = caption.replace(/^Küchen(?=[A-ZÄÖÜ]|[a-zäöü])/, "");
  return rest ? rest.charAt(0).toUpperCase() + rest.slice(1) : caption;
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
  // Both groups carry a name: they are two equal parts, not a main list with a footnote row.
  const twoParts = Boolean(primary?.title && secondary?.title);

  return (
    <div className="bg-transparent">
      <div className="mx-auto w-full max-w-[90rem] px-8 pb-12 pt-5 md:pb-14 md:pt-6 lg:px-10">
        <div
          className={
            hasTeasers
              ? "grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16"
              : "max-w-xl"
          }
        >
          <div className={hasTeasers ? (twoParts ? "lg:col-span-6" : "lg:col-span-5") : undefined}>
            <p className="type-intro max-w-md text-muted">{panel.intro}</p>

            {twoParts ? (
              // Two named parts of one menu (e.g. Küchen and Ausstattung): side by side, each under
              // its name, both in the large menu type.
              <div className="mt-10 grid grid-cols-2 gap-x-10">
                {[primary, secondary].map((group) => (
                  <div key={group.title}>
                    <p className="mb-5 border-b border-line pb-3 font-sans text-[14px] text-muted">{group.title}</p>
                    <ul className="space-y-4">
                      {group.links.map((link) => (
                        <li key={link.label}>
                          <PanelLink link={link} large onNavigate={onNavigate} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : null}

            {primary && !twoParts ? (
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

            {secondary && !twoParts ? (
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
            <div className={twoParts ? "lg:col-span-6" : "lg:col-span-7"}>
              <TeaserStrip panel={panel} onNavigate={onNavigate} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
