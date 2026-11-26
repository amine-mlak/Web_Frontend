"use client";

import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import HeaderActions from "@/components/HeaderActions";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import LocaleLink from "@/components/LocaleLink";
import { useLocale } from "@/components/LocaleProvider";
import MegaPanel from "@/components/MegaPanel";
import { Button } from "@/components/ui/button";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";
import { MAIN_ACTIONS, ctaHref } from "@/lib/cta";
import { chromeCopy } from "@/lib/i18n";
import type { MenuPanel } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const OPEN = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const CLOSE = "ease-[cubic-bezier(0.64,0,0.78,0)]";

/**
 * The site header with menus that open on a click instead of on hover: same bar, same panels
 * (MegaPanel), far less state. Used by the example start page only.
 */
export default function ClickMenu({
  panels,
  logoSrc,
  wordmarkSrc,
  logoAlt,
}: {
  panels: MenuPanel[];
  logoSrc?: string;
  wordmarkSrc?: string;
  logoAlt?: string;
}) {
  const locale = useLocale();
  const copy = chromeCopy[locale];
  const termin = MAIN_ACTIONS.termin;
  const planner = MAIN_ACTIONS.planner;
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const sheetId = useId();

  const [open, setOpen] = useState<string | null>(null);
  // The panel last opened stays in the sheet while it closes, so it does not empty mid-way.
  const [shown, setShown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [overHero, setOverHero] = useState(true);
  const [shownPath, setShownPath] = useState(pathname);

  const closeAll = useCallback(() => {
    setOpen(null);
    setMobileOpen(false);
  }, []);

  if (pathname !== shownPath) {
    setShownPath(pathname);
    setOpen(null);
    setMobileOpen(false);
    setMobileSection(null);
  }

  const toggle = (id: string) => {
    if (open === id) {
      setOpen(null);
      return;
    }
    setShown(id);
    setOpen(id);
  };

  // Clear bar with light text while the hero photo is behind it.
  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      const hero = document.querySelector("[data-hero-overlay]");
      const next = hero ? hero.getBoundingClientRect().bottom > 56 : false;
      setOverHero((current) => (current === next ? current : next));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  // A click beside the menu or Escape closes it.
  useEffect(() => {
    if (!open && !mobileOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) closeAll();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeAll();
    };
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, mobileOpen, closeAll]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const solid = !overHero || open !== null || mobileOpen;
  const shownPanel = panels.find((panel) => panel.id === shown);

  return (
    <div
      ref={rootRef}
      className={cn("relative w-full transition-colors duration-300", solid ? "bg-white" : "bg-transparent")}
      data-clear={solid ? undefined : ""}
      data-header-lock={open !== null || mobileOpen ? "true" : "false"}
    >
      {/* Desktop bar */}
      <div className="relative z-10 hidden h-14 w-full grid-cols-[1fr_auto_1fr] items-center px-8 xl:grid">
        <div className="justify-self-start">
          <BrandLogo src={logoSrc} alt={logoAlt} wordmarkSrc={wordmarkSrc} />
        </div>

        <nav aria-label="Hauptmenü" className="flex h-full items-stretch">
          {panels.map((panel) => (
            <button
              key={panel.id}
              type="button"
              aria-expanded={open === panel.id}
              aria-controls={`${sheetId}-desktop`}
              onClick={() => toggle(panel.id)}
              className="type-nav inline-flex h-full cursor-pointer items-center gap-1.5 whitespace-nowrap px-3.5 !text-[18px] font-normal text-black"
            >
              {panel.label}
              <ChevronDown
                aria-hidden="true"
                strokeWidth={1.5}
                className={cn("size-3.5 transition-transform duration-300", open === panel.id ? "rotate-180" : "")}
              />
            </button>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-3">
          <LanguageSwitcher />
          <HeaderActions compact location={false} className="min-[1700px]:hidden" />
          <HeaderActions className="hidden min-[1700px]:flex" />
          <LocaleLink href={termin.href} className="pill pill-primary !px-5 !py-2 !text-[14px] whitespace-nowrap">
            {termin.label[locale]}
          </LocaleLink>
        </div>
      </div>

      {/* Desktop panel */}
      <div
        id={`${sheetId}-desktop`}
        inert={open === null ? true : undefined}
        className={cn(
          "absolute inset-x-0 top-full hidden bg-white transition-[grid-template-rows,box-shadow] duration-500 xl:grid",
          open !== null ? `grid-rows-[1fr] shadow-[0_18px_40px_rgba(17,17,17,0.08)] ${OPEN}` : `grid-rows-[0fr] shadow-none ${CLOSE}`,
        )}
      >
        <div className="min-h-0 overflow-hidden">
          {shownPanel ? <MegaPanel panel={shownPanel} onNavigate={closeAll} /> : null}
        </div>
      </div>

      {/* Phone and tablet bar */}
      <div className="relative z-10 flex h-14 w-full items-center justify-between gap-2 px-5 md:px-7 xl:hidden">
        <BrandLogo src={logoSrc} alt={logoAlt} wordmarkSrc={wordmarkSrc} />
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <HeaderActions compact />
          <LocaleLink href={termin.href} className="pill pill-primary hidden !px-4 !py-2 !text-[14px] whitespace-nowrap md:inline-flex">
            {termin.label[locale]}
          </LocaleLink>
          <Button
            size="icon"
            variant="outline"
            onClick={() => setMobileOpen((value) => !value)}
            className="border-line bg-transparent text-black"
            aria-expanded={mobileOpen}
            aria-controls={`${sheetId}-mobile`}
            aria-label={mobileOpen ? copy.menuClose : copy.menuOpen}
          >
            <MenuToggleIcon open={mobileOpen} className="size-5" duration={500} />
          </Button>
        </div>
      </div>

      {/* Phone and tablet sheet */}
      <div
        id={`${sheetId}-mobile`}
        inert={mobileOpen ? undefined : true}
        className={cn(
          "absolute inset-x-0 top-full grid bg-white transition-[grid-template-rows,box-shadow] duration-500 xl:hidden",
          mobileOpen ? `grid-rows-[1fr] shadow-[0_18px_40px_rgba(17,17,17,0.08)] ${OPEN}` : `grid-rows-[0fr] shadow-none ${CLOSE}`,
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="max-h-[min(80vh,640px)] overflow-y-auto p-6 md:px-7">
            {panels.map((panel) => {
              const expanded = mobileSection === panel.id;
              return (
                <div key={panel.id} className="border-b border-line/80 py-4">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-2 py-1 text-left"
                    aria-expanded={expanded}
                    onClick={() => setMobileSection((current) => (current === panel.id ? null : panel.id))}
                  >
                    <span className="type-h2 text-ink">{panel.label}</span>
                    <span className="text-muted" aria-hidden="true">
                      {expanded ? "–" : "+"}
                    </span>
                  </button>
                  <div
                    className={cn(
                      "grid transition-[grid-template-rows] duration-500",
                      expanded ? `grid-rows-[1fr] ${OPEN}` : `grid-rows-[0fr] ${CLOSE}`,
                    )}
                  >
                    <ul className="min-h-0 space-y-3 overflow-hidden">
                      <li className="pt-1" aria-hidden="true" />
                      {panel.groups.flatMap((group) =>
                        group.links.map((link) => (
                          <li key={`${group.title ?? "links"}-${link.label}`}>
                            <LocaleLink href={ctaHref(link.href, link.label)} onClick={closeAll} className="type-body text-ink/80">
                              {link.label}
                            </LocaleLink>
                          </li>
                        )),
                      )}
                    </ul>
                  </div>
                </div>
              );
            })}
            <div className="mt-6 flex flex-col gap-4">
              <LocaleLink href={termin.href} onClick={closeAll} className="pill pill-primary w-full">
                {termin.label[locale]}
              </LocaleLink>
              <LocaleLink href={planner.href} onClick={closeAll} className="btn-quiet self-center">
                {planner.label[locale]}
              </LocaleLink>
              <HeaderActions className="w-full" onNavigate={closeAll} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
