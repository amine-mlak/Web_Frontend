import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";

type PillVariant = "primary" | "secondary" | "ghost-dark";

type PillProps = {
  children: ReactNode;
  variant?: PillVariant;
  href?: string;
  type?: "button" | "submit";
  className?: string;
  event?: string;
  eventLocation?: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
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
  disabled = false,
  onClick,
}: PillProps) {
  const classes =
    `${variantClass[variant]} ${className} ${disabled ? "opacity-50" : ""}`.trim();
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
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...tracking}
    >
      {children}
    </button>
  );
}
