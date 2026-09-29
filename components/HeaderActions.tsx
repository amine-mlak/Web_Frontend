"use client";

import { MapPin, Phone } from "lucide-react";
import { useLocale } from "@/components/LocaleProvider";
import { chromeCopy } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const LOCATION_HREF =
  "https://www.google.com/maps/search/?api=1&query=Badendorf+6%2C+85395+Wolfersdorf";
export const PHONE_HREF = "tel:+498168909910";
export const PHONE_LABEL = "+49 8168 909910";

const actionClass =
  "inline-flex h-9 shrink-0 items-center justify-center rounded-full bg-ink text-paper transition-opacity hover:opacity-80";

export default function HeaderActions({
  compact = false,
  className,
  onNavigate,
}: {
  compact?: boolean;
  className?: string;
  onNavigate?: () => void;
}) {
  const locale = useLocale();
  const copy = chromeCopy[locale];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <a
        href={LOCATION_HREF}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onNavigate}
        aria-label={copy.location}
        data-umami-event="cta_location"
        data-umami-event-placement="header"
        className={cn(actionClass, "w-9")}
      >
        <MapPin className="size-4" strokeWidth={2} />
      </a>
      <a
        href={PHONE_HREF}
        onClick={onNavigate}
        aria-label={`${copy.call} ${PHONE_LABEL}`}
        data-umami-event="cta_call"
        data-umami-event-placement="header"
        className={cn(actionClass, compact ? "w-9" : "gap-2 px-3.5")}
      >
        <Phone className="size-4" strokeWidth={2} />
        {compact ? (
          <span className="sr-only">{PHONE_LABEL}</span>
        ) : (
          <span className="type-nav !text-[13px] font-normal tracking-[0.02em] xl:!text-[14px]">
            {PHONE_LABEL}
          </span>
        )}
      </a>
    </div>
  );
}
