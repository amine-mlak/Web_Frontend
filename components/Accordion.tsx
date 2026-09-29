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
                className="flex w-full items-center justify-between gap-8 py-[1.35rem] text-left"
                aria-expanded={open}
                onClick={() =>
                  setOpenIndex((current) => (current === index ? null : index))
                }
              >
                <span className="font-sans text-[16px] leading-snug font-normal text-ink md:text-[17px]">
                  {item.question}
                </span>
                <span
                  className="shrink-0 font-sans text-[1.35rem] leading-none font-light text-ink/55"
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
                  className={`max-w-2xl pb-5 font-sans text-[15px] leading-relaxed font-light text-muted transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:text-[16px] ${
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
