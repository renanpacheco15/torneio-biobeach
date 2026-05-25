"use client";

import { Medal, Trophy } from "lucide-react";
import { OfficialHeader, PremiumFooter } from "@/components/OfficialChrome";
import { OverallRankingTable } from "@/components/OverallRankingTable";
import { calculateOverallRanking, getTournamentProgress } from "@/lib/tournament/calculations";
import { useTournamentStore } from "@/lib/tournament/store";

export default function OverallRankingPage() {
  const { state } = useTournamentStore();
  const ranking = calculateOverallRanking(state);
  const progress = getTournamentProgress(state);
  const leader = ranking[0];

  return (
    <main className="min-h-screen bg-[#020403] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(132,204,22,0.12),transparent_34%),radial-gradient(circle_at_88%_20%,rgba(245,197,66,0.10),transparent_28%)]" />
      <OfficialHeader />

      <div className="relative z-10 mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-xl border border-white/10 bg-white/[0.055] p-5 text-white shadow-[0_0_54px_rgba(132,204,22,0.10)] backdrop-blur sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-black uppercase text-amber-300">
                <Medal className="h-4 w-4" aria-hidden="true" />
                Fase de grupos
              </div>
              <h1 className="mt-2 text-4xl font-black uppercase tracking-normal lg:text-5xl">Classificação geral</h1>
              <p className="mt-2 text-sm font-bold text-slate-300">
                Ranking das 40 duplas por vitórias, saldo, pontos feitos e pontos sofridos.
              </p>
            </div>

            <div className="grid gap-2 text-center sm:grid-cols-3">
              <HeroMetric label="Jogos concluídos" value={`${progress.finished}/${progress.total}`} />
              <HeroMetric label="Progresso" value={`${progress.percent}%`} />
              <HeroMetric label="Duplas" value={ranking.length.toString()} />
            </div>
          </div>
        </section>

        {leader && (
          <section className="rounded-xl border border-amber-300/25 bg-amber-300/10 p-4 shadow-[0_0_34px_rgba(245,197,66,0.10)]">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-300">
                  <Trophy className="h-4 w-4" aria-hidden="true" />
                  Melhor campanha agora
                </div>
                <div className="mt-1 text-2xl font-black uppercase tracking-normal text-white">{leader.pair.name}</div>
                <div className="mt-1 text-sm font-bold text-amber-100">
                  Grupo {leader.group.number} · {leader.groupPosition}º no grupo
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <SmallMetric label="J" value={leader.played.toString()} />
                <SmallMetric label="V" value={leader.wins.toString()} />
                <SmallMetric label="PF" value={leader.pointsFor.toString()} />
                <SmallMetric label="Saldo" value={`${leader.balance > 0 ? "+" : ""}${leader.balance}`} />
              </div>
            </div>
          </section>
        )}

        <OverallRankingTable ranking={ranking} />
      </div>

      <PremiumFooter />
    </main>
  );
}

function HeroMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-white/10 px-4 py-3">
      <div className="text-3xl font-black">{value}</div>
      <div className="text-xs font-black uppercase text-slate-300">{label}</div>
    </div>
  );
}

function SmallMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-16 rounded-md bg-white/10 px-3 py-2">
      <div className="text-2xl font-black text-white">{value}</div>
      <div className="text-xs font-black uppercase text-amber-300">{label}</div>
    </div>
  );
}
