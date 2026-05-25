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
    <main className="flex min-h-screen items-center justify-center bg-[#020403] px-4 text-white">
        <div className="max-w-md rounded-xl border border-white/10 bg-white/[0.055] p-6 text-center shadow-[0_0_34px_rgba(132,204,22,0.08)] backdrop-blur">
          <Brand dark compact />
          <h1 className="mt-6 text-2xl font-black uppercase">Quadra não encontrada</h1>
          <Link href="/" className="mt-4 inline-flex h-11 items-center justify-center rounded-md bg-lime-300 px-4 text-sm font-black uppercase text-slate-950">
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
    <main className="min-h-screen bg-[#020403] px-4 py-4 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(132,204,22,0.12),transparent_34%),radial-gradient(circle_at_88%_20%,rgba(245,197,66,0.10),transparent_28%)]" />
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-4">
        <header className="rounded-lg border border-white/10 bg-black/55 p-4 shadow-[0_0_34px_rgba(132,204,22,0.08)] backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Brand dark compact />
            <Link href="/" className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-4 text-sm font-black uppercase text-slate-200">
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

        <div className={`flex items-center gap-2 rounded-lg border p-3 text-sm font-black uppercase ${state.settings.locked ? "border-amber-300/30 bg-amber-300/10 text-amber-100" : "border-emerald-300/30 bg-emerald-400/10 text-emerald-100"}`}>
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
            <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4 shadow-[0_0_34px_rgba(132,204,22,0.08)]">
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
