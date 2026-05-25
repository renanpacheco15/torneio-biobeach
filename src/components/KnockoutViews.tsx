"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Clock3, Crown, MapPin, Radio, Shield, Sparkles, Trophy } from "lucide-react";
import { CourtSponsorBackdrop } from "@/components/Sponsors";
import { OfficialHeader, PremiumFooter } from "@/components/OfficialChrome";
import { getBracketView, type BracketViewMatch } from "@/lib/tournament/calculations";
import {
  getKnockoutMeta,
  getKnockoutRunnerUp,
  getKnockoutStatusLabel,
  getKnockoutWinner,
  KNOCKOUT_STAGES,
} from "@/lib/tournament/knockout";
import { getCourtSponsor } from "@/lib/sponsors";
import { useTournamentStore } from "@/lib/tournament/store";
import type { KnockoutPhase, TournamentState } from "@/lib/tournament/types";
import { cn } from "@/lib/utils";

const phaseOrder: KnockoutPhase[] = ["round16", "quarterfinal", "semifinal", "final"];

type KnockoutStagePageProps = {
  phase: KnockoutPhase;
};

export function KnockoutStagePage({ phase }: KnockoutStagePageProps) {
  const { state } = useTournamentStore();
  const config = KNOCKOUT_STAGES[phase];
  const matches = getBracketView(state).filter((match) => match.phase === phase);
  const finalMatch = phase === "final" ? matches[0] : undefined;

  return (
    <KnockoutShell>
      <StageHero config={config} />
      <StageNav activePhase={phase} />

      {phase === "final" && finalMatch ? (
        <FinalShowcase state={state} match={finalMatch} />
      ) : (
        <section className="grid gap-4 lg:grid-cols-2">
          {matches.map((match) => (
            <KnockoutMatchCard key={match.id} state={state} match={match} featured={phase === "semifinal"} />
          ))}
        </section>
      )}

    </KnockoutShell>
  );
}

export function KnockoutHubPage() {
  const { state } = useTournamentStore();
  const bracket = getBracketView(state);
  const finalMatch = bracket.find((match) => match.phase === "final");

  return (
    <KnockoutShell>
      <section className="relative overflow-hidden rounded-xl border border-lime-300/20 bg-white/[0.045] p-5 shadow-[0_0_70px_rgba(132,204,22,0.12)] sm:p-7 lg:p-9">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(132,204,22,0.20),transparent_34%),radial-gradient(circle_at_82%_12%,rgba(245,197,66,0.18),transparent_30%)]" />
        <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md border border-lime-300/25 bg-lime-300/10 px-3 py-2 text-xs font-black uppercase text-lime-200">
              <Shield className="h-4 w-4" aria-hidden="true" />
              Mata-mata oficial
            </div>
            <h1 className="mt-5 text-5xl font-black uppercase leading-[0.9] text-white sm:text-6xl lg:text-7xl">
              Caminho até a final
            </h1>
            <p className="mt-4 max-w-2xl text-base font-bold leading-7 text-slate-300">
              Quartas, semifinais e grande final com classificados, status, placares e vencedores em tempo real.
            </p>
          </div>

          {finalMatch && <ChampionSummary match={finalMatch} />}
        </div>
      </section>

      <StageNav />

      <div className="grid gap-5">
        {phaseOrder.map((phase) => {
          const config = KNOCKOUT_STAGES[phase];
          const matches = bracket.filter((match) => match.phase === phase);

          return (
            <section key={phase} className="rounded-xl border border-white/10 bg-white/[0.035] p-4 shadow-[0_0_42px_rgba(255,255,255,0.04)] sm:p-5">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="text-xs font-black uppercase text-lime-200">{config.eyebrow}</div>
                  <h2 className="mt-1 text-3xl font-black uppercase text-white">{config.title}</h2>
                </div>
                <Link
                  href={config.route}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-lime-300/30 bg-lime-300/10 px-4 text-xs font-black uppercase text-lime-200 transition hover:bg-lime-300 hover:text-slate-950 sm:w-auto"
                >
                  Abrir fase
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              <div className={cn("grid gap-4", phase === "final" ? "lg:grid-cols-1" : "lg:grid-cols-2")}>
                {matches.map((match) =>
                  phase === "final" ? (
                    <FinalShowcase key={match.id} state={state} match={match} compact />
                  ) : (
                    <KnockoutMatchCard key={match.id} state={state} match={match} />
                  ),
                )}
              </div>
            </section>
          );
        })}
      </div>

    </KnockoutShell>
  );
}

function KnockoutShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#020403] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(132,204,22,0.12),transparent_34%),radial-gradient(circle_at_92%_12%,rgba(245,197,66,0.12),transparent_26%)]" />
      <OfficialHeader />
      <div className="relative z-10 mx-auto flex max-w-[1440px] flex-col gap-6 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        {children}
      </div>
      <PremiumFooter />
    </main>
  );
}

function StageHero({ config }: { config: (typeof KNOCKOUT_STAGES)[KnockoutPhase] }) {
  const tone =
    config.accent === "amber"
      ? "from-amber-300/25 via-white/[0.05] to-yellow-500/10 border-amber-300/25 text-amber-200"
      : config.accent === "cyan"
        ? "from-cyan-300/20 via-white/[0.05] to-lime-300/10 border-cyan-300/25 text-cyan-100"
        : "from-lime-300/20 via-white/[0.05] to-emerald-300/10 border-lime-300/25 text-lime-200";

  return (
    <section className={`relative overflow-hidden rounded-xl border bg-gradient-to-br p-5 shadow-[0_0_70px_rgba(132,204,22,0.10)] sm:p-7 lg:p-9 ${tone}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.16),transparent_32%),linear-gradient(120deg,transparent,rgba(255,255,255,0.08),transparent)]" />
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 rounded-md border border-current/30 bg-black/25 px-3 py-2 text-xs font-black uppercase">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          {config.eyebrow}
        </div>
        <h1 className="mt-5 text-5xl font-black uppercase leading-[0.9] text-white sm:text-6xl lg:text-7xl">{config.title}</h1>
        <p className="mt-4 max-w-2xl text-base font-bold leading-7 text-slate-200">{config.subtitle}</p>
        <div className="mt-5 inline-flex rounded-md bg-white px-4 py-2 text-sm font-black uppercase text-slate-950 shadow-[0_0_32px_rgba(255,255,255,0.16)]">
          {config.cta}
        </div>
      </div>
    </section>
  );
}

function StageNav({ activePhase }: { activePhase?: KnockoutPhase }) {
  return (
    <nav className="grid gap-2 sm:grid-cols-4">
      {phaseOrder.map((phase) => {
        const config = KNOCKOUT_STAGES[phase];
        const active = activePhase === phase;
        return (
          <Link
            key={phase}
            href={config.route}
            className={cn(
              "rounded-lg border p-4 text-center transition",
              active
                ? "border-lime-300/60 bg-lime-300 text-slate-950 shadow-[0_0_34px_rgba(132,204,22,0.24)]"
                : "border-white/10 bg-white/[0.045] text-white hover:border-lime-300/40",
            )}
          >
            <div className="text-xs font-black uppercase opacity-70">Fase</div>
            <div className="mt-1 text-sm font-black uppercase leading-tight sm:text-base">{config.shortTitle}</div>
          </Link>
        );
      })}
    </nav>
  );
}

function KnockoutMatchCard({ state, match, featured = false }: { state: TournamentState; match: BracketViewMatch; featured?: boolean }) {
  const meta = getKnockoutMeta(match.id);
  const courtGroup = state.groups.find((group) => group.id === meta.courtGroupId) ?? state.groups[0];
  const sponsor = getCourtSponsor(courtGroup.id);
  const winner = getKnockoutWinner(match, match.resolvedPairA, match.resolvedPairB);
  const status = getKnockoutStatusLabel(match.status);
  const isLive = match.status === "live";

  return (
    <article
      id={match.id}
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/10 bg-slate-950/80 p-4 shadow-[0_0_42px_rgba(255,255,255,0.05)] sm:p-5",
        featured && "border-cyan-300/25 shadow-[0_0_52px_rgba(34,211,238,0.10)]",
      )}
    >
      <CourtSponsorBackdrop group={courtGroup} />
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${courtGroup.theme.gradient} opacity-25`} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.20),transparent_30%),linear-gradient(180deg,rgba(2,6,23,0.18),rgba(2,6,23,0.86))]" />

      <div className="relative z-10 flex min-h-[320px] flex-col justify-between gap-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-xs font-black uppercase text-white/70">{meta.detail}</div>
            <h2 className="mt-1 text-xl font-black uppercase leading-tight text-white sm:text-2xl">{meta.code}</h2>
          </div>
          <StatusBadge status={status} live={isLive} />
        </div>

        {featured && (
          <div className="rounded-md border border-white/10 bg-white/10 px-3 py-2 text-center text-xs font-black uppercase text-cyan-100 backdrop-blur">
            Valendo vaga na final
          </div>
        )}

        <VersusBlock match={match} />

        <div className="grid gap-2 text-sm font-bold text-white/80 sm:grid-cols-3">
          <MetaPill icon={<MapPin className="h-4 w-4" aria-hidden="true" />} label={courtGroup.court} value={sponsor.name} />
          <MetaPill icon={<Clock3 className="h-4 w-4" aria-hidden="true" />} label="Horário" value={meta.time} />
          <MetaPill icon={<Trophy className="h-4 w-4" aria-hidden="true" />} label="Vencedor" value={winner?.name ?? "A definir"} />
        </div>

        <Link
          href={`/mata-mata#${match.id}`}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md border border-white/15 bg-white text-sm font-black uppercase text-slate-950 transition hover:-translate-y-0.5"
        >
          Ver detalhes
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

