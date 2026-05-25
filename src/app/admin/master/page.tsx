"use client";

import Link from "next/link";
import { ChangeEvent, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  Download,
  FileUp,
  Lock,
  RotateCcw,
  Save,
  ShieldCheck,
  Trophy,
  Unlock,
} from "lucide-react";
import { AdminGate } from "@/components/AdminGate";
import { Brand } from "@/components/Brand";
import { MatchRow } from "@/components/MatchRow";
import { OverallRankingTable } from "@/components/OverallRankingTable";
import { RankingTable } from "@/components/RankingTable";
import { COURTS, getCourtStatusLabel } from "@/lib/courts";
import {
  calculateGroupRanking,
  calculateOverallRanking,
  getBracketView,
  getMatchesByGroup,
  getPairName,
  getQualifiedPairs,
  getRecentResults,
  getTournamentProgress,
  getUpcomingMatches,
} from "@/lib/tournament/calculations";
import { getKnockoutMeta, getKnockoutStatusLabel, KNOCKOUT_STAGES } from "@/lib/tournament/knockout";
import { useTournamentStore } from "@/lib/tournament/store";
import type { CourtStatus, GroupId, Pair, TournamentState } from "@/lib/tournament/types";
import { formatDateTime } from "@/lib/utils";

export default function MasterAdminPage() {
  return (
    <AdminGate allowedRoles={["admin"]} title="Painel do administrador">
      <MasterAdminContent />
    </AdminGate>
  );
}

