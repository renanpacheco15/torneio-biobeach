"use client";

import Image from "next/image";
import Link from "next/link";
import { Radio, Video } from "lucide-react";
import { OfficialHeader, PremiumFooter } from "@/components/OfficialChrome";
import { COURTS, getCourtStatusLabel, isCourtPubliclyVisible } from "@/lib/courts";
import { useTournamentStore } from "@/lib/tournament/store";
import { cn } from "@/lib/utils";

export default function LiveStreamsPage() {
  const { state } = useTournamentStore();
  const visibleCourts = COURTS.filter((court) =>
    isCourtPubliclyVisible(state.settings.courtStatuses[court.id] ?? (court.reserve ? "disabled" : "active")),
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[#020403] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(239,68,68,0.12),transparent_34%),radial-gradient(circle_at_82%_18%,rgba(132,204,22,0.14),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_28%)]" />
      <OfficialHeader />

      <div className="relative z-10 mx-auto flex max-w-[1440px] flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-xl border border-white/10 bg-white/[0.055] p-5 text-center shadow-[0_0_54px_rgba(239,68,68,0.08)] backdrop-blur sm:p-8">
          <div className="mx-auto inline-flex items-center gap-2 rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-black uppercase text-red-100">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_16px_rgba(239,68,68,0.9)]" aria-hidden="true" />
            Transmissão ao vivo
          </div>
          <h1 className="mt-4 text-4xl font-black uppercase leading-none tracking-normal text-white sm:text-5xl lg:text-6xl">
            AO VIVO
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-bold leading-6 text-slate-300 sm:text-base">
            Links oficiais para assistir aos jogos por quadra. As transmissões são ativadas pela organização no painel administrativo.
          </p>
        </section>

        <section aria-label="Transmissões por quadra" className="grid gap-3">
          {visibleCourts.map((court) => {
            const status = state.settings.courtStatuses[court.id] ?? (court.reserve ? "disabled" : "active");
            const streamUrl = state.settings.liveStreams[court.id]?.trim() ?? "";
            const isActive = status === "active";
            const canWatch = isActive && Boolean(streamUrl);
            const href = streamUrl.startsWith("http") ? streamUrl : `https://${streamUrl}`;

            return (
              <article
                key={court.id}
                className={cn(
                  "relative overflow-hidden rounded-xl border border-white/15 bg-slate-950/90 p-3 text-white shadow-[0_0_34px_rgba(15,23,42,0.16)]",
                  !isActive && "opacity-60 grayscale",
                )}
              >
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${court.color} opacity-35`} />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.20),transparent_28%),linear-gradient(90deg,rgba(2,6,23,0.12),rgba(2,6,23,0.86))]" />

                <div className="relative z-10 grid gap-3 md:grid-cols-[96px_minmax(0,1fr)_170px_220px] md:items-center">
                  <div className="flex items-center gap-3 md:block">
                    <div className="flex h-16 w-20 shrink-0 flex-col items-center justify-center rounded-lg border border-white/15 bg-black/45 shadow-[0_0_18px_rgba(255,255,255,0.06)] md:h-20 md:w-20">
                      <span className="text-[10px] font-black uppercase text-white/70">Quadra</span>
                      <span className="text-3xl font-black leading-none text-white">{String(court.number).padStart(2, "0")}</span>
                    </div>
                    <div className="md:hidden">
                      <div className="text-xl font-black uppercase leading-tight">{court.sponsor}</div>
                      <div className="mt-1 text-xs font-black uppercase text-white/65">{court.label}</div>
                    </div>
                  </div>

                  <div className="hidden min-w-0 items-center gap-4 md:flex">
                    {court.logo && (
                      <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg border border-white/15 bg-black/55 p-1.5 shadow-[0_0_18px_rgba(255,255,255,0.10)]">
                        <Image src={court.logo} alt={court.label} fill sizes="80px" className="object-contain p-1" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="break-words text-2xl font-black uppercase leading-tight">{court.sponsor}</div>
                      <div className="mt-1 text-xs font-black uppercase text-white/65">{court.label}</div>
                    </div>
                  </div>

                  <span
                    className={cn(
                      "inline-flex h-12 w-full items-center justify-center gap-2 rounded-md px-3 text-xs font-black uppercase ring-1",
                      isActive ? "bg-red-500 text-white ring-red-300/50 shadow-[0_0_18px_rgba(239,68,68,0.30)]" : "bg-white/[0.12] text-white ring-white/15",
                    )}
                  >
                    {isActive && <span className="h-2 w-2 rounded-full bg-white" aria-hidden="true" />}
                    {isActive ? "Ao vivo" : getCourtStatusLabel(status)}
                  </span>

                  <div className="grid gap-2">
                    <div className="hidden items-center gap-2 text-[10px] font-black uppercase text-white/65 md:flex">
                      <Video className="h-4 w-4" aria-hidden="true" />
                      Transmissão da quadra
                    </div>

                    {canWatch ? (
                      <Link
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-white text-sm font-black uppercase text-slate-950 transition hover:-translate-y-0.5"
                      >
                        <Radio className="h-4 w-4 text-red-500" aria-hidden="true" />
                        Assistir ao vivo
                      </Link>
                    ) : (
                      <div className="flex h-12 w-full items-center justify-center rounded-md border border-white/20 bg-black/35 px-3 text-center text-xs font-black uppercase text-white">
                        {isActive ? "Transmissão em breve" : court.reserve ? "Reserva / desativada" : "Quadra indisponível"}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </div>

      <PremiumFooter />
    </main>
  );
}