function VersusBlock({ match }: { match: BracketViewMatch }) {
  const scoreA = match.scoreA ?? "-";
  const scoreB = match.scoreB ?? "-";
  const winnerId = match.winnerId;

  return (
    <div className="grid gap-3">
      <TeamLine name={match.resolvedPairA?.name ?? match.labelA} score={scoreA} active={winnerId === match.resolvedPairA?.id} />
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-white/15" />
        <div className="text-4xl font-black uppercase italic text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.20)]">VS</div>
        <div className="h-px flex-1 bg-white/15" />
      </div>
      <TeamLine name={match.resolvedPairB?.name ?? match.labelB} score={scoreB} active={winnerId === match.resolvedPairB?.id} />
    </div>
  );
}

function TeamLine({ name, score, active }: { name: string; score: number | string; active: boolean }) {
  return (
    <div className={cn("grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg border p-3", active ? "border-lime-300/70 bg-lime-300/15" : "border-white/10 bg-black/30")}>
      <div className="min-w-0 text-xl font-black uppercase leading-snug text-white break-words">{name}</div>
      <div className={cn("flex h-16 min-w-16 items-center justify-center rounded-md px-4 text-4xl font-black", active ? "bg-lime-300 text-slate-950" : "bg-white/10 text-white")}>
        {score}
      </div>
    </div>
  );
}

function MetaPill({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/30 p-3 backdrop-blur">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase text-white/55">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-sm font-black uppercase leading-snug text-white break-words">{value}</div>
    </div>
  );
}

function StatusBadge({ status, live }: { status: string; live: boolean }) {
  return (
    <div
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md px-3 text-xs font-black uppercase ring-1",
        live
          ? "animate-pulse bg-red-600 text-white ring-red-300/60 shadow-[0_0_24px_rgba(220,38,38,0.35)]"
          : status === "FINALIZADO"
            ? "bg-lime-300 text-slate-950 ring-lime-200/60"
            : "bg-white/10 text-white ring-white/20",
      )}
    >
      {live && <Radio className="h-4 w-4" aria-hidden="true" />}
      {status}
    </div>
  );
}

