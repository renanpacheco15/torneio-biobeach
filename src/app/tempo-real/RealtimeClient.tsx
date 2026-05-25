"use client";

import { useEffect, useMemo, useState } from "react";
import { Expand, MapPin, Radio, Trophy } from "lucide-react";
import { Brand } from "@/components/Brand";
import { OfficialHeader } from "@/components/OfficialChrome";
import { CourtSponsorBackdrop } from "@/components/Sponsors";
import { getCourtSponsor } from "@/lib/sponsors";
import {
  calculateGroupRanking,
  getBracketView,
  getMatchesByGroup,
  type BracketViewMatch,
} from "@/lib/tournament/calculations";
import {
  getKnockoutMeta,
  getKnockoutRunnerUp,
  getKnockoutStatusLabel,
  getKnockoutWinner,
  KNOCKOUT_STAGES,
} from "@/lib/tournament/knockout";
import { useTournamentStore } from "@/lib/tournament/store";
import type { Group, KnockoutPhase, RankedPair, TournamentState } from "@/lib/tournament/types";
import { cn } from "@/lib/utils";

type RealtimePhase = "groups" | KnockoutPhase;

const phaseTabs: Array<{ id: RealtimePhase; label: string }> = [
  { id: "groups", label: "Fase de Grupos" },
  { id: "round16", label: "Oitavas" },
  { id: "quarterfinal", label: "Quartas" },
  { id: "semifinal", label: "Semifinais" },
  { id: "final", label: "Final" },
];

export default function RealtimeClient() {
  const { state } = useTournamentStore();
  const [activePhase, setActivePhase] = useState<RealtimePhase>("groups");

  const bracket = useMemo(() => getBracketView(state), [state]);
  const updatedAt = formatUpdatedAt(state.updatedAt);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#020403] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_16%_0%,rgba(132,204,22,0.16),transparent_34%),radial-gradient(circle_at_86%_14%,rgba(245,197,66,0.12),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.035),transparent_32%)]" />
      <OfficialHeader />

      <div className="relative z-10 mx-auto flex max-w-[1800px] flex-col gap-3 px-3 py-3 sm:px-5 lg:px-8 2xl:px-10">
        <section className="relative overflow-hidden rounded-2xl border border-lime-300/20 bg-white/[0.055] p-3 shadow-[0_0_70px_rgba(132,204,22,0.12)] backdrop-blur sm:p-4 xl:p-4">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(132,204,22,0.18),transparent_34%),linear-gradient(120deg,transparent,rgba(255,255,255,0.06),transparent)]" />
          <div className="relative z-10 grid gap-4 xl:grid-cols-[auto_1fr_auto] xl:items-center">
            <div className="hidden xl:block">
              <Brand dark compact />
            </div>

            <div className="text-center xl:text-left">
              <div className="inline-flex items-center gap-2 rounded-md border border-red-400/30 bg-red-500/10 px-3 py-1.5 text-[11px] font-black uppercase text-red-100">
                <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_14px_rgba(239,68,68,0.85)]" aria-hidden="true" />
                Atualização automática em tempo real
              </div>
              <h1 className="mt-2 text-4xl font-black uppercase leading-none text-white sm:text-5xl xl:text-5xl 2xl:text-6xl">
                Acompanhe em Tempo Real
              </h1>
              <p className="mx-auto mt-2 max-w-3xl text-sm font-bold text-slate-300 sm:text-base xl:mx-0 xl:text-lg">
                Grupos, confrontos e classificação atualizados durante o torneio.
              </p>
            </div>

            <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-black/35 p-3 text-center">
              <div className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">Arena sede</div>
              <div className="text-2xl font-black italic leading-none">
                <span className="text-[#62ccb5]">Arena</span> <span className="text-[#f6ae3f]">360</span>
              </div>
              <button
                type="button"
                onClick={requestFullScreen}
                className="mt-1 inline-flex h-10 items-center justify-center gap-2 rounded-md border border-lime-300/30 bg-lime-300/10 px-3 text-[11px] font-black uppercase text-lime-100 transition hover:bg-lime-300 hover:text-slate-950"
              >
                <Expand className="h-4 w-4" aria-hidden="true" />
                Tela cheia
              </button>
              <div className="text-[10px] font-bold text-slate-500">F11 para melhor visualização</div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-2 rounded-xl border border-white/10 bg-black/45 p-2.5 backdrop-blur xl:flex-row xl:items-center xl:justify-between">
          <div className="overflow-x-auto">
            <div className="flex min-w-max gap-2">
              {phaseTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActivePhase(tab.id)}
                  className={cn(
                    "h-11 rounded-md border px-4 text-xs font-black uppercase tracking-normal transition sm:px-5 xl:h-10 xl:text-sm",
                    activePhase === tab.id
                      ? "border-lime-300 bg-lime-300 text-slate-950 shadow-[0_0_26px_rgba(132,204,22,0.22)]"
                      : "border-white/10 bg-white/[0.045] text-slate-100 hover:border-lime-300/40 hover:text-lime-200",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase text-slate-400">
            <span className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-1.5">Atualizado automaticamente</span>
            <span className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-1.5">Última leitura: {updatedAt}</span>
          </div>
        </section>

        {activePhase === "groups" ? <GroupsPanel state={state} /> : <KnockoutPanel state={state} bracket={bracket} phase={activePhase} />}
      </div>
    </main>
  );
}

