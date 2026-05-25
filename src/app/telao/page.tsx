"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Activity, Crown, Maximize2, Medal, Radio, Trophy } from "lucide-react";
import { Brand } from "@/components/Brand";
import { CourtSponsorBackdrop, SponsorRibbon } from "@/components/Sponsors";
import {
  calculateGroupRanking,
  getBracketView,
  getMatchesByGroup,
  getPairName,
  getRecentResults,
  getTournamentProgress,
  getUpcomingMatches,
} from "@/lib/tournament/calculations";
import { getKnockoutMeta, getKnockoutStatusLabel, getKnockoutWinner, KNOCKOUT_STAGES } from "@/lib/tournament/knockout";
import { useTournamentStore } from "@/lib/tournament/store";
import { cn } from "@/lib/utils";

export default function ScreenPage() {
  const { state } = useTournamentStore();
  const [index, setIndex] = useState(0);
  const progress = getTournamentProgress(state);
  const group = state.groups[index % state.groups.length] ?? state.groups[0];
  const ranking = useMemo(() => calculateGroupRanking(state, group.id), [state, group.id]);
  const matches = getMatchesByGroup(state, group.id);
  const recent = getRecentResults(state, 4);
  const upcoming = getUpcomingMatches(state, 4);
  const finishedInGroup = matches.filter((match) => match.status === "finished").length;
  const bracket = getBracketView(state);
  const featuredKnockout =
    bracket.find((match) => match.status === "live") ??
    [...bracket].reverse().find((match) => match.status === "finished") ??
    bracket.find((match) => match.status === "pending");

  const enterFullscreen = () => {
    void document.documentElement.requestFullscreen?.();
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % Math.max(state.groups.length, 1));
    }, 10000);

    return () => window.clearInterval(timer);
  }, [state.groups.length]);

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-white screen-grid">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1600px] flex-col gap-4 rounded-xl border border-white/10 bg-white text-slate-950 shadow-broadcast">
        <header className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
          <Brand />
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-black uppercase text-white shadow-glow">
              <Radio className="h-4 w-4" aria-hidden="true" />
              Ao vivo
            </div>
            <div className="rounded-md bg-slate-950 px-4 py-2 text-sm font-black uppercase text-white">
              {progress.finished}/{progress.total} jogos concluídos
            </div>
            <button
              type="button"
              onClick={enterFullscreen}
              className="inline-flex items-center gap-2 rounded-md bg-lime-300 px-4 py-2 text-sm font-black uppercase text-slate-950"
            >
              <Maximize2 className="h-4 w-4" aria-hidden="true" />
              Tela cheia
            </button>
          </div>
        </header>

        <section className={`relative mx-5 overflow-hidden rounded-xl bg-gradient-to-r ${group.theme.gradient} p-5 text-white shadow-broadcast`}>
          <CourtSponsorBackdrop group={group} />
          <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-sm font-black uppercase opacity-80">{group.court}</div>
              <h1 className="mt-1 text-5xl font-black uppercase tracking-normal lg:text-7xl">{group.name}</h1>
              <div className="mt-2 text-lg font-bold opacity-90">Ranking ao vivo · Fase de grupos</div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <ScreenMetric label="Grupo" value={group.number.toString()} />
              <ScreenMetric label="Finalizados" value={`${finishedInGroup}/10`} />
              <ScreenMetric label="Saldo" value="Critério 2" />
            </div>
          </div>
        </section>

        <section className="grid min-h-0 flex-1 gap-4 px-5 pb-5 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="flex items-center gap-2 text-2xl font-black uppercase tracking-normal">
                <Medal className="h-7 w-7 text-amber-500" aria-hidden="true" />
                Classificação
              </h2>
            </div>
            <div className="p-4">
              <div className="grid gap-3">
                {ranking.map((row) => (
                  <div
                    key={row.pair.id}
                    className={cn(
                      "grid grid-cols-[56px_minmax(0,1fr)] items-center gap-3 rounded-lg border p-4 lg:grid-cols-[68px_minmax(0,1fr)_84px_84px_96px]",
                      row.classifying ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-slate-50",
                    )}
                  >
                    <div className={cn("flex h-14 w-14 items-center justify-center rounded-md text-3xl font-black", row.classifying ? "bg-emerald-600 text-white" : "bg-slate-950 text-white")}>
                      {row.position}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xl font-black uppercase leading-tight tracking-normal">{row.pair.name}</div>
                      {row.classifying && (
                        <div className="mt-1 inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-black uppercase text-white">
                          <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
                          Classificando
                        </div>
                      )}
                    </div>
                    <BigStat label="V" value={row.wins.toString()} />
                    <BigStat label="PF" value={row.pointsFor.toString()} />
                    <BigStat label="Saldo" value={`${row.balance > 0 ? "+" : ""}${row.balance}`} positive={row.balance >= 0} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="grid gap-4">
            {featuredKnockout && <ScreenKnockoutPanel state={state} match={featuredKnockout} />}

            <Panel title="Últimos resultados" icon={<Activity className="h-5 w-5" aria-hidden="true" />}>
              {recent.length === 0 ? (
                <EmptyState text="Aguardando primeiros resultados." />
              ) : (
                recent.map((match) => (
                  <ScreenMatch key={match.id} state={state} match={match} result />
                ))
              )}
            </Panel>

            <Panel title="Próximos jogos" icon={<Trophy className="h-5 w-5" aria-hidden="true" />}>
              {upcoming.length === 0 ? (
                <EmptyState text="Todos os jogos foram concluídos." />
              ) : (
                upcoming.map((match) => <ScreenMatch key={match.id} state={state} match={match} />)
              )}
            </Panel>
          </aside>
        </section>

        <SponsorRibbon className="mx-5 mb-5" dark />
      </div>
    </main>
  );
}

function ScreenMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-white/15 px-4 py-3">
      <div className="text-3xl font-black">{value}</div>
      <div className="text-xs font-black uppercase opacity-80">{label}</div>
    </div>
  );
}

