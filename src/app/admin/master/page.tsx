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
    <main className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4">
        <header className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Brand compact />
            <div className="flex flex-wrap gap-2">
              <Link href="/" className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-slate-200 px-4 text-sm font-black uppercase text-slate-800">
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                Início
              </Link>
              <button
                type="button"
                onClick={() => actions.setLocked(!state.settings.locked)}
                className={`inline-flex h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-black uppercase text-white ${state.settings.locked ? "bg-emerald-600" : "bg-amber-600"}`}
              >
                {state.settings.locked ? <Unlock className="h-4 w-4" aria-hidden="true" /> : <Lock className="h-4 w-4" aria-hidden="true" />}
                {state.settings.locked ? "Destravar" : "Travar"}
              </button>
              <button
                type="button"
                onClick={exportBackup}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-black uppercase text-white"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Backup
              </button>
              <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-black uppercase text-slate-800">
                <FileUp className="h-4 w-4" aria-hidden="true" />
                Importar
                <input type="file" accept="application/json" onChange={importBackup} className="sr-only" />
              </label>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Resetar todos os resultados do torneio?")) actions.resetResults();
                }}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-red-600 px-4 text-sm font-black uppercase text-white"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Resetar
              </button>
            </div>
          </div>
          {importError && <div className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm font-bold text-red-700">{importError}</div>}
        </header>

        <section className="grid gap-3 md:grid-cols-4">
          <MetricCard label="Concluídos" value={`${progress.finished}/${progress.total}`} />
          <MetricCard label="Ao vivo" value={progress.live.toString()} />
          <MetricCard label="Pendentes" value={progress.pending.toString()} />
          <MetricCard label="Progresso" value={`${progress.percent}%`} />
        </section>

        <CourtManagement state={state} actions={actions} />

        <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" aria-hidden="true" />
              <h2 className="text-xl font-black uppercase tracking-normal">Classificados provisórios</h2>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              {qualified.map((row) => {
                const group = state.groups.find((item) => item.id === row.pair.groupId);
                return (
                  <div key={row.pair.id} className="rounded-md border border-emerald-200 bg-emerald-50 p-3">
                    <div className="text-xs font-black uppercase text-emerald-700">
                      Grupo {group?.number} · {row.position}º colocado
                    </div>
                    <div className="mt-1 font-black text-emerald-950">{row.pair.name}</div>
                    <div className="mt-1 text-xs font-bold text-emerald-800">
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

        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" aria-hidden="true" />
            <h2 className="text-xl font-black uppercase tracking-normal">Classificação geral das 40 duplas</h2>
          </div>
          <OverallRankingTable ranking={overallRanking} />
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" aria-hidden="true" />
            <h2 className="text-xl font-black uppercase tracking-normal">Mata-mata oficial</h2>
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
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
              <details key={group.id} className="rounded-lg border border-slate-200 bg-white shadow-sm" open={group.id === "G1"}>
                <summary className={`cursor-pointer rounded-t-lg bg-gradient-to-r ${group.theme.gradient} p-4 text-white`}>
                  <span className="text-lg font-black uppercase tracking-normal">
                    Grupo {group.number} · {group.name}
                  </span>
                </summary>

                <div className="grid gap-4 p-4 xl:grid-cols-[380px_1fr]">
                  <div className="space-y-4">
                    <div>
                      <h3 className="mb-3 text-sm font-black uppercase text-slate-500">Editar duplas</h3>
                      <div className="space-y-2">
                        {pairs.map((pair) => (
                          <PairNameEditor key={pair.id} pair={pair} onSave={actions.updatePairName} />
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <h3 className="text-sm font-black uppercase text-slate-500">Desempate manual</h3>
                        <button
                          type="button"
                          onClick={() => actions.clearManualRank(group.id)}
                          className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-black uppercase text-slate-700"
                        >
                          Limpar
                        </button>
                      </div>
                      <div className="space-y-2">
                        {ranking.map((row) => (
                          <div key={row.pair.id} className="flex items-center justify-between gap-2 rounded-md border border-slate-200 p-2">
                            <span className="min-w-0 truncate text-sm font-black">{row.position}º {row.pair.name}</span>
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
                    <h3 className="text-sm font-black uppercase text-slate-500">Corrigir resultados</h3>
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

        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-xl font-black uppercase tracking-normal">Log de alterações</h2>
          <div className="max-h-96 space-y-2 overflow-auto">
            {state.logs.map((log) => (
              <div key={log.id} className="rounded-md border border-slate-200 p-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-slate-950 px-2 py-0.5 text-xs font-black uppercase text-white">{log.actor}</span>
                  <span className="text-xs font-bold text-slate-500">{formatDateTime(log.at)}</span>
                </div>
                <div className="mt-1 font-bold text-slate-800">{log.message}</div>
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
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-black uppercase text-slate-500">{label}</div>
      <div className="mt-2 text-4xl font-black text-slate-950">{value}</div>
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
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-black uppercase tracking-normal">Status das Quadras</h2>
          <p className="mt-1 text-sm font-bold text-slate-500">Ative/desative quadras e cadastre os links de transmissão por quadra.</p>
        </div>
        <div className="rounded-md bg-slate-950 px-3 py-2 text-xs font-black uppercase text-white">Quadra 9 Livre nasce desativada</div>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        {COURTS.map((court) => {
          const status = state.settings.courtStatuses[court.id] ?? "disabled";
          const streamUrl = state.settings.liveStreams[court.id] ?? "";

          return (
            <div key={court.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-black uppercase text-slate-500">{court.reserve ? "Reserva" : "Torneio"}</div>
                  <div className="mt-1 text-lg font-black uppercase text-slate-950">{court.label}</div>
                  <div className="text-xs font-bold uppercase text-slate-500">{court.sponsor}</div>
                </div>
                <span className={`rounded-md px-2.5 py-1 text-xs font-black uppercase ${status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
                  {getCourtStatusLabel(status)}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {(["active", "disabled", "unavailable"] as CourtStatus[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => actions.setCourtStatus(court.id, option)}
                    className={`h-10 rounded-md text-[11px] font-black uppercase ${status === option ? "bg-slate-950 text-white" : "border border-slate-200 bg-white text-slate-700"}`}
                  >
                    {getCourtStatusLabel(option)}
                  </button>
                ))}
              </div>

              <label className="mt-3 block">
                <span className="text-xs font-black uppercase text-slate-500">Link da transmissão</span>
                <input
                  value={streamUrl}
                  onChange={(event) => actions.updateLiveStream(court.id, event.target.value)}
                  placeholder="https://..."
                  className="mt-1 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm font-bold outline-none focus:border-slate-950"
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
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-black uppercase text-slate-500">{title}</h2>
      <div className="space-y-2">
        {matches.length === 0 ? (
          <div className="rounded-md bg-slate-50 p-3 text-sm font-bold text-slate-500">{empty}</div>
        ) : (
          matches.map((match) => (
            <div key={match.id} className="rounded-md border border-slate-200 p-3 text-sm">
              <div className="font-black uppercase text-slate-500">
                Grupo {match.groupId.slice(1)} · Jogo {match.order}
              </div>
              <div className="mt-1 grid grid-cols-[1fr_auto_1fr] gap-2 font-bold text-slate-950">
                <span>{getPairName(state, match.pairAId)}</span>
                <span className="text-slate-400">{match.status === "finished" ? `${match.scoreA} x ${match.scoreB}` : "x"}</span>
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
        className="h-11 min-w-0 flex-1 rounded-md border border-slate-200 px-3 text-sm font-bold outline-none focus:border-slate-950"
      />
      <button
        type="button"
        onClick={() => onSave(pair.id, name)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-slate-950 text-white"
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
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-800"
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
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-xs font-black uppercase text-slate-500">
            {stage.shortTitle} · {meta.code} · {courtGroup?.court ?? "Quadra"}
          </div>
          <div className="mt-2 grid gap-1 text-sm font-black text-slate-950">
            <span>{match.resolvedPairA?.name ?? match.labelA}</span>
            <span className="text-xs uppercase text-slate-400">x</span>
            <span>{match.resolvedPairB?.name ?? match.labelB}</span>
          </div>
        </div>
        <span className="inline-flex w-fit rounded-md bg-slate-950 px-2.5 py-1 text-xs font-black uppercase text-white">
          {getKnockoutStatusLabel(match.status)}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <input
          value={scoreA}
          onChange={(event) => setScoreA(event.target.value)}
          inputMode="numeric"
          className="h-12 rounded-md border border-slate-200 bg-white px-3 text-center text-xl font-black outline-none focus:border-slate-950"
          placeholder="0"
        />
        <span className="text-lg font-black uppercase text-slate-400">x</span>
        <input
          value={scoreB}
          onChange={(event) => setScoreB(event.target.value)}
          inputMode="numeric"
          className="h-12 rounded-md border border-slate-200 bg-white px-3 text-center text-xl font-black outline-none focus:border-slate-950"
          placeholder="0"
        />
      </div>

      {winner && <div className="mt-2 rounded-md bg-emerald-50 px-3 py-2 text-xs font-black uppercase text-emerald-700">Vencedor: {winner.name}</div>}
      {error && <div className="mt-2 rounded-md bg-red-50 px-3 py-2 text-xs font-bold text-red-700">{error}</div>}

      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <button type="button" onClick={() => onStart(match.id)} className="h-10 rounded-md bg-amber-500 px-3 text-xs font-black uppercase text-white">
          Iniciar
        </button>
        <button
          type="button"
          onClick={() => setError(onSave(match.id, parseScore(scoreA), parseScore(scoreB)))}
          className="h-10 rounded-md bg-emerald-600 px-3 text-xs font-black uppercase text-white"
        >
          Salvar placar
        </button>
        <button type="button" onClick={() => onReopen(match.id)} className="h-10 rounded-md border border-slate-300 bg-white px-3 text-xs font-black uppercase text-slate-800">
          Corrigir
        </button>
      </div>
    </div>
  );
}