function GroupsPanel({ state }: { state: TournamentState }) {
  const [groupBlock, setGroupBlock] = useState(0);
  const blocks = useMemo(() => [state.groups.slice(0, 4), state.groups.slice(4, 8)], [state.groups]);
  const visibleGroups = blocks[groupBlock] ?? blocks[0];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setGroupBlock((current) => (current + 1) % blocks.length);
    }, 12000);

    return () => window.clearInterval(interval);
  }, [blocks.length]);

  return (
    <section className="grid gap-3">
      <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-black/35 p-2.5 backdrop-blur md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xs font-black uppercase text-lime-200">Fase de grupos no telão</div>
          <div className="mt-1 text-xs font-bold text-slate-300 xl:text-sm">
            Bloco {groupBlock + 1} de 2 · troca automática a cada 12s para manter leitura grande na TV.
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          {blocks.map((block, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setGroupBlock(index)}
              className={cn(
                "h-10 rounded-md border px-3 text-xs font-black uppercase transition xl:h-9",
                groupBlock === index
                  ? "border-lime-300 bg-lime-300 text-slate-950"
                  : "border-white/10 bg-white/[0.05] text-white hover:border-lime-300/40",
              )}
            >
              Grupos {block[0]?.number} a {block[block.length - 1]?.number}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {visibleGroups.map((group) => {
          const ranking = calculateGroupRanking(state, group.id);
          const matches = getMatchesByGroup(state, group.id);
          const finished = matches.filter((match) => match.status === "finished").length;
          const live = matches.filter((match) => match.status === "live").length;
          const finalized = finished === matches.length;

          return <GroupRealtimeCard key={group.id} group={group} ranking={ranking} finished={finished} live={live} finalized={finalized} />;
        })}
      </div>
    </section>
  );
}

function GroupRealtimeCard({
  group,
  ranking,
  finished,
  live,
  finalized,
}: {
  group: Group;
  ranking: RankedPair[];
  finished: number;
  live: number;
  finalized: boolean;
}) {
  const sponsor = getCourtSponsor(group.id);

  return (
    <article
      className="relative min-h-[25rem] overflow-hidden rounded-xl border bg-slate-950 p-3 shadow-[0_0_34px_rgba(255,255,255,0.045)] xl:min-h-0 xl:p-2"
      style={{
        borderColor: `${group.theme.accent}66`,
        boxShadow: `0 0 44px ${group.theme.accent}24`,
      }}
    >
      <CourtSponsorBackdrop group={group} className="opacity-80" />
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${group.theme.gradient} opacity-40`} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.18),transparent_30%),linear-gradient(180deg,rgba(2,6,23,0.04),rgba(2,6,23,0.90))]" />

      <div className="relative z-10 flex h-full flex-col gap-3 xl:gap-2">
        <div className="flex items-start justify-between gap-3 xl:gap-2">
          <div className="min-w-0">
            <div
              className="inline-flex rounded-md border px-2.5 py-1 text-[11px] font-black uppercase xl:px-2 xl:py-0.5 xl:text-[9px]"
              style={{
                borderColor: `${group.theme.accent}80`,
                backgroundColor: `${group.theme.accent}24`,
                color: group.theme.soft,
              }}
            >
              Grupo {group.number} · {group.court}
            </div>
            <h2 className="mt-2 break-words text-2xl font-black uppercase leading-none text-white drop-shadow-[0_0_16px_rgba(0,0,0,0.55)] xl:mt-1 xl:text-xl 2xl:text-2xl">
              {group.shortName}
            </h2>
            <div
              className="mt-2 inline-flex max-w-full rounded-md border bg-black/45 px-2.5 py-1 text-[11px] font-black uppercase backdrop-blur xl:mt-1 xl:px-2 xl:py-0.5 xl:text-[9px]"
              style={{ borderColor: `${group.theme.accent}55`, color: group.theme.soft }}
            >
              {sponsor.name}
            </div>
          </div>
          <div className="text-right">
            <StatusPill live={live > 0} label={live > 0 ? "AO VIVO" : finalized ? "GRUPO FINALIZADO" : `${finished}/10 JOGOS`} />
          </div>
        </div>

        <div className="grid flex-1 gap-2 xl:gap-1.5">
          {ranking.map((row) => (
            <GroupRankLine key={row.pair.id} row={row} />
          ))}
        </div>
      </div>
    </article>
  );
}

function GroupRankLine({ row }: { row: RankedPair }) {
  return (
    <div
      className={cn(
        "rounded-lg border p-2.5 xl:grid xl:grid-cols-[auto_minmax(0,1fr)_auto] xl:items-center xl:gap-1.5 xl:p-1",
        row.classifying ? "border-lime-300/45 bg-lime-300/10 shadow-[0_0_20px_rgba(132,204,22,0.08)]" : "border-white/10 bg-black/30",
      )}
    >
      <div className="grid grid-cols-[auto_1fr] gap-2 xl:contents">
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-md text-base font-black xl:h-6 xl:w-6 xl:text-[10px]", row.classifying ? "bg-lime-300 text-slate-950" : "bg-white/10 text-white")}>
          {row.position}º
        </div>
        <div className="min-w-0">
          <div className="break-words text-sm font-black uppercase leading-tight text-white xl:text-[10px] 2xl:text-xs">{row.pair.name}</div>
          <div className="mt-1 xl:hidden">
            <span className={cn("rounded-md px-2 py-0.5 text-[9px] font-black uppercase xl:px-1.5 xl:text-[8px]", row.classifying ? "bg-lime-300 text-slate-950" : "bg-white/10 text-slate-300")}>
              {row.classifying ? "Classificando" : "Em disputa"}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-5 gap-1 text-center xl:mt-0 xl:w-[112px] xl:gap-0.5">
        <TinyStat label="J" value={row.played} />
        <TinyStat label="V" value={row.wins} good />
        <TinyStat label="PF" value={row.pointsFor} />
        <TinyStat label="PC" value={row.pointsAgainst} />
        <TinyStat label="S" value={`${row.balance > 0 ? "+" : ""}${row.balance}`} good={row.balance >= 0} bad={row.balance < 0} />
      </div>
    </div>
  );
}

function KnockoutPanel({
  state,
  bracket,
  phase,
}: {
  state: TournamentState;
  bracket: BracketViewMatch[];
  phase: KnockoutPhase;
}) {
  const matches = bracket.filter((match) => match.phase === phase);
  const config = KNOCKOUT_STAGES[phase];

  if (phase === "final") {
    return <FinalRealtimeCard state={state} match={matches[0]} />;
  }

  return (
    <section>
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <div className="text-xs font-black uppercase text-lime-200">{config.eyebrow}</div>
          <h2 className="mt-1 text-4xl font-black uppercase leading-none text-white sm:text-5xl">{config.title}</h2>
        </div>
        <div className="hidden rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-black uppercase text-slate-300 sm:block">
          {matches.length} confrontos
        </div>
      </div>

      <div className={cn("grid gap-3", phase === "round16" ? "xl:grid-cols-4" : phase === "quarterfinal" ? "lg:grid-cols-2 xl:grid-cols-4" : "lg:grid-cols-2")}>
        {matches.map((match) => (
          <MatchRealtimeCard key={match.id} state={state} match={match} featured={phase === "semifinal"} />
        ))}
      </div>
    </section>
  );
}

function MatchRealtimeCard({ state, match, featured = false }: { state: TournamentState; match: BracketViewMatch; featured?: boolean }) {
  const meta = getKnockoutMeta(match.id);
  const courtGroup = state.groups.find((group) => group.id === meta.courtGroupId) ?? state.groups[0];
  const winner = getKnockoutWinner(match, match.resolvedPairA, match.resolvedPairB);
  const status = getKnockoutStatusLabel(match.status);
  const live = match.status === "live";

  return (
    <article
      className={cn(
        "relative min-h-[22rem] overflow-hidden rounded-xl border border-white/10 bg-slate-950 p-4 shadow-[0_0_34px_rgba(255,255,255,0.045)]",
        featured && "min-h-[27rem] border-cyan-300/25 shadow-[0_0_52px_rgba(34,211,238,0.10)]",
      )}
    >
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${courtGroup.theme.gradient} opacity-24`} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.18),transparent_30%),linear-gradient(180deg,rgba(2,6,23,0.10),rgba(2,6,23,0.91))]" />

      <div className="relative z-10 flex h-full flex-col justify-between gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-black uppercase text-white/60">{meta.detail}</div>
            <h2 className="mt-1 text-2xl font-black uppercase leading-tight text-white 2xl:text-3xl">{meta.code}</h2>
          </div>
          <StatusPill live={live} label={status} />
        </div>

        {featured && <div className="rounded-md border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-center text-xs font-black uppercase text-cyan-100">Valendo vaga na final</div>}

        <div className="grid gap-3">
          <ScoreLine name={match.resolvedPairA?.name ?? match.labelA} score={match.scoreA ?? "-"} winner={winner?.id === match.resolvedPairA?.id} />
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/15" />
            <div className="text-4xl font-black italic text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.20)]">VS</div>
            <div className="h-px flex-1 bg-white/15" />
          </div>
          <ScoreLine name={match.resolvedPairB?.name ?? match.labelB} score={match.scoreB ?? "-"} winner={winner?.id === match.resolvedPairB?.id} />
        </div>

        <div className="grid gap-2 text-xs font-black uppercase text-slate-300 sm:grid-cols-2">
          <MetaBox label="Quadra" value={courtGroup.court} />
          <MetaBox label="Vencedor" value={winner?.name ?? "A definir"} />
        </div>
      </div>
    </article>
  );
}