function ScreenKnockoutPanel({
  state,
  match,
}: {
  state: ReturnType<typeof useTournamentStore>["state"];
  match: ReturnType<typeof getBracketView>[number];
}) {
  const meta = getKnockoutMeta(match.id);
  const stage = KNOCKOUT_STAGES[match.phase];
  const courtGroup = state.groups.find((group) => group.id === meta.courtGroupId) ?? state.groups[0];
  const winner = getKnockoutWinner(match, match.resolvedPairA, match.resolvedPairB);
  const live = match.status === "live";

  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${courtGroup.theme.gradient} p-4 text-white shadow-broadcast`}>
      <CourtSponsorBackdrop group={courtGroup} />
      <div className="absolute inset-0 bg-slate-950/55" />
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase text-white/80">
              <Crown className="h-4 w-4 text-amber-300" aria-hidden="true" />
              Mata-mata
            </div>
            <h2 className="mt-1 text-2xl font-black uppercase tracking-normal">{stage.title}</h2>
          </div>
          <div className={cn("rounded-md px-3 py-2 text-xs font-black uppercase", live ? "animate-pulse bg-red-600" : "bg-white text-slate-950")}>
            {getKnockoutStatusLabel(match.status)}
          </div>
        </div>

        <div className="mt-4 grid gap-2">
          <ScreenKnockoutTeam name={match.resolvedPairA?.name ?? match.labelA} score={match.scoreA ?? "-"} winner={match.winnerId === match.resolvedPairA?.id} />
          <div className="text-center text-2xl font-black italic text-white/80">VS</div>
          <ScreenKnockoutTeam name={match.resolvedPairB?.name ?? match.labelB} score={match.scoreB ?? "-"} winner={match.winnerId === match.resolvedPairB?.id} />
        </div>

        <div className="mt-3 grid gap-2 rounded-md bg-black/35 p-3 text-xs font-black uppercase">
          <div>{meta.code} · {courtGroup.court} · {meta.time}</div>
          <div>Vencedor: {winner?.name ?? "A definir"}</div>
        </div>
      </div>
    </div>
  );
}

function ScreenKnockoutTeam({ name, score, winner }: { name: string; score: number | string; winner: boolean }) {
  return (
    <div className={cn("grid grid-cols-[1fr_58px] items-center gap-2 rounded-lg border p-3", winner ? "border-lime-300 bg-lime-300/20" : "border-white/15 bg-black/30")}>
      <div className="min-w-0 text-base font-black uppercase leading-tight break-words">{name}</div>
      <div className={cn("flex h-12 items-center justify-center rounded-md text-3xl font-black", winner ? "bg-lime-300 text-slate-950" : "bg-white/10 text-white")}>
        {score}
      </div>
    </div>
  );
}

function BigStat({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <div className="rounded-md bg-white px-3 py-2 text-center shadow-sm">
      <div className={cn("text-3xl font-black", positive === undefined ? "text-slate-950" : positive ? "text-emerald-700" : "text-red-700")}>{value}</div>
      <div className="text-xs font-black uppercase text-slate-500">{label}</div>
    </div>
  );
}

function Panel({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 flex items-center gap-2 text-lg font-black uppercase tracking-normal text-slate-950">
        {icon}
        {title}
      </h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ScreenMatch({
  state,
  match,
  result = false,
}: {
  state: ReturnType<typeof useTournamentStore>["state"];
  match: ReturnType<typeof getMatchesByGroup>[number];
  result?: boolean;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between text-xs font-black uppercase text-slate-500">
        <span>Grupo {match.groupId.slice(1)} · Jogo {match.order}</span>
        <span>{result ? `${match.scoreA} x ${match.scoreB}` : match.status === "live" ? "Ao vivo" : "Pendente"}</span>
      </div>
      <div className="mt-1 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-sm font-black text-slate-950">
        <span className="truncate">{getPairName(state, match.pairAId)}</span>
        <span className="text-slate-400">x</span>
        <span className="truncate text-right">{getPairName(state, match.pairBId)}</span>
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="rounded-lg bg-slate-50 p-4 text-sm font-bold text-slate-500">{text}</div>;
}
