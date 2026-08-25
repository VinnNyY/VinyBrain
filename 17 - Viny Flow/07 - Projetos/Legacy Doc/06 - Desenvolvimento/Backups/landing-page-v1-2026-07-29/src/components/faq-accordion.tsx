"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { faq } from "@/lib/landing-content";

export function FAQAccordion() {
  const [open, setOpen] = useState(0);

  return (
    <div className="mx-auto grid max-w-4xl gap-3">
      {faq.map((item, index) => {
        const isOpen = open === index;
        const panelId = `faq-panel-${index}`;
        return (
          <div key={item.question} className="panel overflow-hidden">
            <h3>
              <button
                type="button"
                className="focus-ring flex w-full items-center justify-between gap-4 px-5 py-5 text-left text-base font-semibold text-white"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? -1 : index)}
              >
                {item.question}
                <ChevronDown
                  aria-hidden="true"
                  size={18}
                  className={`shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
            </h3>
            <div id={panelId} hidden={!isOpen} className="px-5 pb-5 text-sm leading-7 text-slate-400 sm:text-base">
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
