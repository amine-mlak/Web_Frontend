import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export default function TextLink({
  href,
  children,
  tone = "light",
  className = "",
  ...props
}: {
  href: string;
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "children" | "className">) {
  const toneClass = tone === "dark" ? "text-link text-link-dark" : "text-link";

  return (
    <Link href={href} className={`${toneClass} ${className}`.trim()} {...props}>
      {children}
    </Link>
  );
}
