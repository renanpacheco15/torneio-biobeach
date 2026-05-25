"use client";

import Link from "next/link";
import { Menu, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { Brand } from "@/components/Brand";
import { cn } from "@/lib/utils";

const primaryNav = [
  { label: "HOME", href: "/" },
  { label: "TABELA", href: "/tabela" },
  { label: "RANKING", href: "/geral" },
  { label: "AO VIVO", href: "/ao-vivo", live: true },
  { label: "TEMPO REAL", mobileLabel: "ACOMPANHE EM TEMPO REAL", href: "/tempo-real" },
  { label: "REGULAMENTO", href: "/regulamento" },
  { label: "ADMIN", href: "/admin", muted: true },
];

export function OfficialHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8 xl:grid xl:grid-cols-[1fr_auto_1fr]">
        <Link href="/" aria-label="Ir para o inicio" className="order-1 w-fit min-w-0 xl:order-none">
          <Brand dark />
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.045] p-1 xl:flex">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-normal transition",
                item.live && "text-red-200 hover:bg-red-500 hover:text-white",
                item.muted ? "text-slate-400 hover:bg-white/10 hover:text-white" : !item.live && "text-slate-100 hover:bg-lime-300 hover:text-slate-950",
              )}
            >
              {item.live && <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_14px_rgba(239,68,68,0.9)]" aria-hidden="true" />}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden xl:block" />

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="order-2 ml-auto inline-flex h-11 w-11 items-center justify-center rounded-md border border-lime-300/30 bg-lime-300/10 text-lime-200 sm:h-12 sm:w-12 xl:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-black px-4 py-3 xl:hidden">
          <div className="mx-auto grid max-w-[1440px] gap-2">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex min-h-12 items-center justify-between rounded-md border border-white/10 bg-white/[0.045] px-4 text-sm font-black uppercase text-white",
                  item.live && "text-red-100",
                  item.muted && "text-slate-300",
                )}
              >
                <span className="inline-flex items-center gap-2">
                  {item.live && <span className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_14px_rgba(239,68,68,0.9)]" aria-hidden="true" />}
                  {item.mobileLabel ?? item.label}
                </span>
                {item.muted && <ShieldCheck className="h-4 w-4" aria-hidden="true" />}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export function PremiumFooter() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-4 py-5 text-xs font-bold text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <span>© 2026 Torneio BIOBEACH · Plataforma oficial</span>
        <span>Grupos · Tabela · Ranking Geral · Tempo Real</span>
      </div>
    </footer>
  );
}
