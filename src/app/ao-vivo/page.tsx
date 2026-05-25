"use client";

import Image from "next/image";
import Link from "next/link";
import { Radio, Video } from "lucide-react";
import { OfficialHeader, PremiumFooter } from "@/components/OfficialChrome";
import { COURTS, getCourtStatusLabel } from "@/lib/courts";
import { useTournamentStore } from "@/lib/tournament/store";
import { cn } from "@/lib/utils";

export default function LiveStreamsPage() {
  const { state } = useTournamentStore();

  return (
    <main className="min-h-screen overflow-hidden bg-[#020403] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(239,68,68,0.12),transparent_34%),radial-gradient(circle_at_82%_18%,rgba(132,204,22,0.14),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_28%)]" />
      <OfficialHeader />

      <div className="relative z-10 mx-auto flex max-w-[1440px] flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-xl border border-white/10 bg-white/[0.055] p-5 text-center shadow-[0_0_54px_rgba(239,68,68,0.08)] backdrop-blur sm:p-8">
          <div className="mx-auto inline-flex items-center gap-2 rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-black uppercase text-red-600">
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

        <section aria-label="Transmissões por quadra" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {COURTS.map((court) => {
            const status = state.settings.courtStatuses[court.id] ?? (court.reserve ? "disabled" : "active");
            const streamUrl = state.settings.liveStreams[court.id]?.trim() ?? "";
            const isActive = status === "active";
            const canWatch = isActive && Boolean(streamUrl);
            const href = streamUrl.startsWith("http") ? streamUrl : `https://${streamUrl}`;

            return (
              <article
                key={court.id}
                className={cn(
                  `relative min-h-56 overflow-hidden rounded-xl border border-white/15 bg-gradient-to-br ${court.color} p-4 text-white shadow-[0_0_34px_rgba(15,23,42,0.12)]`,
                  !isActive && "opacity-65 grayscale",
                )}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.28),transparent_30%),linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.68))]" />

                <div className="relative z-10 flex min-h-48 flex-col justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="rounded-md bg-black/35 px-3 py-2 text-xs font-black uppercase ring-1 ring-white/15">
                        {court.label}
                      </div>
                      <div className="mt-3 text-2xl font-black uppercase leading-tight">{court.sponsor}</div>
                    </div>

                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-black uppercase",
                        isActive ? "bg-red-500 text-white shadow-[0_0_18px_rgba(239,68,68,0.35)]" : "bg-white/15 text-white",
                      )}
                    >
                      {isActive && <span className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden="true" />}
                      {isActive ? "Ao vivo" : getCourtStatusLabel(status)}
                    </span>
                  </div>

                  {court.logo && (
                    <div className="relative my-3 h-20 w-20 overflow-hidden rounded-xl border border-white/20 bg-white/95 p-2 shadow-[0_0_24px_rgba(255,255,255,0.18)]">
                      <Image src={court.logo} alt={court.label} fill sizes="80px" className="object-contain p-1" />
                    </div>
                  )}

                  <div>
                    <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase text-white/75">
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
                        {isActive ? "Link em breve" : court.reserve ? "Reserva desativada" : "Quadra indisponível"}
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
