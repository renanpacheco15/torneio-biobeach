"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarClock, ChevronLeft, Clock3, Medal, Search, Trophy } from "lucide-react";
import { Brand } from "@/components/Brand";
import { RankingTable } from "@/components/RankingTable";
import { CourtSponsorBackdrop } from "@/components/Sponsors";
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
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
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
  const selectedGroup = state.groups.find((group) => group.id === selectedGroupId) ?? state.groups[0];
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
    <main className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4">
        <header className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Brand compact />
            <div className="flex flex-wrap gap-2">
              <Link href="/geral" className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-black uppercase text-white">
                <Medal className="h-4 w-4" aria-hidden="true" />
                Geral
              </Link>
              <Link href="/tabela" className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 text-sm font-black uppercase text-white">
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

        <section className={`relative overflow-hidden rounded-lg bg-gradient-to-r ${selectedGroup.theme.gradient} p-5 text-white shadow-broadcast`}>
          <CourtSponsorBackdrop group={selectedGroup} />
          <div className="relative z-10">
            <div className="text-xs font-black uppercase opacity-80">{selectedGroup.court}</div>
            <h1 className="mt-1 text-3xl font-black uppercase tracking-normal">{selectedGroup.name}</h1>
            <p className="text-sm font-bold opacity-90">Ranking ao vivo da fase de grupos</p>
          </div>
        </section>

        <section className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[220px_1fr]">
          <label className="block">
            <span className="text-xs font-black uppercase text-slate-500">Grupo</span>
            <select
              value={selectedGroup.id}
              onChange={(event) => setManualGroupId(event.target.value as GroupId)}
              className="mt-1 h-12 w-full rounded-md border-2 border-slate-200 bg-white px-3 font-black text-slate-950 outline-none focus:border-slate-950"
            >
              {state.groups.map((group) => (
                <option key={group.id} value={group.id}>
                  Grupo {group.number} - {group.shortName}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-black uppercase text-slate-500">Buscar dupla</span>
            <div className="mt-1 flex h-12 items-center gap-2 rounded-md border-2 border-slate-200 bg-white px-3 focus-within:border-slate-950">
              <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Digite um nome da dupla"
                className="h-full min-w-0 flex-1 border-0 bg-transparent font-bold text-slate-950 outline-none"
              />
            </div>
          </label>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <div className="text-xs font-black uppercase text-emerald-700">Classificando agora</div>
            <div className="mt-2 space-y-2">
              {ranking.slice(0, 2).map((row) => (
                <div key={row.pair.id} className="flex items-center gap-2 text-sm font-black text-emerald-950">
                  <Trophy className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                  {row.position}º {row.pair.name}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="text-xs font-black uppercase text-slate-500">Jogos restantes</div>
            <div className="mt-2 text-4xl font-black text-slate-950">{remainingMatches.length}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="text-xs font-black uppercase text-slate-500">Jogos finalizados</div>
            <div className="mt-2 text-4xl font-black text-slate-950">{finishedMatches.length}/10</div>
          </div>
        </section>

        <RankingTable ranking={ranking} highlightPairId={highlightedPair?.pair.id} />

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-slate-700" aria-hidden="true" />
              <h2 className="text-lg font-black uppercase tracking-normal">Próximos confrontos</h2>
            </div>
            <div className="space-y-2">
              {nextMatches.length === 0 ? (
                <div className="rounded-md bg-emerald-50 p-3 text-sm font-bold text-emerald-700">Todos os jogos do grupo foram finalizados.</div>
              ) : (
                nextMatches.map((match) => (
                  <div key={match.id} className="rounded-md border border-slate-200 p-3">
                    <div className="text-xs font-black uppercase text-slate-500">Jogo {match.order}</div>
                    <div className="mt-1 grid grid-cols-[1fr_auto_1fr] gap-2 text-sm font-black text-slate-950">
                      <span>{getPairName(state, match.pairAId)}</span>
                      <span className="text-slate-400">x</span>
                      <span className="text-right">{getPairName(state, match.pairBId)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <Clock3 className="h-5 w-5 text-slate-700" aria-hidden="true" />
              <h2 className="text-lg font-black uppercase tracking-normal">Jogos do grupo</h2>
            </div>
            <div className="space-y-2">
              {matches.map((match) => (
                <div
                  key={match.id}
                  className={cn(
                    "rounded-md border p-3 text-sm",
                    match.status === "finished" ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-black uppercase text-slate-500">Jogo {match.order}</span>
                    <span className="font-black uppercase text-slate-500">
                      {match.status === "finished" ? `${match.scoreA} x ${match.scoreB}` : match.status === "live" ? "Em andamento" : "Pendente"}
                    </span>
                  </div>
                  <div className="mt-1 grid grid-cols-[1fr_auto_1fr] gap-2 font-bold text-slate-950">
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

const GROUP_IDS: GroupId[] = ["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8"];

function isGroupId(value: string | null): value is GroupId {
  return GROUP_IDS.includes(value as GroupId);
}

function parseGroupParam(groupId: string | null): GroupId {
  if (isGroupId(groupId)) return groupId;

  const numericGroup = Number(groupId);
  if (Number.isInteger(numericGroup) && numericGroup >= 1 && numericGroup <= 8) {
    return `G${numericGroup}` as GroupId;
  }

  return "G1";
}
