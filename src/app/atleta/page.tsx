"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarClock, ChevronLeft, Clock3, Medal, Search, Trophy } from "lucide-react";
import { Brand } from "@/components/Brand";
import { RankingTable } from "@/components/RankingTable";
import { CourtSponsorBackdrop } from "@/components/Sponsors";
import { isCourtPubliclyVisible } from "@/lib/courts";
import { useTournamentStore } from "@/lib/tournament/store";
import {
  calculateGroupRanking,
  getMatchesByGroup,
  getPairName,
  normalizeText,
} from "@/lib/tournament/calculations";
import type { GroupId } from "@/lib/tournament/types";
import { cn } from "@/lib/utils";

export default function AthletePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020403]" />}>
      <AthletePageContent />
    </Suspense>
  );
}

function AthletePageContent() {
  const { state } = useTournamentStore();
  const searchParams = useSearchParams();
  const requestedGroupId = parseGroupParam(searchParams.get("grupo"));
  const [manualGroupId, setManualGroupId] = useState<GroupId | null>(null);
  const selectedGroupId = manualGroupId ?? requestedGroupId;
  const [query, setQuery] = useState("");
  const visibleGroups = state.groups.filter((group) => isCourtPubliclyVisible(state.settings.courtStatuses[`court-${group.number}`] ?? "active"));
  const selectedGroup = visibleGroups.find((group) => group.id === selectedGroupId) ?? visibleGroups[0] ?? state.groups[0];
  const ranking = calculateGroupRanking(state, selectedGroup.id);
  const matches = getMatchesByGroup(state, selectedGroup.id);
  const normalizedQuery = normalizeText(query);
  const highlightedPair = normalizedQuery
    ? ranking.find((row) => normalizeText(row.pair.name).includes(normalizedQuery))
    : undefined;
  const remainingMatches = matches.filter((match) => match.status !== "finished");
  const finishedMatches = matches.filter((match) => match.status === "finished");
  const nextMatches = remainingMatches.slice(0, 3);

  return (
    <main className="min-h-screen bg-[#020403] px-4 py-4 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(132,204,22,0.12),transparent_34%),radial-gradient(circle_at_88%_20%,rgba(245,197,66,0.10),transparent_28%)]" />
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-4">
        <header className="rounded-lg border border-white/10 bg-black/55 p-4 shadow-[0_0_34px_rgba(132,204,22,0.08)] backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Brand dark compact />
            <div className="flex flex-wrap gap-2">
              <Link href="/geral" className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-lime-300 px-4 text-sm font-black uppercase text-slate-950">
                <Medal className="h-4 w-4" aria-hidden="true" />
                Geral
              </Link>
              <Link href="/tabela" className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 text-sm font-black uppercase text-white">
                <Trophy className="h-4 w-4" aria-hidden="true" />
                Tabela
              </Link>
              <Link href="/" className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-4 text-sm font-black uppercase text-slate-200">
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                Início
              </Link>
            </div>
          </div>
        </header>

        <section className={`relative overflow-hidden rounded-lg bg-gradient-to-r ${selectedGroup.theme.gradient} p-5 text-white shadow-broadcast`}>
          <CourtSponsorBackdrop group={selectedGroup} />
          <div className="relative z-10">
            <div className="text-xs font-black uppercase opacity-80">{selectedGroup.court}</div>
            <h1 className="mt-1 text-3xl font-black uppercase tracking-normal">{selectedGroup.name}</h1>
            <p className="text-sm font-bold opacity-90">Ranking da fase de grupos</p>
          </div>
        </section>

        <section className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.055] p-4 shadow-[0_0_34px_rgba(132,204,22,0.08)] md:grid-cols-[220px_1fr]">
          <label className="block">
            <span className="text-xs font-black uppercase text-slate-400">Grupo</span>
            <select
              value={selectedGroup.id}
              onChange={(event) => setManualGroupId(event.target.value as GroupId)}
              className="mt-1 h-12 w-full rounded-md border-2 border-white/10 bg-slate-950 px-3 font-black text-white outline-none focus:border-lime-300"
            >
              {visibleGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  Grupo {group.number} - {group.shortName}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-black uppercase text-slate-400">Buscar dupla</span>
            <div className="mt-1 flex h-12 items-center gap-2 rounded-md border-2 border-white/10 bg-slate-950 px-3 focus-within:border-lime-300">
              <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Digite um nome da dupla"
                className="h-full min-w-0 flex-1 border-0 bg-transparent font-bold text-white outline-none placeholder:text-slate-500"
              />
            </div>
          </label>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-emerald-300/20 bg-emerald-400/10 p-4">
            <div className="text-xs font-black uppercase text-emerald-300">Classificando agora</div>
            <div className="mt-2 space-y-2">
              {ranking.slice(0, 2).map((row) => (
                <div key={row.pair.id} className="flex items-center gap-2 text-sm font-black text-white">
                  <Trophy className="h-4 w-4 text-emerald-300" aria-hidden="true" />
                  {row.position}º {row.pair.name}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
            <div className="text-xs font-black uppercase text-slate-400">Jogos restantes</div>
            <div className="mt-2 text-4xl font-black text-white">{remainingMatches.length}</div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
            <div className="text-xs font-black uppercase text-slate-400">Jogos finalizados</div>
            <div className="mt-2 text-4xl font-black text-white">{finishedMatches.length}/10</div>
          </div>
        </section>

        <RankingTable ranking={ranking} highlightPairId={highlightedPair?.pair.id} />

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4 shadow-[0_0_34px_rgba(132,204,22,0.08)]">
            <div className="mb-3 flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-lime-200" aria-hidden="true" />
              <h2 className="text-lg font-black uppercase tracking-normal">Próximos confrontos</h2>
            </div>
            <div className="space-y-2">
              {nextMatches.length === 0 ? (
                <div className="rounded-md bg-emerald-400/10 p-3 text-sm font-bold text-emerald-300">Todos os jogos do grupo foram finalizados.</div>
              ) : (
                nextMatches.map((match) => (
                  <div key={match.id} className="rounded-md border border-white/10 bg-black/20 p-3">
                    <div className="text-xs font-black uppercase text-slate-400">Jogo {match.order}</div>
                    <div className="mt-1 grid grid-cols-[1fr_auto_1fr] gap-2 text-sm font-black text-white">
                      <span>{getPairName(state, match.pairAId)}</span>
                      <span className="text-slate-400">x</span>
                      <span className="text-right">{getPairName(state, match.pairBId)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4 shadow-[0_0_34px_rgba(132,204,22,0.08)]">
            <div className="mb-3 flex items-center gap-2">
              <Clock3 className="h-5 w-5 text-lime-200" aria-hidden="true" />
              <h2 className="text-lg font-black uppercase tracking-normal">Jogos do grupo</h2>
            </div>
            <div className="space-y-2">
              {matches.map((match) => (
                <div
                  key={match.id}
                  className={cn(
                    "rounded-md border p-3 text-sm",
                    match.status === "finished" ? "border-emerald-300/20 bg-emerald-400/10" : "border-white/10 bg-black/20",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-black uppercase text-slate-400">Jogo {match.order}</span>
                    <span className="font-black uppercase text-slate-400">
                      {match.status === "finished" ? `${match.scoreA} x ${match.scoreB}` : match.status === "live" ? "Em andamento" : "Pendente"}
                    </span>
                  </div>
                  <div className="mt-1 grid grid-cols-[1fr_auto_1fr] gap-2 font-bold text-white">
                    <span>{getPairName(state, match.pairAId)}</span>
                    <span className="text-slate-400">x</span>
                    <span className="text-right">{getPairName(state, match.pairBId)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

const GROUP_IDS: GroupId[] = ["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9"];

function isGroupId(value: string | null): value is GroupId {
  return GROUP_IDS.includes(value as GroupId);
}

function parseGroupParam(groupId: string | null): GroupId {
  if (isGroupId(groupId)) return groupId;

  const numericGroup = Number(groupId);
  if (Number.isInteger(numericGroup) && numericGroup >= 1 && numericGroup <= 9) {
    return `G${numericGroup}` as GroupId;
  }

  return "G1";
}
