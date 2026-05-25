"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, Lock, Unlock } from "lucide-react";
import { AdminGate, type AdminRole } from "@/components/AdminGate";
import { Brand } from "@/components/Brand";
import { GroupHeader } from "@/components/GroupHeader";
import { MatchRow } from "@/components/MatchRow";
import { RankingTable } from "@/components/RankingTable";
import { calculateGroupRanking, findGroupByParam, getMatchesByGroup } from "@/lib/tournament/calculations";
import { useTournamentStore } from "@/lib/tournament/store";

export default function ScorekeeperPage() {
  const params = useParams<{ grupo: string }>();
  const { state, actions } = useTournamentStore();
  const group = findGroupByParam(state, params.grupo);

  if (!group) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-md rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
          <Brand compact />
          <h1 className="mt-6 text-2xl font-black uppercase">Quadra não encontrada</h1>
          <Link href="/" className="mt-4 inline-flex h-11 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-black uppercase text-white">
            Voltar
          </Link>
        </div>
      </main>
    );
  }

  const matches = getMatchesByGroup(state, group.id);
  const ranking = calculateGroupRanking(state, group.id);
  const finished = matches.filter((match) => match.status === "finished").length;
  const live = matches.filter((match) => match.status === "live").length;

  return (
    <AdminGate allowedRoles={[`mesario-${group.number}` as AdminRole]} title={`Acesso do mesário ${group.number}`}>
    <main className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4">
        <header className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Brand compact />
            <Link href="/" className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-slate-200 px-4 text-sm font-black uppercase text-slate-800">
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Início
            </Link>
          </div>
        </header>

        <GroupHeader
          group={group}
          right={
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-md bg-white/15 px-3 py-2">
                <div className="text-2xl font-black">{finished}</div>
                <div className="text-[11px] font-black uppercase">Finalizados</div>
              </div>
              <div className="rounded-md bg-white/15 px-3 py-2">
                <div className="text-2xl font-black">{live}</div>
                <div className="text-[11px] font-black uppercase">Ao vivo</div>
              </div>
              <div className="rounded-md bg-white/15 px-3 py-2">
                <div className="text-2xl font-black">10</div>
                <div className="text-[11px] font-black uppercase">Jogos</div>
              </div>
            </div>
          }
        />

        <div className={`flex items-center gap-2 rounded-lg border p-3 text-sm font-black uppercase ${state.settings.locked ? "border-amber-200 bg-amber-50 text-amber-800" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
          {state.settings.locked ? <Lock className="h-4 w-4" aria-hidden="true" /> : <Unlock className="h-4 w-4" aria-hidden="true" />}
          {state.settings.locked ? "Lançamentos travados pelo administrador" : "Lançamentos liberados"}
        </div>

        <section className="grid gap-4 xl:grid-cols-[1fr_420px]">
          <div className="flex flex-col gap-3">
            {matches.map((match) => (
              <MatchRow
                key={`${match.id}-${match.status}-${match.scoreA ?? "a"}-${match.scoreB ?? "b"}`}
                state={state}
                match={match}
                actor="mesario"
                locked={state.settings.locked}
                onStart={actions.startMatch}
                onSave={actions.saveGroupScore}
                onReopen={actions.reopenMatch}
              />
            ))}
          </div>

          <aside className="xl:sticky xl:top-4 xl:self-start">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-xl font-black uppercase tracking-normal">Ranking parcial</h2>
              <RankingTable ranking={ranking} compact />
            </div>
          </aside>
        </section>
      </div>
    </main>
    </AdminGate>
  );
}
