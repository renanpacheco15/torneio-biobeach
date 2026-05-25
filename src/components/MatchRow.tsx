"use client";

import { Check, Play, RotateCcw, Save } from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "./StatusBadge";
import { cn } from "@/lib/utils";
import type { GroupMatch, TournamentState } from "@/lib/tournament/types";
import { getPairName } from "@/lib/tournament/calculations";

type MatchRowProps = {
  state: TournamentState;
  match: GroupMatch;
  locked?: boolean;
  actor: "admin" | "mesario";
  onStart: (matchId: string) => void;
  onSave: (matchId: string, scoreA: number | null, scoreB: number | null, actor: "admin" | "mesario") => string | null;
  onReopen: (matchId: string, actor: "admin" | "mesario") => void;
  dense?: boolean;
};

function parseScore(value: string): number | null {
  if (value.trim() === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function MatchRow({ state, match, locked = false, actor, onStart, onSave, onReopen, dense = false }: MatchRowProps) {
  const [scoreA, setScoreA] = useState(match.scoreA?.toString() ?? "");
  const [scoreB, setScoreB] = useState(match.scoreB?.toString() ?? "");
  const [error, setError] = useState<string | null>(null);

  const disabled = locked && actor === "mesario";
  const pairA = getPairName(state, match.pairAId);
  const pairB = getPairName(state, match.pairBId);

  const save = () => {
    const result = onSave(match.id, parseScore(scoreA), parseScore(scoreB), actor);
    setError(result);
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-slate-950 px-2.5 py-1 text-xs font-black uppercase text-white">Jogo {match.order}</span>
            <StatusBadge status={match.status} />
          </div>
          <div className={cn("mt-3 grid items-center gap-2 font-black text-slate-950", dense ? "text-sm" : "text-base sm:text-lg", "sm:grid-cols-[1fr_auto_1fr]")}>
            <span className="truncate">{pairA}</span>
            <span className="text-center text-slate-400">x</span>
            <span className="truncate sm:text-right">{pairB}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <input
              aria-label={`Placar de ${pairA}`}
              disabled={disabled}
              inputMode="numeric"
              min={0}
              value={scoreA}
              onChange={(event) => setScoreA(event.target.value.replace(/[^\d]/g, ""))}
              className="h-14 w-full rounded-md border-2 border-slate-200 bg-white text-center text-2xl font-black text-slate-950 outline-none focus:border-slate-950 sm:w-20"
            />
            <span className="text-2xl font-black text-slate-400">x</span>
            <input
              aria-label={`Placar de ${pairB}`}
              disabled={disabled}
              inputMode="numeric"
              min={0}
              value={scoreB}
              onChange={(event) => setScoreB(event.target.value.replace(/[^\d]/g, ""))}
              className="h-14 w-full rounded-md border-2 border-slate-200 bg-white text-center text-2xl font-black text-slate-950 outline-none focus:border-slate-950 sm:w-20"
            />
          </div>

          <div className="flex gap-2">
            {match.status === "pending" && (
              <button
                type="button"
                disabled={disabled}
                onClick={() => onStart(match.id)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-black uppercase text-white disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <Play className="h-4 w-4" aria-hidden="true" />
                Iniciar
              </button>
            )}

            {match.status === "finished" && (
              <button
                type="button"
                disabled={disabled}
                onClick={() => onReopen(match.id, actor)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-black uppercase text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Corrigir
              </button>
            )}

            <button
              type="button"
              disabled={disabled}
              onClick={save}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 text-sm font-black uppercase text-white disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {match.status === "finished" ? <Save className="h-4 w-4" aria-hidden="true" /> : <Check className="h-4 w-4" aria-hidden="true" />}
              Salvar
            </button>
          </div>
        </div>
      </div>

      {error && <div className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm font-bold text-red-700">{error}</div>}
      {disabled && <div className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-sm font-bold text-amber-800">Lançamentos travados pelo administrador.</div>}
    </div>
  );
}