function FinalRealtimeCard({ state, match }: { state: TournamentState; match?: BracketViewMatch }) {
  const finalMatch = match;
  const meta = finalMatch ? getKnockoutMeta(finalMatch.id) : undefined;
  const courtGroup = meta ? state.groups.find((group) => group.id === meta.courtGroupId) ?? state.groups[0] : state.groups[0];
  const winner = finalMatch ? getKnockoutWinner(finalMatch, finalMatch.resolvedPairA, finalMatch.resolvedPairB) : undefined;
  const runnerUp = finalMatch ? getKnockoutRunnerUp(finalMatch, finalMatch.resolvedPairA, finalMatch.resolvedPairB) : undefined;
  const live = finalMatch?.status === "live";

  return (
    <section className="relative mx-auto min-h-[34rem] w-full max-w-6xl overflow-hidden rounded-2xl border border-amber-300/30 bg-slate-950 p-5 shadow-[0_0_90px_rgba(245,197,66,0.18)] sm:p-7 xl:p-9">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,197,66,0.26),transparent_34%),linear-gradient(135deg,rgba(245,197,66,0.16),transparent_30%),linear-gradient(180deg,rgba(2,6,23,0.06),rgba(2,6,23,0.90))]" />
      <div className="relative z-10 grid gap-6">
        <div className="flex flex-col gap-3 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
          <div>
            <div className="inline-flex rounded-md bg-amber-300 px-3 py-2 text-xs font-black uppercase text-slate-950">Evento principal</div>
            <h2 className="mt-4 text-5xl font-black uppercase leading-none text-white sm:text-6xl xl:text-7xl">Grande Final</h2>
            <p className="mt-2 text-sm font-black uppercase text-amber-100">{courtGroup.court} · {courtGroup.sponsor}</p>
          </div>
          <StatusPill live={live} label={finalMatch ? getKnockoutStatusLabel(finalMatch.status) : "AGUARDANDO"} />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <FinalTeamPanel name={finalMatch?.resolvedPairA?.name ?? finalMatch?.labelA ?? "A definir"} score={finalMatch?.scoreA ?? "-"} winner={winner?.id === finalMatch?.resolvedPairA?.id} />
          <div className="hidden text-center lg:block">
            <div className="text-7xl font-black italic text-white drop-shadow-[0_0_26px_rgba(245,197,66,0.32)]">VS</div>
          </div>
          <FinalTeamPanel name={finalMatch?.resolvedPairB?.name ?? finalMatch?.labelB ?? "A definir"} score={finalMatch?.scoreB ?? "-"} winner={winner?.id === finalMatch?.resolvedPairB?.id} />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <Podium label="Campeão" name={winner?.name ?? "A definir"} champion />
          <Podium label="Vice-campeão" name={runnerUp?.name ?? "A definir"} />
        </div>
      </div>
    </section>
  );
}

