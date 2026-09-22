"use client";

import Link from "next/link";
import { useId, useState } from "react";
import type { FooterLink } from "@/lib/footer";

export default function FooterRegions({
  label,
  links,
}: {
  label: string;
  links: FooterLink[];
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-1.5 text-[15px] leading-7 text-[#e4e0d8] transition-colors hover:text-white"
      >
        {label}
        <svg
          viewBox="0 0 8 5"
          aria-hidden="true"
          className={`h-[5px] w-2 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M0 0h8L4 5 0 0z" fill="currentColor" />
        </svg>
      </button>
      {open ? (
        <ul id={panelId} className="mt-1">
          {links.map((link) => (
            <li key={`${link.href}-${link.label}`}>
              <Link
                href={link.href}
                className="text-[15px] leading-7 text-[#e4e0d8] transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
