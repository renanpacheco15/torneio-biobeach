"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { Brand } from "@/components/Brand";
import { COURT_SPONSOR_LIST } from "@/lib/sponsors";
import { cn } from "@/lib/utils";

const primaryNav = [
  { label: "HOME", href: "/" },
  { label: "GRUPOS", href: "/#grupos" },
  { label: "TABELA", href: "/tabela" },
  { label: "RANKING", href: "/geral" },
  { label: "AO VIVO", href: "/ao-vivo", live: true },
  { label: "PATROCINADORES", href: "/#patrocinadores" },
  { label: "ADMIN", href: "/admin", muted: true },
];

export function OfficialHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/86 backdrop-blur-xl">
      <div className="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-3 sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:px-8">
        <Link href="/" aria-label="Ir para o início" className="w-fit">
          <Brand dark />
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.045] p-1 lg:flex">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-black uppercase tracking-normal transition xl:px-4",
                item.live && "text-red-200 hover:bg-red-500 hover:text-white",
                item.muted ? "text-slate-400 hover:bg-white/10 hover:text-white" : !item.live && "text-slate-100 hover:bg-lime-300 hover:text-slate-950",
              )}
            >
              {item.live && <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_14px_rgba(239,68,68,0.9)]" aria-hidden="true" />}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center justify-end gap-3 lg:flex">
          <div className="text-right">
            <div className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">Arena sede</div>
            <div className="relative mt-1 h-12 w-56 overflow-hidden rounded-md border border-white/10 bg-white/[0.96] px-2 py-1 shadow-[0_0_22px_rgba(245,197,66,0.10)]">
              <Image src="/brand/arena-360.png" alt="Arena 360" fill sizes="224px" className="object-contain p-0.5" priority />
            </div>
          </div>
        </div>

        <div className="relative hidden h-10 w-40 rounded-md border border-white/10 bg-white/95 px-1.5 py-1 min-[390px]:block lg:hidden">
          <Image src="/brand/arena-360.png" alt="Arena 360" fill sizes="160px" className="object-contain p-0.5" priority />
        </div>

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="inline-flex h-12 w-12 items-center justify-center rounded-md border border-lime-300/30 bg-lime-300/10 text-lime-200 lg:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-black px-4 py-3 lg:hidden">
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
                  {item.label}
                </span>
                {item.muted && <ShieldCheck className="h-4 w-4" aria-hidden="true" />}
              </Link>
            ))}
            <div className="mt-1 flex items-center justify-between rounded-md border border-white/10 bg-white/[0.03] px-4 py-3">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Arena sede</span>
              <div className="relative h-10 w-44 rounded bg-white/95 px-1.5 py-1">
                <Image src="/brand/arena-360.png" alt="Arena 360" fill sizes="176px" className="object-contain p-0.5" />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function PremiumFooter() {
  return (
    <footer id="patrocinadores" className="border-t border-white/10 bg-black/90">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-2 opacity-90 min-[420px]:grid-cols-4 sm:grid-cols-8">
          {COURT_SPONSOR_LIST.map((sponsor) => (
            <div
              key={sponsor.groupId}
              className="relative h-12 overflow-hidden rounded-md border border-white/10 bg-white/[0.94] shadow-[0_0_18px_rgba(255,255,255,0.04)] sm:h-14"
            >
              <Image src={sponsor.src} alt={sponsor.name} fill sizes="160px" className="object-contain p-2.5" />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 text-xs font-bold text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Torneio BIOBEACH · Plataforma oficial de futevôlei</span>
          <span>Transmissões · Grupos · Tabela · Ranking Geral</span>
        </div>
      </div>
    </footer>
  );
}