function ScoreLine({ name, score, winner }: { name: string; score: number | string; winner: boolean }) {
  return (
    <div className={cn("grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl border p-3", winner ? "border-lime-300/70 bg-lime-300/15" : "border-white/10 bg-black/35")}>
      <div className="min-w-0 break-words text-xl font-black uppercase leading-tight text-white 2xl:text-2xl">{name}</div>
      <div className={cn("flex h-16 min-w-16 items-center justify-center rounded-md px-4 text-4xl font-black", winner ? "bg-lime-300 text-slate-950" : "bg-white/10 text-white")}>{score}</div>
    </div>
  );
}

function FinalTeamPanel({ name, score, winner }: { name: string; score: number | string; winner: boolean }) {
  return (
    <div className={cn("rounded-xl border p-4", winner ? "border-amber-300 bg-amber-300/15" : "border-white/10 bg-black/35")}>
      <div className="text-xs font-black uppercase text-white/60">{winner ? "Vencedor" : "Finalista"}</div>
      <div className="mt-2 min-h-20 break-words text-3xl font-black uppercase leading-tight text-white xl:text-4xl">{name}</div>
      <div className={cn("mt-5 flex h-28 items-center justify-center rounded-lg text-7xl font-black", winner ? "bg-amber-300 text-slate-950" : "bg-white/10 text-white")}>{score}</div>
    </div>
  );
}

