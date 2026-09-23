"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import MegaPanel from "@/components/MegaPanel";
import { Button } from "@/components/ui/button";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  NavigationMenuIndicator,
} from "@/components/ui/navigation-menu";
import { trackEvent } from "@/lib/umami";
import { cn } from "@/lib/utils";
import { menuPanels, type MenuPanel } from "@/lib/navigation";

type MegaMenuProps = {
  panels?: MenuPanel[];
  ctaLabel?: string;
  ctaUrl?: string;
  logoSrc?: string;
  logoAlt?: string;
};

export default function MegaMenu({
  panels = menuPanels,
  ctaLabel = "Beratung anfragen",
  ctaUrl = "#beratung",
  logoSrc,
  logoAlt,
}: MegaMenuProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileVisible, setMobileVisible] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuValue, setMenuValue] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const panelId = useId();
  const leaveTimer = useRef<number>(0);
  const closeDropdownTimer = useRef<number>(0);
  const closeMobileTimer = useRef<number>(0);
  const menuValueRef = useRef(menuValue);
  const sheetWasOpen = useRef(false);
  menuValueRef.current = menuValue;
  const solid = true;
  const sheetEase = solid
    ? "ease-[cubic-bezier(0.22,1,0.36,1)]"
    : "ease-[cubic-bezier(0.64,0,0.78,0)]";
  const panelExpanded = dropdownOpen || (!solid && Boolean(menuValue));
  const panelInstant = panelExpanded && solid && !sheetWasOpen.current;
  const panelEase = panelExpanded
    ? "ease-[cubic-bezier(0.22,1,0.36,1)]"
    : "ease-[cubic-bezier(0.64,0,0.78,0)]";
  const mobileExpanded = mobileOpen || (!solid && mobileVisible);
  const mobileInstant = mobileExpanded && solid && !sheetWasOpen.current;
  const mobileEase = mobileExpanded
    ? "ease-[cubic-bezier(0.22,1,0.36,1)]"
    : "ease-[cubic-bezier(0.64,0,0.78,0)]";

  const openMenuHover = useCallback(() => {
    window.clearTimeout(leaveTimer.current);
    window.clearTimeout(closeDropdownTimer.current);
    setHovered(true);
    if (menuValueRef.current) {
      setDropdownOpen(true);
      setMenuOpen(true);
    }
  }, []);

  const keepMenuHover = useCallback(() => {
    window.clearTimeout(leaveTimer.current);
    window.clearTimeout(closeDropdownTimer.current);
    setHovered(true);
    if (menuValueRef.current) {
      setDropdownOpen(true);
      setMenuOpen(true);
    }
  }, []);

  const leaveMenuHover = useCallback(() => {
    window.clearTimeout(leaveTimer.current);
    leaveTimer.current = window.setTimeout(() => {
      setHovered(false);
      setMenuOpen(false);
      setDropdownOpen(false);
      window.clearTimeout(closeDropdownTimer.current);
      closeDropdownTimer.current = window.setTimeout(() => {
        setMenuValue("");
      }, 500);
    }, 80);
  }, []);

  const handleMenuValueChange = useCallback((next: string) => {
    if (next === "") {
      return;
    }

    window.clearTimeout(closeDropdownTimer.current);
    setMenuValue(next);
    setDropdownOpen(true);
    setMenuOpen(true);
    trackEvent("menu_open", { panel: next, placement: "desktop" });
  }, []);

  useEffect(() => {
    sheetWasOpen.current = solid;
  }, [solid]);

  useEffect(() => {
    return () => {
      window.clearTimeout(leaveTimer.current);
      window.clearTimeout(closeDropdownTimer.current);
      window.clearTimeout(closeMobileTimer.current);
    };
  }, []);

  const openMobile = useCallback(() => {
    window.clearTimeout(closeMobileTimer.current);
    setMobileOpen(true);
    setMobileVisible(true);
    trackEvent("menu_open", { placement: "mobile" });
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    window.clearTimeout(closeMobileTimer.current);
    closeMobileTimer.current = window.setTimeout(() => {
      setMobileVisible(false);
      setMobileSection(null);
    }, 500);
  }, []);

  const toggleMobile = useCallback(() => {
    if (mobileOpen) {
      closeMobile();
    } else {
      openMobile();
    }
  }, [mobileOpen, closeMobile, openMobile]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMobile();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen, closeMobile]);

  return (
    <div
      className="relative w-full"
      data-header-lock={
        mobileOpen || dropdownOpen || menuOpen || hovered ? "true" : "false"
      }
    >
      <NavigationMenu
        viewport={false}
        className="relative hidden w-full max-w-none lg:flex"
        delayDuration={400}
        skipDelayDuration={80}
        value={menuValue}
        onValueChange={handleMenuValueChange}
      >
        <div
          className="relative w-full"
          onMouseEnter={keepMenuHover}
          onMouseLeave={leaveMenuHover}
        >
          <div
            className={cn(
              "absolute inset-x-0 top-0 z-0 grid origin-top bg-white transition-[grid-template-rows,box-shadow] duration-500",
              sheetEase,
              solid
                ? "pointer-events-auto grid-rows-[1fr] shadow-[0_18px_40px_rgba(17,17,17,0.08)]"
                : "pointer-events-none grid-rows-[0fr] shadow-none",
            )}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="h-14" aria-hidden />
              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-500",
                  panelEase,
                  panelExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  panelInstant && "duration-0",
                )}
              >
                <div className="min-h-0 overflow-hidden bg-white">
                  <NavigationMenuViewport />
                </div>
              </div>
            </div>
          </div>

          <div
            className="relative z-10 grid h-14 w-full grid-cols-[1fr_auto_1fr] items-center px-5 lg:px-8"
            onMouseEnter={openMenuHover}
          >
            <div className="justify-self-start">
              <BrandLogo src={logoSrc} alt={logoAlt} />
            </div>

            <NavigationMenuList className="relative h-full items-stretch justify-center space-x-0">
              {panels.map((panel) => (
                <NavigationMenuItem key={panel.id} value={panel.id} className="flex h-full">
                  <NavigationMenuTrigger className="type-nav relative z-20 h-full whitespace-nowrap rounded-none bg-transparent px-3 !text-[16px] font-normal tracking-[0.06em] text-ink/70 xl:!text-[17px] hover:bg-transparent hover:text-ink focus:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-ink after:absolute after:inset-x-0 after:top-full after:z-50 after:h-8 after:content-[''] [&>svg]:hidden">
                    {panel.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="w-full md:w-full">
                    <MegaPanel panel={panel} onNavigate={() => undefined} />
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
              <NavigationMenuIndicator />
            </NavigationMenuList>

            <div className="flex justify-end">
              <div>
                <Button
                  asChild
                  variant="ghost"
                  className="cta-invert type-nav h-auto rounded-full px-3.5 py-1.5 !text-[16px] font-normal tracking-[0.06em] xl:!text-[17px] hover:bg-ink"
                >
                  <Link
                    href={ctaUrl}
                    data-umami-event="cta_beratung"
                    data-umami-event-placement="header"
                  >
                    {ctaLabel}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </NavigationMenu>

      <div
        className={cn(
          "absolute inset-x-0 top-0 z-0 grid origin-top bg-white transition-[grid-template-rows,box-shadow] duration-500 lg:hidden",
          sheetEase,
          solid
            ? "pointer-events-auto grid-rows-[1fr] shadow-[0_18px_40px_rgba(17,17,17,0.08)]"
            : "pointer-events-none grid-rows-[0fr] shadow-none",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="h-14" aria-hidden />
          <div
            className={cn(
              "grid transition-[grid-template-rows] duration-500",
              mobileEase,
              mobileExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              mobileInstant && "duration-0",
            )}
          >
            <div
              id={`${panelId}-mobile`}
              className="min-h-0 overflow-hidden bg-white"
            >
              <div className="max-h-[min(80vh,640px)] overflow-y-auto p-6">
                <div className="flex flex-col justify-between gap-6">
                  <div>
                    {panels.map((panel) => {
                      const expanded = mobileSection === panel.id;
                      return (
                        <div key={panel.id} className="border-b border-line/80 py-4">
                          <button
                            type="button"
                            className="flex w-full items-center justify-between px-2 py-1 text-left"
                            aria-expanded={expanded}
                            onClick={() =>
                              setMobileSection((current) =>
                                current === panel.id ? null : panel.id,
                              )
                            }
                          >
                            <span className="type-h2 text-ink">{panel.label}</span>
                            <span className="text-muted" aria-hidden="true">
                              {expanded ? "–" : "+"}
                            </span>
                          </button>
                          <div
                            className={cn(
                              "grid transition-[grid-template-rows] duration-500",
                              expanded
                                ? "grid-rows-[1fr] ease-[cubic-bezier(0.22,1,0.36,1)]"
                                : "grid-rows-[0fr] ease-[cubic-bezier(0.64,0,0.78,0)]",
                            )}
                          >
                            <ul className="min-h-0 space-y-3 overflow-hidden">
                              <li className="pt-4">
                                <Link
                                  href={panel.href}
                                  onClick={closeMobile}
                                  className="type-body text-ink"
                                >
                                  Übersicht
                                </Link>
                              </li>
                              {panel.groups.flatMap((group) =>
                                group.links.map((link) => (
                                  <li
                                    key={`${group.title ?? "links"}-${link.label}`}
                                  >
                                    <Link
                                      href={link.href}
                                      onClick={closeMobile}
                                      className={`type-body ${
                                        link.highlight
                                          ? "text-ink"
                                          : "text-ink/80"
                                      }`}
                                    >
                                      {link.label}
                                    </Link>
                                  </li>
                                )),
                              )}
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <Button
                    asChild
                    variant="ghost"
                    className="cta-invert type-nav h-auto w-full rounded-full py-3 hover:bg-ink"
                  >
                    <Link
                      href={ctaUrl}
                      onClick={closeMobile}
                      data-umami-event="cta_beratung"
                      data-umami-event-placement="header-mobile"
                    >
                      {ctaLabel}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex h-14 w-full items-center justify-between px-4 lg:hidden">
        <BrandLogo src={logoSrc} alt={logoAlt} />
        <Button
          size="icon"
          variant="outline"
          onClick={toggleMobile}
          className="border-line bg-transparent"
          aria-expanded={mobileOpen}
          aria-controls={`${panelId}-mobile`}
          aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
        >
          <MenuToggleIcon open={mobileOpen} className="size-5" duration={500} />
        </Button>
      </div>
    </div>
  );
}