function FinalShowcase({ state, match, compact = false }: { state: TournamentState; match: BracketViewMatch; compact?: boolean }) {
  const meta = getKnockoutMeta(match.id);
  const courtGroup = state.groups.find((group) => group.id === meta.courtGroupId) ?? state.groups[0];
  const winner = getKnockoutWinner(match, match.resolvedPairA, match.resolvedPairB);
  const runnerUp = getKnockoutRunnerUp(match, match.resolvedPairA, match.resolvedPairB);

  return (
    <section className="relative overflow-hidden rounded-xl border border-amber-300/25 bg-slate-950 p-4 shadow-[0_0_80px_rgba(245,197,66,0.14)] sm:p-6 lg:p-8">
      <CourtSponsorBackdrop group={courtGroup} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,197,66,0.24),transparent_34%),linear-gradient(135deg,rgba(245,197,66,0.14),transparent_30%),linear-gradient(180deg,rgba(2,6,23,0.06),rgba(2,6,23,0.88))]" />

      <div className="relative z-10 grid gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md bg-amber-300 px-3 py-2 text-xs font-black uppercase text-slate-950">
              <Crown className="h-4 w-4" aria-hidden="true" />
              Grande Final
            </div>
            <h2 className="mt-4 text-4xl font-black uppercase leading-none text-white sm:text-5xl lg:text-6xl">Valendo o título</h2>
            <p className="mt-3 text-sm font-bold uppercase text-amber-100">{meta.detail} · {courtGroup.court}</p>
          </div>
          <StatusBadge status={getKnockoutStatusLabel(match.status)} live={match.status === "live"} />
        </div>

        <div className={cn("grid gap-4", compact ? "lg:grid-cols-[1fr]" : "lg:grid-cols-[1fr_220px_1fr] lg:items-center")}>
          <FinalTeam name={match.resolvedPairA?.name ?? match.labelA} score={match.scoreA ?? "-"} winner={match.winnerId === match.resolvedPairA?.id} />
          {!compact && (
            <div className="hidden text-center lg:block">
              <div className="text-7xl font-black italic text-white drop-shadow-[0_0_26px_rgba(245,197,66,0.32)]">VS</div>
            </div>
          )}
          <FinalTeam name={match.resolvedPairB?.name ?? match.labelB} score={match.scoreB ?? "-"} winner={match.winnerId === match.resolvedPairB?.id} />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <PodiumPanel title="Campeão do torneio" name={winner?.name ?? "A definir"} tone="champion" />
          <PodiumPanel title="Vice-campeão" name={runnerUp?.name ?? "A definir"} tone="runnerUp" />
        </div>
      </div>
    </section>
  );
}

function FinalTeam({ name, score, winner }: { name: string; score: number | string; winner: boolean }) {
  return (
    <div className={cn("rounded-xl border p-4", winner ? "border-amber-300 bg-amber-300/15" : "border-white/10 bg-black/35")}>
      <div className="text-xs font-black uppercase text-white/60">{winner ? "Vencedor" : "Finalista"}</div>
      <div className="mt-2 text-2xl font-black uppercase leading-tight text-white break-words">{name}</div>
      <div className={cn("mt-4 flex h-24 items-center justify-center rounded-lg text-6xl font-black", winner ? "bg-amber-300 text-slate-950" : "bg-white/10 text-white")}>
        {score}
      </div>
    </div>
  );
}

function PodiumPanel({ title, name, tone }: { title: string; name: string; tone: "champion" | "runnerUp" }) {
  return (
    <div className={cn("rounded-xl border p-4", tone === "champion" ? "border-amber-300/50 bg-amber-300/15" : "border-white/15 bg-white/10")}>
      <div className={cn("text-xs font-black uppercase", tone === "champion" ? "text-amber-200" : "text-slate-300")}>{title}</div>
      <div className="mt-2 text-2xl font-black uppercase leading-tight text-white break-words">{name}</div>
    </div>
  );
}

function ChampionSummary({ match }: { match: BracketViewMatch }) {
  const winner = getKnockoutWinner(match, match.resolvedPairA, match.resolvedPairB);

  return (
    <div className="rounded-xl border border-amber-300/30 bg-amber-300/10 p-4 text-center shadow-[0_0_30px_rgba(245,197,66,0.12)]">
      <div className="text-xs font-black uppercase text-amber-200">Campeão</div>
      <div className="mt-1 max-w-sm text-2xl font-black uppercase leading-tight text-white break-words">{winner?.name ?? "A definir"}</div>
    </div>
  );
}
