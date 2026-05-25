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
  { label: "TABELA", href: "/tabela" },
  { label: "RANKING", href: "/geral" },
  { label: "AO VIVO", href: "/ao-vivo", live: true },
  { label: "TEMPO REAL", mobileLabel: "ACOMPANHE EM TEMPO REAL", href: "/tempo-real" },
  { label: "ADMIN", href: "/admin", muted: true },
];

function ArenaLogo({ mobile = false }: { mobile?: boolean }) {
  return (
    <div className={cn("flex flex-col items-center justify-center", mobile ? "w-[6.8rem] min-[390px]:w-32" : "w-56")}>
      <div className={cn("relative w-full", mobile ? "h-9 min-[390px]:h-10" : "h-14")}>
        <Image
          src="/brand/arena-360-clean.png"
          alt="Arena 360"
          fill
          sizes={mobile ? "128px" : "224px"}
          className="object-contain drop-shadow-[0_0_14px_rgba(132,204,22,0.16)]"
          priority
        />
      </div>
      <div className={cn("mt-0.5 font-black uppercase tracking-[0.24em] text-slate-500", mobile ? "text-[6px]" : "text-[8px]")}>
        Arena sede
      </div>
    </div>
  );
}

export function OfficialHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8 xl:grid xl:grid-cols-[1fr_auto_1fr]">
        <Link href="/" aria-label="Ir para o início" className="order-1 w-fit min-w-0 xl:order-none">
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

        <div className="hidden items-center justify-end gap-3 xl:flex">
          <ArenaLogo />
        </div>

        <div className="order-2 ml-auto flex shrink-0 justify-end xl:hidden">
          <ArenaLogo mobile />
        </div>

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="order-3 inline-flex h-11 w-11 items-center justify-center rounded-md border border-lime-300/30 bg-lime-300/10 text-lime-200 sm:h-12 sm:w-12 xl:hidden"
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
    <footer id="patrocinadores" className="border-t border-white/10 bg-black">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
        <div className="overflow-x-auto overflow-y-hidden pb-1">
          <div className="flex min-w-max gap-2.5 sm:grid sm:min-w-0 sm:grid-cols-4 lg:grid-cols-8">
            {COURT_SPONSOR_LIST.map((sponsor) => (
              <div
                key={sponsor.groupId}
                className="relative h-16 w-44 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-zinc-950 via-neutral-950 to-black shadow-[0_0_20px_rgba(132,204,22,0.06)] sm:w-auto"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.12),transparent_62%)]" />
                <Image src={sponsor.src} alt={sponsor.name} fill sizes="176px" className="object-contain p-3" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 text-xs font-bold text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Torneio BIOBEACH · Plataforma oficial</span>
          <span>Transmissões · Tabela · Ranking Geral</span>
        </div>
      </div>
    </footer>
  );
}
