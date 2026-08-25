"use client";

import Image from "next/image";
import type { KeyboardEvent } from "react";
import { useState } from "react";

import { productScreens } from "@/lib/product-screens";
import { StatusPill } from "@/components/status-pill";
import type { FeatureKey } from "@/lib/feature-status";

/** Cada tela corresponde a uma funcionalidade rastreada na fonte de status. */
const screenFeature: Record<string, FeatureKey> = {
  analisar: "analise-repositorio",
  historico: "historico",
  relatorio: "relatorio-tecnico",
  "tema-escuro": "tema-claro-escuro",
};

export function ProductTabs() {
  const [active, setActive] = useState(productScreens[0].id);
  const current = productScreens.find((tab) => tab.id === active) ?? productScreens[0];

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const currentIndex = productScreens.findIndex((tab) => tab.id === active);
    let nextIndex = currentIndex;

    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % productScreens.length;
    if (event.key === "ArrowLeft")
      nextIndex = (currentIndex - 1 + productScreens.length) % productScreens.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = productScreens.length - 1;

    if (nextIndex !== currentIndex) {
      event.preventDefault();
      setActive(productScreens[nextIndex].id);
      requestAnimationFrame(() => {
        document.getElementById(`tab-${productScreens[nextIndex].id}`)?.focus();
      });
    }
  }

  return (
    <div className="product-showcase">
      <div
        role="tablist"
        aria-label="Telas do Legacy Doc"
        className="product-tablist"
      >
        {productScreens.map((tab) => {
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
              className={`product-tab focus-ring ${selected ? "is-active" : ""}`}
              onClick={() => setActive(tab.id)}
              onKeyDown={handleTabKeyDown}
            >
              <TabIcon size={17} aria-hidden="true" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        key={current.id}
        id={`panel-${current.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${current.id}`}
        className="product-tab-panel is-entering"
      >
        <div className="product-panel-head">
          <div>
            <h3>{current.title}</h3>
            <p>{current.description}</p>
          </div>
          <StatusPill feature={screenFeature[current.id]} />
        </div>

        {/* Mockup de navegador: dá contexto de produto e enquadra a captura. */}
        <figure className={`browser-frame is-${current.aspect}`}>
          <div className="browser-bar" aria-hidden="true">
            <span className="browser-dots">
              <i />
              <i />
              <i />
            </span>
            <span className="browser-url">app.legacydoc.dev</span>
          </div>
          <div className="browser-viewport">
            <Image
              src={current.src}
              alt={current.alt}
              width={current.targetWidth}
              height={current.targetHeight}
              className="browser-shot"
              sizes="(max-width: 1023px) 94vw, 1240px"
              priority={current.id === productScreens[0].id}
            />
          </div>
          {current.placeholder ? (
            <figcaption className="browser-note">
              Captura provisória, extraída do material de apresentação. Será substituída
              por imagem em resolução nativa.
            </figcaption>
          ) : null}
        </figure>
      </div>
    </div>
  );
}
