"use client";

import type { KeyboardEvent } from "react";
import { useState } from "react";
import { mockTabs } from "@/lib/landing-content";

export function ProductTabs() {
  const [active, setActive] = useState(mockTabs[0].id);
  const current = mockTabs.find((tab) => tab.id === active) ?? mockTabs[0];
  const Icon = current.icon;

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const currentIndex = mockTabs.findIndex((tab) => tab.id === active);
    let nextIndex = currentIndex;

    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % mockTabs.length;
    if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + mockTabs.length) % mockTabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = mockTabs.length - 1;

    if (nextIndex !== currentIndex) {
      event.preventDefault();
      setActive(mockTabs[nextIndex].id);
      requestAnimationFrame(() => {
        document.getElementById(`tab-${mockTabs[nextIndex].id}`)?.focus();
      });
    }
  }

  return (
    <div className="panel overflow-hidden" id="produto-preview">
      <div
        role="tablist"
        aria-label="Previews da interface do produto"
        className="flex gap-2 overflow-x-auto border-b border-white/10 p-3"
      >
        {mockTabs.map((tab) => {
          const TabIcon = tab.icon;
          const selected = tab.id === active;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              className={`focus-ring inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition ${
                selected
                  ? "bg-blue-500/14 text-blue-100 ring-1 ring-blue-400/25"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
              onClick={() => setActive(tab.id)}
              onKeyDown={handleTabKeyDown}
            >
              <TabIcon size={16} aria-hidden="true" />
              {tab.label}
            </button>
          );
        })}
      </div>
      <div
        id={`panel-${current.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${current.id}`}
        className="grid gap-5 p-5 md:grid-cols-[0.9fr_1.1fr]"
      >
        <div className="rounded-lg border border-white/10 bg-[#090d15] p-4">
          <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.04em] text-blue-200">
            <Icon size={16} aria-hidden="true" />
            {current.title}
          </div>
          <p className="text-sm leading-7 text-slate-400">{current.description}</p>
          <div className="mt-5 grid gap-2 text-sm text-slate-300">
            <span className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2">src/auth</span>
            <span className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2">billing</span>
            <span className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2">jobs/sync</span>
          </div>
        </div>
        <div className="rounded-lg border border-white/10 bg-[#0f172a] p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.04em] text-slate-400">Achados para revisão</span>
            <span className="badge badge-blue">Demonstrativo</span>
          </div>
          <pre className="code-scroll" tabIndex={0}><code>{`InvoiceService.process()
  dependency chain identified
  pending business context
  report section prepared`}</code></pre>
        </div>
      </div>
    </div>
  );
}
