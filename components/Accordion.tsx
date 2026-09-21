"use client";

import { useState } from "react";

export type AccordionItem = {
  slug?: string;
  question: string;
  answer: string;
};

export default function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      {items.map((item, index) => {
        const open = openIndex === index;

        return (
          <div key={item.slug || item.question} className="border-t border-line">
            <h3>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-6 py-5 text-left"
                aria-expanded={open}
                onClick={() =>
                  setOpenIndex((current) => (current === index ? null : index))
                }
              >
                <span className="type-body text-ink">{item.question}</span>
                <span
                  className="type-nav text-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  aria-hidden="true"
                >
                  {open ? "–" : "+"}
                </span>
              </button>
            </h3>
            <div
              className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p
                  className={`type-body max-w-2xl pb-5 text-muted transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    open ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
      <div className="border-t border-line" />
    </div>
  );
}
