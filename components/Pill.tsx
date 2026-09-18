import Link from "next/link";
import type { ReactNode } from "react";

type PillVariant = "primary" | "secondary" | "ghost-dark";

type PillProps = {
  children: ReactNode;
  variant?: PillVariant;
  href?: string;
  type?: "button" | "submit";
  className?: string;
  event?: string;
  eventLocation?: string;
};

const variantClass: Record<PillVariant, string> = {
  primary: "pill pill-primary",
  secondary: "pill pill-secondary",
  "ghost-dark": "pill pill-ghost-dark",
};

export default function Pill({
  children,
  variant = "primary",
  href,
  type = "button",
  className = "",
  event,
  eventLocation,
}: PillProps) {
  const classes = `${variantClass[variant]} ${className}`.trim();
  const tracking = event
    ? {
        "data-umami-event": event,
        ...(eventLocation
          ? { "data-umami-event-location": eventLocation }
          : {}),
      }
    : {};

  if (href) {
    return (
      <Link href={href} className={classes} {...tracking}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...tracking}>
      {children}
    </button>
  );
}