function Podium({ label, name, champion = false }: { label: string; name: string; champion?: boolean }) {
  return (
    <div className={cn("rounded-xl border p-4", champion ? "border-amber-300/50 bg-amber-300/15" : "border-white/15 bg-white/10")}>
      <div className={cn("text-xs font-black uppercase", champion ? "text-amber-200" : "text-slate-300")}>{label}</div>
      <div className="mt-2 break-words text-3xl font-black uppercase leading-tight text-white">{name}</div>
    </div>
  );
}

function TinyStat({ label, value, good = false, bad = false }: { label: string; value: number | string; good?: boolean; bad?: boolean }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.045] px-1.5 py-1.5 xl:px-0.5 xl:py-0.5">
      <div className={cn("text-sm font-black leading-none xl:text-[10px]", good ? "text-lime-300" : bad ? "text-red-200" : "text-white")}>{value}</div>
      <div className="text-[9px] font-black uppercase leading-none text-slate-500 xl:text-[7px]">{label}</div>
    </div>
  );
}

function MetaBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/30 p-3 xl:p-2">
      <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
        {label === "Quadra" ? <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> : <Trophy className="h-3.5 w-3.5" aria-hidden="true" />}
        {label}
      </div>
      <div className="mt-1 break-words text-sm font-black uppercase text-white">{value}</div>
    </div>
  );
}

function StatusPill({ live, label }: { live: boolean; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex min-h-9 items-center justify-center gap-2 rounded-md px-3 py-1.5 text-[10px] font-black uppercase ring-1 xl:min-h-7 xl:px-2 xl:py-1 xl:text-[8px]",
        live
          ? "animate-pulse bg-red-600 text-white ring-red-300/70 shadow-[0_0_24px_rgba(220,38,38,0.36)]"
          : label.includes("FINALIZADO")
            ? "bg-lime-300 text-slate-950 ring-lime-200/60"
            : "bg-white/10 text-white ring-white/15",
      )}
    >
      {live && <Radio className="h-4 w-4" aria-hidden="true" />}
      {label}
    </span>
  );
}

function requestFullScreen() {
  if (typeof document === "undefined") return;
  document.documentElement.requestFullscreen?.();
}

function formatUpdatedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--:--";
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