function MasterAdminContent() {
  const { state, actions } = useTournamentStore();
  const [importError, setImportError] = useState<string | null>(null);
  const progress = getTournamentProgress(state);
  const qualified = getQualifiedPairs(state);
  const liveMatches = state.groupMatches.filter((match) => match.status === "live");
  const recentResults = getRecentResults(state, 5);
  const upcoming = getUpcomingMatches(state, 5);
  const bracket = getBracketView(state);
  const overallRanking = calculateOverallRanking(state);

  const exportBackup = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `biobeach-backup-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const importBackup = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const raw = await file.text();
      actions.importBackup(JSON.parse(raw) as TournamentState);
      setImportError(null);
      event.target.value = "";
    } catch {
      setImportError("Não foi possível importar este arquivo.");
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#020403] px-4 py-4 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(132,204,22,0.14),transparent_34%),radial-gradient(circle_at_88%_14%,rgba(245,197,66,0.12),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.035),transparent_32%)]" />
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-4">
        <header className="overflow-hidden rounded-xl border border-white/10 bg-black/70 p-4 shadow-[0_0_54px_rgba(132,204,22,0.10)] backdrop-blur">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Brand dark compact />
              <div className="h-px w-full bg-white/10 sm:h-10 sm:w-px" />
              <div>
                <div className="inline-flex rounded-md border border-lime-300/25 bg-lime-300/10 px-2.5 py-1 text-[10px] font-black uppercase text-lime-200">
                  Operação central
                </div>
                <h1 className="mt-2 text-2xl font-black uppercase leading-none text-white sm:text-3xl">Painel do administrador</h1>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5 xl:min-w-[720px]">
              <Link href="/" className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.055] px-4 text-xs font-black uppercase text-slate-200 transition hover:border-lime-300/40 hover:text-lime-200">
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                Início
              </Link>
              <button
                type="button"
                onClick={() => actions.setLocked(!state.settings.locked)}
                className={`inline-flex h-12 items-center justify-center gap-2 rounded-md px-4 text-xs font-black uppercase text-white shadow-[0_0_22px_rgba(255,255,255,0.06)] transition hover:-translate-y-0.5 ${state.settings.locked ? "bg-emerald-600" : "bg-amber-600"}`}
              >
                {state.settings.locked ? <Unlock className="h-4 w-4" aria-hidden="true" /> : <Lock className="h-4 w-4" aria-hidden="true" />}
                {state.settings.locked ? "Destravar" : "Travar"}
              </button>
              <button
                type="button"
                onClick={exportBackup}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-lime-300 px-4 text-xs font-black uppercase text-slate-950 shadow-[0_0_26px_rgba(190,242,100,0.18)] transition hover:-translate-y-0.5"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Exportar
              </button>
              <label className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-md border border-cyan-300/30 bg-cyan-300/10 px-4 text-xs font-black uppercase text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.10)] transition hover:-translate-y-0.5 hover:border-cyan-300/60">
                <FileUp className="h-4 w-4" aria-hidden="true" />
                Importar
                <input type="file" accept="application/json" onChange={importBackup} className="sr-only" />
              </label>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Resetar todos os resultados do torneio?")) actions.resetResults();
                }}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-red-400/30 bg-red-500/15 px-4 text-xs font-black uppercase text-red-100 shadow-[0_0_24px_rgba(239,68,68,0.10)] transition hover:-translate-y-0.5 hover:bg-red-500/25"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Resetar
              </button>
            </div>
          </div>
          {importError && <div className="mt-3 rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm font-bold text-red-100">{importError}</div>}
        </header>

        <section className="grid gap-3 md:grid-cols-4">
          <MetricCard label="Concluídos" value={`${progress.finished}/${progress.total}`} />
          <MetricCard label="Ao vivo" value={progress.live.toString()} />
          <MetricCard label="Pendentes" value={progress.pending.toString()} />
          <MetricCard label="Progresso" value={`${progress.percent}%`} />
        </section>

        <CourtManagement state={state} actions={actions} />

        <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-xl border border-white/10 bg-white/[0.055] p-4 shadow-[0_0_34px_rgba(132,204,22,0.08)] backdrop-blur">
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" aria-hidden="true" />
              <h2 className="text-xl font-black uppercase tracking-normal text-white">Classificados provisórios</h2>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              {qualified.map((row) => {
                const group = state.groups.find((item) => item.id === row.pair.groupId);
                return (
                  <div key={row.pair.id} className="rounded-md border border-emerald-300/25 bg-emerald-400/10 p-3">
                    <div className="text-xs font-black uppercase text-emerald-300">
                      Grupo {group?.number} · {row.position}º colocado
                    </div>
                    <div className="mt-1 font-black text-white">{row.pair.name}</div>
                    <div className="mt-1 text-xs font-bold text-emerald-100">
                      V {row.wins} · Saldo {row.balance > 0 ? "+" : ""}
                      {row.balance} · PF {row.pointsFor}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4">
            <CompactList title="Jogos em andamento" matches={liveMatches} state={state} empty="Nenhum jogo em andamento." />
            <CompactList title="Últimos resultados" matches={recentResults} state={state} empty="Nenhum resultado finalizado." />
            <CompactList title="Próximos jogos" matches={upcoming} state={state} empty="Todos os jogos foram finalizados." />
          </div>
        </section>

        <section className="rounded-xl border border-white/10 bg-white/[0.055] p-4 shadow-[0_0_34px_rgba(132,204,22,0.08)] backdrop-blur">
          <div className="mb-3 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" aria-hidden="true" />
            <h2 className="text-xl font-black uppercase tracking-normal text-white">Classificação geral das 40 duplas</h2>
          </div>
          <OverallRankingTable ranking={overallRanking} />
        </section>

        <section className="min-w-0 rounded-xl border border-white/10 bg-white/[0.055] p-3 shadow-[0_0_34px_rgba(132,204,22,0.08)] backdrop-blur sm:p-4">
          <div className="mb-3 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" aria-hidden="true" />
            <h2 className="text-xl font-black uppercase tracking-normal text-white">Mata-mata oficial</h2>
          </div>
          <div className="grid min-w-0 gap-3 xl:grid-cols-2">
            {bracket.map((match) => (
              <KnockoutAdminCard
                key={`${match.id}-${match.status}-${match.scoreA ?? "a"}-${match.scoreB ?? "b"}-${match.winnerId ?? "none"}`}
                match={match}
                state={state}
                onStart={actions.startKnockoutMatch}
                onSave={actions.saveKnockoutScore}
                onReopen={actions.reopenKnockoutMatch}
              />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          {state.groups.map((group) => {
            const ranking = calculateGroupRanking(state, group.id);
            const matches = getMatchesByGroup(state, group.id);
            const pairs = state.pairs.filter((pair) => pair.groupId === group.id).sort((a, b) => a.seed - b.seed);

            return (
              <details key={group.id} className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.055] shadow-[0_0_26px_rgba(255,255,255,0.04)]" open={group.id === "G1"}>
                <summary className={`cursor-pointer rounded-t-lg bg-gradient-to-r ${group.theme.gradient} p-4 text-white`}>
                  <span className="text-lg font-black uppercase tracking-normal">
                    Grupo {group.number} · {group.name}
                  </span>
                </summary>

                <div className="grid gap-4 p-4 xl:grid-cols-[380px_1fr]">
                  <div className="space-y-4">
                    <div>
                      <h3 className="mb-3 text-sm font-black uppercase text-slate-300">Editar duplas</h3>
                      <div className="space-y-2">
                        {pairs.map((pair) => (
                          <PairNameEditor key={pair.id} pair={pair} onSave={actions.updatePairName} />
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <h3 className="text-sm font-black uppercase text-slate-300">Desempate manual</h3>
                        <button
                          type="button"
                          onClick={() => actions.clearManualRank(group.id)}
                          className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-black uppercase text-slate-200"
                        >
                          Limpar
                        </button>
                      </div>
                      <div className="space-y-2">
                        {ranking.map((row) => (
                          <div key={row.pair.id} className="flex items-center justify-between gap-2 rounded-md border border-white/10 bg-black/30 p-2">
                            <span className="min-w-0 truncate text-sm font-black text-white">{row.position}º {row.pair.name}</span>
                            <div className="flex gap-1">
                              <RankButton label="Subir" onClick={() => actions.moveManualRank(group.id as GroupId, row.pair.id, -1)} icon="up" />
                              <RankButton label="Descer" onClick={() => actions.moveManualRank(group.id as GroupId, row.pair.id, 1)} icon="down" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <RankingTable ranking={ranking} compact />
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-black uppercase text-slate-300">Corrigir resultados</h3>
                    {matches.map((match) => (
                      <MatchRow
                        key={`${match.id}-${match.status}-${match.scoreA ?? "a"}-${match.scoreB ?? "b"}`}
                        state={state}
                        match={match}
                        actor="admin"
                        onStart={actions.startMatch}
                        onSave={actions.saveGroupScore}
                        onReopen={actions.reopenMatch}
                        dense
                      />
                    ))}
                  </div>
                </div>
              </details>
            );
          })}
        </section>

        <section className="rounded-xl border border-white/10 bg-white/[0.055] p-4 shadow-[0_0_34px_rgba(132,204,22,0.08)] backdrop-blur">
          <h2 className="mb-3 text-xl font-black uppercase tracking-normal text-white">Log de alterações</h2>
          <div className="max-h-96 space-y-2 overflow-auto">
            {state.logs.map((log) => (
              <div key={log.id} className="rounded-md border border-white/10 bg-black/30 p-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-lime-300 px-2 py-0.5 text-xs font-black uppercase text-slate-950">{log.actor}</span>
                  <span className="text-xs font-bold text-slate-400">{formatDateTime(log.at)}</span>
                </div>
                <div className="mt-1 font-bold text-slate-100">{log.message}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.055] p-4 shadow-[0_0_26px_rgba(132,204,22,0.06)] backdrop-blur">
      <div className="text-xs font-black uppercase text-slate-400">{label}</div>
      <div className="mt-2 text-4xl font-black text-white">{value}</div>
    </div>
  );
}

function CourtManagement({
  state,
  actions,
}: {
  state: TournamentState;
  actions: ReturnType<typeof useTournamentStore>["actions"];
}) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.055] p-4 shadow-[0_0_34px_rgba(132,204,22,0.08)] backdrop-blur">
      <div className="mb-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-normal text-white">Status das Quadras</h2>
          <p className="mt-1 text-sm font-bold text-slate-400">Ative/desative quadras e cadastre os links de transmissão por quadra.</p>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        {COURTS.map((court) => {
          const status = state.settings.courtStatuses[court.id] ?? "disabled";
          const streamUrl = state.settings.liveStreams[court.id] ?? "";

          return (
            <div key={court.id} className="rounded-lg border border-white/10 bg-black/35 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-black uppercase text-slate-400">{court.reserve ? "Reserva" : "Torneio"}</div>
                  <div className="mt-1 text-lg font-black uppercase text-white">{court.label}</div>
                  <div className="text-xs font-bold uppercase text-slate-400">{court.sponsor}</div>
                </div>
                <span className={`rounded-md px-2.5 py-1 text-xs font-black uppercase ${status === "active" ? "bg-emerald-500 text-white" : "bg-white/10 text-slate-200"}`}>
                  {getCourtStatusLabel(status)}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {(["active", "disabled", "unavailable"] as CourtStatus[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => actions.setCourtStatus(court.id, option)}
                    className={`h-10 rounded-md text-[11px] font-black uppercase ${status === option ? "bg-lime-300 text-slate-950" : "border border-white/10 bg-white/[0.04] text-slate-200"}`}
                  >
                    {getCourtStatusLabel(option)}
                  </button>
                ))}
              </div>

              <label className="mt-3 block">
                <span className="text-xs font-black uppercase text-slate-400">Link da transmissão</span>
                <input
                  value={streamUrl}
                  onChange={(event) => actions.updateLiveStream(court.id, event.target.value)}
                  placeholder="https://..."
                  className="mt-1 h-11 w-full rounded-md border border-white/10 bg-slate-950 px-3 text-sm font-bold text-white outline-none placeholder:text-slate-600 focus:border-lime-300"
                />
              </label>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CompactList({
  title,
  matches,
  state,
  empty,
}: {
  title: string;
  matches: Array<TournamentState["groupMatches"][number]>;
  state: TournamentState;
  empty: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.055] p-4 shadow-[0_0_26px_rgba(255,255,255,0.04)] backdrop-blur">
      <h2 className="mb-3 text-sm font-black uppercase text-slate-300">{title}</h2>
      <div className="space-y-2">
        {matches.length === 0 ? (
          <div className="rounded-md border border-white/10 bg-black/30 p-3 text-sm font-bold text-slate-400">{empty}</div>
        ) : (
          matches.map((match) => (
            <div key={match.id} className="rounded-md border border-white/10 bg-black/30 p-3 text-sm">
              <div className="font-black uppercase text-slate-400">
                Grupo {match.groupId.slice(1)} · Jogo {match.order}
              </div>
              <div className="mt-1 grid grid-cols-[1fr_auto_1fr] gap-2 font-bold text-white">
                <span>{getPairName(state, match.pairAId)}</span>
                <span className="text-lime-300">{match.status === "finished" ? `${match.scoreA} x ${match.scoreB}` : "x"}</span>
                <span className="text-right">{getPairName(state, match.pairBId)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function PairNameEditor({ pair, onSave }: { pair: Pair; onSave: (pairId: string, name: string) => void }) {
  const [name, setName] = useState(pair.name);

  return (
    <div className="flex gap-2">
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        className="h-11 min-w-0 flex-1 rounded-md border border-white/10 bg-slate-950 px-3 text-sm font-bold text-white outline-none focus:border-lime-300"
      />
      <button
        type="button"
        onClick={() => onSave(pair.id, name)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-lime-300 text-slate-950"
        title="Salvar nome"
      >
        <Save className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

function RankButton({ label, onClick, icon }: { label: string; onClick: () => void; icon: "up" | "down" }) {
  const Icon = icon === "up" ? ArrowUp : ArrowDown;

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-slate-100"
      title={label}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

function KnockoutAdminCard({
  match,
  state,
  onStart,
  onSave,
  onReopen,
}: {
  match: ReturnType<typeof getBracketView>[number];
  state: TournamentState;
  onStart: (matchId: string) => void;
  onSave: (matchId: string, scoreA: number | null, scoreB: number | null) => string | null;
  onReopen: (matchId: string) => void;
}) {
  const [scoreA, setScoreA] = useState(match.scoreA?.toString() ?? "");
  const [scoreB, setScoreB] = useState(match.scoreB?.toString() ?? "");
  const [error, setError] = useState<string | null>(null);
  const meta = getKnockoutMeta(match.id);
  const stage = KNOCKOUT_STAGES[match.phase];
  const courtGroup = state.groups.find((group) => group.id === meta.courtGroupId);
  const winner = match.winnerId ? state.pairs.find((pair) => pair.id === match.winnerId) : undefined;

  const parseScore = (value: string) => {
    if (value.trim() === "") return null;
    return Number(value);
  };

  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-white/10 bg-black/40 p-3 shadow-[0_0_24px_rgba(255,255,255,0.04)] sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="break-words text-xs font-black uppercase leading-snug text-slate-400">
            {stage.shortTitle} · {meta.code}
          </div>
          <div className="mt-1 break-words text-[11px] font-black uppercase text-lime-300">{courtGroup?.court ?? "Quadra"}</div>
        </div>
        <span className="inline-flex w-fit shrink-0 rounded-md bg-lime-300 px-2.5 py-1 text-xs font-black uppercase text-slate-950">
          {getKnockoutStatusLabel(match.status)}
        </span>
      </div>

      <div className="mt-3 grid gap-2">
        <KnockoutScoreLine
          label="Dupla 1"
          name={match.resolvedPairA?.name ?? match.labelA}
          value={scoreA}
          onChange={setScoreA}
        />
        <div className="flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-sm font-black uppercase text-lime-300">x</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>
        <KnockoutScoreLine
          label="Dupla 2"
          name={match.resolvedPairB?.name ?? match.labelB}
          value={scoreB}
          onChange={setScoreB}
        />
      </div>

      {winner && <div className="mt-2 rounded-md border border-emerald-300/25 bg-emerald-400/10 px-3 py-2 text-xs font-black uppercase text-emerald-200">Vencedor: {winner.name}</div>}
      {error && <div className="mt-2 rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-100">{error}</div>}

      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <button type="button" onClick={() => onStart(match.id)} className="h-12 rounded-md bg-amber-500 px-3 text-xs font-black uppercase text-white sm:h-10">
          Iniciar
        </button>
        <button
          type="button"
          onClick={() => setError(onSave(match.id, parseScore(scoreA), parseScore(scoreB)))}
          className="h-12 rounded-md bg-emerald-600 px-3 text-xs font-black uppercase text-white sm:h-10"
        >
          Salvar placar
        </button>
        <button type="button" onClick={() => onReopen(match.id)} className="h-12 rounded-md border border-white/10 bg-white/[0.04] px-3 text-xs font-black uppercase text-slate-100 sm:h-10">
          Corrigir
        </button>
      </div>
    </div>
  );
}

function KnockoutScoreLine({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_5rem] items-center gap-2 rounded-lg border border-white/10 bg-slate-950/80 p-2 sm:grid-cols-[minmax(0,1fr)_6rem]">
      <div className="min-w-0">
        <div className="text-[10px] font-black uppercase text-slate-500">{label}</div>
        <div className="mt-1 break-words text-sm font-black uppercase leading-tight text-white">{name}</div>
      </div>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        inputMode="numeric"
        className="h-14 w-full rounded-md border border-white/10 bg-black px-2 text-center text-2xl font-black text-white outline-none focus:border-lime-300 sm:h-12 sm:text-xl"
        placeholder="0"
      />
    </div>
  );
}
