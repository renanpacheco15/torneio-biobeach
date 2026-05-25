"use client";

import Link from "next/link";
import { ChevronLeft, Medal, Trophy } from "lucide-react";
import { Brand } from "@/components/Brand";
import { OverallRankingTable } from "@/components/OverallRankingTable";
import { calculateOverallRanking, getTournamentProgress } from "@/lib/tournament/calculations";
import { useTournamentStore } from "@/lib/tournament/store";

export default function OverallRankingPage() {
  const { state } = useTournamentStore();
  const ranking = calculateOverallRanking(state);
  const progress = getTournamentProgress(state);
  const leader = ranking[0];

  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4">
        <header className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Brand compact />
            <div className="flex flex-wrap gap-2">
              <Link href="/tabela" className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-black uppercase text-white">
                <Trophy className="h-4 w-4" aria-hidden="true" />
                Tabela
              </Link>
              <Link href="/" className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-slate-200 px-4 text-sm font-black uppercase text-slate-800">
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                Início
              </Link>
            </div>
          </div>
        </header>

        <section className="rounded-lg bg-slate-950 p-5 text-white shadow-broadcast">
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
          <section className="rounded-lg border border-amber-200 bg-amber-50 p-4 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-700">
                  <Trophy className="h-4 w-4" aria-hidden="true" />
                  Melhor campanha agora
                </div>
                <div className="mt-1 text-2xl font-black uppercase tracking-normal text-amber-950">{leader.pair.name}</div>
                <div className="mt-1 text-sm font-bold text-amber-800">
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
    <div className="min-w-16 rounded-md bg-white px-3 py-2">
      <div className="text-2xl font-black text-amber-950">{value}</div>
      <div className="text-xs font-black uppercase text-amber-700">{label}</div>
    </div>
  );
}
