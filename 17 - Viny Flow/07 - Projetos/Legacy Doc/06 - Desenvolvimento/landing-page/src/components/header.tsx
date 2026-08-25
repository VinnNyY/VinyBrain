"use client";

import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { navItems } from "@/lib/landing-content";
import { ButtonLink } from "@/components/ui";
import { STAGE_BADGE } from "@/lib/mvp-config";

export function Header({ linkPrefix = "" }: { linkPrefix?: string }) {
  const [open, setOpen] = useState(false);
  const hrefFor = (href: string) => `${linkPrefix}${href}`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0f19]/88 backdrop-blur-xl">
      <nav aria-label="Principal" className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-6 lg:min-h-[72px] lg:px-8">
        <a href={hrefFor("#topo")} className="flex min-h-11 items-center gap-3 focus-ring">
          <Image
            src="/assets/pdf-extracted/legacy-doc-001.png"
            alt="Logo Legacy Doc"
            width={40}
            height={40}
            priority
            className="h-10 w-10 rounded-lg border border-blue-400/20 object-contain"
          />
          <span className="text-sm font-semibold text-white sm:text-base">Legacy Doc</span>
          <span className="stage-badge header-stage-badge">{STAGE_BADGE}</span>
        </a>

        <div className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <a key={item.href} href={hrefFor(item.href)} className="nav-link">
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:block">
          <ButtonLink href={hrefFor("#lista-de-espera")} className="h-10 px-4 text-sm">
            Entrar na lista
          </ButtonLink>
        </div>

        <button
          type="button"
          className="focus-ring inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-white/10 text-white lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={`${open ? "grid" : "hidden"} border-t border-white/10 bg-[#0b0f19] px-5 py-4 lg:hidden`}
      >
        <div className="grid gap-2">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={hrefFor(item.href)}
              className="focus-ring rounded-lg px-3 py-3 text-sm font-medium text-slate-300"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <ButtonLink href={hrefFor("#lista-de-espera")} className="mt-2 w-full">
            Entrar na lista
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
