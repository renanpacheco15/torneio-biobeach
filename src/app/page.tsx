"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CourtSponsorBackdrop } from "@/components/Sponsors";
import { OfficialHeader, PremiumFooter } from "@/components/OfficialChrome";
import { getCourtStatusLabel, isCourtPubliclyVisible } from "@/lib/courts";
import { getCourtSponsor } from "@/lib/sponsors";
import { GROUPS } from "@/lib/tournament/data";
import { useTournamentStore } from "@/lib/tournament/store";
import type { CourtStatus, Group } from "@/lib/tournament/types";
import { cn } from "@/lib/utils";

export default function Home() {
  const { state } = useTournamentStore();
  const visibleGroups = GROUPS.filter((group) => isCourtPubliclyVisible(state.settings.courtStatuses[`court-${group.number}`] ?? "active"));

  return (
    <main id="inicio" className="min-h-screen overflow-hidden bg-[#020403] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(132,204,22,0.14),transparent_32%),radial-gradient(circle_at_88%_24%,rgba(245,197,66,0.12),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_26%)]" />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime-300/70 to-transparent" />

      <OfficialHeader />

      <div className="relative z-10 mx-auto flex max-w-[1440px] flex-col gap-10 px-4 pb-8 pt-6 sm:px-6 lg:px-8 lg:gap-12 lg:pb-10 lg:pt-10">
        <section className="mx-auto max-w-5xl text-center">
          <h1 className="mt-2 text-5xl font-black uppercase leading-[0.9] tracking-normal text-white drop-shadow-[0_0_24px_rgba(255,255,255,0.14)] sm:text-6xl lg:text-7xl">
            Torneio BIOBEACH
          </h1>
          <h2 className="mx-auto mt-5 max-w-4xl text-2xl font-black uppercase leading-tight text-lime-200 sm:text-3xl lg:text-4xl">
            Clique na sua quadra para ver o grupo
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-bold leading-6 text-slate-300 sm:text-base">
            Classificação, confrontos e transmissões em poucos toques.
          </p>
        </section>

        <section id="grupos" aria-label="Acesso aos grupos" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {visibleGroups.map((group) => {
            const status = state.settings.courtStatuses[`court-${group.number}`] ?? "active";
            return <CourtAccessCard key={group.id} group={group} status={status} />;
          })}
        </section>
      </div>
      <PremiumFooter />
    </main>
  );
}

function CourtAccessCard({ group, status }: { group: Group; status: CourtStatus }) {
  const sponsor = getCourtSponsor(group.id);
  const courtNumber = String(group.number).padStart(2, "0");
  const disabled = status !== "active";
  const cardClassName = cn(
    `group relative min-h-44 overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br ${group.theme.gradient} p-4 text-white shadow-[0_0_34px_rgba(255,255,255,0.05)] transition duration-200 focus:outline-none focus:ring-2 focus:ring-lime-300 sm:min-h-48`,
    disabled ? "cursor-not-allowed opacity-65 grayscale" : "hover:-translate-y-0.5 hover:shadow-[0_0_46px_rgba(132,204,22,0.18)]",
  );

  const content = (
    <>
      <CourtSponsorBackdrop group={group} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.25),transparent_30%),linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.58))]" />

      <div className="relative z-10 flex h-full min-h-36 flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div className="rounded-md bg-black/35 px-3 py-2 text-xs font-black uppercase text-white ring-1 ring-white/15 backdrop-blur">
            Quadra {courtNumber}
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/12 text-white ring-1 ring-white/15 transition group-hover:translate-x-0.5">
            <ChevronRight className="h-6 w-6" aria-hidden="true" />
          </div>
        </div>

        <div>
          <div className="text-6xl font-black leading-none tracking-normal text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.24)]">
            {courtNumber}
          </div>
          <div className="mt-3 text-2xl font-black uppercase leading-none tracking-normal text-white">{group.shortName}</div>
          <div className="mt-2 text-xs font-black uppercase text-white/75">{sponsor.name}</div>
        </div>
      </div>

      {disabled && (
        <div className="absolute inset-x-3 bottom-3 z-20 rounded-md border border-white/15 bg-black/70 px-3 py-2 text-center text-xs font-black uppercase text-white backdrop-blur">
          {getCourtStatusLabel(status)}
        </div>
      )}
    </>
  );

  if (disabled) {
    return (
      <div className={cardClassName} aria-disabled="true" aria-label={`Quadra ${courtNumber} indisponível`}>
        {content}
      </div>
    );
  }

  return (
    <Link href={`/atleta?grupo=${group.number}`} className={cardClassName} aria-label={`Abrir grupo da Quadra ${courtNumber}, ${group.shortName}`}>
      {content}
    </Link>
  );
}
