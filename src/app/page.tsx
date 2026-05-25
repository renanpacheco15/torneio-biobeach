"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight, Trophy } from "lucide-react";
import { CourtSponsorBackdrop } from "@/components/Sponsors";
import { OfficialHeader, PremiumFooter } from "@/components/OfficialChrome";
import { calculateOverallRanking, getTournamentProgress } from "@/lib/tournament/calculations";
import { GROUPS } from "@/lib/tournament/data";
import { getCourtSponsor } from "@/lib/sponsors";
import { useTournamentStore } from "@/lib/tournament/store";
import type { Group } from "@/lib/tournament/types";
import { cn } from "@/lib/utils";

export default function Home() {
  const { state } = useTournamentStore();
  const ranking = calculateOverallRanking(state);
  const progress = getTournamentProgress(state);

  return (
    <main id="inicio" className="min-h-screen overflow-hidden bg-[#020403] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(132,204,22,0.14),transparent_32%),radial-gradient(circle_at_88%_24%,rgba(245,197,66,0.12),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_26%)]" />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime-300/70 to-transparent" />

      <OfficialHeader />

      <div className="relative z-10 mx-auto flex max-w-[1440px] flex-col gap-10 px-4 pb-8 pt-6 sm:px-6 lg:px-8 lg:gap-12 lg:pb-10 lg:pt-10">
        <section className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center rounded-md border border-lime-300/25 bg-lime-300/10 px-3 py-2 text-xs font-black uppercase text-lime-200 shadow-[0_0_24px_rgba(132,204,22,0.12)]">
            Arena 360 · Futevôlei
          </div>
          <h1 className="mt-5 text-5xl font-black uppercase leading-[0.9] tracking-normal text-white drop-shadow-[0_0_24px_rgba(255,255,255,0.14)] sm:text-6xl lg:text-7xl">
            Torneio BioBeach
          </h1>
          <h2 className="mx-auto mt-5 max-w-4xl text-2xl font-black uppercase leading-tight text-lime-200 sm:text-3xl lg:text-4xl">
            Clique na sua quadra para ver o grupo
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-bold leading-6 text-slate-300 sm:text-base">
            Classificação, confrontos e resultados ao vivo em poucos toques.
          </p>
        </section>

        <section aria-label="Acesso aos grupos" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {GROUPS.map((group) => (
            <CourtAccessCard key={group.id} group={group} />
          ))}
        </section>

        <section id="ranking-geral" className="mx-auto w-full max-w-5xl rounded-xl border border-lime-300/20 bg-white/[0.055] p-5 shadow-[0_0_54px_rgba(132,204,22,0.10)] backdrop-blur sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-md bg-lime-300/10 px-3 py-2 text-xs font-black uppercase text-lime-200 ring-1 ring-lime-300/20">
                <Trophy className="h-4 w-4" aria-hidden="true" />
                Ranking Geral
              </div>
              <h2 className="mt-4 text-3xl font-black uppercase leading-tight tracking-normal sm:text-4xl">
                Classificação ao vivo
              </h2>
              <p className="mt-3 max-w-2xl text-sm font-bold leading-6 text-slate-300 sm:text-base">
                Top 5 do torneio por vitórias, saldo, pontos feitos e pontos sofridos.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <RankingMetric label="Jogos" value={`${progress.finished}/${progress.total}`} />
              <RankingMetric label="Progresso" value={`${progress.percent}%`} />
              <RankingMetric label="Duplas" value={ranking.length.toString()} />
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {ranking.slice(0, 5).map((row) => (
              <div
                key={row.pair.id}
                className="grid min-h-16 grid-cols-[auto_1fr] items-center gap-3 rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 sm:px-4"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-lime-300 text-lg font-black text-slate-950">
                  {row.overallPosition}
                </div>
                <div className="min-w-0">
                  <div className="text-base font-black uppercase leading-snug text-white break-words">{row.pair.name}</div>
                  <div className="mt-1 text-xs font-black uppercase text-slate-400">Grupo {row.group.number} · {row.group.shortName}</div>
                </div>
                <div className="col-span-2 grid grid-cols-3 gap-2 sm:grid-cols-6">
                  <MiniStat label="J" value={row.played.toString()} />
                  <MiniStat label="V" value={row.wins.toString()} />
                  <MiniStat label="PF" value={row.pointsFor.toString()} />
                  <MiniStat label="PC" value={row.pointsAgainst.toString()} />
                  <MiniStat label="Saldo" value={`${row.balance > 0 ? "+" : ""}${row.balance}`} highlight />
                  <MiniStat label="Aprov." value={`${Math.round(row.winRate * 100)}%`} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex justify-center">
            <Link
              href="/geral"
              className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-md border border-lime-300/40 bg-lime-300 px-6 text-sm font-black uppercase text-slate-950 shadow-[0_0_32px_rgba(132,204,22,0.24)] transition hover:-translate-y-0.5 sm:w-auto sm:min-w-64"
            >
              Ver ranking completo
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </section>

      </div>
      <PremiumFooter />
    </main>
  );
}

function CourtAccessCard({ group }: { group: Group }) {
  const sponsor = getCourtSponsor(group.id);
  const courtNumber = String(group.number).padStart(2, "0");

  return (
    <Link
      href={`/atleta?grupo=${group.number}`}
      className={`group relative min-h-44 overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br ${group.theme.gradient} p-4 text-white shadow-[0_0_34px_rgba(255,255,255,0.05)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_46px_rgba(132,204,22,0.18)] focus:outline-none focus:ring-2 focus:ring-lime-300 sm:min-h-48`}
      aria-label={`Abrir grupo da Quadra ${courtNumber}, ${group.shortName}`}
    >
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
    </Link>
  );
}

function RankingMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-slate-950/70 px-3 py-3 sm:px-4">
      <div className="text-2xl font-black text-white sm:text-3xl">{value}</div>
      <div className="text-[10px] font-black uppercase text-lime-300">{label}</div>
    </div>
  );
}

function MiniStat({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={cn("rounded-md border px-2 py-2 text-center", highlight ? "border-lime-300/30 bg-lime-300/10" : "border-white/10 bg-white/[0.04]")}>
      <div className={cn("text-sm font-black", highlight ? "text-lime-300" : "text-white")}>{value}</div>
      <div className="mt-0.5 text-[9px] font-black uppercase text-slate-500">{label}</div>
    </div>
  );
}
